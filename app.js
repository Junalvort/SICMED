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

  // ─── Construye el HTML estático del resultado (sin notas, sin bordes bajos
  //     cuando hay flujograma) y lo inserta en el DOM.
  function buildStaticCard(result, hasFlujo) {
    // Cuando hay flujograma, el result-card NO debe terminar visualmente
    // (sin border-radius inferior) porque continúa con el bloque del flujograma.
    const cardClass = hasFlujo ? 'result-card result-card--no-bottom-radius' : 'result-card';

    return `
      <div class="${cardClass}">
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
      </div>`;
  }

  function showResult(result, others = []) {
    clearPreviousResults();

    el.resultTitle.textContent = `${result.cie10} – ${result.nombre}`;

    const flujoId  = result.flujo_id || null;
    const hasFlujo = Boolean(flujoId);

    // Notas: cuando hay flujograma pierden el border-radius superior
    // para ser continuación visual del bloque desplegado del flujograma.
    const notasClass = hasFlujo
      ? 'result-notas full result-notas--after-flujo'
      : 'result-notas full';
    const notasHTML = result.notas
      ? `<div class="${notasClass}">💡 ${formatMultiline(result.notas)}</div>`
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

    // Orden visual:
    //   1. Tarjeta estática (campos CIE-10, especialidad, criterios…)
    //   2. Botón "Flujograma" centrado  [solo si hay flujo_id]
    //   3. Zona de expansión inline del flujograma  [inicialmente vacía]
    //   4. Notas importantes
    //   5. Otros resultados relacionados
    el.resultBody.innerHTML = `
      ${buildStaticCard(result, hasFlujo)}
      ${hasFlujo ? `
        <div class="result-flujo-trigger">
          <button class="result-flujo-btn" id="flujoLaunchBtn">Flujograma</button>
        </div>
        <div class="result-flujo-inline" id="flujoInlineZone" hidden></div>
      ` : ''}
      ${notasHTML}
      ${othersHTML}
    `;

    // Conectar el botón de flujograma (despliegue inline)
    if (hasFlujo) {
      const btn  = document.getElementById('flujoLaunchBtn');
      const zone = document.getElementById('flujoInlineZone');
      if (btn && zone) {
        btn.addEventListener('click', () => expandFlujoInline(result, flujoId, btn, zone));
      }
    }

    el.resultPanel.hidden = false;

    if (window.smoothScrollTo) {
      window.smoothScrollTo(el.resultPanel, 'nearest');
    }
  }

  // ── Expande el flujograma directamente dentro del resultado ───────────
  async function expandFlujoInline(result, flujoId, triggerBtn, zone) {
    // Evitar doble clic mientras carga
    triggerBtn.disabled = true;
    triggerBtn.textContent = 'Cargando…';

    // Asegurar que flujograma.js esté cargado
    if (!window.FLUJO_run) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'flujograma.js';
        s.onload  = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      }).catch(() => null);
    }

    // Cargar datos del flujograma
    let flujoData = null;
    if (window.FLUJO_get) {
      flujoData = await window.FLUJO_get(flujoId).catch(() => null);
    }

    if (!flujoData) {
      triggerBtn.disabled = false;
      triggerBtn.textContent = 'Flujograma';
      zone.hidden = false;
      zone.innerHTML = `<div class="result-flujo-error">
        ⚠️ No se pudo cargar el flujograma. Verifica la conexión e intenta de nuevo.
      </div>`;
      return;
    }

    // Ocultar el botón de disparo una vez que el flujograma se despliega
    triggerBtn.closest('.result-flujo-trigger').hidden = true;
    zone.hidden = false;
    zone.innerHTML = '';

    // Montar el motor inline — el resultado del algoritmo aparece
    // dentro de la zona; las notas importantes siguen debajo en el DOM.
    window.FLUJO_run(flujoData, zone);

    // Scroll suave a la zona del flujograma
    if (window.smoothScrollTo) {
      window.smoothScrollTo(zone, 'nearest');
    }
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
