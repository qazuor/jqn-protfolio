/**
 * Portfolio filter script.
 * Implements WAI-ARIA Tabs pattern for desktop filter tabs
 * and syncs with mobile dropdown.
 */

function init(): void {
  const tablist = document.getElementById('filter-tabs');
  const dropdown = document.querySelector<HTMLSelectElement>('[data-filter-dropdown]');
  const grid = document.getElementById('portfolio-grid');

  if (!tablist || !grid) return;

  const tabs = Array.from(tablist.querySelectorAll<HTMLButtonElement>('[role="tab"]'));
  const items = Array.from(grid.querySelectorAll<HTMLLIElement>(':scope > li'));

  function filterItems(filterValue: string): void {
    for (const item of items) {
      const tags = item.dataset.tags ?? '';
      const visible = filterValue === 'TODOS' || tags.split(',').includes(filterValue);
      item.hidden = !visible;
    }
  }

  function activateTab(tab: HTMLButtonElement): void {
    for (const t of tabs) {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
      t.classList.remove('active');
    }

    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.classList.add('active');
    tab.focus();

    const filterValue = tab.dataset.filter ?? 'TODOS';
    filterItems(filterValue);

    if (dropdown) {
      dropdown.value = filterValue;
    }
  }

  // Tab click
  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });
  }

  // Keyboard navigation (WAI-ARIA Tabs pattern)
  tablist.addEventListener('keydown', (event: KeyboardEvent) => {
    const currentIndex = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const targetTab = tabs[newIndex];
    if (targetTab) {
      activateTab(targetTab);
    }
  });

  // Dropdown change (mobile)
  if (dropdown) {
    dropdown.addEventListener('change', () => {
      const filterValue = dropdown.value;
      filterItems(filterValue);

      // Sync tabs
      for (const tab of tabs) {
        const isMatch = tab.dataset.filter === filterValue;
        tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        tab.setAttribute('tabindex', isMatch ? '0' : '-1');
        tab.classList.toggle('active', isMatch);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
