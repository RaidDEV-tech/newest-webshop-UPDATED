// Toast Notification System
class Toast {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  static show(title, message = '', type = 'info', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <p class="toast-title">${title}</p>
        ${message ? `<p class="toast-message">${message}</p>` : ''}
      </div>
      <button class="toast-close">×</button>
    `;

    this.container.appendChild(toast);

    const closeBtn = toast.querySelector('.toast-close');
    const remove = () => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', remove);

    if (duration > 0) {
      setTimeout(remove, duration);
    }

    return toast;
  }

  static success(title, message = '', duration = 3000) {
    return this.show(title, message, 'success', duration);
  }

  static error(title, message = '', duration = 4000) {
    return this.show(title, message, 'error', duration);
  }

  static warning(title, message = '', duration = 3500) {
    return this.show(title, message, 'error', duration);
  }

  static info(title, message = '', duration = 3000) {
    return this.show(title, message, 'info', duration);
  }
}

// Theme Manager
class ThemeManager {
  static init() {
    const saved = localStorage.getItem('theme') || 'dark';
    this.setTheme(saved);
    this.createToggle();
  }

  static createToggle() {
    if (document.querySelector('.theme-toggle')) return;

    const toggle = document.createElement('button');
    toggle.className = 'theme-toggle';
    toggle.innerHTML = '🌙';
    toggle.title = 'Toggle Dark/Light Mode';
    toggle.onclick = () => this.toggle();
    document.body.appendChild(toggle);
  }

  static setTheme(theme) {
    const toggle = document.querySelector('.theme-toggle');
    if (theme === 'light') {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      if (toggle) toggle.innerHTML = '☀️';
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      if (toggle) toggle.innerHTML = '🌙';
    }
  }

  static toggle() {
    const isDark = document.body.classList.contains('light-mode');
    this.setTheme(isDark ? 'dark' : 'light');
  }

  static isDarkMode() {
    return !document.body.classList.contains('light-mode');
  }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  ThemeManager.init();
});

export { Toast, ThemeManager };
