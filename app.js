// ═══════════════════════════════════════════════════════════════════════════
// SICMED – Buscador Principal Refactorizado
// Búsqueda inteligente con limpieza automática de resultados previos
// ═══════════════════════════════════════════════════════════════════════════

(function() {
  'use strict';

  // ═══ ELEMENTOS DEL DOM ═══
  const elements = {
    input: document.getElementById('searchInput'),
    dropdown: document.getElementById('searchDropdown'),
    dropdownInner: document.getElementById('dropdownInner'),
    clearBtn: document.getElementById('searchClear'),
    resultPanel: document.getElementById('resultPanel'),
    resultTitle: document.getElementById('resultTitle'),
    resultBody: document.getElementById('resultBody'),
    resultClose: document.getElementById('resultClose'),
    searchContainer: document.getElementById('searchContainer')
  };

  // Verificar que existan los elementos necesarios
  if (!elements.input) {
    console.warn('SICMED: Buscador no encontrado en esta página');
    return;
  }

  // ═══ ESTADO DEL BUSCADOR ═══
  let state = {
    focusedIdx: -1,
    currentResults: [],
    lastQuery: ''
  };

  // ═══ CONFIGURACIÓN ═══
  const config = {
    minChars: 2,
    maxDropdownResults: 10
  };

  // ═══════════════════════════════════════════════════════════════════
  // INICIALIZACIÓN
  // ═══════════════════════════════════════════════════════════════════

  function init() {
    attachEventListeners();
    console.log('✓ Buscador SICMED iniciado');
  }

  // ═══════════════════════════════════════════════════════════════════
  // EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════════

  function attachEventListeners() {
    // Input con búsqueda en tiempo real
    elements.input.addEventListener('input', handleInput);
    elements.input.addEventListener('keydown', handleKeyDown);
    elements.input.addEventListener('click', clearSearchOnClick);
    
    // Botón limpiar
    elements.clearBtn.addEventListener('click', clearSearch);
    
    // Cerrar panel de resultados
    if (elements.resultClose) {
      elements.resultClose.addEventListener('click', () => {
        elements.resultPanel.hidden = true;
      });
    }
    
    // Cerrar dropdown al hacer click fuera
    document.addEventListener('click', (e) => {
      if (elements.searchContainer && !elements.searchContainer.contains(e.target)) {
        closeDropdown();
      }
    });
  }

  // ═══════════════════════════════════════════════════════════════════
  // HANDLERS DE EVENTOS
  // ═══════════════════════════════════════════════════════════════════

  function handleInput() {
    const query = elements.input.value.trim();
    
    // Mostrar/ocultar botón de limpiar
    elements.clearBtn.classList.toggle('visible', query.length > 0);
    
    // Si la búsqueda es muy corta, cerrar dropdown
    if (query.length < config.minChars) {
      closeDropdown();
      return;
    }

    // CRÍTICO: Limpiar resultados previos antes de mostrar nuevos
    clearPreviousResults();
    
    // Buscar en la base de datos
    state.currentResults = window.searchDB ? window.searchDB(query) : [];
    state.lastQuery = query;
    
    // Renderizar dropdown
    renderDropdown(state.currentResults, query);
  }

  function handleKeyDown(e) {
    if (!elements.dropdown.classList.contains('open')) return;
    
    const items = elements.dropdownInner.querySelectorAll('.dd-item');
    
    switch(e.key) {
      case 'ArrowDown':
        e.preventDefault();
        state.focusedIdx = Math.min(state.focusedIdx + 1, items.length - 1);
        updateFocus(items);
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        state.focusedIdx = Math.max(state.focusedIdx - 1, 0);
        updateFocus(items);
        break;
        
      case 'Enter':
        e.preventDefault();
        if (state.focusedIdx >= 0 && state.focusedIdx < state.currentResults.length) {
          selectResult(state.currentResults[state.focusedIdx]);
        } else {
          doSearch();
        }
        break;
        
      case 'Escape':
        closeDropdown();
        break;
    }
  }

  // ═══════════════════════════════════════════════════════════════════
  // LIMPIEZA DE BÚSQUEDAS PREVIAS
  // ═══════════════════════════════════════════════════════════════════

  /**
   * Limpia completamente los resultados anteriores
   * Evita acumulación visual y duplicación
   */
  function clearPreviousResults() {
    // Limpiar dropdown
    if (elements.dropdownInner) {
      elements.dropdownInner.innerHTML = '';
    }
    
    // Limpiar panel de resultados
    if (elements.resultBody) {
      elements.resultBody.innerHTML = '';
    }
    
    // Resetear estado
    state.focusedIdx = -1;
    state.currentResults = [];
  }

  /**
   * Limpieza completa del buscador
   */
  function clearSearch() {
    elements.input.value = '';
    elements.clearBtn.classList.remove('visible');
    closeDropdown();
    
    // Ocultar panel de resultados
    if (elements.resultPanel) {
      elements.resultPanel.hidden = true;
    }
    
    // Limpiar todo
    clearPreviousResults();
    
    // Focus en input
    elements.input.focus();
    
    // Scroll suave hacia arriba al buscador
    if (window.smoothScrollTo) {
      window.smoothScrollTo(elements.input);
    }
  }

  function clearSearchOnClick() {
    const query = elements.input.value.trim();
    const resultsPanelVisible = elements.resultPanel && !elements.resultPanel.hidden;
    
    // Limpiar si hay texto O si hay un panel de resultados abierto
    if (query.length > 0 || resultsPanelVisible) {
      clearSearch();
    }
  }

  // ═══════════════════════════════════════════════════════════
  // RENDERIZADO DE DROPDOWN
  // ═══════════════════════════════════════════════════════════════════

  function renderDropdown(results, query) {
    elements.dropdownInner.innerHTML = '';
    state.focusedIdx = -1;
    
    // Sin resultados
    if (!results.length) {
      elements.dropdownInner.innerHTML = 
        `<div class="dd-empty">Sin resultados para <strong>${escapeHTML(query)}</strong></div>`;
      elements.dropdown.classList.add('open');
      return;
    }
    
    // Limitar resultados mostrados
    const limitedResults = results.slice(0, config.maxDropdownResults);
    
    // Renderizar cada resultado
    limitedResults.forEach((result, index) => {
      const item = createDropdownItem(result, query, index);
      elements.dropdownInner.appendChild(item);
    });
    
    elements.dropdown.classList.add('open');
  }

  function createDropdownItem(result, query, index) {
    const div = document.createElement('div');
    div.className = 'dd-item';
    
    // Abreviar especialidad (primera palabra)
    const espShort = result.especialidad ? result.especialidad.split(' ')[0] : '';
    
    div.innerHTML = `
      <span class="dd-cie">${escapeHTML(result.cie10)}</span>
      <span class="dd-nombre">${highlightText(result.nombre, query)}</span>
      <span class="dd-espec">${escapeHTML(espShort)}</span>
      <span class="badge-urgencia ${result.prioridad}">${escapeHTML(result.prioridad)}</span>
    `;
    
    // Event listeners
    div.addEventListener('mouseenter', () => {
      state.focusedIdx = index;
      updateFocus(elements.dropdownInner.querySelectorAll('.dd-item'));
    });
    
    div.addEventListener('click', () => {
      selectResult(result);
    });
    
    return div;
  }

  // ═══════════════════════════════════════════════════════════════════
  // SELECCIÓN Y BÚSQUEDA
  // ═══════════════════════════════════════════════════════════════════

  function selectResult(result) {
    elements.input.value = `${result.cie10} – ${result.nombre}`;
    elements.clearBtn.classList.add('visible');
    closeDropdown();
    showResult(result);
  }

  function doSearch() {
    const query = elements.input.value.trim();
    if (!query) return;
    
    const results = window.searchDB ? window.searchDB(query) : [];
    
    if (results.length >= 1) {
      showResult(results[0], results.slice(1));
    } else {
      showNoResult(query);
    }
    
    closeDropdown();
  }

  // ═══════════════════════════════════════════════════════════════════
  // PANEL DE RESULTADOS
  // ═══════════════════════════════════════════════════════════════════

  const PRIORITY_LABELS = {
    P0: '⬤ P0 – Urgencia inmediata',
    P1: '⬤ P1 – Alta prioridad (< 30 días)',
    P2: '⬤ P2 – Normal (< 6 meses)',
    GES: '⬤ GES – Garantía Explícita en Salud'
  };

  function showResult(result, others = []) {
    // CRÍTICO: Limpiar resultados anteriores antes de mostrar nuevos
    clearPreviousResults();
    
    elements.resultTitle.textContent = `${result.cie10} – ${result.nombre}`;
    
    // Notas (si existen)
    const notasHTML = result.notas
      ? `<div class="result-notas full">💡 ${escapeHTML(result.notas)}</div>`
      : '';
    
    // Otros resultados relacionados
    let othersHTML = '';
    if (others && others.length) {
      const othersList = others.slice(0, 4).map(o => 
        `<strong style="color:var(--blue-500)">${escapeHTML(o.cie10)}</strong> ${escapeHTML(o.nombre)}`
      ).join(' &bull; ');
      
      othersHTML = `
        <div style="padding:12px 20px;font-size:.82rem;color:var(--text-muted);
                    background:var(--gray-50);border-top:1px solid var(--gray-200)">
          También: ${othersList}
        </div>`;
    }
    
    // Renderizar resultado
    elements.resultBody.innerHTML = `
      <div class="result-card">
        ${field('Código CIE-10', 
          `<span style="font-family:'Sora',sans-serif;font-weight:700;font-size:1.2rem;color:var(--blue-700)">
            ${escapeHTML(result.cie10)}
          </span>`)}
        ${field('Especialidad', escapeHTML(result.especialidad))}
        ${field('Diagnóstico', escapeHTML(result.nombre), true)}
        ${field('Destino derivación', escapeHTML(result.destino || '–'))}
        ${field('Prioridad', 
          `<span class="badge-urgencia ${result.prioridad}">
            ${PRIORITY_LABELS[result.prioridad] || escapeHTML(result.prioridad)}
          </span>`)}
        ${field('Criterios de derivación', escapeHTML(result.criterios || '–'), true)}
        ${field('Exámenes mínimos (EMBD)', 
          `<span style="color:var(--blue-700)">${escapeHTML(result.examenes || '–')}</span>`, true)}
        ${notasHTML}
      </div>
      ${othersHTML}
    `;
    
    elements.resultPanel.hidden = false;
    
    // Scroll suave al panel
    if (window.smoothScrollTo) {
      window.smoothScrollTo(elements.resultPanel);
    }
  }

  function field(label, valueHTML, full = false) {
    return `
      <div class="result-field${full ? ' full' : ''}">
        <span class="result-label">${label}</span>
        <span class="result-value">${valueHTML}</span>
      </div>
    `;
  }

  function showNoResult(query) {
    clearPreviousResults();
    
    elements.resultTitle.textContent = 'Sin resultados';
    elements.resultBody.innerHTML = `
      <div class="no-result">
        No se encontró <strong>${escapeHTML(query)}</strong>.<br/>
        Intenta con otro nombre o código CIE-10.
      </div>
    `;
    elements.resultPanel.hidden = false;
  }

  // ═══════════════════════════════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════════════════════════════

  function updateFocus(items) {
    items.forEach((el, i) => {
      el.classList.toggle('focused', i === state.focusedIdx);
    });
  }

  function closeDropdown() {
    elements.dropdown.classList.remove('open');
    state.focusedIdx = -1;
  }

  function highlightText(text, query) {
    if (!query) return escapeHTML(text);
    
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    return escapeHTML(text).replace(regex, 
      '<mark style="background:rgba(58,134,200,0.20);color:var(--blue-700);border-radius:2px;padding:0 1px;">$1</mark>'
    );
  }

  function escapeHTML(str) {
    if (window.escapeHTML) return window.escapeHTML(str);
    
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ═══ INICIAR BUSCADOR ═══
  init();

})();
