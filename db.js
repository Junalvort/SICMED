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
    { cie10:"E055",  nombre:"Crisis / Tormenta tirotóxica", sinonimos:["tormenta tirotoxica","crisis tirotoxica","tirotoxicosis"], especialidad:"Endocrinología", destino:"Urgencia", prioridad:"P0", criterios:"Sospecha fundada", examenes:"Clínica suficiente", notas:"" },
    { cie10:"E060",  nombre:"Tiroiditis aguda", sinonimos:["tiroiditis aguda","infeccion tiroides"], especialidad:"Endocrinología", destino:"Urgencia", prioridad:"P0", criterios:"Sospecha fundada", examenes:"Clínica suficiente", notas:"" },
    { cie10:"E038",  nombre:"Hipotiroidismo en embarazada", sinonimos:["hipotiroidismo embarazo","gestante hipotiroidismo"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Hipotiroidismo en embarazada. Sospecha de origen central. Hipotiroidismo no compensado con patología coronaria o IC", examenes:"TSH, T4L", notas:"" },
    { cie10:"E02X",  nombre:"Hipotiroidismo subclínico en embarazada", sinonimos:["hipotiroidismo subclinico embarazada"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Embarazada con hipotiroidismo subclínico", examenes:"TSH, T4L", notas:"" },
    { cie10:"E059",  nombre:"Hipertiroidismo sospecha fundada", sinonimos:["hipertiroidismo","tiroides alta","graves","bocio"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Sospecha fundada de hipertiroidismo. Embarazo. Mujer posmenopáusica u hombre >55 años", examenes:"TSH, T4L, T3L", notas:"" },
    { cie10:"E061",  nombre:"Tiroiditis subaguda", sinonimos:["tiroiditis subaguda","de quervain"], especialidad:"Endocrinología", destino:"Medicina Interna", prioridad:"P1", criterios:"Persistencia clínica a los 30 días desde el inicio de síntomas", examenes:"TSH, T4L, VHS", notas:"" },
    { cie10:"C73X",  nombre:"Cáncer de tiroides", sinonimos:["cancer tiroides","carcinoma tiroideo","papilar tiroideo"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Biopsia positiva o antecedente previo de cáncer de tiroides en últimos 6 meses", examenes:"Ecografía tiroidea + biopsia (PAAF)", notas:"GES" },
    { cie10:"E041",  nombre:"Nódulo tiroideo TIRADS 4b/4c/5", sinonimos:["nodulo tiroideo","tirads 4","tirads 5","sospechoso maligno"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Nódulo sólido hipoecogénico con microcalcificaciones, márgenes irregulares o más alto que ancho. Nódulo ≥5 mm", examenes:"Ecografía tiroidea con TIRADS", notas:"" },
    { cie10:"D441",  nombre:"Tumor suprarrenal con síndromes", sinonimos:["tumor suprarrenal","feocromocitoma","cushing","aldosteronismo"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"HTA refractaria, síndrome de Cushing clínico", examenes:"Cortisol, ACTH, aldosterona (según disponibilidad)", notas:"" },
    { cie10:"E890",  nombre:"Hipotiroidismo post-cirugía Ca tiroides", sinonimos:["hipotiroidismo postcirugía","postcirugía tiroidea"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P2", criterios:"Antecedente de cáncer de tiroides operado hace >6 meses", examenes:"TSH, T4L", notas:"" },
    { cie10:"E032",  nombre:"Hipotiroidismo por fármacos", sinonimos:["hipotiroidismo amiodarona","hipotiroidismo litio","farmacológico"], especialidad:"Endocrinología", destino:"Medicina Interna", prioridad:"P2", criterios:"Uso concomitante de Amiodarona o Litio de reciente comienzo", examenes:"TSH, T4L", notas:"" },
    { cie10:"E039",  nombre:"Hipotiroidismo no especificado refractario", sinonimos:["hipotiroidismo refractario","TSH elevado no controlado"], especialidad:"Endocrinología", destino:"Medicina Interna", prioridad:"P2", criterios:"TSH elevado en 2 controles pese a terapia adecuada y adherencia comprobada", examenes:"TSH, T4L, evaluación adherencia", notas:"" },
    { cie10:"E058",  nombre:"Hipertiroidismo subclínico otras edades", sinonimos:["hipertiroidismo subclínico","TSH suprimido"], especialidad:"Endocrinología", destino:"Medicina Interna", prioridad:"P2", criterios:"Persistencia en 2 exámenes consecutivos alterados", examenes:"TSH, T4L, T3L", notas:"" },
    { cie10:"E041b", nombre:"Nódulo tiroideo TIRADS 3-4a", sinonimos:["nodulo tiroideo tirads 3","tirads 4a","ecografia"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P2", criterios:"Nódulo ≥1 cm a 1.5 cm según riesgo ecográfico (TIRADS 3 o 4a)", examenes:"Ecografía tiroidea con TIRADS. Si ≥1.5 cm o TIRADS 4a: PAAF", notas:"" },
    { cie10:"D441b", nombre:"Tumor suprarrenal asintomático – incidentaloma", sinonimos:["incidentaloma suprarrenal","asintomático suprarrenal"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P2", criterios:"Incidentaloma sin síndrome clínico asociado", examenes:"Cortisol, imagen abdominal previa", notas:"" },
    { cie10:"K274",  nombre:"Úlcera péptica con hemorragia activa", sinonimos:["ulcera peptica hemorragia","sangrado forrest","ulcera sangrante"], especialidad:"Gastroenterología", destino:"Urgencia", prioridad:"P0", criterios:"Hemorragia activa Forrest I a IIB", examenes:"Clínica + EDA urgente", notas:"" },
    { cie10:"K224",  nombre:"Disfagia motora severa", sinonimos:["disfagia severa","deglución difícil","aspiración","acalasia grave"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Disfagia severa con alteración nutricional o cuadros respiratorios por aspiración", examenes:"EDA previa", notas:"" },
    { cie10:"K279",  nombre:"Úlcera péptica sin hemorragia refractaria", sinonimos:["ulcera peptica","duodenal","gastrica","refractaria primera linea"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Úlcera en lugares atípicos o múltiples o refractaria a tto 1era línea", examenes:"EDA con test de Ureasa, Hemograma", notas:"" },
    { cie10:"K922",  nombre:"Hemorragia digestiva no precisada", sinonimos:["hemorragia digestiva","sangrado digestivo","melena","hematoquecia"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Anemia microcítica con endoscopia normal, hemorragia oculta negativa y tacto rectal normal", examenes:"Hemograma, hemorragia oculta, tacto rectal, EDA previa", notas:"" },
    { cie10:"K861",  nombre:"Pancreatitis crónica", sinonimos:["pancreatitis cronica","dolor abdominal pancreas","amilasa","lipasa"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada con ecografía abdominal compatible", examenes:"Ecografía abdominal, amilasa, lipasa, Hemograma", notas:"" },
    { cie10:"K509",  nombre:"Enfermedad de Crohn", sinonimos:["crohn","enfermedad inflamatoria intestinal","EII"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada y/o antecedentes personales de patología", examenes:"Hemograma, VHS, PCR, colonoscopia (según disponibilidad)", notas:"" },
    { cie10:"K519",  nombre:"Colitis ulcerosa", sinonimos:["colitis ulcerosa","CU","EII","proctitis ulcerosa"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada y/o antecedentes personales de patología", examenes:"Hemograma, VHS, PCR, colonoscopia (según disponibilidad)", notas:"" },
    { cie10:"K909",  nombre:"Malabsorción intestinal", sinonimos:["malabsorcion","diarrea grasa","esteatorrea"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada y/o antecedentes personales de patología", examenes:"Hemograma, albúmina, anticuerpos antitransglutaminasa", notas:"" },
    { cie10:"K900",  nombre:"Enfermedad celíaca", sinonimos:["celiaca","gluten","esprue celíaco","intolerancia gluten"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada y/o antecedentes personales de patología", examenes:"Hemograma, anticuerpos antitransglutaminasa IgA, IgA total", notas:"" },
    { cie10:"K710",  nombre:"Daño hepático crónico colestásico", sinonimos:["daño hepatico","colestasico","cirrosis biliar","colangitis esclerosante"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Patrón colestásico con vía biliar normal no dilatada y/o cirrosis biliar primaria o colangitis esclerosante", examenes:"GOT, GPT, GGT, FA, BT, albúmina, ecografía abdominal", notas:"" },
    { cie10:"K716",  nombre:"Aumento de transaminasas x3", sinonimos:["transaminasas elevadas","GOT","GPT","hepatitis","transaminasemia"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P1", criterios:"Elevación de transaminasas 3 veces sobre límite normal, sin criterios de urgencia", examenes:"GOT, GPT, GGT, FA, BT, albúmina, VHB, VHC, ecografía abdominal", notas:"" },
    { cie10:"K754",  nombre:"Hepatitis autoinmune", sinonimos:["hepatitis autoinmune","autoanticuerpos hígado","ANA positivo"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Antecedente personal de hepatitis autoinmune no controlada", examenes:"GOT, GPT, ANA, ASMA, IgG, albúmina, BT", notas:"" },
    { cie10:"D376",  nombre:"Tumor hepático sólido", sinonimos:["tumor hepatico","masa hepatica","hepatocarcinoma","CHC"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Tumor SÓLIDO objetivado por imágenes", examenes:"Ecografía o TAC abdominal, alfafetoproteína", notas:"" },
    { cie10:"B980",  nombre:"H. pylori refractario", sinonimos:["helicobacter pylori","H. pylori","refractario resistente","hp positivo"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"GES", criterios:"Refractario a tto de 1era línea", examenes:"Test de urea en aliento o biopsia gástrica. EDA previa", notas:"GES" },
    { cie10:"K228",  nombre:"Disfagia motora no complicada", sinonimos:["disfagia motora","acalasia","esofago motor"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Sospecha fundada de disfagia motora sin complicaciones", examenes:"EDA, manometría esofágica (según disponibilidad)", notas:"" },
    { cie10:"K219",  nombre:"ERGE refractaria", sinonimos:["reflujo gastroesofagico","ERGE","acidez refractaria","IBP refractario"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Refractario a tto no farmacológico y farmacológico durante 4 meses", examenes:"EDA previa, pHmetría (según disponibilidad)", notas:"" },
    { cie10:"K20X",  nombre:"Esofagitis grado C o D", sinonimos:["esofagitis severa","grado C","grado D","IBP"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Objetivada por EDA, refractaria a IBP 2 meses y/o grado C o D", examenes:"EDA con informe de grado", notas:"" },
    { cie10:"K599",  nombre:"SII refractario", sinonimos:["colon irritable","SII","sindrome intestino irritable","funcional"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Refractario a tto no farmacológico y farmacológico en 3 meses", examenes:"Colonoscopia (según disponibilidad), Hemograma, PCR", notas:"" },
    { cie10:"K59",   nombre:"Diarrea crónica refractaria", sinonimos:["diarrea cronica","diarrea persistente","diarrea refractaria"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Refractaria a tto no farmacológico y farmacológico en 4 meses", examenes:"Coprocultivo, Hemograma, colonoscopia (según disponibilidad)", notas:"" },
    { cie10:"K30X",  nombre:"Dispepsia refractaria", sinonimos:["dispepsia","indigestion cronica","funcional","epigastralgia"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Refractaria a tto no farmacológico y farmacológico en 6 meses", examenes:"EDA, H. pylori, Hemograma", notas:"" },
    { cie10:"K703",  nombre:"Daño hepático crónico alcohólico", sinonimos:["daño hepatico alcoholico","cirrosis alcoholica","hepatopatia alcoholica"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Paciente en control en programa alcohol o drogas u otro en APS o COSAM", examenes:"GOT, GPT, GGT, FA, BT, albúmina, TP, ecografía abdominal", notas:"" },
    { cie10:"R17X",  nombre:"Ictericia hepática", sinonimos:["ictericia","bilirrubina elevada","hepatica","jaundice"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Probable etiología hepática con vía biliar no dilatada en ecografía", examenes:"BT y fracciones, GOT, GPT, GGT, FA, albúmina, ecografía abdominal", notas:"" },
    { cie10:"C950",  nombre:"Leucemia aguda", sinonimos:["leucemia aguda","blastos","bastones auer","citopenias fiebre"], especialidad:"Hematología", destino:"GES / Urgencia", prioridad:"GES", criterios:"Blastos en hemograma, formas inmaduras, bastones de Auer, citopenias con fiebre", examenes:"Hemograma con VHS", notas:"GES" },
    { cie10:"D70X",  nombre:"Leucopenia severa – neutropenia <500", sinonimos:["neutropenia severa","leucopenia","granulocitopenia"], especialidad:"Hematología", destino:"Urgencia / Hematología", prioridad:"P1", criterios:"Neutropenia <500 u/L", examenes:"Hemograma, VHS, GOT, GPT, GGT, FA, BT, albúmina, VIH", notas:"" },
    { cie10:"D70Xb", nombre:"Leucopenia moderada – neutropenia <1000", sinonimos:["leucopenia moderada","neutropenia leve"], especialidad:"Hematología", destino:"Hematología / Med. Interna", prioridad:"P1", criterios:"Neutropenia <1000 u/L en 2 hemogramas separados 3 semanas. Descartar fármacos como causa", examenes:"Hemograma, VHS, GOT, GPT, GGT, FA, BT, albúmina, VIH", notas:"" },
    { cie10:"D471",  nombre:"Sd. Mieloproliferativo – Trombocitosis esencial", sinonimos:["trombocitosis esencial","plaquetas altas","mieloproliferativo"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P1", criterios:"Plaquetas >600.000 en 2 hemogramas separados 1 mes", examenes:"Hemograma, VHS", notas:"" },
    { cie10:"D471b", nombre:"Sd. Mieloproliferativo – Mielofibrosis", sinonimos:["mielofibrosis","esplenomegalia","bicitopenia","pancitopenia"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P1", criterios:"Esplenomegalia con bicitopenia o pancitopenia, descartado DHC", examenes:"Hemograma, VHS, ecografía abdominal", notas:"" },
    { cie10:"D469",  nombre:"Sd. Mielodisplásico", sinonimos:["mielodisplasia","mielodisplasico","bicitopenia","pancitopenia"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P1", criterios:"Bicitopenia-Pancitopenia con anemia normocítica o macrocítica, descartado DHC", examenes:"Hemograma, VHS, GOT, GPT, GGT, FA, BT, albúmina, TP, VIH", notas:"" },
    { cie10:"D531",  nombre:"Anemia megaloblástica", sinonimos:["anemia megaloblastica","vitamina B12","folato","macrocítica","VCM alto"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P1", criterios:"Anemia macrocítica con VCM >120 fl, +/- síntomas neurológicos, bilirrubina indirecta aumentada", examenes:"Hemograma, VHS, B12, ácido fólico, BT y fracciones, LDH, cinética de fierro", notas:"" },
    { cie10:"D685",  nombre:"Trombofilia con trombosis no provocada <50 años", sinonimos:["trombofilia","trombosis joven","TEP","TVP no provocada"], especialidad:"Hematología", destino:"Hematología / Med. Interna", prioridad:"P1", criterios:"Paciente <50 años con trombosis no provocada sin anticoagulación permanente, o 2 eventos trombóticos", examenes:"Hemograma, TP, TTPK", notas:"" },
    { cie10:"C819",  nombre:"Linfoma", sinonimos:["linfoma","adenopatias","ganglio","hodgkin","no hodgkin"], especialidad:"Hematología", destino:"GES", prioridad:"GES", criterios:"Adenopatías >1 cm (no inguinales) o >2 cm inguinales por >4 semanas. Fijación a planos, supraclavicular, síntomas B, esplenomegalia. Descartado proceso infeccioso", examenes:"Hemograma, VHS, VIH, VDRL, TAC tórax-abdomen (según disponibilidad)", notas:"GES" },
    { cie10:"C900",  nombre:"Mieloma múltiple", sinonimos:["mieloma multiple","plasmocitoma","componente monoclonal","electroforesis proteínas"], especialidad:"Hematología", destino:"GES", prioridad:"GES", criterios:"2 o más criterios: anemia arregenerativa normo-normo, VHS >100, hipercalcemia, IR sin causa, dolores óseos, fractura patológica, componente monoclonal en electroforesis", examenes:"Hemograma, VHS, creatinina, examen orina, calcio, proteínas totales, albúmina, electroforesis proteínas, LDH", notas:"GES" },
    { cie10:"D66X",  nombre:"Hemofilia", sinonimos:["hemofilia","coagulopatia hereditaria","hemartrosis","hematoma"], especialidad:"Hematología", destino:"GES", prioridad:"GES", criterios:"Hematomas, hemartrosis, hemotórax, hemoperitoneo. Antecedente familiar de hombre con hemofilia", examenes:"Hemograma, TP, TTPK", notas:"GES" },
    { cie10:"D45X",  nombre:"Policitemia vera", sinonimos:["policitemia","eritrocitosis","hematocrito alto","hemoglobina alta"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"Hto ≥49% (H) o ≥48% (M) / Hb ≥16.5 (H) o ≥16 (M), en 2 hemogramas separados 2 semanas", examenes:"Hemograma, VHS, ecografía abdominal, LDH", notas:"" },
    { cie10:"R161",  nombre:"Esplenomegalia", sinonimos:["esplenomegalia","bazo grande","bazo agrandado"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"Descartar sd. mieloproliferativo o leucemia, descartado DHC", examenes:"Hemograma, VHS, GPT, GGT, FA, BT, albúmina, ecografía abdominal", notas:"" },
    { cie10:"D509",  nombre:"Anemia ferropriva refractaria", sinonimos:["anemia ferropenia","ferropriva","hierro deficiencia","refractaria"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"Habiendo descartado causas probables (cáncer colon, gástrico, ginecológico, malabsorción). Refractario a hierro oral 3 meses", examenes:"Hemograma, VHS, hemorragia oculta, cinética de fierro", notas:"Meta Hb: 12 (F) / 13 (M) g/dL" },
    { cie10:"D649",  nombre:"Anemia normocítica-normocrómica", sinonimos:["anemia normocítica","normocromica","cronica","inflamacion"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"En 2 hemogramas separados 1 mes, habiendo descartado ERC, DHC, hipotiroidismo, proceso inflamatorio crónico", examenes:"Hemograma, VHS, creatinina, TSH, T4, función hepática, eco abdominal, cinética de fierro, hemorragia oculta", notas:"" },
    { cie10:"D696",  nombre:"Trombocitopenia", sinonimos:["trombocitopenia","plaquetas bajas","ITP","PTI"], especialidad:"Hematología", destino:"Medicina Interna / Urgencia si <30.000", prioridad:"P2", criterios:"Plaquetas <100.000 u/L en 2 hemogramas separados 2 semanas, descartado DHC. REPETIR hemograma en tubo citrato o heparina", examenes:"Hemograma, VHS, GOT, GPT, GGT, FA, BT, albúmina, VIH", notas:"Si plaquetas <30.000 o sangrado activo: derivar a Urgencia" },
    { cie10:"D689",  nombre:"Defecto coagulación – TP <60%", sinonimos:["coagulopatia","tiempo protrombina","TP bajo","coagulacion"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"TP <60% repetida 3 veces (2da muestra a brevedad, 3era a 2 semanas), descartado DHC, sin anticoagulantes", examenes:"Hemograma, VHS, TP, TTPK, GOT, GPT, GGT, FA, albúmina, BT", notas:"" },
    { cie10:"D685b", nombre:"Trombofilia para estudio", sinonimos:["trombofilia estudio","anticoagulacion","embarazo hereditaria"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"Trombosis no provocada con anticoagulación y necesidad de definir anticoagulación permanente. Trombofilia hereditaria sin trombosis con deseo de embarazo", examenes:"Hemograma, TP, TTPK", notas:"" },
    { cie10:"C951",  nombre:"Leucemia crónica", sinonimos:["leucemia cronica","CLL","CML","leucocitosis","linfocitosis"], especialidad:"Hematología", destino:"GES", prioridad:"GES", criterios:"Leucocitos >150.000 sin causa clara en 2 hemogramas separados 1 mes. Linfocitosis >5.000 en 2 hemogramas separados 1 mes", examenes:"Hemograma con VHS", notas:"GES" },
    { cie10:"N19X",  nombre:"Insuf. Renal no especificada – urgencia", sinonimos:["insuficiencia renal","uremia","encefalopatia uremica","edema pulmonar","potasio alto"], especialidad:"Nefrología", destino:"URGENCIA", prioridad:"P0", criterios:"VFG <15 mL/min/1.73m2 + uno de: edema pulmonar/anasarca, encefalopatía urémica, K ≥6.0 mEq/L, nitrógeno ureico >100 mg/dL, Na <120 mEq/L", examenes:"EMBD básico + creatinina urgente, electrolitos, gases arteriales", notas:"EMBD Básico: PA recientes, creatinina con fechas, orina completa con sedimento, RAC, electrolitos" },
    { cie10:"N009",  nombre:"Síndrome nefrítico agudo severo", sinonimos:["sindrome nefritico","hematuria","edema","oligoanuria","proteinuria","creatinina alta"], especialidad:"Nefrología", destino:"Urgencia / Nefrología P1", prioridad:"P0", criterios:"Edema, HTA, oligoanuria, hematuria, proteinuria, creatinina +0.5 mg del basal", examenes:"EMBD + orina completa con sedimento activo", notas:"" },
    { cie10:"N179",  nombre:"Insuficiencia Renal Aguda", sinonimos:["insuficiencia renal aguda","IRA","creatinina alta","VFG disminuida"], especialidad:"Nefrología", destino:"Urgencia / Nefrología P1", prioridad:"P0", criterios:"VFG <60 sin antecedentes previos + aumento creatinina ≥0.3 mg/dL o disminución VFG ≥10% en 2 semanas", examenes:"EMBD + ecografía renal (según disponibilidad)", notas:"Derivar antes de 2 semanas" },
    { cie10:"N049",  nombre:"Síndrome nefrótico", sinonimos:["sindrome nefrotico","proteinuria masiva","hipoalbuminemia","edema nefrotico"], especialidad:"Nefrología", destino:"Nefrología / Med. Interna", prioridad:"P1", criterios:"Proteinuria >3.5 gr/24h o RAC >2000 mg/gr, hipoalbuminemia <3.5 mg%, dislipidemia", examenes:"EMBD + albúmina, LDL, ecografía renal", notas:"" },
    { cie10:"N391",  nombre:"Proteinuria persistente >1 gr", sinonimos:["proteinuria persistente","RAC","albumina orina","no diabetico"], especialidad:"Nefrología", destino:"Med. Interna / Nefrología", prioridad:"P1", criterios:"Proteinuria >1 gr/24h y <3.5 gr, en 2 RAC separados 2 semanas, creatinina normal, paciente NO diabético", examenes:"EMBD + albúmina, LDL, ecografía renal", notas:"" },
    { cie10:"N184",  nombre:"ERC estadio 4-5", sinonimos:["ERC","insuficiencia renal cronica","etapa 4","etapa 5","VFG 30"], especialidad:"Nefrología", destino:"Nefrología / Med. Interna", prioridad:"P1", criterios:"VFG <30 mL/min/1.73m2, independiente de edad", examenes:"EMBD + ecografía renal", notas:"" },
    { cie10:"N189",  nombre:"ERC etapa 1-3A con criterios GES", sinonimos:["ERC cronica GES","VFG 45","RAC 300","nefrologia GES"], especialidad:"Nefrología", destino:"GES", prioridad:"GES", criterios:"VFG <45 mL/min/1.73m2 (etapa 3B). Paciente <65 años con VFG <60. Disminución VFG >5 ml/min/año o >10 en 5 años. RAC ≥300 mg/g o RPC >200 mg/g pese a tto óptimo", examenes:"EMBD completo", notas:"GES" },
    { cie10:"N029",  nombre:"Hematuria glomerular", sinonimos:["hematuria glomerular","cilindros hematicos","proteinuria sedimento"], especialidad:"Nefrología", destino:"Med. Interna / Nefrología", prioridad:"P2", criterios:"2 o más GR/campo en 2+ exámenes, con proteinuria, cilindros hemáticos o cuerpos ovales grasos. Descartada causa urológica", examenes:"EMBD + ecografía renal, orina completa con sedimento", notas:"NO derivar microhematuria sin proteinuria a Nefrología → derivar a Urología" },
    { cie10:"Q613",  nombre:"Enfermedad poliquística renal", sinonimos:["poliquistica renal","quistes renales multiples","hereditaria","PKD"], especialidad:"Nefrología", destino:"Nefrología", prioridad:"P2", criterios:"Múltiples quistes en ecografía renal + antecedentes familiares, HTA y disfunción renal", examenes:"EMBD + ecografía renal con descripción de quistes", notas:"NO derivar quistes renales simples a Nefrología → derivar a Urología" },
    { cie10:"G448",  nombre:"Cefalea con signos de alarma", sinonimos:["cefalea alarma","primer episodio","diplopía","focalidad","cefalea nueva"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Inicio >50 años en <6 meses, cambio de patrón <3 meses, empeora con Valsalva o decúbito, despierta de noche, asociado a diplopía o alteración visual", examenes:"Neuroimagen (según disponibilidad)", notas:"Si cefalea en trueno: URGENCIA P0" },
    { cie10:"G440",  nombre:"Cefalea trigeminoautonómica", sinonimos:["cefalea racimos","cluster","trigeminoautonomica","lagrimeo","rinorrea unilateral"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Sospecha clínica: cefalea intensa unilateral con lagrimeo, inyección conjuntival, rinorrea, sudoración frontal ipsilateral", examenes:"Clínica detallada. Calendario de cefalea", notas:"" },
    { cie10:"G433",  nombre:"Migraña complicada con aura atípica", sinonimos:["migraña aura","atipica","focalidad","afasia","hemiplejia","migraña complicada"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Aura con cualquier focalidad neurológica distinta a la visual", examenes:"Clínica detallada, neuroimagen si primera vez", notas:"" },
    { cie10:"G439",  nombre:"Migraña refractaria a profilaxis 3 meses", sinonimos:["migraña refractaria","profilaxis","propranolol","amitriptilina","invalidante"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Migraña >2-3 veces/sem o invalidante, sin respuesta a tto profiláctico en dosis plena por 3 meses (propranolol o amitriptilina)", examenes:"Calendario de cefalea + registro tto profiláctico usado", notas:"APS: propranolol 20→60 mg/día o amitriptilina 12.5→25 mg/noche" },
    { cie10:"F028",  nombre:"Deterioro cognitivo rápido <6 meses", sinonimos:["deterioro cognitivo rapido","demencia precoz","parkinsonismo joven"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Deterioro en <6 meses y/o movimientos anormales, parkinsonismo, alteración marcha, edad <65 años, focalidad, incontinencia, alucinaciones. Descartado delirium", examenes:"Glicemia, hemograma, VHS, TSH, T4L, creatinina, GOT, GPT, GGT, FA, bilis total, VDRL, VIH, B12, Vit D. Minimental + KATZ", notas:"" },
    { cie10:"F002",  nombre:"Demencia Alzheimer descompensada", sinonimos:["alzheimer","demencia alzheimer","descompensada","agitacion"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Descompensada, habiendo descartado delirium", examenes:"Exámenes para descartar causa reversible + Minimental + KATZ", notas:"" },
    { cie10:"G219",  nombre:"Parkinsonismo con signos atípicos", sinonimos:["parkinsonismo atipico","sindrome extrapiramidaldemencia","disartria","mioclonías"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Bradiquinesia + uno de: temblor reposo, rigidez, inestabilidad postural. Asociado a: demencia, disartria, crisis oculogiras, distonía, mioclonías, signos cerebelosos, caídas frecuentes", examenes:"Glicemia, TSH, T4, GOT, GPT, VIH, VDRL, función renal, hemograma. Descartar fármacos", notas:"" },
    { cie10:"G20X",  nombre:"Enfermedad de Parkinson descompensada", sinonimos:["parkinson","descompensado","discinesias","periodos off","congelamiento"], especialidad:"Neurología", destino:"GES / Neurología", prioridad:"GES", criterios:"Discinesias, alteraciones psiquiátricas, no respuesta a levodopa (congelamiento, periodos off), caídas, síntomas atípicos rápidos <2 años", examenes:"Registro de tto actual y dosis, evaluación motora", notas:"GES" },
    { cie10:"G249",  nombre:"Distonía con signos de alarma", sinonimos:["distonia","espasmo muscular","involuntario","invalidante"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Sospecha clínica descartadas causas secundarias. Si invalidante, secundaria a levodopa/neuroléptico, o con signos alarma", examenes:"Glicemia, TSH, función renal y hepática, hemograma, VDRL, VIH", notas:"" },
    { cie10:"G253",  nombre:"Mioclonías", sinonimos:["mioclonias","espasmos mioclonicos","sacudidas involuntarias"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Sospecha clínica descartadas causas secundarias", examenes:"Glicemia, TSH, función hepática y renal, hemograma", notas:"" },
    { cie10:"G255",  nombre:"Corea – sospecha H. Huntington", sinonimos:["corea","huntington","movimientos involuntarios","atetosis"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Sospecha clínica, descartadas causas secundarias. Huntington: 40-50 años, hereditario, deterioro cognitivo, psiquiatría", examenes:"Glicemia, TSH, función hepática y renal, hemograma", notas:"Corea de inicio brusco → URGENCIA P0" },
    { cie10:"G442",  nombre:"Cefalea tensional refractaria", sinonimos:["cefalea tensional","cronica refractaria","diaria"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Cefalea >10-15 veces/mes, refractaria a profilaxis 6 meses (amitriptilina o propranolol)", examenes:"Calendario de cefalea + registro tto profiláctico", notas:"" },
    { cie10:"G444",  nombre:"Cefalea por abuso de fármacos", sinonimos:["cefalea abuso","analgesicos","triptanes","AINES","opioides","rebote"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Refractaria a retiro del fármaco en 1 mes. Uso >10 días/mes ergotamínicos o >15 días/mes triptanes, AINES u opioides por ≥3 meses", examenes:"Calendario de cefalea + registro fármacos", notas:"" },
    { cie10:"F03X",  nombre:"Demencia no especificada", sinonimos:["demencia senil","deterioro cognitivo","vascular","inespecífica"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Habiendo descartado causas reversibles (hipotiroidismo, IR, IH, VIH, sífilis, def. B12, Vit D), depresión y fármacos. Minimental realizado", examenes:"Glicemia, hemograma, VHS, TSH, T4L, creatinina, GOT/GPT/GGT/FA, bilis total, VDRL, VIH, B12, Vit D. Minimental + KATZ + Yesavage", notas:"Minimental realizado obligatorio antes de derivar" },
    { cie10:"G211",  nombre:"Parkinsonismo inducido por fármacos", sinonimos:["parkinsonismo farmacologico","antipsicóticos","metoclopramida","medicamentos"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Sin respuesta a 3 meses de suspensión del fármaco causante", examenes:"Descartar causa secundaria: glicemia, TSH, T4, GOT, GPT, VIH, VDRL, función renal, hemograma. Listado de fármacos suspendidos", notas:"" },
    { cie10:"G250",  nombre:"Temblor esencial refractario", sinonimos:["temblor esencial","manos","postural","acción","propranolol","primidona"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Temblor postural/acción, simétrico, extremidades superiores, mejora con alcohol. Sin respuesta a tto al mes (propranolol 20mg c12h o primidona)", examenes:"Clínica. Descartar causa secundaria. Registro tto usado", notas:"" },
    { cie10:"G256",  nombre:"Tics invalidantes – sospecha Tourette", sinonimos:["tics","tourette","movimientos vocales involuntarios"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Refractarios a tto al mes, sospecha de Sd. de Tourette", examenes:"Clínica. Descartar causa secundaria", notas:"" },
    { cie10:"G259",  nombre:"Síndrome piernas inquietas", sinonimos:["piernas inquietas","restless legs","disestesias","reposo movimiento"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Disestesias en extremidades inferiores en reposo que mejoran con movimiento. Refractario a tto al mes, descartadas causas secundarias", examenes:"Descartar causa secundaria: ferremia, ferritina, TSH, función renal, hemograma. Registro tto usado", notas:"" },
    { cie10:"H353",  nombre:"DMRE Húmeda", sinonimos:["DMRE","macular","degeneracion humeda","neovascular","metamorfopsias"], especialidad:"Oftalmología", destino:"Poli de Choque", prioridad:"P0", criterios:"Disminución brusca AV, metamorfopsias, entopsias, fotopsias, alteración campo visual central", examenes:"AV, rejilla de Amsler, fondo de ojo", notas:"Poli de Choque: urgencia nivel secundario (8:00-12:00 hrs)" },
    { cie10:"H330",  nombre:"Desprendimiento de retina", sinonimos:["desprendimiento retina","DR","caida telon","fotopsias","cuerpos flotantes"], especialidad:"Oftalmología", destino:"Poli de Choque", prioridad:"P0", criterios:"Caída de telón, fotopsias, entopsias, disminución agudeza visual", examenes:"AV, fondo de ojo", notas:"" },
    { cie10:"H431",  nombre:"Hemorragia vítrea", sinonimos:["hemorragia vitrea","vision roja","perdida vision","luminosidad"], especialidad:"Oftalmología", destino:"Poli de Choque", prioridad:"P0", criterios:"FRCV presentes, visión de mancha roja, pérdida de visión a la luminosidad", examenes:"AV, fondo de ojo", notas:"" },
    { cie10:"H46X",  nombre:"Neuritis óptica", sinonimos:["neuritis optica","dolor ojo","escotoma","reflejo pupilar ausente"], especialidad:"Oftalmología", destino:"Poli de Choque", prioridad:"P0", criterios:"Dolor al movimiento del ojo, escotoma central, reflejo pupilar ausente", examenes:"AV, reflejo pupilar, campo visual", notas:"" },
    { cie10:"H402",  nombre:"Glaucoma agudo / Ojo rojo profundo", sinonimos:["glaucoma agudo","uveitis","queratitis","escleritis","ojo rojo profundo","fotofobia","dolor ocular"], especialidad:"Oftalmología", destino:"Poli de Choque (max 24h)", prioridad:"P0", criterios:"Dolor ocular, fotofobia, disminución AV, inyección ciliar periquerática, midriasis, hipertonía digital, alteraciones corneales", examenes:"AV, tonometría digital, biomicroscopía si disponible", notas:"Máximo 12-24 hrs en glaucoma agudo" },
    { cie10:"H409",  nombre:"Glaucoma crónico refractario", sinonimos:["glaucoma cronico","resistente tratamiento","topico","campimetria"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P1", criterios:"Desde UAPO: glaucomas secundarios, refractario a tto tópico en 2 controles o 6 meses, ojo único, ángulo estrecho o avanzado", examenes:"AV, tonometría, campimetría (desde UAPO)", notas:"UAPO: Unidad Atención Primaria Oftalmológica" },
    { cie10:"H103",  nombre:"Conjuntivitis viral con pseudomembrana", sinonimos:["conjuntivitis viral","pseudomembrana","grave","AV disminuida"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P1", criterios:"Pseudomembrana presente. Sin respuesta al 10° día de tto bien llevado. Asociado a disminución AV", examenes:"AV, biomicroscopía", notas:"" },
    { cie10:"H499",  nombre:"Estrabismo agudo – diplopía nueva", sinonimos:["estrabismo agudo","diplopía nueva","ojo vago"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P1", criterios:"En diabético: lograr compensación metabólica previo o paralelo. Sospechar causa neurológica: derivar a Urgencia", examenes:"HbA1c (DM), AV, refracción, campo visual", notas:"" },
    { cie10:"H269",  nombre:"Catarata", sinonimos:["catarata","opacidad cristalino","vision borrosa","encandilamiento","GES"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Paciente >60 años, disminución AV indolora gradual, visión borrosa, percepción colores alterada, diplopía monocular, encandilamiento, rojo pupilar ausente", examenes:"AV, rojo pupilar, refracción", notas:"GES" },
    { cie10:"H360",  nombre:"Retinopatía diabética", sinonimos:["retinopatia diabetica","DM","fondo ojo","screening diabetes"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Screening anual en DM2 confirmada sin retinopatía ni cataratas. Si DM1: desde 5 años de diagnóstico", examenes:"HbA1c, fondo de ojo con resultado", notas:"GES" },
    { cie10:"H527",  nombre:"Vicio de refracción ≥65 años", sinonimos:["vicio refraccion","miopía","astigmatismo","presbicia","mayor","adulto mayor"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Paciente ≥65 años con alteración visual", examenes:"AV, refracción", notas:"GES" },
    { cie10:"H509",  nombre:"Estrabismo GES <9 años", sinonimos:["estrabismo niño","ambliopia","ojo vago","menor edad","GES"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Sospecha de estrabismo en menores de 9 años", examenes:"AV, test cover-uncover, refracción", notas:"GES" },
    { cie10:"H353b", nombre:"DMRE Seca", sinonimos:["DMRE seca","macular degeneracion seca","atrofica","drusen"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P2", criterios:"Paciente >50 años con FRCV, antecedentes familiares, disminución variable AV, mala adaptación nocturna", examenes:"AV, rejilla de Amsler, fondo de ojo", notas:"" },
    { cie10:"H527b", nombre:"Vicio de refracción 15-64 años", sinonimos:["vicio refraccion adulto","joven miopía","astigmatismo","hipermetropía"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P2", criterios:"Paciente 15-64 años con alteración visual", examenes:"AV, refracción", notas:"" },
    { cie10:"E660",  nombre:"Obesidad para bariátrica – IMC ≥40", sinonimos:["obesidad morbida","IMC 40","bariatrica","bypass","manga gastrica"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC ≥40 con o sin comorbilidades. Sin descompensación de comorbilidades en últimos 6 meses. Con manejo 6 meses en APS. Edad 16-70 años con red de apoyo efectiva", examenes:"Hemograma, creatinina, VFG, glicemia basal, HbA1c, albúmina, proteínas totales, calcio, fósforo, magnesio, LDH, electrolitos, funcionalismo hepático completo, perfil lipídico, perfil tiroideo, INR/TP/TTPa, 25-OH Vit D, Vit B12, perfil ferrocinético, uroanálisis. EDA con Test de Ureasa, ecografía abdominal, espirometría y test de esfuerzo", notas:"Previo a derivación: 6 meses a 1 año manejo en APS. Derivar a Nutriología Adulto HSJD" },
    { cie10:"E661",  nombre:"Obesidad para bariátrica – IMC ≥35 con comorbilidad", sinonimos:["obesidad bariatrica","comorbilidad","IMC 35","HTA","DM2","SAHOS"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC ≥35 con al menos 1 comorbilidad (HTA, DM2, SAHOS, dislipidemia, artrosis severa, entre otras). Sin descompensación últimos 6 meses. Manejo 6 meses en APS", examenes:"Mismo set de exámenes que IMC ≥40", notas:"" },
    { cie10:"E66D",  nombre:"Obesidad para bariátrica – IMC ≥30 con DM2", sinonimos:["obesidad diabetes","bariatrica","IMC 30","DM2","diabetes tipo 2"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC ≥30 con Diabetes mellitus tipo 2. Manejo 6 meses en APS", examenes:"Mismo set de exámenes que IMC ≥40", notas:"" },
    { cie10:"E66E",  nombre:"Obesidad para bariátrica – IMC 30-34.9 sin respuesta APS", sinonimos:["obesidad sin pérdida peso","IMC 30","34","bariatrica","sin respuesta"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC 30-34.9. Manejo 1 año en APS sin lograr pérdida de peso sustancial (5-15% por mínimo 3 meses) ni control de comorbilidades", examenes:"Mismo set de exámenes que IMC ≥40", notas:"Requiere 1 año de manejo en APS documentado" },

    // ── OTORRINOLARINGOLOGÍA (Protocolo PROT_OTORRINO_2025 / Código DGD-PROT-Nº13) ──
    { cie10:"H651", nombre:"Otitis media aguda complicada", sinonimos:["otitis media aguda complicada","mastoiditis","laberintitis","paralisis facial","otomastoiditis"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Complicada (Otomastoiditis, laberintitis, absceso subperióstico, petrositis, parálisis facial, tromboflebitis del seno lateral): manifestadas por persistencia de otalgia, vértigo, fiebre, eritema y aumento de volumen retroauricular", examenes:"No aplica", notas:"Otitis media recurrente ≥3 episodios al año → derivar a Otorrino P2 con descripción de otoscopía" },
    { cie10:"H650", nombre:"Otitis media serosa", sinonimos:["otitis serosa","tímpano opaco","hipoacusia","efusion oido medio"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Asociado a hipoacusia y otoscopía compatible (tímpano opaco con movilidad limitada) o sintomatología ≥3 meses después de una otitis media aguda. Evaluar estrategia Otorrino APS", examenes:"Descripción de otoscopía", notas:"Evaluar si se puede resolver por estrategia Otorrino APS (Anexo N°2)" },
    { cie10:"H663", nombre:"Otitis media crónica complicada", sinonimos:["otitis cronica complicada","absceso","paralisis facial","mastoides","trombosis"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Complicada (absceso, parálisis facial, trombosis seno cavernoso): manifestada por fiebre, cefalea, vértigo, nistagmus, meningismo, parálisis de oculomotores, parálisis facial", examenes:"No aplica", notas:"" },
    { cie10:"H663b", nombre:"Otitis media crónica no complicada", sinonimos:["otitis media cronica","perforacion timpanica","otorrea","colesteatoma sospecha"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"No complicada: otoscopía compatible con perforación timpánica, alteraciones de huesecillo, otorrea, inflamación de la mucosa y remanente timpánico", examenes:"Otoscopía compatible: perforación timpánica, alteraciones de huesecillo, otorrea, inflamación mucosa, remanente timpánico", notas:"" },
    { cie10:"H600", nombre:"Otitis externa complicada", sinonimos:["otitis externa necrotizante","celulitis","pericondritis","sordera subita","herpes zoster otico"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Complicada: Celulitis, Pericondritis, Otitis externa necrotizante, Perforación timpánica traumática, Sordera súbita idiopática, post trauma acústico o por barotrauma, Sordera súbita asociada a vértigo, Herpes Zoster ótico", examenes:"No aplica", notas:"" },
    { cie10:"H71X", nombre:"Colesteatoma del oído medio o externo", sinonimos:["colesteatoma","polipo oido","destruccion osea","otoscopía"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P1", criterios:"Sospecha clínica: pólipos o destrucción ósea en otoscopía", examenes:"Otoscopía compatible", notas:"CIE-10: H71.X colesteatoma oído medio / H60.4 colesteatoma oído externo" },
    { cie10:"H813", nombre:"Vértigo periférico agudo incapacitante", sinonimos:["vertigo periferico","vppb","laberintitis aguda","incapacitante","caidas"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Sintomatología aguda incapacitante", examenes:"No aplica", notas:"Evaluar si se puede resolver por estrategia Otorrino APS" },
    { cie10:"H813b", nombre:"Vértigo periférico leve-moderado o recurrente", sinonimos:["vertigo recurrente","mareos","VPPB","maniobra epley"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Sintomatología leve-moderada o episodios recurrentes", examenes:"Otoscopía", notas:"Evaluar si se puede resolver por estrategia Otorrino APS" },
    { cie10:"H814", nombre:"Vértigo central", sinonimos:["vertigo central","neurinoma acoustico","cerebeloso","esclerosis multiple","AVE"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Clínica compatible con vértigo central (Neurinoma acústico, Alteraciones cerebelosas, Esclerosis múltiple, otros). Ver Anexo N°3 tabla comparativa", examenes:"Otoscopía (normal)", notas:"Ver tabla comparativa: vértigo central vs periférico" },
    { cie10:"R040", nombre:"Epistaxis aguda no autolimitada", sinonimos:["epistaxis","hemorragia nasal","sangrado nasal agudo"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Epistaxis aguda no autolimitada", examenes:"No aplica", notas:"Epistaxis recurrente → derivar a Otorrino P2" },
    { cie10:"R040b", nombre:"Epistaxis recurrente", sinonimos:["epistaxis recurrente","sangrado nasal repetido"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Epistaxis recurrente", examenes:"No aplica", notas:"" },
    { cie10:"C300", nombre:"Poliposis nasal con obstrucción unilateral", sinonimos:["poliposis nasal","tumor nasal","obstruccion unilateral"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P1", criterios:"Con obstrucción nasal unilateral. Descartar tumor maligno de fosa nasal", examenes:"TC cavidades paranasales sin contraste (según disponibilidad)", notas:"" },
    { cie10:"J339", nombre:"Poliposis nasal bilateral", sinonimos:["poliposis bilateral","hiposmia","anosmia","polipos nasales"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Poliposis bilateral con hiposmia", examenes:"TC cavidades paranasales sin contraste (según disponibilidad)", notas:"" },
    { cie10:"J342", nombre:"Desviación septal o hipertrofia de cornetes", sinonimos:["desviacion septal","tabique nasal","cornetes","obstruccion nasal"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Clínica compatible: obstrucción nasal y examen físico compatible. CIE: J34.2 Desviación del tabique nasal / J34.3 Hipertrofia de los cornetes nasales", examenes:"TC cavidades paranasales sin contraste (según disponibilidad)", notas:"" },
    { cie10:"J019", nombre:"Rinosinusitis aguda complicada", sinonimos:["sinusitis aguda complicada","celulitis preseptal","orbitaria","absceso","trombosis seno cavernoso"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Complicada: Celulitis Preseptal, Celulitis Orbitaria, Absceso subperióstico, Trombosis del seno cavernoso, Sinusitis micótica invasiva", examenes:"No aplica", notas:"" },
    { cie10:"J329", nombre:"Rinosinusitis crónica", sinonimos:["sinusitis cronica","rinosinusitis","poliposis","12 semanas"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Crónica: sintomatología continua mayor a 12 semanas. No tomar radiografía de cavidades perinasales", examenes:"TC cavidades paranasales con contraste (según disponibilidad). No tomar radiografía de cavidades perinasales", notas:"No solicitar radiografía simple de cavidades paranasales" },
    { cie10:"J350", nombre:"Faringoamigdalitis crónica o amígdalas hipertróficas", sinonimos:["amigdalas hipertroficas","faringoamigdalitis cronica","ronquido amigdalar","apnea amígdalas"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"≥5 episodios/año de faringoamigdalitis en 2 años consecutivos (adulto) o ≥3 en 3 años consecutivos. Amígdalas +3 o +4 con ronquido o apneas", examenes:"Descripción de orofaringe + registro de episodios anuales", notas:"CIE: J35.0 amígdalas hipertróficas / J35.3 hipertrofia amígdalas con adenoides" },
    { cie10:"G473", nombre:"Ronquido y sospecha SAHOS", sinonimos:["ronquido","apnea del sueno","SAHOS","OSAS","somnolencia diurna"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Ronquido con apneas observadas y somnolencia diurna. IMC y examen de vía aérea", examenes:"Descripción de orofaringe, escala de Epworth, IMC", notas:"Solicitar polisomnografía si disponible" },
    { cie10:"J380", nombre:"Parálisis de cuerdas vocales o nódulo laríngeo", sinonimos:["nodulo laringeo","paralisis cuerdas vocales","disfonia","ronquera persistente"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Disfonía >2 semanas sin causa evidente, parálisis de cuerdas vocales, nódulo laríngeo. Descartar etiología maligna", examenes:"Laringoscopía indirecta si disponible", notas:"Disfonía >2 semanas sin mejoría: siempre derivar" },
    { cie10:"H906", nombre:"Hipoacusia neurosensorial bilateral", sinonimos:["hipoacusia","sordera","audiometria","neurosensorial","presbiacusia"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Hipoacusia neurosensorial bilateral confirmada en audiometría. Hipoacusias no incluidas en GES. Evaluar estrategia Otorrino APS", examenes:"Audiometría, impedanciometría", notas:"Estrategia Otorrino APS incluye: hipoacusias no GES, síndrome vertiginoso ≥15 años, cerumen refractario, otitis media con efusión ≥15 años, audífonos y fármacos por 3 meses" },

    // ── TAMIZAJE RETINOPATÍA DIABÉTICA (ORD DGD 16/09/2024) ──
    { cie10:"H360", nombre:"Tamizaje retinopatía diabética – DM2 sin retinopatía", sinonimos:["retinopatia diabetica tamizaje","fondo ojo diabetes","screening DM","UAPO diabetes"], especialidad:"Oftalmología", destino:"UAPO (fondo de ojo)", prioridad:"GES", criterios:"Paciente con DM2 confirmada, sin diagnóstico de retinopatía ni cataratas no operada. Frecuencia anual. Solo se derivan a FO pacientes DM2 confirmada", examenes:"HbA1c, fondo de ojo con resultado", notas:"GES. Establecimiento: UAPO Cerro Navia. No derivar a FO si ya tiene diagnóstico de retinopatía o cataratas no operada" },

    // ── GES ALZHEIMER Y DEMENCIAS (GES 85) ──
    { cie10:"F009", nombre:"Alzheimer – sospecha GES (MMSE ≤21 + Pfeffer ≥6)", sinonimos:["alzheimer GES","demencia GES","minimental 21","pfeffer 6","sospecha demencia"], especialidad:"Neurología", destino:"Neurología / APS GES", prioridad:"GES", criterios:"Test de Minimental Extendido ≤21 puntos Y Test de Pfeffer ≥6 puntos. El médico abre caso GES en etapa de sospecha. Garantía de 60 días para confirmar o descartar diagnóstico. Si duda diagnóstica: derivar a especialidad (plazo 180 días). Tratamiento de mediana complejidad se realiza en APS con garantía de 60 días desde confirmación", examenes:"Minimental extendido, Test de Pfeffer, exámenes para descartar causa reversible: glicemia, hemograma, VHS, TSH, T4L, creatinina, función hepática, VDRL, VIH, B12, Vit D", notas:"GES 85. Abrir caso en SIGGES etapa sospecha. Tratamiento en APS con donepezilo u otro según indicación especialista" },

    // ── GES CÁNCER RENAL (GES 83) ──
    { cie10:"C64X", nombre:"Cáncer renal – sospecha GES", sinonimos:["cancer renal","tumor renal","carcinoma celulas renales","masa renal","GES 83"], especialidad:"Nefrología", destino:"Urología / GES", prioridad:"GES", criterios:"Lesión imagenológica sospechosa de cáncer renal. Médico tratante abre caso GES registrando IPD de confirmación en SIGGES. Etapificación: plazo garantizado 45 días desde confirmación. Tratamiento primario: 30 días desde indicación médica (cirugía, sistémico o radioterapia)", examenes:"Ecografía renal / TAC abdomen con tumor documentado, creatinina", notas:"GES 83. Proceso: IPD → SIGGES → Etapificación (45 días) → Tratamiento primario (30 días) → Tratamiento adyuvante (30 días) → Cierre de caso" },
// ── ORL nuevos del docx actualizado ───────────────────────────────────
    { cie10:"H919",  nombre:"Hipoacusia no especificada (otoscopía normal, no súbita)", sinonimos:["hipoacusia","sordera","pérdida auditiva","audiometria alterada"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Otoscopía normal no asociada a hipoacusia súbita ni traumática (barotrauma) ni a vértigo", examenes:"Otoscopía (descartando tapón de cerumen)", notas:"Estrategia Otorrino APS: hipoacusias no GES, síndrome vertiginoso ≥15 años, cerumen refractario, OMS ≥15 años" },
    { cie10:"H612",  nombre:"Cerumen impactado con contraindicación de lavado", sinonimos:["cerumen impactado","tapón oído","cera oido","cerumen contraindicacion lavado"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P1-P2", criterios:"Lavado de oídos debe realizarse en APS. Derivar si contraindicación de lavado (vértigo, otalgia u otorrea presente)", examenes:"No aplica", notas:"Derivar según sospecha diagnóstica subyacente" },
    { cie10:"H931a", nombre:"Tinnitus con hipoacusia súbita <2 semanas", sinonimos:["tinnitus hipoacusia subita","acufeno agudo","tinnitus agudo"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P0", criterios:"Asociado a hipoacusia súbita de <2 semanas de evolución", examenes:"Otoscopía (descartando tapón de cerumen)", notas:"" },
    { cie10:"H931b", nombre:"Tinnitus sin hipoacusia", sinonimos:["tinnitus","acufeno crónico","silbido oído","zumbido oído"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"No asociado a hipoacusia", examenes:"Otoscopía (descartando tapón de cerumen)", notas:"" },
    { cie10:"H619",  nombre:"Hematoma pabellón auricular", sinonimos:["hematoma pabellon auricular","hematoma oreja","trauma auricular"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Sospecha clínica", examenes:"No aplica", notas:"Derivar directamente a Urgencia (Anexo N°1)" },
    { cie10:"S022",  nombre:"Fractura huesos de la nariz", sinonimos:["fractura nasal","nariz fracturada","trauma nasal"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Sospecha clínica", examenes:"No aplica", notas:"Derivar directamente a Urgencia (Anexo N°1)" },
    { cie10:"S003",  nombre:"Hematoma septal", sinonimos:["hematoma septal","tabique hematoma","hematoma nasal"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Clínica compatible", examenes:"No aplica", notas:"Derivar directamente a Urgencia (Anexo N°1)" },
    { cie10:"J036a", nombre:"Amigdalitis aguda complicada – absceso periamigdalino", sinonimos:["absceso periamigdalino","amigdalitis complicada","absceso cervical profundo","angina de Ludwig"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Complicada: Absceso Periamigdalino (J36), Absceso Cervical Profundo (L02.1), Absceso cutáneo/furúnculo/carbunco del cuello", examenes:"No aplica", notas:"" },
    { cie10:"J039",  nombre:"Amigdalitis aguda recurrente", sinonimos:["amigdalitis recurrente","amigdalitis frecuente","anginas frecuentes"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Recurrente: 7 episodios en 1 año / 5 episodios por año en 2 años / 3 episodios por año en los últimos 3 años", examenes:"No aplica", notas:"" },
    { cie10:"J351",  nombre:"Hiperplasia Amigdalina grado 3-4 o asociada a SAHOS", sinonimos:["amígdalas hipertróficas","amigdalas grado 3","amigdalas grado 4","SAHOS amígdalas"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Grado 3 y 4 (ver Anexo N°4) o Asociada a clínica de SAHOS", examenes:"No aplica", notas:"Ver Anexo N°4 para clasificación de grados amigdalinos" },
    { cie10:"J352",  nombre:"Hipertrofia de Adenoides sintomática", sinonimos:["adenoides","hipertrofia adenoidea","vegetaciones adenoideas","respiración bucal"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Sintomática (ronquidos, respiración bucal, apneas obstructivas) + Grado 3 u obstrucción >70%", examenes:"Rx cavum (según disponibilidad)", notas:"" },
    { cie10:"R490a", nombre:"Disfonía >= 21 días o progresiva", sinonimos:["disfonia prolongada","ronquera persistente","disfonía progresiva","nodulo laringeo"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P1", criterios:">= 21 días o progresiva", examenes:"No aplica", notas:"Descartar etiología maligna" },
    { cie10:"R490b", nombre:"Disfonía intermitente", sinonimos:["disfonia intermitente","ronquera intermitente","voz ronca ocasional"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Intermitente", examenes:"No aplica", notas:"" },
    { cie10:"R061",  nombre:"Estridor", sinonimos:["estridor","estridor laringeo","estridor inspiratorio","croup"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Clínica compatible", examenes:"No aplica", notas:"" },
    { cie10:"Q179",  nombre:"Malformación auricular o nasal congénita", sinonimos:["malformación auricular","malformación nasal","atresia aural","microtia"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P2", criterios:"Clínica compatible", examenes:"No aplica", notas:"Q17.9: malformación oído / Q30.9: malformación nariz" },
    { cie10:"T16X",  nombre:"Cuerpo extraño en oído o fosa nasal", sinonimos:["cuerpo extraño oido","cuerpo extraño nariz","CE oido","CE nariz"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P0", criterios:"Clínica compatible", examenes:"No aplica", notas:"Cuerpo extraño nariz y oído → Urgencia directa (Anexo N°1)" },
    { cie10:"T172",  nombre:"Cuerpo extraño en faringe/laringe/tráquea/bronquio", sinonimos:["cuerpo extraño vía aérea","CE faringe","CE tráquea","CE bronquio","cuerpo extraño aspirado"], especialidad:"Otorrinolaringología", destino:"Servicio de Urgencia", prioridad:"P0", criterios:"Clínica compatible", examenes:"No aplica", notas:"" },
    { cie10:"C760",  nombre:"Tumor cabeza y cuello", sinonimos:["tumor cabeza cuello","masa cervical","linfonodo cervical maligno","tumor ORL maligno"], especialidad:"Otorrinolaringología", destino:"Otorrinolaringología", prioridad:"P1", criterios:"Examen físico, imagen o biopsia compatible", examenes:"Descripción del examen físico o informe de imagen o resultado de la biopsia", notas:"" },
    // ── Oftalmología nuevos del docx actualizado ───────────────────────────
    { cie10:"H353a", nombre:"DMRE Húmeda", sinonimos:["DMRE humeda","degeneracion macular humeda","neovascular","metamorfopsias"], especialidad:"Oftalmología", destino:"POLI DE CHOQUE", prioridad:"P0", criterios:"Disminución brusca AV, metamorfopsias, entopsias, fotopsias, alteración campo visual central", examenes:"AV, rejilla de Amsler, fondo de ojo", notas:"Poli de Choque: urgencia nivel secundario 8:00-12:00 hrs" },
    { cie10:"S050",  nombre:"Trauma Ocular", sinonimos:["trauma ocular","lesion ojo","cuerpo extraño ojo","herida ojo","contusion ocular"], especialidad:"Oftalmología", destino:"UTO Hospital del Salvador", prioridad:"P0", criterios:"Cualquier trauma ocular", examenes:"AV", notas:"UTO Hospital del Salvador: L-V 8:00-20:00 hrs / S-D-F 9:00-20:00 hrs" },
    { cie10:"H100",  nombre:"Conjuntivitis bacteriana refractaria", sinonimos:["conjuntivitis bacteriana refractaria","conjuntivitis purulenta","secrecion purulenta ojo"], especialidad:"Oftalmología", destino:"UAPO / Poli choque (neonatos)", prioridad:"P1", criterios:"Sin respuesta al 7° día de tto bien llevado. Neonatos <= 1 mes: Poli de Choque P0", examenes:"Cultivo secreción si disponible, AV", notas:"Neonatos <= 1 mes: derivar a Poli de Choque P0" },
    { cie10:"H101",  nombre:"Conjuntivitis alérgica <20 años", sinonimos:["conjuntivitis alérgica niños","conjuntivitis alergica joven","picazon ojos joven"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P1", criterios:"Sin respuesta a los 14 días de tto bien llevado, en menor de 20 años", examenes:"AV, clínica alérgica", notas:"" },
    { cie10:"M350a", nombre:"Ojo seco con antecedentes reumatológicos", sinonimos:["ojo seco reumatologico","sjogren","ojo seco autoinmune"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P1", criterios:"Paciente con antecedentes previos reumatológicos. Evaluar patología reumatológica asociada", examenes:"ANA, FR, anti-SSA/SSB (Sjögren), hemograma, VHS", notas:"" },
    { cie10:"H000a", nombre:"Orzuelo con sospecha celulitis palpebral", sinonimos:["orzuelo complicado","celulitis palpebral","infeccion parpado"], especialidad:"Oftalmología", destino:"Oftalmo. / UAPO", prioridad:"P1", criterios:"Sospecha de celulitis palpebral", examenes:"Clínica, AV", notas:"" },
    { cie10:"H001a", nombre:"Chalazión complicado", sinonimos:["chalazion complicado","granuloma palpebral","chalazion recurrente"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P1", criterios:"Chalazión con: disminución campo visual, granuloma expuesto, recurrente en mismo lugar (descartar neoplasia)", examenes:"AV, campo visual", notas:"" },
    { cie10:"H110a", nombre:"Pterigión con invasión corneal", sinonimos:["pterigion invasivo","pterigion corneal","pterigion diplopía"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P1", criterios:"Diplopía, disminución AV, alteración motilidad ocular por invasión corneal", examenes:"AV, biomicroscopía", notas:"" },
    { cie10:"H010a", nombre:"Blefaritis grave <15 años o con invasión corneal", sinonimos:["blefaritis grave","blefaritis niños","blefaritis corneal"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P1", criterios:"Dolor, fotofobia, disminución AV, anormalidades corneales, o paciente <15 años", examenes:"AV, biomicroscopía", notas:"" },
    { cie10:"H351",  nombre:"Retinopatía del prematuro GES", sinonimos:["retinopatia prematuro","prematuro fondo ojo","ROP"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Sospecha en prematuro", examenes:"Antecedentes perinatales", notas:"GES" },
    { cie10:"H527a", nombre:"Vicio de Refracción GES >= 65 años", sinonimos:["miopia anciano","astigmatismo anciano","presbicia","vicios de refraccion adulto mayor"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Paciente >= 65 años con alteración visual", examenes:"AV, refracción", notas:"GES" },
    { cie10:"H509a", nombre:"Estrabismo GES <9 años", sinonimos:["estrabismo niños","estrabismo GES","ambliopía","bizco","ojo vago"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Sospecha de estrabismo en menores de 9 años", examenes:"AV, test cover-uncover, refracción", notas:"GES" },
    { cie10:"H509b", nombre:"Estrabismo NO GES >9 años", sinonimos:["estrabismo adulto","estrabismo no GES","desviación ocular"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P2", criterios:"Sospecha de estrabismo en mayores de 9 años", examenes:"AV, test cover-uncover, refracción", notas:"" },
    { cie10:"H102",  nombre:"Conjuntivitis alérgica >= 20 años", sinonimos:["conjuntivitis alérgica adulto","conjuntivitis alergica"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P2", criterios:"Sin respuesta a los 30 días de tto bien llevado, en mayor de 20 años", examenes:"AV, clínica alérgica", notas:"" },
    { cie10:"M350b", nombre:"Ojo seco sin antecedentes reumatológicos", sinonimos:["ojo seco","síndrome ojo seco","sequedad ocular"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P2", criterios:"Refractario a 30 días de lágrimas artificiales. Evaluar patología reumatológica por exámenes", examenes:"ANA, FR (para descartar Sjögren)", notas:"" },
    { cie10:"H110b", nombre:"Pterigión sintomático sin invasión corneal", sinonimos:["pterigion sintomatico","ojo rojo pterigion","pterigion inflamado"], especialidad:"Oftalmología", destino:"UAPO / Oftalmo.", prioridad:"P2", criterios:"Paciente sintomático con signos inflamatorios, refractario a tto médico desde UAPO", examenes:"AV, biomicroscopía", notas:"" },
    { cie10:"H001b", nombre:"Chalazión sin complicaciones", sinonimos:["chalazion simple","quiste palpebral","calacio"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P2", criterios:"Sin respuesta a medidas de nivel primario después de 3 meses", examenes:"AV", notas:"" },
    { cie10:"H010b", nombre:"Blefaritis refractaria a 30 días", sinonimos:["blefaritis refractaria","inflamacion parpados cronica","seborea palpebral"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P2", criterios:"Refractaria a tto bien llevado en 30 días", examenes:"AV, biomicroscopía", notas:"" },
    // ── GES adicionales del docx ────────────────────────────────────────────
    { cie10:"E66A",  nombre:"Obesidad para bariátrica – IMC >= 40", sinonimos:["obesidad morbida bariatrica","IMC 40","bypass gastrico","manga gastrica"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC >= 40, con o sin comorbilidades. Sin descompensación en últimos 6 meses. Manejo 6 meses en APS con cambio estilo de vida. Edades 16-70 años", examenes:"Hemograma, creatinina+VFG, glicemia, HbA1c, albúmina, proteínas, calcio, fósforo, magnesio, LDH, ELP, función hepática completa, perfil lipídico, TSH+T4L, coagulación (INR,TP,TTPa), 25-OH VitD, B12, perfil ferrocinético, uroanálisis, EDA+Ureasa+biopsias, eco abdominal, espirometría, test esfuerzo", notas:"IC preop: Cardiología (cardiopatía/IC FEVI≤40%), Broncopulmonar (asma no controlada/SAHOS), Gastro (transaminasas alteradas/fibrosis). IMC ≥50: kinesioterapia cardiorrespiratoria preoperatoria HSJD" },
    { cie10:"E66B",  nombre:"Obesidad para bariátrica – IMC >= 35 con comorbilidad", sinonimos:["obesidad severa bariatrica","IMC 35 comorbilidad","obesidad HTA bariatrica"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC >= 35 con al menos 1 comorbilidad (HTA, DM2, SAHOS, dislipidemia, artrosis severa). Sin descompensación últimos 6 meses. Manejo 6 meses en APS", examenes:"Mismo set de exámenes que IMC >=40", notas:"" },
    { cie10:"E66C",  nombre:"Obesidad para bariátrica – IMC >= 30 con DM2", sinonimos:["obesidad DM2 bariatrica","IMC 30 diabetes","cirugía metabólica DM2"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC >= 30 con Diabetes mellitus tipo 2. Manejo 6 meses en APS", examenes:"Mismo set de exámenes que IMC >=40", notas:"" },
  ];
// ── Array global en memoria ─────────────────────────────────────────────────
  window.DB = [];

  // ── Inicializar Firebase ────────────────────────────────────────────────────
  const { initializeApp }    = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
  const { getFirestore, collection, getDocs, doc, setDoc,
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
    { id:"prueba_dx", tipo:"Prueba Diagnóstica", nombre:"Endoscopia Digestiva Alta con test de Ureasa", modalidad:"Endoscopia", establecimiento:"Contralor", prioridad:"Normal / Alta (sospecha Ca)", diagnosticos:"K25 Úlcera gástrica, D00.2 Ca gástrico, R63.4 Pérdida de peso, K29.7 Gastritis no especificada", criterios:"Clasificación diagnóstica. Prioridad Normal o Alta (sospecha Ca). Fundamentos clínicos + teléfono. ¿Resolutividad? Sí. Derivar a contralor: Sí", notas:"" },
    { id:"eco_mamaria", tipo:"Imagenología", nombre:"Ecotomografía Mamaria", modalidad:"Ecografía", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"Z12.3 Examen de pesquisa especial para tumor de la mama", criterios:"Clasificación diagnóstica. Fundamentos clínicos. Prioridad Normal. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"mamo_comp", tipo:"Imagenología", nombre:"Proyecciones Mamográficas Complementarias", modalidad:"Ecografía", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"Z12.3 Examen de pesquisa especial para tumor de la mama", criterios:"Clasificación diagnóstica. Fundamentos clínicos. Prioridad Normal. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"mamografia", tipo:"Imagenología", nombre:"Mamografía Bilateral (4 exp.)", modalidad:"Radiología simple", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"Z12.3 Examen de pesquisa especial para tumor de la mama", criterios:"Clasificación diagnóstica. Fundamentos clínicos. Prioridad Normal. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"rx_pelvis", tipo:"Imagenología", nombre:"Radiografía Pelvis (lactante o niño < 6 años)", modalidad:"Radiología simple", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"Q65.4 Subluxación congénita de la cadera, bilateral", criterios:"Clasificación diagnóstica. Fundamentos clínicos. Prioridad Normal. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"eco_abdominal", tipo:"Imagenología", nombre:"Ecotomografía Abdominal", modalidad:"Ecografía", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"K80 Colelitiasis, R10 Dolor abdominal parte superior", criterios:"Incluye hígado, vía biliar, vesícula, páncreas, riñones, bazo, retroperitoneo y grandes vasos. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"rx_torax", tipo:"Imagenología", nombre:"Radiografía de Tórax", modalidad:"Radiografía", establecimiento:"Contralor", prioridad:"Normal", diagnosticos:"J15 Neumonía bacteriana, J45 Asma bronquial, J44.9 EPOC", criterios:"Frontal y lateral (incluye fluoroscopia) 1-2 proy. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"fondo_ojo", tipo:"Procedimiento", nombre:"Fondo de Ojo (Presencial)", modalidad:"Fondo de ojo", establecimiento:"UAPO Cerro Navia", prioridad:"Normal", diagnosticos:"E11 Diabetes Mellitus No insulinodependiente, E11.7 DM con múltiples complicaciones", criterios:"Solo DM2 confirmada. Frecuencia anual. Sin diagnóstico confirmado de retinopatía o cataratas no operada. Marcar GES. Extrasistema: No. Resolutividad: No. Derivar a contralor: Sí", notas:"Extrasistema: NO. GES obligatorio." },
    { id:"cirugia_menor", tipo:"Cirugía Menor", nombre:"Cirugía Menor", modalidad:"Cirugía menor", establecimiento:"Cesfam Dr. Albertz", prioridad:"Normal", diagnosticos:"Biopsias cutáneas, fibromas blandos, papilomas, acrocordones, nevus típicos, verrugas, granuloma piógeno, angiomas, onicocriptosis, cuerpo extraño cutáneo, tumor benigno subcutáneo, lipoma, quiste epidérmico, quiste sebáceo, verruga plantar", criterios:"Lesiones hasta 3 cm. Describir tamaño y localización. Extrasistema: No. Resolutividad: No. Derivar a contralor: Sí. Agregar código CIE-10 y teléfono en fundamento.", notas:"NO derivar: lesiones en cara/pliegues (excepto acrocordones), abscesos en periodo inflamatorio, lesiones sospechosas de malignidad de teledermatología, lesiones anogenitales, pacientes con TACO." },
    { id:"rehab_adulto", tipo:"Rehabilitación Física", nombre:"Evaluación y Tratamiento por Rehabilitación Física (Adulto)", modalidad:"Rehabilitación", establecimiento:"Hospital Félix Bulnes Cerda / Sala RBC", prioridad:"Normal", diagnosticos:"Patologías agudas y crónicas osteomusculares", criterios:"Patologías AGUDAS (<3 meses evolución) → Hospital Félix Bulnes Cerda. Patologías CRÓNICAS (>3 meses evolución) → Sala RBC. Fundamentos clínicos + teléfono. Resolutividad: Sí. Derivar a contralor: Sí", notas:"" },
    { id:"telederma", tipo:"Dermatología APS", nombre:"Teledermatología (Consulta Médica Especialidad Dermatología)", modalidad:"Teledermatología", establecimiento:"Cesfam al cual esté inscrito", prioridad:"Normal", diagnosticos:"Patologías dermatológicas (ver indicaciones)", criterios:"Diagnósticos de dermatología acorde. Envío de fotografías con consentimiento al correo referente según Cesfam. Extrasistema: No. Resolutividad: No. Derivar a contralor: Sí", notas:"NO derivar: verrugas anogenitales, procedimientos quirúrgicos, patología oral, pie diabético, quemaduras agudas, shock anafiláctico." },
    { id:"ortesis", tipo:"Órtesis", nombre:"Entrega de Órtesis", modalidad:"Órtesis", establecimiento:"Cesfam al cual esté inscrito", prioridad:"Normal", diagnosticos:"Adultos ≥65 años (GES). 45-64 años programa piloto: artrosis cadera/rodilla, dependientes severos, DM2 con úlcera activa, ACV, amputaciones EEII, lesión medular, síndrome Post-UCI", criterios:"Previo GES Órtesis en mayores de 65 años. Programa piloto 45-64 años para casos específicos. Fundamentos clínicos + teléfono. Extrasistema: No. Resolutividad: No. Derivar a contralor: Sí", notas:"Órtesis disponibles: Bastón con codera móvil, Andador con/sin ruedas, Silla de ruedas, Cojín Anti-escaras, Colchón Anti-escaras." },
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

  // Avisar a las otras páginas que DB está lista
  document.dispatchEvent(new Event("sicmed:ready"));

})();
