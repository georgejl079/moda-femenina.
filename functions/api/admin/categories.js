export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    const result = await env.DB.prepare('SELECT * FROM categories ORDER BY sort').all();
    return new Response(JSON.stringify({ categories: result.results }), {
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
    const category = body.category;

    if (!category || !category.id || !category.name) {
      return new Response(JSON.stringify({ error: 'Invalid category data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      INSERT OR REPLACE INTO categories (id, name, image, sort)
      VALUES (?, ?, ?, ?)
    `).bind(
      category.id,
      category.name,
      category.image || '',
      category.sort || 0
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
    const category = body.category;

    if (!category || !category.id) {
      return new Response(JSON.stringify({ error: 'Invalid category data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      UPDATE categories SET name = ?, image = ?, sort = ?
      WHERE id = ?
    `).bind(
      category.name,
      category.image || '',
      category.sort || 0,
      category.id
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

    await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();

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
