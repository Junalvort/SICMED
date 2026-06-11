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

  // ─── Construye la tarjeta con la información clínica completa.
  //     Se usa directamente cuando NO hay algoritmo, o como bloque
  //     que el motor inyecta al final cuando SÍ hay algoritmo.
  function buildInfoCard(result) {
    const notasHTML = result.notas
      ? `<div class="result-notas full">💡 ${formatMultiline(result.notas)}</div>`
      : '';
    return `
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
      </div>`;
  }

  function showResult(result, others = []) {
    clearPreviousResults();

    el.resultTitle.textContent = `${result.cie10} – ${result.nombre}`;

    const algoritmoId = result.flujo_id || null;
    const hasAlgoritmo = Boolean(algoritmoId);

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

    if (hasAlgoritmo) {
      // ── CON ALGORITMO ────────────────────────────────────────────────
      // Mostrar solo cabecera (CIE-10 + nombre) + botón Algoritmo.
      // La información clínica completa aparece UNA VEZ que el usuario
      // complete el algoritmo (el motor la inyecta al terminar).
      el.resultBody.innerHTML = `
        <div class="result-card result-card--no-bottom-radius">
          ${field('Código CIE-10',
            `<span style="font-family:'Sora',sans-serif;font-weight:700;font-size:1.2rem;color:var(--blue-700)">
              ${escapeHTML(result.cie10)}
            </span>`)}
          ${field('Especialidad', escapeHTML(result.especialidad))}
          ${field('Diagnóstico',  escapeHTML(result.nombre), true)}
          ${field('Prioridad',
            `<span class="badge-urgencia ${result.prioridad}">
              ${PRIORITY_LABELS[result.prioridad] || escapeHTML(result.prioridad)}
            </span>`)}
        </div>
        <div class="result-flujo-trigger">
          <button class="result-flujo-btn" id="algoritmoLaunchBtn">Algoritmo</button>
        </div>
        <div class="result-flujo-inline" id="algoritmoZone" hidden></div>
        ${othersHTML}
      `;

      const btn  = document.getElementById('algoritmoLaunchBtn');
      const zone = document.getElementById('algoritmoZone');
      if (btn && zone) {
        btn.addEventListener('click', () =>
          toggleAlgoritmo(result, algoritmoId, btn, zone)
        );
      }

    } else {
      // ── SIN ALGORITMO ────────────────────────────────────────────────
      // Mostrar directamente toda la información clínica.
      el.resultBody.innerHTML = `
        ${buildInfoCard(result)}
        ${othersHTML}
      `;
    }

    el.resultPanel.hidden = false;
    if (window.smoothScrollTo) {
      window.smoothScrollTo(el.resultPanel, 'nearest');
    }
  }

  // ── Toggle del algoritmo inline ───────────────────────────────────────
  // Cache para evitar lecturas repetidas a Firestore
  const _algoritmoCache = {};

  async function toggleAlgoritmo(result, algoritmoId, btn, zone) {
    // Cerrar si ya está abierto
    if (!zone.hidden) {
      zone.hidden = true;
      btn.classList.remove('result-flujo-btn--open');
      return;
    }

    // Abrir
    btn.classList.add('result-flujo-btn--open');

    // Si ya se montó antes, solo mostrar
    if (zone.dataset.loaded === '1') {
      zone.hidden = false;
      return;
    }

    // Cargar flujograma.js si aún no está disponible
    if (!window.FLUJO_run) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'flujograma.js';
        s.onload  = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      }).catch(() => null);
    }

    // Obtener definición del algoritmo (cache en memoria)
    if (!_algoritmoCache[algoritmoId] && window.FLUJO_get) {
      _algoritmoCache[algoritmoId] = await window.FLUJO_get(algoritmoId).catch(() => null);
    }
    const algoritmoData = _algoritmoCache[algoritmoId];

    zone.hidden = false;
    zone.innerHTML = '';

    if (!algoritmoData) {
      zone.innerHTML = `<div class="result-flujo-error">
        No se pudo cargar el algoritmo. Verifica la conexión e intenta de nuevo.
      </div>`;
      return;
    }

    zone.dataset.loaded = '1';

    // Ejecutar el motor pasando la información clínica del diagnóstico
    // para que sea mostrada al usuario al completar el algoritmo.
    window.FLUJO_run(algoritmoData, zone, result);
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
