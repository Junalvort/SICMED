// ─── SICMED – Procedimientos ──────────────────────────────────────────────────
(function() {

  var MOCK = [
    // ── A. PRUEBAS DIAGNÓSTICAS ─────────────────────────────────────────────────
    { tipo:'Prueba Diagnóstica', nombre:'Endoscopia Digestiva Alta con test de Ureasa', modalidad:'Endoscopia', establecimiento:'Contralor (CESFAM)', prioridad:'Normal / Alta (sospecha Ca)', diagnosticos:'K25 Úlcera gástrica, D00.2 Ca gástrico, R63.4 Pérdida de peso, K29.7 Gastritis no especificada', criterios:'1. Clasificación diagnóstica
2. Prioridad Normal o Alta (sospecha Ca)
3. Fundamentos clínicos + teléfono del paciente
4. ¿Se resolverá por programa de resolutividad? Sí
5. Derivar a contralor: Sí', notas:'' },
    { tipo:'Prueba Diagnóstica', nombre:'Espirometría', modalidad:'Prueba funcional', establecimiento:'Contralor (CESFAM)', prioridad:'Normal', diagnosticos:'J44.1 EPOC descompensado, J45 Asma bronquial, J96.0 Insuficiencia respiratoria aguda', criterios:'1. Clasificación diagnóstica
2. Prioridad: Normal, Alta (sospecha Ca)
3. Fundamentos clínicos + teléfono
4. ¿Resolutividad? Sí
5. Derivar a contralor: Sí
6. Paciente debe suspender broncodilatadores 4h antes
7. No fumar 4h antes del examen', notas:'Contraindicado en infarto reciente (<1 mes) o neumotórax activo' },
    { tipo:'Prueba Diagnóstica', nombre:'Fondo de Ojo (Presencial)', modalidad:'Oftalmología', establecimiento:'UAPO Cerro Navia', prioridad:'Normal', diagnosticos:'E11 Diabetes Mellitus No insulinodependiente, E11.7 DM2 con múltiples complicaciones', criterios:'1. Clasificación diagnóstica → marcar GES
2. Procedimiento: FONDO DE OJO (Presencial)
3. Prioridad: Normal
4. Extrasistema: NO
5. Establecimiento: UAPO Cerro Navia
6. Fundamentos clínicos + teléfono actualizado
7. ¿Resolutividad? NO
8. Derivar a contralor: SÍ
9. Criterio: Solo DM2 confirmada, frecuencia anual, sin diagnóstico de retinopatía ni cataratas no operada', notas:'Solo DM2 confirmada. No derivar si ya tiene retinopatía confirmada o cataratas no operada' },

    // ── B. IMAGENOLOGÍA ─────────────────────────────────────────────────────────
    { tipo:'Imagenología', nombre:'Ecotomografía Abdominal', modalidad:'Ecografía', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'K80 Colelitiasis, R10 Dolor abdominal en parte superior (R10.1)', criterios:'1. Clasificación diagnóstica
2. Fundamentos clínicos + teléfono
3. Prioridad: Normal
4. ¿Resolutividad? Sí
5. Derivar a contralor: Sí
6. Incluye: hígado, vía biliar, vesícula, páncreas, riñones, bazo, retroperitoneo y grandes vasos', notas:'Código diagnóstico para solicitar: R10.1 Dolor abdominal localizado en parte superior' },
    { tipo:'Imagenología', nombre:'Radiografía de Tórax', modalidad:'Radiografía simple', establecimiento:'Contralor / Convenio UC', prioridad:'Normal', diagnosticos:'J15 Neumonía bacteriana (1 proyección), J45 Asma bronquial (2 proyecciones), J44.9 EPOC', criterios:'1. Clasificación diagnóstica
2. Fundamentos clínicos
3. Prioridad: Normal
4. ¿Resolutividad? Sí
5. Derivar a contralor: Sí
6. J15 Neumonía: Rx tórax 1 proyección (frontal y lateral) – Convenio UC
7. J45 Asma: Rx tórax 2 proyecciones (frontal o lateral) – Convenio UC', notas:'Indicar proyección según diagnóstico: 1 proyección (J15) vs 2 proyecciones (J45/J44)' },
    { tipo:'Imagenología', nombre:'Ecotomografía Mamaria', modalidad:'Ecografía', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'Z12.3 Examen de pesquisa especial para tumor de la mama', criterios:'1. Clasificación diagnóstica
2. Fundamentos clínicos
3. Prioridad: Normal
4. ¿Resolutividad? Sí
5. Derivar a contralor: Sí', notas:'Complementa mamografía en mujeres jóvenes con nódulo' },
    { tipo:'Imagenología', nombre:'Mamografía Bilateral (4 exposiciones)', modalidad:'Radiología simple', establecimiento:'Contralor', prioridad:'Normal / Alta (sospecha Ca)', diagnosticos:'Z12.3 Examen de pesquisa especial para tumor de la mama', criterios:'1. Clasificación diagnóstica
2. Fundamentos clínicos
3. Prioridad Normal o Alta (sospecha Ca)
4. ¿Resolutividad? Sí
5. Derivar a contralor: Sí
6. No aplicar desodorante el día del examen
7. Adjuntar historia mamaria', notas:'GES: Mujeres 50–69 años cada 2 años (pesquisa)' },
    { tipo:'Imagenología', nombre:'Proyecciones Mamográficas Complementarias', modalidad:'Ecografía', establecimiento:'Contralor', prioridad:'Normal / Alta', diagnosticos:'Z12.3 Examen de pesquisa especial para tumor de la mama', criterios:'1. Clasificación diagnóstica
2. Fundamentos clínicos
3. Derivar a contralor: Sí', notas:'Complementario a mamografía bilateral' },
    { tipo:'Imagenología', nombre:'Radiografía de Pelvis (lactante o niño <6 meses)', modalidad:'Radiología simple', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'Q65.4 Subluxación congénita de la cadera, bilateral', criterios:'1. Clasificación diagnóstica
2. Fundamentos clínicos
3. Indicar: Pelvis, cadera o coxofemoral de RN, lactante o niño menor de 6 años', notas:'Usar en pesquisa de displasia del desarrollo de caderas' },

    // ── D. PROCEDIMIENTOS ────────────────────────────────────────────────────────
    { tipo:'Procedimiento', nombre:'Fondo de Ojo (Presencial) – DM2', modalidad:'Procedimiento diagnóstico', establecimiento:'UAPO Cerro Navia', prioridad:'Normal', diagnosticos:'E11 DM2, E11.7 DM2 con múltiples complicaciones', criterios:'1. Clasificación diagnóstica → marcar GES
2. Prioridad: Normal
3. Extrasistema: NO | Establecimiento: UAPO Cerro Navia
4. Fundamentos clínicos + teléfono
5. ¿Resolutividad? NO
6. Derivar a contralor: SÍ
7. Solo DM2 confirmada, anual, sin retinopatía ni cataratas no operada', notas:'Screening anual DM2 confirmada sin retinopatía' },

    // ── E. CIRUGÍA MENOR ─────────────────────────────────────────────────────────
    { tipo:'Cirugía Menor', nombre:'Cirugía Menor – Lesiones Cutáneas', modalidad:'Cirugía ambulatoria', establecimiento:'CESFAM Dr. Albertz', prioridad:'Normal', diagnosticos:'Biopsias cutáneas, fibromas blandos (papilomas, acrocordones), nevus típicos (benignos), verrugas, granuloma piógeno, angiomas, onicocriptosis, cuerpo extraño cutáneo, tumor benigno subcutáneo, lipoma subcutáneo, quiste epidérmico, quiste sebáceo, verruga plantar', criterios:'1. Clasificación diagnóstica
2. Procedimiento: Cirugía menor
3. Prioridad: Normal
4. Extrasistema: NO | Establecimiento: CESFAM Dr. Albertz
5. Fundamentos clínicos + teléfono
6. ¿Resolutividad? NO | Derivar a contralor: SÍ
7. Lesiones hasta 3 cm, describir tamaño y localización
8. Agregar código en fundamento', notas:'NO derivar: lesiones en cara y pliegues (excepto acrocordones), verrugas en lecho ungueal, abscesos en periodos inflamatorios, lesiones malignas de teledermatología para biopsia, lesiones anogenitales, pacientes con TACO' },

    // ── F. REHABILITACIÓN FÍSICA ─────────────────────────────────────────────────
    { tipo:'Rehabilitación Física', nombre:'Kinesioterapia Respiratoria – Patologías Agudas', modalidad:'Ambulatorio', establecimiento:'Hospital Félix Bulnes Cerda', prioridad:'Normal', diagnosticos:'J44.1 EPOC, J45 Asma, J96.0 Insuficiencia respiratoria aguda', criterios:'1. Clasificación diagnóstica
2. Procedimiento: Rehabilitación física
3. Prioridad: Normal
4. Extrasistema: NO | Establecimiento: Hospital Félix Bulnes Cerda (patologías agudas <3 meses evolución)
5. Fundamentos clínicos + teléfono
6. ¿Resolutividad? Sí | Derivar a contralor: SÍ', notas:'Patologías AGUDAS osteomusculares: Hospital Félix Bulnes Cerda (evolución <3 meses)' },
    { tipo:'Rehabilitación Física', nombre:'Kinesioterapia Traumatológica – Patologías Crónicas', modalidad:'Ambulatorio', establecimiento:'Sala RBC (Rehabilitación Base Comunitaria)', prioridad:'Normal', diagnosticos:'M54.5 Lumbago, M75.1 Síndrome manguito rotador, S82 Fractura tibia, M17.1 Artrosis rodilla primaria', criterios:'1. Clasificación diagnóstica
2. Procedimiento: Rehabilitación física
3. Prioridad: Normal
4. Extrasistema: NO | Establecimiento: Sala de Rehabilitación RBC
5. Fundamentos clínicos + teléfono
6. ¿Resolutividad? Sí | Derivar a contralor: SÍ', notas:'Patologías CRÓNICAS osteomusculares: Sala RBC (evolución >3 meses). Sesiones: 10-15 habitualmente' },

    // ── G. DERMATOLOGÍA APS ──────────────────────────────────────────────────────
    { tipo:'Dermatología APS', nombre:'Teledermatología – Consulta Médica Especialidad', modalidad:'Telemedicina', establecimiento:'CESFAM al cual está inscrito', prioridad:'Normal', diagnosticos:'Diagnósticos de patologías dermatológicas acorde (no derivar: verrugas anogenitales, procedimientos quirúrgicos, patología oral, pie diabético, quemaduras agudas, ASI, shock anafiláctico)', criterios:'1. Clasificación diagnóstica
2. Procedimiento: Teledermatología
3. Prioridad: Normal | Extrasistema: NO | Establecimiento: CESFAM inscrito
4. Fundamentos clínicos
5. ¿Resolutividad? NO | Derivar a contralor: SÍ
6. Envío de fotografías previo consentimiento del paciente al correo Referente Teledermatología del CESFAM', notas:'NO derivar: verrugas anogenitales, procedimientos quirúrgicos, patología oral, pie diabético, quemaduras agudas, ASI, shock anafiláctico' },

    // ── H. ÓRTESIS ───────────────────────────────────────────────────────────────
    { tipo:'Órtesis', nombre:'Entrega de Órtesis', modalidad:'Prestación ortésica', establecimiento:'CESFAM al cual está inscrito', prioridad:'Normal', diagnosticos:'GES Órtesis mayores de 65 años. Programa piloto 45-64 años: artrosis cadera/rodilla, dependientes severos, DM2 con úlcera activa de pie (curación avanzada), ACV', criterios:'1. Clasificación diagnóstica
2. Procedimiento: Órtesis
3. Prioridad: Normal | Extrasistema: NO | Establecimiento: CESFAM inscrito
4. Fundamentos clínicos + teléfono
5. ¿Resolutividad? NO | Derivar a contralor: SÍ
6. Realizar previo GES Órtesis en mayores de 65 años', notas:'Mayores de 65 años: GES Órtesis. Pacientes 45-64 años (programa piloto): solo en casos: artrosis cadera/rodilla, dependencia severa, DM2 con úlcera activa de pie (curación avanzada), ACV' },
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
      card.className = 'specialty-card';
      card.innerHTML =
        '<div class="sc-content">' +
          '<div class="sc-title">' + esc(p.nombre) + '</div>' +
          '<div class="sc-count" style="color:' + m.color + '">' + esc(p.tipo) + '</div>' +
          (p.establecimiento ? '<div class="sc-desc">📍 ' + esc(p.establecimiento) + '</div>' : '') +
        '</div>' +
        '<div class="sc-icon">' + m.icon + '</div>' +
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
