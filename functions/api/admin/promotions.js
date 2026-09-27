export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    const result = await env.DB.prepare('SELECT * FROM promotions ORDER BY id').all();
    const promotions = result.results.map(p => ({
      ...p,
      conditions: p.conditions ? JSON.parse(p.conditions) : []
    }));

    return new Response(JSON.stringify({ promotions }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const body = await request.json();
    const promotion = body.promotion;

    if (!promotion || !promotion.title) {
      return new Response(JSON.stringify({ error: 'Invalid promotion data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      INSERT INTO promotions (badge, title, sub, image, cat, full_description, valid_until, conditions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      promotion.badge || '',
      promotion.title,
      promotion.sub || '',
      promotion.image || '',
      promotion.cat || '',
      promotion.fullDescription || '',
      promotion.validUntil || '',
      JSON.stringify(promotion.conditions || [])
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPut(context) {
  const { env, request } = context;
  
  try {
    const body = await request.json();
    const promotion = body.promotion;

    if (!promotion || !promotion.id) {
      return new Response(JSON.stringify({ error: 'Invalid promotion data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      UPDATE promotions SET
        badge = ?, title = ?, sub = ?, image = ?, cat = ?,
        full_description = ?, valid_until = ?, conditions = ?
      WHERE id = ?
    `).bind(
      promotion.badge || '',
      promotion.title,
      promotion.sub || '',
      promotion.image || '',
      promotion.cat || '',
      promotion.fullDescription || '',
      promotion.validUntil || '',
      JSON.stringify(promotion.conditions || []),
      promotion.id
    ).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context;
  
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return new Response(JSON.stringify({ error: 'Invalid id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare('DELETE FROM promotions WHERE id = ?').bind(id).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
