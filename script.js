const $input = document.getElementById('form__input');
const $button = document.getElementById('form__button');
const $result = document.getElementById('result');

$button.addEventListener('click', async (event) => {
    event.preventDefault();

    const WORKER_URL = 'https://acortador-enlaces.jaldekoa.workers.dev/api/shorten';

    try {
        const longURL = new URL($input.value).href;

        $button.disabled = true;
        if ($result) $result.innerHTML = 'Acortando...';

        const OPTIONS = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ longURL })
        };

        const response = await fetch(WORKER_URL, OPTIONS);

        if (!response.ok) {
            throw new Error(`Error en el servidor: HTTP ${response.status}`);
        }

        const data = await response.json();

        if (data.shortURL) {
            if ($result) {
                $result.innerHTML = `
                    <p>¡Enlace acortado con éxito!</p>
                    <a href="${data.shortURL}" target="_blank" rel="noopener noreferrer">${data.shortURL}</a>
                `;
            } else {
                console.log("Enlace acortado:", data.shortURL);
                alert(`¡Acortado! ${data.shortURL}`);
            }
            $input.value = '';
        }

    } catch (error) {
        console.error("Error:", error);
        if ($result) {
            $result.innerHTML = `<span style="color: #ff6b6b;">Error: Verifica que la URL sea válida e incluya http:// o https://</span>`;
        }
    } finally {
        $button.disabled = false;
    }
});