// ─── SICMED – Actualizaciones (Light Theme) ──────────────────────────────────
(function () {
  var actLog    = document.getElementById('actLog');
  var actTotal  = document.getElementById('actTotal');
  var actCreados    = document.getElementById('actCreados');
  var actEditados   = document.getElementById('actEditados');
  var actEliminados = document.getElementById('actEliminados');
  var actFilters    = document.getElementById('actFilters');

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  var log = [];

  window.STORE_getLog().then(function(data) {
    log = data;
    renderStats();
    renderLista('');
  }).catch(function() {
    if (actLog) actLog.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted)">No se pudo cargar el historial.</div>';
  });

  function renderStats() {
    var creados    = log.filter(function(l){ return l.accion === 'CREADO' || l.accion === 'NUEVO'; }).length;
    var editados   = log.filter(function(l){ return l.accion === 'EDITADO'; }).length;
    var eliminados = log.filter(function(l){ return l.accion === 'ELIMINADO'; }).length;
    if (actTotal)     actTotal.textContent     = log.length;
    if (actCreados)   actCreados.textContent   = creados;
    if (actEditados)  actEditados.textContent  = editados;
    if (actEliminados)actEliminados.textContent= eliminados;
  }

  function renderLista(filtro) {
    if (!actLog) return;
    var lista = filtro ? log.filter(function(l){ return l.accion === filtro; }) : log;
    if (!lista.length) {
      actLog.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:.875rem">Sin registros' + (filtro ? ' para este filtro' : '') + '.</div>';
      return;
    }
    actLog.innerHTML = '';
    lista.forEach(function(item) {
      var row = document.createElement('div');
      row.className = 'act-row';
      var fecha = '';
      if (item.fecha) {
        try { var d = new Date(item.fecha); fecha = d.toLocaleDateString('es-CL') + ' ' + d.toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'}); } catch(e){}
      }
      row.innerHTML =
        '<span class="act-badge ' + esc(item.accion) + '">' + esc(item.accion) + '</span>' +
        '<span class="act-cie">' + esc(item.cie10 || '–') + '</span>' +
        '<div class="act-info">' +
          '<div class="act-nombre">' + esc(item.nombre || '–') + '</div>' +
          '<div class="act-meta">' + esc(item.especialidad || '') + '</div>' +
        '</div>' +
        (item.prioridad ? '<span class="badge-urgencia ' + item.prioridad + '">' + esc(item.prioridad) + '</span>' : '') +
        '<span class="act-fecha">' + fecha + '</span>';
      actLog.appendChild(row);
    });
  }

  if (actFilters) {
    actFilters.querySelectorAll('.proc-pill').forEach(function(btn) {
      btn.addEventListener('click', function() {
        actFilters.querySelectorAll('.proc-pill').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        renderLista(btn.dataset.filter || '');
      });
    });
  }
})();
