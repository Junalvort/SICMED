// ═══════════════════════════════════════════════════════════════════════════
// SICMED – Buscador Principal
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ═══ ELEMENTOS DEL DOM ═══
  const el = {
    input:         document.getElementById('searchInput'),
    dropdown:      document.getElementById('searchDropdown'),
    dropdownInner: document.getElementById('dropdownInner'),
    clearBtn:      document.getElementById('searchClear'),
    resultPanel:   document.getElementById('resultPanel'),
    resultTitle:   document.getElementById('resultTitle'),
    resultBody:    document.getElementById('resultBody'),
    resultClose:   document.getElementById('resultClose'),
    searchContainer: document.getElementById('searchContainer')
  };

  if (!el.input) {
    console.warn('SICMED: Buscador no encontrado en esta página');
    return;
  }

  const state = { focusedIdx: -1, currentResults: [], lastQuery: '' };
  const config = { minChars: 2, maxDropdownResults: 10 };

  const PRIORITY_LABELS = {
    P0:  '⬤ P0 – Urgencia inmediata',
    P1:  '⬤ P1 – Alta prioridad (< 30 días)',
    P2:  '⬤ P2 – Normal (< 6 meses)',
    GES: '⬤ GES – Garantía Explícita en Salud'
  };

  // ═══════════════════════════════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════════════════════════════

  function escapeHTML(str) {
    if (window.escapeHTML) return window.escapeHTML(str);
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Convierte saltos de línea en <br> manteniendo seguridad
  function formatMultiline(str) {
    if (!str) return '–';
    return escapeHTML(str).replace(/\n/g, '<br>');
  }

  function highlightText(text, query) {
    if (!query) return escapeHTML(text);
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escapeHTML(text).replace(
      new RegExp(`(${escaped})`, 'gi'),
      '<mark style="background:rgba(58,134,200,0.20);color:var(--blue-700);border-radius:2px;padding:0 1px;">$1</mark>'
    );
  }

  function closeDropdown() {
    el.dropdown.classList.remove('open');
    state.focusedIdx = -1;
  }

  function updateFocus(items) {
    items.forEach((e, i) => e.classList.toggle('focused', i === state.focusedIdx));
  }

  function clearPreviousResults() {
    el.dropdownInner.innerHTML = '';
    el.resultBody.innerHTML   = '';
    state.focusedIdx    = -1;
    state.currentResults = [];
  }

  // ═══════════════════════════════════════════════════════════════════
  // EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════════════

  function init() {
    el.input.addEventListener('input',   handleInput);
    el.input.addEventListener('keydown', handleKeyDown);
    el.input.addEventListener('click',   clearSearchOnClick);
    el.clearBtn.addEventListener('click', clearSearch);

    if (el.resultClose) {
      el.resultClose.addEventListener('click', () => { el.resultPanel.hidden = true; });
    }

    document.addEventListener('click', (e) => {
      if (el.searchContainer && !el.searchContainer.contains(e.target)) closeDropdown();
    });

    console.log('✓ Buscador SICMED iniciado');
  }

  function handleInput() {
    const query = el.input.value.trim();
    el.clearBtn.classList.toggle('visible', query.length > 0);

    if (query.length < config.minChars) { closeDropdown(); return; }

    clearPreviousResults();
    state.currentResults = window.searchDB ? window.searchDB(query) : [];
    state.lastQuery = query;

    renderDropdown(state.currentResults, query);
  }

  function handleKeyDown(e) {
    const items = el.dropdownInner.querySelectorAll('.dd-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      state.focusedIdx = Math.min(state.focusedIdx + 1, items.length - 1);
      updateFocus(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      state.focusedIdx = Math.max(state.focusedIdx - 1, 0);
      updateFocus(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (state.focusedIdx >= 0 && state.currentResults[state.focusedIdx]) {
        selectResult(state.currentResults[state.focusedIdx]);
      } else {
        doSearch();
      }
    } else if (e.key === 'Escape') {
      closeDropdown();
    }
  }

  function clearSearchOnClick() {
    if (el.resultPanel && !el.resultPanel.hidden) el.resultPanel.hidden = true;
  }

  function clearSearch() {
    el.input.value = '';
    el.clearBtn.classList.remove('visible');
    closeDropdown();
    clearPreviousResults();
    if (el.resultPanel) el.resultPanel.hidden = true;
  }

  // ═══════════════════════════════════════════════════════════════════
  // DROPDOWN
  // ═══════════════════════════════════════════════════════════════════

  function renderDropdown(results, query) {
    el.dropdownInner.innerHTML = '';
    state.focusedIdx = -1;

    if (!results.length) {
      el.dropdownInner.innerHTML =
        `<div class="dd-empty">Sin resultados para <strong>${escapeHTML(query)}</strong></div>`;
      el.dropdown.classList.add('open');
      return;
    }

    results.slice(0, config.maxDropdownResults).forEach((result, index) => {
      const div = document.createElement('div');
      div.className = 'dd-item';
      const espShort = result.especialidad ? result.especialidad.split(' ')[0] : '';
      div.innerHTML = `
        <span class="dd-cie">${escapeHTML(result.cie10)}</span>
        <span class="dd-nombre">${highlightText(result.nombre, query)}</span>
        <span class="dd-espec">${escapeHTML(espShort)}</span>
        <span class="badge-urgencia ${result.prioridad}">${escapeHTML(result.prioridad)}</span>
      `;
      div.addEventListener('mouseenter', () => {
        state.focusedIdx = index;
        updateFocus(el.dropdownInner.querySelectorAll('.dd-item'));
      });
      div.addEventListener('click', () => selectResult(result));
      el.dropdownInner.appendChild(div);
    });

    el.dropdown.classList.add('open');
  }

  // ═══════════════════════════════════════════════════════════════════
  // SELECCIÓN Y PANEL DE RESULTADO
  // ═══════════════════════════════════════════════════════════════════

  function selectResult(result) {
    el.input.value = `${result.cie10} – ${result.nombre}`;
    el.clearBtn.classList.add('visible');
    closeDropdown();
    showResult(result);
  }

  function doSearch() {
    const query = el.input.value.trim();
    if (!query) return;
    const results = window.searchDB ? window.searchDB(query) : [];
    if (results.length) {
      showResult(results[0], results.slice(1));
    } else {
      showNoResult(query);
    }
    closeDropdown();
  }

  // Construye una fila del panel de resultado
  function field(label, valueHTML, full = false) {
    return `
      <div class="result-field${full ? ' full' : ''}">
        <span class="result-label">${label}</span>
        <span class="result-value">${valueHTML}</span>
      </div>`;
  }

  function showResult(result, others = []) {
    clearPreviousResults();

    el.resultTitle.textContent = `${result.cie10} – ${result.nombre}`;

    // Notas (si existen) - con soporte multilínea
    const notasHTML = result.notas
      ? `<div class="result-notas full">💡 ${formatMultiline(result.notas)}</div>`
      : '';

    // Otros resultados relacionados
    let othersHTML = '';
    if (others && others.length) {
      const list = others.slice(0, 4).map(o =>
        `<strong style="color:var(--blue-500)">${escapeHTML(o.cie10)}</strong> ${escapeHTML(o.nombre)}`
      ).join(' &bull; ');
      othersHTML = `
        <div style="padding:12px 20px;font-size:.82rem;color:var(--text-muted);
                    background:var(--gray-50);border-top:1px solid var(--gray-200)">
          También: ${list}
        </div>`;
    }

    // ── Botón de flujograma (si el diagnóstico tiene uno asociado) ──────
    const flujoId = result.flujo_id;
    const flujoBtn = flujoId
      ? `<div style="padding:14px 20px;border-top:1px solid var(--gray-200);background:rgba(58,134,200,.04)">
           <button id="flujoLaunchBtn"
             style="display:inline-flex;align-items:center;gap:10px;background:rgba(58,134,200,.12);
                    border:1.5px solid var(--blue-200);border-radius:30px;padding:10px 22px;
                    font-family:'DM Sans',sans-serif;font-size:.875rem;font-weight:600;
                    color:var(--blue-700);cursor:pointer;transition:all .18s"
             onmouseover="this.style.background='rgba(58,134,200,.22)'"
             onmouseout="this.style.background='rgba(58,134,200,.12)'">
             🌿 Iniciar algoritmo clínico
           </button>
         </div>`
      : '';

    el.resultBody.innerHTML = `
      <div class="result-card">
        ${field('Código CIE-10',
          `<span style="font-family:'Sora',sans-serif;font-weight:700;font-size:1.2rem;color:var(--blue-700)">
            ${escapeHTML(result.cie10)}
          </span>`)}
        ${field('Especialidad', escapeHTML(result.especialidad))}
        ${field('Diagnóstico',  escapeHTML(result.nombre), true)}
        ${field('Destino derivación', formatMultiline(result.destino || '–'))}
        ${field('Prioridad',
          `<span class="badge-urgencia ${result.prioridad}">
            ${PRIORITY_LABELS[result.prioridad] || escapeHTML(result.prioridad)}
          </span>`)}
        ${field('Criterios de derivación', formatMultiline(result.criterios || '–'), true)}
        ${field('Exámenes mínimos (EMBD)',
          `<span style="color:var(--blue-700)">${formatMultiline(result.examenes || '–')}</span>`, true)}
        ${notasHTML}
      </div>
      ${flujoBtn}
      ${othersHTML}
    `;

    // Conectar el botón de flujograma si existe
    if (flujoId) {
      const btn = document.getElementById('flujoLaunchBtn');
      if (btn) {
        btn.addEventListener('click', () => launchFlujo(result, flujoId));
      }
    }

    el.resultPanel.hidden = false;

    if (window.smoothScrollTo) {
      window.smoothScrollTo(el.resultPanel, 'nearest');
    }
  }

  // ── Lanzar el modal interactivo del flujograma ─────────────────────────
  async function launchFlujo(result, flujoId) {
    // Mostrar overlay de carga
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:900;background:rgba(15,46,90,.35);'
      + 'backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px';

    const box = document.createElement('div');
    box.style.cssText = 'background:rgba(255,255,255,.94);backdrop-filter:blur(24px) saturate(200%);'
      + 'border:1.5px solid var(--glass-border);border-radius:var(--r-xl);width:100%;max-width:560px;'
      + 'max-height:88vh;overflow-y:auto;padding:28px;'
      + 'box-shadow:0 24px 60px rgba(15,46,90,.22);'
      + 'transform:scale(.97);transition:transform .25s var(--ease,ease)';

    // Header del modal
    const headerEl = document.createElement('div');
    headerEl.style.cssText = 'display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px';
    headerEl.innerHTML = `
      <div>
        <div style="font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--blue-500);margin-bottom:4px">
          🌿 Algoritmo clínico
        </div>
        <div style="font-family:'Sora',sans-serif;font-size:1rem;font-weight:700;color:var(--blue-900);line-height:1.3">
          ${escapeHTML(result.cie10)} – ${escapeHTML(result.nombre)}
        </div>
      </div>
      <button id="flujoModalClose" style="background:var(--gray-100);border:none;width:34px;height:34px;
        border-radius:50%;display:flex;align-items:center;justify-content:center;
        cursor:pointer;flex-shrink:0;color:var(--gray-600);transition:background .15s;margin-left:12px"
        onmouseover="this.style.background='rgba(58,134,200,.12)'"
        onmouseout="this.style.background='var(--gray-100)'">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="14" height="14">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>`;
    box.appendChild(headerEl);

    // Spinner mientras carga
    const spinner = document.createElement('div');
    spinner.style.cssText = 'text-align:center;padding:36px;color:var(--text-muted);font-size:.9rem';
    spinner.innerHTML = '<div style="font-size:1.8rem;margin-bottom:10px">⏳</div>Cargando algoritmo…';
    box.appendChild(spinner);

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Animación de entrada
    requestAnimationFrame(() => { box.style.transform = 'scale(1)'; });

    // Cerrar overlay
    const closeOverlay = () => { document.body.removeChild(overlay); };
    document.getElementById('flujoModalClose').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { closeOverlay(); document.removeEventListener('keydown', onEsc); }
    });

    // Cargar flujograma de Firestore
    let flujoData = null;
    if (window.FLUJO_get) {
      flujoData = await window.FLUJO_get(flujoId).catch(() => null);
    }

    box.removeChild(spinner);

    if (!flujoData) {
      const errEl = document.createElement('div');
      errEl.style.cssText = 'text-align:center;padding:28px;color:var(--text-muted);font-size:.88rem;line-height:1.6';
      errEl.innerHTML = '⚠️ No se pudo cargar el algoritmo clínico.<br>Verifica la conexión e intenta nuevamente.';
      box.appendChild(errEl);
      return;
    }

    // Asegurar que flujograma.js esté cargado
    if (!window.FLUJO_run) {
      await new Promise((resolve) => {
        const s = document.createElement('script');
        s.src = 'flujograma.js';
        s.onload = resolve;
        document.body.appendChild(s);
      });
    }

    const motorDiv = document.createElement('div');
    box.appendChild(motorDiv);
    window.FLUJO_run(flujoData, motorDiv);
  }

  function showNoResult(query) {
    clearPreviousResults();
    el.resultTitle.textContent = 'Sin resultados';
    el.resultBody.innerHTML = `
      <div class="no-result">
        No se encontró <strong>${escapeHTML(query)}</strong>.<br/>
        Intenta con otro nombre o código CIE-10.
      </div>`;
    el.resultPanel.hidden = false;
  }

  // ═══ INICIAR ═══
  init();

})();
