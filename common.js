// ═══════════════════════════════════════════════════════════════════════════
// SICMED – Módulo Común de Scripts Reutilizables
// Funciones compartidas entre todas las páginas para reducir duplicación
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Inicialización del tema (dark/light mode)
 * Se ejecuta inmediatamente para evitar flash visual
 */
(function initTheme() {
  const saved = localStorage.getItem('sicmed_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches;
  const isDark = saved ? saved === 'dark' : prefersDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
})();

/**
 * Inicialización de componentes globales después del DOM ready
 */
document.addEventListener('DOMContentLoaded', function() {
  initThemeToggle();
  initHamburgerMenu();
});

/**
 * Toggle de tema claro/oscuro
 */
function initThemeToggle() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;
  
  toggle.addEventListener('click', function() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('sicmed_theme', newTheme);
  });
}

/**
 * Menú hamburguesa con soporte táctil completo
 * Funciona en TODAS las páginas sin conflictos
 */
function initHamburgerMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('hamMenu');
  
  if (!btn || !menu) return;

  // Toggle del menú
  function toggleMenu(e) {
    if (e) e.stopPropagation();
    const isOpen = menu.classList.contains('open');
    menu.classList.toggle('open', !isOpen);
    btn.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen);
  }

  // Cerrar el menú
  function closeMenu() {
    menu.classList.remove('open');
    btn.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  // Click en botón
  btn.addEventListener('click', toggleMenu);

  // Touch en botón (móvil)
  btn.addEventListener('touchend', function(e) {
    e.preventDefault();
    toggleMenu();
  }, { passive: false });

  // Click fuera del menú
  document.addEventListener('click', function(e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  });

  // Touch fuera del menú
  document.addEventListener('touchend', function(e) {
    if (!menu.contains(e.target) && !btn.contains(e.target)) {
      closeMenu();
    }
  }, { passive: true });

  // Cerrar con tecla Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * Utilidad: Escapar HTML para prevenir XSS
 */
window.escapeHTML = function(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Utilidad: Formatear fecha a español
 */
window.formatDate = function(dateStr) {
  if (!dateStr) return '–';
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('es-CL', options);
};

/**
 * Utilidad: Debounce para optimizar búsquedas
 */
window.debounce = function(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Utilidad: Smooth scroll a elemento
 */
window.smoothScrollTo = function(element, block = 'nearest') {
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: block });
};

// Exportar indicador de que common.js está cargado
window.SICMED_COMMON_LOADED = true;
