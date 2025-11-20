// Custom Admin Navigation Injector
(function() {
  'use strict';

  const navHTML = `
    <div id="custom-admin-nav-root">
      <!-- Logo Section -->
      <div class="custom-nav-logo">
        <a href="/admin" class="custom-nav-logo-link">
          <span class="custom-nav-logo-icon">🚀</span>
          <span class="custom-nav-logo-text">Yarqa Tech</span>
        </a>
      </div>

      <!-- Dashboard Link -->
      <a href="/admin" class="custom-nav-dashboard custom-nav-animate">
        <span style="font-size: 1.2rem;">📊</span>
        <span>Dashboard</span>
      </a>

      <!-- Navigation Groups -->
      <div class="custom-nav-groups">
        <!-- Content Group -->
        <div class="custom-nav-group">
          <button class="custom-nav-group-toggle" onclick="toggleNavGroup(this)">
            <span class="custom-nav-group-icon">📝</span>
            <span class="custom-nav-group-label">Content</span>
            <span class="custom-nav-group-arrow">▼</span>
          </button>
          <div class="custom-nav-group-items">
            <a href="/admin/collections/posts" class="custom-nav-item">Posts</a>
            <a href="/admin/collections/pages" class="custom-nav-item">Pages</a>
            <a href="/admin/collections/categories" class="custom-nav-item">Categories</a>
            <a href="/admin/collections/tags" class="custom-nav-item">Tags</a>
            <a href="/admin/collections/media" class="custom-nav-item">Media</a>
          </div>
        </div>

        <!-- Users Group -->
        <div class="custom-nav-group">
          <button class="custom-nav-group-toggle" onclick="toggleNavGroup(this)">
            <span class="custom-nav-group-icon">👥</span>
            <span class="custom-nav-group-label">Users</span>
            <span class="custom-nav-group-arrow">▼</span>
          </button>
          <div class="custom-nav-group-items">
            <a href="/admin/collections/users" class="custom-nav-item">Users</a>
          </div>
        </div>

        <!-- Engagement Group -->
        <div class="custom-nav-group">
          <button class="custom-nav-group-toggle" onclick="toggleNavGroup(this)">
            <span class="custom-nav-group-icon">💬</span>
            <span class="custom-nav-group-label">Engagement</span>
            <span class="custom-nav-group-arrow">▼</span>
          </button>
          <div class="custom-nav-group-items">
            <a href="/admin/collections/comments" class="custom-nav-item">Comments</a>
            <a href="/admin/collections/bookmarks" class="custom-nav-item">Bookmarks</a>
            <a href="/admin/collections/post-reactions" class="custom-nav-item">Post Reactions</a>
          </div>
        </div>

        <!-- Analytics Group -->
        <div class="custom-nav-group">
          <button class="custom-nav-group-toggle" onclick="toggleNavGroup(this)">
            <span class="custom-nav-group-icon">📊</span>
            <span class="custom-nav-group-label">Analytics</span>
            <span class="custom-nav-group-arrow">▼</span>
          </button>
          <div class="custom-nav-group-items">
            <a href="/admin/collections/visitor-sessions" class="custom-nav-item">Visitor Sessions</a>
            <a href="/admin/collections/page-views" class="custom-nav-item">Page Views</a>
            <a href="/admin/collections/post-views" class="custom-nav-item">Post Views</a>
            <a href="/admin/collections/reading-progress" class="custom-nav-item">Reading Progress</a>
            <a href="/admin/collections/search-queries" class="custom-nav-item">Search Queries</a>
            <a href="/admin/collections/deletion-feedback" class="custom-nav-item">Deletion Feedback</a>
            <a href="/admin/collections/logout-feedback" class="custom-nav-item">Logout Feedback</a>
          </div>
        </div>

        <!-- Marketing Group -->
        <div class="custom-nav-group">
          <button class="custom-nav-group-toggle" onclick="toggleNavGroup(this)">
            <span class="custom-nav-group-icon">📧</span>
            <span class="custom-nav-group-label">Marketing</span>
            <span class="custom-nav-group-arrow">▼</span>
          </button>
          <div class="custom-nav-group-items">
            <a href="/admin/collections/newsletter-subscribers" class="custom-nav-item">Newsletter</a>
          </div>
        </div>
      </div>

      <!-- Settings -->
      <div class="custom-nav-settings">
        <a href="/admin/globals/site-settings" class="custom-nav-item">
          <span style="font-size: 1.2rem;">⚙️</span>
          <span>Settings</span>
        </a>
      </div>
    </div>
  `;

  // Toggle group function
  window.toggleNavGroup = function(button) {
    const group = button.closest('.custom-nav-group');
    group.classList.toggle('expanded');
  };

  // Highlight active link
  function highlightActiveLink() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.custom-nav-item').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
      }
    });

    // Dashboard link
    const dashboardLink = document.querySelector('.custom-nav-dashboard');
    if (dashboardLink) {
      if (currentPath === '/admin' || currentPath === '/admin/') {
        dashboardLink.classList.add('active');
      } else {
        dashboardLink.classList.remove('active');
      }
    }
  }

  // Inject navigation
  function injectNav() {
    if (document.getElementById('custom-admin-nav-root')) {
      return; // Already injected
    }

    document.body.insertAdjacentHTML('afterbegin', navHTML);
    highlightActiveLink();

    // Add animation delay for each group
    const groups = document.querySelectorAll('.custom-nav-group');
    groups.forEach((group, index) => {
      setTimeout(() => {
        group.classList.add('custom-nav-animate');
      }, 100 + index * 50);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNav);
  } else {
    injectNav();
  }

  // Re-highlight on route change (for SPA behavior)
  let lastPath = window.location.pathname;
  setInterval(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      highlightActiveLink();

      // Re-inject if nav was removed
      if (!document.getElementById('custom-admin-nav-root')) {
        injectNav();
      }
    }
  }, 500);

})();
