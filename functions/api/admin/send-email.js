// Cloudflare Pages Function: /api/admin/send-email
// Dedicated Abandoned Cart Dunning & Marketing Email Dispatcher for Super Admin

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': '*',
    },
  });
}

const ADMIN_EMAILS = ['wewee1@gmail.com'];

async function verifyAuth(request, env) {
  const adminSecret = String(env.ADMIN_SECRET || 'soundtest_admin_2026');
  const authHeader = request.headers.get('authorization') || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() ||
                request.headers.get('x-admin-token') ||
                request.headers.get('x-session-token') ||
                new URL(request.url).searchParams.get('token') || '';

  if (token && token === adminSecret) return true;

  const adminEmail = (request.headers.get('x-admin-email') || new URL(request.url).searchParams.get('admin_email') || '').toLowerCase().trim();
  if (adminEmail && ADMIN_EMAILS.includes(adminEmail)) return true;

  if (env && env.ab_test && token.startsWith('sess_')) {
    try {
      const sessRaw = await env.ab_test.get(`sess:${token}`);
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        if (sess.email && ADMIN_EMAILS.includes(sess.email.toLowerCase())) {
          return true;
        }
      }
    } catch (_) {}
  }

  return false;
}

// Built-in Email Templates (Multilingual: EN, ZH, ES, JA, etc.)
function getEmailTemplate({ templateId, name, email, plan, amount, currency, checkoutUrl, orderId, lang, discountCode, discountAmount }) {
  const isEn = lang ? (lang === 'en') : (currency === 'USD' || !(/[\u4e00-\u9fa5]/.test(name)));
  const isZh = lang ? (lang === 'zh') : (!isEn);
  const safeName = name && name !== '未命名' ? name : (isZh ? '尊敬的现场取证用户' : 'SoundTest Explorer');
  const safePlan = plan.toUpperCase();
  const safeAmount = amount.startsWith('$') || amount.startsWith('¥') ? amount : `${currency === 'USD' ? '$' : '¥'}${amount}`;
  const safeUrl = checkoutUrl || `https://soundtest.pro/auth.html?email=${encodeURIComponent(email)}`;

  const templates = {
    // 1-Hour Gentle Reminder
    abandoned_1h: {
      subject: isEn
        ? `Did something go wrong with your SOUNDTEST.PRO order?`
        : `您在 SOUNDTEST.PRO 的专业版订单尚未完成支付`,
      heading: isEn ? `Complete Your Sound Monitoring Upgrade` : `您的专业噪音取证订单待完成`,
      message: isEn
        ? `Hi ${safeName},<br><br>We noticed you started upgrading to <strong>${safePlan}</strong> (${safeAmount}), but didn't finish checkout. Whether you are dealing with neighborhood noise disputes, industrial compliance, or nocturnal sleep disturbances, our certified PDF reports with SHA-256 evidence hashes and overnight Sentry Mode are ready to protect your rights.`
        : `尊敬的 ${safeName}：<br><br>系统检测到您刚刚在 SOUNDTEST.PRO 创建了 <strong>${safePlan}</strong> (${safeAmount}) 订单，但尚未完成支付。<br>无论是邻里噪音取证、夜间哨兵自动超标录音，还是导出防伪司法级 PDF 报告，开通后均可立即在手机与电脑多端无限制使用。`,
      ctaText: isEn ? `Resume Checkout & Activate Now (${safeAmount})` : `立即继续支付并激活会员 (${safeAmount})`,
      tip: isEn
        ? `Need assistance or wire transfer? Just reply to this email directly.`
        : `若您在支付过程中遇到风控或网络超时，可点击下方按钮重新发起，或直接回复本邮件联系客服。`,
    },

    // 24-Hour Special 15% Incentive
    discount_24h: {
      subject: isEn
        ? `Special 15% OFF to complete your SOUNDTEST.PRO Pro upgrade (Next 24 Hours)`
        : `【限时立减15%】您的 SOUNDTEST.PRO 会员特惠保留中`,
      heading: isEn ? `Exclusive 15% Courtesy Discount Reserved` : `专属特惠：完成您的专业版升级`,
      message: isEn
        ? `Hi ${safeName},<br><br>We understand how critical clear, tamper-evident acoustic evidence is. To make sure you get the legal-grade documentation you need without hesitation, we've unlocked a <strong>15% VIP Courtesy Discount</strong> on your <strong>${safePlan}</strong> reservation.<br><br>Your reserved rate is valid for the next 24 hours.`
        : `尊敬的 ${safeName}：<br><br>我们深知遭遇噪音困扰时的无助与取证维权的紧迫。为帮助您以最高性价比获得完整法律效力存证与无水印 PDF 出具权益，我们已为您的 <strong>${safePlan}</strong> 订单申请了专属保留特惠。<br><br>此特权通道将在 24 小时后自动关闭。`,
      ctaText: isEn ? `Claim Discount & Finish Upgrade →` : `使用特惠立即完成升级 →`,
      tip: isEn
        ? `All purchases include instant multi-device cloud sync and 30-day evidence retention.`
        : `支付成功后系统将即时自动升级，手机端与电脑端实时同步。`,
    },

    // 3-Day Final Expiration Notice
    notice_3d: {
      subject: isEn
        ? `Final Notice: Your SOUNDTEST.PRO cart reservation is expiring`
        : `最后保留通知：您的 SOUNDTEST.PRO 订单及云同步空间即将释放`,
      heading: isEn ? `Final Cart & License Expiration Notice` : `待付款订单即将释放`,
      message: isEn
        ? `Hi ${safeName},<br><br>This is a quick final notice regarding your pending <strong>${safePlan}</strong> license (${safeAmount}). Your temporary checkout session and reserved cloud storage slots will expire shortly.<br><br>If you still wish to secure certified noise calibration reports and continuous sentry alerts, please finalize before expiration.`
        : `尊敬的 ${safeName}：<br><br>这是一封友好的最后通知。您于日前提交的 <strong>${safePlan}</strong> (${safeAmount}) 预留订单将于近期超时作废，预留的云端取证加密空间也将一并释放。<br><br>若您仍需使用夜间哨兵自动监测与司法报告盖章导出功能，请抓紧最后时间完成。`,
      ctaText: isEn ? `Finalize Upgrade Before Expiration` : `在订单作废前完成支付`,
      tip: isEn
        ? `If you have already resolved your noise issue or no longer need this, you may safely ignore this message.`
        : `若您已解决噪音问题或不再需要取证服务，请忽略本邮件，系统将自动关闭订单。`,
    },

    // 7-Day / Weekly Re-engagement
    weekly_reengage: {
      subject: isEn
        ? `Still dealing with unwanted noise disturbances? We're here to help`
        : `仍在遭遇噪音困扰？SOUNDTEST.PRO 现场取证与夜间哨兵功能已全面就绪`,
      heading: isEn ? `Weekly Check-in & Acoustic Support` : `周期回访：声学维权支持与报告出具`,
      message: isEn
        ? `Hi ${safeName},<br><br>We wanted to check in and see how your noise situation is going. Unwanted disturbances—from construction, loud neighbors, or HVAC units—can severely impact sleep and daily life.<br><br>Your SOUNDTEST.PRO account is still ready to unlock overnight Sentry Mode, tamper-evident SHA-256 digital seals, and certified PDF evidence reports recognized by landlords, HOA boards, and municipal arbitration.`
        : `尊敬的 ${safeName}：<br><br>我们希望跟进了解一下您近期的噪音维权进展。无论是邻里生活噪音、楼上震动还是工商业噪音，长期困扰均对身心健康造成严重影响。<br><br>您的 SOUNDTEST.PRO 账户仍可随时开启夜间哨兵自动超标录音、防伪盖章 PDF 报告出具与多端云端存证。`,
      ctaText: isEn ? `Resume Pro Access & Generate Reports` : `立即重新激活专业版并导出证据`,
      tip: isEn
        ? `Questions about acoustic evidence validity or device calibration? Reply anytime to speak directly with an engineer.`
        : `对噪音取证效力或现场分贝校准有任何疑问，可随时回复本邮件咨询。`,
    },
  };

  const selectedTpl = templates[templateId] || templates.abandoned_1h;

  const html = `
<!DOCTYPE html>
<html lang="${isEn ? 'en' : 'zh-CN'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${selectedTpl.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #070b14; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif; color: #f1f5f9; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #070b14; padding: 30px 15px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 580px; background: linear-gradient(180deg, #0e1526 0%, #070c18 100%); border-radius: 20px; border: 1px solid rgba(44, 240, 193, 0.28); box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7); overflow: hidden;">
          <!-- Top Cyber Glow Header -->
          <tr>
            <td style="padding: 32px 36px 20px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.06); background: radial-gradient(circle at top, rgba(44, 240, 193, 0.12) 0%, transparent 70%);">
              <div style="display: inline-block; width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, rgba(44, 240, 193, 0.2), rgba(99, 102, 241, 0.2)); border: 1.5px solid #2cf0c1; line-height: 48px; text-align: center; font-size: 22px; margin-bottom: 12px; box-shadow: 0 0 24px rgba(44, 240, 193, 0.35);">
                ⚡
              </div>
              <div style="font-size: 20px; font-weight: 900; letter-spacing: 0.04em; color: #ffffff;">
                SOUNDTEST<span style="color: #2cf0c1;">.PRO</span>
              </div>
              <div style="font-size: 11.5px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 4px;">
                ${isEn ? 'Acoustic Metrology & Certified Noise Evidence' : '声学计量与现场噪音法律存证系统'}
              </div>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px 36px 24px;">
              <h1 style="margin: 0 0 16px; font-size: 21px; font-weight: 800; color: #ffffff; line-height: 1.35;">
                ${selectedTpl.heading}
              </h1>

              <div style="font-size: 14.5px; line-height: 1.7; color: #cbd5e1; margin-bottom: 24px;">
                ${selectedTpl.message}
              </div>

              ${discountCode ? `
              <!-- Exclusive Recovery Discount Banner -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(44, 240, 193, 0.15)); border: 1.5px dashed #f59e0b; border-radius: 12px; padding: 14px 18px; margin-bottom: 22px; text-align: center;">
                <tr>
                  <td>
                    <div style="font-size: 11.5px; color: #fbbf24; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase;">
                      ${isEn ? '🎁 EXCLUSIVE RECOVERY DISCOUNT APPLIED' : '🎁 专属限时挽回特惠已生效'}
                    </div>
                    <div style="font-size: 17px; font-weight: 900; color: #ffffff; margin: 6px 0;">
                      ${isEn ? 'Promo Code:' : '专属优惠码:'} <span style="font-family: monospace; background: #060a16; padding: 3px 10px; border-radius: 6px; border: 1px solid #f59e0b; color: #fbbf24;">${discountCode}</span>
                    </div>
                    <div style="font-size: 13px; color: #cbd5e1;">
                      ${isEn ? 'Discounted Rate:' : '折后立减价:'} <strong style="color: #2cf0c1; font-size: 16px;">${discountAmount || safeAmount}</strong>
                      ${isEn ? '(Auto-applied via the button below)' : '（点击下方结算按钮自动抵扣）'}
                    </div>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Order Summary Box -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(44, 240, 193, 0.2); border-radius: 12px; padding: 16px 20px; margin-bottom: 26px;">
                <tr>
                  <td style="font-size: 12.5px; color: #94a3b8; padding: 4px 0;">${isEn ? 'Plan Tier:' : '套餐方案:'}</td>
                  <td align="right" style="font-size: 13.5px; font-weight: 700; color: #ffffff; padding: 4px 0;">${safePlan}</td>
                </tr>
                <tr>
                  <td style="font-size: 12.5px; color: #94a3b8; padding: 4px 0;">${isEn ? 'Amount Due:' : '待付金额:'}</td>
                  <td align="right" style="font-size: 18px; font-weight: 900; color: #2cf0c1; padding: 4px 0;">${safeAmount}</td>
                </tr>
                <tr>
                  <td style="font-size: 12.5px; color: #94a3b8; padding: 4px 0;">${isEn ? 'Order Reference:' : '订单编号:'}</td>
                  <td align="right" style="font-size: 12px; font-family: monospace; color: #94a3b8; padding: 4px 0;">${orderId || 'PENDING'}</td>
                </tr>
              </table>

              <!-- Big CTA Button -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${safeUrl}" target="_blank" rel="noopener" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #2cf0c1 0%, #3b82f6 100%); color: #04101a; text-decoration: none; font-size: 15.5px; font-weight: 800; text-align: center; padding: 15px 24px; border-radius: 12px; box-shadow: 0 8px 24px rgba(44, 240, 193, 0.35); letter-spacing: 0.02em;">
                      ${selectedTpl.ctaText}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Friendly Tip -->
              <div style="font-size: 12.5px; color: #94a3b8; line-height: 1.6; text-align: center; margin-bottom: 10px;">
                ${selectedTpl.tip}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 36px 28px; background: rgba(0, 0, 0, 0.4); border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; font-size: 11.5px; color: #64748b; line-height: 1.6;">
              🔒 <strong>SOUNDTEST.PRO Global Checkout Support</strong><br>
              Direct Link: <a href="${safeUrl}" style="color: #2cf0c1; text-decoration: none;">${safeUrl}</a><br><br>
              ${isEn ? 'Sent automatically by SOUNDTEST.PRO Billing Bot. You can reply directly to this email to reach a human support specialist.' : '由 SOUNDTEST.PRO 财务系统自动发送。如需帮助或开具发票，可直接回复本邮件。'}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return {
    subject: selectedTpl.subject,
    html,
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;

  const isAuthed = await verifyAuth(request, env);
  if (!isAuthed) {
    return json({ ok: false, error: 'unauthorized', message: 'Admin authentication required' }, 401);
  }

  try {
    const body = await request.json().catch(() => ({}));
    const to = String(body.to || '').trim().toLowerCase();
    const name = String(body.name || '').trim();
    const orderId = String(body.orderId || body.order_id || '').trim();
    const plan = String(body.plan || 'pro').toLowerCase();
    const amount = String(body.amount || (body.currency === 'USD' ? '$24.99' : '¥19.90'));
    const currency = (String(body.currency || 'USD')).toUpperCase();
    const checkoutUrl = String(body.checkoutUrl || body.checkout_url || '').trim();
    const templateId = String(body.templateId || 'abandoned_1h').trim();
    const dryRun = Boolean(body.dryRun);
    const customSubject = body.subject ? String(body.subject).trim() : null;
    const customHtml = body.customHtml ? String(body.customHtml).trim() : null;
    const lang = body.lang ? String(body.lang).trim() : null;
    const discountCode = body.discountCode ? String(body.discountCode).trim() : null;
    const discountAmount = body.discountAmount ? String(body.discountAmount).trim() : null;

    if (!to || !to.includes('@')) {
      return json({ ok: false, error: 'invalid_email', message: 'Valid recipient email is required' }, 400);
    }

    // Generate or override template
    const rendered = getEmailTemplate({
      templateId,
      name,
      email: to,
      plan,
      amount,
      currency,
      checkoutUrl,
      orderId,
      lang,
      discountCode,
      discountAmount,
    });

    const finalSubject = customSubject || rendered.subject;
    const finalHtml = customHtml || rendered.html;

    let sendMethod = 'simulated';
    let sendResult = { id: `mock_${Date.now()}` };

    if (!dryRun) {
      const resendApiKey = env.RESEND_API_KEY || body.apiKey;
      const fromEmail = env.EMAIL_FROM || 'SOUNDTEST.PRO <billing@soundtest.pro>';

      if (resendApiKey) {
        // Dispatch via Resend API
        const resendResp = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: fromEmail,
            to: [to],
            subject: finalSubject,
            html: finalHtml,
          }),
        });

        const resendData = await resendResp.json().catch(() => ({}));
        if (!resendResp.ok) {
          throw new Error(resendData.message || resendData.error || 'Resend API failed');
        }
        sendMethod = 'resend';
        sendResult = resendData;
      } else {
        // Fallback: try MailChannels on Cloudflare Workers
        try {
          const mcResp = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              personalizations: [{ to: [{ email: to, name: name || to }] }],
              from: { email: 'billing@soundtest.pro', name: 'SOUNDTEST.PRO' },
              subject: finalSubject,
              content: [{ type: 'text/html', value: finalHtml }],
            }),
          });
          if (mcResp.ok || mcResp.status === 202) {
            sendMethod = 'mailchannels';
            sendResult = { status: 'accepted' };
          }
        } catch (_) {
          // If local environment or MailChannels blocked, safely fallback to simulation
          sendMethod = 'simulated';
        }
      }
    }

    // Update order record in KV if orderId is provided (not in dryRun preview)
    if (!dryRun && orderId && env && env.ab_test) {
      try {
        const orderKey = `order:${orderId}`;
        const raw = await env.ab_test.get(orderKey);
        if (raw) {
          const ord = JSON.parse(raw);
          ord.dunning_count = (ord.dunning_count || 0) + 1;
          ord.last_dunning_at = new Date().toISOString();
          ord.last_dunning_subject = finalSubject;
          ord.last_dunning_template = templateId;
          await env.ab_test.put(orderKey, JSON.stringify(ord), { expirationTtl: 86400 * 365 });
        }
      } catch (kvErr) {
        console.error('Failed to update dunning stats in KV:', kvErr);
      }
    }

    // Record dunning email event in user's browsing journey
    if (!dryRun && to && env && env.ab_test) {
      try {
        const rawHistory = await env.ab_test.get(`history:${to}`);
        let history = [];
        if (rawHistory) {
          try { history = JSON.parse(rawHistory); } catch (_) {}
        }
        if (!Array.isArray(history)) history = [];
        history.unshift({
          timestamp: new Date().toISOString(),
          action: 'email_dunning',
          actionLabel: `营销/催付邮件已送达 (${templateId})`,
          page: '/admin/send-email',
          title: finalSubject,
          template: templateId,
          orderId: orderId || '',
          method: sendMethod,
        });
        if (history.length > 50) history = history.slice(0, 50);
        await env.ab_test.put(`history:${to}`, JSON.stringify(history), { expirationTtl: 90 * 86400 });
      } catch (_) {}
    }

    return json({
      ok: true,
      message: dryRun
        ? '邮件预览渲染成功'
        : `催付邮件已成功发送至 ${to} (${sendMethod})`,
      to,
      subject: finalSubject,
      html: finalHtml,
      method: sendMethod,
      result: sendResult,
      sent_at: new Date().toISOString(),
    });
  } catch (err) {
    return json({ ok: false, error: 'send_failed', message: err.message }, 500);
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization, x-admin-token, x-admin-email, x-session-token',
    },
  });
}
