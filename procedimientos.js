// ═══════════════════════════════════════════════════════════════════════════
// SICMED – Procedimientos
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ═══ DATOS BASE (fallback si Firebase no carga) ═══
  const PROC_BASE = [
    { tipo:'Prueba Diagnóstica', icono:'🔬', nombre:'Endoscopia Digestiva Alta con Test de Ureasa', modalidad:'Endoscopia', establecimiento:'Contralor (CESFAM)', prioridad:'Normal / Alta (sospecha Ca)', diagnosticos:'K25 Úlcera gástrica\nD00.2 Ca gástrico\nR63.4 Pérdida de peso\nK29.7 Gastritis no especificada', criterios:'1. Clasificación diagnóstica\n2. Prioridad Normal o Alta (sospecha Ca)\n3. Fundamentos clínicos + teléfono del paciente\n4. ¿Se resolverá por programa de resolutividad? Sí\n5. Derivar a contralor: Sí', notas:'Cambian reglas' },
    { tipo:'Prueba Diagnóstica', icono:'🔬', nombre:'Espirometría', modalidad:'Prueba funcional respiratoria', establecimiento:'Contralor (CESFAM)', prioridad:'Normal', diagnosticos:'J44.1 EPOC descompensado\nJ45 Asma bronquial\nJ96.0 Insuficiencia respiratoria aguda', criterios:'1. Clasificación diagnóstica\n2. Prioridad: Normal / Alta (sospecha Ca)\n3. Fundamentos clínicos + teléfono\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí\n6. Paciente debe suspender broncodilatadores 4h antes\n7. No fumar 4h antes del examen', notas:'Contraindicado en infarto reciente (<1 mes) o neumotórax activo' },
    { tipo:'Prueba Diagnóstica', icono:'🔬', nombre:'Fondo de Ojo (Presencial) – DM2', modalidad:'Oftalmología', establecimiento:'UAPO Cerro Navia', prioridad:'Normal (GES)', diagnosticos:'E11 Diabetes Mellitus No insulinodependiente\nE11.7 DM2 con múltiples complicaciones', criterios:'1. Clasificación diagnóstica → marcar GES\n2. Procedimiento: FONDO DE OJO (Presencial)\n3. Prioridad: Normal\n4. Extrasistema: NO\n5. Establecimiento: UAPO Cerro Navia\n6. Fundamentos clínicos + teléfono actualizado\n7. ¿Resolutividad? NO\n8. Derivar a contralor: SÍ\n9. Solo DM2 confirmada, primer vez: control anual. Si no hay alteraciones: control cada 2 años. Sin diagnóstico de retinopatía ni cataratas no operada', notas:'Solo DM2 confirmada. No derivar si ya tiene retinopatía confirmada o cataratas no operada' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Ecotomografía Abdominal', modalidad:'Ecografía', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'K80 Colelitiasis\nR10.1 Dolor abdominal en parte superior', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos + teléfono\n3. Prioridad: Normal\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí\n6. Incluye: hígado, vía biliar, vesícula, páncreas, riñones, bazo, retroperitoneo y grandes vasos', notas:'Código diagnóstico: R10.1 Dolor abdominal localizado en parte superior' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Radiografía de Tórax', modalidad:'Radiografía simple', establecimiento:'Contralor / Convenio UC', prioridad:'Normal', diagnosticos:'J15 Neumonía bacteriana (1 proyección)\nJ45 Asma bronquial (2 proyecciones)\nJ44.9 EPOC', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos\n3. Prioridad: Normal\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí\n6. J15 Neumonía: 1 proyección (frontal y lateral) – Convenio UC\n7. J45 Asma: 2 proyecciones (frontal o lateral) – Convenio UC', notas:'Indicar proyección según diagnóstico: 1 proyección (J15) vs 2 proyecciones (J45/J44)' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Ecotomografía Mamaria', modalidad:'Ecografía', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'Z12.3 Examen de pesquisa especial para tumor de la mama', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos\n3. Prioridad: Normal\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí', notas:'Complementa mamografía en mujeres jóvenes con nódulo' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Mamografía Bilateral (4 exposiciones)', modalidad:'Radiología simple', establecimiento:'Contralor', prioridad:'Normal / Alta (sospecha Ca)', diagnosticos:'Z12.3 Examen de pesquisa especial para tumor de la mama', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos\n3. Prioridad Normal o Alta (sospecha Ca)\n4. ¿Resolutividad? Sí\n5. Derivar a contralor: Sí\n6. No aplicar desodorante el día del examen\n7. Adjuntar historia mamaria', notas:'GES: Mujeres 50–69 años cada 2 años (pesquisa)' },
    { tipo:'Imagenología', icono:'🩻', nombre:'Radiografía de Pelvis – Lactante/Niño <6 meses', modalidad:'Radiología simple', establecimiento:'Contralor', prioridad:'Normal', diagnosticos:'Q65.4 Subluxación congénita de la cadera, bilateral', criterios:'1. Clasificación diagnóstica\n2. Fundamentos clínicos\n3. Indicar: Pelvis, cadera o coxofemoral de RN, lactante o niño menor de 6 años', notas:'Usar en pesquisa de displasia del desarrollo de caderas' },
    { tipo:'Cirugía Menor', icono:'🩹', nombre:'Cirugía Menor – Lesiones Cutáneas', modalidad:'Cirugía ambulatoria', establecimiento:'CESFAM Dr. Albertz', prioridad:'Normal', diagnosticos:'Biopsias cutáneas, fibromas blandos (papilomas, acrocordones), nevus típicos benignos, verrugas, granuloma piógeno, angiomas, onicocriptosis, cuerpo extraño cutáneo, lipoma subcutáneo, quiste epidérmico, quiste sebáceo, verruga plantar', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Cirugía menor\n3. Prioridad: Normal\n4. Extrasistema: NO | Establecimiento: CESFAM Dr. Albertz\n5. Fundamentos clínicos + teléfono\n6. ¿Resolutividad? NO | Derivar a contralor: SÍ\n7. Lesiones hasta 3 cm, describir tamaño y localización\n8. Agregar código en fundamento', notas:'NO derivar: lesiones en cara y pliegues (excepto acrocordones), verrugas en lecho ungueal, abscesos en periodos inflamatorios, lesiones malignas de teledermatología para biopsia, lesiones anogenitales, pacientes con TACO' },
    { tipo:'Rehabilitación Física', icono:'💪', nombre:'Kinesioterapia Respiratoria – Patologías Agudas', modalidad:'Ambulatorio', establecimiento:'Hospital Félix Bulnes Cerda', prioridad:'Normal', diagnosticos:'J44.1 EPOC\nJ45 Asma\nJ96.0 Insuficiencia respiratoria aguda', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Rehabilitación física\n3. Prioridad: Normal\n4. Extrasistema: NO | Establecimiento: Hospital Félix Bulnes Cerda\n5. Fundamentos clínicos + teléfono\n6. ¿Resolutividad? Sí | Derivar a contralor: SÍ', notas:'Patologías AGUDAS osteomusculares (evolución <3 meses) → Hospital Félix Bulnes Cerda' },
    { tipo:'Rehabilitación Física', icono:'💪', nombre:'Kinesioterapia Traumatológica – Patologías Crónicas', modalidad:'Ambulatorio', establecimiento:'Sala RBC (Rehabilitación Base Comunitaria)', prioridad:'Normal', diagnosticos:'M54.5 Lumbago\nM75.1 Síndrome manguito rotador\nS82 Fractura tibia\nM17.1 Artrosis rodilla', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Rehabilitación física\n3. Prioridad: Normal\n4. Extrasistema: NO | Establecimiento: Sala de Rehabilitación RBC\n5. Fundamentos clínicos + teléfono\n6. ¿Resolutividad? Sí | Derivar a contralor: SÍ', notas:'Patologías CRÓNICAS osteomusculares (evolución >3 meses) → Sala RBC. Sesiones: 10-15 habitualmente' },
    { tipo:'Dermatología APS', icono:'🧴', nombre:'Teledermatología – Consulta Especialidad', modalidad:'Telemedicina', establecimiento:'CESFAM al cual está inscrito', prioridad:'Normal', diagnosticos:'Patologías dermatológicas acorde.\nNO derivar: verrugas anogenitales, procedimientos quirúrgicos, patología oral, pie diabético, quemaduras agudas, ASI, shock anafiláctico', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Teledermatología\n3. Prioridad: Normal | Extrasistema: NO | Establecimiento: CESFAM inscrito\n4. Fundamentos clínicos\n5. ¿Resolutividad? NO | Derivar a contralor: SÍ\n6. Envío de fotografías previo consentimiento al correo Referente Teledermatología del CESFAM', notas:'NO derivar: verrugas anogenitales, procedimientos quirúrgicos, patología oral, pie diabético, quemaduras agudas, ASI, shock anafiláctico' },
    { tipo:'Órtesis', icono:'🦽', nombre:'Entrega de Órtesis', modalidad:'Prestación ortésica', establecimiento:'CESFAM al cual está inscrito', prioridad:'Normal', diagnosticos:'GES Órtesis mayores de 65 años.\nPrograma piloto 45-64 años: artrosis cadera/rodilla, dependientes severos, DM2 con úlcera activa de pie (curación avanzada), ACV', criterios:'1. Clasificación diagnóstica\n2. Procedimiento: Órtesis\n3. Prioridad: Normal | Extrasistema: NO | Establecimiento: CESFAM inscrito\n4. Fundamentos clínicos + teléfono\n5. ¿Resolutividad? NO | Derivar a contralor: SÍ\n6. Realizar previo GES Órtesis en mayores de 65 años', notas:'Mayores de 65 años: GES Órtesis. Pacientes 45-64 años (piloto): artrosis cadera/rodilla, dependencia severa, DM2 con úlcera activa de pie, ACV' },
  ];

  const TYPE_COLORS = {
    'Prueba Diagnóstica':   '#3a86c8',
    'Imagenología':         '#7b5ea7',
    'Procedimiento':        '#1e8a6e',
    'Cirugía Menor':        '#c0392b',
    'Rehabilitación Física':'#d4820a',
    'Dermatología APS':     '#217a3c',
    'Órtesis':              '#5a7a9a',
  };

  // ═══ ELEMENTOS ═══
  const el = {
    grid:       document.getElementById('procGrid'),
    panel:      document.getElementById('procPanel'),
    panelTipo:  document.getElementById('panelTipo'),
    panelNombre:document.getElementById('panelNombre'),
    procDetail: document.getElementById('procDetail'),
    procClose:  document.getElementById('procClose')
  };

  // ═══ UTILIDADES ═══
  function escapeHTML(str) {
    if (window.escapeHTML) return window.escapeHTML(str);
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // Respeta saltos de línea de forma segura
  function multiline(str) {
    if (!str) return '–';
    return escapeHTML(str).replace(/\n/g, '<br>');
  }

  function getColor(tipo) {
    return TYPE_COLORS[tipo] || 'var(--blue-500)';
  }

  // ═══ INICIALIZACIÓN ═══
  // Esperar a que Firebase cargue; si no, usar datos base
  function start() {
    const data = (window.PROCEDIMIENTOS && window.PROCEDIMIENTOS.length)
      ? window.PROCEDIMIENTOS
      : PROC_BASE;
    renderGrid(data);
    attachListeners();
    console.log('✓ Procedimientos cargados:', data.length);
  }

  // Si Firebase ya está lista, iniciamos; si no, esperamos el evento
  if (window.PROCEDIMIENTOS && window.PROCEDIMIENTOS.length) {
    start();
  } else {
    document.addEventListener('sicmed:ready', start, { once: true });
    // Fallback: si el evento nunca llega (GitHub Pages sin Firebase), cargar datos base
    setTimeout(() => {
      if (!el.grid || el.grid.querySelector('.esp-grid')) return;
      start();
    }, 2000);
  }

  // ═══ GRID ═══
  function renderGrid(data) {
    if (!el.grid) return;
    el.grid.innerHTML = '';

    if (!data.length) {
      el.grid.innerHTML = `<div style="text-align:center;padding:60px 20px;color:var(--text-muted)">No hay procedimientos disponibles</div>`;
      return;
    }

    const gridEl = document.createElement('div');
    gridEl.className = 'esp-grid';

    data.forEach((proc, i) => {
      const card = document.createElement('div');
      card.className = 'specialty-card';
      card.style.animation = `fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ${i * 0.04}s both`;
      const color = getColor(proc.tipo);
      card.innerHTML = `
        <div class="sc-content">
          <div class="sc-title">${escapeHTML(proc.nombre)}</div>
          <div class="sc-count" style="color:${color}">${escapeHTML(proc.tipo || '')}</div>
          ${proc.establecimiento ? `<div class="sc-desc">📍 ${escapeHTML(proc.establecimiento)}</div>` : ''}
        </div>
        <div class="sc-icon">${proc.icono || ''}</div>
        <span class="sc-arrow" style="color:${color}">→</span>
      `;
      card.addEventListener('click', () => openPanel(proc));
      gridEl.appendChild(card);
    });

    el.grid.appendChild(gridEl);
  }

  // ═══ PANEL DE DETALLE ═══
  function openPanel(proc) {
    const color = getColor(proc.tipo);
    el.panelTipo.textContent  = proc.tipo;
    el.panelTipo.style.color  = color;
    el.panelNombre.textContent = proc.nombre;

    el.procDetail.innerHTML = `
      <div class="proc-detail-left">
        ${proc.modalidad      ? detailField('Modalidad', escapeHTML(proc.modalidad)) : ''}
        ${proc.prioridad      ? detailField('Prioridad', escapeHTML(proc.prioridad)) : ''}
        ${proc.establecimiento ? detailField('📍 Establecimiento', escapeHTML(proc.establecimiento)) : ''}
      </div>
      <div class="proc-detail-right">
        ${proc.diagnosticos ? `
          <div class="proc-detail-section">
            <div class="proc-detail-label">Diagnósticos</div>
            <div class="proc-detail-value" style="white-space:pre-line">${escapeHTML(proc.diagnosticos)}</div>
          </div>` : ''}
      </div>
      ${proc.criterios ? `
        <div class="proc-detail-section full">
          <div class="proc-detail-label">Criterios de Derivación</div>
          <div class="proc-detail-value" style="white-space:pre-line;line-height:1.7">${escapeHTML(proc.criterios)}</div>
        </div>` : ''}
      ${proc.notas ? `
        <div class="proc-detail-notas">
          <div class="proc-detail-label" style="color:#f57c00;font-weight:700">💡 Notas Importantes</div>
          <div class="proc-detail-value" style="white-space:pre-line;line-height:1.6">${escapeHTML(proc.notas)}</div>
        </div>` : ''}
    `;

    el.panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function detailField(label, valueHTML) {
    return `
      <div class="proc-detail-section">
        <div class="proc-detail-label">${label}</div>
        <div class="proc-detail-value">${valueHTML}</div>
      </div>`;
  }

  function closePanel() {
    el.panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ═══ LISTENERS ═══
  function attachListeners() {
    if (el.procClose) el.procClose.addEventListener('click', closePanel);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && el.panel && el.panel.classList.contains('open')) closePanel();
    });

    if (el.panel) {
      el.panel.addEventListener('click', (e) => {
        if (e.target === el.panel) closePanel();
      });
    }
  }

})();
