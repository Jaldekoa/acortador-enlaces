export default {
    async fetch(request, env, ctx) {
        const FRONTEND_PAGE = 'https://acortador-enlaces.pages.dev';
        const WORKER_URL = 'https://acortador-enlaces.jaldekoa.workers.dev';

        const headers = {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        };

        const corsHeaders = {
            ...headers,
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        // Request preflight
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        const url = new URL(request.url);

        // POST
        if (request.method === 'POST' && url.pathname === '/api/shorten') {
            try {
                const { longURL } = await request.json();

                if (!longURL) {
                    return new Response(JSON.stringify({ error: 'URL requerida' }), { status: 400, headers });
                }

                // 1. Comprobar si la URL ya existe en la base de datos
                const existingLink = await env.DB.prepare('SELECT short_url FROM table_links WHERE long_url = ?')
                    .bind(longURL)
                    .first();

                let slug;

                if (existingLink) {
                    // Si ya existe, devolvemos el código que ya teníamos
                    slug = existingLink.short_url;
                } else {
                    // Si no existe, generamos uno nuevo y lo guardamos
                    slug = generateShortCode();

                    await env.DB.prepare('INSERT INTO table_links (short_url, long_url, hits, active) VALUES (?, ?, 0, 1)')
                        .bind(slug, longURL)
                        .run();
                }

                const data = { shortURL: `${WORKER_URL}/${slug}` };
                return new Response(JSON.stringify(data), { headers });

            } catch (error) {
                return new Response(JSON.stringify({ error: error.message }), { status: 500, headers });
            }
        }

        // GET
        if (request.method === 'GET') {
            const slug = url.pathname.slice(1);

            if (!slug) {
                return Response.redirect(FRONTEND_PAGE, 301);
            }

            try {
                // Buscamos la URL original en D1
                const record = await env.DB.prepare('SELECT long_url, active FROM table_links WHERE short_url = ?')
                    .bind(slug)
                    .first();

                // Si existe y está activa, redirigimos
                if (record && record.active === 1) {

                    // Sumamos 1 a las visitas
                    const updateHits = env.DB.prepare('UPDATE table_links SET hits = hits + 1 WHERE short_url = ?')
                        .bind(slug)
                        .run();
                    ctx.waitUntil(updateHits);

                    // Redirección HTTP 302
                    return Response.redirect(record.long_url, 302);
                }
            } catch (error) {
                return new Response('Database Error', { status: 500 });
            }
        }

        // Si la ruta no existe o el registro no está activo
        return new Response('Not found or inactive link', {
            status: 404,
            headers: corsHeaders
        });
    }
};

// Generar un slug corto (6 caracteres alfanuméricos)
function generateShortCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}