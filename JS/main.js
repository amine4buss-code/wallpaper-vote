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
    { name: 'Lofi bedroom — warm night', cat: 'lofi', url: base + 'wallpaper/lofi-bedroom-warm-night.html' },
    { name: 'Cyberpunk neon city rain', cat: 'cyberpunk', url: base + 'wallpaper/cyberpunk-neon-city-rain.html' },
    { name: 'Forest fog — dawn light', cat: 'nature', url: base + 'wallpaper/forest-fog-dawn.html' },
    { name: 'Deep space nebula', cat: 'space', url: base + 'wallpaper/deep-space-nebula.html' },
    { name: 'Fluid abstract liquid metal', cat: 'abstract', url: base + 'wallpaper/fluid-abstract-liquid-metal.html' },
    { name: 'Minimal red dot — cream', cat: 'minimal', url: base + 'wallpaper/minimal-red-dot-cream.html' },
    { name: 'Anime rooftop cherry blossom', cat: 'anime', url: base + 'wallpaper/anime-rooftop-cherry-blossom.html' },
    { name: 'Blade runner alley — neon', cat: 'cyberpunk', url: base + 'wallpaper/blade-runner-alley-neon.html' },
    { name: 'Saturn rings — golden', cat: 'space', url: base + 'wallpaper/saturn-rings-golden.html' },
    { name: 'Bioluminescent jellyfish ocean', cat: 'nature', url: base + 'wallpaper/bioluminescent-jellyfish-ocean.html' },
    { name: 'Samurai bamboo forest sunset', cat: 'anime', url: base + 'wallpaper/anime-samurai-bamboo-forest.html' },
    { name: 'Minimal circle — black', cat: 'minimal', url: base + 'wallpaper/minimal-circle-line-black.html' },
    { name: 'Lofi apartment — city window', cat: 'lofi', url: base + 'wallpaper/lofi-apartment-city-window.html' },
    { name: 'Northern lights — aurora lake', cat: 'nature', url: base + 'wallpaper/northern-lights-aurora-lake.html' },
    { name: 'Cyberpunk megacity — aerial', cat: 'cyberpunk', url: base + 'wallpaper/cyberpunk-megacity-aerial.html' },
    { name: 'Milky way — desert night', cat: 'space', url: base + 'wallpaper/milky-way-desert-night.html' },
    { name: 'Japanese village — Mount Fuji', cat: 'anime', url: base + 'wallpaper/japanese-village-mount-fuji.html' },
    { name: 'Tropical sunset beach', cat: 'nature', url: base + 'wallpaper/tropical-sunset-beach.html' },
    { name: 'Cyberpunk neon subway station', cat: 'cyberpunk', url: base + 'wallpaper/cyberpunk-neon-subway.html' },
    { name: 'Lofi study room — green lamp', cat: 'lofi', url: base + 'wallpaper/lofi-study-room-green-lamp.html' },
    { name: 'Black hole — accretion disk', cat: 'space', url: base + 'wallpaper/black-hole-accretion-disk.html' },
    { name: 'Minimal pastel gradient', cat: 'minimal', url: base + 'wallpaper/minimal-pastel-gradient.html' },
    { name: 'Pink aesthetic — roses bouquet', cat: 'aesthetic', url: base + 'wallpaper/pink-aesthetic-roses.html' },
    { name: 'Purple aesthetic bedroom', cat: 'aesthetic', url: base + 'wallpaper/purple-aesthetic-bedroom.html' },
    { name: 'Cherry blossom tunnel — Japan', cat: 'nature', url: base + 'wallpaper/cherry-blossom-tunnel-japan.html' },
    { name: 'Beige minimal — pampas grass', cat: 'minimal', url: base + 'wallpaper/beige-minimal-pampas-grass.html' },
    { name: 'Cozy reading nook — fairy lights', cat: 'lofi', url: base + 'wallpaper/cozy-reading-nook-fairy-lights.html' },
    { name: 'Lofi Girl — Window City Night', cat: 'lofi', url: base + 'wallpaper/lofi-girl-window-city-night.html' },
    { name: 'Lofi Aesthetic Room — Polaroid', cat: 'lofi', url: base + 'wallpaper/lofi-aesthetic-room-polaroid.html' },
    { name: 'Cyberpunk Neon Highway — Night', cat: 'cyberpunk', url: base + 'wallpaper/cyberpunk-neon-highway-night.html' },
    { name: 'Majestic Waterfall — Rainforest', cat: 'nature', url: base + 'wallpaper/majestic-waterfall-rainforest.html' },
    { name: 'Red Canyon Desert — Golden Hour', cat: 'nature', url: base + 'wallpaper/red-canyon-desert-golden-hour.html' },
    { name: 'Two Galaxies Colliding', cat: 'space', url: base + 'wallpaper/two-galaxies-colliding-space.html' },
    { name: 'Vibrant Abstract — Paint Splash', cat: 'abstract', url: base + 'wallpaper/vibrant-abstract-paint-splash.html' },
    { name: 'Dark Minimal — Triangle Black', cat: 'minimal', url: base + 'wallpaper/dark-minimal-triangle-black.html' },
    { name: 'Anime Ancient Temple Ruins', cat: 'anime', url: base + 'wallpaper/anime-ancient-temple-ruins.html' },
    { name: 'Soft Aesthetic — White Flowers', cat: 'aesthetic', url: base + 'wallpaper/soft-aesthetic-white-flowers.html' },
    { name: 'Golden Hour — Sunlight Curtains', cat: 'aesthetic', url: base + 'wallpaper/golden-hour-sunlight-curtains.html' },
    { name: 'Deep Blue Abstract — Ocean Light', cat: 'abstract', url: base + 'wallpaper/deep-blue-abstract-ocean-light.html' },
    { name: 'White Minimal — Gold Line', cat: 'minimal', url: base + 'wallpaper/white-minimal-gold-line.html' },
    { name: 'Lofi Bedroom — Rain Candlelight', cat: 'lofi', url: base + 'wallpaper/lofi-bedroom-rain-candlelight.html' },
    { name: 'Eagle Nebula — Pillars of Creation', cat: 'space', url: base + 'wallpaper/eagle-nebula-pillars-creation.html' },
    { name: 'Dreamy Pink Sunset Sky', cat: 'aesthetic', url: base + 'wallpaper/dreamy-pink-sunset-sky.html' },
    { name: 'Autumn Forest Path — Golden', cat: 'nature', url: base + 'wallpaper/autumn-forest-path-golden.html' },
    { name: 'Anime Warrior — Bamboo Dawn', cat: 'anime', url: base + 'wallpaper/anime-warrior-bamboo-dawn.html' },
    { name: 'Vintage Aesthetic — Film Camera', cat: 'aesthetic', url: base + 'wallpaper/vintage-aesthetic-film-camera.html' },
    { name: 'Black White Minimal — Sphere', cat: 'minimal', url: base + 'wallpaper/black-white-minimal-sphere.html' },
    { name: 'Cyberpunk Character — Rooftop', cat: 'cyberpunk', url: base + 'wallpaper/cyberpunk-character-rooftop.html' },
    { name: 'Turquoise Ocean — Aerial Coral', cat: 'nature', url: base + 'wallpaper/turquoise-ocean-aerial-coral.html' },
    { name: 'Lavender Field — Provence France', cat: 'nature', url: base + 'wallpaper/lavender-field-provence-france.html' },
    { name: 'Mars Surface — Sunset Moons', cat: 'space', url: base + 'wallpaper/mars-surface-sunset-moons.html' },
    { name: 'Lofi Japan — Ramen Street Night', cat: 'lofi', url: base + 'wallpaper/lofi-japan-ramen-street-night.html' },
    { name: 'Neon Abstract — Geometric Shapes', cat: 'abstract', url: base + 'wallpaper/neon-abstract-geometric-shapes.html' },
    { name: 'Coffee Aesthetic — Latte Morning', cat: 'aesthetic', url: base + 'wallpaper/coffee-aesthetic-latte-morning.html' },
    { name: 'Aesthetic Book Nook — Autumn', cat: 'aesthetic', url: base + 'wallpaper/aesthetic-book-nook-autumn.html' },
    { name: 'Volcano Erupting — Lava Ocean', cat: 'nature', url: base + 'wallpaper/volcano-erupting-lava-ocean.html' },
    { name: 'Cyberpunk Alley — Rain Steam', cat: 'cyberpunk', url: base + 'wallpaper/cyberpunk-alley-rain-steam.html' },
    { name: 'Colorful Smoke Abstract', cat: 'abstract', url: base + 'wallpaper/colorful-smoke-abstract-purple.html' },
    { name: 'Iceland Waterfall — Rainbow Moss', cat: 'nature', url: base + 'wallpaper/iceland-waterfall-rainbow-moss.html' },
    { name: 'Anime Winter Cabin — Snow', cat: 'anime', url: base + 'wallpaper/anime-winter-cabin-snow.html' },
    { name: 'Lofi Girl — Balcony Neon City', cat: 'lofi', url: base + 'wallpaper/lofi-girl-balcony-neon-city.html' },
    { name: 'Rainy Window — City Lights', cat: 'aesthetic', url: base + 'wallpaper/rainy-window-city-lights-candle.html' },
    { name: 'Minimal Sunset — Half Circle', cat: 'minimal', url: base + 'wallpaper/minimal-sunset-half-circle-ocean.html' },
    { name: 'Anime Warrior — Cherry Blossom', cat: 'anime', url: base + 'wallpaper/anime-warrior-cherry-blossom.html' },
    { name: 'Futuristic Tokyo Megacity — Neon Rain', cat: 'cyberpunk', url: base + 'wallpaper/futuristic-tokyo-megacity-rain.html' },
    { name: 'Alien Ocean — Beneath Twin Moons', cat: 'space', url: base + 'wallpaper/alien-ocean-twin-moons.html' },
    { name: 'Space Observatory — Black Hole', cat: 'space', url: base + 'wallpaper/space-observatory-black-hole.html' },
    { name: 'Enchanted Forest — Glowing Mushrooms', cat: 'nature', url: base + 'wallpaper/enchanted-forest-glowing-mushrooms.html' },
    { name: 'Nordic Mountains — Epic Sunrise', cat: 'nature', url: base + 'wallpaper/nordic-mountains-epic-sunrise.html' },
    { name: 'Lone Samurai — Cherry Blossom Kyoto', cat: 'anime', url: base + 'wallpaper/samurai-cherry-blossom-kyoto.html' },
    { name: 'Matte Black Lamborghini — Neon Garage', cat: 'cyberpunk', url: base + 'wallpaper/lamborghini-neon-garage.html' },
    { name: 'Floating Islands — Endless Waterfalls', cat: 'nature', url: base + 'wallpaper/floating-islands-waterfalls.html' },
    { name: 'Luxury Lofi Workspace — City Night', cat: 'lofi', url: base + 'wallpaper/luxury-lofi-workspace-city.html' },
    { name: 'Minimal Luxury — Obsidian Black', cat: 'minimal', url: base + 'wallpaper/minimal-luxury-obsidian-black.html' },
    { name: 'Enchanted Forest — Glowing Mushrooms II', cat: 'nature', url: base + 'wallpaper/enchanted-forest-glowing-mushrooms-ii.html' },
    { name: 'Space Observatory — Black Hole II', cat: 'space', url: base + 'wallpaper/space-observatory-black-hole-ii.html' },
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
        const hl = w.name.replace(new RegExp(query, 'gi'), m => `<strong style="color:#6C4CFF;">${m}</strong>`);
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
    msg.innerHTML = `No results for "<strong style="color:#1a1a1a;">${query}</strong>" — try <a href="${base}pages/lofi.html" style="color:#6C4CFF;">Lofi</a> or <a href="${base}pages/nature.html" style="color:#6C4CFF;">Nature</a>`;
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

      sortSelect.style.borderColor = '#6C4CFF';
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

  /* ================================================
     AUTO WALLPAPER COUNT
     Counts real cards in the DOM instead of a
     hardcoded number that goes stale every time
     wallpapers are added.
     ================================================ */
  const statEl = document.getElementById('statWallpaperCount');
  if (statEl) {
    const wpGrid = document.getElementById('wallpaperGrid');
    if (wpGrid) {
      const count = wpGrid.querySelectorAll('.wcard').length;
      if (count > 0) {
        const rounded = count - (count % 5); // round down to nearest 5, e.g. 77 -> 75+
        statEl.textContent = rounded + '+';
      }
    }
  }

});

/* ================================================
   CSS ANIMATION
   ================================================ */

const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`;
document.head.appendChild(style);
