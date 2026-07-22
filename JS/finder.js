/* ================================================
   WallRank — finder.js
   A tap-through "find my match" tool that works on
   every page. Self-contained: injects its own
   trigger button, modal, and styles, so it doesn't
   depend on any particular page's navbar markup.

   How results work:
   - If the matching hub page is already open, results
     filter the on-page grid in place (no reload).
   - Otherwise, it navigates to the right hub page with
     a ?find= query string, and that page applies the
     same filter on load.
   Root-absolute paths are used throughout (starting
   with "/") so this works correctly no matter how deep
   the current page is nested.
   ================================================ */

(function () {

  const CATEGORY_CLUSTERS = {
    cozy:      { label: 'Calm & cozy',      cats: ['lofi', 'nature'] },
    energetic: { label: 'Bold & energetic', cats: ['cyberpunk', 'space'] },
    moody:     { label: 'Dark & moody',     cats: ['cyberpunk', 'abstract', 'space'] },
    dreamy:    { label: 'Dreamy & soft',    cats: ['aesthetic', 'nature'] },
    minimal:   { label: 'Clean & minimal',  cats: ['minimal', 'abstract'] },
  };

  const WALLPAPER_CATS = [
    ['lofi', 'Lofi'], ['cyberpunk', 'Cyberpunk'], ['nature', 'Nature'], ['space', 'Space'],
    ['abstract', 'Abstract'], ['minimal', 'Minimal'], ['anime', 'Anime'], ['aesthetic', 'Aesthetic'],
  ];

  const HAIR_TYPES = [
    ['straight', 'Straight'], ['wavy', 'Wavy'], ['curly', 'Curly'], ['coily', 'Coily'],
  ];

  const BG_STYLE_CLUSTERS = {
    marble:    { label: 'Marble',            styles: ['marble'] },
    floral:    { label: 'Floral & botanical', styles: ['floral', 'botanical'] },
    soft:      { label: 'Watercolor & soft',  styles: ['watercolor', 'abstract'] },
    modern:    { label: 'Geometric & editorial', styles: ['geometric', 'editorial'] },
  };

  let state = { type: null, values: [] };

  /* ---------- Styles ---------- */
  const style = document.createElement('style');
  style.textContent = `
    .finder-fab {
      position: fixed; right: 20px; bottom: 20px; z-index: 500;
      display: inline-flex; align-items: center; gap: 8px;
      padding: 13px 18px; border-radius: var(--radius-pill, 999px);
      background: var(--gradient-brand, linear-gradient(100deg,#6C4CFF,#FF3D81));
      color: #fff; border: none; cursor: pointer;
      font-family: var(--font-utility, sans-serif); font-size: 13px; font-weight: 600;
      box-shadow: 0 8px 24px rgba(108,76,255,0.35);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .finder-fab:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(108,76,255,0.45); }
    .finder-fab svg { width: 16px; height: 16px; flex-shrink: 0; }
    .finder-fab__label { white-space: nowrap; }
    @media (max-width: 560px) {
      .finder-fab__label { display: none; }
      .finder-fab { padding: 13px; }
    }

    .finder-overlay {
      display: none; position: fixed; inset: 0; z-index: 600;
      background: rgba(11,11,20,0.6); backdrop-filter: blur(2px);
      align-items: center; justify-content: center; padding: 20px;
    }
    .finder-overlay.open { display: flex; }
    .finder-modal {
      background: var(--surface, #fff); border-radius: var(--radius-lg, 14px);
      width: 100%; max-width: 460px; padding: 28px 26px 24px;
      box-shadow: 0 30px 80px rgba(11,11,20,0.35);
      position: relative;
      animation: finderPop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes finderPop { from { opacity:0; transform: scale(0.94) translateY(8px); } to { opacity:1; transform: scale(1) translateY(0); } }
    .finder-modal__close {
      position: absolute; top: 14px; right: 14px; background: none; border: none;
      font-size: 18px; color: var(--text-muted, #999); cursor: pointer; line-height: 1;
    }
    .finder-modal__tag {
      font-family: var(--font-utility, sans-serif); font-size: 11px; font-weight: 600;
      color: var(--volt, #6C4CFF); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;
    }
    .finder-modal__title {
      font-family: var(--font-display, sans-serif); font-size: 22px; font-weight: 700;
      color: var(--text-primary, #14121F); margin-bottom: 6px; letter-spacing: -0.3px;
    }
    .finder-modal__sub {
      font-size: 13px; color: var(--text-secondary, #666); margin-bottom: 20px; line-height: 1.5;
    }
    .finder-options { display: flex; flex-direction: column; gap: 8px; }
    .finder-opt {
      display: flex; align-items: center; justify-content: space-between;
      padding: 13px 16px; border-radius: var(--radius-md, 10px);
      border: 1.5px solid var(--border, #eee); background: var(--bg, #fafafa);
      cursor: pointer; font-family: var(--font-main, sans-serif); font-size: 14px;
      font-weight: 500; color: var(--text-primary, #14121F);
      transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease;
      text-align: left;
    }
    .finder-opt:hover { border-color: var(--volt, #6C4CFF); background: var(--accent-bg, #f1edff); transform: translateX(2px); }
    .finder-opt__arrow { opacity: 0.4; transition: opacity 0.15s ease, transform 0.15s ease; }
    .finder-opt:hover .finder-opt__arrow { opacity: 1; transform: translateX(2px); }
    .finder-skip {
      display: block; width: 100%; text-align: center; margin-top: 14px;
      font-size: 12.5px; color: var(--text-muted, #999); background: none; border: none;
      cursor: pointer; font-family: var(--font-utility, sans-serif);
    }
    .finder-skip:hover { color: var(--text-primary, #14121F); }
    .finder-back {
      font-size: 12px; color: var(--text-muted, #999); background: none; border: none;
      cursor: pointer; margin-bottom: 14px; display: inline-flex; align-items: center; gap: 4px;
      font-family: var(--font-utility, sans-serif);
    }
    .finder-back:hover { color: var(--volt, #6C4CFF); }
    .finder-steps { display: flex; gap: 4px; margin-bottom: 18px; }
    .finder-step-dot { height: 3px; flex: 1; border-radius: 2px; background: var(--border, #eee); transition: background 0.2s ease; }
    .finder-step-dot.active { background: var(--gradient-brand, linear-gradient(100deg,#6C4CFF,#FF3D81)); }

    .finder-match-chip {
      display: flex; align-items: center; justify-content: space-between; gap: 12px;
      max-width: 1100px; margin: 0 auto 8px; padding: 10px 20px;
      background: var(--accent-bg, #f1edff); border-radius: var(--radius-md, 10px);
      font-family: var(--font-utility, sans-serif); font-size: 12.5px; color: var(--text-primary, #14121F);
    }
    .finder-match-chip button {
      background: none; border: none; color: var(--volt, #6C4CFF); font-weight: 600; cursor: pointer;
      font-family: var(--font-utility, sans-serif); font-size: 12.5px;
    }
  `;
  document.head.appendChild(style);

  /* ---------- Floating trigger button ---------- */
  const fab = document.createElement('button');
  fab.className = 'finder-fab';
  fab.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg><span class="finder-fab__label">Find my match</span>`;
  document.body.appendChild(fab);

  /* ---------- Modal shell ---------- */
  const overlay = document.createElement('div');
  overlay.className = 'finder-overlay';
  overlay.innerHTML = `<div class="finder-modal"><button class="finder-modal__close">✕</button><div class="finder-modal__body"></div></div>`;
  document.body.appendChild(overlay);

  const modalBody = overlay.querySelector('.finder-modal__body');
  const closeBtn = overlay.querySelector('.finder-modal__close');

  function openModal() {
    state = { type: null, values: [] };
    overlay.classList.add('open');
    renderStep1();
  }
  function closeModal() { overlay.classList.remove('open'); }

  fab.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function stepDots(current, total) {
    let html = '<div class="finder-steps">';
    for (let i = 0; i < total; i++) html += `<div class="finder-step-dot${i < current ? ' active' : ''}"></div>`;
    return html + '</div>';
  }

  /* ---------- Step 1: content type ---------- */
  function renderStep1() {
    modalBody.innerHTML = `
      ${stepDots(1, 3)}
      <div class="finder-modal__tag">Quick find</div>
      <div class="finder-modal__title">What are you looking for?</div>
      <div class="finder-modal__sub">Answer 2 quick questions and we'll show you real matches — no scrolling needed.</div>
      <div class="finder-options">
        <button class="finder-opt" data-v="wallpaper">🖼️ A wallpaper <span class="finder-opt__arrow">→</span></button>
        <button class="finder-opt" data-v="hairstyle">💇 A hairstyle <span class="finder-opt__arrow">→</span></button>
        <button class="finder-opt" data-v="background">🖌️ A social media background <span class="finder-opt__arrow">→</span></button>
      </div>
    `;
    modalBody.querySelectorAll('.finder-opt').forEach(btn => {
      btn.addEventListener('click', () => { state.type = btn.dataset.v; renderStep2(); });
    });
  }

  /* ---------- Step 2: adaptive question ---------- */
  function renderStep2() {
    let title, sub, options;
    if (state.type === 'wallpaper') {
      title = "What's the vibe?";
      sub = "We'll match you with wallpapers in that mood.";
      options = Object.entries(CATEGORY_CLUSTERS).map(([key, v]) => [key, v.label]);
    } else if (state.type === 'hairstyle') {
      title = "What's your hair type?";
      sub = "We'll show styles that actually work with your texture.";
      options = HAIR_TYPES;
    } else {
      title = "What style are you into?";
      sub = "We'll show backgrounds in that look.";
      options = Object.entries(BG_STYLE_CLUSTERS).map(([key, v]) => [key, v.label]);
    }

    modalBody.innerHTML = `
      <button class="finder-back">← Back</button>
      ${stepDots(2, 3)}
      <div class="finder-modal__tag">Quick find</div>
      <div class="finder-modal__title">${title}</div>
      <div class="finder-modal__sub">${sub}</div>
      <div class="finder-options">
        ${options.map(([key, label]) => `<button class="finder-opt" data-v="${key}">${label} <span class="finder-opt__arrow">→</span></button>`).join('')}
      </div>
    `;
    modalBody.querySelector('.finder-back').addEventListener('click', renderStep1);
    modalBody.querySelectorAll('.finder-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        state.step2 = btn.dataset.v;
        if (state.type === 'wallpaper') renderStep3();
        else { finish(); }
      });
    });
  }

  /* ---------- Step 3 (wallpaper only): optional category narrow ---------- */
  function renderStep3() {
    modalBody.innerHTML = `
      <button class="finder-back">← Back</button>
      ${stepDots(3, 3)}
      <div class="finder-modal__tag">Quick find</div>
      <div class="finder-modal__title">Narrow it down? (optional)</div>
      <div class="finder-modal__sub">Pick a category, or skip to see everything that matches the vibe.</div>
      <div class="finder-options">
        ${WALLPAPER_CATS.map(([key, label]) => `<button class="finder-opt" data-v="${key}">${label} <span class="finder-opt__arrow">→</span></button>`).join('')}
      </div>
      <button class="finder-skip">Skip — show me everything</button>
    `;
    modalBody.querySelector('.finder-back').addEventListener('click', renderStep2);
    modalBody.querySelector('.finder-skip').addEventListener('click', () => { state.step3 = null; finish(); });
    modalBody.querySelectorAll('.finder-opt').forEach(btn => {
      btn.addEventListener('click', () => { state.step3 = btn.dataset.v; finish(); });
    });
  }

  /* ---------- Resolve final values + navigate/filter ---------- */
  function finish() {
    let values, hubPath, gridId;

    if (state.type === 'wallpaper') {
      values = state.step3 ? [state.step3] : CATEGORY_CLUSTERS[state.step2].cats;
      hubPath = '/index.html';
      gridId = 'wallpaperGrid';
    } else if (state.type === 'hairstyle') {
      values = [state.step2];
      hubPath = '/hairstyles/index.html';
      gridId = 'hairstyleGrid';
    } else {
      values = BG_STYLE_CLUSTERS[state.step2].styles;
      hubPath = '/social-backgrounds/index.html';
      gridId = 'backgroundGrid';
    }

    closeModal();

    const currentGrid = document.getElementById(gridId);
    if (currentGrid) {
      applyFilter(currentGrid, values);
    } else {
      const params = new URLSearchParams({ find: values.join(',') });
      window.location.href = `${hubPath}?${params.toString()}`;
    }
  }

  /* ---------- Apply filter to a grid + show clear chip ---------- */
  function applyFilter(grid, values) {
    const cards = grid.querySelectorAll('.wcard');
    let matchCount = 0;
    cards.forEach(card => {
      const cardVal = card.getAttribute('data-cat') || card.getAttribute('data-type') || card.getAttribute('data-style');
      const show = !cardVal || values.includes(cardVal);
      card.style.display = show ? '' : 'none';
      if (show) matchCount++;
    });

    let chip = document.getElementById('finderMatchChip');
    if (!chip) {
      chip = document.createElement('div');
      chip.id = 'finderMatchChip';
      chip.className = 'finder-match-chip';
      grid.parentElement.insertBefore(chip, grid);
    }
    chip.innerHTML = `<span>✨ Showing ${matchCount} match${matchCount === 1 ? '' : 'es'} for you</span><button>Clear</button>`;
    chip.querySelector('button').addEventListener('click', () => {
      cards.forEach(card => { card.style.display = ''; });
      chip.remove();
      const url = new URL(window.location);
      url.searchParams.delete('find');
      window.history.replaceState({}, '', url);
    });

    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- On page load: check for ?find= from a cross-page redirect ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    const params = new URLSearchParams(window.location.search);
    const find = params.get('find');
    if (!find) return;
    const values = find.split(',');
    const grid = document.getElementById('wallpaperGrid') || document.getElementById('hairstyleGrid') || document.getElementById('backgroundGrid');
    if (grid) applyFilter(grid, values);
  });

})();
