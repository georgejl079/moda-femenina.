export async function onRequestGet(context) {
  const { env } = context;

  try {
    const configResult = await env.DB.prepare("SELECT key, value FROM config").all();
    const config = {};
    for (const row of configResult.results) {
      config[row.key] = JSON.parse(row.value);
    }

    const catResult = await env.DB.prepare("SELECT id, name, image, sort FROM categories ORDER BY sort").all();
    const categories = catResult.results;

    const promoResult = await env.DB.prepare("SELECT * FROM promotions").all();
    const promotions = promoResult.results.map((p) => ({
      id: p.id,
      badge: p.badge,
      title: p.title,
      sub: p.sub,
      image: p.image,
      cat: p.cat,
      fullDescription: p.full_description,
      validUntil: p.valid_until,
      conditions: p.conditions ? JSON.parse(p.conditions) : []
    }));

    const prodResult = await env.DB.prepare("SELECT * FROM products ORDER BY id").all();
    const products = prodResult.results.map((p) => ({
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

    const projResult = await env.DB.prepare("SELECT * FROM projects ORDER BY id").all();
    const projects = projResult.results.map((p) => ({
      id: p.id,
      title: p.title,
      cat: p.cat,
      location: p.location,
      client: p.client,
      duration: p.duration,
      image: p.image,
      images: p.images_json ? JSON.parse(p.images_json) : [],
      description: p.description
    }));

    const catLabels = {};
    for (const c of categories) {
      catLabels[c.id] = c.name;
    }

    const catTaglines = {
      camisas: 'El básico que nunca falla',
      sacos: 'Elegancia en cada detalle',
      pantalones: 'Cortes que estilizan',
      bleizer: 'Tu pieza clave del guardarropa',
      vestidos: 'Para las ocasiones especiales',
      accesorios: 'El toque final de tu look'
    };

    const heroImages = [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1800&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1800&q=85',
      'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=1800&q=85'
    ];

    return new Response(
      JSON.stringify({
        CONFIG: {
          phone: '59175179990',
          developer: { name: 'KEY STUDIO', url: 'https://keystudio.bo' },
          store: {
            name: config.store_name || 'MODA FEMENINA',
            tagline: config.store_tagline || 'Moda femenina con estilo y elegancia',
            story: config.store_story || '',
            mission: config.store_mission || '',
            hours: config.store_hours || 'Lun – Sáb: 10:00 – 20:00',
            address: config.store_address || 'Yacuiba, Bolivia',
            email: config.store_email || 'hola@modafemenina.bo',
            instagram: config.store_instagram || '@modafemenina.bo'
          }
        },
        heroImages,
        categories,
        promotions,
        catLabels,
        catTaglines,
        projects,
        products
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
        }
      }
    );
  } catch (e) {
    console.error('Error loading data:', e);
    return new Response(JSON.stringify({ error: 'Failed to load data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
