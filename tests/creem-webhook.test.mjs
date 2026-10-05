import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {
  onRequestPost,
  onRequestGet,
  mapCreemProductToPlan,
  getPlanDisplay,
  calculateExpiration,
} from '../functions/api/membership/creem-webhook.js';

// Helper to compute HMAC-SHA256 in test runner
function computeHmacHex(secret, text) {
  return crypto.createHmac('sha256', secret).update(text).digest('hex');
}

// Mock KV store
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

test('mapCreemProductToPlan correctly identifies all 4 pricing tiers', () => {
  assert.equal(mapCreemProductToPlan('prod_2Xc2ichF1Xk2mmzrhBxyYC'), 'single');
  assert.equal(mapCreemProductToPlan('prod_4jTdMPIau4Pzn1HKHPW9NQ'), 'monthly');
  assert.equal(mapCreemProductToPlan('prod_18imyd506sx0xFOcMiqB2c'), 'yearly');
  assert.equal(mapCreemProductToPlan('prod_18nHbuAQNpc4n334rM9hGV'), 'lifetime');

  // Fallback to name keywords
  assert.equal(mapCreemProductToPlan('prod_unknown', 'Perpetual Lifetime Access'), 'lifetime');
  assert.equal(mapCreemProductToPlan('prod_unknown', 'Annual Pro License'), 'yearly');
  assert.equal(mapCreemProductToPlan('prod_unknown', 'Monthly subscription'), 'monthly');
  assert.equal(mapCreemProductToPlan('prod_unknown', 'Single Report Certificate'), 'single');

  // Fallback to metadata
  assert.equal(mapCreemProductToPlan('prod_unknown', '', 'yearly'), 'yearly');
  assert.equal(mapCreemProductToPlan('prod_unknown', '', 'lifetime'), 'lifetime');
});

test('calculateExpiration sets appropriate validity periods', () => {
  const lifetimeExp = calculateExpiration('lifetime');
  assert.equal(lifetimeExp, '2099-12-31T23:59:59.000Z');

  const yearlyExp = new Date(calculateExpiration('yearly')).getTime();
  const now = Date.now();
  const diffDays = Math.round((yearlyExp - now) / (86400 * 1000));
  assert.ok(diffDays >= 365 && diffDays <= 368);

  const monthlyExp = new Date(calculateExpiration('monthly')).getTime();
  const diffDaysMonthly = Math.round((monthlyExp - now) / (86400 * 1000));
  assert.ok(diffDaysMonthly >= 30 && diffDaysMonthly <= 33);
});

test('Creem webhook rejects requests with invalid or missing signature when secret configured', async () => {
  const secret = 'test_webhook_secret_key_123';
  const mockKV = createMockKV();
  const bodyText = JSON.stringify({
    eventType: 'checkout.completed',
    object: { customer: { email: 'test@example.com' } },
  });

  // 1. Missing signature
  const reqNoSig = new Request('https://soundtest.pro/api/membership/creem-webhook', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: bodyText,
  });
  const resNoSig = await onRequestPost({ request: reqNoSig, env: { CREEM_WEBHOOK_SECRET: secret, ab_test: mockKV } });
  assert.equal(resNoSig.status, 401);
  const dataNoSig = await resNoSig.json();
  assert.equal(dataNoSig.error, 'missing_signature');

  // 2. Forged signature
  const reqForged = new Request('https://soundtest.pro/api/membership/creem-webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'creem-signature': '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    },
    body: bodyText,
  });
  const resForged = await onRequestPost({ request: reqForged, env: { CREEM_WEBHOOK_SECRET: secret, ab_test: mockKV } });
  assert.equal(resForged.status, 401);
  const dataForged = await resForged.json();
  assert.equal(dataForged.error, 'invalid_signature');
});

test('Creem webhook processes checkout.completed, activates member, user, and order in KV', async () => {
  const secret = 'whsec_prod_live_mock_key';
  const mockKV = createMockKV();

  const customerEmail = 'sarah.miller@example.com';
  const payload = {
    id: 'evt_987654321',
    eventType: 'checkout.completed',
    created_at: 1728734325927,
    object: {
      id: 'chk_creem_order_555',
      order_id: 'ord_creem_555',
      customer: {
        id: 'cust_abc123',
        email: customerEmail,
        name: 'Sarah Miller',
      },
      product: {
        id: 'prod_18imyd506sx0xFOcMiqB2c',
        name: 'Pro Dispute Guardian',
        price: 2499, // 2499 cents = $24.99
        currency: 'USD',
      },
      subscription: 'sub_xyz789',
      metadata: {
        plan: 'yearly',
      },
    },
  };

  const bodyText = JSON.stringify(payload);
  const validSignature = computeHmacHex(secret, bodyText);

  const request = new Request('https://soundtest.pro/api/membership/creem-webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'creem-signature': validSignature,
    },
    body: bodyText,
  });

  const response = await onRequestPost({
    request,
    env: {
      CREEM_WEBHOOK_SECRET: secret,
      ab_test: mockKV,
    },
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.ok, true);
  assert.equal(result.action, 'granted');
  assert.equal(result.email, customerEmail);
  assert.equal(result.plan, 'yearly');

  // Verify KV member record
  const memberRaw = await mockKV.get(`member:${customerEmail}`);
  assert.ok(memberRaw, 'Member record should exist in KV');
  const member = JSON.parse(memberRaw);
  assert.equal(member.email, customerEmail);
  assert.equal(member.status, 'paid');
  assert.equal(member.plan, 'pro');
  assert.equal(member.amount, '24.99');
  assert.equal(member.currency, 'USD');
  assert.equal(member.provider, 'creem');
  assert.equal(member.granted_by, 'creem_webhook');

  // Verify KV user record
  const userRaw = await mockKV.get(`user:${customerEmail}`);
  assert.ok(userRaw, 'User record should exist in KV');
  const user = JSON.parse(userRaw);
  assert.equal(user.email, customerEmail);
  assert.equal(user.role, 'pro');
  assert.equal(user.status, 'active');

  // Verify KV order record
  const orderRaw = await mockKV.get('order:ord_creem_555');
  assert.ok(orderRaw, 'Order record should exist in KV');
  const order = JSON.parse(orderRaw);
  assert.equal(order.email, customerEmail);
  assert.equal(order.status, 'paid');
  assert.equal(order.fee, '24.99');
  assert.equal(order.currency, 'USD');
  assert.equal(order.provider, 'creem');
});

test('Creem webhook handles refund.created and revokes active access', async () => {
  const mockKV = createMockKV();
  const customerEmail = 'refund.user@example.com';

  // Seed existing member and order
  await mockKV.put(`member:${customerEmail}`, JSON.stringify({
    email: customerEmail,
    plan: 'pro',
    status: 'paid',
  }));
  await mockKV.put('order:ord_refund_test', JSON.stringify({
    order_id: 'ord_refund_test',
    email: customerEmail,
    status: 'paid',
  }));

  const payload = {
    eventType: 'refund.created',
    object: {
      order_id: 'ord_refund_test',
      customer: { email: customerEmail },
    },
  };

  const request = new Request('https://soundtest.pro/api/membership/creem-webhook', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const response = await onRequestPost({
    request,
    env: { ab_test: mockKV }, // no secret configured -> dev mode allows pass
  });

  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.action, 'refund_processed');

  const member = JSON.parse(await mockKV.get(`member:${customerEmail}`));
  assert.equal(member.status, 'refunded');

  const order = JSON.parse(await mockKV.get('order:ord_refund_test'));
  assert.equal(order.status, 'refunded');
});

test('Creem webhook GET endpoint responds with receiver health status', async () => {
  const response = await onRequestGet();
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.ok, true);
  assert.equal(data.service, 'creem_webhook_receiver');
  assert.equal(data.status, 'online');
  assert.ok(Array.isArray(data.supported_events));
});
