// ─── SICMED – Guías y Protocolos (datos reales SSMOCC) ────────────────────────
(function() {
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  var GUIAS = [
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
      id:'hematologia', icono:'🩸', color:'#c0392b',
      titulo:'Protocolo Hematología – SSMOcc v1.0',
      descripcion:'Derivación de síndromes mieloproliferativos, anemias, leucopenias, trombocitopenias, linfomas y leucemias. Oct 2023-2027.',
      secciones:[
        { subtitulo:'GES / Urgencia', contenido:'• C950 Leucemia aguda: blastos, formas inmaduras, bastones Auer, citopenias + fiebre → GES/Urgencia\n• C951 Leucemia crónica: leucocitos >150.000 o linfocitosis >5.000 en 2 Hgr separados 1 mes → GES\n• C819/C859 Linfoma: adenopatías >1cm (no inguinales) >4 semanas, síntomas B → GES\n• C900 Mieloma múltiple: ≥2 criterios (VHS >100, hipercalcemia, dolores óseos, fractura patológica, componente monoclonal) → GES\n• D66X Hemofilia: hematomas, hemartrosis → GES' },
        { subtitulo:'Alta prioridad P1', contenido:'• D70X Neutropenia <500 u/L (VHS, función hepática, VIH) → Urgencia/Hematología\n• D70X Neutropenia <1000 u/L en 2 Hgr / 3 semanas, descartar fármacos → Hematología\n• D471 Trombocitosis esencial: plaquetas >600.000 en 2 Hgr / 1 mes → Med. Interna\n• D471 Mielofibrosis: esplenomegalia + bicitopenia/pancitopenia, descartado DHC → Med. Interna\n• D469 Mielodisplasia: bicitopenia/pancitopenia + anemia normo o macrocítica → Med. Interna\n• D531 Anemia megaloblástica: VCM >120 fl ± síntomas neurológicos (B12, folato) → Med. Interna\n• D685 Trombofilia: paciente <50 años con trombosis no provocada o 2 eventos → Hematología' },
        { subtitulo:'Normal P2', contenido:'• D509 Anemia ferropriva refractaria a hierro oral 3 meses (descartar Ca) → Med. Interna\n• D649 Anemia normocítica-normocrómica en 2 Hgr / 1 mes (descartar ERC, DHC, hipotiroidismo) → Med. Interna\n• D696 Trombocitopenia <100.000 en 2 Hgr / 2 semanas (descartar DHC) → Med. Interna. Si <30.000 → Urgencia\n• D689 Defecto coagulación TP <60% × 3 mediciones, descartado DHC → Med. Interna\n• D45X Policitemia vera: Hto ≥49%(H)/48%(M) en 2 Hgr / 2 semanas → Med. Interna\n• R161 Esplenomegalia: descartar mieloproliferativo o leucemia, sin DHC → Med. Interna\n• D685 Trombofilia para estudio: anticoagulación permanente o embarazo con trombofilia hereditaria → Med. Interna' },
        { subtitulo:'Fármacos que producen neutropenia (Anexo)', contenido:'Diclofenaco, ibuprofeno, AAS, metamizol, sulfazalazina | Haloperidol, clorpromazina, clozapina | Fenitoína, carbamazepina | Cotrimoxazol, beta-lactámicos, ciprofloxacino | Metimazol, propiltiouracilo | Hidralazina, captopril, propranolol | Azatioprina + alopurinol = pancitopenia' },
      ]
    },
    {
      id:'nefrologia', icono:'🫘', color:'#7b5ea7',
      titulo:'Protocolo Nefrología – SSMOcc v1.0',
      descripcion:'Derivación de insuficiencia renal aguda y crónica, síndromes nefrítico y nefrótico, proteinuria y hematuria glomerular.',
      secciones:[
        { subtitulo:'Urgencia P0', contenido:'• N19X IRA grave: VFG <15 + edema pulmonar/encefalopatía urémica/K≥6/Na<120/urea>100 → Urgencia\n• N009 Síndrome nefrítico agudo severo: edema, HTA, oligoanuria, hematuria, creatinina +0.5 mg → Urgencia\n• N179 IRA: VFG <60 sin antecedentes + creatinina ≥0.3 mg/dL o VFG ↓≥10% en 2 sem → Urgencia/Nefrología P1' },
        { subtitulo:'Alta prioridad P1', contenido:'• N049 Síndrome nefrótico: proteinuria >3.5 gr o RAC >2000 + hipoalbuminemia + dislipidemia → Nefrología\n• N391 Proteinuria persistente >1 gr en 2 RAC / 2 semanas, creatinina normal, no diabético → Med. Interna\n• N184/N185 ERC estadio 4-5: VFG <30 → Nefrología\n• N189 ERC criterios GES: VFG <45 o paciente <65 años VFG <60 o caída rápida → GES' },
        { subtitulo:'Normal P2', contenido:'• N029 Hematuria glomerular: GR/campo en 2+ exámenes + proteinuria/cilindros, descartada causa urológica → Med. Interna/Nefrología\n• Q613 Poliquística renal: múltiples quistes + antecedentes familiares + HTA + disfunción renal → Nefrología' },
        { subtitulo:'EMBD Básico Nefrología (incluir siempre)', contenido:'Registro de PA (últimas mediciones), creatinina plasmática con fechas (últimas 2 mediciones), orina completa con sedimento activo, RAC (relación albúmina/creatinina), electrolitos plasmáticos.\nSi diabético: agregar última HbA1c y resultado de último fondo de ojo.\n\nADVERTENCIAS:\n• NO derivar hematurias de causa urológica a Nefrología → derivar a Urología\n• NO derivar quistes renales simples a Nefrología → derivar a Urología' },
      ]
    },
    {
      id:'neurologia', icono:'🧠', color:'#1e8a6e',
      titulo:'Protocolo Neurología – SSMOcc v1.0',
      descripcion:'Derivación de cefaleas, deterioro cognitivo, demencias y movimientos extrapiramidales. Res. Exenta N°3239, Nov 2018.',
      secciones:[
        { subtitulo:'Urgencia P0', contenido:'• Cefalea en trueno / sospecha AVE / meningitis: cefalea intensa de inicio súbito, focalidad neurológica, signos meníngeos, fiebre, SIDA, cáncer, TEC → URGENCIA inmediata\n• G255 Corea de inicio brusco: movimientos arrítmicos, rápidos, incoordinados → URGENCIA' },
        { subtitulo:'Alta prioridad P1', contenido:'• G448 Cefalea con signos alarma: inicio >50 años, empeora con Valsalva, despierta de noche, diplopía → Neurología (neuroimagen)\n• G440 Cefalea trigeminoautonómica: cluster, unilateral + lagrimeo/rinorrea → Neurología\n• G433 Migraña complicada con aura atípica: focalidad neurológica distinta a visual → Neurología\n• G439 Migraña refractaria a profilaxis 3 meses → Neurología\n• F028 Deterioro cognitivo rápido <6 meses, edad <65 años → Neurología (batería exámenes)\n• F002 Demencia Alzheimer descompensada → Neurología\n• G219 Parkinsonismo con signos atípicos → Neurología\n• G20X Parkinson descompensado: discinesias, periodos off, caídas → GES' },
        { subtitulo:'Normal P2', contenido:'• G442 Cefalea tensional refractaria >10-15 veces/mes, 6 meses profilaxis → Neurología\n• G444 Cefalea por abuso de fármacos: >10 días/mes ergotamínicos o >15 días/mes triptanes/AINES → Neurología\n• F03X Demencia no especificada: descartadas causas reversibles + Minimental + KATZ + Yesavage → Neurología\n• G211 Parkinsonismo inducido por fármacos: sin respuesta a suspensión 3 meses → Neurología\n• G250 Temblor esencial refractario: sin respuesta propranolol 20→60mg/día → Neurología\n• G256 Tics invalidantes / sospecha Tourette → Neurología\n• G259 Piernas inquietas refractarias (descartar ferremia, ferritina, TSH, función renal) → Neurología' },
        { subtitulo:'Terapia profiláctica APS recomendada', contenido:'Migraña: Propranolol 20 mg/día, aumentar a 60 mg/día en 3-4 semanas\nCefalea tensional/migraña: Amitriptilina 12.5 mg/noche, aumentar a 25 mg\n\nContraindicaciones propranolol: asma moderada-severa, DM, BAV 2-3°\nContraindicaciones amitriptilina: arritmias, glaucoma, patología prostática\n\nInstrumentos para derivación: Minimental MMSE (26-30 normal; 21-25 leve; 11-20 moderado; 0-10 severo) | KATZ funcional | Yesavage depresión | CAM delirium | Calendario de cefalea' },
      ]
    },
    {
      id:'oftalmologia', icono:'👁️', color:'#3a86c8',
      titulo:'Protocolo Oftalmología – SSMOcc v1.0',
      descripcion:'Derivación de DMRE, glaucoma, retinopatía diabética, cataratas, estrabismo, conjuntivitis y trauma ocular. Res. Exenta N°2570, Nov 2019.',
      secciones:[
        { subtitulo:'Urgencia P0 – Poli de Choque (8:00-12:00 hrs)', contenido:'• H353 DMRE Húmeda: disminución brusca AV, metamorfopsias, fotopsias → Poli de Choque\n• H330 Desprendimiento de retina: caída de telón, fotopsias → Poli de Choque\n• H431 Hemorragia vítrea: visión de mancha roja, FRCV → Poli de Choque\n• H46X Neuritis óptica: dolor al mover el ojo, escotoma central → Poli de Choque\n• H402 Glaucoma agudo / Ojo rojo profundo (queratitis, uveítis, escleritis): dolor, fotofobia, midriasis, hipertonía → Poli de Choque (máx 24h glaucoma)\n• Trauma ocular → UTO Hospital del Salvador (L-V 8-20h / S-D-F 9-20h)' },
        { subtitulo:'Alta prioridad P1', contenido:'• H409 Glaucoma crónico refractario: desde UAPO, secundarios, ojo único, ángulo estrecho → Oftalmología\n• H103 Conjuntivitis viral con pseudomembrana: sin respuesta 10 días → UAPO\n• H100 Conjuntivitis bacteriana refractaria 7 días. Neonatos ≤1 mes → Poli de Choque P0\n• H10.1 Conjuntivitis alérgica <20 años sin respuesta 14 días → UAPO\n• M350 Ojo seco con antecedentes reumatológicos (ANA, FR, anti-SSA/SSB) → UAPO\n• H499 Estrabismo agudo / diplopía nueva: descartar causa neurológica → Oftalmología\n• H000 Orzuelo con sospecha celulitis palpebral → Oftalmología/UAPO\n• H001 Chalazion complicado: ↓campo visual, granuloma expuesto, recurrente → Oftalmología\n• H110 Pterigion con invasión corneal: diplopía, ↓AV, alteración motilidad → Oftalmología\n• H010 Blefaritis grave <15 años o con invasión corneal: fotofobia, ↓AV → Oftalmología' },
        { subtitulo:'Normal P2 y GES', contenido:'• H269 Catarata: paciente >60 años, ↓AV indolora gradual → GES\n• H360 Retinopatía diabética: screening anual DM2, desde 5 años DM1 → GES\n• H527 Vicio de refracción ≥65 años → GES\n• H509 Estrabismo GES <9 años → GES\n• H353 DMRE Seca: >50 años con FRCV y antecedentes → UAPO P2\n• H527 Vicio de refracción 15-64 años → UAPO P2\n• H509 Estrabismo no GES >9 años → Oftalmología P2\n• M350 Ojo seco sin antecedentes reumatológicos, refractario a lágrimas 30 días → UAPO P2\n• H110 Pterigion sintomático, inflamado, refractario a tto médico → UAPO P2\n• H001 Chalazion sin complicaciones, sin respuesta 3 meses → Oftalmología P2\n• H010 Blefaritis refractaria 30 días → UAPO P2' },
        { subtitulo:'Abreviaturas', contenido:'AV: Agudeza visual | FRCV: Factores de riesgo cardiovascular | UAPO: Unidad Atención Primaria Oftalmológica | Poli de Choque: Urgencia nivel secundario 8:00-12:00 hrs | UTO: Unidad Traumatológica Oftalmológica Hospital del Salvador' },
      ]
    },
    {
      id:'otorrino', icono:'👂', color:'#d4820a',
      titulo:'Protocolo Otorrinolaringología – SSMOcc v1.0',
      descripcion:'Protocolo de derivación y priorización ORL adulto e infantil. Código DGD-PROT-N°13, Elaboración Oct-2025, Vigencia Oct-2030.',
      secciones:[
        { subtitulo:'Urgencia P0', contenido:'• H651 Otitis media aguda complicada: otomastoiditis, laberintitis, absceso subperióstico, petrositis, parálisis facial → Urgencia\n• H663 Otitis media crónica complicada: absceso, parálisis facial, trombosis seno cavernoso → Urgencia\n• H600 Otitis externa complicada: celulitis, pericondritis, OE necrotizante, perforación timpánica traumática, sordera súbita, herpes Zóster ótico → Urgencia\n• H813 Vértigo periférico agudo incapacitante → Urgencia\n• H814 Vértigo central: neurinoma acústico, cerebeloso, esclerosis múltiple → Urgencia\n• R040 Epistaxis aguda no autolimitada → Urgencia\n• J019 Rinosinusitis complicada: celulitis orbitaria/preseptal, absceso subperióstico, trombosis seno cavernoso, sinusitis micótica invasiva → Urgencia' },
        { subtitulo:'Alta prioridad P1 (<30 días)', contenido:'• H71X Colesteatoma: sospecha (pólipos o destrucción ósea en otoscopía) → Otorrino\n• C300 Poliposis nasal con obstrucción unilateral (TC cavidades sin contraste) → Otorrino' },
        { subtitulo:'Normal P2 (<6 meses)', contenido:'• H650 Otitis media serosa: hipoacusia + tímpano opaco o síntomas ≥3 meses → Otorrino (evaluar Otorrino APS)\n• H651b Otitis media recurrente: ≥3 episodios/año → Otorrino\n• H663b Otitis media crónica no complicada: perforación timpánica, alteraciones huesecillo, otorrea → Otorrino\n• H813b Vértigo periférico leve-moderado o recurrente → Otorrino (evaluar Otorrino APS)\n• R040b Epistaxis recurrente → Otorrino\n• J339 Poliposis nasal bilateral con hiposmia → Otorrino\n• J342 Desviación septal o hipertrofia cornetes: obstrucción nasal + examen compatible (TC sin contraste) → Otorrino\n• J329 Rinosinusitis crónica: síntomas continuos >12 semanas (TC con contraste, NO Rx simple) → Otorrino\n• J350 Faringoamigdalitis crónica / amígdalas hipertróficas: ≥5 episodios/año × 2 años o ≥3 × 3 años. Amígdalas +3/+4 con ronquido o apneas → Otorrino\n• G473 Ronquido / sospecha SAHOS: apneas observadas + somnolencia diurna + Epworth (solicitar polisomnografía) → Otorrino\n• J380 Disfonía >2 semanas / parálisis cuerdas vocales / nódulo laríngeo (laringoscopía indirecta) → Otorrino\n• H906 Hipoacusia neurosensorial bilateral no GES (audiometría + impedanciometría) → Otorrino' },
        { subtitulo:'Estrategia Otorrino APS (Anexo N°2)', contenido:'Patologías que puede resolver el Otorrino en APS:\n• Hipoacusias no incluidas en GES\n• Síndrome vertiginoso en población ≥15 años\n• Obstrucción conducto auditivo externo por cerumen refractario\n• Otitis media con efusión en población ≥15 años\nIncluye: audiometría, impedanciometría, VIII par, audífonos, fármacos (3 meses)' },
        { subtitulo:'Tabla: Vértigo Central vs Periférico (Anexo N°3)', contenido:'CENTRAL: vértigo puede ser leve o ausente. Inicio súbito (AVE). Permanente. Desequilibrio a todos lados. Nistagmo multidireccional, permanente, no agotable, aumenta al abrir ojos.\nPERIFÉRICO: vértigo siempre presente. Inicio súbito, postural, espontáneo. Regresivo. Desequilibrio a un lado. Nistagmo horizontal rotatorio, agotable, disminuye al abrir ojos. Síntomas neurovegetativos (náuseas, sudoración, tinnitus).' },
      ]
    },
    {
      id:'bariatrica', icono:'⚖️', color:'#217a3c',
      titulo:'Cirugía Bariátrica – Programa Obesidad HSJD',
      descripcion:'Criterios de inclusión y exámenes preoperatorios para derivación a Nutriología Adulto HSJD. DOC-CIR 23, Jun 2024, Vigencia Nov 2029.',
      secciones:[
        { subtitulo:'Criterios de inclusión por IMC', contenido:'• IMC ≥40: con o sin comorbilidades. Sin descompensación últimos 6 meses. Manejo 6 meses en APS\n• IMC ≥35: con ≥1 comorbilidad (HTA, DM2, SAHOS, dislipidemia, artrosis severa). Manejo 6 meses en APS\n• IMC ≥30 con DM2: Diabetes mellitus tipo 2. Manejo 6 meses en APS\n• IMC 30-34.9: Manejo 1 año en APS sin lograr pérdida de peso sustancial (5-15% × mínimo 3 meses) ni control comorbilidades\nEdades: 16 (con consentimiento tutor) a 70 años, con red de apoyo efectiva' },
        { subtitulo:'Exámenes preoperatorios requeridos', contenido:'Laboratorio: Hemograma, creatinina + VFG, glicemia basal, HbA1c, albúmina, proteínas totales y fraccionadas, calcio, fósforo, magnesio, LDH, electrolitos (Na, Cl, K), funcionalismo hepático completo (GOT, GPT, GGT, FA, bilirrubina directa e indirecta), perfil lipídico (CT, HDL, LDL, TG), perfil tiroideo (TSH, T4L), coagulación (INR, TP, TTPa), 25-OH Vit D, Vit B12, perfil ferrocinético (ferremia, transferrina, saturación transferrina, ferritina), uroanálisis\n\nImágenes y procedimientos: EDA con Test de Ureasa + biopsias, ecografía abdominal, espirometría y test de esfuerzo\nSi peso ≥200 Kg: ecocardiograma transtorácico + EKG (reemplazan test de esfuerzo)' },
        { subtitulo:'Interconsultas preoperatorias según condición', contenido:'• Cardiología: cardiopatía coronaria o IC con FEVI reducida (≤40%)\n• Broncopulmonar: asma no controlada, VEF1/CVF <0.7 post-BD, SAHOS con polisomnografía\n• Diabetología: HbA1c fuera de metas según edad y fragilidad\n• Gastroenterología: aminotransferasas alteradas en 2+ controles, cirrosis, FIB-4 o APRI elevado\n• Med. Física y Rehabilitación: IMC ≥50 (5-10 sesiones kinesioterapia cardiorespiratoria preoperatoria HSJD)' },
        { subtitulo:'Criterios de exclusión', contenido:'NO son candidatos:\n• Embarazo actual\n• Trastorno de conducta alimentaria\n• Consumo problemático de alcohol o sustancias ilícitas\n• Patología psiquiátrica no controlada sin seguimiento por especialista (requiere pase psiquiatra)\n• Coagulopatía severa\n• Incapacidad de cumplir requisitos nutricionales\n• Enfermedad cardíaca o pulmonar severa con riesgo anestésico prohibitivo\n• Cáncer en tratamiento' },
      ]
    },
    {
      id:'ges85', icono:'🧠', color:'#78909c',
      titulo:'GES 85 – Alzheimer y otras demencias',
      descripcion:'Proceso de atención GES demencia en APS. Garantía diagnóstica 60 días, tratamiento mediana complejidad en APS.',
      secciones:[
        { subtitulo:'Criterios de sospecha en APS', contenido:'Test de Minimental Extendido ≤21 puntos Y Test de Pfeffer ≥6 puntos → Abrir caso GES en etapa de sospecha' },
        { subtitulo:'Proceso de atención garantizado', contenido:'1. Médico APS abre caso GES en SIGGES (etapa sospecha)\n2. Garantía 60 días para confirmar o descartar diagnóstico desde apertura\n3. Si se confirma: médico APS registra en hoja diaria → gatilla garantía tratamiento mediana complejidad (APS), plazo 60 días desde confirmación\n4. Si persiste duda diagnóstica: derivar a especialidad con IC (SIC), plazo garantizado 180 días (descontando días ya usados en APS)\n5. Especialista indica tratamiento mediana complejidad → derivar a APS para ejecución\n6. Tratamiento en APS: plazo 60 días desde confirmación del diagnóstico' },
        { subtitulo:'Diagnósticos con tratamiento de alta complejidad directo', contenido:'Los siguientes pueden comenzar tratamiento en especialidad sin pasar por tratamiento mediana complejidad (garantía 60 días desde confirmación):\n• Demencia por Creutzfeldt-Jakob\n• Demencia por cuerpos de Lewy\n• Demencias frontotemporales\n• Demencia por enfermedad de Huntington\n• Demencia por infección por VIH\n• Demencias rápidamente progresivas\n• Demencias degenerativas en menores de 60 años' },
        { subtitulo:'Exámenes para descartar causa reversible', contenido:'Glicemia, hemograma, VHS, TSH, T4L, creatinina, GOT, GPT, GGT, FA, bilirrubina total, VDRL, VIH, B12, Vitamina D\nMinimental extendido + Test de Pfeffer (registrar puntaje exacto en IC)' },
      ]
    },
    {
      id:'ges83', icono:'🫘', color:'#c0392b',
      titulo:'GES 83 – Cáncer Renal',
      descripcion:'Proceso de atención y registro GES 83 cáncer renal. Informe de Proceso y Registro GES v1.',
      secciones:[
        { subtitulo:'Diagnóstico y apertura GES', contenido:'Frente a lesión imagenológica sospechosa de cáncer renal (especificada en NTMA):\n1. Médico tratante abre caso GES → registra IPD (Informe Proceso Diagnóstico) de confirmación en SIGGES\n2. Etapificación: plazo garantizado 45 días desde confirmación del diagnóstico' },
        { subtitulo:'Alternativas terapéuticas', contenido:'• Cirugía\n• Tratamiento sistémico\n• Radioterapia\nLa secuencia depende de las condiciones de cada paciente y la decisión del Comité Oncológico' },
        { subtitulo:'Plazos garantizados', contenido:'• Etapificación: 45 días desde confirmación (IPD)\n• Tratamiento primario: 30 días desde indicación médica (urólogo registra OA en SIGGES)\n• Tratamiento adyuvante: 30 días desde indicación\n• Cierre de caso: una vez finalizados los tratamientos indicados\n• Seguimiento posterior: fuera de garantía GES, según indicación del equipo tratante' },
        { subtitulo:'Prestaciones de tratamiento (códigos SIGGES)', contenido:'Quirúrgico: 2505309\nRadioterapia estándar Linac Dual: 2902003, 2902007, 2902002, 2902006, 2902001, 2902005, 2902004, 2902008\nTratamiento sistémico: 2505932\nEtapificación: 2504098' },
      ]
    },
    {
      id:'retinopatia', icono:'🩺', color:'#e53935',
      titulo:'Tamizaje Retinopatía Diabética – ORD DGD 2024',
      descripcion:'Instructivo tamizaje de retinopatía diabética en personas con DM2. ORD N°2403, 16/09/2024.',
      secciones:[
        { subtitulo:'Criterios de derivación a Fondo de Ojo', contenido:'• Solo se derivan a FO pacientes con DM2 CONFIRMADA\n• Frecuencia: anual\n• Condición: que NO tenga diagnóstico confirmado de retinopatía ni cataratas no operada\n• Establecimiento: UAPO Cerro Navia\n• Código CIE-10: E11 Diabetes Mellitus No insulinodependiente / E11.7 con múltiples complicaciones' },
        { subtitulo:'Proceso en Rayen', contenido:'1. Clasificación diagnóstica\n2. Procedimiento: FONDO DE OJO (Presencial)\n3. Prioridad: Normal\n4. Extrasistema: NO\n5. Establecimiento: UAPO Cerro Navia\n6. Fundamentos clínicos + número de teléfono + marcar GES\n7. ¿Se resolverá por programa de resolutividad? NO\n8. Derivar a contralor: SÍ' },
        { subtitulo:'Criterios de exclusión para fondo de ojo', contenido:'No derivar a FO si el paciente:\n• Ya tiene diagnóstico confirmado de retinopatía diabética\n• Tiene cataratas no operada (primero resolver catarata)' },
      ]
    },
    {
      id:'padi', icono:'🏃', color:'#3a86c8',
      titulo:'Guía CV PADI – Programa Domicilio (FORMATO_CV)',
      descripcion:'Diagnósticos, formularios y actividades para control cardiovascular integral, PDS y PADI en APS.',
      secciones:[
        { subtitulo:'Diagnósticos principales', contenido:'• Z63.6 Familiar dependiente necesitado de cuidado en casa (APS - PDS y CPU)\n• I10 Hipertensión esencial (GES)\n• E11 Diabetes mellitus no insulinodependiente (GES)\n• E78.2 Hiperlipidemia mixta\n• E66 Obesidad\n• N18.1–N18.5 ERC Etapa 1-5 (GES)\n• E03 Hipotiroidismo (GES)\n• F17.3 Trastorno uso tabaco, abstinencia (GES)' },
        { subtitulo:'Diagnósticos operativos frecuentes', contenido:'• Z76.0 Consulta repetición de receta\n• Z99-1 Órtesis (GES)\n• Z00 Examen médico general (solo revisión de exámenes sin síntomas actuales)\n• R10.1 Dolor abdominal superior → orden ecografía abdominal\n• K29.7 Gastritis no especificada → orden endoscopia + test de Ureasa\n• H52.7 Trastorno refracción → orden anteojos (GES/NOGES)\n• J15 Neumonía bacteriana → Rx tórax 1 proyección (Convenio UC)\n• J45 Asma → Rx tórax 2 proyecciones (Convenio UC)' },
        { subtitulo:'Formularios requeridos (aplicación en ficha)', contenido:'• Salud Cardiovascular Integral (CI)\n• Índice de Barthel (CI, Ingreso, PDS) → Dependencia severa: puntaje <35\n• Minimental Abreviado (CI, Ingreso) → Derivación a demencia, cognitivo\n• Test de Pfeiffer (CI, Ingreso) → Evaluación cognitiva adulto mayor\n• AUDIT (CI) → Dependencia alcohol → Derivar programa AA si AUDIT ≥16\n• ASISST → Dependencia sustancias (lo realiza la Terapeuta)\n• RFAM – Riesgo Familiar Red Occidente (CI) → APLICAR CADA 3 AÑOS\n• NECPAL 4 (CPU) → Registrar cada pregunta P1…P12 como positiva o negativa en ficha\n• PADPDS-CPU Elaboración plan consensuado (CI, PDS)' },
        { subtitulo:'Derivaciones a hospital', contenido:'• Dejar estipulado en historia clínica alteraciones que puedan comprometer salud del paciente + pertinentes negativos\n• Llamar al hospital comentando el caso protocolariamente si es menester\n• Si paciente aceptado: registrar nombre médico que aceptó del HFBC, lugar de aceptación (normalmente triage)\n• Al mandar datos para ambulancia: definir estado del lugar, mandar copia IC a jefe de programa\n• Desistimiento de derivación: paciente o familiar lee y firma documento + queda registrado en ficha' },
      ]
    },
  ];

  var guiaGrid    = document.getElementById('guiaGrid');
  var guiaPanel   = document.getElementById('guiaPanel');
  var guiaPanelCat   = document.getElementById('guiaPanelCat');
  var guiaPanelTitle = document.getElementById('guiaPanelTitle');
  var guiaPanelBody  = document.getElementById('guiaPanelBody');
  var guiaClose   = document.getElementById('guiaClose');
  var guiaTabs    = document.getElementById('guiaTabs');

  if (guiaTabs) guiaTabs.style.display = 'none';
  var escalasGrid = document.getElementById('escalasGrid');
  if (escalasGrid) escalasGrid.style.display = 'none';

  // Use Firestore data if available, else local
  var guias = (window.GUIAS && window.GUIAS.length) ? window.GUIAS : GUIAS;
  renderGuias();

  function renderGuias() {
    if (!guiaGrid) return;
    guiaGrid.innerHTML = '';
    guias.forEach(function(g, idx){
      var card = document.createElement('div');
      card.className = 'specialty-card';
      card.style.animation = 'fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) ' + (idx*0.04) + 's both';
      card.innerHTML =
        '<div class="sc-content">' +
          '<div class="sc-title">' + esc(g.titulo) + '</div>' +
          '<div class="sc-count" style="color:' + (g.color||'var(--blue-500)') + '">' + (g.secciones||[]).length + ' sección' + ((g.secciones||[]).length!==1?'es':'') + '</div>' +
          '<div class="sc-desc">' + esc(g.descripcion||'') + '</div>' +
        '</div>' +
        '<div class="sc-icon">' + (g.icono||'📋') + '</div>' +
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
