// Cloudflare Pages Function: /api/membership/creem-webhook
// Automatically receives Creem.io Webhooks (checkout.completed, subscription.paid, etc.)
// Verifies HMAC-SHA256 signature, logs order, and instantly grants Pro membership in Cloudflare KV

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

// Timing-safe string comparison to prevent timing attacks
function timingSafeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

// Compute HMAC-SHA256 hex digest using Web Crypto API
async function computeHmacSha256Hex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Map Creem Product IDs to internal plan identifiers
export function mapCreemProductToPlan(productId, productName = '', metadataPlan = '') {
  const pid = String(productId || '').trim();
  const name = String(productName || '').toLowerCase();
  const metaPlan = String(metadataPlan || '').toLowerCase();

  // 1. Direct match with configured Creem product IDs
  if (pid === 'prod_2Xc2ichF1Xk2mmzrhBxyYC') return 'single';
  if (pid === 'prod_4jTdMPIau4Pzn1HKHPW9NQ') return 'monthly';
  if (pid === 'prod_18imyd506sx0xFOcMiqB2c') return 'yearly';
  if (pid === 'prod_18nHbuAQNpc4n334rM9hGV') return 'lifetime';

  // 2. Check metadata plan if provided
  if (['single', 'monthly', 'pro', 'yearly', 'lifetime', 'team'].includes(metaPlan)) {
    return metaPlan === 'pro' ? 'monthly' : metaPlan;
  }

  // 3. Fallback to product name keywords
  if (name.includes('lifetime') || name.includes('perpetual')) return 'lifetime';
  if (name.includes('year') || name.includes('annual')) return 'yearly';
  if (name.includes('month')) return 'monthly';
  if (name.includes('single') || name.includes('one-time')) return 'single';

  return 'yearly'; // default fallback
}

// Format plan display label
export function getPlanDisplay(planKey) {
  switch (planKey) {
    case 'lifetime':
      return 'Lifetime Perpetual All-Access (USD $79.99)';
    case 'yearly':
      return 'Pro Dispute Guardian Yearly (USD $24.99/yr)';
    case 'monthly':
    case 'pro':
      return 'Pro Monthly Guardian (USD $4.99/mo)';
    case 'single':
      return 'Single Report Official License (USD $1.99)';
    default:
      return 'Pro Member';
  }
}

// Calculate expiration date based on plan
export function calculateExpiration(planKey) {
  const now = Date.now();
  if (planKey === 'lifetime') {
    return '2099-12-31T23:59:59.000Z';
  }
  if (planKey === 'yearly') {
    // 365 + 2 days grace period
    return new Date(now + 367 * 86400 * 1000).toISOString();
  }
  if (planKey === 'single') {
    // 365 days validity
    return new Date(now + 365 * 86400 * 1000).toISOString();
  }
  // monthly: 30 + 2 days grace period
  return new Date(now + 32 * 86400 * 1000).toISOString();
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const rawBody = await request.text();
    const signature = request.headers.get('creem-signature') ||
                      request.headers.get('Creem-Signature') ||
                      request.headers.get('x-creem-signature') ||
                      '';

    const webhookSecret = String(env.CREEM_WEBHOOK_SECRET || '').trim();

    // 1. Verify Signature if secret is configured
    if (webhookSecret) {
      if (!signature) {
        return json({ ok: false, error: 'missing_signature', message: 'creem-signature header missing' }, 401);
      }
      const expectedSignature = await computeHmacSha256Hex(webhookSecret, rawBody);
      if (!timingSafeEqual(expectedSignature.toLowerCase(), signature.toLowerCase())) {
        return json({ ok: false, error: 'invalid_signature', message: 'Webhook signature verification failed' }, 401);
      }
    } else {
      console.warn('[Creem Webhook] Warning: CREEM_WEBHOOK_SECRET is not configured in environment. Skipping signature check.');
    }

    // 2. Parse JSON payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      return json({ ok: false, error: 'invalid_json', message: 'Unable to parse request body as JSON' }, 400);
    }

    const eventType = String(payload.eventType || payload.event || '').toLowerCase();
    const obj = payload.object || payload.data || payload;

    // 3. Extract Customer & Order Details
    const customer = obj.customer || {};
    const product = obj.product || {};
    const metadata = obj.metadata || {};

    const email = String(
      customer.email ||
      obj.customer_email ||
      metadata.email ||
      obj.email ||
      ''
    ).trim().toLowerCase();

    if (!email || !email.includes('@')) {
      // Event might not contain customer email (e.g. system test ping)
      return json({ ok: true, note: 'event_received_no_email', eventType });
    }

    const productId = product.id || obj.product_id || '';
    const productName = product.name || obj.product_name || '';
    const planKey = mapCreemProductToPlan(productId, productName, metadata.plan);
    const planDisplay = getPlanDisplay(planKey);
    const orderId = String(obj.order_id || obj.id || `creem_${Date.now()}`);
    const subscriptionId = String(obj.subscription || obj.subscription_id || '');
    const customerId = String(customer.id || obj.customer_id || '');

    // Amount calculation
    let amountDollars = '0.00';
    if (typeof product.price === 'number') {
      amountDollars = (product.price / 100).toFixed(2);
    } else if (typeof obj.amount === 'number') {
      amountDollars = (obj.amount / 100).toFixed(2);
    } else {
      if (planKey === 'single') amountDollars = '1.99';
      else if (planKey === 'monthly') amountDollars = '4.99';
      else if (planKey === 'yearly') amountDollars = '24.99';
      else if (planKey === 'lifetime') amountDollars = '79.99';
    }

    const kv = env.ab_test;
    const nowIso = new Date().toISOString();

    // 4. Handle Grant Events: checkout.completed, subscription.paid, subscription.active, subscription.trialing
    const isGrantEvent = [
      'checkout.completed',
      'subscription.paid',
      'subscription.active',
      'subscription.trialing',
      'order.paid',
      'payment.succeeded',
    ].includes(eventType);

    // Handle Revoke Events: subscription.expired, subscription.paused, subscription.canceled
    const isRevokeEvent = [
      'subscription.expired',
      'subscription.paused',
      'subscription.canceled',
    ].includes(eventType);

    // Handle Refund Events: refund.created, dispute.created
    const isRefundEvent = [
      'refund.created',
      'dispute.created',
    ].includes(eventType);

    if (kv) {
      if (isGrantEvent) {
        const expDate = calculateExpiration(planKey);

        // A. Update or Set member:${email}
        const memberRecord = {
          email,
          plan: planKey === 'lifetime' || planKey === 'yearly' || planKey === 'monthly' ? 'pro' : planKey,
          plan_type: planKey,
          plan_display: planDisplay,
          status: 'paid',
          granted_at: nowIso,
          expires_at: expDate,
          order_id: orderId,
          subscription_id: subscriptionId || null,
          customer_id: customerId || null,
          product_id: productId,
          amount: amountDollars,
          currency: 'USD',
          granted_by: 'creem_webhook',
          provider: 'creem',
        };
        await kv.put(`member:${email}`, JSON.stringify(memberRecord), {
          expirationTtl: planKey === 'lifetime' ? 86400 * 365 * 10 : 86400 * 400,
        });

        // B. Update or Auto-create user:${email}
        let userRecord = null;
        try {
          const userRaw = await kv.get(`user:${email}`);
          if (userRaw) {
            userRecord = JSON.parse(userRaw);
            userRecord.plan = memberRecord.plan;
            userRecord.plan_display = planDisplay;
            userRecord.role = 'pro';
            userRecord.expires_at = expDate;
            userRecord.updated_at = nowIso;
            userRecord.last_payment_at = nowIso;
          }
        } catch (_) {}

        if (!userRecord) {
          userRecord = {
            email,
            plan: memberRecord.plan,
            plan_display: planDisplay,
            role: 'pro',
            status: 'active',
            created_at: nowIso,
            updated_at: nowIso,
            expires_at: expDate,
            auto_created: true,
            provider: 'creem',
            first_login_confirmed: false,
          };
        }
        await kv.put(`user:${email}`, JSON.stringify(userRecord));

        // C. Record order:${orderId} for Admin Dashboard & Analytics
        const orderRecord = {
          order_id: orderId,
          trade_order_id: orderId,
          email,
          plan: planKey,
          fee: amountDollars,
          amount: amountDollars,
          currency: 'USD',
          provider: 'creem',
          status: 'paid',
          created_at: nowIso,
          paid_at: nowIso,
          subscription_id: subscriptionId || null,
          customer_id: customerId || null,
          product_id: productId,
          product_name: productName || planDisplay,
          raw_event: eventType,
        };
        await kv.put(`order:${orderId}`, JSON.stringify(orderRecord), {
          expirationTtl: 86400 * 365 * 2,
        });

        console.log(`[Creem Webhook] Successfully granted ${planDisplay} to ${email} (Order: ${orderId})`);

        return json({
          ok: true,
          action: 'granted',
          email,
          plan: planKey,
          plan_display: planDisplay,
          expires_at: expDate,
          order_id: orderId,
        });
      }

      if (isRevokeEvent) {
        // Only revoke if mode is not scheduled_cancel with future expiration
        const isScheduled = obj.mode === 'scheduled' || eventType === 'subscription.scheduled_cancel';
        if (!isScheduled) {
          try {
            const memRaw = await kv.get(`member:${email}`);
            if (memRaw) {
              const mem = JSON.parse(memRaw);
              mem.status = eventType === 'subscription.paused' ? 'paused' : 'expired';
              mem.revoked_at = nowIso;
              await kv.put(`member:${email}`, JSON.stringify(mem));
            }
          } catch (_) {}
        }
        return json({ ok: true, action: 'revocation_processed', email, eventType });
      }

      if (isRefundEvent) {
        try {
          const memRaw = await kv.get(`member:${email}`);
          if (memRaw) {
            const mem = JSON.parse(memRaw);
            mem.status = 'refunded';
            mem.refunded_at = nowIso;
            await kv.put(`member:${email}`, JSON.stringify(mem));
          }
          const ordRaw = await kv.get(`order:${orderId}`);
          if (ordRaw) {
            const ord = JSON.parse(ordRaw);
            ord.status = 'refunded';
            ord.refunded_at = nowIso;
            await kv.put(`order:${orderId}`, JSON.stringify(ord));
          }
        } catch (_) {}
        return json({ ok: true, action: 'refund_processed', email, orderId });
      }
    }

    return json({
      ok: true,
      received: true,
      eventType,
      email,
      note: kv ? 'unhandled_event_type' : 'kv_namespace_not_bound',
    });
  } catch (err) {
    console.error('[Creem Webhook Error]', err);
    return json({ ok: false, error: 'server_error', message: err.message }, 500);
  }
}

// GET endpoint: Webhook health check and status
export async function onRequestGet() {
  return json({
    ok: true,
    service: 'creem_webhook_receiver',
    status: 'online',
    version: '1.0.0',
    supported_events: [
      'checkout.completed',
      'subscription.paid',
      'subscription.active',
      'subscription.trialing',
      'subscription.expired',
      'subscription.canceled',
      'subscription.paused',
      'refund.created',
      'dispute.created',
    ],
  });
}

// OPTIONS preflight
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, GET, OPTIONS',
      'access-control-allow-headers': 'content-type, creem-signature, x-creem-signature',
    },
  });
}
