// Shared Spider & Crawler Detection Module
// High-precision search engine and crawler recognition engine
// Automatically identifies search engine spiders and keeps them isolated from human metrics (PV, UV, IP).

export const SPIDER_RULES = [
  { name: '百度蜘蛛', pattern: /Baiduspider/i, icon: '🐾', code: 'baidu' },
  { name: '谷歌蜘蛛', pattern: /Googlebot|Google-InspectionTool|Mediapartners-Google/i, icon: '🔍', code: 'google' },
  { name: '必应蜘蛛', pattern: /bingbot|msnbot/i, icon: '🟦', code: 'bing' },
  { name: '字节跳动蜘蛛', pattern: /Bytespider/i, icon: '🎵', code: 'bytedance' },
  { name: '搜狗蜘蛛', pattern: /Sogou.*spider/i, icon: '🐶', code: 'sogou' },
  { name: 'Yandex蜘蛛', pattern: /YandexBot/i, icon: '🇷🇺', code: 'yandex' },
  { name: '苹果蜘蛛', pattern: /Applebot/i, icon: '🍎', code: 'apple' },
  { name: '360搜索蜘蛛', pattern: /360Spider|HaosouSpider/i, icon: '🛡️', code: '360' },
  { name: 'DuckDuckGo', pattern: /DuckDuckBot/i, icon: '🦆', code: 'duckduckgo' },
  { name: '华为花瓣蜘蛛', pattern: /PetalBot|AspiegelBot/i, icon: '🌸', code: 'petal' },
  { name: 'Claude AI爬虫', pattern: /ClaudeBot|anthropic-ai/i, icon: '🤖', code: 'claude' },
  { name: 'OpenAI爬虫', pattern: /GPTBot|ChatGPT-User/i, icon: '🧠', code: 'openai' },
  { name: '通用网络爬虫', pattern: /spider|crawler|robot|bot|slurp|headlesschrome|python|curl|wget/i, icon: '🕷️', code: 'generic' },
];

export function detectSpider(ua) {
  if (!ua || typeof ua !== 'string') return null;
  for (const rule of SPIDER_RULES) {
    if (rule.pattern.test(ua)) {
      return {
        isSpider: true,
        name: rule.name,
        icon: rule.icon,
        code: rule.code,
      };
    }
  }
  return null;
}
