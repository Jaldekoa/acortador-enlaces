export default {
    async fetch(request) {

        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
            "Content-Type": "application/json",
        };

        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        };

        // 2. Tu lógica normal
        if (request.method === 'POST' && request.url === 'https://acortador-enlaces.pages.dev') {
            const body = await request.json();

            return new Response(JSON.stringify({ ok: true }), {
                headers: {
                    ...corsHeaders,
                    'Content-Type': 'application/json'
                }
            });
        }

        return new Response('Not found', {
            status: 404,
            headers: corsHeaders
        });
    }
};