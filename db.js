// ─── DERIVMED — Firebase Firestore integration ────────────────────────────────
// Reemplaza db.js por este archivo cuando uses Firebase.
// Instrucciones: https://firebase.google.com/docs/firestore/quickstart

// ── 1. PEGA AQUÍ TU CONFIGURACIÓN DE FIREBASE ────────────────────────────────
// (la encuentras en tu proyecto Firebase > Configuración > Tu app web)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbT9L872CeyMcIuwHtK5UjyA3jJKAF8i0",
  authDomain: "derivmed.firebaseapp.com",
  projectId: "derivmed",
  storageBucket: "derivmed.firebasestorage.app",
  messagingSenderId: "742083987090",
  appId: "1:742083987090:web:9c9c32ca82a82cd882484b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// ─────────────────────────────────────────────────────────────────────────────

// ── 2. DATOS BASE (se cargan a Firestore la primera vez) ──────────────────────
// Esta es la copia local de los diagnósticos del protocolo SSMOCC.
// Solo se usa para poblar Firestore si la colección está vacía.
const DB_BASE = [
  { cie10:"E035",  nombre:"Coma mixedematoso", sinonimos:["coma mixedema","mixedema"], especialidad:"Endocrinología", destino:"Urgencia", prioridad:"P0", criterios:"Sospecha fundada", examenes:"Clínica suficiente", notas:"Derivar directamente a urgencia" },
  { cie10:"E055",  nombre:"Crisis / Tormenta tirotóxica", sinonimos:["tormenta tirotoxica","crisis tirotoxica"], especialidad:"Endocrinología", destino:"Urgencia", prioridad:"P0", criterios:"Sospecha fundada", examenes:"Clínica suficiente", notas:"" },
  { cie10:"E060",  nombre:"Tiroiditis aguda", sinonimos:["tiroiditis aguda"], especialidad:"Endocrinología", destino:"Urgencia", prioridad:"P0", criterios:"Sospecha fundada", examenes:"Clínica suficiente", notas:"" },
  { cie10:"E038",  nombre:"Hipotiroidismo en embarazada", sinonimos:["hipotiroidismo embarazo","gestante hipotiroidismo"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Hipotiroidismo en embarazada. Sospecha de origen central. Hipotiroidismo no compensado con patología coronaria o IC", examenes:"TSH, T4L", notas:"" },
  { cie10:"E02X",  nombre:"Hipotiroidismo subclínico en embarazada", sinonimos:["hipotiroidismo subclinico embarazada"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Embarazada con hipotiroidismo subclínico", examenes:"TSH, T4L", notas:"" },
  { cie10:"E059",  nombre:"Hipertiroidismo sospecha fundada", sinonimos:["hipertiroidismo","tiroides alta","graves"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Sospecha fundada de hipertiroidismo. Embarazo. Mujer posmenopáusica u hombre >55 años", examenes:"TSH, T4L, T3L", notas:"" },
  { cie10:"E061",  nombre:"Tiroiditis subaguda", sinonimos:["tiroiditis subaguda"], especialidad:"Endocrinología", destino:"Medicina Interna", prioridad:"P1", criterios:"Persistencia clínica a los 30 días desde el inicio de síntomas", examenes:"TSH, T4L, VHS", notas:"" },
  { cie10:"C73X",  nombre:"Cáncer de tiroides", sinonimos:["cancer tiroides","carcinoma tiroideo"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Biopsia positiva o antecedente previo de cáncer de tiroides en últimos 6 meses", examenes:"Ecografía tiroidea + biopsia (PAAF)", notas:"GES" },
  { cie10:"E041",  nombre:"Nódulo tiroideo TIRADS 4b/4c/5", sinonimos:["nodulo tiroideo","tirads 4","tirads 5"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"Nódulo sólido hipoecogénico con microcalcificaciones, márgenes irregulares o más alto que ancho. Nódulo ≥5 mm", examenes:"Ecografía tiroidea con TIRADS", notas:"" },
  { cie10:"D441",  nombre:"Tumor suprarrenal con síndromes", sinonimos:["tumor suprarrenal","feocromocitoma","cushing"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P1", criterios:"HTA refractaria, síndrome de Cushing clínico", examenes:"Cortisol, ACTH, aldosterona (según disponibilidad)", notas:"" },
  { cie10:"E890",  nombre:"Hipotiroidismo post-cirugía Ca tiroides", sinonimos:["hipotiroidismo postcirugía"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P2", criterios:"Antecedente de cáncer de tiroides operado hace >6 meses", examenes:"TSH, T4L", notas:"" },
  { cie10:"E032",  nombre:"Hipotiroidismo por fármacos", sinonimos:["hipotiroidismo amiodarona","hipotiroidismo litio"], especialidad:"Endocrinología", destino:"Medicina Interna", prioridad:"P2", criterios:"Uso concomitante de Amiodarona o Litio de reciente comienzo", examenes:"TSH, T4L", notas:"" },
  { cie10:"E039",  nombre:"Hipotiroidismo no especificado refractario", sinonimos:["hipotiroidismo refractario"], especialidad:"Endocrinología", destino:"Medicina Interna", prioridad:"P2", criterios:"TSH elevado en 2 controles pese a terapia adecuada y adherencia comprobada", examenes:"TSH, T4L, evaluación adherencia", notas:"" },
  { cie10:"E058",  nombre:"Hipertiroidismo subclínico otras edades", sinonimos:["hipertiroidismo subclínico"], especialidad:"Endocrinología", destino:"Medicina Interna", prioridad:"P2", criterios:"Persistencia en 2 exámenes consecutivos alterados", examenes:"TSH, T4L, T3L", notas:"" },
  { cie10:"E041b", nombre:"Nódulo tiroideo TIRADS 3-4a", sinonimos:["nodulo tiroideo tirads 3","tirads 4a"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P2", criterios:"Nódulo ≥1 cm a 1.5 cm según riesgo ecográfico (TIRADS 3 o 4a)", examenes:"Ecografía tiroidea con TIRADS. Si ≥1.5 cm o TIRADS 4a: PAAF", notas:"" },
  { cie10:"D441b", nombre:"Tumor suprarrenal asintomático – incidentaloma", sinonimos:["incidentaloma suprarrenal"], especialidad:"Endocrinología", destino:"Endocrinología", prioridad:"P2", criterios:"Incidentaloma sin síndrome clínico asociado", examenes:"Cortisol, imagen abdominal previa", notas:"" },
  { cie10:"K274",  nombre:"Úlcera péptica con hemorragia activa", sinonimos:["ulcera peptica hemorragia","sangrado forrest"], especialidad:"Gastroenterología", destino:"Urgencia", prioridad:"P0", criterios:"Hemorragia activa Forrest I a IIB", examenes:"Clínica + EDA urgente", notas:"" },
  { cie10:"K224",  nombre:"Disfagia motora severa", sinonimos:["disfagia severa","deglución difícil"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Disfagia severa con alteración nutricional o cuadros respiratorios por aspiración", examenes:"EDA previa", notas:"" },
  { cie10:"K279",  nombre:"Úlcera péptica sin hemorragia refractaria", sinonimos:["ulcera peptica","duodenal","gastrica"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Úlcera en lugares atípicos o múltiples o refractaria a tto 1era línea", examenes:"EDA con test de Ureasa, Hemograma", notas:"" },
  { cie10:"K922",  nombre:"Hemorragia digestiva no precisada", sinonimos:["hemorragia digestiva","sangrado digestivo","melena"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Anemia microcítica con endoscopia normal, hemorragia oculta negativa y tacto rectal normal", examenes:"Hemograma, hemorragia oculta, tacto rectal, EDA previa", notas:"" },
  { cie10:"K861",  nombre:"Pancreatitis crónica", sinonimos:["pancreatitis cronica"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada con ecografía abdominal compatible", examenes:"Ecografía abdominal, amilasa, lipasa, Hemograma", notas:"" },
  { cie10:"K509",  nombre:"Enfermedad de Crohn", sinonimos:["crohn","EII"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada y/o antecedentes personales de patología", examenes:"Hemograma, VHS, PCR, colonoscopia (según disponibilidad)", notas:"" },
  { cie10:"K519",  nombre:"Colitis ulcerosa", sinonimos:["colitis ulcerosa","CU"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada y/o antecedentes personales de patología", examenes:"Hemograma, VHS, PCR, colonoscopia (según disponibilidad)", notas:"" },
  { cie10:"K909",  nombre:"Malabsorción intestinal", sinonimos:["malabsorcion"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada y/o antecedentes personales de patología", examenes:"Hemograma, albúmina, anticuerpos antitransglutaminasa", notas:"" },
  { cie10:"K900",  nombre:"Enfermedad celíaca", sinonimos:["celiaca","gluten"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Sospecha fundada y/o antecedentes personales de patología", examenes:"Hemograma, anticuerpos antitransglutaminasa IgA, IgA total", notas:"" },
  { cie10:"K710",  nombre:"Daño hepático crónico colestásico", sinonimos:["daño hepatico","colestasico"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Patrón colestásico con vía biliar normal no dilatada", examenes:"GOT, GPT, GGT, FA, BT, albúmina, ecografía abdominal", notas:"" },
  { cie10:"K716",  nombre:"Aumento de transaminasas x3", sinonimos:["transaminasas elevadas","GOT","GPT"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P1", criterios:"Elevación de transaminasas 3 veces sobre límite normal, sin criterios de urgencia", examenes:"GOT, GPT, GGT, FA, BT, albúmina, VHB, VHC, ecografía abdominal", notas:"" },
  { cie10:"K754",  nombre:"Hepatitis autoinmune", sinonimos:["hepatitis autoinmune"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Antecedente personal de hepatitis autoinmune no controlada", examenes:"GOT, GPT, ANA, ASMA, IgG, albúmina, BT", notas:"" },
  { cie10:"D376",  nombre:"Tumor hepático sólido", sinonimos:["tumor hepatico","hepatocarcinoma"], especialidad:"Gastroenterología", destino:"Gastroenterología", prioridad:"P1", criterios:"Tumor SÓLIDO objetivado por imágenes", examenes:"Ecografía o TAC abdominal, alfafetoproteína", notas:"" },
  { cie10:"B980",  nombre:"H. pylori refractario", sinonimos:["helicobacter pylori","H. pylori"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"GES", criterios:"Refractario a tto de 1era línea", examenes:"Test de urea en aliento o biopsia gástrica. EDA previa", notas:"GES" },
  { cie10:"K228",  nombre:"Disfagia motora no complicada", sinonimos:["disfagia motora","acalasia"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Sospecha fundada de disfagia motora sin complicaciones", examenes:"EDA, manometría esofágica (según disponibilidad)", notas:"" },
  { cie10:"K219",  nombre:"ERGE refractaria", sinonimos:["reflujo gastroesofagico","ERGE"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Refractario a tto no farmacológico y farmacológico durante 4 meses", examenes:"EDA previa, pHmetría (según disponibilidad)", notas:"" },
  { cie10:"K20X",  nombre:"Esofagitis grado C o D", sinonimos:["esofagitis severa","grado C","grado D"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Objetivada por EDA, refractaria a IBP 2 meses y/o grado C o D", examenes:"EDA con informe de grado", notas:"" },
  { cie10:"K599",  nombre:"SII refractario", sinonimos:["colon irritable","SII"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Refractario a tto no farmacológico y farmacológico en 3 meses", examenes:"Colonoscopia (según disponibilidad), Hemograma, PCR", notas:"" },
  { cie10:"K59",   nombre:"Diarrea crónica refractaria", sinonimos:["diarrea cronica"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Refractaria a tto no farmacológico y farmacológico en 4 meses", examenes:"Coprocultivo, Hemograma, colonoscopia (según disponibilidad)", notas:"" },
  { cie10:"K30X",  nombre:"Dispepsia refractaria", sinonimos:["dispepsia"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Refractaria a tto no farmacológico y farmacológico en 6 meses", examenes:"EDA, H. pylori, Hemograma", notas:"" },
  { cie10:"K703",  nombre:"Daño hepático crónico alcohólico", sinonimos:["daño hepatico alcoholico"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Paciente en control en programa alcohol o drogas u otro en APS o COSAM", examenes:"GOT, GPT, GGT, FA, BT, albúmina, TP, ecografía abdominal", notas:"" },
  { cie10:"R17X",  nombre:"Ictericia hepática", sinonimos:["ictericia"], especialidad:"Gastroenterología", destino:"Medicina Interna", prioridad:"P2", criterios:"Probable etiología hepática con vía biliar no dilatada en ecografía", examenes:"BT y fracciones, GOT, GPT, GGT, FA, albúmina, ecografía abdominal", notas:"" },
  { cie10:"C950",  nombre:"Leucemia aguda", sinonimos:["leucemia aguda","blastos"], especialidad:"Hematología", destino:"GES / Urgencia", prioridad:"GES", criterios:"Blastos en hemograma, formas inmaduras, bastones de Auer, citopenias con fiebre", examenes:"Hemograma con VHS", notas:"GES" },
  { cie10:"D70X",  nombre:"Leucopenia severa – neutropenia <500", sinonimos:["neutropenia severa","leucopenia"], especialidad:"Hematología", destino:"Urgencia / Hematología", prioridad:"P1", criterios:"Neutropenia <500 u/L", examenes:"Hemograma, VHS, GOT, GPT, GGT, FA, BT, albúmina, VIH", notas:"" },
  { cie10:"D70Xb", nombre:"Leucopenia moderada – neutropenia <1000", sinonimos:["leucopenia moderada"], especialidad:"Hematología", destino:"Hematología / Med. Interna", prioridad:"P1", criterios:"Neutropenia <1000 u/L en 2 hemogramas separados 3 semanas", examenes:"Hemograma, VHS, GOT, GPT, GGT, FA, BT, albúmina, VIH", notas:"" },
  { cie10:"D471",  nombre:"Sd. Mieloproliferativo – Trombocitosis esencial", sinonimos:["trombocitosis esencial"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P1", criterios:"Plaquetas >600.000 en 2 hemogramas separados 1 mes", examenes:"Hemograma, VHS", notas:"" },
  { cie10:"D471b", nombre:"Sd. Mieloproliferativo – Mielofibrosis", sinonimos:["mielofibrosis","esplenomegalia"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P1", criterios:"Esplenomegalia con bicitopenia o pancitopenia, descartado DHC", examenes:"Hemograma, VHS, ecografía abdominal", notas:"" },
  { cie10:"D469",  nombre:"Sd. Mielodisplásico", sinonimos:["mielodisplasia"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P1", criterios:"Bicitopenia-Pancitopenia con anemia normocítica o macrocítica, descartado DHC", examenes:"Hemograma, VHS, GOT, GPT, GGT, FA, BT, albúmina, TP, VIH", notas:"" },
  { cie10:"D531",  nombre:"Anemia megaloblástica", sinonimos:["anemia megaloblastica","vitamina B12"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P1", criterios:"Anemia macrocítica con VCM >120 fl, +/- síntomas neurológicos", examenes:"Hemograma, VHS, B12, ácido fólico, BT y fracciones, LDH, cinética de fierro", notas:"" },
  { cie10:"D685",  nombre:"Trombofilia con trombosis no provocada <50 años", sinonimos:["trombofilia","trombosis joven"], especialidad:"Hematología", destino:"Hematología / Med. Interna", prioridad:"P1", criterios:"Paciente <50 años con trombosis no provocada sin anticoagulación permanente, o 2 eventos trombóticos", examenes:"Hemograma, TP, TTPK", notas:"" },
  { cie10:"C819",  nombre:"Linfoma", sinonimos:["linfoma","adenopatias","ganglio"], especialidad:"Hematología", destino:"GES", prioridad:"GES", criterios:"Adenopatías >1 cm (no inguinales) o >2 cm inguinales por >4 semanas", examenes:"Hemograma, VHS, VIH, VDRL, TAC tórax-abdomen (según disponibilidad)", notas:"GES" },
  { cie10:"C900",  nombre:"Mieloma múltiple", sinonimos:["mieloma multiple","componente monoclonal"], especialidad:"Hematología", destino:"GES", prioridad:"GES", criterios:"2 o más criterios: anemia arregenerativa, VHS >100, hipercalcemia, IR sin causa, dolores óseos, fractura patológica, componente monoclonal", examenes:"Hemograma, VHS, creatinina, calcio, proteínas totales, albúmina, electroforesis proteínas, LDH", notas:"GES" },
  { cie10:"D66X",  nombre:"Hemofilia", sinonimos:["hemofilia","hemartrosis"], especialidad:"Hematología", destino:"GES", prioridad:"GES", criterios:"Hematomas, hemartrosis, hemotórax, hemoperitoneo. Antecedente familiar de hombre con hemofilia", examenes:"Hemograma, TP, TTPK", notas:"GES" },
  { cie10:"D45X",  nombre:"Policitemia vera", sinonimos:["policitemia","eritrocitosis"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"Hto ≥49% (H) o ≥48% (M) / Hb ≥16.5 (H) o ≥16 (M), en 2 hemogramas separados 2 semanas", examenes:"Hemograma, VHS, ecografía abdominal, LDH", notas:"" },
  { cie10:"R161",  nombre:"Esplenomegalia", sinonimos:["esplenomegalia","bazo grande"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"Descartar sd. mieloproliferativo o leucemia, descartado DHC", examenes:"Hemograma, VHS, GPT, GGT, FA, BT, albúmina, ecografía abdominal", notas:"" },
  { cie10:"D509",  nombre:"Anemia ferropriva refractaria", sinonimos:["anemia ferropenia","ferropriva"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"Habiendo descartado causas probables. Refractario a hierro oral 3 meses", examenes:"Hemograma, VHS, hemorragia oculta, cinética de fierro", notas:"Meta Hb: 12 (F) / 13 (M) g/dL" },
  { cie10:"D649",  nombre:"Anemia normocítica-normocrómica", sinonimos:["anemia normocítica"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"En 2 hemogramas separados 1 mes, habiendo descartado ERC, DHC, hipotiroidismo, proceso inflamatorio crónico", examenes:"Hemograma, VHS, creatinina, TSH, T4, función hepática, eco abdominal, cinética de fierro, hemorragia oculta", notas:"" },
  { cie10:"D696",  nombre:"Trombocitopenia", sinonimos:["trombocitopenia","plaquetas bajas"], especialidad:"Hematología", destino:"Medicina Interna / Urgencia si <30.000", prioridad:"P2", criterios:"Plaquetas <100.000 u/L en 2 hemogramas separados 2 semanas, descartado DHC", examenes:"Hemograma, VHS, GOT, GPT, GGT, FA, BT, albúmina, VIH", notas:"Si plaquetas <30.000 o sangrado activo: derivar a Urgencia" },
  { cie10:"D689",  nombre:"Defecto coagulación – TP <60%", sinonimos:["coagulopatia","tiempo protrombina"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"TP <60% repetida 3 veces, descartado DHC, sin anticoagulantes", examenes:"Hemograma, VHS, TP, TTPK, GOT, GPT, GGT, FA, albúmina, BT", notas:"" },
  { cie10:"D685b", nombre:"Trombofilia para estudio", sinonimos:["trombofilia estudio"], especialidad:"Hematología", destino:"Medicina Interna", prioridad:"P2", criterios:"Trombosis no provocada con anticoagulación y necesidad de definir anticoagulación permanente", examenes:"Hemograma, TP, TTPK", notas:"" },
  { cie10:"C951",  nombre:"Leucemia crónica", sinonimos:["leucemia cronica","CLL","CML"], especialidad:"Hematología", destino:"GES", prioridad:"GES", criterios:"Leucocitos >150.000 sin causa clara o Linfocitosis >5.000 en 2 hemogramas separados 1 mes", examenes:"Hemograma con VHS", notas:"GES" },
  { cie10:"N19X",  nombre:"Insuf. Renal no especificada – urgencia", sinonimos:["insuficiencia renal","uremia"], especialidad:"Nefrología", destino:"URGENCIA", prioridad:"P0", criterios:"VFG <15 mL/min/1.73m2 + uno de: edema pulmonar, encefalopatía urémica, K ≥6.0 mEq/L, nitrógeno ureico >100 mg/dL, Na <120 mEq/L", examenes:"EMBD básico + creatinina urgente, electrolitos, gases arteriales", notas:"" },
  { cie10:"N009",  nombre:"Síndrome nefrítico agudo severo", sinonimos:["sindrome nefritico","hematuria edema oligoanuria"], especialidad:"Nefrología", destino:"Urgencia / Nefrología P1", prioridad:"P0", criterios:"Edema, HTA, oligoanuria, hematuria, proteinuria, creatinina +0.5 mg del basal", examenes:"EMBD + orina completa con sedimento activo", notas:"" },
  { cie10:"N179",  nombre:"Insuficiencia Renal Aguda", sinonimos:["insuficiencia renal aguda","IRA"], especialidad:"Nefrología", destino:"Urgencia / Nefrología P1", prioridad:"P0", criterios:"VFG <60 sin antecedentes previos + aumento creatinina ≥0.3 mg/dL o disminución VFG ≥10% en 2 semanas", examenes:"EMBD + ecografía renal (según disponibilidad)", notas:"Derivar antes de 2 semanas" },
  { cie10:"N049",  nombre:"Síndrome nefrótico", sinonimos:["sindrome nefrotico","proteinuria masiva"], especialidad:"Nefrología", destino:"Nefrología / Med. Interna", prioridad:"P1", criterios:"Proteinuria >3.5 gr/24h o RAC >2000 mg/gr, hipoalbuminemia <3.5 mg%, dislipidemia", examenes:"EMBD + albúmina, LDL, ecografía renal", notas:"" },
  { cie10:"N391",  nombre:"Proteinuria persistente >1 gr", sinonimos:["proteinuria persistente"], especialidad:"Nefrología", destino:"Med. Interna / Nefrología", prioridad:"P1", criterios:"Proteinuria >1 gr/24h y <3.5 gr, en 2 RAC separados 2 semanas, creatinina normal, paciente NO diabético", examenes:"EMBD + albúmina, LDL, ecografía renal", notas:"" },
  { cie10:"N184",  nombre:"ERC estadio 4-5", sinonimos:["ERC","insuficiencia renal cronica estadio 4 5"], especialidad:"Nefrología", destino:"Nefrología / Med. Interna", prioridad:"P1", criterios:"VFG <30 mL/min/1.73m2, independiente de edad", examenes:"EMBD + ecografía renal", notas:"" },
  { cie10:"N189",  nombre:"ERC etapa 1-3A con criterios GES", sinonimos:["ERC GES","VFG 45"], especialidad:"Nefrología", destino:"GES", prioridad:"GES", criterios:"VFG <45 mL/min/1.73m2. Paciente <65 años con VFG <60. Disminución VFG >5 ml/min/año. RAC ≥300 mg/g", examenes:"EMBD completo", notas:"GES" },
  { cie10:"N029",  nombre:"Hematuria glomerular", sinonimos:["hematuria glomerular","cilindros hematicos"], especialidad:"Nefrología", destino:"Med. Interna / Nefrología", prioridad:"P2", criterios:"2 o más GR/campo en 2+ exámenes, con proteinuria, cilindros hemáticos. Descartada causa urológica", examenes:"EMBD + ecografía renal, orina completa con sedimento", notas:"NO derivar microhematuria sin proteinuria a Nefrología → derivar a Urología" },
  { cie10:"Q613",  nombre:"Enfermedad poliquística renal", sinonimos:["poliquistica renal","quistes renales multiples"], especialidad:"Nefrología", destino:"Nefrología", prioridad:"P2", criterios:"Múltiples quistes en ecografía renal + antecedentes familiares, HTA y disfunción renal", examenes:"EMBD + ecografía renal con descripción de quistes", notas:"NO derivar quistes renales simples a Nefrología → derivar a Urología" },
  { cie10:"G448",  nombre:"Cefalea con signos de alarma", sinonimos:["cefalea alarma","diplopía"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Inicio >50 años en <6 meses, cambio de patrón <3 meses, empeora con Valsalva o decúbito, despierta de noche, asociado a diplopía o alteración visual", examenes:"Neuroimagen (según disponibilidad)", notas:"Si cefalea en trueno: URGENCIA P0" },
  { cie10:"G440",  nombre:"Cefalea trigeminoautonómica", sinonimos:["cefalea racimos","cluster"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Cefalea intensa unilateral con lagrimeo, inyección conjuntival, rinorrea, sudoración frontal ipsilateral", examenes:"Clínica detallada. Calendario de cefalea", notas:"" },
  { cie10:"G433",  nombre:"Migraña complicada con aura atípica", sinonimos:["migraña aura atipica","focalidad"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Aura con cualquier focalidad neurológica distinta a la visual", examenes:"Clínica detallada, neuroimagen si primera vez", notas:"" },
  { cie10:"G439",  nombre:"Migraña refractaria a profilaxis 3 meses", sinonimos:["migraña refractaria","profilaxis"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Migraña >2-3 veces/sem o invalidante, sin respuesta a tto profiláctico en dosis plena por 3 meses", examenes:"Calendario de cefalea + registro tto profiláctico usado", notas:"" },
  { cie10:"F028",  nombre:"Deterioro cognitivo rápido <6 meses", sinonimos:["deterioro cognitivo rapido"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Deterioro en <6 meses y/o movimientos anormales, parkinsonismo, alteración marcha, edad <65 años", examenes:"Glicemia, hemograma, VHS, TSH, T4L, creatinina, GOT, GPT, VDRL, VIH, B12, Vit D. Minimental + KATZ", notas:"" },
  { cie10:"F002",  nombre:"Demencia Alzheimer descompensada", sinonimos:["alzheimer descompensada"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Descompensada, habiendo descartado delirium", examenes:"Exámenes para descartar causa reversible + Minimental + KATZ", notas:"" },
  { cie10:"G219",  nombre:"Parkinsonismo con signos atípicos", sinonimos:["parkinsonismo atipico"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Bradiquinesia + uno de: temblor reposo, rigidez, inestabilidad postural. Asociado a: demencia, disartria, mioclonías, signos cerebelosos, caídas frecuentes", examenes:"Glicemia, TSH, T4, GOT, GPT, VIH, VDRL, función renal, hemograma", notas:"" },
  { cie10:"G20X",  nombre:"Enfermedad de Parkinson descompensada", sinonimos:["parkinson descompensado","discinesias"], especialidad:"Neurología", destino:"GES / Neurología", prioridad:"GES", criterios:"Discinesias, alteraciones psiquiátricas, no respuesta a levodopa (congelamiento, periodos off), caídas", examenes:"Registro de tto actual y dosis, evaluación motora", notas:"GES" },
  { cie10:"G249",  nombre:"Distonía con signos de alarma", sinonimos:["distonia","espasmo muscular"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Sospecha clínica descartadas causas secundarias. Si invalidante o con signos alarma", examenes:"Glicemia, TSH, función renal y hepática, hemograma, VDRL, VIH", notas:"" },
  { cie10:"G253",  nombre:"Mioclonías", sinonimos:["mioclonias","sacudidas involuntarias"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Sospecha clínica descartadas causas secundarias", examenes:"Glicemia, TSH, función hepática y renal, hemograma", notas:"" },
  { cie10:"G255",  nombre:"Corea – sospecha H. Huntington", sinonimos:["corea","huntington"], especialidad:"Neurología", destino:"Neurología", prioridad:"P1", criterios:"Sospecha clínica descartadas causas secundarias. Huntington: 40-50 años, hereditario, deterioro cognitivo", examenes:"Glicemia, TSH, función hepática y renal, hemograma", notas:"Corea de inicio brusco → URGENCIA P0" },
  { cie10:"G442",  nombre:"Cefalea tensional refractaria", sinonimos:["cefalea tensional cronica"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Cefalea >10-15 veces/mes, refractaria a profilaxis 6 meses (amitriptilina o propranolol)", examenes:"Calendario de cefalea + registro tto profiláctico", notas:"" },
  { cie10:"G444",  nombre:"Cefalea por abuso de fármacos", sinonimos:["cefalea abuso analgesicos","triptanes","AINES"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Refractaria a retiro del fármaco en 1 mes. Uso >10 días/mes ergotamínicos o >15 días/mes triptanes, AINES u opioides ≥3 meses", examenes:"Calendario de cefalea + registro fármacos", notas:"" },
  { cie10:"F03X",  nombre:"Demencia no especificada", sinonimos:["demencia senil","deterioro cognitivo"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Habiendo descartado causas reversibles y depresión. Minimental realizado", examenes:"Glicemia, hemograma, VHS, TSH, T4L, creatinina, GOT/GPT/GGT/FA, bilis total, VDRL, VIH, B12, Vit D. Minimental + KATZ + Yesavage", notas:"Minimental obligatorio antes de derivar" },
  { cie10:"G211",  nombre:"Parkinsonismo inducido por fármacos", sinonimos:["parkinsonismo farmacologico","antipsicóticos"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Sin respuesta a 3 meses de suspensión del fármaco causante", examenes:"Descartar causa secundaria. Listado de fármacos suspendidos", notas:"" },
  { cie10:"G250",  nombre:"Temblor esencial refractario", sinonimos:["temblor esencial","manos postural"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Temblor postural/acción, simétrico, extremidades superiores, mejora con alcohol. Sin respuesta a tto al mes", examenes:"Clínica. Descartar causa secundaria. Registro tto usado", notas:"" },
  { cie10:"G256",  nombre:"Tics invalidantes – sospecha Tourette", sinonimos:["tics","tourette"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Refractarios a tto al mes, sospecha de Sd. de Tourette", examenes:"Clínica. Descartar causa secundaria", notas:"" },
  { cie10:"G259",  nombre:"Síndrome piernas inquietas", sinonimos:["piernas inquietas","restless legs"], especialidad:"Neurología", destino:"Neurología", prioridad:"P2", criterios:"Disestesias en extremidades inferiores en reposo que mejoran con movimiento. Refractario a tto al mes", examenes:"Ferremia, ferritina, TSH, función renal, hemograma. Registro tto usado", notas:"" },
  { cie10:"H353",  nombre:"DMRE Húmeda", sinonimos:["DMRE","macular humeda","metamorfopsias"], especialidad:"Oftalmología", destino:"Poli de Choque", prioridad:"P0", criterios:"Disminución brusca AV, metamorfopsias, entopsias, fotopsias, alteración campo visual central", examenes:"AV, rejilla de Amsler, fondo de ojo", notas:"Poli de Choque: urgencia nivel secundario (8:00-12:00 hrs)" },
  { cie10:"H330",  nombre:"Desprendimiento de retina", sinonimos:["desprendimiento retina","DR"], especialidad:"Oftalmología", destino:"Poli de Choque", prioridad:"P0", criterios:"Caída de telón, fotopsias, entopsias, disminución agudeza visual", examenes:"AV, fondo de ojo", notas:"" },
  { cie10:"H431",  nombre:"Hemorragia vítrea", sinonimos:["hemorragia vitrea","vision roja"], especialidad:"Oftalmología", destino:"Poli de Choque", prioridad:"P0", criterios:"FRCV presentes, visión de mancha roja, pérdida de visión a la luminosidad", examenes:"AV, fondo de ojo", notas:"" },
  { cie10:"H46X",  nombre:"Neuritis óptica", sinonimos:["neuritis optica","escotoma"], especialidad:"Oftalmología", destino:"Poli de Choque", prioridad:"P0", criterios:"Dolor al movimiento del ojo, escotoma central, reflejo pupilar ausente", examenes:"AV, reflejo pupilar, campo visual", notas:"" },
  { cie10:"H402",  nombre:"Glaucoma agudo / Ojo rojo profundo", sinonimos:["glaucoma agudo","uveitis","ojo rojo profundo"], especialidad:"Oftalmología", destino:"Poli de Choque (max 24h)", prioridad:"P0", criterios:"Dolor ocular, fotofobia, disminución AV, inyección ciliar periquerática, midriasis, hipertonía digital", examenes:"AV, tonometría digital, biomicroscopía si disponible", notas:"Máximo 12-24 hrs en glaucoma agudo" },
  { cie10:"H409",  nombre:"Glaucoma crónico refractario", sinonimos:["glaucoma cronico","resistente tratamiento"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P1", criterios:"Desde UAPO: glaucomas secundarios, refractario a tto tópico en 2 controles o 6 meses, ojo único, ángulo estrecho o avanzado", examenes:"AV, tonometría, campimetría (desde UAPO)", notas:"" },
  { cie10:"H103",  nombre:"Conjuntivitis viral con pseudomembrana", sinonimos:["conjuntivitis viral","pseudomembrana"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P1", criterios:"Pseudomembrana presente. Sin respuesta al 10° día de tto bien llevado. Asociado a disminución AV", examenes:"AV, biomicroscopía", notas:"" },
  { cie10:"H499",  nombre:"Estrabismo agudo – diplopía nueva", sinonimos:["estrabismo agudo","diplopía nueva"], especialidad:"Oftalmología", destino:"Oftalmología", prioridad:"P1", criterios:"En diabético: lograr compensación metabólica previo o paralelo. Sospechar causa neurológica: derivar a Urgencia", examenes:"HbA1c (DM), AV, refracción, campo visual", notas:"" },
  { cie10:"H269",  nombre:"Catarata", sinonimos:["catarata","opacidad cristalino"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Paciente >60 años, disminución AV indolora gradual, visión borrosa, percepción colores alterada, diplopía monocular, encandilamiento, rojo pupilar ausente", examenes:"AV, rojo pupilar, refracción", notas:"GES" },
  { cie10:"H360",  nombre:"Retinopatía diabética", sinonimos:["retinopatia diabetica","DM fondo ojo"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Screening anual en DM2 confirmada sin retinopatía ni cataratas. Si DM1: desde 5 años de diagnóstico", examenes:"HbA1c, fondo de ojo con resultado", notas:"GES" },
  { cie10:"H527",  nombre:"Vicio de refracción ≥65 años", sinonimos:["vicio refraccion","miopía","presbicia"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Paciente ≥65 años con alteración visual", examenes:"AV, refracción", notas:"GES" },
  { cie10:"H509",  nombre:"Estrabismo GES <9 años", sinonimos:["estrabismo niño","ambliopia"], especialidad:"Oftalmología", destino:"Según mapa GES", prioridad:"GES", criterios:"Sospecha de estrabismo en menores de 9 años", examenes:"AV, test cover-uncover, refracción", notas:"GES" },
  { cie10:"H353b", nombre:"DMRE Seca", sinonimos:["DMRE seca","macular atrofica","drusen"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P2", criterios:"Paciente >50 años con FRCV, antecedentes familiares, disminución variable AV, mala adaptación nocturna", examenes:"AV, rejilla de Amsler, fondo de ojo", notas:"" },
  { cie10:"H527b", nombre:"Vicio de refracción 15-64 años", sinonimos:["vicio refraccion adulto","astigmatismo"], especialidad:"Oftalmología", destino:"UAPO", prioridad:"P2", criterios:"Paciente 15-64 años con alteración visual", examenes:"AV, refracción", notas:"" },
  { cie10:"E660",  nombre:"Obesidad para bariátrica – IMC ≥40", sinonimos:["obesidad morbida","IMC 40","bariatrica"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC ≥40 con o sin comorbilidades. Sin descompensación en últimos 6 meses. Manejo 6 meses en APS. Edad 16-70 años con red de apoyo efectiva", examenes:"Hemograma, creatinina, VFG, glicemia basal, HbA1c, albúmina, proteínas totales, calcio, fósforo, magnesio, LDH, electrolitos, funcionalismo hepático, perfil lipídico, perfil tiroideo, INR/TP/TTPa, 25-OH Vit D, Vit B12, perfil ferrocinético, uroanálisis. EDA con Test de Ureasa, ecografía abdominal, espirometría y test de esfuerzo", notas:"Previo a derivación: 6 meses a 1 año manejo en APS" },
  { cie10:"E661",  nombre:"Obesidad para bariátrica – IMC ≥35 con comorbilidad", sinonimos:["obesidad IMC 35","comorbilidad","bariatrica"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC ≥35 con al menos 1 comorbilidad (HTA, DM2, SAHOS, dislipidemia, artrosis severa). Sin descompensación últimos 6 meses. Manejo 6 meses en APS", examenes:"Mismo set de exámenes que IMC ≥40", notas:"" },
  { cie10:"E66D",  nombre:"Obesidad para bariátrica – IMC ≥30 con DM2", sinonimos:["obesidad diabetes","IMC 30","DM2","bariatrica"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC ≥30 con Diabetes mellitus tipo 2. Manejo 6 meses en APS", examenes:"Mismo set de exámenes que IMC ≥40", notas:"" },
  { cie10:"E66E",  nombre:"Obesidad para bariátrica – IMC 30-34.9 sin respuesta APS", sinonimos:["obesidad sin pérdida peso","IMC 30 34","bariatrica"], especialidad:"Cirugía Bariátrica", destino:"Nutriología Adulto HSJD", prioridad:"P2", criterios:"IMC 30-34.9. Manejo 1 año en APS sin lograr pérdida de peso sustancial (5-15% por mínimo 3 meses) ni control de comorbilidades", examenes:"Mismo set de exámenes que IMC ≥40", notas:"Requiere 1 año de manejo en APS documentado" },
];

// ── 3. ARRAY EN MEMORIA (lo usa todo el sitio) ────────────────────────────────
var DB = [];

// ── 4. INICIALIZACIÓN: carga desde Firestore ──────────────────────────────────
import { initializeApp }    from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc,
         setDoc, deleteDoc, addDoc, Timestamp,
         query, orderBy, onSnapshot }
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const _app = initializeApp(FIREBASE_CONFIG);
const _db  = getFirestore(_app);

const COL_DIAG = "diagnosticos";
const COL_LOG  = "historial";

// Carga inicial
async function _cargarDB() {
  const snap = await getDocs(collection(_db, COL_DIAG));
  if (snap.empty) {
    // Primera vez: poblar con datos base
    console.log("Poblando Firestore con datos del protocolo SSMOCC…");
    for (const d of DB_BASE) {
      await setDoc(doc(_db, COL_DIAG, d.cie10), d);
    }
    DB.push(...DB_BASE);
  } else {
    snap.forEach(function(d) { DB.push(d.data()); });
  }
  document.dispatchEvent(new Event("derivmed:ready"));
}
_cargarDB().catch(console.error);

// ── 5. FUNCIONES CRUD (llamadas desde admin.js) ───────────────────────────────

async function STORE_save(accion, entrada) {
  // Guardar/actualizar diagnóstico
  await setDoc(doc(_db, COL_DIAG, entrada.cie10), entrada);
  // Actualizar array en memoria
  var idx = DB.findIndex(function(d){ return d.cie10 === entrada.cie10; });
  if (accion === "NUEVO")   { if (idx === -1) DB.push(entrada); }
  else if (accion === "EDITADO") { if (idx !== -1) DB[idx] = entrada; }
  // Guardar en historial
  await addDoc(collection(_db, COL_LOG), {
    fecha:        Timestamp.now(),
    accion:       accion,
    cie10:        entrada.cie10,
    nombre:       entrada.nombre,
    especialidad: entrada.especialidad,
    prioridad:    entrada.prioridad
  });
}

async function STORE_delete(cie10) {
  var d = DB.find(function(x){ return x.cie10 === cie10; });
  if (!d) return;
  await deleteDoc(doc(_db, COL_DIAG, cie10));
  var idx = DB.findIndex(function(x){ return x.cie10 === cie10; });
  if (idx !== -1) DB.splice(idx, 1);
  await addDoc(collection(_db, COL_LOG), {
    fecha:        Timestamp.now(),
    accion:       "ELIMINADO",
    cie10:        d.cie10,
    nombre:       d.nombre,
    especialidad: d.especialidad,
    prioridad:    d.prioridad
  });
}

async function STORE_getLog() {
  var log = [];
  var q   = query(collection(_db, COL_LOG), orderBy("fecha", "desc"));
  var snap = await getDocs(q);
  snap.forEach(function(d) {
    var data = d.data();
    log.push({
      fecha:        data.fecha.toDate().toISOString(),
      accion:       data.accion,
      cie10:        data.cie10,
      nombre:       data.nombre,
      especialidad: data.especialidad,
      prioridad:    data.prioridad
    });
  });
  return log;
}

// ── 6. BÚSQUEDA (igual que antes) ─────────────────────────────────────────────
function searchDB(query_str) {
  if (!query_str || query_str.trim().length < 2) return [];
  var q = query_str.trim().toLowerCase();
  var results = DB.filter(function(d) {
    return d.cie10.toLowerCase().includes(q) ||
           d.nombre.toLowerCase().includes(q) ||
           (d.sinonimos||[]).some(function(s){ return s.toLowerCase().includes(q); }) ||
           d.especialidad.toLowerCase().includes(q);
  });
  results.sort(function(a, b) {
    var aE = a.cie10.toLowerCase() === q ? -2 : a.cie10.toLowerCase().startsWith(q) ? -1 : 0;
    var bE = b.cie10.toLowerCase() === q ? -2 : b.cie10.toLowerCase().startsWith(q) ? -1 : 0;
    return aE - bE || a.nombre.localeCompare(b.nombre, "es");
  });
  return results.slice(0, 12);
}
