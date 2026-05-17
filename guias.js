// ═══════════════════════════════════════════════════════════════════════════
// SICMED – Guías Clínicas
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ═══ DATOS BASE (fallback) ═══
  // Se usan si Firebase no carga. Los datos de Firebase tienen prioridad.
  var GUIAS_BASE = [
    {
      id:'endocrino', icono:'🔬', color:'#3a86c8',
      titulo:'Protocolo Endocrinología – SSMOcc v2.0',
      descripcion:'Derivación de patologías tiroideas, suprarrenales y metabólicas al nivel secundario. Res. Exenta N°2568, Nov 2019.',
      secciones:[
        { subtitulo:'Urgencia P0', contenido:'• E035 Coma mixedematoso: sospecha fundada → Urgencia\n• E055 Tormenta tirotóxica: sospecha fundada → Urgencia\n• E060 Tiroiditis aguda: sospecha fundada → Urgencia' },
        { subtitulo:'Alta prioridad P1 (<30 días)', contenido:'• E038 Hipotiroidismo en embarazada (TSH, T4L) → Endocrinología\n• E02X Hipotiroidismo subclínico en embarazada → Endocrinología\n• E059 Hipertiroidismo sospecha fundada / embarazo / postmenopáusica u hombre >55 años (TSH, T4L, T3L) → Endocrinología\n• E061 Tiroiditis subaguda persistente >30 días (TSH, T4L, VHS) → Med. Interna\n• C73X Cáncer tiroides: biopsia + o antecedente <6 meses (Eco + PAAF) → Endocrinología\n• E041 Nódulo TIRADS 4b/4c/5: sólido hipoecogénico con microcalcificaciones ≥5mm → Endocrinología\n• D441 Tumor suprarrenal con síndrome (Cushing, HTA refractaria) → Endocrinología' },
        { subtitulo:'Normal P2 (<6 meses)', contenido:'• E890 Hipotiroidismo post-cirugía Ca tiroides (TSH, T4L) → Endocrinología\n• E032 Hipotiroidismo por fármacos: amiodarona o litio (TSH, T4L) → Med. Interna\n• E039 Hipotiroidismo refractario: TSH elevado en 2 controles con adherencia comprobada → Med. Interna\n• E058 Hipertiroidismo subclínico otras edades: 2 exámenes consecutivos alterados → Med. Interna\n• E041 Nódulo TIRADS 3-4a ≥1 cm: si ≥1.5 cm o TIRADS 4a → PAAF → Endocrinología\n• D441 Incidentaloma suprarrenal asintomático (cortisol, imagen previa) → Endocrinología' },
        { subtitulo:'Nota TIRADS', contenido:'Usar clasificación TIRADS ecográfica. Nódulo quístico puro (TIRADS 2 <1%): control APS con ecografía tiroidea cada 12 meses. No derivar.' },
      ]
    },
    {
      id:'gastro', icono:'🫁', color:'#1e8a6e',
      titulo:'Protocolo Gastroenterología – SSMOcc v2.0',
      descripcion:'Derivación de patologías esofágicas, úlcera péptica, H. pylori, daño hepático e inflamatoria intestinal. Res. Exenta N°2569, Nov 2019.',
      secciones:[
        { subtitulo:'Urgencia P0', contenido:'• K274 Úlcera péptica con hemorragia activa Forrest I-IIB: clínica + EDA urgente → Urgencia' },
        { subtitulo:'Alta prioridad P1', contenido:'• K224 Disfagia motora severa con alteración nutricional (EDA previa) → Gastroenterología\n• K279 Úlcera péptica atípica / múltiple / refractaria 1era línea (EDA + Ureasa) → Gastroenterología\n• K922 Hemorragia digestiva no precisada con EDA normal (Hemograma, hemorragia oculta) → Gastroenterología\n• K861 Pancreatitis crónica con ecografía compatible (amilasa, lipasa, Hemograma) → Gastroenterología\n• K509 Enfermedad de Crohn sospecha (VHS, PCR, colonoscopia) → Gastroenterología\n• K519 Colitis ulcerosa sospecha → Gastroenterología\n• K909 Malabsorción intestinal (albúmina, antitransglutaminasa) → Gastroenterología\n• K900 Enfermedad celíaca (antitransglutaminasa IgA, IgA total) → Gastroenterología\n• K710 Daño hepático colestásico no dilatado → Gastroenterología\n• K716 Transaminasas x3 sin criterios urgencia (GOT, GPT, VHB, VHC, eco) → Med. Interna\n• K754 Hepatitis autoinmune no controlada (ANA, ASMA, IgG) → Gastroenterología\n• D376 Tumor hepático sólido en imágenes (TAC, alfafetoproteína) → Gastroenterología\n• B980 H. pylori refractario 1era línea (test urea en aliento) → GES' },
        { subtitulo:'Normal P2', contenido:'• K228 Disfagia motora no complicada (manometría) → Med. Interna\n• K219 ERGE refractaria 4 meses (EDA, pHmetría) → Med. Interna\n• K20X Esofagitis grado C o D en EDA → Med. Interna\n• K599 SII refractario 3 meses (colonoscopia, Hemograma) → Med. Interna\n• K59 Diarrea crónica refractaria 4 meses → Med. Interna\n• K30X Dispepsia refractaria 6 meses (EDA, H. pylori) → Med. Interna\n• K703 DHC alcohólico (paciente en control COSAM) → Med. Interna\n• R17X Ictericia hepática (vía biliar no dilatada) → Med. Interna' },
      ]
    },
    {
      id:'cv_padi', icono:'🏠', color:'#42A5F5',
      titulo:'Control CV / PADI / PDS',
      descripcion:'Guía de control domiciliario integral para programas PDS, PADI y CPU.',
      secciones:[
        { subtitulo:'1. Diagnósticos frecuentes', contenido:'Z63.6: Problemas relacionados con familiar dependiente\nI10: Hipertensión esencial (GES)\nE11: Diabetes mellitus no insulinodependiente (GES)\nE78.2: Hiperlipidemia mixta\nE66: Obesidad\nN18.1–N18.5: ERC Etapa 1–5 (GES)\nE03: Hipotiroidismo (GES)\nF17.3: Trastorno por uso de tabaco (GES)' },
        { subtitulo:'2. Formularios', contenido:'• Salud Cardiovascular Integral (CI)\n• Índice de Barthel (CI, Ingreso, PDS) → <35 puntos = dependencia severa\n• Minimental Abreviado (CI, Ingreso) → Derivación a Demencia\n• TEST DE PFEIFFER (CI, Ingreso) → Cognitivo adulto mayor\n• AUDIT (CI) → Dependencia alcohol → Derivar programa AA\n• RFAM - Formulario Riesgo Familiar Red Occidente (CI) → CADA 3 AÑOS' },
        { subtitulo:'3. Actividades CONTROLES CV', contenido:'• Control de Salud Cardiovascular (CI)\n• Control Integral con Riesgo (XX) → riesgo leve/moderado/severo (G1, G2, G3)\n• Aplicación AUDIT (CI)\n• Evaluación riesgo familiar RFAM (Gestión) (CI)\n• Consejería de estilos de vida (Todos)' },
      ]
    }
  ];

  // ═══ ELEMENTOS ═══
  var guiaGrid       = document.getElementById('guiaGrid');
  var guiaPanel      = document.getElementById('guiaPanel');
  var guiaPanelCat   = document.getElementById('guiaPanelCat');
  var guiaPanelTitle = document.getElementById('guiaPanelTitle');
  var guiaPanelBody  = document.getElementById('guiaPanelBody');
  var guiaClose      = document.getElementById('guiaClose');
  var guiaTabs       = document.getElementById('guiaTabs');
  var escalasGrid    = document.getElementById('escalasGrid');

  if (guiaTabs)    guiaTabs.style.display    = 'none';
  if (escalasGrid) escalasGrid.style.display = 'none';

  // ═══ UTILIDADES ═══
  function esc(s) {
    if (window.escapeHTML) return window.escapeHTML(s);
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  // ═══ INICIALIZACIÓN ═══
  // Esperar Firebase; si no, usar datos base
  function start() {
    var data = (window.GUIAS && window.GUIAS.length) ? window.GUIAS : GUIAS_BASE;
    renderGuias(data);
  }

  if (window.GUIAS && window.GUIAS.length) {
    start();
  } else {
    document.addEventListener('sicmed:ready', start, { once: true });
    setTimeout(function () {
      if (!guiaGrid || guiaGrid.querySelector('.specialty-card')) return;
      start();
    }, 2000);
  }

  // ═══ GRID DE GUÍAS ═══
  function renderGuias(guias) {
    if (!guiaGrid) return;
    guiaGrid.innerHTML = '';
    guias.forEach(function (g, idx) {
      var card = document.createElement('div');
      card.className = 'specialty-card';
      card.style.animation = 'fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ' + (idx * 0.04) + 's both';
      var nsec = (g.secciones || []).length;
      card.innerHTML =
        '<div class="sc-content">' +
          '<div class="sc-title">' + esc(g.titulo) + '</div>' +
          '<div class="sc-count" style="color:' + (g.color || 'var(--blue-500)') + '">' +
            nsec + ' sección' + (nsec !== 1 ? 'es' : '') +
          '</div>' +
          '<div class="sc-desc">' + esc(g.descripcion || '') + '</div>' +
        '</div>' +
        '<div class="sc-icon">' + (g.icono || '📋') + '</div>' +
        '<span class="sc-arrow" style="color:' + (g.color || 'var(--blue-300)') + '">→</span>';
      card.addEventListener('click', function () { openGuia(g); });
      guiaGrid.appendChild(card);
    });
  }

  // ═══ PANEL DE DETALLE ═══
  function openGuia(g) {
    if (!guiaPanel) return;
    guiaPanelCat.textContent   = (g.icono || '📖') + ' Guía clínica';
    guiaPanelCat.style.color   = g.color || 'var(--blue-500)';
    guiaPanelTitle.textContent = g.titulo;
    guiaPanelBody.innerHTML    = '';

    (g.secciones || []).forEach(function (sec) {
      var blk = document.createElement('div');
      blk.className = 'guia-seccion';
      // Usamos pre-line para respetar saltos de línea de forma segura
      blk.innerHTML =
        '<div class="guia-seccion-titulo" style="color:' + (g.color || 'var(--blue-700)') + '">' +
          esc(sec.subtitulo || '') +
        '</div>' +
        '<div class="guia-seccion-body" style="white-space:pre-line">' +
          esc(sec.contenido || '') +
        '</div>';
      guiaPanelBody.appendChild(blk);
    });

    // ═══ Botones de enlace externo (Google Drive, PDFs, etc.) ═══
    if (Array.isArray(g.botones) && g.botones.length) {
      var btnWrap = document.createElement('div');
      btnWrap.className = 'guia-botones';
      btnWrap.style.cssText =
        'display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;padding-top:20px;' +
        'border-top:1.5px solid rgba(58,134,200,0.18)';
      g.botones.forEach(function (b) {
        if (!b || !b.url) return;
        var a = document.createElement('a');
        a.href   = b.url;
        a.target = '_blank';
        a.rel    = 'noopener noreferrer';
        var accent = g.color || 'var(--blue-500)';
        a.style.cssText =
          'display:inline-flex;align-items:center;gap:8px;' +
          'background:' + accent + ';color:#fff;' +
          'padding:10px 18px;border-radius:30px;' +
          'font-family:\'DM Sans\',sans-serif;font-size:.88rem;font-weight:600;' +
          'text-decoration:none;cursor:pointer;' +
          'box-shadow:0 2px 12px rgba(30,90,153,0.22);' +
          'transition:transform .15s ease, box-shadow .15s ease, opacity .15s ease';
        a.onmouseover = function(){ a.style.transform='translateY(-1px)'; a.style.boxShadow='0 4px 18px rgba(30,90,153,0.32)'; };
        a.onmouseout  = function(){ a.style.transform='';                   a.style.boxShadow='0 2px 12px rgba(30,90,153,0.22)'; };
        a.innerHTML =
          '<span style="font-size:1.05rem;line-height:1">' + esc(b.icono || '🔗') + '</span>' +
          '<span>' + esc(b.label || 'Abrir enlace') + '</span>' +
          '<span style="font-size:.85rem;opacity:.85;margin-left:2px">↗</span>';
        btnWrap.appendChild(a);
      });
      guiaPanelBody.appendChild(btnWrap);
    }

    guiaPanel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeGuia() {
    if (guiaPanel) {
      guiaPanel.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (guiaClose) guiaClose.addEventListener('click', closeGuia);
  if (guiaPanel) guiaPanel.addEventListener('click', function (e) {
    if (e.target === guiaPanel) closeGuia();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeGuia();
  });

})();
