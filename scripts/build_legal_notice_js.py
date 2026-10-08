import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
data_path = os.path.join(ROOT, 'scripts', 'legal_data.json')
target_path = os.path.join(ROOT, 'assets', 'legal-notice.js')

with open(data_path, 'r', encoding='utf-8') as f:
    legal_data = json.load(f)

legal_data_json = json.dumps(legal_data, ensure_ascii=False, indent=2)

js_content = f"""/* ==========================================================================
   SOUNDTEST.PRO - Legal Notice & Neighbor Communication Letter Engine
   Modular Component: 3 Tones x 9 Jurisdictions/Languages x Pure-JS DOCX
   Zero External Dependencies · Full Dynamic Lazy Mount
   ========================================================================== */

(function (root, factory) {{
  if (typeof define === 'function' && define.amd) {{
    define([], factory);
  }} else if (typeof module === 'object' && module.exports) {{
    module.exports = factory();
  }} else {{
    root.SoundTestLegalNotice = factory();
  }}
}}(typeof self !== 'undefined' ? self : this, function () {{

  const LEGAL_DATA = {legal_data_json};

  // --- XML & ZIP Utilities (Pure JS OpenXML Docx Builder) ---
  function escapeXml(str) {{
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }}

  function makeCrcTable() {{
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {{
      let c = n;
      for (let k = 0; k < 8; k++) {{
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }}
      table[n] = c >>> 0;
    }}
    return table;
  }}
  const crcTable = makeCrcTable();

  function crc32(bytes) {{
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {{
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }}
    return (crc ^ (-1)) >>> 0;
  }}

  function buildZip(files) {{
    const encoder = new TextEncoder();
    const fileEntries = files.map(function (f) {{
      const dataBytes = typeof f.content === 'string' ? encoder.encode(f.content) : new Uint8Array(f.content);
      const nameBytes = encoder.encode(f.name);
      const fileCrc = crc32(dataBytes);
      return {{
        name: f.name,
        nameBytes: nameBytes,
        data: dataBytes,
        crc: fileCrc,
        size: dataBytes.length
      }};
    }});

    const now = new Date();
    const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xFFFF;
    const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xFFFF;

    let totalSize = 0;
    for (let i = 0; i < fileEntries.length; i++) {{
      totalSize += 30 + fileEntries[i].nameBytes.length + fileEntries[i].size;
      totalSize += 46 + fileEntries[i].nameBytes.length;
    }}
    totalSize += 22;

    const buf = new Uint8Array(totalSize);
    const view = new DataView(buf.buffer);
    let pos = 0;

    const localOffsets = [];
    for (let j = 0; j < fileEntries.length; j++) {{
      const f = fileEntries[j];
      localOffsets.push(pos);
      view.setUint32(pos, 0x04034b50, true); pos += 4;
      view.setUint16(pos, 20, true); pos += 2;
      view.setUint16(pos, 0x0800, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, dosTime, true); pos += 2;
      view.setUint16(pos, dosDate, true); pos += 2;
      view.setUint32(pos, f.crc, true); pos += 4;
      view.setUint32(pos, f.size, true); pos += 4;
      view.setUint32(pos, f.size, true); pos += 4;
      view.setUint16(pos, f.nameBytes.length, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      buf.set(f.nameBytes, pos); pos += f.nameBytes.length;
      buf.set(f.data, pos); pos += f.data.length;
    }}

    const cdOffset = pos;
    for (let k = 0; k < fileEntries.length; k++) {{
      const cf = fileEntries[k];
      view.setUint32(pos, 0x02014b50, true); pos += 4;
      view.setUint16(pos, 20, true); pos += 2;
      view.setUint16(pos, 20, true); pos += 2;
      view.setUint16(pos, 0x0800, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, dosTime, true); pos += 2;
      view.setUint16(pos, dosDate, true); pos += 2;
      view.setUint32(pos, cf.crc, true); pos += 4;
      view.setUint32(pos, cf.size, true); pos += 4;
      view.setUint32(pos, cf.size, true); pos += 4;
      view.setUint16(pos, cf.nameBytes.length, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint32(pos, 0, true); pos += 4;
      view.setUint32(pos, localOffsets[k], true); pos += 4;
      buf.set(cf.nameBytes, pos); pos += cf.nameBytes.length;
    }}
    const cdSize = pos - cdOffset;

    view.setUint32(pos, 0x06054b50, true); pos += 4;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, fileEntries.length, true); pos += 2;
    view.setUint16(pos, fileEntries.length, true); pos += 2;
    view.setUint32(pos, cdSize, true); pos += 4;
    view.setUint32(pos, cdOffset, true); pos += 4;
    view.setUint16(pos, 0, true); pos += 2;

    return buf;
  }}

  function buildDocxBlob(notice) {{
    const contentTypesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
      '</Types>';

    const relsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>';

    const docRelsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>';

    const stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:docDefaults><w:rPrDefault><w:rPr>' +
      '<w:rFonts w:ascii="Calibri" w:eastAsia="SimSun" w:hAnsi="Calibri" w:cs="Calibri"/>' +
      '<w:sz w:val="22"/><w:szCs w:val="22"/>' +
      '</w:rPr></w:rPrDefault></w:docDefaults>' +
      '</w:styles>';

    const paragraphs = (notice.body || '').split(/\\n\\s*\\n/).map(function (pText) {{
      const lines = pText.split('\\n').map(function (l) {{
        return '<w:r><w:t xml:space="preserve">' + escapeXml(l) + '</w:t></w:r>';
      }}).join('<w:r><w:br/></w:r>');
      return '<w:p><w:pPr><w:spacing w:line="320" w:lineRule="auto" w:after="160"/></w:pPr>' + lines + '</w:p>';
    }}).join('');

    let articlesXml = '';
    if (Array.isArray(notice.articles) && notice.articles.length) {{
      const artLines = notice.articles.map(function (art) {{
        return '<w:p><w:pPr><w:spacing w:after="80"/><w:ind w:left="240"/></w:pPr>' +
          '<w:r><w:rPr><w:b/><w:color w:val="1E293B"/></w:rPr><w:t xml:space="preserve">§ </w:t></w:r>' +
          '<w:r><w:rPr><w:color w:val="334155"/></w:rPr><w:t xml:space="preserve">' + escapeXml(art) + '</w:t></w:r></w:p>';
      }}).join('');
      articlesXml = '<w:p><w:pPr><w:spacing w:before="240" w:after="100"/></w:pPr>' +
        '<w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr>' +
        '<w:t>' + escapeXml(notice.legalHeader || 'Statutory Provisions Cited') + '</w:t></w:r></w:p>' +
        artLines;
    }}

    const telemetryTableXml = '<w:tbl>' +
      '<w:tblPr><w:tblW w:w="9200" w:type="dxa"/>' +
      '<w:tblBorders>' +
      '<w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>' +
      '<w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>' +
      '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>' +
      '<w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>' +
      '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>' +
      '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>' +
      '</w:tblBorders></w:tblPr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.thMetric || 'Acoustic Metric') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.thValue || 'Recorded Value') + '</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.lblPeak || 'Peak Lmax') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="DC2626"/></w:rPr><w:t>' + escapeXml(notice.peakDb || '72.4') + ' dB(A)</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.lblAvg || 'Equivalent Leq') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="2563EB"/></w:rPr><w:t>' + escapeXml(notice.avgDb || '58.6') + ' dB(A)</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.lblTime || 'Monitored Window') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.timeRange || '23:30 - 02:00') + '</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.lblHash || 'SHA-256 Fingerprint') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="475569"/></w:rPr><w:t>' + escapeXml(notice.evidenceId || 'STP-VERIFIED-HASH') + '</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '</w:tbl>';

    const documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:body>' +
      '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="80"/></w:pPr>' +
      '<w:r><w:rPr><w:sz w:val="20"/><w:color w:val="64748B"/><w:rFonts w:ascii="Arial Black" w:hAnsi="Arial Black"/></w:rPr><w:t>SOUNDTEST.PRO · CIVILIAN ACOUSTIC EVIDENCE CHAIN</w:t></w:r></w:p>' +
      '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="280"/></w:pPr>' +
      '<w:r><w:rPr><w:b/><w:sz w:val="34"/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.title) + '</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblRecipient || 'Recipient: ') + '</w:t></w:r><w:r><w:t>' + escapeXml(notice.recipient) + '</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblSender || 'Sender: ') + '</w:t></w:r><w:r><w:t>' + escapeXml(notice.sender) + '</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblDate || 'Date: ') + '</w:t></w:r><w:r><w:t>' + escapeXml(notice.date) + '</w:t></w:r></w:p>' +
      '<w:p><w:pPr><w:spacing w:before="160" w:after="160"/></w:pPr><w:r><w:rPr><w:color w:val="CBD5E1"/></w:rPr><w:t>──────────────────────────────────────────────────────────</w:t></w:r></w:p>' +
      paragraphs +
      '<w:p><w:pPr><w:spacing w:before="240" w:after="100"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.telemetryHeader || 'Acoustic Telemetry Log') + '</w:t></w:r></w:p>' +
      telemetryTableXml +
      articlesXml +
      '<w:p><w:pPr><w:spacing w:before="360" w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblSign || 'Signature: ') + '____________________________</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblSignDate || 'Date: ') + escapeXml(notice.date) + '</w:t></w:r></w:p>' +
      '<w:p><w:pPr><w:spacing w:before="300"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="94A3B8"/></w:rPr><w:t>' + escapeXml(notice.disclaimer || 'Non-certified civilian documentation record for dispute resolution.') + '</w:t></w:r></w:p>' +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>' +
      '</w:body></w:document>';

    const zipBytes = buildZip([
      {{ name: '[Content_Types].xml', content: contentTypesXml }},
      {{ name: '_rels/.rels', content: relsXml }},
      {{ name: 'word/_rels/document.xml.rels', content: docRelsXml }},
      {{ name: 'word/styles.xml', content: stylesXml }},
      {{ name: 'word/document.xml', content: documentXml }}
    ]);

    return typeof Blob !== 'undefined'
      ? new Blob([zipBytes], {{ type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }})
      : zipBytes;
  }}

  // --- UI Component & Runtime State ---
  let modalEl = null;
  let currentLang = 'zh';
  let currentTone = 'gentle';
  let selectedScenarios = new Set(['footstep']);
  let userTier = 'free'; // 'free' | 'single' | 'pro'
  let currentRecord = null;
  let upgradeCallback = null;

  function ensureModal() {{
    if (modalEl) return modalEl;

    let el = document.getElementById('legalNoticeModal');
    if (!el) {{
      el = document.createElement('div');
      el.id = 'legalNoticeModal';
      el.className = 'legal-notice-modal';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-labelledby', 'lnmTitle');
      el.innerHTML = `
      <div class="legal-notice-card">
        <div class="lnm-header">
          <div class="lnm-title-wrap">
            <div class="lnm-badge-icon">⚖️</div>
            <div>
              <h3 class="lnm-title" id="lnmTitle">邻里沟通函与法定催告函生成器</h3>
              <p class="lnm-subtitle" id="lnmSubtitle">基于真实声学存证数据 · 3种沟通语气 · 9国/地区法律条文智能援引</p>
            </div>
          </div>
          <button type="button" class="lnm-close-btn" id="lnmCloseBtn" aria-label="Close">×</button>
        </div>

        <div class="lnm-body">
          <!-- Section: Tone Selection -->
          <div class="lnm-tone-section">
            <div class="lnm-section-label">
              <span id="lnmToneLabel">沟通语气策略</span>
              <span id="lnmToneHint" style="font-size:10.5px;color:#64748b;font-weight:normal;">阶梯式维权：温和提醒 → 理性交涉 → 严正催告</span>
            </div>
            <div class="lnm-tone-grid">
              <!-- Gentle Card -->
              <div class="lnm-tone-card tone-gentle active" data-tone="gentle">
                <div class="lnm-tone-header">
                  <span>🌱</span>
                  <span id="lnmToneGentleTitle">温和友善提醒</span>
                  <span class="lnm-free-badge" style="font-size:9.5px;background:rgba(34,197,94,0.2);color:#4ade80;padding:1px 6px;border-radius:10px;margin-left:auto;">免费开放</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneGentleDesc">以和为贵，初次提醒，理解可能不知情，倡导友好邻里互助</div>
              </div>
              <!-- Firm Card -->
              <div class="lnm-tone-card tone-firm" data-tone="firm">
                <div class="lnm-tone-header">
                  <span>⚖️</span>
                  <span id="lnmToneFirmTitle">正式理性交涉</span>
                  <span class="lnm-lock-badge" id="lnmLockFirm" style="font-size:9.5px;background:rgba(59,130,246,0.2);color:#60a5fa;padding:1px 6px;border-radius:10px;margin-left:auto;">🔒 PRO</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneFirmDesc">多次沟通未果，摆出客观声学超标数据，明确作息干扰与底线</div>
              </div>
              <!-- Strict Card -->
              <div class="lnm-tone-card tone-strict" data-tone="strict">
                <div class="lnm-tone-header">
                  <span>🛑</span>
                  <span id="lnmToneStrictTitle">严正法务催告</span>
                  <span class="lnm-lock-badge" id="lnmLockStrict" style="font-size:9.5px;background:rgba(239,68,68,0.2);color:#f87171;padding:1px 6px;border-radius:10px;margin-left:auto;">🔒 PRO</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneStrictDesc">正式法律告知书格式，援引法定侵权法规，设定整改限期与通牒</div>
              </div>
            </div>
          </div>

          <!-- Section: Parameters Grid -->
          <div class="lnm-form-grid">
            <div class="lnm-field">
              <label id="lnmLblRecipient" for="lnmInputRecipient">受函方 / 邻居称呼</label>
              <input type="text" class="lnm-input" id="lnmInputRecipient" value="楼上邻居您好" placeholder="如：402室邻居">
            </div>
            <div class="lnm-field">
              <label id="lnmLblSender" for="lnmInputSender">发函方 / 您的署名</label>
              <input type="text" class="lnm-input" id="lnmInputSender" value="楼下邻居" placeholder="如：302室住户">
            </div>
            <div class="lnm-field">
              <label id="lnmLblJurisdiction" for="lnmSelectJurisdiction">法律法域与语言 (9国标准)</label>
              <select class="lnm-select" id="lnmSelectJurisdiction"></select>
            </div>
          </div>

          <!-- Section: Scenario Chips -->
          <div class="lnm-scenarios-section">
            <div class="lnm-section-label" id="lnmScenarioLabel">常见噪音类型 (快速勾选)</div>
            <div class="lnm-chips-wrap" id="lnmChipsWrap"></div>
          </div>

          <!-- Section: Live Preview Box -->
          <div class="lnm-preview-wrap">
            <div class="lnm-section-label" style="display:flex;justify-content:space-between;">
              <span id="lnmPreviewLabel">文书实时预览 (Live Preview)</span>
              <span id="lnmPreviewHint" style="font-size:10.5px;color:#64748b;font-weight:normal;">所见即所得 · 自动排版</span>
            </div>
            <div class="lnm-preview-box" id="lnmPreviewBox">
              <div class="lnm-preview-header">
                <div style="font-size:10px;letter-spacing:0.1em;color:#64748b;margin-bottom:2px;">SOUNDTEST.PRO · CIVILIAN ACOUSTIC EVIDENCE CHAIN</div>
                <div class="lnm-preview-title" id="lnmDocTitle">民事侵害生活安宁停止妨害催告函与法律告知书</div>
                <div class="lnm-preview-meta">
                  <span id="lnmMetaRecipient">受函方：楼上邻居您好</span>
                  <span id="lnmMetaSender">发函方：楼下邻居</span>
                  <span id="lnmMetaDate">日期：2026-10-08</span>
                </div>
              </div>
              <div class="lnm-preview-body" id="lnmDocBody"></div>

              <!-- Acoustic Telemetry Badge Row -->
              <div class="lnm-telemetry-badge-row">
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblPeak">实测峰值 Lmax</span>
                  <span class="lnm-tb-val val-red" id="lnmValPeak">-- dB</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblAvg">等效均值 LAeq</span>
                  <span class="lnm-tb-val val-blue" id="lnmValAvg">-- dB</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblTime">监测时段</span>
                  <span class="lnm-tb-val val-cyan" id="lnmValTime" style="font-size:11.5px;">--:-- - --:--</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblHash">数字存证指纹</span>
                  <span class="lnm-tb-val" id="lnmValHash" style="font-size:10px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">SHA-256...</span>
                </div>
              </div>

              <!-- Cited Articles Box -->
              <div class="lnm-articles-box" id="lnmArticlesBox">
                <div class="lnm-articles-title" id="lnmArticlesTitle">
                  <span>⚖️</span>
                  <span id="lnmArticlesHeaderTitle">法定法规依据与法律条文 (Statutory Provisions)</span>
                </div>
                <div id="lnmArticlesList"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="lnm-footer">
          <div class="lnm-footer-left">
            <button type="button" class="lnm-btn lnm-btn-cancel" id="lnmBtnCancel">关闭</button>
          </div>
          <div class="lnm-footer-right">
            <button type="button" class="lnm-btn lnm-btn-copy" id="lnmBtnCopy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span id="lnmBtnCopyText">复制文本</span>
            </button>
            <button type="button" class="lnm-btn lnm-btn-docx" id="lnmBtnDocx">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span id="lnmBtnDocxText">导出 Word (.docx)</span>
              <span id="lnmDocxLockBadge" style="display:none;font-size:9.5px;background:rgba(255,255,255,0.25);padding:1px 5px;border-radius:6px;margin-left:4px;">🔒 PRO</span>
            </button>
          </div>
        </div>
      </div>
      `;
      document.body.appendChild(el);
      bindModalEvents(el);
    }}
    modalEl = el;
    return modalEl;
  }}

  function bindModalEvents(el) {{
    // Close button & Cancel button
    const closeBtn = el.querySelector('#lnmCloseBtn');
    const cancelBtn = el.querySelector('#lnmBtnCancel');
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    // Click backdrop to close
    el.onclick = function (e) {{
      if (e.target === el) closeModal();
    }};

    // ESC key to close
    document.addEventListener('keydown', function (e) {{
      if (e.key === 'Escape' && el.classList.contains('show')) {{
        closeModal();
      }}
    }});

    // Tone cards
    const toneCards = el.querySelectorAll('.lnm-tone-card');
    toneCards.forEach(function (card) {{
      card.onclick = function () {{
        const toneKey = card.getAttribute('data-tone');
        if (userTier === 'free' && toneKey !== 'gentle') {{
          handleUpgradeTrigger('tone_' + toneKey);
          return;
        }}
        currentTone = toneKey;
        toneCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        renderPreview();
      }};
    }});

    // Jurisdiction select
    const select = el.querySelector('#lnmSelectJurisdiction');
    if (select) {{
      select.onchange = function () {{
        currentLang = select.value;
        const conf = LEGAL_DATA[currentLang];
        if (conf && conf.ui) {{
          const inputRec = el.querySelector('#lnmInputRecipient');
          const inputSnd = el.querySelector('#lnmInputSender');
          if (inputRec && conf.ui.recipientDefault) inputRec.value = conf.ui.recipientDefault;
          if (inputSnd && conf.ui.senderDefault) inputSnd.value = conf.ui.senderDefault;
        }}
        renderFullUi();
        renderPreview();
      }};
    }}

    // Inputs live update
    const recInput = el.querySelector('#lnmInputRecipient');
    const sndInput = el.querySelector('#lnmInputSender');
    if (recInput) recInput.oninput = renderPreview;
    if (sndInput) sndInput.oninput = renderPreview;

    // Copy button
    const copyBtn = el.querySelector('#lnmBtnCopy');
    if (copyBtn) {{
      copyBtn.onclick = function () {{
        const docData = compileDocumentData();
        const fullText = buildPlainText(docData);
        if (navigator.clipboard && navigator.clipboard.writeText) {{
          navigator.clipboard.writeText(fullText).then(function () {{
            showNoticeToast(LEGAL_DATA[currentLang]?.ui?.copied || '✓ Text copied to clipboard');
          }}).catch(function () {{
            fallbackCopy(fullText);
          }});
        }} else {{
          fallbackCopy(fullText);
        }}
      }};
    }}

    // DOCX Export button
    const docxBtn = el.querySelector('#lnmBtnDocx');
    if (docxBtn) {{
      docxBtn.onclick = function () {{
        if (userTier === 'free') {{
          handleUpgradeTrigger('docx_export');
          return;
        }}
        const docData = compileDocumentData();
        const blob = buildDocxBlob(docData);
        const fileName = (docData.title || 'SoundTest-Dispute-Notice').replace(/[\\\\/:*?"<>|\\s]+/g, '_') + '.docx';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showNoticeToast(currentLang === 'zh' ? '✓ Word 格式交涉函导出成功' : '✓ Word (.docx) document exported');
      }};
    }}
  }}

  function fallbackCopy(text) {{
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {{
      document.execCommand('copy');
      showNoticeToast(LEGAL_DATA[currentLang]?.ui?.copied || '✓ Copied to clipboard');
    }} catch (err) {{
      alert('Failed to copy');
    }}
    document.body.removeChild(ta);
  }}

  function showNoticeToast(msg) {{
    if (typeof window.toast === 'function') {{
      window.toast(msg, 'info', 3500);
      return;
    }}
    let toastEl = document.getElementById('lnmToast');
    if (!toastEl) {{
      toastEl = document.createElement('div');
      toastEl.id = 'lnmToast';
      toastEl.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;z-index:10010;box-shadow:0 8px 24px rgba(0,0,0,0.5);transition:opacity 0.2s;';
      document.body.appendChild(toastEl);
    }}
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    toastEl.style.opacity = '1';
    setTimeout(function () {{
      toastEl.style.opacity = '0';
      setTimeout(() => {{ toastEl.style.display = 'none'; }}, 200);
    }}, 3000);
  }}

  function handleUpgradeTrigger(reason) {{
    if (typeof upgradeCallback === 'function') {{
      upgradeCallback(reason, currentTone);
      return;
    }}
    if (typeof window.openProUpgradeModal === 'function') {{
      window.openProUpgradeModal();
      return;
    }}
    if (typeof window.openWeChatPayModal === 'function') {{
      window.openWeChatPayModal('single');
      return;
    }}
    alert('PRO Feature: Upgrading unlocks Formal Notices, Cease & Desist Letters, and Word (.docx) Exports.');
  }}

  function renderFullUi() {{
    const el = ensureModal();
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.zh;
    const ui = conf.ui || {{}};

    // Titles
    const tTitle = el.querySelector('#lnmTitle');
    const tSub = el.querySelector('#lnmSubtitle');
    if (tTitle) tTitle.textContent = ui.title || '邻里沟通函与法定催告函生成器';
    if (tSub) tSub.textContent = ui.subtitle || '基于真实声学存证数据 · 3种沟通语气 · 9国/地区法律条文智能援引';

    // Tone labels
    const tLbl = el.querySelector('#lnmToneLabel');
    const tHnt = el.querySelector('#lnmToneHint');
    if (tLbl) tLbl.textContent = ui.toneLabel || '沟通语气策略';
    if (tHnt) tHnt.textContent = ui.toneHint || '阶梯式维权：温和提醒 → 理性交涉 → 严正催告';

    // Tone cards text
    const tgT = el.querySelector('#lnmToneGentleTitle');
    const tgD = el.querySelector('#lnmToneGentleDesc');
    const tfT = el.querySelector('#lnmToneFirmTitle');
    const tfD = el.querySelector('#lnmToneFirmDesc');
    const tsT = el.querySelector('#lnmToneStrictTitle');
    const tsD = el.querySelector('#lnmToneStrictDesc');
    if (tgT) tgT.textContent = ui.toneGentle || '温和友善提醒';
    if (tgD) tgD.textContent = ui.toneGentleDesc || '';
    if (tfT) tfT.textContent = ui.toneFirm || '正式理性交涉';
    if (tfD) tfD.textContent = ui.toneFirmDesc || '';
    if (tsT) tsT.textContent = ui.toneStrict || '严正法务催告';
    if (tsD) tsD.textContent = ui.toneStrictDesc || '';

    // Form labels
    const lRec = el.querySelector('#lnmLblRecipient');
    const lSnd = el.querySelector('#lnmLblSender');
    const lJur = el.querySelector('#lnmLblJurisdiction');
    const lScn = el.querySelector('#lnmScenarioLabel');
    if (lRec) lRec.textContent = ui.lblRecipient || '受函方';
    if (lSnd) lSnd.textContent = ui.lblSender || '发函方';
    if (lJur) lJur.textContent = ui.lblJurisdiction || '法律法域与语言';
    if (lScn) lScn.textContent = ui.scenarioLabel || '常见噪音类型';

    // Telemetry labels
    const lp = el.querySelector('#lnmLblPeak');
    const la = el.querySelector('#lnmLblAvg');
    const lt = el.querySelector('#lnmLblTime');
    const lh = el.querySelector('#lnmLblHash');
    if (lp) lp.textContent = ui.lblPeak || '实测峰值 Lmax';
    if (la) la.textContent = ui.lblAvg || '等效均值 LAeq';
    if (lt) lt.textContent = ui.lblTime || '监测时段';
    if (lh) lh.textContent = ui.lblHash || '数字存证指纹';

    // Button labels
    const bCp = el.querySelector('#lnmBtnCopyText');
    const bDx = el.querySelector('#lnmBtnDocxText');
    const bCn = el.querySelector('#lnmBtnCancel');
    if (bCp) bCp.textContent = ui.btnCopy || '复制文本';
    if (bDx) bDx.textContent = ui.btnDocx || '导出 Word (.docx)';
    if (bCn) bCn.textContent = ui.btnClose || '关闭';

    // Populate Jurisdiction select options if empty
    const select = el.querySelector('#lnmSelectJurisdiction');
    if (select && select.options.length === 0) {{
      Object.keys(LEGAL_DATA).forEach(function (k) {{
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = LEGAL_DATA[k].name || k;
        if (k === currentLang) opt.selected = true;
        select.appendChild(opt);
      }});
    }} else if (select) {{
      select.value = currentLang;
    }}

    // Populate scenario chips
    const chipsWrap = el.querySelector('#lnmChipsWrap');
    if (chipsWrap) {{
      chipsWrap.innerHTML = '';
      const scMap = conf.scenarios || {{}};
      Object.keys(scMap).forEach(function (k) {{
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'lnm-chip' + (selectedScenarios.has(k) ? ' active' : '');
        chip.setAttribute('data-scenario-key', k);
        chip.innerHTML = '<span>' + (getScenarioIcon(k)) + '</span><span>' + escapeXml(scMap[k]) + '</span>';
        chip.onclick = function () {{
          if (selectedScenarios.has(k)) {{
            if (selectedScenarios.size > 1) selectedScenarios.delete(k);
          }} else {{
            selectedScenarios.add(k);
          }}
          chip.classList.toggle('active', selectedScenarios.has(k));
          renderPreview();
        }};
        chipsWrap.appendChild(chip);
      }});
    }}

    // Lock badges depending on user tier
    syncTierUi(el);
  }}

  function getScenarioIcon(k) {{
    const icons = {{
      footstep: '👣',
      music: '🔊',
      dragging: '🪑',
      renovation: '🔨',
      pet: '🐕',
      party: '🎉'
    }};
    return icons[k] || '⚠️';
  }}

  function syncTierUi(el) {{
    const isFree = (userTier === 'free');
    const lockFirm = el.querySelector('#lnmLockFirm');
    const lockStrict = el.querySelector('#lnmLockStrict');
    const docxBadge = el.querySelector('#lnmDocxLockBadge');

    if (lockFirm) lockFirm.style.display = isFree ? 'inline' : 'none';
    if (lockStrict) lockStrict.style.display = isFree ? 'inline' : 'none';
    if (docxBadge) docxBadge.style.display = isFree ? 'inline' : 'none';

    // Tone cards
    const cardFirm = el.querySelector('.lnm-tone-card[data-tone="firm"]');
    const cardStrict = el.querySelector('.lnm-tone-card[data-tone="strict"]');
    if (cardFirm) cardFirm.classList.toggle('lnm-locked-card', isFree);
    if (cardStrict) cardStrict.classList.toggle('lnm-locked-card', isFree);
  }}

  function compileDocumentData() {{
    const el = ensureModal();
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.zh;
    const toneObj = conf.tones?.[currentTone] || conf.tones?.gentle || {{}};
    const ui = conf.ui || {{}};

    const rec = currentRecord || {{}};
    const peakDb = rec.peakDb || '72.4';
    const avgDb = rec.avgDb || '58.6';
    const timeRange = rec.timeRange || (formatCurrentTimeRange());
    const evidenceId = rec.evidenceId || ('STP-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    const location = rec.location || 'Residential Unit';
    const dateStr = rec.date || (new Date().toISOString().slice(0, 10));

    const recipientInput = el.querySelector('#lnmInputRecipient');
    const senderInput = el.querySelector('#lnmInputSender');
    const recipient = (recipientInput?.value || ui.recipientDefault || '楼上邻居').trim();
    const sender = (senderInput?.value || ui.senderDefault || '楼下邻居').trim();

    // Noise types string
    const scMap = conf.scenarios || {{}};
    const noiseList = Array.from(selectedScenarios).map(k => scMap[k] || k);
    const noiseTypes = noiseList.join('、') || '生活撞击声';

    // Replace template variables
    let bodyText = toneObj.body || '';
    bodyText = bodyText.replace(/\\{{NOISE_TYPES\\}}/g, noiseTypes)
      .replace(/\\{{PEAK\\}}/g, peakDb)
      .replace(/\\{{LEQ\\}}/g, avgDb)
      .replace(/\\{{TIME_RANGE\\}}/g, timeRange)
      .replace(/\\{{EVIDENCE_ID\\}}/g, evidenceId)
      .replace(/\\{{RECIPIENT\\}}/g, recipient)
      .replace(/\\{{SENDER\\}}/g, sender)
      .replace(/\\{{LOCATION\\}}/g, location)
      .replace(/\\{{DATE\\}}/g, dateStr);

    return {{
      title: toneObj.title || 'CIVILIAN DISPUTE NOTICE',
      recipient: recipient,
      sender: sender,
      date: dateStr,
      location: location,
      peakDb: peakDb,
      avgDb: avgDb,
      timeRange: timeRange,
      evidenceId: evidenceId,
      body: bodyText,
      articles: conf.laws || [],
      lblRecipient: ui.lblRecipient || '受函方：',
      lblSender: ui.lblSender || '发函方：',
      lblDate: ui.date || '日期：',
      lblPeak: ui.lblPeak || '实测峰值 Lmax',
      lblAvg: ui.lblAvg || '等效均值 LAeq',
      lblTime: ui.lblTime || '监测时段',
      lblHash: ui.lblHash || '数字存证指纹',
      thMetric: ui.thMetric || '声学监测指标 (Acoustic Metric)',
      thValue: ui.thValue || '实测读数 (Recorded Value)',
      telemetryHeader: ui.telemetryHeader || '【现场声学测量数据证据表 / Telemetry Log】',
      legalHeader: ui.legalHeader || '【法定法规条文与法律依据 / Statutory Provisions Cited】',
      lblSign: ui.lblSign || '通知方签署 (Signature): ',
      lblSignDate: ui.lblSignDate || '签署日期 (Date): ',
      disclaimer: ui.disclaimer || '注：本函及所附声学数据为民事自查事实记录，用于敦促沟通与民事纠纷事实举证。'
    }};
  }}

  function formatCurrentTimeRange() {{
    const d = new Date();
    const endH = String(d.getHours()).padStart(2, '0');
    const endM = String(d.getMinutes()).padStart(2, '0');
    const startD = new Date(d.getTime() - 90 * 60000);
    const startH = String(startD.getHours()).padStart(2, '0');
    const startM = String(startD.getMinutes()).padStart(2, '0');
    return `${{startH}}:${{startM}} - ${{endH}}:${{endM}}`;
  }}

  function renderPreview() {{
    const el = ensureModal();
    const doc = compileDocumentData();

    const tEl = el.querySelector('#lnmDocTitle');
    const bEl = el.querySelector('#lnmDocBody');
    const rEl = el.querySelector('#lnmMetaRecipient');
    const sEl = el.querySelector('#lnmMetaSender');
    const dEl = el.querySelector('#lnmMetaDate');
    const vpEl = el.querySelector('#lnmValPeak');
    const vaEl = el.querySelector('#lnmValAvg');
    const vtEl = el.querySelector('#lnmValTime');
    const vhEl = el.querySelector('#lnmValHash');
    const artList = el.querySelector('#lnmArticlesList');
    const artTitle = el.querySelector('#lnmArticlesHeaderTitle');

    if (tEl) tEl.textContent = doc.title;
    if (bEl) bEl.textContent = doc.body;
    if (rEl) rEl.textContent = (doc.lblRecipient || '受函方：') + ' ' + doc.recipient;
    if (sEl) sEl.textContent = (doc.lblSender || '发函方：') + ' ' + doc.sender;
    if (dEl) dEl.textContent = (doc.lblDate || '日期：') + ' ' + doc.date;

    if (vpEl) vpEl.textContent = doc.peakDb + ' dB(A)';
    if (vaEl) vaEl.textContent = doc.avgDb + ' dB(A)';
    if (vtEl) vtEl.textContent = doc.timeRange;
    if (vhEl) {{
      vhEl.textContent = doc.evidenceId;
      vhEl.title = doc.evidenceId;
    }}

    if (artTitle) artTitle.textContent = doc.legalHeader;
    if (artList) {{
      artList.innerHTML = doc.articles.map(function (art) {{
        return '<div style="margin-top:6px;padding-left:10px;border-left:2px solid rgba(251,191,36,0.5);color:#cbd5e1;">§ ' + escapeXml(art) + '</div>';
      }}).join('');
    }}
  }}

  function buildPlainText(doc) {{
    const sep = '──────────────────────────────────────────────────────────';
    let text = 'SOUNDTEST.PRO · CIVILIAN ACOUSTIC EVIDENCE CHAIN\\n\\n' +
      doc.title + '\\n\\n' +
      (doc.lblRecipient || 'Recipient: ') + doc.recipient + '\\n' +
      (doc.lblSender || 'Sender: ') + doc.sender + '\\n' +
      (doc.lblDate || 'Date: ') + doc.date + '\\n' +
      sep + '\\n\\n' +
      doc.body + '\\n\\n' +
      doc.telemetryHeader + '\\n' +
      '- ' + doc.lblPeak + ': ' + doc.peakDb + ' dB(A)\\n' +
      '- ' + doc.lblAvg + ': ' + doc.avgDb + ' dB(A)\\n' +
      '- ' + doc.lblTime + ': ' + doc.timeRange + '\\n' +
      '- ' + doc.lblHash + ': ' + doc.evidenceId + '\\n\\n' +
      doc.legalHeader + '\\n';

    doc.articles.forEach(function (art) {{
      text += '§ ' + art + '\\n';
    }});

    text += '\\n' + doc.lblSign + '\\n' + doc.lblSignDate + doc.date + '\\n\\n' + doc.disclaimer;
    return text;
  }}

  function openModal(recordData, options) {{
    const el = ensureModal();
    currentRecord = recordData || {{}};
    const opts = options || {{}};

    userTier = opts.userTier || 'free';
    if (opts.lang && LEGAL_DATA[opts.lang]) {{
      currentLang = opts.lang;
    }} else if (typeof window.appLanguage === 'string' && window.appLanguage.startsWith('zh')) {{
      currentLang = 'zh';
    }} else if (typeof window.appLanguage === 'string') {{
      const p = window.appLanguage.slice(0, 2).toLowerCase();
      currentLang = LEGAL_DATA[p] ? p : 'en';
    }}

    currentTone = opts.tone || 'gentle';
    if (userTier === 'free') {{
      currentTone = 'gentle';
    }}

    if (opts.onUpgrade) {{
      upgradeCallback = opts.onUpgrade;
    }}

    // Set recipient and sender from options if provided
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.zh;
    const inputRec = el.querySelector('#lnmInputRecipient');
    const inputSnd = el.querySelector('#lnmInputSender');
    if (inputRec) {{
      inputRec.value = opts.recipient || currentRecord.recipient || conf.ui?.recipientDefault || '楼上邻居您好';
    }}
    if (inputSnd) {{
      inputSnd.value = opts.sender || currentRecord.sender || conf.ui?.senderDefault || '楼下邻居';
    }}

    // Sync active tone card
    const toneCards = el.querySelectorAll('.lnm-tone-card');
    toneCards.forEach(c => {{
      c.classList.toggle('active', c.getAttribute('data-tone') === currentTone);
    }});

    renderFullUi();
    renderPreview();

    el.classList.add('show');
  }}

  function closeModal() {{
    if (modalEl) {{
      modalEl.classList.remove('show');
    }}
  }}

  return {{
    openModal: openModal,
    closeModal: closeModal,
    buildDocxBlob: buildDocxBlob,
    compileDocumentData: compileDocumentData,
    buildPlainText: buildPlainText,
    getLegalData: function () {{ return LEGAL_DATA; }},
    setUserTier: function (tier) {{
      userTier = tier;
      if (modalEl) syncTierUi(modalEl);
    }},
    getUserTier: function () {{ return userTier; }},
    setUpgradeHandler: function (fn) {{ upgradeCallback = fn; }}
  }};
}}));
"""

with open(target_path, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated {target_path} successfully. Total characters: {len(js_content)}")
