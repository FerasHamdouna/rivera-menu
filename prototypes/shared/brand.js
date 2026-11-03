// Shared brand pieces: logo, frame corners, language switch, item detail sheet.
(function (R) {
  R.crown = `<svg viewBox="0 0 46 30" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M4 24 L2 8 L13 16 L23 3 L33 16 L44 8 L42 24 Z"/><path d="M5 27.5 H41"/><circle cx="2" cy="7" r="1.6" fill="currentColor"/><circle cx="23" cy="2" r="1.8" fill="currentColor"/><circle cx="44" cy="7" r="1.6" fill="currentColor"/></svg>`;

  R.logo = (cls = '') => `<div class="logo ${cls}"><span style="display:block;color:var(--gold)">${R.crown}</span><span class="word gold-text">Rivera</span><span class="sub gold-text">Cafe &amp; Restaurant</span></div>`;

  const corner = `<svg class="c" viewBox="0 0 34 34" fill="none" stroke="currentColor" stroke-width="1.1"><path d="M2 32 V10 Q2 2 10 2 H32"/><path d="M8 26 V14 Q8 8 14 8 H26"/><path d="M14 14 q6 0 6 6 q-6 0 -6 -6z" fill="currentColor" opacity=".7"/></svg>`;
  R.frame = () => `<div class="frame">${corner.repeat(4)}</div>`;
  R.fleuron = `<svg width="22" height="14" viewBox="0 0 22 14" fill="currentColor"><path d="M11 0 C13 4 13 7 11 10 C9 7 9 4 11 0Z"/><path d="M11 10 C7 9 4 10 1 13 C5 13 8 12 11 10Z" opacity=".8"/><path d="M11 10 C15 9 18 10 21 13 C17 13 14 12 11 10Z" opacity=".8"/></svg>`;

  // Language switch; calls onChange so each prototype can re-render.
  R.mountLang = (onChange) => {
    const el = document.createElement('div');
    el.className = 'lang';
    el.innerHTML = `<button data-l="ar">ع</button><button data-l="en">EN</button>`;
    const sync = () => el.querySelectorAll('button').forEach((b) => b.classList.toggle('on', b.dataset.l === R.lang));
    el.onclick = (e) => {
      const l = e.target.dataset.l;
      if (!l || l === R.lang) return;
      R.setLang(l); sync(); onChange();
    };
    document.body.appendChild(el);
    R.setLang(R.lang); sync();
  };

  // Bottom sheet with full item details. `bg` lets light prototypes theme it.
  R.openSheet = (sec, it, idx, bg = 'var(--marble)') => {
    const other = R.lang === 'ar' ? it.en : it.ar;
    const sizes = it.sizes ? `<div class="lbl">${R.s('sizes')}</div>${it.sizes.map((s) => `<div class="row"><span>${R.lang === 'ar' ? s.ar : s.en}</span><b class="gold-text">${R.currency}${s.price}</b></div>`).join('')}` : '';
    const extras = it.extras ? `<div class="lbl">${R.s('flavors')}</div><div class="chips">${it.extras.map((x) => `<span>${R.t(x)}</span>`).join('')}</div>` : '';
    const price = it.sizes ? '' : `<div class="big-price gold-text">${it.price != null ? R.currency : ''}${R.price(it)}</div>`;
    const wrap = document.createElement('div');
    wrap.innerHTML = `<div class="sheet-bg"></div>
      <div class="sheet marble" style="background-color:${bg}">
        ${R.art(sec, it, idx)}
        <button class="close" aria-label="close"><i data-lucide="x"></i></button>
        <div class="body">
          <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
            <div><h3>${R.t(it)}</h3><div class="en-sub">${other}</div></div>
            ${price}
          </div>
          ${R.isOut(it) ? `<div style="margin-top:10px"><span class="badge-out">${R.s('out')}</span></div>` : ''}
          ${R.desc(it) ? `<p>${R.desc(it)}</p>` : ''}
          ${sizes}${extras}
        </div>
      </div>`;
    document.body.appendChild(wrap);
    R.icons();
    const [bgEl, sheet] = wrap.children;
    requestAnimationFrame(() => requestAnimationFrame(() => { bgEl.classList.add('open'); sheet.classList.add('open'); }));
    const close = () => { bgEl.classList.remove('open'); sheet.classList.remove('open'); setTimeout(() => wrap.remove(), 500); };
    bgEl.onclick = close;
    sheet.querySelector('.close').onclick = close;
  };
})(window.RIVERA);
