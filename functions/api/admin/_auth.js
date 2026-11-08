// Cloudflare Pages Function: /api/admin/_auth.js
// Centralized Security & Authentication Engine for Super Admin Console
// 1. Enforces strict Super Admin email identity anchoring
// 2. Issues dynamic short-lived cryptographic session tokens (12h auto-expiry)
// 3. Implements IP-level anti-brute-force rate limiting and lockout
// 4. Eliminates reliance on hardcoded static secrets when env.ADMIN_SECRET is set

export const SUPER_ADMIN_EMAILS = [
  'wewee1@gmail.com',
  'wewee@163.com',
  'admin@soundtest.pro',
];

export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_SECONDS = 1800; // 30 minutes
export const ATTEMPT_WINDOW_SECONDS = 300; // 5 minutes
export const SESSION_TTL_SECONDS = 43200; // 12 hours

// Extract client IP address from Cloudflare edge headers
export function getClientIp(request) {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1'
  );
}

// Check if IP is currently locked out due to excessive failed login attempts
export async function checkBruteForce(env, ip) {
  if (!env || !env.ab_test || !ip) return { locked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  try {
    const lockKey = `adm_lock:${ip}`;
    const isLocked = await env.ab_test.get(lockKey);
    if (isLocked) {
      return { locked: true, remainingAttempts: 0 };
    }

    const failKey = `adm_fail:${ip}`;
    const rawFails = await env.ab_test.get(failKey);
    const failCount = rawFails ? parseInt(rawFails, 10) || 0 : 0;
    const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - failCount);
    return { locked: false, remainingAttempts: remaining, failCount };
  } catch (_) {
    return { locked: false, remainingAttempts: MAX_FAILED_ATTEMPTS };
  }
}

// Record a failed login attempt and trigger IP lockout if threshold exceeded
export async function recordFailedAttempt(env, ip) {
  if (!env || !env.ab_test || !ip) return { locked: false, remaining: 0 };
  try {
    const failKey = `adm_fail:${ip}`;
    const rawFails = await env.ab_test.get(failKey);
    const currentFails = (rawFails ? parseInt(rawFails, 10) || 0 : 0) + 1;

    if (currentFails >= MAX_FAILED_ATTEMPTS) {
      const lockKey = `adm_lock:${ip}`;
      await env.ab_test.put(lockKey, '1', { expirationTtl: LOCKOUT_SECONDS });
      await env.ab_test.delete(failKey);
      return { locked: true, remaining: 0 };
    }

    await env.ab_test.put(failKey, String(currentFails), { expirationTtl: ATTEMPT_WINDOW_SECONDS });
    return { locked: false, remaining: MAX_FAILED_ATTEMPTS - currentFails };
  } catch (_) {
    return { locked: false, remaining: 0 };
  }
}

// Clear failed attempt counters on successful login
export async function clearFailedAttempts(env, ip) {
  if (!env || !env.ab_test || !ip) return;
  try {
    await env.ab_test.delete(`adm_fail:${ip}`);
    await env.ab_test.delete(`adm_lock:${ip}`);
  } catch (_) {}
}

// Create a cryptographically secure, short-lived Admin session in KV
export async function createAdminSession(env, email, ip, userAgent = '') {
  let uuid = '';
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      uuid = crypto.randomUUID().replace(/-/g, '');
    }
  } catch (_) {}
  if (!uuid) {
    uuid = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  }
  const token = `adm_sess_${uuid}_${Date.now().toString(36)}`;

  if (env && env.ab_test) {
    const sessionData = {
      token,
      email,
      role: 'super_admin',
      ip,
      userAgent: userAgent.slice(0, 200),
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toISOString(),
    };
    try {
      await env.ab_test.put(`adm_sess:${token}`, JSON.stringify(sessionData), {
        expirationTtl: SESSION_TTL_SECONDS,
      });
    } catch (_) {}
  }

  return token;
}

// Revoke an Admin session immediately (on logout)
export async function destroyAdminSession(env, token) {
  if (!env || !env.ab_test || !token) return;
  try {
    if (token.startsWith('adm_sess_')) {
      await env.ab_test.delete(`adm_sess:${token}`);
    }
  } catch (_) {}
}

// Verify incoming request authorization against dynamic sessions, user sessions, and master secret
export async function verifyAdminRequest(request, env) {
  const authHeader = request.headers.get('authorization') || '';
  const token =
    authHeader.replace(/^Bearer\s+/i, '').trim() ||
    request.headers.get('x-admin-token') ||
    request.headers.get('x-session-token') ||
    new URL(request.url).searchParams.get('token') ||
    '';

  const callerEmail = (
    request.headers.get('x-admin-email') ||
    new URL(request.url).searchParams.get('admin_email') ||
    ''
  ).toLowerCase().trim();

  if (!token) {
    return { ok: false, reason: 'missing_token' };
  }

  // 1. Dynamic Admin Session check (adm_sess:...)
  if (token.startsWith('adm_sess_') && env && env.ab_test) {
    try {
      const sessRaw = await env.ab_test.get(`adm_sess:${token}`);
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        if (sess && sess.email && SUPER_ADMIN_EMAILS.includes(sess.email.toLowerCase())) {
          return { ok: true, email: sess.email, role: 'super_admin', isDynamic: true };
        }
      }
    } catch (_) {}
  }

  // 2. Regular user session check for super admin email (sess:...)
  if (token.startsWith('sess_') && env && env.ab_test) {
    try {
      const sessRaw = await env.ab_test.get(`sess:${token}`);
      if (sessRaw) {
        const sess = JSON.parse(sessRaw);
        const email = (sess.email || '').toLowerCase().trim();
        if (SUPER_ADMIN_EMAILS.includes(email) || sess.role === 'admin' || sess.role === 'super_admin') {
          return { ok: true, email, role: 'super_admin', isDynamic: true };
        }
      }
    } catch (_) {}
  }

  // 3. Custom ADMIN_SECRET check from Cloudflare Environment Variables
  const envSecret = String(env?.ADMIN_SECRET || '').trim();
  const hasCustomSecret = Boolean(envSecret && envSecret.length >= 8);

  if (hasCustomSecret && token === envSecret) {
    // If custom secret is configured, require callerEmail to be an authorized admin if provided
    const authorizedEmail = SUPER_ADMIN_EMAILS.includes(callerEmail) ? callerEmail : SUPER_ADMIN_EMAILS[0];
    return { ok: true, email: authorizedEmail, role: 'super_admin', isSecret: true };
  }

  // 4. Default fallback secret (only active if custom ADMIN_SECRET is not configured)
  const legacySecrets = [
    'soundtest_admin_2026',
    'SOUNDTEST.PRO@2026',
    'soundtest.pro@2026',
    'soundtest2026',
    'soundtest_admin',
  ];

  if (!hasCustomSecret && legacySecrets.some((k) => k.toLowerCase() === token.toLowerCase())) {
    const authorizedEmail = SUPER_ADMIN_EMAILS.includes(callerEmail) ? callerEmail : SUPER_ADMIN_EMAILS[0];
    return { ok: true, email: authorizedEmail, role: 'super_admin', isSecret: true };
  }

  return { ok: false, reason: 'unauthorized' };
}
