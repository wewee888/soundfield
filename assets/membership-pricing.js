/**
 * SOUNDTEST.PRO · Membership & WeChat Payment Engine
 * Localized pricing tiers, modal copy, and WeChat Pay polling handlers
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SoundTestPayment = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

const PUM_I18N = {
  zh: {
    badge: '★ PRO 官方专业升级',
    title: '解锁 SOUNDTEST.PRO 全部专业权益',
    desc: '生成物业/法理标准无水印存证底稿 · 加盖 SHA-256 数字指纹与 GPS 坐标',
    verifyLink: '🔑 已购验证会员',
    securityNote: '🔒 微信安全直付 · 支付成功自动激活 · 跨设备通用',
    plans: {
      yearly: {
        name: 'PRO 会员年卡',
        tag: '★ 最受欢迎 · 省67%',
        desc: '365天无限次去除报告水印 · 夜间长时自动监测 · 现场公函维权模板',
        price: '¥19.90',
        orig: '¥59.90',
        cta: '立即微信安全开通 (¥19.90 / 年)'
      },
      lifetime: {
        name: '终身永久买断版',
        tag: '💎 终身买断',
        desc: '一次性付费永久有效 · 终身免费升级后续所有专业版功能与算法',
        price: '¥39.90',
        orig: '¥199.00',
        cta: '立即微信安全开通 (¥39.90)'
      },
      pro: {
        name: 'PRO 会员月卡',
        tag: '单月体验',
        desc: '30天全功能无限制使用 · 适合集中交涉与突发噪声取证周期',
        price: '¥9.90',
        orig: '¥19.90',
        cta: '立即微信安全开通 (¥9.90 / 月)'
      },
      single: {
        name: '单次报告防伪解锁',
        tag: '单次可用',
        desc: '仅去除本次测定报告水印 · 加盖防伪数字指纹与时间戳',
        price: '¥3.90',
        orig: '¥9.90',
        cta: '立即微信安全开通 (¥3.90)'
      }
    }
  },
  en: {
    badge: '★ OFFICIAL PRO UPGRADE',
    title: 'Unlock Full SOUNDTEST.PRO Professional Features',
    desc: 'Generate unwatermarked legal/HOA evidence dossiers · Cryptographic SHA-256 digital seals & GPS custody',
    verifyLink: '🔑 Already purchased? Restore Membership',
    securityNote: '🔒 Secure Checkout via Creem · Visa, Mastercard, Apple Pay, Google Pay · Instant Activation',
    plans: {
      yearly: {
        name: 'Pro Annual Pass',
        tag: '★ MOST POPULAR · SAVE 58%',
        desc: '365 days unlimited clean exports · Overnight Sentry surveillance · Legal notice templates',
        price: '$24.99',
        orig: '$59.99',
        cta: 'Unlock Pro Annual ($24.99 / yr)'
      },
      lifetime: {
        name: 'Pro Lifetime License',
        tag: '💎 LIFETIME',
        desc: 'One-time payment · Permanent access · Free updates for all future pro acoustic features',
        price: '$79.99',
        orig: '$199.00',
        cta: 'Unlock Pro Lifetime ($79.99)'
      },
      pro: {
        name: 'Pro Monthly Pass',
        tag: 'MONTHLY',
        desc: '30 days unlimited access · Ideal for intensive neighbor dispute and acute noise documentation',
        price: '$4.99',
        orig: '$9.99',
        cta: 'Unlock Pro Monthly ($4.99 / mo)'
      },
      single: {
        name: 'Single Report Forensic Pass',
        tag: 'SINGLE USE',
        desc: 'Remove watermark for this report only · Cryptographic SHA-256 digital stamp & verified timestamp',
        price: '$1.99',
        orig: '$4.99',
        cta: 'Unlock Single Report ($1.99)'
      }
    }
  },
  es: {
    badge: '★ ACTUALIZACIÓN OFICIAL PRO',
    title: 'Desbloquee Todas las Funciones Profesionales de SOUNDTEST.PRO',
    desc: 'Generación de informes probatorios sin marca de agua · Sellos criptográficos SHA-256 y custodia GPS',
    verifyLink: '🔑 ¿Ya compraste? Restaurar Membresía',
    securityNote: '🔒 Pago seguro con Creem · Visa, Mastercard, Apple Pay, Google Pay · Activación instantánea',
    plans: {
      yearly: {
        name: 'Pase Anual Pro',
        tag: '★ MÁS POPULAR · AHORRA 58%',
        desc: '365 días de exportaciones ilimitadas sin marca de agua · Vigilancia Centinela nocturna · Plantillas legales',
        price: '$24.99',
        orig: '$59.99',
        cta: 'Activar Pase Anual ($24.99 / año)'
      },
      lifetime: {
        name: 'Licencia Vitalicia Pro',
        tag: '💎 VITALICIO',
        desc: 'Pago único y acceso permanente · Actualizaciones gratuitas de por vida para todas las herramientas acústicas',
        price: '$79.99',
        orig: '$199.00',
        cta: 'Activar Licencia Vitalicia ($79.99)'
      },
      pro: {
        name: 'Pase Mensual Pro',
        tag: 'MENSUAL',
        desc: '30 días de acceso ilimitado · Ideal para disputas de alquiler y documentación intensiva de ruido',
        price: '$4.99',
        orig: '$9.99',
        cta: 'Activar Pase Mensual ($4.99 / mes)'
      },
      single: {
        name: 'Desbloqueo de Informe Único',
        tag: 'USO ÚNICO',
        desc: 'Elimine la marca de agua solo de este informe · Sello digital SHA-256 y marca de tiempo verificada',
        price: '$1.99',
        orig: '$4.99',
        cta: 'Desbloquear Informe Único ($1.99)'
      }
    }
  },
  fr: {
    badge: '★ MISE À NIVEAU OFFICIELLE PRO',
    title: 'Débloquez Toutes les Fonctionnalités Professionnelles de SOUNDTEST.PRO',
    desc: 'Génération de dossiers sans filigrane · Sceaux cryptographiques SHA-256 et horodatage GPS certifié',
    verifyLink: '🔑 Déjà acheté ? Restaurer l\'abonnement',
    securityNote: '🔒 Paiement sécurisé via Creem · Visa, Mastercard, Apple Pay, Google Pay · Activation immédiate',
    plans: {
      yearly: {
        name: 'Abonnement Annuel Pro',
        tag: '★ LE PLUS POPULAIRE · ÉCONOMISEZ 58%',
        desc: '365 jours d\'exports illimités sans filigrane · Mode Sentinelle nocturne · Modèles de mise en demeure formelle',
        price: '$24.99',
        orig: '$59.99',
        cta: 'Activer l\'Annuel Pro ($24.99 / an)'
      },
      lifetime: {
        name: 'Licence Pro à Vie',
        tag: '💎 À VIE',
        desc: 'Paiement unique, accès permanent · Mises à jour gratuites à vie pour tous les algorithmes acoustiques',
        price: '$79.99',
        orig: '$199.00',
        cta: 'Activer la Licence à Vie ($79.99)'
      },
      pro: {
        name: 'Pass Mensuel Pro',
        tag: 'MENSUEL',
        desc: '30 jours d\'accès complet · Idéal pour litiges de voisinage et constats de nuisances sonores aiguës',
        price: '$4.99',
        orig: '$9.99',
        cta: 'Activer le Pass Mensuel ($4.99 / mois)'
      },
      single: {
        name: 'Déblocage Rapport Unique',
        tag: 'USAGE UNIQUE',
        desc: 'Retirez le filigrane uniquement pour ce rapport · Sceau numérique SHA-256 et horodatage',
        price: '$1.99',
        orig: '$4.99',
        cta: 'Débloquer ce Rapport ($1.99)'
      }
    }
  },
  de: {
    badge: '★ OFFIZIELLES PRO-UPGRADE',
    title: 'Schalten Sie Alle Professionellen SOUNDTEST.PRO Funktionen Frei',
    desc: 'Erstellung wasserzeichenfreier Beweisdossiers · Kryptografische SHA-256-Siegel & GPS-Standortnachweis',
    verifyLink: '🔑 Bereits gekauft? Mitgliedschaft wiederherstellen',
    securityNote: '🔒 Sichere Zahlung via Creem · Visa, Mastercard, Apple Pay, Google Pay · Sofortige Freischaltung',
    plans: {
      yearly: {
        name: 'Pro Jahrespass',
        tag: '★ AM BELIEBTESTEN · 58% SPAREN',
        desc: '365 Tage unbegrenzte Exporte ohne Wasserzeichen · Nächtliche Sentry-Überwachung · Mängelrüge-Vorlagen',
        price: '$24.99',
        orig: '$59.99',
        cta: 'Pro Jahrespass Freischalten ($24.99 / Jahr)'
      },
      lifetime: {
        name: 'Pro Lebenslange Lizenz',
        tag: '💎 LEBENSLANG',
        desc: 'Einmalzahlung, dauerhafter Zugriff · Lebenslang kostenlose Updates aller Akustikfunktionen & Algorithmen',
        price: '$79.99',
        orig: '$199.00',
        cta: 'Lebenslange Lizenz Freischalten ($79.99)'
      },
      pro: {
        name: 'Pro Monatspass',
        tag: 'MONATLICH',
        desc: '30 Tage uneingeschränkter Zugriff · Ideal für akute Mietminderungs- und Lärmbelästigungsstreitigkeiten',
        price: '$4.99',
        orig: '$9.99',
        cta: 'Pro Monatspass Freischalten ($4.99 / Monat)'
      },
      single: {
        name: 'Einzelbericht-Freischaltung',
        tag: 'EINZELNUTZUNG',
        desc: 'Entfernt das Wasserzeichen nur für diesen Bericht · Mit SHA-256-Siegel & Zeitstempel',
        price: '$1.99',
        orig: '$4.99',
        cta: 'Diesen Bericht Freischalten ($1.99)'
      }
    }
  },
  ja: {
    badge: '★ PRO 公式アップグレード',
    title: 'SOUNDTEST.PRO のすべてのプロ証拠機能をアンロック',
    desc: '透かしなしの提出用レポート作成 · SHA-256暗号化デジタル刻印＆GPS位置情報',
    verifyLink: '🔑 ご購入済みですか？ 会員権限を復元',
    securityNote: '🔒 Creem.io 安全決済 · Visa, Mastercard, Apple Pay, Google Pay · 即時自動反映',
    plans: {
      yearly: {
        name: 'PRO 年間パス',
        tag: '★ 一番人気 · 58%OFF',
        desc: '365日間無制限の透かしなしPDF出力 · 夜間長時間自動セントリー監視 · 騒音苦情申出公文書テンプレート',
        price: '$24.99',
        orig: '$59.99',
        cta: 'PRO 年間パスを開通 ($24.99 / 年)'
      },
      lifetime: {
        name: 'PRO 永久買い切りライセンス',
        tag: '💎 永久買い切り',
        desc: '一回のお支払いで永久利用可能 · 将来追加される全プロ機能＆音響アルゴリズムの永続無料アップデート',
        price: '$79.99',
        orig: '$199.00',
        cta: '永久買い切りライセンスを購入 ($79.99)'
      },
      pro: {
        name: 'PRO 月間パス',
        tag: '1ヶ月体験',
        desc: '30日間全機能が無制限に利用可能 · 突発的な近隣騒音トラブルや集中証拠収集に最適',
        price: '$4.99',
        orig: '$9.99',
        cta: 'PRO 月間パスを開通 ($4.99 / 月)'
      },
      single: {
        name: '単一レポート透かし解除',
        tag: '1回のみ有効',
        desc: '今回の測定レポートのみ透かしを削除 · 暗号学的SHA-256印章および検証済みタイムスタンプ付き',
        price: '$1.99',
        orig: '$4.99',
        cta: 'このレポートを解除 ($1.99)'
      }
    }
  },
  ko: {
    badge: '★ PRO 공식 프로 업그레이드',
    title: 'SOUNDTEST.PRO 모든 전문 증거 수집 기능 잠금 해제',
    desc: '관리실·법적 제출용 무워터마크 증거 보고서 생성 · SHA-256 디지털 암호 인장 및 GPS 인증',
    verifyLink: '🔑 이미 구매하셨나요? 회원 자격 복원',
    securityNote: '🔒 Creem 안전 결제 · Visa, Mastercard, Apple Pay, Google Pay · 즉시 활성화',
    plans: {
      yearly: {
        name: 'PRO 연간 패스',
        tag: '★ 가장 인기 · 58% 할인',
        desc: '365일 무제한 워터마크 제거 출력 · 야간 지속 자동 센트리 감시 · 분쟁 대응 공식 문서 템플릿',
        price: '$24.99',
        orig: '$59.99',
        cta: 'PRO 연간 패스 활성화 ($24.99 / 년)'
      },
      lifetime: {
        name: 'PRO 평생 영구 라이선스',
        tag: '💎 평생 소장',
        desc: '1회 결제로 평생 사용 · 향후 추가되는 모든 프로 음향 기능 및 알고리즘 영구 무료 업그레이드',
        price: '$79.99',
        orig: '$199.00',
        cta: '평생 라이선스 구매 ($79.99)'
      },
      pro: {
        name: 'PRO 월간 패스',
        tag: '1개월 체험',
        desc: '30일간 모든 기능 무제한 이용 · 층간소음 분쟁 및 단기 집중 소음 증거 수집에 적합',
        price: '$4.99',
        orig: '$9.99',
        cta: 'PRO 월간 패스 활성화 ($4.99 / 월)'
      },
      single: {
        name: '단일 보고서 워터마크 해제',
        tag: '1회 사용',
        desc: '이번 측정 보고서만 워터마크 제거 · SHA-256 디지털 지문 및 인증 타임스탬프 부여',
        price: '$1.99',
        orig: '$4.99',
        cta: '이 보고서 해제 ($1.99)'
      }
    }
  },
  vi: {
    badge: '★ NÂNG CẤP PRO CHÍNH THỨC',
    title: 'Mở Khóa Toàn Bộ Quyền Lợi Chuyên Nghiệp SOUNDTEST.PRO',
    desc: 'Xuất hồ sơ bằng chứng không hình mờ theo tiêu chuẩn pháp lý · Đóng dấu mã hóa SHA-256 & tọa độ GPS',
    verifyLink: '🔑 Đã mua trước đó? Khôi phục thành viên',
    securityNote: '🔒 Thanh toán an toàn qua Creem · Thẻ Visa, Mastercard, Apple Pay, Google Pay · Kích hoạt ngay',
    plans: {
      yearly: {
        name: 'Gói PRO Hàng Năm',
        tag: '★ PHỔ BIẾN NHẤT · TIẾT KIỆM 58%',
        desc: '365 ngày xuất báo cáo không giới hạn không hình mờ · Giám sát tự động ban đêm Sentry · Mẫu khiếu nại',
        price: '$24.99',
        orig: '$59.99',
        cta: 'Kích Hoạt Gói Năm ($24.99 / năm)'
      },
      lifetime: {
        name: 'Bản Quyền Trọn Đời PRO',
        tag: '💎 TRỌN ĐỜI',
        desc: 'Thanh toán 1 lần dùng vĩnh viễn · Miễn phí nâng cấp mọi tính năng âm thanh chuyên nghiệp sau này',
        price: '$79.99',
        orig: '$199.00',
        cta: 'Mua Bản Quyền Trọn Đời ($79.99)'
      },
      pro: {
        name: 'Gói PRO Hàng Tháng',
        tag: 'GÓI THÁNG',
        desc: '30 ngày sử dụng không giới hạn · Phù hợp giải quyết tranh chấp tiếng ồn đột xuất và tập trung thu thập chứng cứ',
        price: '$4.99',
        orig: '$9.99',
        cta: 'Kích Hoạt Gói Tháng ($4.99 / tháng)'
      },
      single: {
        name: 'Mở Khóa 1 Báo Cáo',
        tag: 'DÙNG 1 LẦN',
        desc: 'Chỉ gỡ hình mờ cho báo cáo lần này · Đính kèm dấu vân tay số SHA-256 và mốc thời gian',
        price: '$1.99',
        orig: '$4.99',
        cta: 'Mở Khóa Báo Cáo Này ($1.99)'
      }
    }
  },
  th: {
    badge: '★ อัปเกรด PRO อย่างเป็นทางการ',
    title: 'ปลดล็อกฟีเจอร์พยานหลักฐานระดับมืออาชีพของ SOUNDTEST.PRO',
    desc: 'สร้างรายงานหลักฐานไร้ลายน้ำตามมาตรฐานนิติวิทยาศาสตร์ · ประทับตราดิจิทัล SHA-256 และพิกัด GPS',
    verifyLink: '🔑 ซื้อแล้วใช่ไหม? กู้คืนสิทธิ์สมาชิก',
    securityNote: '🔒 ชำระเงินปลอดภัยผ่าน Creem · Visa, Mastercard, Apple Pay, Google Pay · ใช้งานได้ทันที',
    plans: {
      yearly: {
        name: 'แพ็กเกจ PRO รายปี',
        tag: '★ ยอดนิยมสูงสุด · ประหยัด 58%',
        desc: 'ส่งออกรายงานไร้ลายน้ำไม่จำกัด 365 วัน · โหมดเฝ้าระวังอัตโนมัติยามค่ำคืน Sentry · แม่แบบหนังสือร้องเรียน',
        price: '$24.99',
        orig: '$59.99',
        cta: 'เปิดใช้งานแพ็กเกจรายปี ($24.99 / ปี)'
      },
      lifetime: {
        name: 'สิทธิ์ใช้งานตลอดชีพ PRO',
        tag: '💎 ตลอดชีพ',
        desc: 'ชำระครั้งเดียวใช้งานได้ถาวร · อัปเกรดฟังก์ชันและอัลกอริทึมเสียงระดับโปรฟรีตลอดอายุการใช้งาน',
        price: '$79.99',
        orig: '$199.00',
        cta: 'ซื้อสิทธิ์ใช้งานตลอดชีพ ($79.99)'
      },
      pro: {
        name: 'แพ็กเกจ PRO รายเดือน',
        tag: 'รายเดือน',
        desc: 'ใช้งานเต็มรูปแบบไม่จำกัด 30 วัน · เหมาะสำหรับช่วงรวบรวมหลักฐานข้อพิพาทเรื่องเสียงรบกวนเร่งด่วน',
        price: '$4.99',
        orig: '$9.99',
        cta: 'เปิดใช้งานแพ็กเกจรายเดือน ($4.99 / เดือน)'
      },
      single: {
        name: 'ปลดล็อกรายงานครั้งเดียว',
        tag: 'ใช้ครั้งเดียว',
        desc: 'ลบลายน้ำเฉพาะรายงานครั้งนี้เท่านั้น · พร้อมประทับตราดิจิทัล SHA-256 และเวลาที่ตรวจสอบได้',
        price: '$1.99',
        orig: '$4.99',
        cta: 'ปลดล็อกรายงานนี้ ($1.99)'
      }
    }
  }
};

const CREEM_CHECKOUT_URLS = {
  single: 'https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC',
  monthly: 'https://www.creem.io/payment/prod_4jTdMPIau4Pzn1HKHPW9NQ',
  yearly: 'https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c',
  lifetime: 'https://www.creem.io/payment/prod_18nHbuAQNpc4n334rM9hGV',
};
if (typeof window !== 'undefined') {
  window.CREEM_CHECKOUT_URLS = CREEM_CHECKOUT_URLS;
}

let weChatPollTimer = null;
let currentPendingExport = null;

function closeWeChatPayModal() {
  const modal = document.getElementById('wxPayModal');
  if (modal) modal.classList.remove('show');
  if (weChatPollTimer) {
    clearInterval(weChatPollTimer);
    weChatPollTimer = null;
  }
}

async function openWeChatPayModal(plan = 'single', pendingRecs = null, isBatch = false) {
  if (!isChinaPricingUser()) {
    toast('WeChat Pay test pricing is only available for mainland China IP addresses. Redirecting to international checkout in USD...', 'warn', 5000);
    const creemKey = plan === 'yearly' ? 'yearly' : (plan === 'lifetime' ? 'lifetime' : (plan === 'single' ? 'single' : 'monthly'));
    const urls = window.CREEM_CHECKOUT_URLS || CREEM_CHECKOUT_URLS;
    const creemUrl = urls ? urls[creemKey] : null;
    if (creemUrl) {
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isMobile) {
        window.location.href = creemUrl;
      } else {
        const win = window.open(creemUrl, '_blank', 'noopener');
        if (!win || win.closed || typeof win.closed === 'undefined') {
          window.location.href = creemUrl;
        }
      }
    }
    return;
  }

  currentPendingExport = pendingRecs ? { recs: pendingRecs, isBatch } : null;
  const modal = document.getElementById('wxPayModal');
  if (!modal) return;

  const titleEl = document.getElementById('wxPayProdName');
  const feeEl = document.getElementById('wxPayProdFee');
  const qrcodeImg = document.getElementById('wxPayQrcode');
  const qrcodeWrap = document.getElementById('wxQrcodeWrap');
  const mobileWrap = document.getElementById('wxMobileWrap');
  const h5Btn = document.getElementById('wxPayH5Btn');
  const statusEl = document.getElementById('wxPayStatusText');

  const planInfo = {
    single: { name: '单次报告防伪去水印解锁', fee: '3.90', origFee: '¥9.90', badge: '立省 60%' },
    pro: { name: 'PRO 会员月卡 (30天无限制)', fee: '9.90', origFee: '¥19.90', badge: '立省 50%' },
    yearly: { name: 'PRO 会员年卡 (365天全功能)', fee: '19.90', origFee: '¥59.90', badge: '★ 最受欢迎 · 立省 67%' },
    lifetime: { name: 'PRO 终身永久买断版', fee: '39.90', origFee: '¥199.00', badge: '💎 终身买断 · 立省 ¥159.1' },
  }[plan] || { name: 'PRO 会员年卡', fee: '19.90', origFee: '¥59.90', badge: '★ 最受欢迎' };

  if (titleEl) titleEl.textContent = planInfo.name;
  if (feeEl) feeEl.textContent = planInfo.fee;
  const origEl = document.getElementById('wxPayOrigFee');
  if (origEl) origEl.textContent = planInfo.origFee;
  const badgeEl = document.getElementById('wxPayDiscountBadge');
  if (badgeEl) badgeEl.textContent = planInfo.badge;
  if (statusEl) statusEl.textContent = '正在连接微信安全收银台…';

  modal.classList.add('show');

  try {
      const currentEmail = (document.getElementById('memberEmailInput')?.value || membershipState.email || '').trim();
      const res = await fetch('/api/payment/hupijiao-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          email: currentEmail,
          return_url: window.location.href,
          lang: appLanguage,
        }),
      });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || '创建订单失败');
    }

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

    if (qrcodeImg && (data.url_qrcode || data.url)) {
      const fallbackUrl = data.url ? `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=4&data=${encodeURIComponent(data.url)}` : '';
      qrcodeImg.onerror = () => {
        if (fallbackUrl && qrcodeImg.src !== fallbackUrl) {
          qrcodeImg.src = fallbackUrl;
        }
      };
      qrcodeImg.src = data.url_qrcode || fallbackUrl;
    }
    if (h5Btn && data.url) {
      h5Btn.href = data.url;
    }

    if (isMobile) {
      if (qrcodeWrap) qrcodeWrap.style.display = 'none';
      if (mobileWrap) mobileWrap.style.display = 'block';
      if (statusEl) statusEl.textContent = '请点击上方按钮唤起微信，或在微信中完成支付…';
      window.location.href = data.url;
    } else {
      if (qrcodeWrap) qrcodeWrap.style.display = 'inline-flex';
      if (mobileWrap) mobileWrap.style.display = 'none';
      if (statusEl) statusEl.textContent = '请使用手机微信扫码，支付成功自动完成…';
    }

    startWeChatPaymentPolling(data.order_id, data.open_order_id, plan);
  } catch (err) {
    if (statusEl) statusEl.textContent = '订单创建失败：' + (err.message || '网络异常');
    toast('微信支付调起失败，请稍后重试', 'err', 5000);
  }
}

function startWeChatPaymentPolling(orderId, openOrderId, plan) {
  if (weChatPollTimer) clearInterval(weChatPollTimer);
  let count = 0;
  weChatPollTimer = setInterval(async () => {
    count++;
    if (count > 150) {
      clearInterval(weChatPollTimer);
      weChatPollTimer = null;
      return;
    }
    try {
      const resp = await fetch(`/api/payment/hupijiao-check?order_id=${encodeURIComponent(orderId)}&open_order_id=${encodeURIComponent(openOrderId || '')}`);
      const info = await resp.json().catch(() => ({}));
      if (info && info.paid) {
        clearInterval(weChatPollTimer);
        weChatPollTimer = null;
        handleWeChatPaymentSuccess(plan, orderId);
      }
    } catch (_) {}
  }, 2000);
}

function handleWeChatPaymentSuccess(plan, orderId) {
  closeWeChatPayModal();

  if (plan === 'single') {
    toast('🎉 微信支付成功！已解锁本次官方无水印报告', 'info', 5000);
    if (currentPendingExport && currentPendingExport.recs) {
      try {
        const doc = buildPDF(currentPendingExport.recs, false);
        const r0 = currentPendingExport.recs[0] || {};
        const filename = currentPendingExport.isBatch
          ? `soundtest.pro-official-${localDateStr(new Date())}.pdf`
          : `soundtest.pro-${localDateStr(r0.time ? new Date(r0.time) : new Date())}.pdf`;
        doc.save(filename);
        trackEvent('pdf_exported', { records: currentPendingExport.recs.length, plan: 'single_paid' });
      } catch (e) {
        toast('PDF 下载出错，请刷新重试', 'err');
      }
    }
  } else {
    const activeDays = plan === 'lifetime' ? 36500 : (plan === 'yearly' ? 365 : 30);
    const resolvedEmail = (document.getElementById('memberEmailInput')?.value || membershipState.email || 'wechat_vip').trim();
    membershipState = normalizeMembership({
      email: resolvedEmail,
      active: true,
      plan: plan === 'lifetime' ? 'lifetime' : (plan === 'yearly' ? 'team' : 'pro'),
      provider: 'wechat_hupijiao',
      status: 'paid',
      renewsAt: plan === 'lifetime' ? 'PERPETUAL' : new Date(Date.now() + activeDays * 86400000).toISOString().slice(0, 10),
      lastCheckedAt: new Date().toISOString(),
      orderId,
    });
    saveMembershipState();
    try {
      // Sync with user auth session if exists
      const sess = JSON.parse(localStorage.getItem('soundtest_session_v1') || 'null');
      if (sess) {
        sess.plan = membershipState.plan;
        localStorage.setItem('soundtest_session_v1', JSON.stringify(sess));
      }
    } catch (_) {}
    applyMembershipToPlan();
    renderPlanStatus();
    renderMembershipPanel();
    const durationLabel = plan === 'lifetime' ? '永久' : (plan === 'yearly' ? '365天' : '30天');
    toast(`🎉 ${plan === 'lifetime' ? '终身专业版' : 'PRO 会员'}已激活！享${durationLabel}无限次官方取证与无水印导出`, 'info', 6000);

    if (currentPendingExport && currentPendingExport.recs) {
      try {
        const doc = buildPDF(currentPendingExport.recs, false);
        const r0 = currentPendingExport.recs[0] || {};
        const filename = currentPendingExport.isBatch
          ? `soundtest.pro-all-${new Date().toISOString().slice(0, 10)}.pdf`
          : `soundtest.pro-${(r0.time ? new Date(r0.time) : new Date()).toISOString().slice(0, 10)}.pdf`;
        doc.save(filename);
      } catch (_) {}
    }
  }
}


  return {
    CREEM_CHECKOUT_URLS: typeof CREEM_CHECKOUT_URLS !== 'undefined' ? CREEM_CHECKOUT_URLS : {},
    PUM_I18N: typeof PUM_I18N !== 'undefined' ? PUM_I18N : {},
    closeWeChatPayModal: typeof closeWeChatPayModal !== 'undefined' ? closeWeChatPayModal : undefined,
    openWeChatPayModal: typeof openWeChatPayModal !== 'undefined' ? openWeChatPayModal : undefined,
    startWeChatPaymentPolling: typeof startWeChatPaymentPolling !== 'undefined' ? startWeChatPaymentPolling : undefined,
    handleWeChatPaymentSuccess: typeof handleWeChatPaymentSuccess !== 'undefined' ? handleWeChatPaymentSuccess : undefined
  };
}));

if (typeof window !== 'undefined') {
  if (window.SoundTestPayment) {
    window.CREEM_CHECKOUT_URLS = window.SoundTestPayment.CREEM_CHECKOUT_URLS;
    window.PUM_I18N = window.SoundTestPayment.PUM_I18N;
    Object.assign(window, window.SoundTestPayment);
  }
}
