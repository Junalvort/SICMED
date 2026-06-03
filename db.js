// ─── SICMED — Base de datos con Firebase Firestore ────────────────────────────
// Estrategia: Firebase se carga como módulo ES6 dentro de este script.
// Las variables DB, searchDB, STORE_save, STORE_delete, STORE_getLog
// se exponen en window.* para que app.js, admin.js, etc. puedan usarlas.

(async function () {

  // ── Configuración Firebase ──────────────────────────────────────────────────
  const FIREBASE_CONFIG = {
    apiKey:            "AIzaSyAbT9L872CeyMcIuwHtK5UjyA3jJKAF8i0",
    authDomain:        "derivmed.firebaseapp.com",
    projectId:         "derivmed",
    storageBucket:     "derivmed.firebasestorage.app",
    messagingSenderId: "742083987090",
    appId:             "1:742083987090:web:9c9c32ca82a82cd882484b"
  };

  // ── Datos base del protocolo SSMOCC ────────────────────────────────────────

  // ── Especialidades base ────────────────────────────────────────────────────
  const ESP_BASE = [
    { nombre:"Endocrinología",    icon:"🔬", desc:"Tiroides, suprarrenales, metabolismo" },
    { nombre:"Gastroenterología", icon:"🫁", desc:"Aparato digestivo, hígado, páncreas" },
    { nombre:"Hematología",       icon:"🩸", desc:"Enfermedades de la sangre y coagulación" },
    { nombre:"Nefrología",        icon:"🫘", desc:"Riñón, ERC, síndrome nefrótico" },
    { nombre:"Neurología",        icon:"🧠", desc:"Sistema nervioso, cefaleas, movimientos" },
    { nombre:"Oftalmología",      icon:"👁️", desc:"Enfermedades oculares y visuales" },
    { nombre:"Cirugía Bariátrica",icon:"⚖️", desc:"Programa obesidad HSJD" },
    { nombre:"Medicina Interna",        icon:"🏥", desc:"Patología general ambulatoria" },
    { nombre:"Otorrinolaringología",     icon:"👂", desc:"Oído, nariz, garganta, vértigo, epistaxis" },
    { nombre:"Otorrinolaringología Infantil", icon:"👶", desc:"ORL pediátrico, amígdalas, adenoides" },
  ];

  const DB_BASE = [
    { cie10:"E035",  nombre:"Coma mixedematoso", sinonimos:["coma mixedema","mixedema"], especialidad:"Endocrinología", destino:"Urgencia", prioridad:"P0", criterios:"Sospecha fundada", examenes:"Clínica suficiente", notas:"Derivar directamente a urgencia" },
    { cie10:"F199",  nombre:"Trastornos por consumo de sustancias", sinonimos:["consumo sustancias","adiccion","drogas alcohol","TCS"], especialidad:"Salud Mental Adultos", destino:"CSMC / DESAM", prioridad:"GES", criterios:"Protocolo de criterios de derivación en construcción (F10-F19)", examenes:"N/A", notas:"Protocolo en construcción" },
  ];
// ── Array global en memoria ─────────────────────────────────────────────────
  window.DB = [];

  // ── Inicializar Firebase ────────────────────────────────────────────────────
  const { initializeApp }    = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const { getFirestore, collection, getDocs, getDoc, doc, setDoc,
          deleteDoc, addDoc, query, orderBy, Timestamp }
    = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

  const app = initializeApp(FIREBASE_CONFIG);
  const fdb  = getFirestore(app);

  const COL_DIAG = "diagnosticos";
  const COL_LOG  = "historial";

  // ── Cargar diagnósticos desde Firestore ────────────────────────────────────
  try {
    const snap = await getDocs(collection(fdb, COL_DIAG));
    const existingCies = new Set();
    if (!snap.empty) {
      snap.forEach(d => {
        const data = d.data();
        window.DB.push(data);
        existingCies.add(data.cie10);
      });
    }
    // Sincronizar items base que no estén en Firestore
    for (const d of DB_BASE) {
      if (!existingCies.has(d.cie10)) {
        await setDoc(doc(fdb, COL_DIAG, d.cie10), d);
        window.DB.push(d);
        existingCies.add(d.cie10);
      }
    }
  } catch (e) {
    // Si falla Firebase usar datos base locales
    console.warn("Firebase no disponible, usando datos locales:", e);
    window.DB.push(...DB_BASE);
  }

  // ── Funciones globales ──────────────────────────────────────────────────────


  // ── Array global de especialidades ─────────────────────────────────────────
  window.ESPECIALIDADES = [];
  const COL_ESP = "especialidades";

  // Cargar especialidades
  try {
    const snapEsp = await getDocs(collection(fdb, COL_ESP));
    const existingNames = new Set();
    if (!snapEsp.empty) {
      snapEsp.forEach(d => {
        const data = d.data();
        window.ESPECIALIDADES.push(data);
        existingNames.add(data.nombre);
      });
    }
    // Sincronizar especialidades base que no estén en Firestore
    for (const e of ESP_BASE) {
      if (!existingNames.has(e.nombre)) {
        await setDoc(doc(fdb, COL_ESP, e.nombre), e);
        window.ESPECIALIDADES.push(e);
      }
    }
    window.ESPECIALIDADES.sort((a,b) => a.nombre.localeCompare(b.nombre, "es"));
  } catch(e) {
    window.ESPECIALIDADES.push(...ESP_BASE);
  }

  // ── Procedimientos ──────────────────────────────────────────────────────────
  const COL_PROC = "procedimientos";
  window.PROCEDIMIENTOS = [];

  const PROC_BASE = [
    { id:"prueba_dx", tipo:"Prueba Diagnóstica", icono:"🔬", nombre:"Endoscopia Digestiva Alta con test de Ureasa", modalidad:"Endoscopia", establecimiento:"Contralor", prioridad:"Normal / Alta (sospecha Ca)", diagnosticos:"K25 Úlcera gástrica, D00.2 Ca gástrico, R63.4 Pérdida de peso, K29.7 Gastritis no especificada", criterios:"Clasificación diagnóstica. Prioridad Normal o Alta (sospecha Ca). Fundamentos clínicos + teléfono. ¿Resolutividad? Sí. Derivar a contralor: Sí", notas:"" },
    { id:"eco_mamaria", tipo:"Imagenología", icono:"🩻", nombre:"Ecotomografía Mamaria", modalidad:"Ecografía", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"Z12.3 Examen de pesquisa especial para tumor de la mama", criterios:"Clasificación diagnóstica. Fundamentos clínicos. Prioridad Normal. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"mamo_comp", tipo:"Imagenología", icono:"🩻", nombre:"Proyecciones Mamográficas Complementarias", modalidad:"Ecografía", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"Z12.3 Examen de pesquisa especial para tumor de la mama", criterios:"Clasificación diagnóstica. Fundamentos clínicos. Prioridad Normal. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"mamografia", tipo:"Imagenología", icono:"🩻", nombre:"Mamografía Bilateral (4 exp.)", modalidad:"Radiología simple", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"Z12.3 Examen de pesquisa especial para tumor de la mama", criterios:"Clasificación diagnóstica. Fundamentos clínicos. Prioridad Normal. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"rx_pelvis", tipo:"Imagenología", icono:"🩻", nombre:"Radiografía Pelvis (lactante o niño < 6 años)", modalidad:"Radiología simple", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"Q65.4 Subluxación congénita de la cadera, bilateral", criterios:"Clasificación diagnóstica. Fundamentos clínicos. Prioridad Normal. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"eco_abdominal", tipo:"Imagenología", icono:"🩻", nombre:"Ecotomografía Abdominal", modalidad:"Ecografía", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"K80 Colelitiasis, R10 Dolor abdominal parte superior", criterios:"Incluye hígado, vía biliar, vesícula, páncreas, riñones, bazo, retroperitoneo y grandes vasos. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"rx_torax", tipo:"Imagenología", icono:"🩻", nombre:"Radiografía de Tórax", modalidad:"Radiografía", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"J15 Neumonía bacteriana, J45 Asma bronquial, J44.9 EPOC", criterios:"Frontal y lateral (incluye fluoroscopia) 1-2 proy. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"fondo_ojo", tipo:"Procedimiento", icono:"👁️", nombre:"Fondo de Ojo (Presencial)", modalidad:"Fondo de ojo", establecimiento:"UAPO Cerro Navia", prioridad:"Normal", diagnosticos:"E11 Diabetes Mellitus No insulinodependiente, E11.7 DM con múltiples complicaciones", criterios:"Solo DM2 confirmada. Primer vez: Frecuencia anual, si no hay trastornos continuar control cada dos años. Sin diagnóstico confirmado de retinopatía o cataratas no operada. Marcar GES. Extrasistema: No. Resolutividad: No. Derivar a contralor: Sí", notas:"Extrasistema: NO. GES obligatorio." },
    { id:"cirugia_menor", tipo:"Cirugía Menor", icono:"🩹", nombre:"Cirugía Menor", modalidad:"Cirugía menor", establecimiento:"Cesfam Dr. Albertz", prioridad:"Normal", diagnosticos:"Biopsias cutáneas, fibromas blandos, papilomas, acrocordones, nevus típicos, verrugas, granuloma piógeno, angiomas, onicocriptosis, cuerpo extraño cutáneo, tumor benigno subcutáneo, lipoma, quiste epidérmico, quiste sebáceo, verruga plantar", criterios:"Lesiones hasta 3 cm. Describir tamaño y localización. Extrasistema: No. Resolutividad: No. Derivar a contralor: Sí. Agregar código CIE-10 y teléfono en fundamento.", notas:"NO derivar: lesiones en cara/pliegues (excepto acrocordones), abscesos en periodo inflamatorio, lesiones sospechosas de malignidad de teledermatología, lesiones anogenitales, pacientes con TACO." },
    { id:"rehab_adulto", tipo:"Rehabilitación Física", icono:"💪", nombre:"Evaluación y Tratamiento por Rehabilitación Física (Adulto)", modalidad:"Rehabilitación", establecimiento:"Hospital Félix Bulnes Cerda / Sala RBC", prioridad:"Normal", diagnosticos:"Patologías agudas y crónicas osteomusculares", criterios:"Patologías AGUDAS (<3 meses evolución) → Hospital Félix Bulnes Cerda. Patologías CRÓNICAS (>3 meses evolución) → Sala RBC. Fundamentos clínicos + teléfono. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"telederma", tipo:"Dermatología APS", icono:"🧴", nombre:"Teledermatología (Consulta Médica Especialidad Dermatología)", modalidad:"Teledermatología", establecimiento:"Cesfam al cual esté inscrito", prioridad:"Normal", diagnosticos:"Patologías dermatológicas (ver indicaciones)", criterios:"Diagnósticos de dermatología acorde. Envío de fotografías con consentimiento al correo referente según Cesfam. Extrasistema: No. Resolutividad: No. Derivar a contralor: Sí", notas:"NO derivar: verrugas anogenitales, procedimientos quirúrgicos, patología oral, pie diabético, quemaduras agudas, shock anafiláctico." },
    { id:"ortesis", tipo:"Órtesis", icono:"🦽", nombre:"Entrega de Órtesis", modalidad:"Órtesis", establecimiento:"Cesfam al cual esté inscrito", prioridad:"Normal", diagnosticos:"Adultos ≥65 años (GES). 45-64 años programa piloto: artrosis cadera/rodilla, dependientes severos, DM2 con úlcera activa, ACV, amputaciones EEII, lesión medular, síndrome Post-UCI", criterios:"Previo GES Órtesis en mayores de 65 años. Programa piloto 45-64 años para casos específicos. Fundamentos clínicos + teléfono. Extrasistema: No. Resolutividad: No. Derivar a contralor: Sí", notas:"Órtesis disponibles: Bastón con codera móvil, Andador con/sin ruedas, Silla de ruedas, Cojín Anti-escaras, Colchón Anti-escaras." },
  ];

  try {
    const snapProc = await getDocs(collection(fdb, COL_PROC));
    const existingIds = new Set();
    if (!snapProc.empty) {
      snapProc.forEach(d => {
        const data = d.data();
        window.PROCEDIMIENTOS.push(data);
        existingIds.add(data.id);
      });
    }
    // Sincronizar procedimientos base que no estén en Firestore
    for (const p of PROC_BASE) {
      if (!existingIds.has(p.id)) {
        await setDoc(doc(fdb, COL_PROC, p.id), p);
        window.PROCEDIMIENTOS.push(p);
      }
    }
  } catch(e) {
    window.PROCEDIMIENTOS.push(...PROC_BASE);
  }


  // ── Guías ─────────────────────────────────────────────────────────────────
  const COL_GUIA = "guias";
  window.GUIAS = [];

  const GUIA_BASE = [
    {
      id: "cv_padi",
      titulo: "Control CV / PADI / PDS",
      icono: "🏠",
      color: "#42A5F5",
      descripcion: "Guía de control domiciliario integral para programas PDS, PADI y CPU",
      secciones: [
        {
          subtitulo: "1. Diagnósticos frecuentes",
          contenido: "Z63.6: Problemas relacionados con familiar dependiente\nI10: Hipertensión esencial (GES)\nE11: Diabetes mellitus no insulinodependiente (GES)\nE78.2: Hiperlipidemia mixta\nE66: Obesidad\nN18.1–N18.5: ERC Etapa 1–5 (GES)\nE03: Hipotiroidismo (GES)\nF17.3: Trastorno por uso de tabaco (GES)\nZ76.0: Consulta para repetición de receta\nZ99-1: Órtesis (GES)\nZ00: Examen médico general (solo revisión de exámenes sin síntomas)\nR10.1: Dolor abdominal superior → Ecografía abdominal\nK29.7: Gastritis no especificada → Endoscopia con test de ureasa\nH52.7: Trastorno de refracción → Anteojos GES/NOGES\nJ15: Neumonía bacteriana → Rx tórax (Convenio UC)\nJ45: Asma → Rx tórax 2 proyecciones (Convenio UC)"
        },
        {
          subtitulo: "2. Formularios",
          contenido: "• Salud Cardiovascular Integral (CI)\n• Índice de Barthel (CI, Ingreso, PDS) → <35 puntos = dependencia severa\n• Minimental Abreviado (CI, Ingreso) → Derivación a Demencia\n• TEST DE PFEIFFER (CI, Ingreso) → Cognitivo adulto mayor\n• AUDIT (CI) → Dependencia alcohol → Derivar programa AA\n• ASISST → Dependencia sustancias (Terapeuta)\n• Programa Dependencia PADDS y CPU (CI, PDS)\n• PADPDS-CPU Elaboración plan consensuado (CI, PDS)\n• RFAM - Formulario Riesgo Familiar Red Occidente (CI) → CADA 3 AÑOS\n• Formulario Control Otros Programas de Salud (Controles ERA, CI)\n• NECPAL 4 (CPU) → Registrar P1…P12 en ficha como positiva o no"
        },
        {
          subtitulo: "3. Actividades CONTROLES CV",
          contenido: "• Control de Salud Cardiovascular (CI)\n• Control Integral con Riesgo (XX) → riesgo leve/moderado/severo (G1, G2, G3)\n• Aplicación AUDIT (CI)\n• Evaluación riesgo familiar RFAM (Gestión) (CI)\n• AG_Aplicación RFAM-Riesgo (XX) → Si RFAM realizado en <3 años (CI)\n• Consejería de estilos de vida (Todos)"
        },
        {
          subtitulo: "3. Actividades PDS/PADI",
          contenido: "• Control de Salud Cardiovascular (CI)\n• Control Integral con Riesgo (XX)\n• Aplicación AUDIT (CI)\n• Evaluación riesgo familiar RFAM (Gestión)\n• AG_Aplicación RFAM-Riesgo (XX) → Si <3 años\n• Consejería de estilos de vida (Todos)\n• Consejerías familiares - Temas Prioridad - Con integrante dependiente severo (Ind)\n• Aplicación de Barthel (CI, ingresos)\n• Tratamientos y/o procedimientos en domicilio - personas con dependencia severa (no oncológicos)\n• Visita domiciliaria integral PADDS - Dependencia severa sin demencia / no terminal - Ingreso PADDS\n• Ingresos PADDS - Ingreso persona con dependencia severa - Plan de cuidado integral (vía ECICEP)\n• Visita domiciliaria integral PADDS - Dependencia severa CON diagnóstico de demencia"
        },
        {
          subtitulo: "3. Actividades CPU",
          contenido: "• Visita domiciliaria tratamiento/procedimiento/rehabilitación - APS-CPU\n• Visita Domiciliaria Integral ingreso - APS-CPU\n• Visita Domiciliaria Integral seguimiento - APS-CPU\n• Tratamientos y/o Procedimientos en Domicilio - Personas con dependencia severa oncológicos\n• Morbilidad, control CPU\n\nVISITA PERDIDA:\n• Visita Domiciliaria Perdida\n• AG_Visita domiciliaria perdida por falta de transporte\n• Llamada Telefónica Perdida"
        },
        {
          subtitulo: "4. Documentación",
          contenido: "• Certificados, GES y documentación ELEAM: Firmar y dejar en BOX ADMINISTRATIVO. Si se puede dejar copia excelente; si no, llamar a familiar (firma como apoderado).\n• Paraclínicos y controles: Dejar en poder del paciente las impresiones junto con carnet de control. Control integral → sección de control. Morbilidad → sección de morbilidad."
        },
        {
          subtitulo: "5. Peso en paciente con dependencia",
          contenido: "Mediciones de: Perímetro braquial, longitud de rodilla y cálculo aproximado de peso y talla (CALCULADORA)."
        },
        {
          subtitulo: "6. Actualizar Excel PDS",
          contenido: "⚠️ ACTUALIZAR EXCEL DE PDS CON FECHA ACTUAL DE CONTROL INTEGRAL."
        },
        {
          subtitulo: "7. Derivaciones a Hospital",
          contenido: "• A criterio clínico: Dejar estipulado en historia clínica si presenta alteraciones que puedan comprometer la salud. Incluir PERTINENTES NEGATIVOS.\n• Especificar cambios en registro de controles de carnet.\n• Llamar al hospital comentando el caso si es necesario.\n• Llenar datos específicos de la patología. Paciente/familiar lee y firma desistimiento de derivación.\n• Si el paciente es aceptado: Anotar nombre del médico del HFBC, lugar de aceptación (normalmente triage). Mandar copia de interconsulta a jefe de programa para gestionar ambulancia. Copia original queda con el cuidador/paciente."
        },
        {
          subtitulo: "9. RFAM — Pasos",
          contenido: "a. Formulario (Pauta de valoración) → Salud familiar → RFAM - Formulario Riesgo Familiar Red Occidente (1 alta es suficiente)\nb. Ficha familiar (icono): Seleccionar evaluación familiar → Agregar → Riesgo Alto → Guardar\nc. Actividad: Evaluación de riesgo familiar RFAM (Gestión) (CI) / AG_Aplicación RFAM-Riesgo (XX) → Si tiene RFAM en <3 años (CI)"
        }
      ]
    }
  ];

  try {
    const snapGuia = await getDocs(collection(fdb, COL_GUIA));
    if (snapGuia.empty) {
      for (const g of GUIA_BASE) {
        await setDoc(doc(fdb, COL_GUIA, g.id), g);
        window.GUIAS.push(g);
      }
    } else {
      snapGuia.forEach(d => window.GUIAS.push(d.data()));
    }
  } catch(e) {
    window.GUIAS.push(...GUIA_BASE);
  }

  window.GUIA_save = async function(guia) {
    try {
      await setDoc(doc(fdb, COL_GUIA, guia.id), guia);
      const idx = window.GUIAS.findIndex(g => g.id === guia.id);
      if (idx !== -1) window.GUIAS[idx] = guia;
      else window.GUIAS.push(guia);
    } catch(e) { console.error("Error guardando guía:", e); throw e; }
  };

  window.GUIA_delete = async function(id) {
    try {
      await deleteDoc(doc(fdb, COL_GUIA, id));
      const idx = window.GUIAS.findIndex(g => g.id === id);
      if (idx !== -1) window.GUIAS.splice(idx, 1);
    } catch(e) { console.error("Error eliminando guía:", e); throw e; }
  };

  window.PROC_save = async function(proc) {
    try {
      await setDoc(doc(fdb, COL_PROC, proc.id), proc);
      const idx = window.PROCEDIMIENTOS.findIndex(p => p.id === proc.id);
      if (idx !== -1) window.PROCEDIMIENTOS[idx] = proc;
      else window.PROCEDIMIENTOS.push(proc);
    } catch(e) { console.error("Error guardando procedimiento:", e); throw e; }
  };

  window.PROC_delete = async function(id) {
    try {
      await deleteDoc(doc(fdb, COL_PROC, id));
      const idx = window.PROCEDIMIENTOS.findIndex(p => p.id === id);
      if (idx !== -1) window.PROCEDIMIENTOS.splice(idx, 1);
    } catch(e) { console.error("Error eliminando procedimiento:", e); throw e; }
  };

  window.ESP_save = async function(esp) {
    // esp = { nombre, icon, desc }
    try {
      await setDoc(doc(fdb, COL_ESP, esp.nombre), esp);
      const idx = window.ESPECIALIDADES.findIndex(e => e.nombre === esp.nombre);
      if (idx !== -1) window.ESPECIALIDADES[idx] = esp;
      else window.ESPECIALIDADES.push(esp);
      window.ESPECIALIDADES.sort((a,b) => a.nombre.localeCompare(b.nombre, "es"));
    } catch(e) { console.error("Error guardando especialidad:", e); throw e; }
  };

  window.ESP_delete = async function(nombre) {
    try {
      await deleteDoc(doc(fdb, COL_ESP, nombre));
      const idx = window.ESPECIALIDADES.findIndex(e => e.nombre === nombre);
      if (idx !== -1) window.ESPECIALIDADES.splice(idx, 1);
    } catch(e) { console.error("Error eliminando especialidad:", e); throw e; }
  };


  // ── Escalas aplicadas (Calculadora) ──────────────────────────────────────
  const COL_ESCALAS = "escalas_aplicadas";
  const ESCALAS_TTL_MS = 5 * 24 * 60 * 60 * 1000; // 5 días

  window.ESCALAS_save = async function(record) {
    // record = { paciente, escala, puntaje, interpretacion, respuestas, fecha }
    try {
      const ref = await addDoc(collection(fdb, COL_ESCALAS), {
        ...record,
        fecha: Timestamp.now()
      });
      return ref.id;
    } catch(e) { console.error("Error guardando escala:", e); return null; }
  };

  window.ESCALAS_getRecent = async function() {
    try {
      const cutoff = Timestamp.fromDate(new Date(Date.now() - ESCALAS_TTL_MS));
      const q = query(
        collection(fdb, COL_ESCALAS),
        orderBy("fecha", "desc")
      );
      const snap = await getDocs(q);
      const results = [];
      for (const d of snap.docs) {
        const data = d.data();
        const fecha = data.fecha?.toDate();
        if (fecha && (Date.now() - fecha.getTime()) > ESCALAS_TTL_MS) {
          // Auto-delete expired records
          await deleteDoc(doc(fdb, COL_ESCALAS, d.id));
        } else {
          results.push({ id: d.id, ...data, fecha: fecha?.toISOString() });
        }
      }
      return results;
    } catch(e) { return []; }
  };

  window.searchDB = function(query_str) {
    if (!query_str || query_str.trim().length < 2) return [];
    const q = query_str.trim().toLowerCase();
    const results = window.DB.filter(d =>
      d.cie10.toLowerCase().includes(q) ||
      d.nombre.toLowerCase().includes(q) ||
      (d.sinonimos||[]).some(s => s.toLowerCase().includes(q)) ||
      d.especialidad.toLowerCase().includes(q)
    );
    results.sort((a, b) => {
      const aE = a.cie10.toLowerCase() === q ? -2 : a.cie10.toLowerCase().startsWith(q) ? -1 : 0;
      const bE = b.cie10.toLowerCase() === q ? -2 : b.cie10.toLowerCase().startsWith(q) ? -1 : 0;
      return aE - bE || a.nombre.localeCompare(b.nombre, "es");
    });
    return results.slice(0, 12);
  };

  const LOG_TTL_MS = 72 * 60 * 60 * 1000; // 72 horas

  // Elimina registros de log con más de 72h de antigüedad
  async function _purgeOldLogs() {
    try {
      const cutoff = new Date(Date.now() - LOG_TTL_MS);
      const snap = await getDocs(collection(fdb, COL_LOG));
      for (const d of snap.docs) {
        const fecha = d.data().fecha?.toDate();
        if (fecha && fecha < cutoff) await deleteDoc(doc(fdb, COL_LOG, d.id));
      }
    } catch(e) { console.warn("Purge logs:", e); }
  }

  async function _enforceLogLimit() {
    await _purgeOldLogs();
  }

  // Ejecutar purge al cargar
  _purgeOldLogs();

  window.STORE_save = async function(accion, entrada) {
    try {
      await setDoc(doc(fdb, COL_DIAG, entrada.cie10), entrada);
      const idx = window.DB.findIndex(d => d.cie10 === entrada.cie10);
      if (accion === "NUEVO")   { if (idx === -1) window.DB.push(entrada); }
      if (accion === "EDITADO") { if (idx !== -1) window.DB[idx] = entrada; }
      await addDoc(collection(fdb, COL_LOG), {
        fecha: Timestamp.now(),
        accion, cie10: entrada.cie10,
        nombre: entrada.nombre,
        especialidad: entrada.especialidad,
        prioridad: entrada.prioridad
      });
      await _enforceLogLimit(); // Elimina registros sobrantes
    } catch(e) { console.error("Error guardando:", e); }
  };

  window.STORE_delete = async function(cie10) {
    const d = window.DB.find(x => x.cie10 === cie10);
    if (!d) return;
    try {
      await deleteDoc(doc(fdb, COL_DIAG, cie10));
      const idx = window.DB.findIndex(x => x.cie10 === cie10);
      if (idx !== -1) window.DB.splice(idx, 1);
      await addDoc(collection(fdb, COL_LOG), {
        fecha: Timestamp.now(), accion: "ELIMINADO",
        cie10: d.cie10, nombre: d.nombre,
        especialidad: d.especialidad, prioridad: d.prioridad
      });
      await _enforceLogLimit();
    } catch(e) { console.error("Error eliminando:", e); }
  };

  window.STORE_getLog = async function() {
    try {
      const q    = query(collection(fdb, COL_LOG), orderBy("fecha", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map(d => {
        const data = d.data();
        return {
          fecha:        data.fecha.toDate().toISOString(),
          accion:       data.accion,
          cie10:        data.cie10,
          nombre:       data.nombre,
          especialidad: data.especialidad,
          prioridad:    data.prioridad
        };
      });
    } catch(e) { return []; }
  };

  window.STORE_reset = async function() {
    if (!confirm("¿Resetear TODA la base de datos al protocolo SSMOCC original?\nEsto NO se puede deshacer.")) return;
    try {
      // Borrar todos los docs existentes
      const snap = await getDocs(collection(fdb, COL_DIAG));
      for (const d of snap.docs) await deleteDoc(doc(fdb, COL_DIAG, d.id));
      // Repoblar con datos base
      window.DB.length = 0;
      for (const d of DB_BASE) {
        await setDoc(doc(fdb, COL_DIAG, d.cie10), d);
        window.DB.push(d);
      }
      alert("Base de datos reseteada correctamente.");
      location.reload();
    } catch(e) { alert("Error al resetear: " + e.message); }
  };


  // ── Flujogramas Clínicos ───────────────────────────────────────────────
  // Colección independiente; NO modifica la colección "diagnosticos".
  // El campo flujo_id en un diagnóstico es completamente opcional.
  const COL_FLUJO = "flujogramas";

  /**
   * Guarda (crea o sobreescribe) un flujograma.
   * @param {object} flujo  - Objeto completo del flujograma (debe tener .id)
   */
  window.FLUJO_save = async function(flujo) {
    if (!flujo || !flujo.id) throw new Error("El flujograma debe tener un campo 'id'.");
    try {
      await setDoc(doc(fdb, COL_FLUJO, flujo.id), flujo);
    } catch(e) { console.error("Error guardando flujograma:", e); throw e; }
  };

  /**
   * Carga un flujograma por su ID.
   * @param {string} flujoId
   * @returns {object|null}
   */
  window.FLUJO_get = async function(flujoId) {
    if (!flujoId) return null;
    try {
      const snap = await getDoc(doc(fdb, COL_FLUJO, flujoId));
      return snap.exists() ? snap.data() : null;
    } catch(e) { console.error("Error cargando flujograma:", e); return null; }
  };

  /**
   * Elimina un flujograma por su ID.
   * @param {string} flujoId
   */
  window.FLUJO_delete = async function(flujoId) {
    if (!flujoId) return;
    try {
      await deleteDoc(doc(fdb, COL_FLUJO, flujoId));
    } catch(e) { console.error("Error eliminando flujograma:", e); throw e; }
  };

  // Avisar a las otras páginas que DB está lista
  document.dispatchEvent(new Event("sicmed:ready"));

})();
