// Admin sidebar customization script
(function() {
  'use strict';

  // Function to collapse all nav groups on load
  function collapseAllGroups() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', collapseAllGroups);
      return;
    }

    // Find all nav groups
    const navGroups = document.querySelectorAll('.nav .nav-group');

    navGroups.forEach(group => {
      // Remove the open class if it exists
      group.classList.remove('nav-group--open');

      // Find the content div and collapse it
      const content = group.querySelector('.nav-group__content');
      if (content) {
        content.style.maxHeight = '0';
        content.style.overflow = 'hidden';
      }
    });

    console.log('Admin sidebar groups collapsed on load');
  }

  // Function to setup toggle functionality
  function setupToggleHandlers() {
    document.addEventListener('click', function(e) {
      const toggle = e.target.closest('.nav-group__toggle');
      if (!toggle) return;

      const navGroup = toggle.closest('.nav-group');
      if (!navGroup) return;

      e.preventDefault();
      e.stopPropagation();

      // Toggle the open class
      navGroup.classList.toggle('nav-group--open');

      // Get the content element
      const content = navGroup.querySelector('.nav-group__content');
      if (content) {
        if (navGroup.classList.contains('nav-group--open')) {
          content.style.maxHeight = '2000px';
        } else {
          content.style.maxHeight = '0';
        }
      }
    });
  }

  // Initialize
  collapseAllGroups();
  setupToggleHandlers();

  // Also run after any route changes (for SPA behavior)
  let lastPath = window.location.pathname;
  setInterval(function() {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      setTimeout(collapseAllGroups, 100);
    }
  }, 500);

})();
