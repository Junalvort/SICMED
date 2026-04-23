// ─── DERIVMED – Actualizaciones ───────────────────────────────────────────────
(function () {
  var hamburger  = document.getElementById('hamburger');
  var navList    = document.getElementById('navList');
  var actStats   = document.getElementById('actStats');
  var actFiltros = document.getElementById('actFiltros');
  var actLista   = document.getElementById('actLista');
  var actVacio   = document.getElementById('actVacio');

  if (hamburger && navList) {
    hamburger.addEventListener('click', function () { navList.classList.toggle('open'); });
  }

  var ACCION_META = {
    'NUEVO':     { icono: '➕', color: '#66BB6A', label: 'Nuevo',    bg: 'rgba(102,187,106,.12)', border: 'rgba(102,187,106,.3)'  },
    'EDITADO':   { icono: '✏️', color: '#42A5F5', label: 'Editado',  bg: 'rgba(66,165,245,.12)',  border: 'rgba(66,165,245,.3)'   },
    'ELIMINADO': { icono: '🗑',  color: '#EF5350', label: 'Eliminado',bg: 'rgba(239,83,80,.12)',   border: 'rgba(239,83,80,.3)'    }
  };
  var PRIOR_COLOR = { P0:'#EF5350', P1:'#FFA726', P2:'#42A5F5', GES:'#66BB6A' };

  var log = STORE_getLog();
  var filtroActivo = '';

  // ── Resumen ──
  function renderStats() {
    var totales = { NUEVO: 0, EDITADO: 0, ELIMINADO: 0 };
    log.forEach(function (e) { if (totales[e.accion] !== undefined) totales[e.accion]++; });
    actStats.innerHTML =
      '<div class="act-stat-card">' +
        '<span class="act-stat-num" style="color:#66BB6A">' + totales.NUEVO + '</span>' +
        '<span class="act-stat-label">Nuevos</span>' +
      '</div>' +
      '<div class="act-stat-card">' +
        '<span class="act-stat-num" style="color:#42A5F5">' + totales.EDITADO + '</span>' +
        '<span class="act-stat-label">Editados</span>' +
      '</div>' +
      '<div class="act-stat-card">' +
        '<span class="act-stat-num" style="color:#EF5350">' + totales.ELIMINADO + '</span>' +
        '<span class="act-stat-label">Eliminados</span>' +
      '</div>' +
      '<div class="act-stat-card">' +
        '<span class="act-stat-num" style="color:#4FC3F7">' + log.length + '</span>' +
        '<span class="act-stat-label">Total eventos</span>' +
      '</div>';
  }

  // ── Lista ──
  function renderLista(filtro) {
    var datos = filtro ? log.filter(function (e) { return e.accion === filtro; }) : log;
    actLista.innerHTML = '';

    if (!datos.length) {
      actVacio.style.display = 'flex';
      actLista.style.display = 'none';
      return;
    }
    actVacio.style.display = 'none';
    actLista.style.display = 'flex';

    // Agrupar por fecha (día)
    var grupos = {};
    datos.forEach(function (e) {
      var dia = new Date(e.fecha).toLocaleDateString('es-CL', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
      if (!grupos[dia]) grupos[dia] = [];
      grupos[dia].push(e);
    });

    Object.keys(grupos).forEach(function (dia) {
      // Cabecera de día
      var header = document.createElement('div');
      header.className = 'act-dia-header';
      header.textContent = dia.charAt(0).toUpperCase() + dia.slice(1);
      actLista.appendChild(header);

      grupos[dia].forEach(function (e) {
        var meta    = ACCION_META[e.accion] || { icono:'?', color:'#fff', label: e.accion, bg:'rgba(255,255,255,.08)', border:'rgba(255,255,255,.15)' };
        var hora    = new Date(e.fecha).toLocaleTimeString('es-CL', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
        var priColor = PRIOR_COLOR[e.prioridad] || '#aaa';

        var card = document.createElement('div');
        card.className = 'act-card';
        card.style.borderLeftColor = meta.color;

        card.innerHTML =
          '<div class="act-card-top">' +
            '<span class="act-badge" style="background:' + meta.bg + ';color:' + meta.color + ';border-color:' + meta.border + '">' +
              meta.icono + ' ' + meta.label +
            '</span>' +
            '<span class="act-hora">🕐 ' + hora + '</span>' +
          '</div>' +
          '<div class="act-card-nombre">' + escHTML(e.nombre) + '</div>' +
          '<div class="act-card-meta">' +
            '<span class="act-cie">' + escHTML(e.cie10) + '</span>' +
            '<span class="act-esp">' + escHTML(e.especialidad) + '</span>' +
            '<span style="font-size:.78rem;font-weight:700;color:' + priColor + '">' + escHTML(e.prioridad) + '</span>' +
          '</div>';

        actLista.appendChild(card);
      });
    });
  }

  // ── Pills filtro ──
  actFiltros.querySelectorAll('.act-pill').forEach(function (btn) {
    btn.addEventListener('click', function () {
      actFiltros.querySelectorAll('.act-pill').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      filtroActivo = btn.dataset.filtro;
      renderLista(filtroActivo);
    });
  });

  // ── Init ──
  renderStats();
  renderLista('');

  function escHTML(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
})();
