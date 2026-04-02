export default {
    async fetch(request) {

        const FRONTEND_PAGE = 'https://acortador-enlaces.pages.dev';
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
        };

        // Crear la shortURL desde la longURL
        if (request.method === 'POST') {
            const { longURL } = await request.json();
            const slug = await getSlug(longURL);
            const data = { shortURL: `${FRONTEND_PAGE}/${slug}` };

            return new Response(JSON.stringify(data), { headers });
        };

        // Obtener la longURL y redirigir a la shortURL
        if (request.method === 'GET') {

        };

        return new Response('Not found', {
            status: 404,
            headers: corsHeaders
        });
    }
};

async function getSlug(url) {
    const randomText = 'En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor. Una olla de algo más vaca que carnero, salpicón las más noches, duelos y quebrantos los sábados, lantejas los viernes, algún palomino de añadidura los domingos, consumían las tres partes de su hacienda. El resto della concluían sayo de velarte, calzas de velludo para las fiestas, con sus pantuflos de lo mesmo, y los días de entresemana se honraba con su vellorí de lo más fino. Tenía en su casa una ama que pasaba de los cuarenta, y una sobrina que no llegaba a los veinte, y un mozo de campo y plaza, que así ensillaba el rocín como tomaba la podadera. Frisaba la edad de nuestro hidalgo con los cincuenta años; era de complexión recia, seco de carnes, enjuto de rostro, gran madrugador y amigo de la caza. Quieren decir que tenía el sobrenombre de Quijada, o Quesada, que en esto hay alguna diferencia en los autores que deste caso escriben; aunque por conjeturas verosímiles se deja entender que se llamaba Quijana. Pero esto importa poco a nuestro cuento: basta que en la narración dél no se salga un punto de la verdad.'
    const slug = await crypto.subtle.digest({ name: 'SHA-256', }, url);
};
