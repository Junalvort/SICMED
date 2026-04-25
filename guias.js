// ─── SICMED – Guías y Protocolos (sin escalas) ────────────────────────────────
(function() {
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  var MOCK_GUIAS = [
    { id:'g1', icono:'🫁', color:'#3a86c8', titulo:'Protocolo EPOC y Asma', descripcion:'Diagnóstico, tratamiento escalonado y criterios de derivación para EPOC y asma bronquial.', secciones:[
      { subtitulo:'Diagnóstico', contenido:'Sospecha clínica: disnea, tos crónica, sibilancias.\nConfirmación: espirometría con VEF1/CVF < 0.70 post broncodilatador (EPOC).\nAsma: variabilidad de síntomas y obstrucción reversible (≥12% en VEF1 post BD).' },
      { subtitulo:'Tratamiento escalonado ASMA', contenido:'Escalón 1: SABA a demanda (salbutamol).\nEscalón 2: CI dosis baja + SABA.\nEscalón 3: CI dosis media/alta + LABA.\nEscalón 4: agregar tiotropio o montelukast.\nEscalón 5: derivar a especialista.' },
      { subtitulo:'Criterios derivación', contenido:'• EPOC con VEF1 < 50% o exacerbaciones frecuentes (≥2/año).\n• Asma grave no controlada con tratamiento escalón 3.\n• Sospecha de diagnóstico diferencial.\n• Necesidad de biológicos.' },
    ]},
    { id:'g2', icono:'❤️', color:'#e53935', titulo:'Hipertensión Arterial', descripcion:'Manejo de HTA en APS: metas, fármacos de primera línea y seguimiento.', secciones:[
      { subtitulo:'Clasificación', contenido:'Normal: < 120/80 mmHg\nElevada: 120–129 / < 80 mmHg\nHTA grado 1: 130–139 / 80–89 mmHg\nHTA grado 2: ≥ 140 / ≥ 90 mmHg\nCrisis hipertensiva: ≥ 180/120 mmHg' },
      { subtitulo:'Tratamiento farmacológico', contenido:'Primera línea:\n• IECA (enalapril 10–40 mg/día) — evitar en embarazo\n• ARA II (losartán 50–100 mg/día)\n• Amlodipino 5–10 mg/día\n• Hidroclorotiazida 12.5–25 mg/día\n\nMeta: < 130/80 mmHg en la mayoría.' },
      { subtitulo:'Seguimiento', contenido:'Control al mes de inicio o cambio de terapia.\nControl trimestral si compensado.\nECG basal y cada 2 años.\nCreatinina + ELP: cada 6–12 meses con IECA/ARA II.\nFondo de ojo: cada 2 años.' },
      { subtitulo:'Criterios derivación', contenido:'• HTA refractaria (≥3 fármacos, incl. diurético)\n• HTA secundaria sospechada\n• Daño de órgano blanco severo\n• Emergencia hipertensiva → urgencia' },
    ]},
    { id:'g3', icono:'🩸', color:'#7b5ea7', titulo:'Diabetes Mellitus Tipo 2', descripcion:'Manejo integral DM2 en APS: metas glicémicas, fármacos y seguimiento.', secciones:[
      { subtitulo:'Diagnóstico', contenido:'• Glicemia ayunas ≥ 126 mg/dL (2 mediciones)\n• Glicemia ≥ 200 mg/dL + síntomas\n• HbA1c ≥ 6.5%\n• PTGO: glicemia 2h ≥ 200 mg/dL' },
      { subtitulo:'Metas terapéuticas', contenido:'HbA1c < 7%\nGlicemia ayunas: 80–130 mg/dL\nGlicemia 2h post prandial: < 180 mg/dL\nPA: < 130/80 mmHg\nLDL: < 70 mg/dL (con ECV) / < 100 (sin ECV)' },
      { subtitulo:'Fármacos primera línea', contenido:'1. Metformina 500–2000 mg/día (con comidas)\n2. ISGLT2 (empagliflozina) si ECV o ERC\n3. GLP-1 si obesidad (IMC ≥30)\n4. Insulina si HbA1c > 10% o descompensación' },
      { subtitulo:'Seguimiento APS', contenido:'HbA1c cada 3 meses hasta meta, luego cada 6 meses.\nPA y peso cada control.\nPerfil lipídico anual.\nCreatinina + microalbuminuria anual.\nFondo de ojo cada 1–2 años.\nPodología: revisión de pies en cada control.' },
    ]},
    { id:'g4', icono:'🧠', color:'#1e8a6e', titulo:'Salud Mental APS', descripcion:'Protocolo de tamizaje, manejo y derivación de depresión y ansiedad en APS.', secciones:[
      { subtitulo:'Tamizaje depresión (PHQ-2)', contenido:'1. ¿Poco interés o placer en hacer cosas?\n2. ¿Se ha sentido decaído o sin esperanza?\n\nPuntaje ≥ 3 → aplicar PHQ-9.\nPHQ-9 ≥ 10 → depresión moderada-severa, iniciar tratamiento.' },
      { subtitulo:'Tratamiento depresión leve-moderada', contenido:'• Psicoeducación y apoyo\n• Actividad física ≥ 150 min/semana\n• Sertralina 50 mg/día (primera elección)\n• Fluoxetina 20 mg/día (alternativa)\n• Control a las 2–4 semanas de inicio\n• Duración mínima: 6–12 meses' },
      { subtitulo:'Criterios derivación salud mental', contenido:'• Depresión severa (PHQ-9 ≥ 20)\n• Ideación suicida activa → urgencia\n• Sin respuesta a 2 antidepresivos\n• Trastorno bipolar sospechado\n• Psicosis o abuso de sustancias' },
    ]},
    { id:'g5', icono:'🦴', color:'#d4820a', titulo:'Osteoporosis y Fractura de Cadera', descripcion:'Prevención, diagnóstico y tratamiento de osteoporosis en APS.', secciones:[
      { subtitulo:'Indicaciones DMO', contenido:'• Mujeres ≥ 65 años\n• Hombres ≥ 70 años\n• Postmenopáusicas < 65 años con factores de riesgo\n• Fractura previa por fragilidad\n• Uso de corticoides > 3 meses' },
      { subtitulo:'Clasificación OMS (T-score)', contenido:'Normal: T-score > -1.0\nOsteopenia: -1.0 a -2.5\nOsteoporosis: ≤ -2.5\nOsteoporosis severa: ≤ -2.5 + fractura' },
      { subtitulo:'Tratamiento', contenido:'• Calcio elemental 1000–1200 mg/día\n• Vitamina D 800–1000 UI/día\n• Alendronato 70 mg/semana (primera línea)\n• Control DMO cada 2 años' },
    ]},
    { id:'g6', icono:'🫀', color:'#c0392b', titulo:'Post-IAM — Seguimiento APS', descripcion:'Seguimiento en APS de paciente post infarto agudo al miocardio.', secciones:[
      { subtitulo:'Control post alta (primeras 4 semanas)', contenido:'• Control médico a los 7 días\n• ECG de control\n• Verificar adherencia: antiagregantes, estatina, IECA, betabloqueador\n• Derivar a cardiología rehabilitación' },
      { subtitulo:'Terapia crónica post IAM', contenido:'• AAS 100 mg/día (indefinido)\n• Clopidogrel 75 mg/día (12 meses post stent)\n• Atorvastatina 80 mg/noche (meta LDL < 70)\n• IECA / ARA II\n• Betabloqueador (al menos 3 años)' },
      { subtitulo:'Señales de alarma', contenido:'• Dolor precordial recurrente\n• Disnea progresiva\n• Síncope o presíncope\n• FC < 50 o > 120 lpm\n• PA < 90/60 mmHg' },
    ]},
  ];

  var guiaGrid    = document.getElementById('guiaGrid');
  var guiaPanel   = document.getElementById('guiaPanel');
  var guiaPanelCat   = document.getElementById('guiaPanelCat');
  var guiaPanelTitle = document.getElementById('guiaPanelTitle');
  var guiaPanelBody  = document.getElementById('guiaPanelBody');
  var guiaClose   = document.getElementById('guiaClose');
  var guiaTabs    = document.getElementById('guiaTabs');

  // Clear tabs — no tabs needed, just show guides
  if (guiaTabs) guiaTabs.style.display = 'none';

  // Hide escalas grid if present
  var escalasGrid = document.getElementById('escalasGrid');
  if (escalasGrid) escalasGrid.style.display = 'none';

  var guias = (window.GUIAS && window.GUIAS.length) ? window.GUIAS : MOCK_GUIAS;
  renderGuias();

  function renderGuias() {
    if (!guiaGrid) return;
    guiaGrid.innerHTML = '';
    guias.forEach(function(g, idx){
      var card = document.createElement('div');
      card.className = 'specialty-card'; // same style as especialidades
      card.style.animation = 'fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ' + (idx*0.04) + 's both';
      card.style.borderTop = '3px solid ' + (g.color||'var(--blue-500)');
      card.innerHTML =
        '<div class="sc-icon">' + (g.icono||'📋') + '</div>' +
        '<div class="sc-title">' + esc(g.titulo) + '</div>' +
        '<div class="sc-count" style="color:' + (g.color||'var(--blue-500)') + '">' + (g.secciones||[]).length + ' sección' + ((g.secciones||[]).length!==1?'es':'') + '</div>' +
        '<div class="sc-desc">' + esc(g.descripcion||'') + '</div>' +
        '<span class="sc-arrow" style="color:' + (g.color||'var(--blue-300)') + '">→</span>';
      card.addEventListener('click', function(){ openGuia(g); });
      guiaGrid.appendChild(card);
    });
  }

  function openGuia(g) {
    if (!guiaPanel) return;
    guiaPanelCat.textContent   = (g.icono||'📖') + ' Guía clínica';
    guiaPanelCat.style.color   = g.color||'var(--blue-500)';
    guiaPanelTitle.textContent = g.titulo;
    guiaPanelBody.innerHTML    = '';
    (g.secciones||[]).forEach(function(sec){
      var blk = document.createElement('div');
      blk.className = 'guia-seccion';
      blk.innerHTML =
        '<div class="guia-seccion-titulo" style="color:' + (g.color||'var(--blue-700)') + '">' + esc(sec.subtitulo||'') + '</div>' +
        '<div class="guia-seccion-body">' + esc(sec.contenido||'').replace(/\n/g,'<br/>') + '</div>';
      guiaPanelBody.appendChild(blk);
    });
    guiaPanel.classList.add('open');
    document.body.style.overflow='hidden';
  }

  function closeGuia(){ if(guiaPanel){ guiaPanel.classList.remove('open'); document.body.style.overflow=''; } }
  if(guiaClose) guiaClose.addEventListener('click', closeGuia);
  if(guiaPanel) guiaPanel.addEventListener('click', function(e){ if(e.target===guiaPanel) closeGuia(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeGuia(); });

})();
