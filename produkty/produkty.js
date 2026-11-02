/* Produktové listy – hledání v přehledu, galerie v detailu */
(() => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    /* ---- hledání (sklad. číslo, EAN, kód výrobce, název, značka) ---- */
    const pole = $('#pr-hledat');
    if (pole) {
        const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        const karty = $$('.pr-card');
        karty.forEach((k) => { k._h = norm(k.dataset.hledej + ' ' + k.textContent); });
        const pocet = $('#pr-pocet');
        const nic = $('#pr-nic');
        const filtruj = () => {
            const slova = norm(pole.value.trim()).split(/\s+/).filter(Boolean);
            karty.forEach((k) => { k.hidden = !slova.every((w) => k._h.includes(w)); });
            const n = karty.filter((k) => !k.hidden).length;
            pocet.textContent = `Zobrazeno ${n} z ${karty.length}`;
            nic.hidden = n > 0;
        };
        pole.addEventListener('input', filtruj);
        filtruj();
    }

    /* ---- galerie + zvětšení ---- */
    const hlavni = $('#pr-hlavni');
    if (hlavni) {
        const img = $('img', hlavni);
        $$('.pr-thumbs button').forEach((b) => {
            b.addEventListener('click', () => {
                img.src = b.dataset.src;
                img.alt = $('img', b).alt;
                $$('.pr-thumbs button').forEach((x) => x.setAttribute('aria-current', x === b));
            });
        });
        const box = $('#pr-lightbox');
        hlavni.addEventListener('click', () => {
            $('img', box).src = img.src;
            box.hidden = false;
        });
        box.addEventListener('click', () => { box.hidden = true; });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') box.hidden = true; });
    }
})();
