// Cloudflare Pages Function: /api/geo/reverse
// Reverse geocoding proxy: prioritizes Baidu Maps for China coordinates with OpenStreetMap fallback

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'access-control-allow-origin': '*',
      ...extraHeaders,
    },
  });
}

const DEFAULT_BAIDU_AK = 'kdlp0invEEhm1DbHKjmbExA4E0P19qPu';

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const lat = parseFloat(url.searchParams.get('lat') || '0');
  const lng = parseFloat(url.searchParams.get('lng') || '0');

  if (!lat || !lng || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return json({ ok: false, error: 'invalid_coordinates' }, 400);
  }

  // Coarse bounding box for China (Roughly lat 18-54, lng 73-135)
  const isLikelyChina = lat >= 18.0 && lat <= 54.0 && lng >= 73.0 && lng <= 135.0;

  const baiduAk = env.BAIDU_MAP_AK || DEFAULT_BAIDU_AK;

  // 1. If in China or Baidu prioritized, try Baidu Reverse Geocoding v3
  if (isLikelyChina && baiduAk) {
    try {
      const baiduUrl = `https://api.map.baidu.com/reverse_geocoding/v3/?ak=${encodeURIComponent(baiduAk)}&output=json&coordtype=wgs84ll&extensions_poi=1&radius=1000&location=${lat},${lng}`;
      const res = await fetch(baiduUrl, {
        headers: { 'User-Agent': 'SOUNDTEST.PRO-GeoProxy/1.0' },
      });
      const data = await res.json().catch(() => null);

      if (data && data.status === 0 && data.result) {
        const r = data.result;
        const mainPoi = (r.pois && r.pois[0]) ? r.pois[0].name : '';
        const placeName = r.formatted_address_poi || (mainPoi ? `${r.formatted_address} (${mainPoi})` : r.formatted_address);

        return json(
          {
            ok: true,
            provider: 'baidu',
            name: placeName,
            address: r.formatted_address,
            component: r.addressComponent || {},
            city: r.addressComponent?.city || '',
            district: r.addressComponent?.district || '',
            pois: (r.pois || []).slice(0, 5).map((p) => ({
              name: p.name,
              addr: p.addr,
              distance: p.distance,
              tag: p.tag,
            })),
          },
          200,
          {
            'cache-control': 'public, max-age=86400, s-maxage=604800',
          }
        );
      }
    } catch (_) {
      // Fallback to OSM
    }
  }

  // 2. OpenStreetMap Nominatim global fallback
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`;
    const res = await fetch(osmUrl, {
      headers: {
        'User-Agent': 'SOUNDTEST.PRO-EnvironmentalAudioTool/1.0 (contact: hello@soundtest.pro)',
        'Accept-Language': url.searchParams.get('lang') || 'zh-CN,en;q=0.8',
      },
    });
    const data = await res.json().catch(() => null);

    if (data && data.display_name) {
      return json(
        {
          ok: true,
          provider: 'openstreetmap',
          name: data.display_name,
          address: data.display_name,
          component: data.address || {},
          city: data.address?.city || data.address?.town || '',
          country: data.address?.country || '',
        },
        200,
        {
          'cache-control': 'public, max-age=86400, s-maxage=604800',
        }
      );
    }
  } catch (err) {
    return json({ ok: false, error: 'lookup_failed', message: err.message }, 502);
  }

  return json({ ok: false, error: 'no_place_found' }, 404);
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET, OPTIONS',
      'access-control-allow-headers': 'content-type',
    },
  });
}
