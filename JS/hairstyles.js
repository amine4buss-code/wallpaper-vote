/* ================================================
   WallRank — hairstyles.js
   Handles the Hairstyles hub + type pages.
   Kept separate from main.js on purpose: main.js's
   search dataset and sort logic are wallpaper-specific,
   this file is hairstyle-specific and reads data-type
   instead of data-cat to avoid any cross-wiring.
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Search overlay (same visual behavior as main.js) ---- */
  const searchToggle = document.getElementById('searchToggle');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchClose = document.getElementById('searchClose');
  const searchInput = document.getElementById('searchInput');

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput && searchInput.focus(), 100);
  }
  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('open');
    if (searchInput) searchInput.value = '';
  }

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', e => { if (e.target === searchOverlay) closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });

  /* ---- Simple client-side name filter within the visible grid ---- */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('#hairstyleGrid .wcard').forEach(card => {
        const name = (card.querySelector('.wcard__name')?.textContent || '').toLowerCase();
        card.style.display = (!q || name.includes(q)) ? '' : 'none';
      });
      updateCount();
    });
  }

  /* ---- Type filter (All / Straight / Wavy / Curly / Coily) ---- */
  const filterBtns = document.querySelectorAll('.filter-cat[data-type]');
  const allCards = document.querySelectorAll('#hairstyleGrid .wcard[data-type]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.getAttribute('data-type');

      allCards.forEach(card => {
        const show = type === 'all' || card.getAttribute('data-type') === type;
        card.style.display = show ? '' : 'none';
      });
      updateCount();
    });
  });

  function updateCount() {
    const counter = document.getElementById('hsCount');
    if (!counter) return;
    const visible = document.querySelectorAll('#hairstyleGrid .wcard').length
      ? Array.from(document.querySelectorAll('#hairstyleGrid .wcard')).filter(c => c.style.display !== 'none').length
      : 0;
    counter.textContent = visible + (visible === 1 ? ' hairstyle' : ' hairstyles');
  }

  /* ---- Show/hide the empty state depending on whether any cards exist ---- */
  const grid = document.getElementById('hairstyleGrid');
  const emptyState = document.getElementById('hsEmptyState');
  if (grid && emptyState) {
    const hasCards = grid.querySelectorAll('.wcard').length > 0;
    emptyState.style.display = hasCards ? 'none' : '';
    grid.style.display = hasCards ? '' : 'none';
  }

  updateCount();
});
