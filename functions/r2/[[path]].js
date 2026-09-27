export async function onRequestGet(context) {
  const { env, params } = context;
  const key = decodeURIComponent(params.path || '');

  if (!key) {
    return new Response('Not found', { status: 404 });
  }

  const object = await env.R2_ASSETS.get(key);
  if (!object) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
