export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    const result = await env.DB.prepare('SELECT * FROM products ORDER BY id').all();
    const products = result.results.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      brand: p.brand,
      price: p.price,
      cat: p.cat,
      img: p.img,
      images: p.images_json ? JSON.parse(p.images_json) : [],
      desc: p.desc,
      description: p.description,
      details: p.details_json ? JSON.parse(p.details_json) : {},
      colors: p.colors_json ? JSON.parse(p.colors_json) : [],
      sizes: p.sizes_json ? JSON.parse(p.sizes_json) : [],
      pairsWith: p.pairs_with_json ? JSON.parse(p.pairs_with_json) : []
    }));

    return new Response(JSON.stringify({ products }), {
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
    const product = body.product;

    if (!product || !product.sku || !product.name) {
      return new Response(JSON.stringify({ error: 'Invalid product data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      INSERT INTO products (id, sku, name, brand, price, cat, img, images_json, desc, description, details_json, colors_json, sizes_json, pairs_with_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      product.id || Date.now(),
      product.sku,
      product.name,
      product.brand || 'MODA FEMENINA',
      product.price || 0,
      product.cat || '',
      product.img || '',
      JSON.stringify(product.images || []),
      product.desc || '',
      product.description || '',
      JSON.stringify(product.details || {}),
      JSON.stringify(product.colors || []),
      JSON.stringify(product.sizes || []),
      JSON.stringify(product.pairsWith || [])
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
    const product = body.product;

    if (!product || !product.id) {
      return new Response(JSON.stringify({ error: 'Invalid product data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      UPDATE products SET
        sku = ?, name = ?, brand = ?, price = ?, cat = ?, img = ?, images_json = ?,
        desc = ?, description = ?, details_json = ?, colors_json = ?, sizes_json = ?, pairs_with_json = ?
      WHERE id = ?
    `).bind(
      product.sku,
      product.name,
      product.brand || 'MODA FEMENINA',
      product.price || 0,
      product.cat || '',
      product.img || '',
      JSON.stringify(product.images || []),
      product.desc || '',
      product.description || '',
      JSON.stringify(product.details || {}),
      JSON.stringify(product.colors || []),
      JSON.stringify(product.sizes || []),
      JSON.stringify(product.pairsWith || []),
      product.id
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

    await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();

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
