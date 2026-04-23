// ─── DERIVMED – Buscador principal ────────────────────────────────────────────
(function () {
  var input       = document.getElementById('searchInput');
  var dropdown    = document.getElementById('searchDropdown');
  var inner       = document.getElementById('dropdownInner');
  var clearBtn    = document.getElementById('searchClear');
  var btnBuscar   = document.getElementById('btnBuscar');
  var resultPanel = document.getElementById('resultPanel');
  var resultTitle = document.getElementById('resultTitle');
  var resultBody  = document.getElementById('resultBody');
  var resultClose = document.getElementById('resultClose');
  var hamburger   = document.getElementById('hamburger');
  var navList     = document.getElementById('navList');
  var statDiag    = document.getElementById('statDiag');
  var statEsp     = document.getElementById('statEsp');
  if (!input) return;

  if (statDiag) statDiag.textContent = DB.length;
  if (statEsp)  statEsp.textContent  = (new Set(DB.map(function(d){return d.especialidad;}))).size;

  if (hamburger && navList) {
    hamburger.addEventListener('click', function () { navList.classList.toggle('open'); });
  }

  var focusedIdx = -1, currentResults = [];

  input.addEventListener('input', function () {
    var q = input.value.trim();
    clearBtn.classList.toggle('visible', q.length > 0);
    if (q.length < 2) { closeDropdown(); return; }
    currentResults = searchDB(q);
    renderDropdown(currentResults, q);
  });

  input.addEventListener('keydown', function (e) {
    if (!dropdown.classList.contains('open')) return;
    var items = inner.querySelectorAll('.dd-item');
    if (e.key === 'ArrowDown')  { e.preventDefault(); focusedIdx = Math.min(focusedIdx + 1, items.length - 1); updateFocus(items); }
    else if (e.key === 'ArrowUp')    { e.preventDefault(); focusedIdx = Math.max(focusedIdx - 1, 0); updateFocus(items); }
    else if (e.key === 'Enter')      { focusedIdx >= 0 && focusedIdx < currentResults.length ? selectResult(currentResults[focusedIdx]) : doSearch(); }
    else if (e.key === 'Escape')     { closeDropdown(); }
  });

  clearBtn.addEventListener('click', function () {
    input.value = ''; clearBtn.classList.remove('visible');
    closeDropdown(); resultPanel.hidden = true; input.focus();
  });

  btnBuscar.addEventListener('click', doSearch);
  resultClose.addEventListener('click', function () { resultPanel.hidden = true; });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#searchContainer')) closeDropdown();
  });

  function renderDropdown(results, q) {
    inner.innerHTML = ''; focusedIdx = -1;
    if (!results.length) {
      inner.innerHTML = '<div class="dd-empty">Sin resultados para "<strong>' + esc(q) + '</strong>"</div>';
    } else {
      results.forEach(function (r, i) {
        var div = document.createElement('div');
        div.className = 'dd-item';
        div.innerHTML =
          '<span class="dd-cie">'   + esc(r.cie10)       + '</span>' +
          '<span class="dd-nombre">'+ highlight(r.nombre, q) + '</span>' +
          '<span class="dd-espec">' + esc(r.especialidad) + '</span>' +
          '<span class="badge-urgencia ' + r.prioridad + '" style="font-size:.7rem;padding:2px 7px">' + esc(r.prioridad) + '</span>';
        div.addEventListener('mouseenter', function () { focusedIdx = i; updateFocus(inner.querySelectorAll('.dd-item')); });
        div.addEventListener('click', function () { selectResult(r); });
        inner.appendChild(div);
      });
    }
    dropdown.classList.add('open');
  }

  function updateFocus(items) {
    items.forEach(function (el, i) { el.classList.toggle('focused', i === focusedIdx); });
  }
  function closeDropdown() { dropdown.classList.remove('open'); focusedIdx = -1; }
  function selectResult(r) {
    input.value = r.cie10 + ' – ' + r.nombre;
    clearBtn.classList.add('visible');
    closeDropdown(); showResult(r);
  }
  function doSearch() {
    var q = input.value.trim(); if (!q) return;
    var results = searchDB(q);
    if (results.length === 1)     showResult(results[0]);
    else if (results.length > 1)  showResult(results[0], results.slice(1));
    else                          showNoResult(q);
    closeDropdown();
  }

  var PRIOR_LABEL = {
    P0: '🔴 P0 – Urgencia inmediata',
    P1: '🟠 P1 – Alta prioridad (<30 días)',
    P2: '🔵 P2 – Normal (<6 meses)',
    GES:'🟢 GES – Garantía Explícita en Salud'
  };

  function showResult(r, others) {
    resultTitle.textContent = r.cie10 + ' – ' + r.nombre;
    var urgBadge  = '<span class="badge-urgencia ' + r.prioridad + '">' + (PRIOR_LABEL[r.prioridad] || r.prioridad) + '</span>';
    var notasHTML = r.notas ? '<div class="result-notas">💡 ' + esc(r.notas) + '</div>' : '';
    var othersHTML = '';
    if (others && others.length) {
      othersHTML = '<div style="margin-top:12px;font-size:.82rem;color:rgba(255,255,255,.45);">También encontrado: ' +
        others.slice(0, 4).map(function (o) {
          return '<strong style="color:#90CAF9">' + o.cie10 + '</strong> ' + esc(o.nombre);
        }).join(' &bull; ') + '</div>';
    }
    resultBody.innerHTML =
      '<div class="result-card">' +
        '<div class="result-field"><span class="result-label">Código CIE-10</span>' +
          '<span class="result-value" style="font-family:\'Nunito\',sans-serif;font-weight:800;font-size:1.3rem;color:#4FC3F7;">' + esc(r.cie10) + '</span></div>' +
        '<div class="result-field"><span class="result-label">Especialidad</span>' +
          '<span class="result-value">' + esc(r.especialidad) + '</span></div>' +
        '<div class="result-field" style="grid-column:1/-1"><span class="result-label">Diagnóstico</span>' +
          '<span class="result-value" style="font-size:1.05rem">' + esc(r.nombre) + '</span></div>' +
        '<div class="result-field"><span class="result-label">Destino de derivación</span>' +
          '<span class="result-value">' + esc(r.destino) + '</span></div>' +
        '<div class="result-field"><span class="result-label">Prioridad</span>' + urgBadge + '</div>' +
        '<div class="result-field" style="grid-column:1/-1"><span class="result-label">Criterios de derivación</span>' +
          '<span class="result-value" style="font-size:.9rem;line-height:1.5">' + esc(r.criterios) + '</span></div>' +
        '<div class="result-field" style="grid-column:1/-1"><span class="result-label">Exámenes mínimos (EMBD)</span>' +
          '<span class="result-value" style="font-size:.88rem;line-height:1.5;color:#B3E5FC">' + esc(r.examenes) + '</span></div>' +
        notasHTML +
      '</div>' + othersHTML;
    resultPanel.hidden = false;
    resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showNoResult(q) {
    resultTitle.textContent = 'Sin resultados';
    resultBody.innerHTML = '<div class="no-result">No se encontró "<strong>' + esc(q) + '</strong>" en la base de datos.<br/>Intenta con otro nombre o código CIE-10.</div>';
    resultPanel.hidden = false;
  }

  function highlight(text, q) {
    if (!q) return esc(text);
    var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    return esc(text).replace(re, '<mark style="background:rgba(79,195,247,.3);color:#fff;border-radius:2px;">$1</mark>');
  }
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
})();
