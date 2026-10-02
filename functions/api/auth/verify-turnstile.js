// Cloudflare Pages Function: /api/auth/verify-turnstile
// Validates Cloudflare Turnstile token on user registration

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

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json().catch(() => ({}));
    const token = String(body.token || '').trim();

    if (!token) {
      return json({ ok: false, error: 'missing_token', message: 'Verification token is required' }, 400);
    }

    // Default to Cloudflare Turnstile official testing secret key if env is not set
    // Test key: 1x0000000000000000000000000000000AA always passes
    const secretKey = String(env.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA');
    const clientIp = request.headers.get('cf-connecting-ip') || '';

    const formData = new URLSearchParams();
    formData.append('secret', secretKey);
    formData.append('response', token);
    if (clientIp) {
      formData.append('remoteip', clientIp);
    }

    const verifyResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
    });

    const verifyData = await verifyResp.json().catch(() => ({}));
    if (verifyData.success) {
      return json({ ok: true, verified_at: new Date().toISOString() });
    }

    return json({
      ok: false,
      error: 'verification_failed',
      codes: verifyData['error-codes'] || [],
      message: 'Cloudflare security verification failed. Please try again.',
    }, 403);
  } catch (err) {
    return json({ ok: false, error: 'internal_error', message: err.message || 'Error verifying captcha' }, 500);
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
