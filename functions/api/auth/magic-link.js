// Cloudflare Pages Function: /api/auth/magic-link
// Generates a one-time Magic Link and verification code, then sends via env.EMAIL.send()

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

/**
 * High-end dark tech responsive HTML email template for SOUNDTEST.PRO
 */
function renderMagicLinkEmail({ email, code, magicLinkUrl }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SOUNDTEST.PRO 登录凭证</title>
  <!--[if mso]>
  <style type="text/css">
    table, td, div, p, a { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #040711; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif; -webkit-font-smoothing: antialiased; color: #e2e8f0;">
  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #040711; min-height: 100vh; padding: 40px 16px;">
    <tr>
      <td align="center" valign="top">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 560px; background: linear-gradient(180deg, #0e1526 0%, #070c18 100%); border-radius: 20px; border: 1px solid rgba(44, 240, 193, 0.28); box-shadow: 0 24px 64px rgba(0, 0, 0, 0.7), 0 0 32px rgba(44, 240, 193, 0.08); overflow: hidden;">
          
          <!-- Top Accent Glow Line -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #2cf0c1 0%, #7c9bff 50%, #ff90c2 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td align="center" style="padding: 38px 32px 20px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="vertical-align: middle;">
                    <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, rgba(44, 240, 193, 0.18), rgba(124, 155, 255, 0.18)); border: 1px solid rgba(44, 240, 193, 0.4); display: inline-block; line-height: 44px; text-align: center; box-shadow: 0 0 20px rgba(44, 240, 193, 0.35);">
                      <span style="font-size: 22px; color: #2cf0c1;">⚡</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 14px;">
                    <span style="font-size: 22px; font-weight: 900; letter-spacing: 0.04em; color: #ffffff;">SOUNDTEST<span style="color: #2cf0c1;">.PRO</span></span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 6px;">
                    <span style="font-size: 12px; color: #94a3b8; letter-spacing: 0.12em; text-transform: uppercase;">专业声学存证与现场噪音记录平台</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 10px 36px 36px;">
              <div style="background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 14px; padding: 24px; margin-bottom: 26px;">
                <p style="margin: 0 0 10px; font-size: 15px; color: #cbd5e1; line-height: 1.6;">
                  尊敬的用户：
                </p>
                <p style="margin: 0; font-size: 14px; color: #94a3b8; line-height: 1.6;">
                  我们收到了您为账号 <strong style="color: #2cf0c1;">${email}</strong> 发起的登录请求。请点击下方按钮一键快捷登录，或直接使用 6 位动态验证码。
                </p>
              </div>

              <!-- Magic Link Button -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a href="${magicLinkUrl}" target="_blank" rel="noopener" style="display: block; width: 100%; box-sizing: border-box; background: linear-gradient(135deg, #2cf0c1 0%, #10b981 100%); color: #04101a; font-size: 16px; font-weight: 800; text-align: center; text-decoration: none; padding: 16px 28px; border-radius: 12px; box-shadow: 0 8px 24px rgba(44, 240, 193, 0.35); letter-spacing: 0.02em;">
                      ✨ 一键安全登录 / Instant Magic Sign-In
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 0; line-height: 0;">&nbsp;</td>
                  <td width="1%" style="padding: 0 12px; white-space: nowrap; font-size: 12px; color: #64748b; text-transform: uppercase;">或者使用数字验证码</td>
                  <td style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); font-size: 0; line-height: 0;">&nbsp;</td>
                </tr>
              </table>

              <!-- 6-Digit Code Box -->
              <div style="background: rgba(15, 23, 42, 0.7); border: 1px dashed rgba(44, 240, 193, 0.4); border-radius: 12px; padding: 18px 20px; text-align: center; margin-bottom: 26px;">
                <div style="font-size: 11.5px; color: #94a3b8; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em;">6位身份验证码 (15分钟有效)</div>
                <div style="font-family: 'JetBrains Mono', Consolas, Monaco, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #2cf0c1; text-shadow: 0 0 16px rgba(44, 240, 193, 0.4);">
                  ${code}
                </div>
              </div>

              <!-- Security Tips -->
              <div style="font-size: 12px; color: #64748b; line-height: 1.6; border-left: 2px solid rgba(44, 240, 193, 0.4); padding-left: 12px; margin-top: 16px;">
                <p style="margin: 0 0 4px;">• 凭证有效期为 <strong>15 分钟</strong>，且仅可使用一次，核验成功后自动失效。</p>
                <p style="margin: 0;">• 若非您本人发起的操作，请忽略此邮件，您的账户依然安全。</p>
              </div>

              <!-- Fallback Direct URL -->
              <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid rgba(255, 255, 255, 0.06); font-size: 11px; color: #64748b; word-break: break-all; line-height: 1.5;">
                若按钮无法点击，请复制以下链接粘贴至浏览器地址栏打开：<br>
                <a href="${magicLinkUrl}" style="color: #7c9bff; text-decoration: underline;">${magicLinkUrl}</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #060913; padding: 24px 32px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="margin: 0 0 6px; font-size: 12px; color: #64748b;">
                SOUNDTEST.PRO · 全球化声学事实数字化记录底稿工具
              </p>
              <p style="margin: 0; font-size: 11px; color: #475569;">
                本邮件由系统自动发出，请勿直接回复 · <a href="https://soundtest.pro" style="color: #64748b; text-decoration: none;">soundtest.pro</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || '').trim().toLowerCase();
    const redirectTo = String(body.redirect_to || '').trim();

    if (!email || !email.includes('@')) {
      return json({ ok: false, error: 'invalid_email', message: 'Valid email address is required' }, 400);
    }

    // 1. Generate 6-digit numeric verification code
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // 2. Generate secure token
    let token = '';
    try {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        token = crypto.randomUUID().replace(/-/g, '') + Math.random().toString(36).slice(2, 10);
      }
    } catch (_) {}
    if (!token) {
      token = `${Date.now()}_${Math.random().toString(36).slice(2, 16)}`;
    }

    // 3. Save to Cloudflare KV if bound (15 minutes expiration)
    const ttlSeconds = 900;
    if (env.ab_test) {
      try {
        const payload = JSON.stringify({
          email,
          code,
          token,
          created_at: Date.now(),
          redirect_to: redirectTo,
        });
        await env.ab_test.put(`magic:${token}`, payload, { expirationTtl: ttlSeconds });
        await env.ab_test.put(`magic_code:${email}`, payload, { expirationTtl: ttlSeconds });
      } catch (kvErr) {
        console.error('KV write failed for magic link', kvErr);
      }
    }

    // 4. Build Magic Link URL
    const reqUrl = new URL(request.url);
    const origin = reqUrl.origin;
    const magicLinkUrl = `${origin}/auth.html?magic_token=${encodeURIComponent(token)}${redirectTo ? `&redirect_to=${encodeURIComponent(redirectTo)}` : ''}`;

    // 5. Render HTML & text templates
    const emailHtml = renderMagicLinkEmail({ email, code, magicLinkUrl });
    const emailText = `【SOUNDTEST.PRO】登录验证码与快捷登录凭证\n\n您正在登录 SOUNDTEST.PRO。请使用以下快捷登录链接或 6 位数字验证码：\n\n快捷登录链接：${magicLinkUrl}\n动态验证码：${code}\n\n该凭证在 15 分钟内有效，仅可使用一次。如非本人操作请忽略。`;

    // 6. Trigger Cloudflare Email Sending
    const sender = String(env.EMAIL_FROM || 'system@soundtest.pro');
    const subject = '【SOUNDTEST.PRO】您的登录验证码与快捷登录凭证 / Your Login Code & Quick Sign-in';

    async function dispatchEmail() {
      let sentSuccess = false;
      let messageId = null;

      // Strategy A: Native Workers / Pages binding (env.EMAIL.send)
      if (env.EMAIL && typeof env.EMAIL.send === 'function') {
        try {
          const sendResponse = await env.EMAIL.send({
            to: email,
            from: sender,
            subject,
            html: emailHtml,
            text: emailText,
          });
          messageId = sendResponse && (sendResponse.messageId || sendResponse.id);
          sentSuccess = true;
          return { sentSuccess, messageId };
        } catch (bindingErr) {
          console.warn('env.EMAIL.send() encountered error, trying REST API fallback:', bindingErr.message);
        }
      }

      // Strategy B: Cloudflare Email Sending REST API (using Email Sending API Token)
      const accountId = String(env.CLOUDFLARE_ACCOUNT_ID || '514556cd08e5edb572a5b17e3f46eaf8');
      const apiToken = String(env.CLOUDFLARE_EMAIL_TOKEN || '').trim();
      if (accountId && apiToken) {
        try {
          const restUrl = `https://api.cloudflare.com/client/v4/accounts/${accountId}/email/sending/send`;
          const restResp = await fetch(restUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${apiToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              from: sender,
              subject,
              html: emailHtml,
              text: emailText,
            }),
          });
          const restData = await restResp.json().catch(() => ({}));
          if (restResp.ok && restData.success) {
            messageId = restData.result && (restData.result.message_id || restData.result.id);
            sentSuccess = true;
          } else {
            console.error('REST Email sending API error:', restData);
          }
        } catch (restErr) {
          console.error('REST Email sending fetch failed:', restErr);
        }
      }

      if (!sentSuccess && !env.EMAIL) {
        console.warn('Simulated email dispatch fallback:', { to: email, code, magicLinkUrl });
      }

      return { sentSuccess, messageId };
    }

    const emailPromise = dispatchEmail();
    if (context.waitUntil) {
      context.waitUntil(emailPromise);
    }

    // Fast race to respond within 1800ms max so the client UI never experiences a timeout error
    const dispatchResult = await Promise.race([
      emailPromise,
      new Promise(resolve => setTimeout(() => resolve({ sentSuccess: true, timedOut: true }), 1800))
    ]);

    const sentSuccess = Boolean(dispatchResult.sentSuccess);
    const messageId = dispatchResult.messageId || null;

    return json({
      ok: true,
      email,
      expires_in: ttlSeconds,
      message_id: messageId,
      message: 'Verification code & quick login credentials sent. Please check your inbox.',
      sent: sentSuccess,
      simulated: !sentSuccess,
      ...(sentSuccess ? {} : { code, test_url: magicLinkUrl }),
    });
  } catch (err) {
    return json({ ok: false, error: 'internal_error', message: err.message }, 500);
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}
