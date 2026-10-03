// Cloudflare Pages Function: /auth
// Intelligently routes visitors by locale (cookie, IP country, accept-language)
import { resolveLocale } from './index.js';

export async function onRequestGet(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const countryHeader = request.headers.get('cf-ipcountry');
  const cookieHeader = request.headers.get('cookie');
  const acceptLangHeader = request.headers.get('accept-language');

  const locale = resolveLocale({
    url,
    countryHeader,
    cookieHeader,
    acceptLangHeader,
  });

  const search = url.search;

  if (locale && locale !== 'en') {
    const dest = '/' + locale + '/auth/' + search;
    const headers = new Headers();
    headers.set('Location', dest);
    headers.append('Set-Cookie', 'sf_locale=' + locale + '; Path=/; Max-Age=31536000; SameSite=Lax');
    return new Response(null, {
      status: 302,
      headers,
    });
  }

  return next();
}
