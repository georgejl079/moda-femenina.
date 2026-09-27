export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    const result = await env.DB.prepare('SELECT * FROM projects ORDER BY id').all();
    const projects = result.results.map(p => ({
      ...p,
      images: p.images_json ? JSON.parse(p.images_json) : []
    }));

    return new Response(JSON.stringify({ projects }), {
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
    const project = body.project;

    if (!project || !project.title) {
      return new Response(JSON.stringify({ error: 'Invalid project data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      INSERT INTO projects (id, title, cat, location, client, duration, image, description, images_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      project.id || Date.now(),
      project.title,
      project.cat || '',
      project.location || '',
      project.client || '',
      project.duration || '',
      project.image || '',
      project.description || '',
      JSON.stringify(project.images || [])
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
    const project = body.project;

    if (!project || !project.id) {
      return new Response(JSON.stringify({ error: 'Invalid project data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    await env.DB.prepare(`
      UPDATE projects SET
        title = ?, cat = ?, location = ?, client = ?, duration = ?,
        image = ?, description = ?, images_json = ?
      WHERE id = ?
    `).bind(
      project.title,
      project.cat || '',
      project.location || '',
      project.client || '',
      project.duration || '',
      project.image || '',
      project.description || '',
      JSON.stringify(project.images || []),
      project.id
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

    await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();

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
