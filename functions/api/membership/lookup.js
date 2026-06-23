function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost({ request }) {
  try {
    const body = await request.json().catch(function () { return {}; });
    return json({ active: false, plan: 'free', status: 'inactive', debug: 'minimal' });
  } catch (e) {
    return json({ active: false, error: e.message }, 500);
  }
}