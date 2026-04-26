// ─── SICMED – Buscador principal (Light Blue Theme) ──────────────────────────
(function () {
  var input      = document.getElementById('searchInput');
  var dropdown   = document.getElementById('searchDropdown');
  var inner      = document.getElementById('dropdownInner');
  var clearBtn   = document.getElementById('searchClear');
  var resultPanel = document.getElementById('resultPanel');
  var resultTitle = document.getElementById('resultTitle');
  var resultBody  = document.getElementById('resultBody');
  var resultClose = document.getElementById('resultClose');
  var statDiag   = document.getElementById('statDiag');
  var statEsp    = document.getElementById('statEsp');
  var menuBtn    = document.getElementById('menuBtn');
  var hamMenu    = document.getElementById('hamMenu');

  if (!input) return;

  // ── Stats ────────────────────────────────────────────────────────────────
  if (statDiag) statDiag.textContent = window.DB.length;
  if (statEsp) {
    var espCount = window.ESPECIALIDADES
      ? window.ESPECIALIDADES.length
      : (new Set(window.DB.map(function(d){ return d.especialidad; }))).size;
    statEsp.textContent = espCount;
  }

  // ── Hamburger menu ───────────────────────────────────────────────────────
  if (menuBtn && hamMenu) {
    menuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var open = hamMenu.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open);
    });
    document.addEventListener('click', function(e) {
      if (!e.target.closest('#hamMenu') && !e.target.closest('#menuBtn')) {
        hamMenu.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Search logic ─────────────────────────────────────────────────────────
  var focusedIdx = -1, currentResults = [];

  input.addEventListener('input', function() {
    var q = input.value.trim();
    clearBtn.classList.toggle('visible', q.length > 0);
    if (q.length < 2) { closeDropdown(); return; }
    currentResults = window.searchDB(q);
    renderDropdown(currentResults, q);
  });

  input.addEventListener('keydown', function(e) {
    if (!dropdown.classList.contains('open')) return;
    var items = inner.querySelectorAll('.dd-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); focusedIdx = Math.min(focusedIdx + 1, items.length - 1); updateFocus(items); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); focusedIdx = Math.max(focusedIdx - 1, 0); updateFocus(items); }
    else if (e.key === 'Enter') {
      if (focusedIdx >= 0 && focusedIdx < currentResults.length) selectResult(currentResults[focusedIdx]);
      else doSearch();
    }
    else if (e.key === 'Escape') { closeDropdown(); }
  });

  clearBtn.addEventListener('click', function() {
    input.value = '';
    clearBtn.classList.remove('visible');
    closeDropdown();
    if (resultPanel) resultPanel.hidden = true;
    input.focus();
  });

  if (resultClose) resultClose.addEventListener('click', function() { resultPanel.hidden = true; });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('#searchContainer')) closeDropdown();
  });

  // ── Render dropdown ────────────────────────────────────────────────────
  function renderDropdown(results, q) {
    inner.innerHTML = ''; focusedIdx = -1;
    if (!results.length) {
      inner.innerHTML = '<div class="dd-empty">Sin resultados para <strong>' + esc(q) + '</strong></div>';
    } else {
      results.forEach(function(r, i) {
        var div = document.createElement('div');
        div.className = 'dd-item';
        // Truncate especialidad to first word + abbreviation
        var espShort = r.especialidad ? r.especialidad.split(' ')[0] : r.especialidad;
        div.innerHTML =
          '<span class="dd-cie">' + esc(r.cie10) + '</span>' +
          '<span class="dd-nombre">' + highlight(r.nombre, q) + '</span>' +
          '<span class="dd-espec">' + esc(espShort) + '</span>' +
          '<span class="badge-urgencia ' + r.prioridad + '">' + esc(r.prioridad) + '</span>';
        div.addEventListener('mouseenter', function() { focusedIdx = i; updateFocus(inner.querySelectorAll('.dd-item')); });
        div.addEventListener('click', function() { selectResult(r); });
        inner.appendChild(div);
      });
    }
    dropdown.classList.add('open');
  }

  function updateFocus(items) {
    items.forEach(function(el, i) { el.classList.toggle('focused', i === focusedIdx); });
  }
  function closeDropdown() { dropdown.classList.remove('open'); focusedIdx = -1; }

  function selectResult(r) {
    input.value = r.cie10 + ' – ' + r.nombre;
    clearBtn.classList.add('visible');
    closeDropdown();
    showResult(r);
  }

  function doSearch() {
    var q = input.value.trim(); if (!q) return;
    var results = window.searchDB(q);
    if (results.length >= 1) showResult(results[0], results.slice(1));
    else showNoResult(q);
    closeDropdown();
  }

  // ── Result panel ──────────────────────────────────────────────────────
  var PRIOR_LABEL = {
    P0:  '⬤ P0 – Urgencia inmediata',
    P1:  '⬤ P1 – Alta prioridad (< 30 días)',
    P2:  '⬤ P2 – Normal (< 6 meses)',
    GES: '⬤ GES – Garantía Explícita en Salud'
  };

  function showResult(r, others) {
    resultTitle.textContent = r.cie10 + ' – ' + r.nombre;
    var notasHTML = r.notas
      ? '<div class="result-notas full">💡 ' + esc(r.notas) + '</div>'
      : '';
    var othersHTML = '';
    if (others && others.length) {
      othersHTML = '<div style="padding:12px 20px;font-size:.82rem;color:var(--text-muted);background:var(--gray-50);border-top:1px solid var(--gray-200)">' +
        'También: ' + others.slice(0, 4).map(function(o) {
          return '<strong style="color:var(--blue-500)">' + esc(o.cie10) + '</strong> ' + esc(o.nombre);
        }).join(' &bull; ') + '</div>';
    }
    resultBody.innerHTML =
      '<div class="result-card">' +
        field('Código CIE-10', '<span style="font-family:\'Sora\',sans-serif;font-weight:700;font-size:1.2rem;color:var(--blue-700)">' + esc(r.cie10) + '</span>') +
        field('Especialidad', esc(r.especialidad)) +
        field('Diagnóstico', esc(r.nombre), true) +
        field('Destino derivación', esc(r.destino || '–')) +
        field('Prioridad', '<span class="badge-urgencia ' + r.prioridad + '">' + (PRIOR_LABEL[r.prioridad] || esc(r.prioridad)) + '</span>') +
        field('Criterios de derivación', esc(r.criterios || '–'), true) +
        field('Exámenes mínimos (EMBD)', '<span style="color:var(--blue-700)">' + esc(r.examenes || '–') + '</span>', true) +
        notasHTML +
      '</div>' + othersHTML;
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function field(label, valueHTML, full) {
    return '<div class="result-field' + (full ? ' full' : '') + '">' +
      '<span class="result-label">' + label + '</span>' +
      '<span class="result-value">' + valueHTML + '</span>' +
      '</div>';
  }

  function showNoResult(q) {
    resultTitle.textContent = 'Sin resultados';
    resultBody.innerHTML = '<div class="no-result">No se encontró <strong>' + esc(q) + '</strong>.<br/>Intenta con otro nombre o código CIE-10.</div>';
    resultPanel.hidden = false;
  }

  function highlight(text, q) {
    if (!q) return esc(text);
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return esc(text).replace(re, '<mark style="background:rgba(58,134,200,0.20);color:var(--blue-700);border-radius:2px;padding:0 1px;">$1</mark>');
  }
  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
