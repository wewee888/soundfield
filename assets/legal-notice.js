/* ==========================================================================
   SOUNDTEST.PRO - Legal Notice & Neighbor Communication Letter Engine
   Modular Component: 3 Tones x 9 Jurisdictions/Languages x Pure-JS DOCX
   Zero External Dependencies · Full Dynamic Lazy Mount
   ========================================================================== */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SoundTestLegalNotice = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const LEGAL_DATA = {
  "zh": {
    "name": "🇨🇳 中国 (民法典 & 噪声污染防治法)",
    "laws": [
      "《中华人民共和国民法典》第1032条：自然人享有隐私权。任何组织或者个人不得以刺探、侵扰、泄露、公开等方式侵害他人的隐私权。私人生活安宁受法律保护。",
      "《中华人民共和国民法典》第288条：不动产的相邻权利人应当按照有利生产、方便生活、团结互助、公平合理的原则，正确处理相邻关系。",
      "《中华人民共和国噪声污染防治法》第63条、第65条：禁止排放超过社会生活环境噪声排放标准的噪声；造成严重污染构成侵权的，应当依法承担民事法律责任。",
      "国家《声环境质量标准》(GB 3096-2008)：1类居民生活区夜间（22:00-06:00）等效连续声级限值为 45 dB(A)。"
    ],
    "scenarios": {
      "footstep": "沉重脚步踩踏声/跑跳声",
      "music": "高分贝电视/低音炮震动",
      "dragging": "深夜桌椅拖拽与硬物刮擦",
      "renovation": "非规定时段电钻或敲击施工",
      "pet": "宠物持续吠叫与跑动撞击",
      "party": "深夜聚会喧哗与大声争吵"
    },
    "tones": {
      "gentle": {
        "title": "邻里安宁生活作息友善提醒便条",
        "body": "{RECIPIENT}：您好！\n\n冒昧打扰，特此给您留张便条。俗话说“远亲不如近邻”，大家同住一栋楼也是一份难得的缘分。\n\n近期在夜间休息时段，由于楼房建筑共振与楼板隔音有限，楼下家中频繁听到【{NOISE_TYPES}】的声响。经我们在室内实测，噪声峰值达到了 {PEAK} dB(A)，确实给家人的正常睡眠和夜间休息造成了一定困扰。\n\n平时大家生活作息各异，楼房隔音也有限，我们充分理解这大概率是日常活动时不经意产生的，您此前可能并未留意到声音会传至楼下，并非有意为之。特此留便条温馨提醒一下，可否麻烦您在夜间休息时段（尤其是 22:00 之后）稍加留意：\n1. 夜间室内走动动作尽量放轻一些，或换穿软底静音拖鞋；\n2. 桌椅板凳挪动时尽量轻抬轻放，或为桌椅脚贴上静音防刮脚垫；\n3. 夜间尽量减少剧烈跑跳与重物落地冲击。\n\n邻里相处互谅互让，非常感谢您的理解与配合，祝您和家人生活愉快！"
      },
      "firm": {
        "title": "关于夜间生活噪声超标干扰之正式交涉函",
        "body": "致【{RECIPIENT}】：\n\n您好！鉴于此前已就室内噪声干扰问题与您进行过沟通，但近期夜间休息时段仍反复出现【{NOISE_TYPES}】的情况，且未见实质改善。\n\n根据我们在家中进行的现场声学客观实测，夜间监测时段（{TIME_RANGE}）等效连续声级（LAeq）达到 {LEQ} dB(A)，瞬时峰值声级（Lmax）高达 {PEAK} dB(A)。该数值已显著超出国家《声环境质量标准》(GB 3096-2008) 及《社会生活环境噪声排放标准》(GB 22337-2008) 规定的1类居民生活区夜间标准限值，严重破坏了我方的基本居住安宁与睡眠健康。\n\n良好的居住环境需要邻里双方共同维护。我们正式向您提出交涉，请务必在夜间休息时段（22:00 至次日 07:00）切实采取消音减震措施，杜绝产生穿透性结构共振与撞击声。希望本着互谅互让与理性精神在邻里协商层面妥善解决，避免矛盾升级并进一步向物业服务中心报备记档或向属地社区居委会申请调解。"
      },
      "strict": {
        "title": "民事侵害生活安宁停止妨害催告函与法律告知书",
        "body": "致：【{RECIPIENT}】\n\n根据《中华人民共和国民法典》第一千零三十二条、第二百八十八条以及《中华人民共和国噪声污染防治法》第六十三条、第六十五条之规定，自然人依法享有私人生活安宁权，不动产相邻权利人应当按照有利生产、方便生活、团结互助、公平合理原则处理相邻关系，严禁任何单位和个人超标排放社会生活噪声妨碍他人正常生活，造成损害的应当依法承担民事侵权赔偿责任。\n\n现郑重告知：贵方所在房屋在夜间休息时段持续产生【{NOISE_TYPES}】。现场实测声级峰值 Lmax 高达 {PEAK} dB(A)，等效连续声级 LAeq 达 {LEQ} dB(A)。相关声学事实已通过 SOUNDTEST.PRO 存证系统完成客观记录与时间戳锁定，并已生成不可篡改的 SHA-256 数字防伪存证指纹（存证编号：{EVIDENCE_ID}）。\n\n贵方的持续超标排噪行为已严重逾越一般社会公认的合理容忍限度，依法构成对受函方私人生活安宁权的民事侵权妨害。特此正式向贵方发出催告：限贵方于收到本函后 48 小时内彻底采取有效降噪减震措施，停止一切超标排噪行为。\n\n若逾期仍未改善，我方将依法向物业服务中心正式报送侵权通报函、向辖区公安机关（110）及市民服务热线（12345）提请行政执法查处，并保留向人民法院依法提起排除妨害民事诉讼及主张相应损害赔偿之一切法定权利。"
      }
    },
    "ui": {
      "title": "邻里沟通函与法定催告函生成器",
      "subtitle": "基于真实声学存证数据 · 3种沟通语气 · 9国/地区法律条文智能援引",
      "toneLabel": "沟通语气策略",
      "toneHint": "阶梯式维权：温和提醒 → 理性交涉 → 严正催告",
      "toneGentle": "温和友善提醒",
      "toneGentleDesc": "以和为贵，初次提醒，理解可能不知情，倡导友好邻里互助",
      "toneFirm": "正式理性交涉",
      "toneFirmDesc": "多次沟通未果，摆出客观声学超标数据，明确作息干扰与底线",
      "toneStrict": "严正法务催告",
      "toneStrictDesc": "正式法律告知书格式，援引法定侵权法规，设定整改限期与通牒",
      "badgeFree": "免费开放",
      "badgePro": "🔒 专业版",
      "lblRecipient": "受函方称呼",
      "lblSender": "发函方署名",
      "lblJurisdiction": "法律法域与语言 (9国标准)",
      "scenarioLabel": "常见噪音类型 (快速勾选)",
      "lblPeak": "实测峰值 Lmax",
      "lblAvg": "等效均值 LAeq",
      "lblTime": "监测时段",
      "lblHash": "数字存证指纹",
      "articlesTitle": "法定法规依据与法律条文",
      "legalHeaderTitle": "法定法规依据与法律条文",
      "previewLabel": "文书实时预览",
      "previewHint": "所见即所得 · 自动排版",
      "btnClose": "关闭",
      "btnCopy": "复制文本",
      "btnDocx": "导出 Word (.docx)",
      "btnPdf": "导出排版 PDF",
      "copied": "✓ 已成功复制函件全文至剪贴板",
      "date": "日期：",
      "evidence": "存证编号：",
      "recipientDefault": "楼上邻居",
      "senderDefault": "楼下邻居",
      "recipientPlaceholder": "例如：楼上邻居 / 402室住户",
      "senderPlaceholder": "例如：楼下邻居 / 302室住户",
      "metaRecipient": "受函方：",
      "metaSender": "发函方：",
      "thMetric": "声学监测指标",
      "thValue": "实测读数",
      "telemetryHeader": "【现场声学测量数据证据表】",
      "legalHeader": "【法定法规条文与法律依据】",
      "lblSign": "通知方签署: ",
      "lblSignDate": "签署日期: ",
      "disclaimer": "【声学测量方法与依据标准】\n1. 测量规范：依据《声环境质量标准》(GB 3096-2008) 及《社会生活环境噪声排放标准》(GB 22337-2008)，采用 IEC 61672-1 标准声级算法、A 计权（A-weighting）频率响应及 Fast 时间计权动态特性进行室内客观取样。\n2. 精度与误差：参考 2 型工程声级计技术规范，现场综合参考允许误差在 ±1.5 dB(A) 以内，真实客观反映室内受音点实际物理声级。\n3. 存证效力：全程锁定时间戳并生成 SHA-256 唯一数字防伪指纹，符合《民事诉讼法》第六十六条“电子数据”举证规范，依法具备民事侵权与生活安宁权纠纷之客观事实证明力。",
      "methodologyHeader": "【声学测量方法与依据标准】",
      "gentleNote": "【实测说明】本数据采用标准 A 计权室内声学取样，参考测量误差约 ±1.5 dB(A)。本便条仅用于邻里友好生活作息沟通协调。"
    }
  },
  "en": {
    "name": "🇺🇸/🇬🇧 US & UK (Common Law & Quiet Enjoyment)",
    "laws": [
      "Common Law Covenant of Quiet Enjoyment: Every residential tenant and property owner possesses the implied covenant of quiet enjoyment, guaranteeing peaceful occupation free from unreasonable interference.",
      "Doctrine of Private Nuisance: Actionable nuisance arises when sound transmissions create substantial and unreasonable interference with the comfortable use and enjoyment of real property.",
      "World Health Organization (WHO) Night Noise Guidelines: Nighttime noise levels exceeding 40-45 dB(A) inside bedrooms represent a documented hazard to restorative sleep and cardiovascular health.",
      "Municipal Environmental Protection & Noise Abatement Codes: Establishing strict nighttime decibel thresholds for multi-family residential dwellings."
    ],
    "scenarios": {
      "footstep": "Heavy Footsteps, Heel Impact & Stomping",
      "music": "Loud TV, Bass Vibration & Subwoofer Thump",
      "dragging": "Late-Night Furniture Scraping & Hard Object Dropping",
      "renovation": "Unauthorized Drilling, Hammering & DIY Construction",
      "pet": "Continuous Pet Barking & Running Impacts",
      "party": "Late-Night Gathering, Shouting & Loud Conversations"
    },
    "tones": {
      "gentle": {
        "title": "Friendly Neighbor Note: Quiet Hours & Sound",
        "body": "Dear {RECIPIENT},\n\nHope you are having a good week! I'm reaching out with a quick, friendly note regarding sound transmission between our apartments.\n\nDue to our building's acoustic construction, sounds of 【{NOISE_TYPES}】 carry quite distinctly into my home during nighttime resting hours. Our sound monitor recorded peak levels reaching {PEAK} dB(A), which has occasionally disrupted our sleep.\n\nI completely understand that floor impact noise often travels more than we realize and that this is entirely unintentional on your part. If possible, would you mind being mindful during late hours (for example, wearing soft indoor slippers or adding felt pads under chair legs)?\n\nThank you so much for your understanding, kindness, and neighborly consideration!"
      },
      "firm": {
        "title": "Formal Notice Regarding Unreasonable Residential Noise Disturbance",
        "body": "To: 【{RECIPIENT}】\n\nI am writing to formally address the ongoing noise disturbances originating from your premises, specifically 【{NOISE_TYPES}】 during quiet resting hours ({TIME_RANGE}).\n\nObjective acoustic monitoring conducted in our dwelling documented an equivalent continuous sound level (LAeq) of {LEQ} dB(A) and peak levels (Lmax) reaching {PEAK} dB(A). These readings substantially exceed standard residential nighttime thresholds and cause continuous disruption to our sleep and domestic quietude.\n\nWe respectfully request that you take prompt, effective corrective measures to dampen impact noise and structural vibration between 10:00 PM and 7:00 AM. We hope to resolve this reasonably between neighbors without escalating this matter to building management or property administration."
      },
      "strict": {
        "title": "FORMAL CEASE AND DESIST DEMAND & LEGAL NOTICE (NOISE NUISANCE)",
        "body": "FORMAL NOTICE AND STATUTORY DEMAND\n\nTO: 【{RECIPIENT}】 (Resident / Occupant / Property Owner)\n\nFORMAL NOTICE IS HEREBY GIVEN that you are causing substantial, unreasonable, and recurring noise disturbances (specifically 【{NOISE_TYPES}】) originating from your residential unit, constituting an actionable nuisance and a direct violation of the covenant of quiet enjoyment and municipal noise control ordinances.\n\nEmpirical acoustic telemetry conducted in the affected dwelling recorded peak noise levels (Lmax) of {PEAK} dB(A) and equivalent levels (LAeq) of {LEQ} dB(A) during quiet hours ({TIME_RANGE}). This telemetry log is cryptographically sealed with timestamp and SHA-256 fingerprint {EVIDENCE_ID}.\n\nDEMAND IS HEREBY MADE that you immediately CEASE AND DESIST from generating excessive noise and implement adequate acoustic mitigation within 48 hours of receipt of this notice. Failure to abate this nuisance immediately will compel the undersigned to file formal complaints with building management, municipal code enforcement, and pursue all available legal remedies, including injunctive relief and damages in civil court."
      }
    },
    "ui": {
      "title": "Neighbor Notice & Statutory Demand Generator",
      "subtitle": "Backed by Verified Acoustic Telemetry · 3 Tones · 9 Global Legal Jurisdictions",
      "toneLabel": "Communication Strategy",
      "toneHint": "Escalation Path: Friendly Reminder → Formal Negotiation → Statutory Demand",
      "toneGentle": "Gentle Friendly Reminder",
      "toneGentleDesc": "Good neighbor approach, assumes unintentional, asks for cooperative mindfulness",
      "toneFirm": "Firm Rational Negotiation",
      "toneFirmDesc": "Presents empirical exceedance data, outlines sleep disturbance and clear boundaries",
      "toneStrict": "Strict Statutory Demand",
      "toneStrictDesc": "Formal legal notice format, cites statutory codes, issues 48h cure deadline",
      "lblRecipient": "Recipient / Resident",
      "lblSender": "Sender / Your Name/Unit",
      "lblJurisdiction": "Legal Jurisdiction & Language",
      "scenarioLabel": "Noise Categories (Select Applicable)",
      "lblPeak": "Recorded Peak Lmax",
      "lblAvg": "Equivalent LAeq",
      "lblTime": "Monitored Window",
      "lblHash": "Audit Fingerprint",
      "articlesTitle": "Statutory Provisions & Legal Standards Cited",
      "previewLabel": "Document Live Preview",
      "previewHint": "WYSIWYG · Formatted Legal Draft",
      "btnClose": "Close",
      "btnCopy": "Copy Text",
      "btnDocx": "Export Word (.docx)",
      "btnPdf": "Export Formatted PDF",
      "copied": "✓ Full notice copied to clipboard successfully",
      "date": "Date: ",
      "evidence": "Evidence ID: ",
      "recipientDefault": "Upstairs Neighbor",
      "senderDefault": "Downstairs Neighbor",
      "thMetric": "Acoustic Metric",
      "thValue": "Recorded Telemetry",
      "telemetryHeader": "【Acoustic Telemetry Log & Evidence Table】",
      "legalHeader": "【Statutory Provisions & Jurisdictional Standards Cited】",
      "lblSign": "Sender Signature: ",
      "lblSignDate": "Signed Date: ",
      "disclaimer": "【Acoustic Methodology & Reference Standards】\n1. Standards: Measured pursuant to IEC 61672-1 Class 2 sound level meter specifications, utilizing A-weighting frequency response and Fast time weighting.\n2. Tolerance: Reference measurement tolerance is within ±1.5 dB(A), objectively capturing the physical sound level at the receiver position.\n3. Evidentiary Chain: Cryptographically sealed with timestamp and SHA-256 digital fingerprint, satisfying electronic data requirements for civil evidence and nuisance dispute documentation.",
      "gentleNote": "【Measurement Note】Recorded using standard A-weighting sound telemetry (reference tolerance ±1.5 dB(A)). Provided for neighborly coordination.",
      "methodologyHeader": "【Acoustic Methodology & Reference Standards】",
      "recipientPlaceholder": "e.g. Upstairs Neighbor / Apt 402",
      "senderPlaceholder": "e.g. Downstairs Neighbor / Apt 302",
      "badgeFree": "FREE"
    }
  },
  "de": {
    "name": "🇩🇪 Deutschland (BGB §906 & TA Lärm)",
    "laws": [
      "Bürgerliches Gesetzbuch (BGB) § 906: Schutz vor Zuführung unwägbarer Stoffe und unzumutbaren Geräuschimmissionen von Nachbargrundstücken.",
      "Gesetz über Ordnungswidrigkeiten (OWiG) § 117: Unzulässiger Lärm, der geeignet ist, die Allgemeinheit oder die Nachbarschaft erheblich zu belästigen.",
      "Gesetzliche Nachtruhe (22:00 – 06:00 bzw. 07:00 Uhr): Grundsatz der Zimmerlautstärke; störender Trittschall und laute Immissionen sind strikt zu unterlassen.",
      "Technische Anleitung zum Schutz gegen Lärm (TA Lärm) & DIN 4109: Richtwerte für reine Wohngebiete nachts max. 35 dB(A) im Innenraum."
    ],
    "scenarios": {
      "footstep": "Lauter Trittschall, Fersengang & Herumspringen",
      "music": "Laute Musik, TV-Lärm & dröhnende Bassvibrationen",
      "dragging": "Nächtliches Möbelrücken & Scharren auf hartem Boden",
      "renovation": "Bohren, Hämmern & Heimwerken zur Unzeit",
      "pet": "Anhaltendes Hundegebell & Haustier-Trampelgeräusche",
      "party": "Nächtliche Partygeräusche, Geschrei & laute Feiern"
    },
    "tones": {
      "gentle": {
        "title": "Freundlicher Nachbarschaftshinweis: Ruhezeiten & Zimmerlautstärke",
        "body": "Liebe Nachbarn ({RECIPIENT}),\n\nich hoffe, es geht Ihnen gut! Ich wende mich heute mit einer kurzen, freundlichen Bitte an Sie. Da unsere Geschossdecken den Schall leider stark übertragen, sind Geräusche wie 【{NOISE_TYPES}】 in meiner Wohnung insbesondere während der nächtlichen Ruhezeiten deutlich zu hören. Unsere Messungen ergaben Spitzenwerte von {PEAK} dB(A).\n\nIch gehe selbstverständlich davon aus, dass Ihnen dies gar nicht bewusst war und keine böse Absicht vorliegt. Es wäre jedoch sehr nett, wenn Sie abends etwas darauf achten könnten (z. B. Hausschuhe mit weicher Sohle tragen oder Filzgleiter unter Stühlen anbringen).\n\nVielen Dank für Ihr Verständnis, Ihre Rücksichtnahme und ein weiterhin gutes Miteinander im Haus!"
      },
      "firm": {
        "title": "Förmliche Mitteilung über erhebliche Ruhestörung zur Nachtzeit",
        "body": "An: 【{RECIPIENT}】\n\nSehr geehrte Nachbarn,\n\nich wende mich förmlich an Sie bezüglich der anhaltenden Lärmbelästigung durch 【{NOISE_TYPES}】 aus Ihrer Wohnung während der gesetzlichen Nachtruhe ({TIME_RANGE}).\n\nObjektive Schallmessungen in meiner Wohnung belegen einen äquivalenten Dauerschallpegel (LAeq) von {LEQ} dB(A) und Spitzenwerte (Lmax) von {PEAK} dB(A). Dies übersteigt die zumutbare Zimmerlautstärke erheblich und beeinträchtigt unsere Nachtruhe sowie die Gesundheit nachhaltig.\n\nIch fordere Sie hiermit auf, die gesetzlichen Ruhezeiten (22:00 bis 07:00 Uhr) strikt einzuhalten und geeignete Schallschutzmaßnahmen zu ergreifen. Ich hoffe auf eine einvernehmliche Lösung unter Nachbarn, bevor weitere Schritte über die Hausverwaltung oder den Vermieter erforderlich werden."
      },
      "strict": {
        "title": "FÖRMLICHE ABMAHNUNG UND UNTERLASSUNGSAUFFORDERUNG WEGEN RUHESTÖRUNG",
        "body": "FÖRMLICHE ABMAHNUNG & UNTERLASSUNGSERKLÄRUNG\n\nAn: 【{RECIPIENT}】 (Mieter / Eigentümer der Wohneinheit)\n\nHiermit werden Sie förmlich abgemahnt. Aus Ihrer Wohnung gehen wiederholt unzumutbare und unzulässige Lärmimmissionen (insbesondere 【{NOISE_TYPES}】) aus, die gegen das Gebot der Zimmerlautstärke, § 906 BGB sowie § 117 OWiG verstoßen und eine unzumutbare Beeinträchtigung des Mietgebrauchs darstellen.\n\nDie messtechnische Dokumentation während der Nachtzeit ({TIME_RANGE}) ergab einen Spitzenlärmpegel von {PEAK} dB(A) und einen Dauerschallpegel von {LEQ} dB(A). Die Messdaten wurden kryptographisch mit dem SHA-256-Fingerprint {EVIDENCE_ID} fälschungssicher gesichert.\n\nIch fordere Sie hiermit ultimativ auf, die vorgenannte Ruhestörung unverzüglich, spätestens binnen 48 Stunden nach Zugang dieses Schreibens, dauerhaft einzustellen. Bei fruchtlosem Verstreichen dieser Frist werde ich unverzüglich die Hausverwaltung zur Mietminderung und Abmahnung einschalten, das Ordnungsamt/die Polizei hinzuziehen sowie zivilrechtliche Unterlassungsklage erheben."
      }
    },
    "ui": {
      "title": "Nachbarschaftsschreiben & Lärm-Abmahnungsgenerator",
      "subtitle": "Gestützt auf reale akustische Messdaten · 3 Tonalitäten · 9 Rechtsordnungen",
      "toneLabel": "Kommunikationsstrategie",
      "toneHint": "Eskalationsstufen: Freundlicher Hinweis → Sachliche Mahnung → Förmliche Abmahnung",
      "toneGentle": "Freundlicher Hinweis",
      "toneGentleDesc": "Gute Nachbarschaft, setzt Unwissenheit voraus, bittet um gegenseitige Rücksichtnahme",
      "toneFirm": "Sachliche Mahnung",
      "toneFirmDesc": "Dokumentiert Grenzwertüberschreitung, benennt Schlafstörung und klare Grenzen",
      "toneStrict": "Förmliche Abmahnung",
      "toneStrictDesc": "Rechtskonformes Abmahnschreiben, zitiert Gesetze, setzt 48h-Unterlassungsfrist",
      "lblRecipient": "Empfänger / Nachbar",
      "lblSender": "Absender / Ihre Wohnung",
      "lblJurisdiction": "Rechtsordnung & Sprache",
      "scenarioLabel": "Lärmarten (Auswahl)",
      "lblPeak": "Spitzenpegel Lmax",
      "lblAvg": "Dauerschallpegel LAeq",
      "lblTime": "Messzeitraum",
      "lblHash": "Beweis-Hash",
      "articlesTitle": "Rechtliche Grundlagen & DIN/TA-Lärm Normen",
      "previewLabel": "Live-Vorschau des Schreibens",
      "previewHint": "Automatische Formatierung · Druckfertig",
      "btnClose": "Schließen",
      "btnCopy": "Text kopieren",
      "btnDocx": "Word (.docx) exportieren",
      "btnPdf": "PDF exportieren",
      "copied": "✓ Schreiben erfolgreich in die Zwischenablage kopiert",
      "date": "Datum: ",
      "evidence": "Beweis-ID: ",
      "recipientDefault": "Nachbarn oben",
      "senderDefault": "Nachbarn unten",
      "thMetric": "Akustischer Kennwert",
      "thValue": "Gemessener Wert",
      "telemetryHeader": "【Akustisches Messprotokoll / Telemetrie-Nachweis】",
      "legalHeader": "【Zitierte Rechtsnormen und gesetzliche Grundlagen】",
      "lblSign": "Unterschrift: ",
      "lblSignDate": "Datum: ",
      "disclaimer": "【Messtechnische Methodik & Normen】\n1. Norm: Messung gemäß IEC 61672-1 Klasse 2 Schallpegelmesser mit A-Bewertung (A-Weighting) und Zeitbewertung Fast (F).\n2. Messtoleranz: Die referenzierte Messtoleranz liegt innerhalb von ±1,5 dB(A) und bildet die tatsächlichen Schallimmissionen im Raum objektiv ab.\n3. Beweiskraft: Vollständig zeitgestempelt und mit SHA-256 kryptographischem Prüfwert gesichert, geeignet als zivilrechtlicher Sachverhaltsnachweis nach ZPO.",
      "gentleNote": "【Messhinweis】Aufgezeichnet mit Standard-A-Bewertung (Referenztoleranz ±1,5 dB(A)). Dient der einvernehmlichen nachbarschaftlichen Abstimmung.",
      "methodologyHeader": "【Messtechnische Methodik & Normen】",
      "recipientPlaceholder": "z. B. Nachbarn oben / Whg. 402",
      "senderPlaceholder": "z. B. Nachbarn unten / Whg. 302",
      "badgeFree": "Kostenlos"
    }
  },
  "fr": {
    "name": "🇫🇷 France (Code civil & Trouble anormal de voisinage)",
    "laws": [
      "Code civil Article 1253: Le propriétaire, locataire ou occupant qui cause à un voisin un trouble excédant les inconvénients normaux de voisinage est responsable de plein droit du dommage causé.",
      "Code de la santé publique Art. R. 1336-5: Aucun bruit particulier ne doit, par sa durée, sa répétition ou son intensité, porter atteinte à la tranquillité du voisinage ou à la santé de l'homme.",
      "Code pénal Article R. 623-2: Les bruits ou tapages nocturnes injurieux ou troublant la tranquillité d'autrui sont punis des peines d'amende prévues pour les contraventions de la 3e classe.",
      "Réglementation préfectorale relative à la lutte contre les bruits de voisinage et horaires de repos (22h00 - 07h00)."
    ],
    "scenarios": {
      "footstep": "Bruits de pas lourds, talons et sauts répétés",
      "music": "Musique ou télévision forte, basses et vibrations",
      "dragging": "Tirage de chaises et déplacement de meubles la nuit",
      "renovation": "Bricolage, perçage et coups hors horaires autorisés",
      "pet": "Aboiements répétés ou courses d'animaux domestiques",
      "party": "Fêtes nocturnes, cris et conversations à voix haute"
    },
    "tones": {
      "gentle": {
        "title": "Mot amical de voisinage : Respect de la tranquillité nocturne",
        "body": "Chers voisins ({RECIPIENT}),\n\nJ'espère que vous allez bien. Je me permets de vous laisser ce petit mot amical. En raison de l'isolation phonique de notre immeuble, les bruits de type 【{NOISE_TYPES}】 résonnent nettement chez moi en soirée et durant la nuit, avec des pointes mesurées à {PEAK} dB(A).\n\nJe me doute bien que vous ne vous en rendez pas compte et qu'il n'y a aucune mauvaise intention de votre part. Serait-il possible de faire attention durant les heures de repos (par exemple en posant des patins en feutre sous les chaises ou en portant des chaussons souples) ?\n\nMerci infiniment pour votre compréhension, votre bienveillance et votre esprit de bon voisinage !"
      },
      "firm": {
        "title": "Courrier formel concernant des nuisances sonores répétées (bruits de voisinage)",
        "body": "À l'attention de : 【{RECIPIENT}】\n\nMadame, Monsieur,\n\nJe vous adresse ce courrier afin de vous faire part de la persistance de nuisances sonores provenant de votre logement, notamment 【{NOISE_TYPES}】 durant la période nocturne ({TIME_RANGE}).\n\nLes relevés acoustiques objectifs effectués dans mon appartement attestent d'un niveau continu équivalent (LAeq) de {LEQ} dB(A) et d'un niveau de crête (Lmax) atteignant {PEAK} dB(A). Ces valeurs dépassent largement les seuils admissibles en milieu résidentiel et troublent gravement notre sommeil et notre santé.\n\nJe vous demande de bien vouloir prendre les dispositions nécessaires pour faire cesser ces bruits d'impact entre 22h00 et 07h00. J'espère vivement que nous pourrons régler ce problème à l'amiable sans avoir à saisir le syndic de copropriété ou les services compétents."
      },
      "strict": {
        "title": "MISE EN DEMEURE POUR TROUBLE ANORMAL DE VOISINAGE ET TAPAGE NOCTURNE",
        "body": "MISE EN DEMEURE\n\nÀ l'attention de : 【{RECIPIENT}】 (Occupant / Propriétaire du logement)\n\nPar la présente, vous êtes formellement mis en demeure de cesser sans délai les nuisances sonores excessives et répétées (【{NOISE_TYPES}】) émanant de votre domicile, constitutives d'un trouble anormal de voisinage au sens de l'article 1253 du Code civil et d'une infraction à l'article R. 1336-5 du Code de la santé publique.\n\nLes relevés acoustiques horodatés et scellés par l'empreinte cryptographique SHA-256 {EVIDENCE_ID} attestent d'un niveau de crête de {PEAK} dB(A) et d'une moyenne de {LEQ} dB(A) durant la plage horaire {TIME_RANGE}.\n\nJe vous somme de mettre un terme définitif à ces nuisances sous 48 heures à compter de la réception de cette notification. À défaut, je saisirai sans autre préavis le syndic de copropriété, les services de police pour tapage nocturne et engagerai une procédure judiciaire en référé pour faire cesser le trouble et obtenir des dommages-intérêts."
      }
    },
    "ui": {
      "title": "Générateur de Courrier de Voisinage & Mise en Demeure",
      "subtitle": "Basé sur des mesures acoustiques certifiées · 3 tonalités · 9 juridictions",
      "toneLabel": "Stratégie de communication",
      "toneHint": "Démarche progressive: Courrier amical → Avis formel → Mise en demeure",
      "toneGentle": "Courrier amical",
      "toneGentleDesc": "Bonne entente de voisinage, présume la bonne foi, sollicite la bienveillance",
      "toneFirm": "Avis formel",
      "toneFirmDesc": "Présente les dépassements sonores réels, souligne l'impact sur le sommeil",
      "toneStrict": "Mise en demeure",
      "toneStrictDesc": "Format juridique rigoureux, cite le Code civil et santé publique, délai de 48h",
      "lblRecipient": "Destinataire / Voisin",
      "lblSender": "Expéditeur / Votre logement",
      "lblJurisdiction": "Juridiction & Langue",
      "scenarioLabel": "Type de nuisances (Sélection)",
      "lblPeak": "Niveau Crête Lmax",
      "lblAvg": "Moyenne LAeq",
      "lblTime": "Plage horaire",
      "lblHash": "Empreinte SHA-256",
      "articlesTitle": "Dispositions Légales et Textes de Référence",
      "previewLabel": "Aperçu du courrier en direct",
      "previewHint": "Mise en page automatique · Prêt à imprimer",
      "btnClose": "Fermer",
      "btnCopy": "Copier le texte",
      "btnDocx": "Exporter Word (.docx)",
      "btnPdf": "Exporter en PDF",
      "copied": "✓ Courrier copié dans le presse-papiers avec succès",
      "date": "Date : ",
      "evidence": "Réf. preuve : ",
      "recipientDefault": "Voisins du dessus",
      "senderDefault": "Voisins du dessous",
      "thMetric": "Indicateur acoustique",
      "thValue": "Valeur relevée",
      "telemetryHeader": "【Relevé Acoustique Horodaté / Registre de Télémétrie】",
      "legalHeader": "【Fondements Juridiques et Textes Applicables】",
      "lblSign": "Signature de l'expéditeur : ",
      "lblSignDate": "Date : ",
      "disclaimer": "【Méthodologie Acoustique & Normes】\n1. Norme: Mesures effectuées conformément à la norme CEI 61672-1 Classe 2, avec pondération fréquentielle A et pondération temporelle Rapide (Fast).\n2. Tolérance: Marge d'erreur de référence de ±1,5 dB(A), reflétant objectivement les niveaux sonores réels subis dans l'habitation.\n3. Valeur probante: Données horodatées et scellées par empreinte numérique SHA-256, constituant un commencement de preuve matérielle conforme aux règles de procédure civile.",
      "gentleNote": "【Note de mesure】Enregistré selon la pondération standard A (tolérance ±1,5 dB(A)). Destiné à une concertation amiable de voisinage.",
      "methodologyHeader": "【Méthodologie Acoustique & Normes de Référence】",
      "recipientPlaceholder": "ex. Voisins du dessus / Apt 402",
      "senderPlaceholder": "ex. Voisins du dessous / Apt 302",
      "badgeFree": "Gratuit"
    }
  },
  "es": {
    "name": "🇪🇸 España / LatAm (Ley del Ruido & Propiedad Horizontal)",
    "laws": [
      "Ley 37/2003, de 17 de noviembre, del Ruido: Prevención, vigilancia y reducción de la contaminación acústica para evitar daños a la salud y a la convivencia.",
      "Ley de Propiedad Horizontal (LPH) Artículo 7.2: Prohibición expresa al propietario y ocupante de desarrollar actividades molestas, insalubres o ilícitas.",
      "Código Civil Artículos 1902 y 590: Responsabilidad extracontractual por daño y deber de no causar inmisiones perjudiciales o desmedidas a la propiedad ajena.",
      "Ordenanzas Municipales de Protección contra la Contaminación Acústica: Horarios oficiales de descanso nocturno (22:00 a 08:00 h)."
    ],
    "scenarios": {
      "footstep": "Pisar fuerte, taconeo nocturno o carreras infantiles",
      "music": "Televisión o música alta, vibración de graves y subwoofer",
      "dragging": "Arrastre de sillas, mesas o muebles en horario de descanso",
      "renovation": "Obras, taladros o golpes en días u horas no permitidas",
      "pet": "Ladridos continuados o carreras de mascotas",
      "party": "Fiestas nocturnas, reuniones ruidosas y gritos"
    },
    "tones": {
      "gentle": {
        "title": "Nota amistosa de vecindad: Ruidos y descanso nocturno",
        "body": "Estimados vecinos ({RECIPIENT}):\n\nEspero que se encuentren muy bien. Les escribo esta breve nota cordial para comentarles que, debido al aislamiento acústico del edificio, ruidos como 【{NOISE_TYPES}】 se escuchan con bastante claridad en mi vivienda durante la noche, habiéndose registrado picos de {PEAK} dB(A).\n\nEntiendo perfectamente que no lo hacen con mala intención y que a menudo no somos conscientes de cómo viaja el sonido por la estructura. Les agradecería mucho si pudieran tener un poco de cuidado en horas de descanso (por ejemplo, usando zapatillas de suela blanda o colocando fieltros protectores bajo las sillas).\n\n¡Muchas gracias por su comprensión, amabilidad y buena vecindad!"
      },
      "firm": {
        "title": "Comunicación formal sobre ruidos excesivos en horario de descanso",
        "body": "A la atención de: 【{RECIPIENT}】\n\nEstimados vecinos:\n\nMe dirijo a ustedes de manera formal para manifestarles mi honda preocupación por los continuos ruidos procedentes de su vivienda (【{NOISE_TYPES}】) durante el horario nocturno ({TIME_RANGE}).\n\nLas mediciones acústicas objetivas realizadas registran un nivel continuo equivalente (LAeq) de {LEQ} dB(A) y un valor máximo (Lmax) de {PEAK} dB(A), superando ostensiblemente los límites fijados por la normativa de protección acústica y perjudicando severamente nuestro descanso y salud.\n\nLes solicito que adopten de inmediato las medidas oportunas para amortiguar estas molestias entre las 22:00 y las 08:00 horas. Confío en que podamos solucionar este inconveniente de forma amistosa sin tener que dar traslado a la Administración de la Comunidad o iniciar mediación vecinal."
      },
      "strict": {
        "title": "REQUERIMIENTO FORMAL Y FEHACIENTE DE CESACIÓN DE ACTIVIDADES MOLESTAS",
        "body": "REQUERIMIENTO FORMAL DE CESACIÓN\n\nA la atención de: 【{RECIPIENT}】 (Ocupante / Propietario del inmueble)\n\nPor medio del presente escrito se le REQUIERE FORMALMENTE para que proceda a la CESACIÓN INMEDIATA de los ruidos molestos y excesivos (【{NOISE_TYPES}】) procedentes de su inmueble, los cuales vulneran el artículo 7.2 de la Ley de Propiedad Horizontal y la Ley del Ruido 37/2003, constituyendo una inmisión ilícita en la propiedad contigua.\n\nEl registro acústico pericial acreditado mediante firma digital SHA-256 {EVIDENCE_ID} evidencia picos sonoros de {PEAK} dB(A) y promedios de {LEQ} dB(A) en horario nocturno ({TIME_RANGE}).\n\nDispone de un plazo improrrogable de 48 HORAS desde la recepción de la presente para cesar dichas perturbaciones. En caso contrario, se interpondrá denuncia ante la Policía Local y se ejercerán las acciones judiciales civiles de cesación e indemnización por daños y perjuicios."
      }
    },
    "ui": {
      "title": "Generador de Notificación Vecinal y Requerimiento Legal",
      "subtitle": "Basado en telemetría acústica verificada · 3 tonos · 9 jurisdicciones legales",
      "toneLabel": "Estrategia de comunicación",
      "toneHint": "Escalado progresivo: Nota cordial → Comunicación formal → Requerimiento legal",
      "toneGentle": "Nota cordial amistosa",
      "toneGentleDesc": "Buena vecindad, asume falta de conocimiento, solicita empatía y cuidado mutuo",
      "toneFirm": "Comunicación formal",
      "toneFirmDesc": "Aporta datos objetivos de exceso de decibelios, señala afectación al descanso",
      "toneStrict": "Requerimiento legal",
      "toneStrictDesc": "Formato de burofax/carta de cese, cita preceptos legales, concede plazo de 48h",
      "lblRecipient": "Destinatario / Vecino",
      "lblSender": "Remitente / Su vivienda",
      "lblJurisdiction": "Jurisdicción e Idioma",
      "scenarioLabel": "Tipo de ruidos (Selección rápida)",
      "lblPeak": "Pico medido Lmax",
      "lblAvg": "Equivalente LAeq",
      "lblTime": "Tramo horario",
      "lblHash": "Firma digital",
      "articlesTitle": "Fundamentos de Derecho y Normativa Acústica",
      "previewLabel": "Vista previa en directo del escrito",
      "previewHint": "Formato legal estructurado · Listo para imprimir",
      "btnClose": "Cerrar",
      "btnCopy": "Copiar texto",
      "btnDocx": "Exportar Word (.docx)",
      "btnPdf": "Exportar en PDF",
      "copied": "✓ Escrito copiado al portapapeles con éxito",
      "date": "Fecha: ",
      "evidence": "Nº Evidencia: ",
      "recipientDefault": "Vecinos de arriba",
      "senderDefault": "Vecinos de abajo",
      "thMetric": "Parámetro acústico",
      "thValue": "Lectura registrada",
      "telemetryHeader": "【Registro Pericial de Telemetría Acústica / Evidencias】",
      "legalHeader": "【Artículos Legales y Fundamentos de Derecho Citados】",
      "lblSign": "Firma del requirente: ",
      "lblSignDate": "Fecha: ",
      "disclaimer": "【Metodología Acústica y Estándares de Referencia】\n1. Norma: Mediciones conformes con la norma IEC 61672-1 Clase 2, utilizando ponderación de frecuencia A y ponderación temporal Rápida (Fast).\n2. Tolerancia: Margen de tolerancia de referencia de ±1,5 dB(A), reflejando objetivamente el nivel sonoro real en el punto receptor.\n3. Cadena de custodia: Sellado temporalmente con huella digital SHA-256, válido como evidencia documental fáctica en procedimientos civiles y comunitarios.",
      "gentleNote": "【Nota de medición】Registrado mediante ponderación A estándar (tolerancia de referencia ±1,5 dB(A)). Facilitado para la convivencia vecinal.",
      "methodologyHeader": "【Metodología Acústica y Estándares de Referencia】",
      "recipientPlaceholder": "ej. Vecinos de arriba / Piso 402",
      "senderPlaceholder": "ej. Vecinos de abajo / Piso 302",
      "badgeFree": "Gratis"
    }
  },
  "ja": {
    "name": "🇯🇵 日本 (民法相隣関係・受忍限度論)",
    "laws": [
      "民法 第209条・第709条: 相隣関係の規律および不法行為に基づく損害賠償・差止請求権。",
      "最高裁判所判例法理「受忍限度論」: 社会通念上受忍すべき限度を超える騒音は違法と認定され、損害賠償義務が発生します。",
      "環境省告示・騒音に係る環境基準: 住居専用地域における夜間（午後10時～午前6時）の指針値は 45 dB(A) 以下。",
      "マンション標準管理規約 第18条: 区分所有者等は、共同の利益に反する行為または生活平穏を著しく害する行為をしてはならない。"
    ],
    "scenarios": {
      "footstep": "足音・踵歩きの衝撃音・室内での走り回り",
      "music": "大音量テレビ・ウーファーや重低音の振動",
      "dragging": "深夜の椅子や家具の引きずり音・床面の摩擦音",
      "renovation": "規約時間外のDIY・日曜大工・打撃音",
      "pet": "ペットの継続的な鳴き声や走り回る衝撃音",
      "party": "深夜の酒宴・大声での会話・騒ぎ"
    },
    "tones": {
      "gentle": {
        "title": "生活音に関するご相談とお願い（メモ）",
        "body": "【{RECIPIENT}】様\n\n日頃より大変お世話になっております。突然のお手紙にて失礼いたします。\n\n当マンションの構造上、夜間の静かな時間帯におきまして、【{NOISE_TYPES}】などの音や振動が下階にかなり響いており、実測におきまして最大 {PEAK} dB(A) を記録しております。家族の睡眠に影響が出ており、大変困惑しております。\n\n故意によるものではないことは重々承知しており、大変恐縮なお願いではございますが、夜間（特に22時以降）につきましては、スリッパの着用や椅子の脚カバー（フェルト等）の設置など、少しだけご配慮をいただけますと大変幸甚に存じます。\n\n集合住宅におけるお互いの快適な生活環境のため、何卒ご理解とご協力を賜りますようお願い申し上げます。"
      },
      "firm": {
        "title": "夜間生活騒音の改善に関する申入書",
        "body": "【{RECIPIENT}】様\n\n前略　貴殿におかれましては平素よりお世話になっております。\nさて、貴殿居室より夜間帯（{TIME_RANGE}）に継続して発生しております【{NOISE_TYPES}】につきまして、依然として改善が見られず、当方の日常生活および夜間の睡眠健康に著しい支障をきたしておりますため、本書面を以て正式に申し入れをいたします。\n\n当居室内における客観的音響測定の結果、等価騒音レベル（LAeq）は {LEQ} dB(A)、最大騒音レベル（Lmax）は {PEAK} dB(A) に達しており、環境省告示の住宅地域夜間基準（45 dB(A)）を超過しております。\n\n良好な共同生活環境を維持するため、夜間帯（22:00～翌7:00）における確実な消音・防振対策を講じていただけますようお願いいたします。管理会社や管理組合への正式な届出に至る前に、居住者間での円満な自主的解決を強く希望いたします。　草々"
      },
      "strict": {
        "title": "生活平穏権侵害に対する騒音差止請求及び警告通知書",
        "body": "通　知　書\n\n被通知人：【{RECIPIENT}】 殿\n\n本書面を以て、貴殿居室より恒常的・反復的に発生している夜間騒音（【{NOISE_TYPES}】）につき厳重に抗議し、直ちに当該騒音発生行為を停止（差止）することを請求いたします。\n\n当居室内における客観的音響測定に基づき、最大音圧 {PEAK} dB(A)、等価騒音レベル {LEQ} dB(A) の騒音事実が立証されており、改ざん防止ハッシュ（SHA-256: {EVIDENCE_ID}）により厳格に証拠保全されております。貴殿の行為は社会通念上の「受忍限度」を明白に逸脱しており、民法第709条に基づく不法行為および人格権（平穏生活権）の侵害を構成します。\n\n本書受領後 48時間以内 に上記騒音を完全に停止する措置を講じるよう通告いたします。万一、期限内に改善がなされない場合は、所轄警察署への通報、管理組合への報告、ならびに管轄裁判所への民事妨害排除請求訴訟および慰謝料等の損害賠償請求訴訟を提起いたしますので、念のため申し添えます。"
      }
    },
    "ui": {
      "title": "近隣騒音申入書・警告通知書ジェネレーター",
      "subtitle": "実測音響データに基づく証拠化 · 3段階の口調 · 主要9法域の法令条文を自動引用",
      "toneLabel": "コミュニケーション戦略（トーン選択）",
      "toneHint": "段階的対応：穏やかなお願い → 正式な申入書 → 法的警告書",
      "toneGentle": "穏やかなお願い",
      "toneGentleDesc": "円満な関係を重視、無意識を前提とし、互いの配慮を呼びかける",
      "toneFirm": "正式な申入書",
      "toneFirmDesc": "客観的な超過数値を提示し、睡眠への影響と境界線を明確に示す",
      "toneStrict": "法的警告通知書",
      "toneStrictDesc": "受忍限度論・民法不法行為条文を引用し、48時間以内の改善を求める",
      "lblRecipient": "受取人 / お相手の居室",
      "lblSender": "差出人 / あなたの居室",
      "lblJurisdiction": "準拠法域・言語選択",
      "scenarioLabel": "発生している騒音の種類（選択）",
      "lblPeak": "実測最大音圧 Lmax",
      "lblAvg": "等価騒音レベル LAeq",
      "lblTime": "測定時間帯",
      "lblHash": "防改ざんハッシュ",
      "articlesTitle": "引用法令・判例法理・環境基準条文",
      "previewLabel": "書面リアルタイムプレビュー",
      "previewHint": "自動組版 · 印刷・提出対応",
      "btnClose": "閉じる",
      "btnCopy": "本文をコピー",
      "btnDocx": "Word (.docx) 出力",
      "btnPdf": "PDF 出力",
      "copied": "✓ 書面全文をクリップボードにコピーしました",
      "date": "作成日: ",
      "evidence": "証拠番号: ",
      "recipientDefault": "上階のお部屋の方",
      "senderDefault": "下階の住人",
      "thMetric": "測定項目",
      "thValue": "実測値",
      "telemetryHeader": "【現場音響計測データ証拠記録表】",
      "legalHeader": "【法的根拠条文・受忍限度規範】",
      "lblSign": "通知人署名: ",
      "lblSignDate": "日付: ",
      "disclaimer": "【音響測定方法および準拠規格】\n1. 測定規格：IEC 61672-1 クラス2騒音計規格に準拠し、A特性周波数重み付けおよびFast時間重み付け特性にて室内実測を実施。\n2. 許容誤差：総合参考測定誤差は±1.5 dB(A)以内であり、受音点における実際の物理的音圧レベルを客観的に記録。\n3. 証拠能力：タイムスタンプ固定およびSHA-256暗号化電子指紋を付与し、民事上の受忍限度論争における客観的電子事実証拠として構成。",
      "gentleNote": "【実測注記】標準A特性にて測定（参考誤差±1.5 dB(A)）。ご近所同士の円滑な生活環境調整のための参考メモです。",
      "methodologyHeader": "【音響測定方法および準拠規格】",
      "recipientPlaceholder": "例：上階のお部屋の方 / 402号室",
      "senderPlaceholder": "例：下階の住人 / 302号室",
      "badgeFree": "無料"
    }
  },
  "ko": {
    "name": "🇰🇷 대한민국 (공동주택관리법 & 층간소음기준)",
    "laws": [
      "공동주택관리법 제20조 (층간소음의 방지 등): 입주자등은 공동주택에서 층간소음으로 인하여 다른 입주자등에게 피해를 주지 아니하도록 노력하여야 한다.",
      "공동주택 층간소음의 범위와 기준에 관한 규칙: 직접충격 야간 1분 등가소음도 34 dB(A), 최고소음도 52 dB(A) 초과 시 위법성 인정.",
      "민법 제217조 (매연등에 의한 인접토지에 대한 방해금지) 및 제750조 (불법행위 책임): 타인의 생활평온을 해치는 소음은 불법행위로서 손해배상 책임의 대상입니다.",
      "환경분쟁조정법: 수인한도를 초과하는 층간소음에 대한 실측 데이터 기반 정신적 피해 배상 기준 규정."
    ],
    "scenarios": {
      "footstep": "발망치 쿵쿵거림 / 실내 달리기 / 뒤꿈치 충격음",
      "music": "심야 TV 고음량 / 우퍼 및 저음 스피커 진동",
      "dragging": "야간 의자 및 가구 끄는 소리 / 바닥 마찰음",
      "renovation": "규정 시간 외 인테리어 드릴링 / 타격 공사",
      "pet": "반려견 짖음 및 반려동물 우다다 소음",
      "party": "심야 술자리 / 고성방가 및 심야 대화 소음"
    },
    "tones": {
      "gentle": {
        "title": "층간소음 관련 정중한 배려 요청 메모",
        "body": "{RECIPIENT}님, 안녕하세요.\n\n같은 아파트(건물)에 거주하는 이웃입니다. 조심스럽게 부탁의 말씀을 드리고자 작은 메모를 남깁니다.\n\n건물 구조상 층간 소음 전달이 쉬워, 야간 휴식 시간에 【{NOISE_TYPES}】 소리가 실내로 크게 울려 가족들의 수면에 다소 어려움이 있습니다. 실내에서 실측한 결과 순간 최대 소음이 {PEAK} dB(A)에 이르고 있습니다.\n\n일부러 그러신 것이 아님을 충분히 이해하고 있습니다. 다만 야간 시간대(특히 22시 이후)에는 실내 슬리퍼(소음 방지용) 착용이나 의자 다리 소음 방지 패드 부착 등 조금만 신경 써주시면 더없이 감사하겠습니다.\n\n서로 배려하며 평온한 이웃 관계를 이어가길 바랍니다. 따뜻한 이해와 협조에 감사드립니다."
      },
      "firm": {
        "title": "야간 층간소음 기준 초과에 따른 공식 협의 요청서",
        "body": "수신: 【{RECIPIENT}】 귀하\n\n안녕하십니까. 귀 댁에서 야간 시간대({TIME_RANGE})에 지속적으로 발생하는 【{NOISE_TYPES}】으로 인하여 당 가정의 일상생활 및 수면권이 심각하게 침해받고 있어 정식으로 개선을 요청드립니다.\n\n당사 세대 내에서 객관적으로 계측된 소음 데이터에 따르면, 야간 등가소음도(LAeq)는 {LEQ} dB(A), 최고소음도(Lmax)는 {PEAK} dB(A)를 기록하여 환경부 및 국토교통부의 공동주택 층간소음 법적 기준을 상회하고 있습니다.\n\n공동주택관리법에 부합하는 소음 저감 조치를 성실히 이행해 주시기 바라며, 관리사무소 민원 접수나 층간소음 이웃사이센터/분쟁조정위원회 접수에 이르기 전에 이웃 간에 원만히 해결되기를 기대합니다."
      },
      "strict": {
        "title": "층간소음 침해 행위 즉시 중지 최고서(통고서)",
        "body": "최 고 서 (통고서)\n\n수신: 【{RECIPIENT}】 (점유자 및 입주자 귀하)\n\n본 서면을 통하여 귀하의 세대에서 발생하는 수인한도 초과 층간소음(【{NOISE_TYPES}】)에 대하여 즉각적인 침해 중지를 엄중히 최고(催告)합니다.\n\nSOUNDTEST.PRO 시스템을 통해 실측되고 SHA-256 전자 지문({EVIDENCE_ID})으로 봉인된 음향 증거에 의하면, 야간 최고소음도 {PEAK} dB(A), 등가소음도 {LEQ} dB(A)로 민법 제750조 및 공동주택관리법 제20조가 규정한 수인한도를 명백히 초과하였습니다.\n\n본 통고서 수령 후 48시간 이내에 소음 유발 행위를 완전히 중단할 것을 통고합니다. 기한 내 실질적인 개선이 없을 경우, 관리사무소 공식 통보, 112 경찰 신고는 물론 환경분쟁조정위원회 신청 및 법원에 층간소음 방해배제 가처분과 위자료 청구 소송을 즉각 제기할 것임을 통고합니다."
      }
    },
    "ui": {
      "title": "층간소음 이웃 소통문 및 법적 통고서 생성기",
      "subtitle": "실측 음향 데이터 기반 검증 · 3단계 어조 · 9개국 법적 기준 자동 인용",
      "toneLabel": "소통 어조 전략",
      "toneHint": "단계별 대응: 정중한 부탁 → 공식 협의 요청 → 법적 통고서",
      "toneGentle": "정중한 부탁",
      "toneGentleDesc": "원만한 이웃 관계 우선, 부지불식간 발생 전제, 상호 배려 요청",
      "toneFirm": "공식 협의 요청",
      "toneFirmDesc": "객관적 기준 초과 수치 제시, 수면 방해 사실과 명확한 기준선 통보",
      "toneStrict": "법적 통고서",
      "toneStrictDesc": "정식 내용증명 형식, 민법 및 층간소음 규칙 인용, 48시간 시정 요구",
      "lblRecipient": "수신인 / 해당 세대",
      "lblSender": "발신인 / 귀하 세대",
      "lblJurisdiction": "준거 법역 및 언어",
      "scenarioLabel": "발생 소음 유형 (선택)",
      "lblPeak": "실측 최고소음 Lmax",
      "lblAvg": "등가소음 LAeq",
      "lblTime": "측정 시간대",
      "lblHash": "위변조 방지 해시",
      "articlesTitle": "관련 법령 및 층간소음 법적 기준",
      "previewLabel": "서면 실시간 미리보기",
      "previewHint": "자동 조판 · 인쇄 및 제출 가능",
      "btnClose": "닫기",
      "btnCopy": "본문 복사",
      "btnDocx": "Word (.docx) 내보내기",
      "btnPdf": "PDF 내보내기",
      "copied": "✓ 서면 전문이 클립보드에 복사되었습니다",
      "date": "작성일자: ",
      "evidence": "증거번호: ",
      "recipientDefault": "위층 이웃 주민",
      "senderDefault": "아래층 이웃 주민",
      "thMetric": "음향 측정 지표",
      "thValue": "실측 수치",
      "telemetryHeader": "【현장 음향 계측 데이터 증거 기록표】",
      "legalHeader": "【법적 근거 조항 및 준거 규정】",
      "lblSign": "통지인 서명: ",
      "lblSignDate": "일자: ",
      "disclaimer": "【음향 측정 방법 및 기준 규격】\n1. 측정 규격: IEC 61672-1 Class 2 소음계 규격에 준하여 A-가중치 및 Fast 시간 가중 특성으로 실내 음향을 정밀 샘플링함.\n2. 허용 오차: 종합 참고 측정 오차는 ±1.5 dB(A) 이내이며, 실내 수음점의 실제 물리적 음압 레벨을 객관적으로 반영함.\n3. 증거력: 타임스탬프 및 SHA-256 전자 지문으로 봉인되어, 민사 분쟁 및 층간소음 조정 시 전자적 사실 증거 자료로 활용 가능함.",
      "gentleNote": "【측정 참고】표준 A-가중치 음향 측정 적용 (참고 오차 ±1.5 dB(A)). 원만한 이웃 간 생활 조정을 위한 안내 메모입니다.",
      "methodologyHeader": "【음향 측정 방법 및 기준 규격】",
      "recipientPlaceholder": "예: 위층 이웃 주민 / 402호",
      "senderPlaceholder": "예: 아래층 이웃 주민 / 302호",
      "badgeFree": "무료"
    }
  },
  "th": {
    "name": "🇹🇭 ประเทศไทย (พ.ร.บ.การสาธารณสุข & ป.พ.พ.)",
    "laws": [
      "พระราชบัญญัติการสาธารณสุข พ.ศ. 2535 (มาตรา 25 และมาตรา 28): การกระทำใดๆ อันเป็นเหตุให้เกิดกลิ่น แสง รังสี เสียง ความสั่นสะเทือน จนเป็นเหตุให้เสื่อมหรืออาจเป็นอันตรายต่อสุขภาพ ถือเป็นเหตุรำคาญ.",
      "ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 420: ผู้ใดจงใจหรือประมาทเลินเล่อทำต่อบุคคลอื่นโดยผิดกฎหมาย เป็นเหตุให้เขาเสียหายแก่ร่างกาย อนามัย หรือเสรีภาพ ผู้นั้นต้องชดใช้ค่าสินไหมทดแทน.",
      "ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 1337: บุคคลใดใช้สิทธิของตนเป็นเหตุให้เจ้าของอสังหาริมทรัพย์ได้รับความเสียหายหรือเดือดร้อนเกินที่ควรคิดหรือคาดหมายได้ มีสิทธิปฏิบัติการเพื่อยังความเสียหายนั้นให้สิ้นไป.",
      "ประกาศกรมควบคุมมลพิษ เรื่อง กำหนดระดับเสียงรบกวน: เกณฑ์มาตรฐานระดับเสียงรบกวนในอาคารพักอาศัย."
    ],
    "scenarios": {
      "footstep": "เสียงเดินลงส้นเท้าหนักๆ / เสียงวิ่งหรือกระโดดกระแทกพื้น",
      "music": "เสียงโทรทัศน์หรือเครื่องเสียงดัง / แรงสั่นสะเทือนจากเสียงเบส",
      "dragging": "เสียงลากเก้าอี้ โต๊ะ หรือเฟอร์นิเจอร์ยามวิกาล",
      "renovation": "เสียงเจาะ ตอก หรือซ่อมแซมต่อเติมนอกเวลาที่กำหนด",
      "pet": "เสียงสุนัขเห่าต่อเนื่อง หรือสัตว์เลี้ยงวิ่งส่งเสียงรบกวน",
      "party": "งานปาร์ตี้สังสรรค์เสียงดัง / พูดคุยเอะอะโวยวายยามวิกาล"
    },
    "tones": {
      "gentle": {
        "title": "โน้ตแจ้งเตือนฉันมิตร: เรื่องการส่งผ่านเสียงยามวิกาล",
        "body": "เรียน {RECIPIENT},\n\nสวัสดีครับ/ค่ะ ขออนุญาตส่งโน้ตสั้นๆ นี้ด้วยความปรารถนาดีครับ เนื่องจากโครงสร้างอาคารส่งผ่านเสียงได้ง่าย ในช่วงเวลาพักผ่อนตอนกลางคืน เสียงประเภท 【{NOISE_TYPES}】 ส่งผลกระทบต่อการนอนหลับ โดยวัดระดับเสียงสูงสุดได้ถึง {PEAK} dB(A)\n\nเข้าใจเป็นอย่างยิ่งว่าท่านมิได้มีเจตนาและอาจไม่ทราบว่าเสียงส่งผ่านลงมา จึงใคร่ขอความอนุเคราะห์ช่วยระมัดระวังในยามวิกาล (หลัง 22.00 น.) เช่น สวมรองเท้าเดินในบ้านแบบนุ่ม หรือติดแผ่นซับเสียงที่ขาโต๊ะเก้าอี้\n\nขอขอบพระคุณเป็นอย่างยิ่งในความเข้าใจ มิตรภาพอันดี และความร่วมมือระหว่างเพื่อนบ้านครับ"
      },
      "firm": {
        "title": "หนังสือแจ้งขอความร่วมมือและระงับเสียงรบกวนยามวิกาล",
        "body": "เรียน ท่านผู้อยู่อาศัยห้อง 【{RECIPIENT}】,\n\nขอแจ้งให้ทราบอย่างเป็นทางการถึงปัญหาเสียงรบกวนจากห้องของท่าน ได้แก่ 【{NOISE_TYPES}】 ในช่วงเวลาค่ำคืน ({TIME_RANGE}) อย่างต่อเนื่อง ซึ่งส่งผลกระทบต่อสุขภาพและการพักผ่อนอย่างยิ่ง\n\nจากการตรวจวัดระดับเสียงอย่างเป็นรูปธรรม พบว่าระดับเสียงเฉลี่ย (LAeq) อยู่ที่ {LEQ} dB(A) และระดับเสียงสูงสุด (Lmax) สูงถึง {PEAK} dB(A) ซึ่งเกินกว่าระดับปกติของที่พักอาศัยและสร้างความเดือดร้อนต่อการพักผ่อน\n\nขอความกรุณาช่วยจัดการแก้ไขและลดเสียงรบกวนดังกล่าวในช่วงเวลา 22.00 - 07.00 น. โดยหวังเป็นอย่างยิ่งว่าจะสามารถแก้ไขปัญหาร่วมกันได้ด้วยดี ก่อนที่จะต้องประสานงานฝ่ายนิติบุคคลอาคารชุดเพื่อดำเนินการต่อไป"
      },
      "strict": {
        "title": "หนังสือบอกกล่าวทวงถามให้ระงับเหตุรำคาญทางเสียงและแจ้งสิทธิตามกฎหมาย (Notice)",
        "body": "หนังสือบอกกล่าวทวงถาม (Notice)\n\nเรียน: 【{RECIPIENT}】 (ผู้พักอาศัย / เจ้าของห้องชุด)\n\nหนังสือฉบับนี้เป็นการบอกกล่าวอย่างเป็นทางการ ขอให้ท่านยุติการกระทำอันก่อให้เกิดเสียงดังรบกวนเกินควร (【{NOISE_TYPES}】) ซึ่งถือเป็นเหตุรำคาญตามพระราชบัญญัติการสาธารณสุข พ.ศ. 2535 และเป็นการละเมิดสิทธิผู้อื่นตามประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 420 และ 1337\n\nข้อมูลเสียงที่บันทึกไว้ได้รับการตรวจสอบความถูกต้องด้วยรหัส SHA-256: {EVIDENCE_ID} ระดับเสียงสูงสุด {PEAK} dB(A) และเฉลี่ย {LEQ} dB(A) ในช่วงเวลา {TIME_RANGE}\n\nขอให้ท่านระงับเหตุรำคาญดังกล่าวโดยเด็ดขาดภายใน 48 ชั่วโมง หากพ้นกำหนด ข้าพเจ้าจำเป็นต้องยื่นเรื่องต่อนิติบุคคลอาคารชุด แจ้งเจ้าพนักงานท้องถิ่น และดำเนินคดีทางแพ่งเพื่อเรียกค่าเสียหายตามกฎหมายต่อไป"
      }
    },
    "ui": {
      "title": "ระบบสร้างหนังสือแจ้งเพื่อนบ้านและบอกกล่าวทางกฎหมาย",
      "subtitle": "อ้างอิงข้อมูลตรวจวัดเสียงจริง · 3 ระดับน้ำเสียง · อ้างอิงบทบัญญัติกฎหมาย 9 ประเทศ",
      "toneLabel": "กลยุทธ์ระดับน้ำเสียง",
      "toneHint": "ลำดับขั้นการสื่อสาร: ขอความร่วมมืออย่างสุภาพ → หนังสือแจ้งเป็นทางการ → หนังสือบอกกล่าวทางกฎหมาย",
      "toneGentle": "ขอความร่วมมืออย่างสุภาพ",
      "toneGentleDesc": "รักษามิตรภาพเพื่อนบ้าน สันนิษฐานว่ามิได้ตั้งใจ ขอความเห็นอกเห็นใจ",
      "toneFirm": "หนังสือแจ้งเป็นทางการ",
      "toneFirmDesc": "แสดงข้อมูลตัวเลขระดับเสียงชัดเจน ชี้แจงผลกระทบต่อการพักผ่อน",
      "toneStrict": "หนังสือบอกกล่าวทางกฎหมาย",
      "toneStrictDesc": "รูปแบบหนังสือโนติสเป็นทางการ อ้างกฎหมายสาธารณสุขและละเมิด ให้เวลาแก้ไข 48 ชม.",
      "lblRecipient": "ผู้รับ / ห้องชุด",
      "lblSender": "ผู้ส่ง / ห้องชุดของท่าน",
      "lblJurisdiction": "เขตอำนาจศาลและภาษา",
      "scenarioLabel": "ประเภทเสียงรบกวน (เลือก)",
      "lblPeak": "ระดับเสียงสูงสุด Lmax",
      "lblAvg": "ระดับเสียงเฉลี่ย LAeq",
      "lblTime": "ช่วงเวลาตรวจวัด",
      "lblHash": "รหัสตรวจสอบความถูกต้อง",
      "articlesTitle": "บทบัญญัติทางกฎหมายและเกณฑ์มาตรฐานที่อ้างอิง",
      "previewLabel": "ตัวอย่างหนังสือแบบเรียลไทม์",
      "previewHint": "จัดรูปแบบอัตโนมัติ · พร้อมพิมพ์ใช้งาน",
      "btnClose": "ปิด",
      "btnCopy": "คัดลอกข้อความ",
      "btnDocx": "ส่งออกเป็น Word (.docx)",
      "btnPdf": "ส่งออกเป็น PDF",
      "copied": "✓ คัดลอกข้อความหนังสือเรียบร้อยแล้ว",
      "date": "วันที่: ",
      "evidence": "รหัสหลักฐาน: ",
      "recipientDefault": "เพื่อนบ้านห้องด้านบน",
      "senderDefault": "เพื่อนบ้านห้องด้านล่าง",
      "thMetric": "ดัชนีชี้วัดทางเสียง",
      "thValue": "ค่าที่ตรวจวัดได้",
      "telemetryHeader": "【ตารางบันทึกข้อมูลหลักฐานทางเสียง】",
      "legalHeader": "【บทบัญญัติกฎหมายและเกณฑ์มาตรฐานที่เกี่ยวข้อง】",
      "lblSign": "ลงชื่อผู้แจ้ง: ",
      "lblSignDate": "วันที่: ",
      "disclaimer": "【ระเบียบวิธีการตรวจวัดทางเสียงและเกณฑ์อ้างอิง】\n1. มาตรฐาน: ตรวจวัดตามมาตรฐาน IEC 61672-1 Class 2 โดยใช้การถ่วงน้ำหนักความถี่แบบ A (A-weighting) และการตอบสนองแบบเร็ว (Fast)\n2. ค่าความคลาดเคลื่อน: ค่าความคลาดเคลื่อนอ้างอิงอยู่ภายใน ±1.5 dB(A) สะท้อนระดับเสียงจริงในจุดรับเสียงอย่างเป็นกลาง\n3. การเก็บหลักฐาน: ประทับเวลาและผนึกด้วยลายนิ้วมือดิจิทัล SHA-256 สำหรับใช้เป็นหลักฐานข้อเท็จจริงทางแพ่ง",
      "gentleNote": "【บันทึกการวัด】บันทึกด้วยมาตรฐาน A-weighting (ความคลาดเคลื่อน ±1.5 dB(A)) เพื่อการประสานงานฉันมิตรระหว่างเพื่อนบ้าน",
      "methodologyHeader": "【ระเบียบวิธีการตรวจวัดทางเสียงและเกณฑ์อ้างอิง】",
      "recipientPlaceholder": "เช่น เพื่อนบ้านห้องด้านบน / ห้อง 402",
      "senderPlaceholder": "เช่น เพื่อนบ้านห้องด้านล่าง / ห้อง 302",
      "badgeFree": "ฟรี"
    }
  },
  "vi": {
    "name": "🇻🇳 Việt Nam (Bộ luật Dân sự 2015 & QCVN 26)",
    "laws": [
      "Bộ luật Dân sự 2015, Điều 172: Nghĩa vụ của chủ sở hữu trong việc thực hiện quyền sở hữu không được gây thiệt hại hoặc làm ảnh hưởng đến quyền, lợi ích hợp pháp của người khác.",
      "Bộ luật Dân sự 2015, Điều 605: Bồi thường thiệt hại do vi phạm quy tắc láng giềng và trật tự xây dựng, sinh hoạt.",
      "Nghị định 45/2022/NĐ-CP: Quy định về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường đối với hành vi gây tiếng ồn vượt quy chuẩn kỹ thuật.",
      "Quy chuẩn kỹ thuật quốc gia QCVN 26:2010/BTNMT về tiếng ồn: Giới hạn tối đa cho phép tại khu vực thông thường từ 21h đến 6h sáng là 45 dBA."
    ],
    "scenarios": {
      "footstep": "Tiếng bước chân nện gót / chạy nhảy thình thịch trên sàn",
      "music": "Tiếng tivi hoặc loa quá lớn / tiếng bass rung tường",
      "dragging": "Tiếng kéo lê bàn ghế, đồ đạc trên sàn đêm muộn",
      "renovation": "Tiếng khoan đục, đóng đinh, sửa chữa ngoài giờ quy định",
      "pet": "Tiếng chó sủa dai dẳng hoặc thú cưng chạy nhảy liên tục",
      "party": "Tụ tập ăn nhậu / la hét, nói chuyện ồn ào đêm khuya"
    },
    "tones": {
      "gentle": {
        "title": "Thư ngỏ thân thiện giữa láng giềng: Về tiếng ồn trong giờ nghỉ ngơi",
        "body": "Kính gửi {RECIPIENT},\n\nTôi xin phép gửi lời chào thân thiện đến Anh/Chị. Do kết cấu cách âm của tòa nhà còn hạn chế, trong khung giờ nghỉ ngơi buổi tối, âm thanh như 【{NOISE_TYPES}】 truyền xuống khá rõ, máy đo ghi nhận mức đỉnh đạt {PEAK} dB(A), gây ảnh hưởng đến giấc ngủ của gia đình tôi.\n\nTôi hiểu rằng Anh/Chị không cố ý và có thể không nhận biết được việc âm thanh bị dội xuống. Rất mong Anh/Chị lưu tâm giảm bớt tiếng ồn vào ban đêm (ví dụ: đi dép bông êm trong nhà hoặc dán đệm chân bàn ghế).\n\nChân thành cảm ơn sự thấu hiểu, thiện chí và tình làng nghĩa xóm của Anh/Chị!"
      },
      "firm": {
        "title": "Thư trao đổi chính thức về việc tiếng ồn sinh hoạt ban đêm vượt ngưỡng",
        "body": "Kính gửi: 【{RECIPIENT}】\n\nTôi gửi thư này để chính thức phản ánh về tình trạng tiếng ồn từ căn hộ của Anh/Chị (【{NOISE_TYPES}】) tiếp tục tái diễn trong giờ nghỉ ngơi ban đêm ({TIME_RANGE}).\n\nDữ liệu đo đạc thực tế ghi nhận mức ồn tương đương (LAeq) là {LEQ} dB(A) và mức ồn đỉnh (Lmax) lên tới {PEAK} dB(A), vượt quá tiêu chuẩn môi trường âm thanh khu dân cư ban đêm và ảnh hưởng nghiêm trọng đến sức khỏe của chúng tôi.\n\nKính đề nghị Anh/Chị có biện pháp kiểm soát tiếng ồn từ 22h00 đến 07h00 sáng. Rất mong vấn đề được giải quyết êm đẹp giữa các hộ dân trước khi phải chuyển lên Ban Quản lý tòa nhà."
      },
      "strict": {
        "title": "THƯ YÊU CẦU CHẤM DỨT HÀNH VI GÂY TIẾNG ỒN VÀ THÔNG BÁO PHÁP LÝ",
        "body": "VĂN BẢN YÊU CẦU CHẤM DỨT HÀNH VI VI PHẠM\n\nKính gửi: 【{RECIPIENT}】 (Người cư trú / Chủ căn hộ)\n\nBằng văn bản này, tôi yêu cầu Anh/Chị CHẤM DỨT NGAY hành vi gây tiếng ồn quá mức (【{NOISE_TYPES}】) từ căn hộ của mình, vi phạm trật tự công cộng và quy định tại Điều 172 Bộ luật Dân sự 2015 cũng như Quy chuẩn kỹ thuật QCVN 26:2010/BTNMT.\n\nChứng cứ âm thanh đã được xác thực mã hóa kỹ thuật số SHA-256: {EVIDENCE_ID}, với mức ồn đỉnh {PEAK} dB(A) và trung bình {LEQ} dB(A) trong khoảng thời gian {TIME_RANGE}.\n\nYêu cầu Anh/Chị chấm dứt triệt để hành vi trong vòng 48 GIỜ kể từ khi nhận được thư này. Nếu tình trạng không chấm dứt, tôi sẽ lập tức báo cáo Ban Quản lý, trình báo Công an lập biên bản xử phạt hành chính và tiến hành khởi kiện dân sự đòi bồi thường thiệt hại."
      }
    },
    "ui": {
      "title": "Trình Tạo Thư Trao Đổi Láng Giềng & Thông Báo Pháp Lý Tiếng Ồn",
      "subtitle": "Dựa trên dữ liệu âm thanh thực tế · 3 sắc thái giao tiếp · Trích dẫn điều luật 9 quốc gia",
      "toneLabel": "Chiến lược sắc thái giao tiếp",
      "toneHint": "Lộ trình giải quyết: Thư ngỏ thân thiện → Trao đổi chính thức → Thông báo pháp lý",
      "toneGentle": "Thư ngỏ thân thiện",
      "toneGentleDesc": "Tôn trọng tình làng nghĩa xóm, giả định không cố ý, kêu gọi sự thông cảm",
      "toneFirm": "Trao đổi chính thức",
      "toneFirmDesc": "Nêu rõ dữ liệu decibel vượt chuẩn, chỉ ra tác động đến giấc ngủ và giới hạn chịu đựng",
      "toneStrict": "Thông báo pháp lý",
      "toneStrictDesc": "Định dạng thông báo pháp lý chuẩn mực, viện dẫn điều luật, thời hạn khắc phục 48h",
      "lblRecipient": "Người nhận / Căn hộ",
      "lblSender": "Người gửi / Căn hộ của bạn",
      "lblJurisdiction": "Hệ thống pháp luật & Ngôn ngữ",
      "scenarioLabel": "Loại tiếng ồn phát sinh (Chọn nhanh)",
      "lblPeak": "Đỉnh âm Lmax",
      "lblAvg": "Mức tương đương LAeq",
      "lblTime": "Khoảng thời gian đo",
      "lblHash": "Mã xác thực số",
      "articlesTitle": "Cơ Sở Pháp Lý & Tiêu Chuẩn Âm Thanh Áp Dụng",
      "previewLabel": "Xem trước văn bản theo thời gian thực",
      "previewHint": "Định dạng tự động · Sẵn sàng in ấn",
      "btnClose": "Đóng",
      "btnCopy": "Sao chép văn bản",
      "btnDocx": "Xuất tệp Word (.docx)",
      "btnPdf": "Xuất tệp PDF",
      "copied": "✓ Đã sao chép toàn bộ văn bản vào bộ nhớ tạm",
      "date": "Ngày: ",
      "evidence": "Mã bằng chứng: ",
      "recipientDefault": "Căn hộ tầng trên",
      "senderDefault": "Căn hộ tầng dưới",
      "thMetric": "Chỉ số âm học",
      "thValue": "Giá trị ghi nhận",
      "telemetryHeader": "【Biên Bản Ghi Nhận Dữ Liệu Đo Âm Học】",
      "legalHeader": "【Điều Khoản Pháp Luật & Tiêu Chuẩn Kỹ Thuật Viện Dẫn】",
      "lblSign": "Chữ ký người gửi: ",
      "lblSignDate": "Ngày: ",
      "disclaimer": "【Phương Pháp Đo Âm Học & Tiêu Chuẩn Áp Dụng】\n1. Tiêu chuẩn: Đo đạc theo tiêu chuẩn IEC 61672-1 Cấp 2, sử dụng thang đo trọng số A (A-weighting) và đáp ứng thời gian Nhanh (Fast).\n2. Sai số: Dung sai đo tham chiếu trong phạm vi ±1,5 dB(A), phản ánh khách quan mức áp suất âm thực tế tại điểm đo.\n3. Giá trị chứng cứ: Dữ liệu được gắn dấu thời gian và mã hóa dấu vân tay số SHA-256, có giá trị chứng cứ thực tế trong tố tụng dân sự.",
      "gentleNote": "【Ghi chú đo đạc】Đo theo trọng số A tiêu chuẩn (sai số tham chiếu ±1,5 dB(A)). Dùng cho mục đích trao đổi thiện chí giữa các hộ dân.",
      "methodologyHeader": "【Phương Pháp Đo Âm Học & Tiêu Chuẩn Áp Dụng】",
      "recipientPlaceholder": "Ví dụ: Căn hộ tầng trên / Phòng 402",
      "senderPlaceholder": "Ví dụ: Căn hộ tầng dưới / Phòng 302",
      "badgeFree": "Miễn phí"
    }
  }
};

  // --- XML & ZIP Utilities (Pure JS OpenXML Docx Builder) ---
  function escapeXml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function makeCrcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[n] = c >>> 0;
    }
    return table;
  }
  const crcTable = makeCrcTable();

  function crc32(bytes) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function buildZip(files) {
    const encoder = new TextEncoder();
    const fileEntries = files.map(function (f) {
      const dataBytes = typeof f.content === 'string' ? encoder.encode(f.content) : new Uint8Array(f.content);
      const nameBytes = encoder.encode(f.name);
      const fileCrc = crc32(dataBytes);
      return {
        name: f.name,
        nameBytes: nameBytes,
        data: dataBytes,
        crc: fileCrc,
        size: dataBytes.length
      };
    });

    const now = new Date();
    const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xFFFF;
    const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xFFFF;

    let totalSize = 0;
    for (let i = 0; i < fileEntries.length; i++) {
      totalSize += 30 + fileEntries[i].nameBytes.length + fileEntries[i].size;
      totalSize += 46 + fileEntries[i].nameBytes.length;
    }
    totalSize += 22;

    const buf = new Uint8Array(totalSize);
    const view = new DataView(buf.buffer);
    let pos = 0;

    const localOffsets = [];
    for (let j = 0; j < fileEntries.length; j++) {
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
    }

    const cdOffset = pos;
    for (let k = 0; k < fileEntries.length; k++) {
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
    }
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
  }

  function buildDocxBlob(notice) {
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

    const paragraphs = (notice.body || '').split(/\n\s*\n/).map(function (pText) {
      const lines = pText.split('\n').map(function (l) {
        return '<w:r><w:t xml:space="preserve">' + escapeXml(l) + '</w:t></w:r>';
      }).join('<w:r><w:br/></w:r>');
      return '<w:p><w:pPr><w:spacing w:line="320" w:lineRule="auto" w:after="160"/></w:pPr>' + lines + '</w:p>';
    }).join('');

    const isGentle = (notice.tone === 'gentle');

    let middleContentXml = '';
    if (isGentle) {
      // 温和友善便条：仅附轻量实测说明，无需罗列冗长法条与严厉表格
      if (notice.gentleNote) {
        middleContentXml += '<w:p><w:pPr><w:spacing w:before="240" w:after="160"/><w:ind w:left="240" w:right="240"/></w:pPr>' +
          '<w:r><w:rPr><w:sz w:val="20"/><w:color w:val="475569"/></w:rPr>' +
          '<w:t xml:space="preserve">' + escapeXml(notice.gentleNote) + '</w:t></w:r></w:p>';
      }
    } else {
      // 正式理性交涉与严正法务催告：附带现场声学测量数据表、依据标准与法定法条
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

      let articlesXml = '';
      if (Array.isArray(notice.articles) && notice.articles.length) {
        const artLines = notice.articles.map(function (art) {
          return '<w:p><w:pPr><w:spacing w:after="80"/><w:ind w:left="240"/></w:pPr>' +
            '<w:r><w:rPr><w:b/><w:color w:val="1E293B"/></w:rPr><w:t xml:space="preserve">§ </w:t></w:r>' +
            '<w:r><w:rPr><w:color w:val="334155"/></w:rPr><w:t xml:space="preserve">' + escapeXml(art) + '</w:t></w:r></w:p>';
        }).join('');
        articlesXml = '<w:p><w:pPr><w:spacing w:before="240" w:after="100"/></w:pPr>' +
          '<w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr>' +
          '<w:t>' + escapeXml(notice.legalHeader || 'Statutory Provisions Cited') + '</w:t></w:r></w:p>' +
          artLines;
      }

      let methodologyXml = '';
      if (notice.disclaimer) {
        const discLines = notice.disclaimer.split('\n');
        methodologyXml = '<w:p><w:pPr><w:spacing w:before="220" w:after="80"/></w:pPr>' +
          '<w:r><w:rPr><w:b/><w:sz w:val="22"/><w:color w:val="0F172A"/></w:rPr>' +
          '<w:t>' + escapeXml(notice.methodologyHeader || 'Acoustic Methodology & Reference Standards') + '</w:t></w:r></w:p>' +
          discLines.map(function (l) {
            return '<w:p><w:pPr><w:spacing w:after="50"/><w:ind w:left="200"/></w:pPr>' +
              '<w:r><w:rPr><w:sz w:val="19"/><w:color w:val="475569"/></w:rPr>' +
              '<w:t xml:space="preserve">' + escapeXml(l) + '</w:t></w:r></w:p>';
          }).join('');
      }

      middleContentXml = '<w:p><w:pPr><w:spacing w:before="240" w:after="100"/></w:pPr>' +
        '<w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.telemetryHeader || 'Acoustic Telemetry Log') + '</w:t></w:r></w:p>' +
        telemetryTableXml +
        methodologyXml +
        articlesXml;
    }

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
      middleContentXml +
      '<w:p><w:pPr><w:spacing w:before="320" w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblSign || 'Signature: ') + escapeXml(notice.sender || '') + '</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblSignDate || 'Date: ') + escapeXml(notice.date) + '</w:t></w:r></w:p>' +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>' +
      '</w:body></w:document>';

    const zipBytes = buildZip([
      { name: '[Content_Types].xml', content: contentTypesXml },
      { name: '_rels/.rels', content: relsXml },
      { name: 'word/_rels/document.xml.rels', content: docRelsXml },
      { name: 'word/styles.xml', content: stylesXml },
      { name: 'word/document.xml', content: documentXml }
    ]);

    return typeof Blob !== 'undefined'
      ? new Blob([zipBytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      : zipBytes;
  }

  function getJurisdictionName(jurKey, lang) {
    const isZh = typeof lang === 'string' && lang.toLowerCase().startsWith('zh');
    const namesZh = {
      zh: "🇨🇳 中国 (民法典第288条相邻权 & 噪声污染防治法)",
      en: "🇺🇸/🇬🇧 欧美英美法系 (Common Law & Quiet Enjoyment)",
      de: "🇩🇪 德国 (BGB §906 & TA Lärm 宁静权)",
      fr: "🇫🇷 法国 (Code civil & Trouble anormal de voisinage 扰民法典)",
      es: "🇪🇸 西班牙/拉美 (Ley del Ruido 噪音法)",
      ja: "🇯🇵 日本 (民法相隣関係 & 受忍限度論)",
      ko: "🇰🇷 韩国 (共同住宅管理法 & 楼层噪音基准)",
      th: "🇹🇭 泰国 (公共卫生法 พ.ร.บ.การสาธารณสุข & ป.พ.พ.)",
      vi: "🇻🇳 越南 (民法典 Bộ luật Dân sự 2015 & QCVN 26)"
    };
    const namesEn = {
      zh: "🇨🇳 China (Civil Code & Noise Pollution Prevention Law)",
      en: "🇺🇸/🇬🇧 US & UK (Common Law & Quiet Enjoyment)",
      de: "🇩🇪 Germany (BGB §906 & TA Lärm Quiet Standards)",
      fr: "🇫🇷 France (Code civil & Neighbor Nuisance Regulations)",
      es: "🇪🇸 Spain & LatAm (Ley del Ruido & Horizontal Property)",
      ja: "🇯🇵 Japan (Civil Code Neighbor Relations & Tolerable Limits)",
      ko: "🇰🇷 South Korea (Multi-Family Housing Management Act & Floor Noise)",
      th: "🇹🇭 Thailand (Public Health Act & Civil/Commercial Code)",
      vi: "🇻🇳 Vietnam (Civil Code 2015 & National Noise Regulations)"
    };
    if (isZh) return namesZh[jurKey] || LEGAL_DATA[jurKey]?.name || jurKey;
    return namesEn[jurKey] || LEGAL_DATA[jurKey]?.name || jurKey;
  }

  // --- UI Component & Runtime State ---
  let modalEl = null;
  let currentLang = 'en';
  let currentTone = 'gentle';
  let selectedScenarios = new Set(['footstep']);
  let userTier = 'free'; // 'free' | 'single' | 'pro'
  let currentRecord = null;
  let upgradeCallback = null;

  function ensureModal() {
    if (modalEl) return modalEl;

    let el = document.getElementById('legalNoticeModal');
    if (!el) {
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
              <h3 class="lnm-title" id="lnmTitle">Neighbor Notice & Statutory Demand Generator</h3>
              <p class="lnm-subtitle" id="lnmSubtitle">Backed by Verified Acoustic Telemetry · 3 Tones · 9 Global Legal Jurisdictions</p>
            </div>
          </div>
          <button type="button" class="lnm-close-btn" id="lnmCloseBtn" aria-label="Close">×</button>
        </div>

        <div class="lnm-body">
          <!-- Section: Tone Selection -->
          <div class="lnm-tone-section">
            <div class="lnm-section-label">
              <span id="lnmToneLabel">Communication Strategy</span>
              <span id="lnmToneHint" style="font-size:10.5px;color:#64748b;font-weight:normal;">Escalation Path: Friendly Reminder → Formal Negotiation → Statutory Demand</span>
            </div>
            <div class="lnm-tone-grid">
              <!-- Gentle Card -->
              <div class="lnm-tone-card tone-gentle active" data-tone="gentle">
                <div class="lnm-tone-header">
                  <span>🌱</span>
                  <span id="lnmToneGentleTitle">Gentle Friendly Reminder</span>
                  <span class="lnm-free-badge" style="font-size:9.5px;background:rgba(34,197,94,0.2);color:#4ade80;padding:1px 6px;border-radius:10px;margin-left:auto;">FREE</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneGentleDesc">Good neighbor approach, assumes unintentional, asks for cooperative mindfulness</div>
              </div>
              <!-- Firm Card -->
              <div class="lnm-tone-card tone-firm" data-tone="firm">
                <div class="lnm-tone-header">
                  <span>⚖️</span>
                  <span id="lnmToneFirmTitle">Firm Rational Negotiation</span>
                  <span class="lnm-lock-badge" id="lnmLockFirm" style="font-size:9.5px;background:rgba(59,130,246,0.2);color:#60a5fa;padding:1px 6px;border-radius:10px;margin-left:auto;">🔒 PRO</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneFirmDesc">Presents empirical exceedance data, outlines sleep disturbance and clear boundaries</div>
              </div>
              <!-- Strict Card -->
              <div class="lnm-tone-card tone-strict" data-tone="strict">
                <div class="lnm-tone-header">
                  <span>🛑</span>
                  <span id="lnmToneStrictTitle">Strict Statutory Demand</span>
                  <span class="lnm-lock-badge" id="lnmLockStrict" style="font-size:9.5px;background:rgba(239,68,68,0.2);color:#f87171;padding:1px 6px;border-radius:10px;margin-left:auto;">🔒 PRO</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneStrictDesc">Formal legal notice format, cites statutory codes, issues 48h cure deadline</div>
              </div>
            </div>
          </div>

          <!-- Section: Parameters Grid -->
          <div class="lnm-form-grid">
            <div class="lnm-field">
              <label id="lnmLblRecipient" for="lnmInputRecipient">Recipient / Resident</label>
              <input type="text" class="lnm-input" id="lnmInputRecipient" value="Upstairs Neighbor" placeholder="e.g. Upstairs Neighbor / Apt 402">
            </div>
            <div class="lnm-field">
              <label id="lnmLblSender" for="lnmInputSender">Sender / Your Name/Unit</label>
              <input type="text" class="lnm-input" id="lnmInputSender" value="Downstairs Neighbor" placeholder="e.g. Downstairs Neighbor / Apt 302">
            </div>
            <div class="lnm-field">
              <label id="lnmLblJurisdiction" for="lnmSelectJurisdiction">Legal Jurisdiction & Language (9 Jurisdictions)</label>
              <select class="lnm-select" id="lnmSelectJurisdiction"></select>
            </div>
          </div>

          <!-- Section: Scenario Chips -->
          <div class="lnm-scenarios-section">
            <div class="lnm-section-label" id="lnmScenarioLabel">Noise Categories (Select Applicable)</div>
            <div class="lnm-chips-wrap" id="lnmChipsWrap"></div>
          </div>

          <!-- Section: Live Preview Box -->
          <div class="lnm-preview-wrap">
            <div class="lnm-section-label" style="display:flex;justify-content:space-between;">
              <span id="lnmPreviewLabel">Document Live Preview</span>
              <span id="lnmPreviewHint" style="font-size:10.5px;color:#64748b;font-weight:normal;">WYSIWYG · Formatted Legal Draft</span>
            </div>
            <div class="lnm-preview-box" id="lnmPreviewBox">
              <div class="lnm-preview-header">
                <div style="font-size:10px;letter-spacing:0.1em;color:#64748b;margin-bottom:2px;">SOUNDTEST.PRO · CIVILIAN ACOUSTIC EVIDENCE CHAIN</div>
                <div class="lnm-preview-title" id="lnmDocTitle">Friendly Neighborhood Note: Sound & Rest Hours</div>
                <div class="lnm-preview-meta">
                  <span id="lnmMetaRecipient">Recipient: Upstairs Neighbor</span>
                  <span id="lnmMetaSender">Sender: Downstairs Neighbor</span>
                  <span id="lnmMetaDate">Date: 2026-10-09</span>
                </div>
              </div>
              <div class="lnm-preview-body" id="lnmDocBody"></div>

              <!-- Acoustic Telemetry Badge Row -->
              <div class="lnm-telemetry-badge-row" id="lnmTelemetryBadgeRow">
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblPeak">Recorded Peak Lmax</span>
                  <span class="lnm-tb-val val-red" id="lnmValPeak">-- dB</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblAvg">Equivalent LAeq</span>
                  <span class="lnm-tb-val val-blue" id="lnmValAvg">-- dB</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblTime">Monitored Window</span>
                  <span class="lnm-tb-val val-cyan" id="lnmValTime" style="font-size:11.5px;">--:-- - --:--</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblHash">Audit Fingerprint</span>
                  <span class="lnm-tb-val" id="lnmValHash" style="font-size:10px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">SHA-256...</span>
                </div>
              </div>

              <!-- Cited Articles Box -->
              <div class="lnm-articles-box" id="lnmArticlesBox">
                <div class="lnm-articles-title" id="lnmArticlesTitle">
                  <span>⚖️</span>
                  <span id="lnmArticlesHeaderTitle">Statutory Provisions & Jurisdictional Standards Cited</span>
                </div>
                <div id="lnmArticlesList"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="lnm-footer">
          <div class="lnm-footer-left">
            <button type="button" class="lnm-btn lnm-btn-cancel" id="lnmBtnCancel">Close</button>
          </div>
          <div class="lnm-footer-right">
            <button type="button" class="lnm-btn lnm-btn-copy" id="lnmBtnCopy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span id="lnmBtnCopyText">Copy Text</span>
            </button>
            <button type="button" class="lnm-btn lnm-btn-docx" id="lnmBtnDocx">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span id="lnmBtnDocxText">Export Word (.docx)</span>
              <span id="lnmDocxLockBadge" style="display:none;font-size:9.5px;background:rgba(255,255,255,0.25);padding:1px 5px;border-radius:6px;margin-left:4px;">🔒 PRO</span>
            </button>
          </div>
        </div>
      </div>
      `;
      document.body.appendChild(el);
      bindModalEvents(el);
    }
    modalEl = el;
    return modalEl;
  }

  function bindModalEvents(el) {
    // Close button & Cancel button
    const closeBtn = el.querySelector('#lnmCloseBtn');
    const cancelBtn = el.querySelector('#lnmBtnCancel');
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    // Click backdrop to close
    el.onclick = function (e) {
      if (e.target === el) closeModal();
    };

    // ESC key to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && el.classList.contains('show')) {
        closeModal();
      }
    });

    // Tone cards
    const toneCards = el.querySelectorAll('.lnm-tone-card');
    toneCards.forEach(function (card) {
      card.onclick = function () {
        const toneKey = card.getAttribute('data-tone');
        if (userTier === 'free' && toneKey !== 'gentle') {
          handleUpgradeTrigger('tone_' + toneKey);
          return;
        }
        currentTone = toneKey;
        toneCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        renderPreview();
      };
    });

    // Jurisdiction select
    const select = el.querySelector('#lnmSelectJurisdiction');
    if (select) {
      select.onchange = function () {
        currentLang = select.value;
        const conf = LEGAL_DATA[currentLang];
        if (conf && conf.ui) {
          const inputRec = el.querySelector('#lnmInputRecipient');
          const inputSnd = el.querySelector('#lnmInputSender');
          if (inputRec && conf.ui.recipientDefault) inputRec.value = conf.ui.recipientDefault;
          if (inputSnd && conf.ui.senderDefault) inputSnd.value = conf.ui.senderDefault;
        }
        renderFullUi();
        renderPreview();
      };
    }

    // Inputs live update
    const recInput = el.querySelector('#lnmInputRecipient');
    const sndInput = el.querySelector('#lnmInputSender');
    if (recInput) recInput.oninput = renderPreview;
    if (sndInput) sndInput.oninput = renderPreview;

    // Copy button
    const copyBtn = el.querySelector('#lnmBtnCopy');
    if (copyBtn) {
      copyBtn.onclick = function () {
        const docData = compileDocumentData();
        const fullText = buildPlainText(docData);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(fullText).then(function () {
            showNoticeToast(LEGAL_DATA[currentLang]?.ui?.copied || '✓ Text copied to clipboard');
          }).catch(function () {
            fallbackCopy(fullText);
          });
        } else {
          fallbackCopy(fullText);
        }
      };
    }

    // DOCX Export button
    const docxBtn = el.querySelector('#lnmBtnDocx');
    if (docxBtn) {
      docxBtn.onclick = function () {
        if (userTier === 'free') {
          handleUpgradeTrigger('docx_export');
          return;
        }
        const docData = compileDocumentData();
        const blob = buildDocxBlob(docData);
        const fileName = (docData.title || 'SoundTest-Dispute-Notice').replace(/[\\/:*?"<>|\s]+/g, '_') + '.docx';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showNoticeToast(currentLang === 'zh' ? '✓ Word 格式交涉函导出成功' : '✓ Word (.docx) document exported');
      };
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showNoticeToast(LEGAL_DATA[currentLang]?.ui?.copied || '✓ Copied to clipboard');
    } catch (err) {
      alert('Failed to copy');
    }
    document.body.removeChild(ta);
  }

  function showNoticeToast(msg) {
    if (typeof window.toast === 'function') {
      window.toast(msg, 'info', 3500);
      return;
    }
    let toastEl = document.getElementById('lnmToast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'lnmToast';
      toastEl.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;z-index:10010;box-shadow:0 8px 24px rgba(0,0,0,0.5);transition:opacity 0.2s;';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    toastEl.style.opacity = '1';
    setTimeout(function () {
      toastEl.style.opacity = '0';
      setTimeout(() => { toastEl.style.display = 'none'; }, 200);
    }, 3000);
  }

  function handleUpgradeTrigger(reason) {
    if (typeof upgradeCallback === 'function') {
      upgradeCallback(reason, currentTone);
      return;
    }
    if (typeof window.openProUpgradeModal === 'function') {
      window.openProUpgradeModal();
      return;
    }
    if (typeof window.openWeChatPayModal === 'function') {
      window.openWeChatPayModal('single');
      return;
    }
    alert('PRO Feature: Upgrading unlocks Formal Notices, Cease & Desist Letters, and Word (.docx) Exports.');
  }

  function renderFullUi() {
    const el = ensureModal();
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.en || LEGAL_DATA.zh;
    const ui = conf.ui || {};

    // Titles
    const tTitle = el.querySelector('#lnmTitle');
    const tSub = el.querySelector('#lnmSubtitle');
    if (tTitle) tTitle.textContent = ui.title || (currentLang === 'zh' ? '邻里沟通函与法定催告函生成器' : 'Neighbor Notice & Statutory Demand Generator');
    if (tSub) tSub.textContent = ui.subtitle || (currentLang === 'zh' ? '基于真实声学存证数据 · 3种沟通语气 · 9国/地区法律条文智能援引' : 'Backed by Verified Acoustic Telemetry · 3 Tones · 9 Global Legal Jurisdictions');

    // Tone labels
    const tLbl = el.querySelector('#lnmToneLabel');
    const tHnt = el.querySelector('#lnmToneHint');
    if (tLbl) tLbl.textContent = ui.toneLabel || (currentLang === 'zh' ? '沟通语气策略' : 'Communication Strategy');
    if (tHnt) tHnt.textContent = ui.toneHint || (currentLang === 'zh' ? '阶梯式维权：温和提醒 → 理性交涉 → 严正催告' : 'Escalation Path: Friendly Reminder → Formal Negotiation → Statutory Demand');

    // Free Badge
    const badgeFree = el.querySelector('.lnm-free-badge');
    if (badgeFree) {
      badgeFree.textContent = ui.badgeFree || (currentLang === 'zh' ? '免费开放' : 'Free');
    }

    // Tone cards text
    const tgT = el.querySelector('#lnmToneGentleTitle');
    const tgD = el.querySelector('#lnmToneGentleDesc');
    const tfT = el.querySelector('#lnmToneFirmTitle');
    const tfD = el.querySelector('#lnmToneFirmDesc');
    const tsT = el.querySelector('#lnmToneStrictTitle');
    const tsD = el.querySelector('#lnmToneStrictDesc');
    if (tgT) tgT.textContent = ui.toneGentle || (currentLang === 'zh' ? '温和友善提醒' : 'Gentle Friendly Reminder');
    if (tgD) tgD.textContent = ui.toneGentleDesc || '';
    if (tfT) tfT.textContent = ui.toneFirm || (currentLang === 'zh' ? '正式理性交涉' : 'Firm Rational Negotiation');
    if (tfD) tfD.textContent = ui.toneFirmDesc || '';
    if (tsT) tsT.textContent = ui.toneStrict || (currentLang === 'zh' ? '严正法务催告' : 'Strict Statutory Demand');
    if (tsD) tsD.textContent = ui.toneStrictDesc || '';

    // Form labels and inputs
    const lRec = el.querySelector('#lnmLblRecipient');
    const lSnd = el.querySelector('#lnmLblSender');
    const lJur = el.querySelector('#lnmLblJurisdiction');
    const lScn = el.querySelector('#lnmScenarioLabel');
    if (lRec) lRec.textContent = ui.lblRecipient || (currentLang === 'zh' ? '受函方称呼' : 'Recipient / Resident');
    if (lSnd) lSnd.textContent = ui.lblSender || (currentLang === 'zh' ? '发函方署名' : 'Sender / Your Name/Unit');
    if (lJur) lJur.textContent = ui.lblJurisdiction || (currentLang === 'zh' ? '法律法域与语言' : 'Legal Jurisdiction & Language');
    if (lScn) lScn.textContent = ui.scenarioLabel || (currentLang === 'zh' ? '常见噪音类型' : 'Noise Categories (Select Applicable)');

    const inRec = el.querySelector('#lnmInputRecipient');
    const inSnd = el.querySelector('#lnmInputSender');
    if (inRec && ui.recipientPlaceholder) inRec.placeholder = ui.recipientPlaceholder;
    if (inSnd && ui.senderPlaceholder) inSnd.placeholder = ui.senderPlaceholder;

    // Preview Labels
    const pLbl = el.querySelector('#lnmPreviewLabel');
    const pHnt = el.querySelector('#lnmPreviewHint');
    if (pLbl) pLbl.textContent = ui.previewLabel || (currentLang === 'zh' ? '文书实时预览' : 'Document Live Preview');
    if (pHnt) pHnt.textContent = ui.previewHint || (currentLang === 'zh' ? '所见即所得 · 自动排版' : 'WYSIWYG · Formatted Legal Draft');

    const artHeaderTitle = el.querySelector('#lnmArticlesHeaderTitle');
    if (artHeaderTitle) artHeaderTitle.textContent = ui.legalHeaderTitle || ui.articlesTitle || (currentLang === 'zh' ? '法定法规依据与法律条文' : 'Statutory Provisions & Legal Standards Cited');

    // Telemetry labels
    const lp = el.querySelector('#lnmLblPeak');
    const la = el.querySelector('#lnmLblAvg');
    const lt = el.querySelector('#lnmLblTime');
    const lh = el.querySelector('#lnmLblHash');
    if (lp) lp.textContent = ui.lblPeak || (currentLang === 'zh' ? '实测峰值 Lmax' : 'Recorded Peak Lmax');
    if (la) la.textContent = ui.lblAvg || (currentLang === 'zh' ? '等效均值 LAeq' : 'Equivalent LAeq');
    if (lt) lt.textContent = ui.lblTime || (currentLang === 'zh' ? '监测时段' : 'Monitored Window');
    if (lh) lh.textContent = ui.lblHash || (currentLang === 'zh' ? '数字存证指纹' : 'Audit Fingerprint');

    // Button labels
    const bCp = el.querySelector('#lnmBtnCopyText');
    const bDx = el.querySelector('#lnmBtnDocxText');
    const bCn = el.querySelector('#lnmBtnCancel');
    if (bCp) bCp.textContent = ui.btnCopy || (currentLang === 'zh' ? '复制文本' : 'Copy Text');
    if (bDx) bDx.textContent = ui.btnDocx || (currentLang === 'zh' ? '导出 Word (.docx)' : 'Export Word (.docx)');
    if (bCn) bCn.textContent = ui.btnClose || (currentLang === 'zh' ? '关闭' : 'Close');

    // Populate Jurisdiction select options localized to currentLang
    const select = el.querySelector('#lnmSelectJurisdiction');
    if (select) {
      select.innerHTML = '';
      Object.keys(LEGAL_DATA).forEach(function (k) {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = getJurisdictionName(k, currentLang);
        if (k === currentLang) opt.selected = true;
        select.appendChild(opt);
      });
      select.value = currentLang;
    }

    // Populate scenario chips
    const chipsWrap = el.querySelector('#lnmChipsWrap');
    if (chipsWrap) {
      chipsWrap.innerHTML = '';
      const scMap = conf.scenarios || {};
      Object.keys(scMap).forEach(function (k) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'lnm-chip' + (selectedScenarios.has(k) ? ' active' : '');
        chip.setAttribute('data-scenario-key', k);
        chip.innerHTML = '<span>' + (getScenarioIcon(k)) + '</span><span>' + escapeXml(scMap[k]) + '</span>';
        chip.onclick = function () {
          if (selectedScenarios.has(k)) {
            if (selectedScenarios.size > 1) selectedScenarios.delete(k);
          } else {
            selectedScenarios.add(k);
          }
          chip.classList.toggle('active', selectedScenarios.has(k));
          renderPreview();
        };
        chipsWrap.appendChild(chip);
      });
    }

    // Lock badges depending on user tier
    syncTierUi(el);
  }

  function getScenarioIcon(k) {
    const icons = {
      footstep: '👣',
      music: '🔊',
      dragging: '🪑',
      renovation: '🔨',
      pet: '🐕',
      party: '🎉'
    };
    return icons[k] || '⚠️';
  }

  function syncTierUi(el) {
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
  }

  function compileDocumentData() {
    const el = ensureModal();
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.en || LEGAL_DATA.zh;
    const toneObj = conf.tones?.[currentTone] || conf.tones?.gentle || {};
    const ui = conf.ui || {};

    const rec = currentRecord || {};
    const peakDb = rec.peakDb || '72.4';
    const avgDb = rec.avgDb || '58.6';
    const timeRange = rec.timeRange || (formatCurrentTimeRange());
    const evidenceId = rec.evidenceId || ('STP-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    const location = rec.location || 'Residential Unit';
    const dateStr = rec.date || (new Date().toISOString().slice(0, 10));

    const recipientInput = el.querySelector('#lnmInputRecipient');
    const senderInput = el.querySelector('#lnmInputSender');
    const defaultRecipient = ui.recipientDefault || (currentLang === 'zh' ? '楼上邻居' : 'Upstairs Neighbor');
    const defaultSender = ui.senderDefault || (currentLang === 'zh' ? '楼下邻居' : 'Downstairs Neighbor');
    const recipient = (recipientInput?.value || defaultRecipient).trim();
    const sender = (senderInput?.value || defaultSender).trim();

    // Clean recipient string for natural greeting (remove mechanical prefixes and honorific duplicates)
    let cleanRecipient = recipient;
    if (currentLang === 'zh') {
      cleanRecipient = cleanRecipient.replace(/^(尊重的|尊敬的|亲爱的)/, '').trim();
      cleanRecipient = cleanRecipient.replace(/[，,：:\s]*(您好|你好)[！!。]?\s*$/, '').trim();
      if (!cleanRecipient) cleanRecipient = '楼上邻居';
    } else if (currentLang === 'en') {
      cleanRecipient = cleanRecipient.replace(/^(Dear|To:?)\s+/i, '').trim();
      cleanRecipient = cleanRecipient.replace(/[,:!]+$/, '').trim();
      if (!cleanRecipient) cleanRecipient = 'Upstairs Neighbor';
    } else if (currentLang === 'de') {
      cleanRecipient = cleanRecipient.replace(/^(Liebe\(r\)|Liebe\s+Nachbarn|Liebe|Lieber|Hallo|An\s+die\s+Nachbarn|An:?)\s+/i, '').trim();
      cleanRecipient = cleanRecipient.replace(/[,:!]+$/, '').trim();
      if (!cleanRecipient) cleanRecipient = 'Nachbarn oben';
    } else if (currentLang === 'fr') {
      cleanRecipient = cleanRecipient.replace(/^(Chers?\s+voisins?|Bonjour|À\s+l'attention\s+de:?)\s*/i, '').trim();
      cleanRecipient = cleanRecipient.replace(/[,:!]+$/, '').trim();
      if (!cleanRecipient) cleanRecipient = 'Voisins du dessus';
    } else if (currentLang === 'es') {
      cleanRecipient = cleanRecipient.replace(/^(Estimados?\s+vecinos?|Estimado\/a|Hola|A\s+la\s+atención\s+de:?)\s*/i, '').trim();
      cleanRecipient = cleanRecipient.replace(/[,:!]+$/, '').trim();
      if (!cleanRecipient) cleanRecipient = 'Vecinos de arriba';
    } else if (currentLang === 'ja') {
      cleanRecipient = cleanRecipient.replace(/^(親愛なる|拝啓\s*)/, '').trim();
      cleanRecipient = cleanRecipient.replace(/[様殿へ\s]+$/, '').trim();
      if (!cleanRecipient) cleanRecipient = '上階のお部屋の方';
    } else if (currentLang === 'ko') {
      cleanRecipient = cleanRecipient.replace(/^(친애하는|수신:?\s*)/, '').trim();
      cleanRecipient = cleanRecipient.replace(/[\s,:]*(님|귀하|께)[!.]*\s*$/, '').trim();
      if (!cleanRecipient) cleanRecipient = '위층 이웃 주민';
    } else if (currentLang === 'th') {
      cleanRecipient = cleanRecipient.replace(/^(เรียน|ถึง)\s*/, '').trim();
      cleanRecipient = cleanRecipient.replace(/[,:!]+$/, '').trim();
      if (!cleanRecipient) cleanRecipient = 'เพื่อนบ้านห้องด้านบน';
    } else if (currentLang === 'vi') {
      cleanRecipient = cleanRecipient.replace(/^(Kính\s+gửi|Chào|Thân\s+gửi)\s*/i, '').trim();
      cleanRecipient = cleanRecipient.replace(/[,:!]+$/, '').trim();
      if (!cleanRecipient) cleanRecipient = 'Căn hộ tầng trên';
    }

    // Noise types string
    const scMap = conf.scenarios || {};
    const noiseList = Array.from(selectedScenarios).map(k => scMap[k] || k);
    const sep = (currentLang === 'zh' || currentLang === 'ja') ? '、' : ', ';
    const fallbackNoise = (currentLang === 'zh') ? '生活撞击声' : 'residential impact noise';
    const noiseTypes = noiseList.join(sep) || fallbackNoise;

    // Replace template variables
    let bodyText = toneObj.body || '';
    bodyText = bodyText.replace(/\{NOISE_TYPES\}/g, noiseTypes)
      .replace(/\{PEAK\}/g, peakDb)
      .replace(/\{LEQ\}/g, avgDb)
      .replace(/\{TIME_RANGE\}/g, timeRange)
      .replace(/\{EVIDENCE_ID\}/g, evidenceId)
      .replace(/\{RECIPIENT\}/g, cleanRecipient)
      .replace(/\{SENDER\}/g, sender)
      .replace(/\{LOCATION\}/g, location)
      .replace(/\{DATE\}/g, dateStr);

    return {
      title: toneObj.title || 'CIVILIAN DISPUTE NOTICE',
      recipient: cleanRecipient,
      sender: sender,
      date: dateStr,
      location: location,
      peakDb: peakDb,
      avgDb: avgDb,
      timeRange: timeRange,
      evidenceId: evidenceId,
      body: bodyText,
      articles: conf.laws || [],
      tone: currentTone,
      gentleNote: ui.gentleNote || '',
      methodologyHeader: ui.methodologyHeader || (currentLang === 'zh' ? '【声学测量方法与依据标准】' : '【Acoustic Methodology & Reference Standards】'),
      lblRecipient: ui.metaRecipient || (currentLang === 'zh' ? '受函方：' : (ui.lblRecipient ? ui.lblRecipient + ': ' : 'Recipient: ')),
      lblSender: ui.metaSender || (currentLang === 'zh' ? '发函方：' : (ui.lblSender ? ui.lblSender + ': ' : 'Sender: ')),
      lblDate: ui.date || (currentLang === 'zh' ? '日期：' : 'Date: '),
      lblPeak: ui.lblPeak || (currentLang === 'zh' ? '实测峰值 Lmax' : 'Recorded Peak Lmax'),
      lblAvg: ui.lblAvg || (currentLang === 'zh' ? '等效均值 LAeq' : 'Equivalent LAeq'),
      lblTime: ui.lblTime || (currentLang === 'zh' ? '监测时段' : 'Monitored Window'),
      lblHash: ui.lblHash || (currentLang === 'zh' ? '数字存证指纹' : 'Audit Fingerprint'),
      thMetric: ui.thMetric || (currentLang === 'zh' ? '声学监测指标' : 'Acoustic Metric'),
      thValue: ui.thValue || (currentLang === 'zh' ? '实测读数' : 'Recorded Value'),
      telemetryHeader: ui.telemetryHeader || (currentLang === 'zh' ? '【现场声学测量数据证据表】' : '【Acoustic Telemetry Log】'),
      legalHeader: ui.legalHeader || (currentLang === 'zh' ? '【法定法规条文与法律依据】' : '【Statutory Provisions & Legal Standards Cited】'),
      lblSign: ui.lblSign || (currentLang === 'zh' ? '通知方签署: ' : 'Sender Signature: '),
      lblSignDate: ui.lblSignDate || (currentLang === 'zh' ? '签署日期: ' : 'Signed Date: '),
      disclaimer: ui.disclaimer || ''
    };
  }

  function formatMetaItem(lbl, val) {
    const l = lbl || '';
    if (!l) return val || '';
    if (l.endsWith(' ') || l.endsWith('：')) return l + (val || '');
    return l + ' ' + (val || '');
  }

  function formatCurrentTimeRange() {
    const d = new Date();
    const endH = String(d.getHours()).padStart(2, '0');
    const endM = String(d.getMinutes()).padStart(2, '0');
    const startD = new Date(d.getTime() - 90 * 60000);
    const startH = String(startD.getHours()).padStart(2, '0');
    const startM = String(startD.getMinutes()).padStart(2, '0');
    return `${startH}:${startM} - ${endH}:${endM}`;
  }

  function renderPreview() {
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
    const artBox = el.querySelector('#lnmArticlesBox');

    if (tEl) tEl.textContent = doc.title;
    if (bEl) bEl.textContent = doc.body;
    if (rEl) rEl.textContent = formatMetaItem(doc.lblRecipient || (currentLang === 'zh' ? '受函方：' : 'To: '), doc.recipient);
    if (sEl) sEl.textContent = formatMetaItem(doc.lblSender || (currentLang === 'zh' ? '发函方：' : 'From: '), doc.sender);
    if (dEl) dEl.textContent = formatMetaItem(doc.lblDate || (currentLang === 'zh' ? '日期：' : 'Date: '), doc.date);

    if (vpEl) vpEl.textContent = doc.peakDb + ' dB(A)';
    if (vaEl) vaEl.textContent = doc.avgDb + ' dB(A)';
    if (vtEl) vtEl.textContent = doc.timeRange;
    if (vhEl) {
      vhEl.textContent = doc.evidenceId;
      vhEl.title = doc.evidenceId;
    }

    // Toggle articles box depending on tone
    const isGentle = (currentTone === 'gentle');
    if (artBox) {
      if (isGentle) {
        artBox.style.display = 'none';
      } else {
        artBox.style.display = 'block';
        if (artTitle) artTitle.textContent = doc.legalHeader;
        if (artList) {
          artList.innerHTML = doc.articles.map(function (art) {
            return '<div style="margin-top:6px;padding-left:10px;border-left:2px solid rgba(251,191,36,0.5);color:#cbd5e1;">§ ' + escapeXml(art) + '</div>';
          }).join('');
        }
      }
    }
  }

  function buildPlainText(doc) {
    const sep = '──────────────────────────────────────────────────────────';
    let text = 'SOUNDTEST.PRO · CIVILIAN ACOUSTIC EVIDENCE CHAIN\n\n' +
      doc.title + '\n\n' +
      formatMetaItem(doc.lblRecipient || 'Recipient: ', doc.recipient) + '\n' +
      formatMetaItem(doc.lblSender || 'Sender: ', doc.sender) + '\n' +
      formatMetaItem(doc.lblDate || 'Date: ', doc.date) + '\n' +
      sep + '\n\n' +
      doc.body + '\n\n';

    const isGentle = (doc.tone ? doc.tone === 'gentle' : currentTone === 'gentle');
    if (isGentle) {
      // 温和友善便条：轻巧温和，附带测量与误差说明，不附带严肃法条
      if (doc.gentleNote) {
        text += doc.gentleNote + '\n\n';
      }
      text += doc.lblSign + (doc.sender || '') + '\n' + doc.lblSignDate + doc.date;
      return text;
    }

    // 正式交涉函与严正法务催告函：完整附带数据表、方法依据标准与法律条文
    text += doc.telemetryHeader + '\n' +
      '- ' + doc.lblPeak + ': ' + doc.peakDb + ' dB(A)\n' +
      '- ' + doc.lblAvg + ': ' + doc.avgDb + ' dB(A)\n' +
      '- ' + doc.lblTime + ': ' + doc.timeRange + '\n' +
      '- ' + doc.lblHash + ': ' + doc.evidenceId + '\n\n' +
      doc.legalHeader + '\n';

    if (Array.isArray(doc.articles)) {
      doc.articles.forEach(function (art) {
        text += '§ ' + art + '\n';
      });
    }

    if (doc.disclaimer) {
      text += '\n' + doc.disclaimer + '\n';
    }

    text += '\n' + doc.lblSign + (doc.sender || '') + '\n' + doc.lblSignDate + doc.date;
    return text;
  }

  function openModal(recordData, options) {
    const el = ensureModal();
    currentRecord = recordData || {};
    const opts = options || {};

    userTier = opts.userTier || 'free';
    if (opts.lang && LEGAL_DATA[opts.lang]) {
      currentLang = opts.lang;
    } else if (typeof window.appLanguage === 'string' && window.appLanguage.startsWith('zh')) {
      currentLang = 'zh';
    } else if (typeof window.appLanguage === 'string') {
      const p = window.appLanguage.slice(0, 2).toLowerCase();
      currentLang = LEGAL_DATA[p] ? p : 'en';
    }

    currentTone = opts.tone || 'gentle';
    if (userTier === 'free') {
      currentTone = 'gentle';
    }

    if (opts.onUpgrade) {
      upgradeCallback = opts.onUpgrade;
    }

    // Set recipient and sender from options if provided
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.en || LEGAL_DATA.zh;
    const inputRec = el.querySelector('#lnmInputRecipient');
    const inputSnd = el.querySelector('#lnmInputSender');
    if (inputRec) {
      inputRec.value = opts.recipient || currentRecord.recipient || conf.ui?.recipientDefault || (currentLang === 'zh' ? '楼上邻居' : 'Upstairs Neighbor');
    }
    if (inputSnd) {
      inputSnd.value = opts.sender || currentRecord.sender || conf.ui?.senderDefault || (currentLang === 'zh' ? '楼下邻居' : 'Downstairs Neighbor');
    }

    // Sync active tone card
    const toneCards = el.querySelectorAll('.lnm-tone-card');
    toneCards.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-tone') === currentTone);
    });

    renderFullUi();
    renderPreview();

    el.classList.add('show');
  }

  function closeModal() {
    if (modalEl) {
      modalEl.classList.remove('show');
    }
  }

  return {
    openModal: openModal,
    closeModal: closeModal,
    buildDocxBlob: buildDocxBlob,
    compileDocumentData: compileDocumentData,
    buildPlainText: buildPlainText,
    getLegalData: function () { return LEGAL_DATA; },
    setUserTier: function (tier) {
      userTier = tier;
      if (modalEl) syncTierUi(modalEl);
    },
    getUserTier: function () { return userTier; },
    setUpgradeHandler: function (fn) { upgradeCallback = fn; }
  };
}));
