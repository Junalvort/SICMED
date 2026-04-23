// ─── SICMED – Procedimientos ──────────────────────────────────────────────────
(function() {

  var hamburger  = document.getElementById('hamburger');
  var navList    = document.getElementById('navList');
  var filtros    = document.getElementById('procFiltros');
  var grid       = document.getElementById('procGrid');
  var panel      = document.getElementById('procPanel');
  var panelTipo  = document.getElementById('panelTipo');
  var panelNombre= document.getElementById('panelNombre');
  var procDetail = document.getElementById('procDetail');
  var procClose  = document.getElementById('procClose');

  if (hamburger && navList)
    hamburger.addEventListener('click', function(){ navList.classList.toggle('open'); });

  // Iconos y colores por tipo
  var TIPO_META = {
    'Prueba Diagnóstica':    { icon:'🔬', color:'#42A5F5', bg:'rgba(66,165,245,.12)',  border:'rgba(66,165,245,.3)'  },
    'Imagenología':           { icon:'🩻', color:'#AB47BC', bg:'rgba(171,71,188,.12)',  border:'rgba(171,71,188,.3)'  },
    'Procedimiento':          { icon:'👁️', color:'#26A69A', bg:'rgba(38,166,154,.12)',  border:'rgba(38,166,154,.3)'  },
    'Cirugía Menor':          { icon:'🩹', color:'#EF5350', bg:'rgba(239,83,80,.12)',   border:'rgba(239,83,80,.3)'   },
    'Rehabilitación Física':  { icon:'💪', color:'#FFA726', bg:'rgba(255,167,38,.12)',  border:'rgba(255,167,38,.3)'  },
    'Dermatología APS':       { icon:'🧴', color:'#66BB6A', bg:'rgba(102,187,106,.12)', border:'rgba(102,187,106,.3)' },
    'Órtesis':                { icon:'🦽', color:'#78909C', bg:'rgba(120,144,156,.12)', border:'rgba(120,144,156,.3)' },
  };

  function getMeta(tipo) {
    return TIPO_META[tipo] || { icon:'📋', color:'#4FC3F7', bg:'rgba(79,195,247,.1)', border:'rgba(79,195,247,.25)' };
  }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function buildFiltros(procs) {
    var tipos = [];
    procs.forEach(function(p){ if(tipos.indexOf(p.tipo)===-1) tipos.push(p.tipo); });
    filtros.innerHTML = '<button class="proc-pill active" data-tipo="">Todos</button>';
    tipos.forEach(function(t){
      var m = getMeta(t);
      var btn = document.createElement('button');
      btn.className = 'proc-pill';
      btn.dataset.tipo = t;
      btn.innerHTML = m.icon + ' ' + t;
      btn.style.cssText = 'border-color:' + m.border + ';';
      filtros.appendChild(btn);
    });
    filtros.querySelectorAll('.proc-pill').forEach(function(btn){
      btn.addEventListener('click', function(){
        filtros.querySelectorAll('.proc-pill').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        renderGrid(btn.dataset.tipo ? window.PROCEDIMIENTOS.filter(function(p){ return p.tipo===btn.dataset.tipo; }) : window.PROCEDIMIENTOS);
      });
    });
  }

  function renderGrid(procs) {
    grid.innerHTML = '';
    if (!procs.length) {
      grid.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,.4)">Sin procedimientos en esta categoría</div>';
      return;
    }

    // Agrupar por tipo
    var grupos = {};
    procs.forEach(function(p){
      if(!grupos[p.tipo]) grupos[p.tipo] = [];
      grupos[p.tipo].push(p);
    });

    Object.keys(grupos).forEach(function(tipo){
      var m = getMeta(tipo);

      // Banner de sección
      var banner = document.createElement('div');
      banner.className = 'proc-banner';
      banner.style.cssText = 'border-left:4px solid ' + m.color + ';background:' + m.bg + ';';
      banner.innerHTML = '<span class="proc-banner-icon">' + m.icon + '</span>' +
        '<span class="proc-banner-title">' + esc(tipo) + '</span>' +
        '<span class="proc-banner-count">' + grupos[tipo].length + ' procedimiento' + (grupos[tipo].length!==1?'s':'') + '</span>';
      grid.appendChild(banner);

      // Cards del tipo
      var row = document.createElement('div');
      row.className = 'proc-cards-row';
      grupos[tipo].forEach(function(p){
        var card = document.createElement('div');
        card.className = 'proc-card';
        card.style.cssText = 'border-top:3px solid ' + m.color + ';';
        card.innerHTML =
          '<div class="proc-card-nombre">' + esc(p.nombre) + '</div>' +
          '<div class="proc-card-mod">' +
            '<span class="proc-tag" style="background:' + m.bg + ';color:' + m.color + ';border-color:' + m.border + '">' + esc(p.modalidad||'') + '</span>' +
            '<span class="proc-establecimiento">📍 ' + esc(p.establecimiento||'') + '</span>' +
          '</div>' +
          '<div class="proc-card-diag">' + esc((p.diagnosticos||'').substring(0,80)) + (p.diagnosticos&&p.diagnosticos.length>80?'…':'') + '</div>' +
          '<button class="proc-card-btn" style="color:' + m.color + ';border-color:' + m.border + '">Ver detalle →</button>';
        card.querySelector('.proc-card-btn').addEventListener('click', function(){ openPanel(p, m); });
        row.appendChild(card);
      });
      grid.appendChild(row);
    });
  }

  function openPanel(p, m) {
    panelTipo.textContent  = (m.icon||'') + ' ' + (p.tipo||'');
    panelTipo.style.color  = m.color;
    panelNombre.textContent = p.nombre;

    procDetail.innerHTML =
      '<div class="proc-detail-section">' +
        '<div class="proc-detail-label">Modalidad</div>' +
        '<div class="proc-detail-value">' + esc(p.modalidad||'—') + '</div>' +
      '</div>' +
      '<div class="proc-detail-section">' +
        '<div class="proc-detail-label">Establecimiento</div>' +
        '<div class="proc-detail-value">📍 ' + esc(p.establecimiento||'—') + '</div>' +
      '</div>' +
      '<div class="proc-detail-section">' +
        '<div class="proc-detail-label">Prioridad</div>' +
        '<div class="proc-detail-value">⚡ ' + esc(p.prioridad||'Normal') + '</div>' +
      '</div>' +
      '<div class="proc-detail-section full">' +
        '<div class="proc-detail-label">Diagnósticos asociados (CIE-10)</div>' +
        '<div class="proc-detail-value" style="color:#B3E5FC">' + esc(p.diagnosticos||'—') + '</div>' +
      '</div>' +
      '<div class="proc-detail-section full">' +
        '<div class="proc-detail-label">Criterios y pasos en Rayen</div>' +
        '<div class="proc-detail-value" style="line-height:1.7">' + esc(p.criterios||'—').replace(/\n/g,'<br/>') + '</div>' +
      '</div>' +
      (p.notas ? '<div class="proc-detail-notas">⚠️ ' + esc(p.notas) + '</div>' : '');

    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  procClose.addEventListener('click', closePanel);
  panel.addEventListener('click', function(e){ if(e.target===panel) closePanel(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closePanel(); });

  function closePanel(){
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Init
  var procs = window.PROCEDIMIENTOS || [];
  buildFiltros(procs);
  renderGrid(procs);

})();
