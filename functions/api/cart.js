export async function onRequestGet(context) {
  const { env, request } = context;
  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id');

  if (!sessionId) {
    return new Response(JSON.stringify({ error: 'session_id is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const result = await env.DB.prepare(
    'SELECT product_id, sku, name, price, img, size, color, color_hex FROM cart_items WHERE session_id = ? ORDER BY id'
  )
    .bind(sessionId)
    .all();

  const cart = result.results.map((row) => ({
    id: row.product_id,
    sku: row.sku,
    name: row.name,
    price: row.price,
    img: row.img,
    size: row.size,
    color: row.color,
    colorHex: row.color_hex
  }));

  return new Response(JSON.stringify({ cart }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function onRequestPost(context) {
  const { env, request } = context;
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const { session_id, cart } = body || {};
  if (!session_id || !Array.isArray(cart)) {
    return new Response(JSON.stringify({ error: 'session_id and cart array are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  await env.DB.prepare('DELETE FROM cart_items WHERE session_id = ?').bind(session_id).run();

  for (const item of cart) {
    await env.DB.prepare(
      'INSERT INTO cart_items (session_id, product_id, sku, name, price, img, size, color, color_hex) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(
        session_id,
        item.id || item.product_id || 0,
        item.sku || '',
        item.name || '',
        item.price || 0,
        item.img || '',
        item.size || '',
        item.color || '',
        item.colorHex || item.color_hex || ''
      )
      .run();
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
