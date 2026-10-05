import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { onRequestPost as onCreemWebhook } from '../functions/api/membership/creem-webhook.js';
import { onRequestPost as onMembershipLookup } from '../functions/api/membership/lookup.js';
import { onRequestPost as onSessionCheck } from '../functions/api/auth/session.js';
import { onRequestGet as onAdminOrders } from '../functions/api/admin/orders.js';

function computeHmacHex(secret, text) {
  return crypto.createHmac('sha256', secret).update(text).digest('hex');
}

function createMockKV() {
  const store = new Map();
  return {
    async get(key) {
      return store.get(key) || null;
    },
    async put(key, val) {
      store.set(key, val);
    },
    async delete(key) {
      store.delete(key);
    },
    async list(opts = {}) {
      const prefix = opts.prefix || '';
      const keys = [];
      for (const k of store.keys()) {
        if (k.startsWith(prefix)) keys.push({ name: k });
      }
      return { keys };
    },
    _raw: store,
  };
}

test('End-to-End Creem Sandbox Checkout -> Webhook -> Instant Membership Upgrade -> Admin Verification', async () => {
  const webhookSecret = 'creem_whsec_sandbox_verification_token_2026';
  const mockKV = createMockKV();
  const env = {
    CREEM_WEBHOOK_SECRET: webhookSecret,
    ADMIN_SECRET: 'soundtest_admin_2026',
    ab_test: mockKV,
  };

  const customerEmail = 'customer.alex@gmail.com';
  const orderId = 'chk_creem_sandbox_888';

  // Step 1: Initial state - user is not a member
  const preLookupReq = new Request('https://soundtest.pro/api/membership/lookup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: customerEmail }),
  });
  const preLookupRes = await onMembershipLookup({ request: preLookupReq, env });
  const preLookupData = await preLookupRes.json();
  assert.equal(preLookupData.active, false, 'User must initially be inactive');

  // Step 2: Creem Sandbox triggers checkout.completed webhook after test card payment
  const creemPayload = {
    id: 'evt_creem_sandbox_event_1',
    eventType: 'checkout.completed',
    created_at: Date.now(),
    object: {
      id: orderId,
      order_id: orderId,
      customer: {
        id: 'cust_sandbox_alex',
        email: customerEmail,
        name: 'Alex Johnson',
      },
      product: {
        id: 'prod_18imyd506sx0xFOcMiqB2c',
        name: 'Pro Dispute Guardian Yearly',
        price: 2499, // 2499 cents = $24.99 USD
        currency: 'USD',
      },
      subscription: 'sub_creem_yearly_alex',
      metadata: {
        plan: 'yearly',
      },
    },
  };

  const payloadText = JSON.stringify(creemPayload);
  const signature = computeHmacHex(webhookSecret, payloadText);

  const webhookReq = new Request('https://soundtest.pro/api/membership/creem-webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'creem-signature': signature,
    },
    body: payloadText,
  });

  const webhookRes = await onCreemWebhook({ request: webhookReq, env });
  assert.equal(webhookRes.status, 200, 'Webhook must return 200 OK');
  const webhookData = await webhookRes.json();
  assert.equal(webhookData.ok, true);
  assert.equal(webhookData.action, 'granted');
  assert.equal(webhookData.email, customerEmail);
  assert.equal(webhookData.plan, 'yearly');

  // Step 3: Frontend calls /api/membership/lookup -> immediately returns active Pro
  const postLookupReq = new Request('https://soundtest.pro/api/membership/lookup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: customerEmail }),
  });
  const postLookupRes = await onMembershipLookup({ request: postLookupReq, env });
  const postLookupData = await postLookupRes.json();
  assert.equal(postLookupData.active, true, 'User must now be active Pro');
  assert.equal(postLookupData.plan, 'pro');
  assert.equal(postLookupData.status, 'paid');
  assert.equal(postLookupData.granted_by, 'creem_webhook');

  // Step 4: User creates session and silent refresh calls /api/auth/session
  const testSessionToken = 'sess_test_alex_token';
  await mockKV.put(`sess:${testSessionToken}`, JSON.stringify({
    email: customerEmail,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 86400 * 30 * 1000).toISOString(),
  }));

  const sessionReq = new Request('https://soundtest.pro/api/auth/session', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ token: testSessionToken }),
  });
  const sessionRes = await onSessionCheck({ request: sessionReq, env });
  const sessionData = await sessionRes.json();
  assert.equal(sessionData.valid, true);
  assert.equal(sessionData.membership.active, true);
  assert.equal(sessionData.membership.plan, 'pro');

  // Step 5: Admin inspects /api/admin/orders -> order appears in revenue statistics
  const adminReq = new Request('https://soundtest.pro/api/admin/orders', {
    method: 'GET',
    headers: {
      'authorization': 'Bearer soundtest_admin_2026',
    },
  });
  const adminRes = await onAdminOrders({ request: adminReq, env });
  const adminData = await adminRes.json();
  assert.equal(adminData.ok, true);
  assert.equal(adminData.stats.paidOrders >= 1, true);
  assert.equal(adminData.stats.totalRevenueUsd, '24.99');
  assert.ok(adminData.orders.some((o) => o.email === customerEmail && o.provider === 'creem' && o.status === 'paid'));
});
