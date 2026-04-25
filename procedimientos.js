// ─── SICMED – Procedimientos ──────────────────────────────────────────────────
(function() {

  var MOCK = [
    { tipo:'Prueba Diagnóstica', nombre:'Espirometría', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Normal', diagnosticos:'J44.1, J45.9, J96.0', criterios:'1. Solicitar en Rayen → Procedimientos → Espirometría\n2. Suspender broncodilatadores 4h antes\n3. No fumar 4h antes\n4. Traer orden médica firmada', notas:'Contraindicado en infarto reciente (<1 mes) o neumotórax activo.' },
    { tipo:'Prueba Diagnóstica', nombre:'Electrocardiograma (ECG)', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Urgente', diagnosticos:'I10, I25.9, R00.1, I48', criterios:'1. Solicitar en Rayen → Procedimientos → ECG\n2. Reposo 10 min previos\n3. Retirar objetos metálicos\n4. Registrar en ficha clínica', notas:'' },
    { tipo:'Prueba Diagnóstica', nombre:'Holter de ritmo 24h', modalidad:'Ambulatorio', establecimiento:'Hospital de referencia', prioridad:'Preferente', diagnosticos:'R00.1, I48, I49.9', criterios:'1. Derivar a cardiología vía SOME\n2. Adjuntar ECG reciente\n3. No bañarse durante el examen', notas:'Tiempo de espera estimado: 30–60 días.' },
    { tipo:'Imagenología', nombre:'Radiografía de tórax', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Normal', diagnosticos:'J18.9, J44.1, R91, C34', criterios:'1. Solicitar en Rayen → Imágenes → RX Tórax\n2. Indicar proyección: PA y Lateral\n3. Adjuntar clínica en orden', notas:'' },
    { tipo:'Imagenología', nombre:'Ecotomografía abdominal', modalidad:'Ambulatorio', establecimiento:'Hospital de referencia', prioridad:'Normal', diagnosticos:'K80.2, K86.1, D376, K75.0', criterios:'1. Solicitar en Rayen → Imágenes → Ecografía\n2. Ayuno de 6h (vesícula biliar)\n3. Beber 1L de agua 1h antes para vejiga', notas:'' },
    { tipo:'Imagenología', nombre:'Ecotomografía mamaria', modalidad:'Ambulatorio', establecimiento:'Hospital de referencia', prioridad:'Preferente', diagnosticos:'N60, C50.9, Z12.3', criterios:'1. Solicitar en Rayen → Imágenes → Eco mamaria\n2. Sin contraindicaciones especiales\n3. Complementa mamografía si nódulo < 30 años', notas:'Complementaria a mamografía en mujeres jóvenes.' },
    { tipo:'Imagenología', nombre:'Mamografía bilateral', modalidad:'Ambulatorio', establecimiento:'Hospital de referencia', prioridad:'Preferente', diagnosticos:'Z12.3, C50.9, N60', criterios:'1. Solicitar en Rayen → Imágenes → Mamografía\n2. No aplicar desodorante el día del examen\n3. Adjuntar historia mamaria', notas:'GES: Mujeres 50–69 años cada 2 años.' },
    { tipo:'Imagenología', nombre:'Ecotomografía tiroidea', modalidad:'Ambulatorio', establecimiento:'Hospital de referencia', prioridad:'Normal', diagnosticos:'E04.1, E04.2, C73', criterios:'1. Solicitar en Rayen → Imágenes → Eco tiroidea\n2. No requiere ayuno\n3. Informar uso de levotiroxina', notas:'Incluir clasificación TIRADS en informe.' },
    { tipo:'Procedimiento', nombre:'Curación avanzada', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Normal', diagnosticos:'L89, L97, T14.1', criterios:'1. Ingresar en Rayen → Procedimientos → Curación\n2. Seleccionar tipo: simple / avanzada\n3. Registrar características de herida\n4. Fotografiar si es posible', notas:'Coordinar con SOME para turnos.' },
    { tipo:'Procedimiento', nombre:'Inyectología / Administración de medicamentos', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Normal', diagnosticos:'Varios', criterios:'1. Verificar prescripción médica vigente\n2. Registrar en Rayen → Procedimientos → Inyectología\n3. Confirmar alergias\n4. Observar 15 min post administración', notas:'' },
    { tipo:'Cirugía Menor', nombre:'Biopsia de piel (punch)', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Preferente', diagnosticos:'L70, L57, D23', criterios:'1. Consentimiento informado\n2. Registrar en Rayen → Procedimientos → Cirugía menor\n3. Enviar muestra en formol al laboratorio\n4. Indicar curaciones en casa', notas:'Requiere médico capacitado. Resultado biopsia ~15 días.' },
    { tipo:'Cirugía Menor', nombre:'Crioterapia (nitrógeno líquido)', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Normal', diagnosticos:'L82, B07, L57.0', criterios:'1. Consentimiento informado\n2. Registrar en Rayen → Procedimientos → Crioterapia\n3. Aplicar 10–30 seg según lesión\n4. Control en 3–4 semanas', notas:'No aplicar en cara sin evaluación previa.' },
    { tipo:'Rehabilitación Física', nombre:'Kinesioterapia respiratoria', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Normal', diagnosticos:'J44.1, J45.9, J96.0', criterios:'1. IC kinesiología en Rayen\n2. Adjuntar espirometría reciente\n3. Frecuencia: 2–3 sesiones/semana\n4. Evaluar a los 30 días', notas:'' },
    { tipo:'Rehabilitación Física', nombre:'Kinesioterapia traumatológica', modalidad:'Ambulatorio', establecimiento:'CESFAM Lo Amor', prioridad:'Normal', diagnosticos:'M54.5, M75.1, S82, M17.1', criterios:'1. IC kinesiología en Rayen\n2. Adjuntar imágenes si hay\n3. Indicar área y diagnóstico\n4. Sesiones: 10–15 habitualmente', notas:'' },
    { tipo:'Órtesis', nombre:'Confección órtesis pie diabético', modalidad:'Ambulatorio', establecimiento:'Hospital de referencia', prioridad:'Preferente', diagnosticos:'E11.5, E14.5', criterios:'1. Derivar a podología / órtesis vía SOME\n2. Adjuntar evaluación LUND 1999\n3. Indicar tipo de calzado actual\n4. Control post órtesis a los 30 días', notas:'GES Diabetes Mellitus tipo 2.' },
  ];

  var TIPO_META = {
    'Prueba Diagnóstica':   { icon:'🔬', color:'#3a86c8', border:'rgba(58,134,200,0.30)' },
    'Imagenología':          { icon:'🩻', color:'#7b5ea7', border:'rgba(123,94,167,0.30)' },
    'Procedimiento':         { icon:'🩺', color:'#1e8a6e', border:'rgba(30,138,110,0.30)' },
    'Cirugía Menor':         { icon:'🩹', color:'#c0392b', border:'rgba(192,57,43,0.30)'  },
    'Rehabilitación Física': { icon:'💪', color:'#d4820a', border:'rgba(212,130,10,0.30)' },
    'Dermatología APS':      { icon:'🧴', color:'#217a3c', border:'rgba(33,122,60,0.30)'  },
    'Órtesis':               { icon:'🦽', color:'#5a7a9a', border:'rgba(90,122,154,0.30)' },
  };
  function getMeta(t){ return TIPO_META[t]||{icon:'📋',color:'var(--blue-500)',border:'rgba(58,134,200,0.25)'}; }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  var filtros    = document.getElementById('procFiltros');
  var grid       = document.getElementById('procGrid');
  var panel      = document.getElementById('procPanel');
  var panelTipo  = document.getElementById('panelTipo');
  var panelNombre= document.getElementById('panelNombre');
  var procDetail = document.getElementById('procDetail');
  var procClose  = document.getElementById('procClose');

  var procs = (window.PROCEDIMIENTOS && window.PROCEDIMIENTOS.length) ? window.PROCEDIMIENTOS : MOCK;

  buildFiltros(procs);
  renderGrid(procs);

  function buildFiltros(data) {
    var tipos = [];
    data.forEach(function(p){ if(tipos.indexOf(p.tipo)===-1) tipos.push(p.tipo); });
    filtros.innerHTML = '<button class="proc-pill active" data-tipo="">Todos</button>';
    tipos.forEach(function(t){
      var m = getMeta(t);
      var btn = document.createElement('button');
      btn.className = 'proc-pill'; btn.dataset.tipo = t;
      btn.innerHTML = m.icon + ' ' + t;
      btn.style.borderColor = m.border;
      filtros.appendChild(btn);
    });
    filtros.querySelectorAll('.proc-pill').forEach(function(btn){
      btn.addEventListener('click', function(){
        filtros.querySelectorAll('.proc-pill').forEach(function(b){ b.classList.remove('active'); });
        btn.classList.add('active');
        renderGrid(btn.dataset.tipo ? data.filter(function(p){ return p.tipo===btn.dataset.tipo; }) : data);
      });
    });
  }

  function renderGrid(data) {
    grid.innerHTML = '';
    if (!data.length) {
      grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Sin procedimientos en esta categoría</div>';
      return;
    }
    // Cards directas — sin banner de sección
    var cardsRow = document.createElement('div');
    cardsRow.className = 'proc-cards-row';
    data.forEach(function(p){
      var m = getMeta(p.tipo);
      var card = document.createElement('div');
      card.className = 'specialty-card'; // mismo estilo que especialidades
      card.style.borderTop = '3px solid ' + m.color;
      card.innerHTML =
        '<div class="sc-icon">' + m.icon + '</div>' +
        '<div class="sc-title">' + esc(p.nombre) + '</div>' +
        '<div class="sc-count" style="color:' + m.color + '">' + esc(p.tipo) + '</div>' +
        (p.establecimiento ? '<div class="sc-desc">📍 ' + esc(p.establecimiento) + '</div>' : '') +
        '<span class="sc-arrow" style="color:' + m.color + '">→</span>';
      card.addEventListener('click', function(){ openPanel(p, m); });
      cardsRow.appendChild(card);
    });
    grid.appendChild(cardsRow);
  }

  function openPanel(p, m) {
    panelTipo.textContent   = m.icon + ' ' + p.tipo;
    panelTipo.style.color   = m.color;
    panelNombre.textContent = p.nombre;
    procDetail.innerHTML =
      '<div class="proc-detail-section"><div class="proc-detail-label">Modalidad</div><div class="proc-detail-value">' + esc(p.modalidad||'—') + '</div></div>' +
      '<div class="proc-detail-section"><div class="proc-detail-label">Establecimiento</div><div class="proc-detail-value">📍 ' + esc(p.establecimiento||'—') + '</div></div>' +
      '<div class="proc-detail-section"><div class="proc-detail-label">Prioridad</div><div class="proc-detail-value">' + esc(p.prioridad||'Normal') + '</div></div>' +
      '<div class="proc-detail-section full"><div class="proc-detail-label">Diagnósticos (CIE-10)</div><div class="proc-detail-value" style="color:var(--blue-700)">' + esc(p.diagnosticos||'—') + '</div></div>' +
      '<div class="proc-detail-section full"><div class="proc-detail-label">Pasos en Rayen</div><div class="proc-detail-value" style="line-height:1.7;white-space:pre-line">' + esc(p.criterios||'—') + '</div></div>' +
      (p.notas ? '<div class="proc-detail-notas">💡 ' + esc(p.notas) + '</div>' : '');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePanel(){ panel.classList.remove('open'); document.body.style.overflow=''; }
  if(procClose) procClose.addEventListener('click', closePanel);
  if(panel) panel.addEventListener('click', function(e){ if(e.target===panel) closePanel(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closePanel(); });

})();
