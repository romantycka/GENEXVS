/* Vánoční akce 2026 – hledání, kategorie, zvětšení obrázků, kopírování kódů */
(() => {
    const DATA = JSON.parse(document.getElementById('ak-data').textContent);
    const KONEC = new Date('2026-12-23T00:00:00+01:00');
    const ZACATEK = new Date('2026-11-01T00:00:00+01:00');
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const cena = (p) => `${p},-`;

    /* ---- platnost: odpočet / skončila ---- */
    const ted = new Date();
    if (ted >= KONEC) {
        $('#ak-skoncila').hidden = false;
    } else {
        const dni = Math.ceil((KONEC - ted) / 864e5);
        const el = $('#ak-odpocet');
        el.textContent = ted < ZACATEK
            ? 'Akce startuje 1. 11. 2026.'
            : dni === 1 ? 'Poslední den akce!' : `Do konce akce zbývá ${dni} ${dni < 5 ? 'dny' : 'dní'}.`;
        el.hidden = false;
    }

    /* ---- toast ---- */
    const toast = $('#ak-toast');
    let toastT;
    const ukaz = (txt) => {
        toast.textContent = txt;
        toast.classList.add('show');
        clearTimeout(toastT);
        toastT = setTimeout(() => toast.classList.remove('show'), 2200);
    };

    /* ---- kopírování skladového čísla ---- */
    document.addEventListener('click', async (e) => {
        const b = e.target.closest('[data-kod]');
        if (!b) return;
        e.stopPropagation();
        try {
            await navigator.clipboard.writeText(b.dataset.kod);
            ukaz(`Kód ${b.dataset.kod} zkopírován`);
        } catch {
            ukaz(`Kód: ${b.dataset.kod}`);
        }
    });

    /* ---- hledání ---- */
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const karty = $$('.ak-card');
    karty.forEach((k) => { k._h = norm(k.dataset.hledej); });
    const sekce = $$('.ak-sekce');
    const nic = $('#ak-nic');
    const pole = $('#ak-hledat');
    pole.addEventListener('input', () => {
        const slova = norm(pole.value.trim()).split(/\s+/).filter(Boolean);
        karty.forEach((k) => { k.hidden = !slova.every((w) => k._h.includes(w)); });
        let nalez = 0;
        sekce.forEach((s) => {
            const n = $$('.ak-card:not([hidden])', s).length;
            s.hidden = n === 0;
            nalez += n;
        });
        nic.hidden = nalez > 0;
    });

    /* ---- aktivní kategorie podle scrollu ---- */
    const chips = $$('.ak-chip');
    let aktSekce = null;
    const oznac = () => {
        const hranice = window.innerHeight * 0.4;
        const s = sekce.filter((x) => !x.hidden && x.getBoundingClientRect().top < hranice).pop();
        const id = s ? s.id : null;
        if (id === aktSekce) return;
        aktSekce = id;
        chips.forEach((c) => {
            const on = c.dataset.cil === id;
            c.classList.toggle('is-active', on);
            if (on) c.parentElement.scrollTo({ left: c.offsetLeft - 16, behavior: 'smooth' });
        });
    };
    window.addEventListener('scroll', oznac, { passive: true });
    oznac();

    /* ---- lightbox ---- */
    const lb = $('#ak-lb');
    const stage = $('.ak-lb-stage', lb);
    const img = $('#ak-lb-img');
    let akt = -1, zdroj = null;

    const viditelne = () => karty.filter((k) => !k.hidden).map((k) => +k.dataset.i);

    const nastavObr = (v) => {
        img.src = `img/velke/${v.k}.webp`;
        img.alt = `${DATA[akt].t}${v.l ? ' – ' + v.l : ''}`;
        stage.classList.remove('is-zoom');
        $$('li', lb).forEach((li) => li.classList.toggle('is-active', li.dataset.k === v.k));
    };

    const otevri = (i) => {
        akt = i;
        const p = DATA[i];
        const ceny = p.v.map((v) => v.p);
        const min = Math.min(...ceny);
        $('#ak-lb-t').textContent = p.t;
        $('#ak-lb-logo').textContent = p.logo || '';
        $('#ak-lb-cena').innerHTML = (new Set(ceny).size > 1 ? '<small>od</small>' : '') + cena(min) + ' <small>Kč</small>';
        const ul = $('#ak-lb-var');
        ul.innerHTML = '';
        p.v.forEach((v) => {
            const li = document.createElement('li');
            li.dataset.k = v.k;
            li.classList.toggle('is-off', !v.img);
            li.innerHTML = (v.img ? `<img src="img/${v.k}.webp" alt="">` : '<span class="ph">bez foto</span>')
                + `<span><b></b><button class="kod" type="button" data-kod="${v.k}">${v.k}</button></span><span class="c">${cena(v.p)}</span>`;
            li.querySelector('b').textContent = v.l || p.t;
            if (v.img) li.addEventListener('click', () => nastavObr(v));
            ul.appendChild(li);
        });
        const vic = $('#ak-lb-vic');
        vic.hidden = !p.u;
        if (p.u) {
            vic.href = p.u;
            vic.textContent = `Parametry a náhradní filtry v katalogu ${p.logo} →`;
        }
        nastavObr(p.v.find((v) => v.img));
        if (lb.hidden) {
            lb.hidden = false;
            document.body.style.overflow = 'hidden';
            $('.ak-lb-x', lb).focus();
        }
    };

    const zavri = () => {
        lb.hidden = true;
        document.body.style.overflow = '';
        if (zdroj) zdroj.focus();
    };

    const posun = (d) => {
        const vis = viditelne();
        const pos = vis.indexOf(akt);
        otevri(vis[(pos + d + vis.length) % vis.length]);
    };

    $$('.ak-media').forEach((b) => b.addEventListener('click', () => {
        zdroj = b;
        otevri(+b.closest('.ak-card').dataset.i);
    }));
    $('.ak-lb-x', lb).addEventListener('click', zavri);
    $('.ak-lb-nav.prev', lb).addEventListener('click', () => posun(-1));
    $('.ak-lb-nav.next', lb).addEventListener('click', () => posun(1));
    lb.addEventListener('click', (e) => { if (e.target === lb) zavri(); });
    document.addEventListener('keydown', (e) => {
        if (lb.hidden) return;
        if (e.key === 'Escape') zavri();
        if (e.key === 'ArrowLeft') posun(-1);
        if (e.key === 'ArrowRight') posun(1);
    });

    /* zoom: klik přiblíží, pohyb myši / prstu posouvá detail */
    const pan = (x, y) => {
        const r = stage.getBoundingClientRect();
        img.style.transformOrigin = `${((x - r.left) / r.width) * 100}% ${((y - r.top) / r.height) * 100}%`;
    };
    stage.addEventListener('click', (e) => {
        if (moved) return;
        pan(e.clientX, e.clientY);
        stage.classList.toggle('is-zoom');
    });
    stage.addEventListener('mousemove', (e) => { if (stage.classList.contains('is-zoom')) pan(e.clientX, e.clientY); });

    /* dotyk: tažení při zoomu posouvá, jinak swipe přepíná produkty */
    let sx = 0, sy = 0, moved = false;
    stage.addEventListener('touchstart', (e) => {
        sx = e.touches[0].clientX; sy = e.touches[0].clientY; moved = false;
    }, { passive: true });
    stage.addEventListener('touchmove', (e) => {
        const t = e.touches[0];
        if (Math.abs(t.clientX - sx) > 8 || Math.abs(t.clientY - sy) > 8) moved = true;
        if (stage.classList.contains('is-zoom')) pan(t.clientX, t.clientY);
    }, { passive: true });
    stage.addEventListener('touchend', (e) => {
        if (stage.classList.contains('is-zoom') || !moved) { setTimeout(() => { moved = false; }, 0); return; }
        const dx = e.changedTouches[0].clientX - sx;
        if (Math.abs(dx) > 50) posun(dx < 0 ? 1 : -1);
        setTimeout(() => { moved = false; }, 0);
    });
})();
