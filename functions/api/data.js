export async function onRequestGet(context) {
  const { env } = context;

  try {
    const config = {};
    try {
      const configResult = await env.DB.prepare("SELECT key, value FROM config").all();
      for (const row of configResult.results) {
        try {
          config[row.key] = JSON.parse(row.value);
        } catch {
          config[row.key] = row.value;
        }
      }
    } catch (e) {
      console.error('Error loading config:', e);
    }

    const categories = [];
    try {
      const catResult = await env.DB.prepare("SELECT id, name, image, sort FROM categories ORDER BY sort").all();
      categories.push(...catResult.results);
    } catch (e) {
      console.error('Error loading categories:', e);
    }

    const promotions = [];
    try {
      const promoResult = await env.DB.prepare("SELECT * FROM promotions").all();
      for (const p of promoResult.results) {
        let conditions = [];
        try {
          conditions = p.conditions ? JSON.parse(p.conditions) : [];
        } catch {
          conditions = [];
        }
        promotions.push({
          id: p.id,
          badge: p.badge,
          title: p.title,
          sub: p.sub,
          image: p.image,
          cat: p.cat,
          fullDescription: p.full_description,
          validUntil: p.valid_until,
          conditions
        });
      }
    } catch (e) {
      console.error('Error loading promotions:', e);
    }

    const products = [];
    try {
      const prodResult = await env.DB.prepare("SELECT * FROM products ORDER BY id").all();
      for (const p of prodResult.results) {
        let images = [];
        let details = {};
        let colors = [];
        let sizes = [];
        let pairsWith = [];
        try {
          images = p.images_json ? JSON.parse(p.images_json) : [];
        } catch {
          images = [];
        }
        try {
          details = p.details_json ? JSON.parse(p.details_json) : {};
        } catch {
          details = {};
        }
        try {
          colors = p.colors_json ? JSON.parse(p.colors_json) : [];
        } catch {
          colors = [];
        }
        try {
          sizes = p.sizes_json ? JSON.parse(p.sizes_json) : [];
        } catch {
          sizes = [];
        }
        try {
          pairsWith = p.pairs_with_json ? JSON.parse(p.pairs_with_json) : [];
        } catch {
          pairsWith = [];
        }
        products.push({
          id: p.id,
          sku: p.sku,
          name: p.name,
          brand: p.brand,
          price: p.price,
          cat: p.cat,
          img: p.img,
          images,
          desc: p.desc,
          description: p.description,
          details,
          colors,
          sizes,
          pairsWith
        });
      }
    } catch (e) {
      console.error('Error loading products:', e);
    }

    const projects = [];
    try {
      const projResult = await env.DB.prepare("SELECT * FROM projects ORDER BY id").all();
      for (const p of projResult.results) {
        let images = [];
        try {
          images = p.images_json ? JSON.parse(p.images_json) : [];
        } catch {
          images = [];
        }
        projects.push({
          id: p.id,
          title: p.title,
          cat: p.cat,
          location: p.location,
          client: p.client,
          duration: p.duration,
          image: p.image,
          images,
          description: p.description
        });
      }
    } catch (e) {
      console.error('Error loading projects:', e);
    }

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
