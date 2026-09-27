export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return new Response(JSON.stringify({ error: 'file is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const filename = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    await env.R2_ASSETS.put(filename, uint8Array, {
      httpMetadata: {
        contentType: file.type || 'application/octet-stream'
      }
    });

    return new Response(JSON.stringify({ url: `/r2/${filename}` }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Upload error:', e);
    return new Response(JSON.stringify({ error: 'Upload failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
