// MixItUp + Pagination + Filter Fix (Manual Pagination Awareness)
    // Inisialisasi MixItUp seperti biasa
    document.addEventListener("DOMContentLoaded", function () {
      const containerEl = document.querySelector('.portfolio__gallery');
  
      if (!containerEl) return;
  
      const mixer = mixitup(containerEl, {
          selectors: {
          target: '.mix'
          },
          animation: {
          duration: 300
          }
      });
  
      // Pagination settings
      const itemsPerPage = 9;
      let currentPage = 1;
  
      function getCurrentFilter() {
          const activeFilter = document.querySelector('.portfolio__filter li.active');
          return activeFilter ? activeFilter.getAttribute('data-filter') : '*';
      }
  
      function paginateItems() {
          const filter = getCurrentFilter();
          const allItems = Array.from(containerEl.querySelectorAll('.mix'));
          const filteredItems = filter === '*' ? allItems : allItems.filter(item => item.matches(filter));
  
          const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
          filteredItems.forEach((item, index) => {
          item.classList.remove('page-hide');
          if (index < (currentPage - 1) * itemsPerPage || index >= currentPage * itemsPerPage) {
              item.classList.add('page-hide');
          }
          });
  
          document.querySelectorAll('.pagination__option a.number__pagination').forEach((link, idx) => {
          link.classList.toggle('active', idx + 1 === currentPage);
          });
      }
  
      // Update on filter click
      document.querySelectorAll('.portfolio__filter li').forEach(btn => {
          btn.addEventListener('click', () => {
          currentPage = 1;
          setTimeout(paginateItems, 350); // delay to wait for mixitup to re-render
          });
      });
  
      // Pagination click events
      document.querySelectorAll('.pagination__option a.number__pagination').forEach((link, idx) => {
          link.addEventListener('click', (e) => {
          e.preventDefault();
          currentPage = idx + 1;
          paginateItems();
          });
      });
  
      document.querySelector('.pagination__option .left__arrow')?.addEventListener('click', (e) => {
          e.preventDefault();
          if (currentPage > 1) {
          currentPage--;
          paginateItems();
          }
      });
  
      document.querySelector('.pagination__option .right__arrow')?.addEventListener('click', (e) => {
          e.preventDefault();
          const filter = getCurrentFilter();
          const filteredItems = filter === '*' 
          ? containerEl.querySelectorAll('.mix')
          : containerEl.querySelectorAll(filter);
          const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
          if (currentPage < totalPages) {
          currentPage++;
          paginateItems();
          }
      });
  
      // First run
      setTimeout(paginateItems, 400);
      });