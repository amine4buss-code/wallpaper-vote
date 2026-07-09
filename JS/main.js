/* ================================================
   WallRank — main.js
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  const path = window.location.pathname;
  let base = '';
  if (path.includes('/pages/') || path.includes('/wallpaper/')) {
    base = '../';
  }

  const wallpapers = [
    { name: 'Lofi bedroom — warm night',  cat: 'lofi',      url: base + 'wallpaper/template.html' },
    { name: 'Forest fog — dawn light',    cat: 'nature',    url: base + 'wallpaper/template.html' },
    { name: 'Neon city night',            cat: 'cyberpunk', url: base + 'wallpaper/template.html' },
    { name: 'Cyberpunk alley rain',       cat: 'cyberpunk', url: base + 'wallpaper/template.html' },
    { name: 'Jungle waterfall mist',      cat: 'nature',    url: base + 'wallpaper/template.html' },
    { name: 'Lofi café window rain',      cat: 'lofi',      url: base + 'wallpaper/template.html' },
    { name: 'Cyberpunk car chase',        cat: 'cyberpunk', url: base + 'wallpaper/template.html' },
    { name: 'Mountain sunrise',           cat: 'nature',    url: base + 'wallpaper/template.html' },
    { name: 'Lofi study desk — purple',   cat: 'lofi',      url: base + 'wallpaper/template.html' },
    { name: 'Deep space nebula',          cat: 'space',     url: base + 'wallpaper/template.html' },
    { name: 'Fluid abstract waves',       cat: 'abstract',  url: base + 'wallpaper/template.html' },
    { name: 'Minimal circle line',        cat: 'minimal',   url: base + 'wallpaper/template.html' },
    { name: 'Anime rooftop cherry blossom', cat: 'anime',   url: base + 'wallpaper/template.html' },
  ];

  /* ================================================
     SEARCH
     ================================================ */

  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');
  const searchSubmit = document.getElementById('searchSubmit');
  const navSubmitBtn = document.getElementById('navSubmitBtn');

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput && searchInput.focus(), 100);
    renderSuggestions('');
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
    if (searchInput) searchInput.value = '';
    removeSuggestions();
  }

  function doSearch() {
    if (!searchInput) return;
    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;
    const match = wallpapers.find(w =>
      w.name.toLowerCase().includes(query) ||
      w.cat.toLowerCase().includes(query)
    );
    window.location.href = match ? match.url : (base + 'pages/lofi.html');
  }

  if (searchToggle)  searchToggle.addEventListener('click', openSearch);
  if (navSubmitBtn)  navSubmitBtn.addEventListener('click', openSearch);
  if (searchClose)   searchClose.addEventListener('click', closeSearch);
  if (searchSubmit)  searchSubmit.addEventListener('click', doSearch);

  if (searchOverlay) {
    searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  if (searchInput) {
    searchInput.addEventListener('input', () => renderSuggestions(searchInput.value.trim()));
    searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
  }

  function renderSuggestions(query) {
    removeSuggestions();
    const box = document.querySelector('.search-overlay__box');
    if (!box) return;
    const q = query.toLowerCase();
    const results = q
      ? wallpapers.filter(w => w.name.toLowerCase().includes(q) || w.cat.toLowerCase().includes(q))
      : wallpapers.slice(0, 6);

    const list = document.createElement('div');
    list.id = 'searchSuggestions';
    list.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:#fff;border-radius:0 0 12px 12px;border-top:0.5px solid #e8e5e0;box-shadow:0 20px 40px rgba(0,0,0,0.15);overflow:hidden;z-index:999;';

    if (results.length === 0) {
      list.innerHTML = `<div style="padding:16px 20px;font-size:13px;color:#aaa;text-align:center;">No results for "<strong style="color:#1a1a1a;">${query}</strong>"</div>`;
    } else {
      results.forEach(w => {
        const item = document.createElement('div');
        item.style.cssText = 'padding:11px 20px;font-size:13px;color:#1a1a1a;cursor:pointer;display:flex;align-items:center;gap:12px;border-bottom:0.5px solid #f0ede8;transition:background 0.15s ease;';
        const hl = w.name.replace(new RegExp(query, 'gi'), m => `<strong style="color:#D85A30;">${m}</strong>`);
        item.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#aaa" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><span style="flex:1;">${hl}</span><span style="font-size:11px;color:#aaa;text-transform:capitalize;">${w.cat}</span>`;
        item.addEventListener('mouseenter', () => item.style.background = '#f7f5f2');
        item.addEventListener('mouseleave', () => item.style.background = '#fff');
        item.addEventListener('click', () => window.location.href = w.url);
        list.appendChild(item);
      });
    }
    box.style.position = 'relative';
    box.style.borderRadius = results.length ? '12px 12px 0 0' : '12px';
    box.appendChild(list);
  }

  function showNoResults(query) {
    removeSuggestions();
    const box = document.querySelector('.search-overlay__box');
    if (!box) return;
    const msg = document.createElement('div');
    msg.id = 'searchSuggestions';
    msg.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:#fff;border-radius:0 0 12px 12px;border-top:0.5px solid #e8e5e0;box-shadow:0 20px 40px rgba(0,0,0,0.15);padding:16px 20px;font-size:13px;color:#aaa;text-align:center;';
    msg.innerHTML = `No results for "<strong style="color:#1a1a1a;">${query}</strong>" — try <a href="${base}pages/lofi.html" style="color:#D85A30;">Lofi</a> or <a href="${base}pages/nature.html" style="color:#D85A30;">Nature</a>`;
    box.style.position = 'relative';
    box.appendChild(msg);
  }

  function removeSuggestions() {
    const el = document.getElementById('searchSuggestions');
    if (el) el.remove();
    const box = document.querySelector('.search-overlay__box');
    if (box) box.style.borderRadius = '12px';
  }

  /* ================================================
     CATEGORY FILTER — homepage
     Targets ALL cards with data-cat, in any grid
     ================================================ */

  const filterBtns = document.querySelectorAll('.filter-cat[data-cat]');
  const allCards   = document.querySelectorAll('.wcard[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');

      allCards.forEach(card => {
        const show = cat === 'all' || card.getAttribute('data-cat') === cat;
        const parentGrid = card.closest('.w-grid');
        if (show) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });

      // Hide hero grid entirely if filtering and no hero card matches, to avoid empty gaps
      const heroGrid = document.querySelector('.w-grid--hero');
      if (heroGrid) {
        const heroCards = heroGrid.querySelectorAll('.wcard[data-cat]');
        const anyVisible = Array.from(heroCards).some(c => c.style.display !== 'none');
        heroGrid.style.display = (cat === 'all' || anyVisible) ? '' : 'none';
      }
    });
  });

  /* ================================================
     SORT
     ================================================ */

  const sortSelect = document.getElementById('sortSelect');

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      const val = sortSelect.value;
      const grids = document.querySelectorAll('.w-grid:not(.w-grid--hero)');
      if (!grids.length) return;

      grids.forEach(grid => {
        const cards = Array.from(grid.querySelectorAll('.wcard'));
        if (cards.length < 2) return;

        function getScore(card) {
          const voteEl = card.querySelector('.wcard__votes, .wcard__rank');
          if (!voteEl) return 0;
          const text = voteEl.textContent.trim();
          const match = text.match(/([\d.]+)k?/);
          if (!match) return 0;
          let num = parseFloat(match[1]);
          if (text.includes('k')) num *= 1000;
          if (text.includes('#')) num = 1000 - num;
          return num;
        }

        function isNew(card) {
          return !!card.querySelector('.wcard__badge--new');
        }

        cards.sort((a, b) => {
          if (val === 'new') return (isNew(b) ? 1 : 0) - (isNew(a) ? 1 : 0);
          return getScore(b) - getScore(a);
        });

        cards.forEach((card, i) => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          grid.appendChild(card);
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, i * 60);
        });
      });

      sortSelect.style.borderColor = '#D85A30';
      setTimeout(() => sortSelect.style.borderColor = '', 1000);
    });
  }

  /* ================================================
     NAVBAR SHADOW ON SCROLL
     ================================================ */

  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', function () {
    if (!navbar) return;
    navbar.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.08)' : 'none';
  });

  /* ================================================
     SMOOTH SCROLL
     ================================================ */

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ================================================
     ACTIVE NAV LINK ON SCROLL
     ================================================ */

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a');

  window.addEventListener('scroll', function () {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 80) current = s.getAttribute('id'); });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  /* ================================================
     FADE IN ON SCROLL
     ================================================ */

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.wcard, .stat-item, .cat-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
    // Fallback: show all cards after 1.5s in case observer doesn't fire
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 1500);
  });

});

/* ================================================
   CSS ANIMATION
   ================================================ */

const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);
