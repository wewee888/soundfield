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

function pickCommunityPoi(pois = []) {
  if (!pois || !pois.length) return null;
  const scored = pois.map((p) => {
    const text = `${p.name || ''} ${p.tag || ''}`;
    let score = 0;
    // High priority for residential community / building / apartment
    if (/小区|公寓|花园|家园|社区|住宅|大厦|苑|园|府|里|村|别墅|生活区|宿舍/.test(text)) score += 100;
    else if (/广场|中心|商务|大楼|园区|学校|医院|商场/.test(text)) score += 50;
    else if (/道路|路口|交口|车站|公交|地铁|桥|立交/.test(text)) score -= 30;
    if (typeof p.distance === 'number') {
      score -= Math.min(30, p.distance / 10);
    }
    return { poi: p, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored[0]?.score > 0 ? scored[0].poi : (pois[0] || null);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const latStr = url.searchParams.get('lat');
  const lngStr = url.searchParams.get('lng');
  const isIpQuery = url.searchParams.get('mode') === 'ip' || (!latStr && !lngStr);

  let lat = parseFloat(latStr || '0');
  let lng = parseFloat(lngStr || '0');
  let isIpFallback = false;

  if (isIpQuery || !lat || !lng || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    const cf = request.cf || {};
    const cfLat = parseFloat(cf.latitude || '0');
    const cfLng = parseFloat(cf.longitude || '0');
    if (cfLat && cfLng) {
      lat = cfLat;
      lng = cfLng;
      isIpFallback = true;
    } else if (!isIpQuery) {
      return json({ ok: false, error: 'invalid_coordinates' }, 400);
    }
  }

  if (!lat || !lng) {
    return json({ ok: false, error: 'location_unavailable' }, 404);
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
        const bestPoi = pickCommunityPoi(r.pois || []);
        const communityName = bestPoi?.name || '';
        const rawAddress = r.formatted_address || '';

        // Format small unit/community FIRST: "小区名 · 道路行政地址"
        let placeName = rawAddress;
        if (communityName && !rawAddress.startsWith(communityName)) {
          placeName = `${communityName} · ${rawAddress}`;
        } else if (r.formatted_address_poi) {
          placeName = r.formatted_address_poi;
        }

        return json(
          {
            ok: true,
            lat,
            lng,
            isIp: isIpFallback,
            provider: 'baidu',
            name: placeName,
            community: communityName,
            address: rawAddress,
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
      const addr = data.address || {};
      const community = addr.residential || addr.neighbourhood || addr.suburb || addr.building || addr.amenity || '';
      let placeName = data.display_name;
      if (community && !placeName.startsWith(community)) {
        placeName = `${community} · ${placeName}`;
      }
      return json(
        {
          ok: true,
          lat,
          lng,
          isIp: isIpFallback,
          provider: 'openstreetmap',
          name: placeName,
          community,
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
    if (!isIpFallback) {
      return json({ ok: false, error: 'lookup_failed', message: err.message }, 502);
    }
  }

  if (isIpFallback) {
    const cf = request.cf || {};
    const cityName = cf.city || cf.region || '';
    const locName = [cityName, cf.country].filter(Boolean).join(', ') || '网络 IP 定位';
    return json(
      {
        ok: true,
        lat,
        lng,
        isIp: true,
        provider: 'cloudflare-ip',
        name: locName,
        address: locName,
        city: cityName,
        country: cf.country || '',
      },
      200,
      {
        'cache-control': 'public, max-age=3600',
      }
    );
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
