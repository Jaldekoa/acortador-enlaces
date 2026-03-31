const $input = document.getElementById('form__input');
const $button = document.getElementById('form__button');

$button.addEventListener('click', async (event) => {
    event.preventDefault();
    const WORKER_URL = 'https://acortador-enlaces.jaldekoa.workers.dev/';

    const longURL = new URL($input.value).href;
    if (!longURL || longURL === '') throw new Error(`${$input.value} no es una URL válida`);

    $button.disabled = true;

    try {
        const OPTIONS = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ longURL }) }
        const response = await fetch(WORKER_URL, OPTIONS);

        if (!response.ok)
            throw new Error(`HTTP error ${response.status}`);

        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        $button.disabled = false;
    }

});
