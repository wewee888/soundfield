import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

test('Webmaster Analytics: Spider recognition and isolation engine', async () => {
  const spiderPath = path.join(rootDir, 'functions/_spider.js');
  assert.ok(fs.existsSync(spiderPath), '_spider.js must exist');
  const spiderModule = await import(`file://${spiderPath.replace(/\\/g, '/')}`);

  const { detectSpider, SPIDER_RULES } = spiderModule;
  assert.ok(Array.isArray(SPIDER_RULES), 'SPIDER_RULES must be an array');

  // 1. Verify Baidu, Google, Bing, ByteDance, etc. spider detection
  const baiduSpider = detectSpider('Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)');
  assert.ok(baiduSpider && baiduSpider.isSpider, 'Baiduspider must be detected as spider');
  assert.equal(baiduSpider.name, '百度蜘蛛');
  assert.equal(baiduSpider.code, 'baidu');

  const googleSpider = detectSpider('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
  assert.ok(googleSpider && googleSpider.isSpider, 'Googlebot must be detected as spider');
  assert.equal(googleSpider.name, '谷歌蜘蛛');
  assert.equal(googleSpider.code, 'google');

  const byteSpider = detectSpider('Mozilla/5.0 (Linux; Android 5.0) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36 (compatible; Bytespider; https://zhanzhang.toutiao.com/)');
  assert.ok(byteSpider && byteSpider.isSpider, 'Bytespider must be detected as spider');
  assert.equal(byteSpider.name, '字节跳动蜘蛛');
  assert.equal(byteSpider.code, 'bytedance');

  const bingSpider = detectSpider('Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)');
  assert.ok(bingSpider && bingSpider.isSpider, 'bingbot must be detected as spider');
  assert.equal(bingSpider.name, '必应蜘蛛');

  // 2. Real Human user agents must NOT be detected as spiders
  const humanChrome = detectSpider('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36');
  assert.equal(humanChrome, null, 'Real human Chrome UA must return null');

  const humanIPhone = detectSpider('Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1');
  assert.equal(humanIPhone, null, 'Real human iPhone UA must return null');
});

test('Webmaster Analytics: Track Visit strictly isolates spiders and deduplicates IP (访问人数)', async () => {
  const trackPath = path.join(rootDir, 'functions/api/track-visit.js');
  assert.ok(fs.existsSync(trackPath), 'track-visit.js must exist');
  const trackModule = await import(`file://${trackPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, String(v)),
    },
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. Simulate Baidu Spider crawling via POST /api/track-visit
  const spiderReq = new Request('https://soundtest.pro/api/track-visit', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)',
      'cf-connecting-ip': '220.181.108.10',
    },
    body: JSON.stringify({ page: '/soundtest.html', visitorId: 'vid_bot_1' }),
  });

  const spiderRes = await trackModule.onRequestPost({ request: spiderReq, env: mockEnv });
  assert.equal(spiderRes.status, 200);
  const spiderData = await spiderRes.json();
  assert.equal(spiderData.isSpider, true);
  assert.equal(spiderData.spiderName, '百度蜘蛛');

  // Assert spider did NOT increment human PV, UV, or IP
  assert.equal(kv.has(`analytics:pv:${todayStr}`), false, 'Spider must NOT increment human PV');
  assert.equal(kv.has(`analytics:uv:${todayStr}`), false, 'Spider must NOT increment human UV');
  assert.equal(kv.has(`analytics:ip:${todayStr}`), false, 'Spider must NOT increment human IP');
  // Assert spider DID increment spider counter
  assert.equal(kv.get(`analytics:spider:${todayStr}`), '1', 'Spider must increment analytics:spider');

  // 2. Simulate Real Human Visitor 1 (IP: 114.114.114.114, Visitor: vid_user_1)
  const humanReq1 = new Request('https://soundtest.pro/api/track-visit', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
      'cf-connecting-ip': '114.114.114.114',
    },
    body: JSON.stringify({ page: '/soundtest.html', visitorId: 'vid_user_1' }),
  });
  await trackModule.onRequestPost({ request: humanReq1, env: mockEnv });

  assert.equal(kv.get(`analytics:pv:${todayStr}`), '1', 'First visit increments PV to 1');
  assert.equal(kv.get(`analytics:uv:${todayStr}`), '1', 'First visit increments UV to 1');
  assert.equal(kv.get(`analytics:ip:${todayStr}`), '1', 'First visit increments IP (访问人数) to 1');

  // 3. Same user refreshes another page (same IP, same UV)
  const humanReq2 = new Request('https://soundtest.pro/api/track-visit', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
      'cf-connecting-ip': '114.114.114.114',
    },
    body: JSON.stringify({ page: '/measure/', visitorId: 'vid_user_1' }),
  });
  await trackModule.onRequestPost({ request: humanReq2, env: mockEnv });

  assert.equal(kv.get(`analytics:pv:${todayStr}`), '2', 'Second pageview increments PV to 2');
  assert.equal(kv.get(`analytics:uv:${todayStr}`), '1', 'Same user does NOT increment UV (remains 1)');
  assert.equal(kv.get(`analytics:ip:${todayStr}`), '1', 'Same IP does NOT increment IP / 访问人数 (remains 1)');
});

test('Webmaster Analytics: Admin API and UI template deliver PV, UV, IP (访问人数), and isolated Spiders', async () => {
  const anlPath = path.join(rootDir, 'functions/api/admin/analytics.js');
  const anlModule = await import(`file://${anlPath.replace(/\\/g, '/')}`);

  const kv = new Map();
  const todayStr = new Date().toISOString().slice(0, 10);
  kv.set(`analytics:pv:${todayStr}`, '100');
  kv.set(`analytics:uv:${todayStr}`, '40');
  kv.set(`analytics:ip:${todayStr}`, '35');
  kv.set(`analytics:spider:${todayStr}`, '15');
  kv.set(`analytics:spider:baidu:${todayStr}`, '8');
  kv.set(`analytics:spider:google:${todayStr}`, '5');

  const mockEnv = {
    ab_test: {
      get: async (k) => kv.get(k) || null,
      put: async (k, v) => kv.set(k, String(v)),
      list: async () => ({ keys: [] }),
    },
  };

  const req = new Request('https://soundtest.pro/api/admin/analytics', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer soundtest_admin_2026' },
  });

  const res = await anlModule.onRequestGet({ request: req, env: mockEnv });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.ok, true);

  // Check Traffic Object
  assert.equal(data.traffic.todayPv, 100);
  assert.equal(data.traffic.todayUv, 40);
  assert.equal(data.traffic.todayIp, 35);
  assert.equal(data.traffic.todaySpider, 15);
  assert.equal(data.traffic.todayPvPerIp, (100 / 35).toFixed(2));

  // Check Spiders Breakdown
  assert.ok(Array.isArray(data.spiders.breakdown), 'spiders.breakdown must be array');
  const baiduEntry = data.spiders.breakdown.find(b => b.code === 'baidu');
  assert.ok(baiduEntry, 'Baidu spider breakdown must be present');
  assert.equal(baiduEntry.todayCount, 8);

  // Check admin.html UI template
  const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');
  assert.ok(adminHtml.includes('访问人数 (独立 IP)'), 'admin.html contains 访问人数 (独立 IP) card');
  assert.ok(adminHtml.includes('搜索引擎蜘蛛 (Spider)'), 'admin.html contains 搜索引擎蜘蛛 (Spider) card');
  assert.ok(adminHtml.includes('今日流量与昨日对比全景表'), 'admin.html contains Today vs Yesterday Traffic Balance Sheet');
  assert.ok(adminHtml.includes('搜索引擎蜘蛛抓取监控台'), 'admin.html contains Spider Console');
  assert.ok(adminHtml.includes('spidersRecentTableBody'), 'admin.html contains spidersRecentTableBody');
});

test('Webmaster Analytics: Referral source strict URL validation and Admin Submenu decoupling', () => {
  const trackJs = fs.readFileSync(path.join(rootDir, 'functions/api/track-visit.js'), 'utf8');
  const adminHtml = fs.readFileSync(path.join(rootDir, 'admin.html'), 'utf8');

  // 1. Referral vs Direct invariant verification in track-visit.js
  assert.ok(trackJs.includes("if (!referrer || typeof referrer !== 'string') return '直接访问 (Direct)';"), 'Empty referrer is Direct');
  assert.ok(trackJs.includes("hostname === currentHost"), 'Self-host internal navigation is strictly Direct, never Referral');
  assert.ok(trackJs.includes("return `外部引流 (${hostname})`;"), 'Only genuine third-party external domain is tagged as Referral');

  // 2. Admin Sidebar Submenu Accordion verification
  assert.ok(adminHtml.includes('id="navAccordionAnalytics"'), 'admin.html contains sidebar accordion container');
  assert.ok(adminHtml.includes('id="submenuAnalytics"'), 'admin.html contains submenu container');
  assert.ok(adminHtml.includes('data-subtab="anl-trend"'), 'admin.html contains trend analysis subtab');
  assert.ok(adminHtml.includes('data-subtab="anl-visitors"'), 'admin.html contains live visitors stream subtab');
  assert.ok(adminHtml.includes('data-subtab="anl-sources"'), 'admin.html contains sources & referrals subtab');
  assert.ok(adminHtml.includes('data-subtab="anl-pages"'), 'admin.html contains content & pages subtab');
  assert.ok(adminHtml.includes('data-subtab="anl-spiders"'), 'admin.html contains spider stats subtab');
  assert.ok(adminHtml.includes('data-subtab="anl-funnel"'), 'admin.html contains funnel & audit subtab');

  // 3. 6 Decoupled Subviews in viewAnalytics
  assert.ok(adminHtml.includes('id="subview_anl_trend"'), 'admin.html contains subview_anl_trend');
  assert.ok(adminHtml.includes('id="subview_anl_visitors"'), 'admin.html contains subview_anl_visitors');
  assert.ok(adminHtml.includes('id="subview_anl_sources"'), 'admin.html contains subview_anl_sources');
  assert.ok(adminHtml.includes('id="subview_anl_pages"'), 'admin.html contains subview_anl_pages');
  assert.ok(adminHtml.includes('id="subview_anl_spiders"'), 'admin.html contains subview_anl_spiders');
  assert.ok(adminHtml.includes('id="subview_anl_funnel"'), 'admin.html contains subview_anl_funnel');

  // 4. V6 Native Style Overview Cards & Interactive Trend SVG Chart
  assert.ok(adminHtml.includes('id="v6IpCount"'), 'admin.html contains V6 IP count card');
  assert.ok(adminHtml.includes('id="v6PvCount"'), 'admin.html contains V6 PV count card');
  assert.ok(adminHtml.includes('id="v6UvCount"'), 'admin.html contains V6 UV count card');
  assert.ok(adminHtml.includes('id="v6TrendSvg"'), 'admin.html contains interactive trend SVG canvas');
  assert.ok(adminHtml.includes('function renderTrendChart()'), 'admin.html implements renderTrendChart engine');
  assert.ok(adminHtml.includes('function switchSubTab(subTabId)'), 'admin.html implements switchSubTab controller');
});
