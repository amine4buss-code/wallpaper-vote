/* ================================================
   WallRank — hairstyles.js
   Handles the Hairstyles hub with multi-filter support.
   Filters: Type (Straight/Wavy), Length (Short/Medium/Long), Color (Brunette/Black/Balayage)
   ================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Search overlay ---- */
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

  /* ---- State for active filters ---- */
  let activeFilters = {
    type: 'all',
    length: 'all',
    color: 'all'
  };

  /* ---- Get all filter buttons and cards ---- */
  const filterBtns = document.querySelectorAll('.filter-cat[data-filter]');
  const allCards = document.querySelectorAll('#hairstyleGrid .wcard');
  const emptyState = document.getElementById('hsEmptyState');
  const grid = document.getElementById('hairstyleGrid');

  /* ---- Filter function ---- */
  function applyFilters() {
    let visibleCount = 0;

    allCards.forEach(card => {
      const cardType = card.getAttribute('data-type') || '';
      const cardLength = card.getAttribute('data-length') || '';
      const cardColor = card.getAttribute('data-color') || '';

      const typeMatch = activeFilters.type === 'all' || cardType === activeFilters.type;
      const lengthMatch = activeFilters.length === 'all' || cardLength === activeFilters.length;
      const colorMatch = activeFilters.color === 'all' || cardColor === activeFilters.color;

      const show = typeMatch && lengthMatch && colorMatch;
      card.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // Update count
    const counter = document.getElementById('hsCount');
    if (counter) {
      counter.textContent = visibleCount + (visibleCount === 1 ? ' hairstyle' : ' hairstyles');
    }

    // Show/hide empty state
    if (emptyState && grid) {
      const hasCards = allCards.length > 0;
      const noResults = visibleCount === 0 && hasCards;
      emptyState.style.display = noResults ? '' : 'none';
      grid.style.display = hasCards ? '' : 'none';
    }
  }

  /* ---- Reset filters (exposed globally for the Reset button) ---- */
  window.resetFilters = function() {
    activeFilters = { type: 'all', length: 'all', color: 'all' };
    filterBtns.forEach(btn => btn.classList.remove('active'));
    // Activate the "All" buttons for each filter group
    document.querySelectorAll('.filter-cat[data-value="all"]').forEach(btn => btn.classList.add('active'));
    applyFilters();
    // Also clear search input if it has text
    if (searchInput) {
      searchInput.value = '';
      // Re-run search to show all
      if (searchInput.dispatchEvent) {
        searchInput.dispatchEvent(new Event('input'));
      }
    }
  };

  /* ---- Attach click events to filter buttons ---- */
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const filterType = this.getAttribute('data-filter');
      const filterValue = this.getAttribute('data-value');

      // Update active state for this filter group
      activeFilters[filterType] = filterValue;

      // Update button styles: only buttons with the same filter type get toggled
      filterBtns.forEach(b => {
        if (b.getAttribute('data-filter') === filterType) {
          b.classList.remove('active');
        }
      });
      this.classList.add('active');

      applyFilters();
    });
  });

  /* ---- Search input (name filter) ---- */
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const q = searchInput.value.trim().toLowerCase();
      allCards.forEach(card => {
        const name = (card.querySelector('.wcard__name')?.textContent || '').toLowerCase();
        // Only hide if search doesn't match AND card is already visible from filters
        const isFilterVisible = card.style.display !== 'none';
        const nameMatches = !q || name.includes(q);
        if (isFilterVisible) {
          card.style.display = nameMatches ? '' : 'none';
        }
        // If search is empty, just re-apply filters
        if (!q) {
          applyFilters();
        }
      });
      // Update count based on search results
      const visible = Array.from(allCards).filter(c => c.style.display !== 'none').length;
      const counter = document.getElementById('hsCount');
      if (counter) {
        counter.textContent = visible + (visible === 1 ? ' hairstyle' : ' hairstyles');
      }
    });
  }

  /* ---- Initial setup ---- */
  // Set default active buttons
  document.querySelectorAll('.filter-cat[data-value="all"]').forEach(btn => btn.classList.add('active'));

  // Hide empty state initially if there are cards
  if (emptyState && grid) {
    const hasCards = allCards.length > 0;
    emptyState.style.display = hasCards ? 'none' : '';
    grid.style.display = hasCards ? '' : 'none';
  }

  // Apply initial filters
  applyFilters();
});
