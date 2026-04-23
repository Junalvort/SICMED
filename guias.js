// ─── SICMED – Guías ───────────────────────────────────────────────────────────
(function() {

  var hamburger      = document.getElementById('hamburger');
  var navList        = document.getElementById('navList');
  var guiaTabs       = document.getElementById('guiaTabs');
  var secGuias       = document.getElementById('seccionGuias');
  var secEscalas     = document.getElementById('seccionEscalas');
  var guiaFiltros    = document.getElementById('guiaFiltros');
  var cardsGrid      = document.getElementById('guiaCardsGrid');
  var guiaPanel      = document.getElementById('guiaPanel');
  var guiaPanelClose = document.getElementById('guiaPanelClose');
  var guiaPanelTipo  = document.getElementById('guiaPanelTipo');
  var guiaPanelTit   = document.getElementById('guiaPanelTitulo');
  var guiaPanelDesc  = document.getElementById('guiaPanelDesc');
  var guiaPanelBody  = document.getElementById('guiaPanelBody');
  var escalasGrid    = document.getElementById('escalasGrid');

  if (hamburger && navList)
    hamburger.addEventListener('click', function(){ navList.classList.toggle('open'); });

  // ── Tabs principales ─────────────────────────────────────────────────────
  guiaTabs.querySelectorAll('.guia-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      guiaTabs.querySelectorAll('.guia-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      if (tab.dataset.seccion === 'escalas') {
        secGuias.style.display   = 'none';
        secEscalas.style.display = 'block';
        renderEscalas();
      } else {
        secGuias.style.display   = 'block';
        secEscalas.style.display = 'none';
      }
    });
  });

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function nl2br(s){ return esc(s).replace(/\\n/g,'<br/>'); }

  // ── GUÍAS ────────────────────────────────────────────────────────────────
  var guias = window.GUIAS || [];

  function buildGuiaFiltros() {
    guiaFiltros.innerHTML = '<button class="proc-pill active" data-gf="">Todas</button>';
    var vistos = [];
    guias.forEach(function(g) {
      if (vistos.indexOf(g.titulo) === -1) {
        vistos.push(g.titulo);
        var btn = document.createElement('button');
        btn.className = 'proc-pill';
        btn.dataset.gf = g.id;
        btn.innerHTML  = (g.icono||'📋') + ' ' + esc(g.titulo);
        btn.style.borderColor = g.color ? g.color + '66' : 'rgba(79,195,247,.3)';
        guiaFiltros.appendChild(btn);
      }
    });
    guiaFiltros.querySelectorAll('.proc-pill').forEach(function(btn) {
      btn.addEventListener('click', function() {
        guiaFiltros.querySelectorAll('.proc-pill').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        renderGuiaCards(btn.dataset.gf ? guias.filter(function(g){ return g.id===btn.dataset.gf; }) : guias);
      });
    });
  }

  function renderGuiaCards(lista) {
    cardsGrid.innerHTML = '';
    if (!lista.length) {
      cardsGrid.innerHTML = '<div style="text-align:center;padding:40px;color:rgba(255,255,255,.35)">Sin guías disponibles</div>';
      return;
    }
    lista.forEach(function(g) {
      var color = g.color || '#4FC3F7';
      var card = document.createElement('div');
      card.className = 'guia-card';
      card.style.borderTop = '3px solid ' + color;
      card.innerHTML =
        '<div class="guia-card-icon">' + (g.icono||'📋') + '</div>' +
        '<div class="guia-card-titulo">' + esc(g.titulo) + '</div>' +
        '<div class="guia-card-desc">'   + esc(g.descripcion||'') + '</div>' +
        '<div class="guia-card-secs">' + (g.secciones||[]).length + ' sección' + ((g.secciones||[]).length!==1?'es':'') + '</div>' +
        '<button class="proc-card-btn" style="color:' + color + ';border-color:' + color + '66">Ver guía →</button>';
      card.querySelector('.proc-card-btn').addEventListener('click', function(){ openGuiaPanel(g); });
      cardsGrid.appendChild(card);
    });
  }

  function openGuiaPanel(g) {
    var color = g.color || '#4FC3F7';
    guiaPanelTipo.textContent  = (g.icono||'📋') + ' Guía';
    guiaPanelTipo.style.color  = color;
    guiaPanelTit.textContent   = g.titulo;
    guiaPanelDesc.textContent  = g.descripcion || '';
    guiaPanelBody.innerHTML    = '';
    (g.secciones||[]).forEach(function(sec) {
      var blk = document.createElement('div');
      blk.className = 'guia-seccion';
      blk.innerHTML =
        '<div class="guia-seccion-titulo" style="color:' + color + '">' + esc(sec.subtitulo||'') + '</div>' +
        '<div class="guia-seccion-body">'  + nl2br(sec.contenido||'') + '</div>';
      guiaPanelBody.appendChild(blk);
    });
    guiaPanel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  guiaPanelClose.addEventListener('click', function(){ guiaPanel.classList.remove('open'); document.body.style.overflow=''; });
  guiaPanel.addEventListener('click', function(e){ if(e.target===guiaPanel){ guiaPanel.classList.remove('open'); document.body.style.overflow=''; } });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ guiaPanel.classList.remove('open'); document.body.style.overflow=''; } });

  // Si window.GUIAS ya está disponible, renderizar
  // Si aún no (Firestore tardó más), esperar el evento sicmed:ready
  function initGuias() {
    guias = window.GUIAS || [];
    buildGuiaFiltros();
    renderGuiaCards(guias);
  }

  if (window.GUIAS && window.GUIAS.length >= 0) {
    initGuias();
  } else {
    document.addEventListener("sicmed:ready", function() {
      initGuias();
    });
  }

  // ── ESCALAS ───────────────────────────────────────────────────────────────
  var ESCALAS = [
    {
      nombre: "Índice de Barthel",
      color: "#42A5F5",
      icono: "🏃",
      descripcion: "Evalúa la independencia funcional en actividades básicas de la vida diaria.",
      interpretacion: [
        { rango:"0–20",  label:"Dependencia total",    color:"#EF5350" },
        { rango:"21–35", label:"Dependencia severa",   color:"#EF5350" },
        { rango:"36–55", label:"Dependencia moderada", color:"#FFA726" },
        { rango:"56–90", label:"Dependencia leve",     color:"#FFA726" },
        { rango:"91–99", label:"Dependencia escasa",   color:"#66BB6A" },
        { rango:"100",   label:"Independencia total",  color:"#66BB6A" },
      ],
      nota:"Se aplica en CI e ingresos PDS. Menor de 35 puntos = dependencia severa (ingreso PADDS)."
    },
    {
      nombre: "Test de Pfeiffer (SPMSQ)",
      color: "#AB47BC",
      icono: "🧠",
      descripcion: "Evaluación cognitiva breve para adulto mayor. 10 preguntas de orientación y memoria.",
      interpretacion: [
        { rango:"0–2 errores",  label:"Normal",                color:"#66BB6A" },
        { rango:"3–4 errores",  label:"Deterioro leve",        color:"#FFA726" },
        { rango:"5–7 errores",  label:"Deterioro moderado",    color:"#FFA726" },
        { rango:"8–10 errores", label:"Deterioro severo",      color:"#EF5350" },
      ],
      nota:"Aplicar en CI e ingresos. Si ≥3 errores: derivar a evaluación de demencia."
    },
    {
      nombre: "Minimental Abreviado (MMSE)",
      color: "#26A69A",
      icono: "🧩",
      descripcion: "Evaluación cognitiva global. Evalúa orientación, memoria, atención, lenguaje y praxis.",
      interpretacion: [
        { rango:"26–30", label:"Normal",             color:"#66BB6A" },
        { rango:"21–25", label:"Deterioro leve",     color:"#FFA726" },
        { rango:"11–20", label:"Deterioro moderado", color:"#FFA726" },
        { rango:"0–10",  label:"Deterioro severo",   color:"#EF5350" },
      ],
      nota:"Aplicar en CI e ingresos. Resultado incluir en hoja de derivación."
    },
    {
      nombre: "AUDIT (Alcohol Use Disorders Identification Test)",
      color: "#EF5350",
      icono: "🍷",
      descripcion: "Identifica consumo de riesgo, consumo perjudicial y dependencia al alcohol.",
      interpretacion: [
        { rango:"0–7",   label:"Consumo de bajo riesgo",        color:"#66BB6A" },
        { rango:"8–15",  label:"Consumo de riesgo",             color:"#FFA726" },
        { rango:"16–19", label:"Consumo perjudicial",           color:"#FFA726" },
        { rango:"20–40", label:"Dependencia probable al alcohol",color:"#EF5350" },
      ],
      nota:"Aplicar en CI. Si ≥16 puntos: derivar a programa AA."
    },
    {
      nombre: "NECPAL 4.0",
      color: "#78909C",
      icono: "🕊️",
      descripcion: "Identifica personas con enfermedades crónicas avanzadas y necesidades paliativas.",
      interpretacion: [
        { rango:"NECPAL +",  label:"Necesidad de atención paliativa identificada", color:"#FFA726" },
        { rango:"NECPAL −",  label:"Sin necesidad paliativa identificada",          color:"#66BB6A" },
      ],
      nota:"Aplicar en CPU. Registrar cada pregunta P1…P12 en ficha como positiva o negativa."
    },
    {
      nombre: "RFAM – Riesgo Familiar",
      color: "#66BB6A",
      icono: "👨‍👩‍👧",
      descripcion: "Evalúa el riesgo familiar integral de la familia del paciente.",
      interpretacion: [
        { rango:"Sin riesgo",    label:"Familia sin riesgo",     color:"#66BB6A" },
        { rango:"Riesgo leve",   label:"Riesgo leve",            color:"#FFA726" },
        { rango:"Riesgo moderado",label:"Riesgo moderado",       color:"#FFA726" },
        { rango:"Riesgo alto",   label:"Riesgo alto",            color:"#EF5350" },
      ],
      nota:"Aplicar CADA 3 AÑOS. 1 alta es suficiente para categorizar. Registrar en ficha familiar."
    },
    {
      nombre: "Escala de Barthel — Actividades evaluadas",
      color: "#42A5F5",
      icono: "📋",
      descripcion: "Detalle de las 10 actividades evaluadas en el índice de Barthel.",
      interpretacion: [
        { rango:"Comer",               label:"0 / 5 / 10 puntos",  color:"#42A5F5" },
        { rango:"Baño",                label:"0 / 5 puntos",        color:"#42A5F5" },
        { rango:"Aseo personal",       label:"0 / 5 puntos",        color:"#42A5F5" },
        { rango:"Vestirse",            label:"0 / 5 / 10 puntos",  color:"#42A5F5" },
        { rango:"Deposición",          label:"0 / 5 / 10 puntos",  color:"#42A5F5" },
        { rango:"Micción",             label:"0 / 5 / 10 puntos",  color:"#42A5F5" },
        { rango:"Usar el WC",          label:"0 / 5 / 10 puntos",  color:"#42A5F5" },
        { rango:"Traslado silla/cama", label:"0 / 5 / 10 / 15 pts",color:"#42A5F5" },
        { rango:"Deambulación",        label:"0 / 5 / 10 / 15 pts",color:"#42A5F5" },
        { rango:"Subir escaleras",     label:"0 / 5 / 10 puntos",  color:"#42A5F5" },
      ],
      nota:"Puntuación máxima: 100 puntos."
    },
  ];

  function renderEscalas() {
    if (escalasGrid.children.length > 0) return; // ya renderizadas
  ESCALAS.forEach(function(escala) {
    var color = escala.color;
    var card = document.createElement('div');
    card.className = 'escala-card';
    card.style.borderLeft = '4px solid ' + color;

    var rangosHTML = escala.interpretacion.map(function(r) {
      return '<div class="escala-rango">' +
        '<span class="escala-rango-val" style="color:' + r.color + '">' + esc(r.rango) + '</span>' +
        '<span class="escala-rango-label">' + esc(r.label) + '</span>' +
        '<span class="escala-dot" style="background:' + r.color + '"></span>' +
      '</div>';
    }).join('');

    card.innerHTML =
      '<div class="escala-header">' +
        '<span class="escala-icono">' + escala.icono + '</span>' +
        '<div>' +
          '<div class="escala-nombre" style="color:' + color + '">' + esc(escala.nombre) + '</div>' +
          '<div class="escala-desc">' + esc(escala.descripcion) + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="escala-rangos">' + rangosHTML + '</div>' +
      (escala.nota ? '<div class="escala-nota">💡 ' + esc(escala.nota) + '</div>' : '');

    escalasGrid.appendChild(card);
  });
  } // end renderEscalas

})();
