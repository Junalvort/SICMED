// ─── SICMED – Procedimientos ──────────────────────────────────────────────────
(function() {

  var MOCK = [
    // PRUEBAS DIAGNÓSTICAS
    { tipo:'Prueba Diagnóstica', icono:'🔬', nombre:'Endoscopia Digestiva Alta con Test de Ureasa', modalidad:'Endoscopia', establecimiento:'Contralor (CESFAM)', prioridad:'Normal / Alta (sospecha Ca)', diagnosticos:'K25 Úlcera gástrica, D00.2 Ca gástrico, R63.4 Pérdida de peso, K29.7 Gastritis no especificada', criterios:'1. Clasificación diagnóstica\n2. Prioridad Normal o Alta (sospecha Ca)\n3. Fundamentos clínicos + teléfono del paciente\n4. ¿Se resolverá por programa de resolutividad? Sí\n5. Derivar a contralor: Sí', notas:'' },
    { tipo:'Prueba Diagnóstica', icono:'🔬', nombre:'Espirometría', modalidad:'Prueba funcional respiratoria', establecimiento:'Contralor (CESFAM)', prioridad:'Normal', diagnosticos:'J44.1 EPOC descompensado, J45 Asma bronquial, J96.0 Insuficiencia respiratoria aguda', criterios:'1. Clasificación diagnóstica\n2. Prioridad: Normal / Alta (sospecha Ca)\n3. Fundamentos clínicos + teléfono\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí\n6. Paciente debe suspender broncodilatadores 4h antes\n7. No fumar 4h antes del examen', notas:'Contraindicado en infarto reciente (<1 mes) o neumotórax activo' },
    { tipo:'Prueba Diagnóstica', icono:'🔬', nombre:'Fondo de Ojo (Presencial) – DM2', modalidad:'Oftalmología', establecimiento:'UAPO Cerro Navia', prioridad:'Normal (GES)', diagnosticos:'E11 Diabetes Mellitus No insulinodependiente, E11.7 DM2 con múltiples complicaciones', criterios:'1. Clasificación diagnóstica → marcar GES\n2. Procedimiento: FONDO DE OJO (Presencial)\n3. Prioridad: Normal\n4. Extrasistema: NO\n5. Establecimiento: UAPO Cerro Navia\n6. Fundamentos clínicos + teléfono actualizado\n7. ¿Resolutividad? NO\n8. Derivar a contralor: SÍ\n9. Solo DM2 confirmada, frecuencia anual, sin diagnóstico de retinopatía ni cataratas no operada', notas:'Solo DM2 confirmada. No derivar si ya tiene retinopatía confirmada o cataratas no operada' },
    // IMAGENOLOGÍA
    { tipo:'Imagenología', icono:'🩻', nombre:'Ecotomografía Abdominal', modalidad:'Ecografía', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'K80 Colelitiasis, R10.1 Dolor abdominal en parte superior', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos + teléfono\n3. Prioridad: Normal\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí\n6. Incluye: hígado, vía biliar, vesícula, páncreas, riñones, bazo, retroperitoneo y grandes vasos', notas:'Código diagnóstico: R10.1 Dolor abdominal localizado en parte superior' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Radiografía de Tórax', modalidad:'Radiografía simple', establecimiento:'Contralor / Convenio UC', prioridad:'Normal', diagnosticos:'J15 Neumonía bacteriana (1 proyección), J45 Asma bronquial (2 proyecciones), J44.9 EPOC', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos\n3. Prioridad: Normal\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí\n6. J15 Neumonía: 1 proyección (frontal y lateral) – Convenio UC\n7. J45 Asma: 2 proyecciones (frontal o lateral) – Convenio UC', notas:'Indicar proyección según diagnóstico: 1 proyección (J15) vs 2 proyecciones (J45/J44)' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Ecotomografía Mamaria', modalidad:'Ecografía', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'Z12.3 Examen de pesquisa especial para tumor de la mama', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos\n3. Prioridad: Normal\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí', notas:'Complementa mamografía en mujeres jóvenes con nódulo' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Mamografía Bilateral (4 exposiciones)', modalidad:'Radiología simple', establecimiento:'Contralor', prioridad:'Normal / Alta (sospecha Ca)', diagnosticos:'Z12.3 Examen de pesquisa especial para tumor de la mama', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos\n3. Prioridad Normal o Alta (sospecha Ca)\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí\n6. No aplicar desodorante el día del examen\n7. Adjuntar historia mamaria', notas:'GES: Mujeres 50–69 años cada 2 años (pesquisa)' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Radiografía de Pelvis – Lactante/Niño <6 meses', modalidad:'Radiología simple', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'Q65.4 Subluxación congénita de la cadera, bilateral', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos\n3. Indicar: Pelvis, cadera o coxofemoral de RN, lactante o niño menor de 6 años', notas:'Usar en pesquisa de displasia del desarrollo de caderas' },
    // CIRUGÍA MENOR
    { tipo:'Cirugía Menor', icono:'🩹', nombre:'Cirugía Menor – Lesiones Cutáneas', modalidad:'Cirugía ambulatoria', establecimiento:'CESFAM Dr. Albertz', prioridad:'Normal', diagnosticos:'Biopsias cutáneas, fibromas blandos (papilomas, acrocordones), nevus típicos benignos, verrugas, granuloma piógeno, angiomas, onicocriptosis, cuerpo extraño cutáneo, lipoma subcutáneo, quiste epidérmico, quiste sebáceo, verruga plantar', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Cirugía menor\n3. Prioridad: Normal\n4. Extrasistema: NO | Establecimiento: CESFAM Dr. Albertz\n5. Fundamentos clínicos + teléfono\n6. ¿Resolutividad? NO | Derivar a contralor: SÍ\n7. Lesiones hasta 3 cm, describir tamaño y localización\n8. Agregar código en fundamento', notas:'NO derivar: lesiones en cara y pliegues (excepto acrocordones), verrugas en lecho ungueal, abscesos en periodos inflamatorios, lesiones malignas de teledermatología para biopsia, lesiones anogenitales, pacientes con TACO' },
    // REHABILITACIÓN FÍSICA
    { tipo:'Rehabilitación Física', icono:'💪', nombre:'Kinesioterapia Respiratoria – Patologías Agudas', modalidad:'Ambulatorio', establecimiento:'Hospital Félix Bulnes Cerda', prioridad:'Normal', diagnosticos:'J44.1 EPOC, J45 Asma, J96.0 Insuficiencia respiratoria aguda', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Rehabilitación física\n3. Prioridad: Normal\n4. Extrasistema: NO | Establecimiento: Hospital Félix Bulnes Cerda\n5. Fundamentos clínicos + teléfono\n6. ¿Resolutividad? Sí | Derivar a contralor: SÍ', notas:'Patologías AGUDAS osteomusculares (evolución <3 meses) → Hospital Félix Bulnes Cerda' },
    { tipo:'Rehabilitación Física', icono:'💪', nombre:'Kinesioterapia Traumatológica – Patologías Crónicas', modalidad:'Ambulatorio', establecimiento:'Sala RBC (Rehabilitación Base Comunitaria)', prioridad:'Normal', diagnosticos:'M54.5 Lumbago, M75.1 Síndrome manguito rotador, S82 Fractura tibia, M17.1 Artrosis rodilla', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Rehabilitación física\n3. Prioridad: Normal\n4. Extrasistema: NO | Establecimiento: Sala de Rehabilitación RBC\n5. Fundamentos clínicos + teléfono\n6. ¿Resolutividad? Sí | Derivar a contralor: SÍ', notas:'Patologías CRÓNICAS osteomusculares (evolución >3 meses) → Sala RBC. Sesiones: 10-15 habitualmente' },
    // DERMATOLOGÍA APS
    { tipo:'Dermatología APS', icono:'🧴', nombre:'Teledermatología – Consulta Especialidad', modalidad:'Telemedicina', establecimiento:'CESFAM al cual está inscrito', prioridad:'Normal', diagnosticos:'Patologías dermatológicas acorde. No derivar: verrugas anogenitales, procedimientos quirúrgicos, patología oral, pie diabético, quemaduras agudas, ASI, shock anafiláctico', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Teledermatología\n3. Prioridad: Normal | Extrasistema: NO | Establecimiento: CESFAM inscrito\n4. Fundamentos clínicos\n5. ¿Resolutividad? NO | Derivar a contralor: SÍ\n6. Envío de fotografías previo consentimiento al correo Referente Teledermatología del CESFAM', notas:'NO derivar: verrugas anogenitales, procedimientos quirúrgicos, patología oral, pie diabético, quemaduras agudas, ASI, shock anafiláctico' },
    // ÓRTESIS
    { tipo:'Órtesis', icono:'🦽', nombre:'Entrega de Órtesis', modalidad:'Prestación ortésica', establecimiento:'CESFAM al cual está inscrito', prioridad:'Normal', diagnosticos:'GES Órtesis mayores de 65 años. Programa piloto 45-64 años: artrosis cadera/rodilla, dependientes severos, DM2 con úlcera activa de pie (curación avanzada), ACV', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Órtesis\n3. Prioridad: Normal | Extrasistema: NO | Establecimiento: CESFAM inscrito\n4. Fundamentos clínicos + teléfono\n5. ¿Resolutividad? NO | Derivar a contralor: SÍ\n6. Realizar previo GES Órtesis en mayores de 65 años', notas:'Mayores de 65 años: GES Órtesis. Pacientes 45-64 años (piloto): artrosis cadera/rodilla, dependencia severa, DM2 con úlcera activa de pie, ACV' },
  ];

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  var filtros    = document.getElementById('procFiltros');
  var grid       = document.getElementById('procGrid');
  var panel      = document.getElementById('procPanel');
  var panelTipo  = document.getElementById('panelTipo');
  var panelNombre= document.getElementById('panelNombre');
  var procDetail = document.getElementById('procDetail');
  var procClose  = document.getElementById('procClose');

  var COLORS = {
    'Prueba Diagnóstica':   '#3a86c8',
    'Imagenología':          '#7b5ea7',
    'Procedimiento':         '#1e8a6e',
    'Cirugía Menor':         '#c0392b',
    'Rehabilitación Física': '#d4820a',
    'Dermatología APS':      '#217a3c',
    'Órtesis':               '#5a7a9a',
  };
  function getColor(t){ return COLORS[t] || 'var(--blue-500)'; }

  var procs = (window.PROCEDIMIENTOS && window.PROCEDIMIENTOS.length) ? window.PROCEDIMIENTOS : MOCK;

  buildFiltros(procs);
  renderGrid(procs);

  // ── Filtros ──────────────────────────────────────────────────────────────────
  function buildFiltros(data) {
    var tipos = [];
    data.forEach(function(p){ if(tipos.indexOf(p.tipo)===-1) tipos.push(p.tipo); });
    filtros.innerHTML = '<button class="proc-pill active" data-tipo="">Todos</button>';
    tipos.forEach(function(t){
      var btn = document.createElement('button');
      btn.className = 'proc-pill';
      btn.dataset.tipo = t;
      btn.textContent = (data.find(function(p){ return p.tipo===t; })||{}).icono + ' ' + t;
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

  // ── Grid — mismo estilo que guías ────────────────────────────────────────────
  function renderGrid(data) {
    grid.innerHTML = '';
    if (!data.length) {
      grid.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted)">Sin procedimientos en esta categoría</div>';
      return;
    }
    var gridEl = document.createElement('div');
    gridEl.className = 'esp-grid';
    data.forEach(function(p, idx){
      var color = getColor(p.tipo);
      var card  = document.createElement('div');
      card.className = 'specialty-card';
      card.style.animation = 'fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ' + (idx*0.04) + 's both';
      card.innerHTML =
        '<div class="sc-content">' +
          '<div class="sc-title">' + esc(p.nombre) + '</div>' +
          '<div class="sc-count" style="color:' + color + '">' + esc(p.tipo) + '</div>' +
          (p.establecimiento ? '<div class="sc-desc">📍 ' + esc(p.establecimiento) + '</div>' : '') +
        '</div>' +
        '<div class="sc-icon">' + (p.icono||'📋') + '</div>' +
        '<span class="sc-arrow" style="color:' + color + '">→</span>';
      card.addEventListener('click', function(){ openPanel(p); });
      gridEl.appendChild(card);
    });
    grid.appendChild(gridEl);
  }

  // ── Panel detail ─────────────────────────────────────────────────────────────
  function openPanel(p) {
    var color = getColor(p.tipo);
    panelTipo.textContent   = (p.icono||'') + ' ' + p.tipo;
    panelTipo.style.color   = color;
    panelNombre.textContent = p.nombre;
    procDetail.innerHTML =
      '<div class="proc-detail-section"><div class="proc-detail-label">Modalidad</div><div class="proc-detail-value">' + esc(p.modalidad||'—') + '</div></div>' +
      '<div class="proc-detail-section"><div class="proc-detail-label">Establecimiento</div><div class="proc-detail-value">📍 ' + esc(p.establecimiento||'—') + '</div></div>' +
      '<div class="proc-detail-section"><div class="proc-detail-label">Prioridad</div><div class="proc-detail-value">' + esc(p.prioridad||'Normal') + '</div></div>' +
      '<div class="proc-detail-section full"><div class="proc-detail-label">Diagnósticos (CIE-10)</div><div class="proc-detail-value" style="color:' + color + '">' + esc(p.diagnosticos||'—') + '</div></div>' +
      '<div class="proc-detail-section full"><div class="proc-detail-label">Pasos en Rayen</div><div class="proc-detail-value" style="white-space:pre-line;line-height:1.8">' + esc(p.criterios||'—') + '</div></div>' +
      (p.notas ? '<div class="proc-detail-notas">💡 ' + esc(p.notas) + '</div>' : '');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closePanel(){ panel.classList.remove('open'); document.body.style.overflow=''; }
  if(procClose) procClose.addEventListener('click', closePanel);
  if(panel)     panel.addEventListener('click', function(e){ if(e.target===panel) closePanel(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closePanel(); });

})();
