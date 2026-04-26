// ─── SICMED – Calculadora y Escalas ──────────────────────────────────────────
(function(){

var ESCALAS = [
  {
    id:'barthel', icono:'🏃', color:'#3a86c8',
    nombre:'Índice de Barthel',
    descripcion:'Independencia funcional en actividades básicas de la vida diaria. Rango 0–100.',
    preguntas:[
      { id:'comer',   txt:'Comer',                opts:[{v:0,l:'Incapaz / necesita ayuda total'},{v:5,l:'Necesita alguna ayuda'},{v:10,l:'Independiente'}] },
      { id:'baño',    txt:'Baño / ducha',          opts:[{v:0,l:'Dependiente'},{v:5,l:'Independiente'}] },
      { id:'aseo',    txt:'Aseo personal',         opts:[{v:0,l:'Necesita ayuda'},{v:5,l:'Independiente (cara, pelo, dientes)'}] },
      { id:'vestirse',txt:'Vestirse',              opts:[{v:0,l:'Dependiente'},{v:5,l:'Necesita ayuda'},{v:10,l:'Independiente'}] },
      { id:'deposi',  txt:'Deposición',            opts:[{v:0,l:'Incontinente'},{v:5,l:'Accidente ocasional'},{v:10,l:'Continente'}] },
      { id:'miccion', txt:'Micción',               opts:[{v:0,l:'Incontinente o sondado'},{v:5,l:'Accidente ocasional'},{v:10,l:'Continente'}] },
      { id:'wc',      txt:'Uso del WC',            opts:[{v:0,l:'Dependiente'},{v:5,l:'Necesita alguna ayuda'},{v:10,l:'Independiente'}] },
      { id:'traslado',txt:'Traslado silla-cama',   opts:[{v:0,l:'Incapaz / sin equilibrio'},{v:5,l:'Necesita ayuda importante'},{v:10,l:'Necesita alguna ayuda'},{v:15,l:'Independiente'}] },
      { id:'deamb',   txt:'Deambulación',          opts:[{v:0,l:'Inmóvil'},{v:5,l:'En silla de ruedas independiente'},{v:10,l:'Camina con ayuda'},{v:15,l:'Independiente ≥50 m'}] },
      { id:'escaleras',txt:'Subir escaleras',      opts:[{v:0,l:'Incapaz'},{v:5,l:'Necesita ayuda'},{v:10,l:'Independiente'}] },
    ],
    interpret: function(p){
      if(p<=20)  return { label:'Dependencia total',    color:'#e53935', bg:'rgba(229,57,53,.10)' };
      if(p<=35)  return { label:'Dependencia severa',   color:'#e53935', bg:'rgba(229,57,53,.10)' };
      if(p<=55)  return { label:'Dependencia moderada', color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      if(p<=90)  return { label:'Dependencia leve',     color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      if(p<=99)  return { label:'Dependencia escasa',   color:'#43a047', bg:'rgba(67,160,71,.10)' };
      return              { label:'Independencia total', color:'#43a047', bg:'rgba(67,160,71,.10)' };
    },
    nota:'Puntaje < 35 = dependencia severa → ingreso PADDS.'
  },
  {
    id:'pfeiffer', icono:'🧠', color:'#7b5ea7',
    nombre:'Test de Pfeiffer (SPMSQ)',
    descripcion:'Evaluación cognitiva breve. 10 preguntas; cuenta el número de errores.',
    preguntas:[
      { id:'p1', txt:'¿Qué fecha es hoy (día, mes, año)?',                opts:[{v:0,l:'Respuesta correcta'},{v:1,l:'Respuesta incorrecta'}] },
      { id:'p2', txt:'¿Qué día de la semana es hoy?',                     opts:[{v:0,l:'Correcto'},{v:1,l:'Incorrecto'}] },
      { id:'p3', txt:'¿Cómo se llama este lugar / dónde estamos?',        opts:[{v:0,l:'Correcto'},{v:1,l:'Incorrecto'}] },
      { id:'p4', txt:'¿Cuál es su número de teléfono o dirección?',       opts:[{v:0,l:'Correcto'},{v:1,l:'Incorrecto'}] },
      { id:'p5', txt:'¿Cuántos años tiene usted?',                        opts:[{v:0,l:'Correcto'},{v:1,l:'Incorrecto'}] },
      { id:'p6', txt:'¿Cuándo nació usted (día, mes, año)?',              opts:[{v:0,l:'Correcto'},{v:1,l:'Incorrecto'}] },
      { id:'p7', txt:'¿Cómo se llama el Presidente de la República?',     opts:[{v:0,l:'Correcto'},{v:1,l:'Incorrecto'}] },
      { id:'p8', txt:'¿Cómo se llamaba el Presidente anterior?',          opts:[{v:0,l:'Correcto'},{v:1,l:'Incorrecto'}] },
      { id:'p9', txt:'¿Cuál es el apellido de su madre?',                 opts:[{v:0,l:'Correcto'},{v:1,l:'Incorrecto'}] },
      { id:'p10',txt:'Reste de 3 en 3 comenzando desde 20 (20,17,14…)',   opts:[{v:0,l:'Sin errores o solo uno'},{v:1,l:'Dos o más errores'}] },
    ],
    interpret: function(p){
      if(p<=2) return { label:'Funcionamiento cognitivo normal', color:'#43a047', bg:'rgba(67,160,71,.10)' };
      if(p<=4) return { label:'Deterioro cognitivo leve',        color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      if(p<=7) return { label:'Deterioro cognitivo moderado',    color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      return           { label:'Deterioro cognitivo severo',     color:'#e53935', bg:'rgba(229,57,53,.10)' };
    },
    nota:'≥3 errores: derivar a evaluación de demencia. Suma el total de errores.',
    scoreLabel:'errores'
  },
  {
    id:'mmse', icono:'🧩', color:'#1e8a6e',
    nombre:'Minimental Abreviado (MMSE)',
    descripcion:'Evaluación cognitiva global. Orientación, memoria, atención, lenguaje y praxis. Máx. 30 pts.',
    preguntas:[
      { id:'orient_t', txt:'Orientación temporal (año, estación, mes, día, fecha)', opts:[{v:0,l:'0/5 ítems correctos'},{v:1,l:'1/5'},{v:2,l:'2/5'},{v:3,l:'3/5'},{v:4,l:'4/5'},{v:5,l:'5/5 correctos'}] },
      { id:'orient_s', txt:'Orientación espacial (país, región, ciudad, lugar, piso)', opts:[{v:0,l:'0/5'},{v:1,l:'1/5'},{v:2,l:'2/5'},{v:3,l:'3/5'},{v:4,l:'4/5'},{v:5,l:'5/5 correctos'}] },
      { id:'registro', txt:'Registro (repetir 3 palabras: "pelota, árbol, casa")', opts:[{v:0,l:'0 palabras'},{v:1,l:'1 palabra'},{v:2,l:'2 palabras'},{v:3,l:'3 palabras'}] },
      { id:'atencion', txt:'Atención/cálculo (restar 7 desde 100, 5 veces)', opts:[{v:0,l:'0 restas correctas'},{v:1,l:'1 correcta'},{v:2,l:'2 correctas'},{v:3,l:'3 correctas'},{v:4,l:'4 correctas'},{v:5,l:'5 correctas'}] },
      { id:'memoria',  txt:'Recuerdo diferido (las 3 palabras anteriores)', opts:[{v:0,l:'0 palabras'},{v:1,l:'1 palabra'},{v:2,l:'2 palabras'},{v:3,l:'3 palabras'}] },
      { id:'lenguaje', txt:'Lenguaje (nombrar lápiz y reloj)', opts:[{v:0,l:'0 objetos'},{v:1,l:'1 objeto'},{v:2,l:'2 objetos'}] },
      { id:'repeticion',txt:'Repetición ("ni sí, ni no, ni pero")', opts:[{v:0,l:'Incorrecto'},{v:1,l:'Correcto'}] },
      { id:'orden3',   txt:'Orden de 3 pasos (tomar papel, doblar, dejarlo)', opts:[{v:0,l:'0 pasos'},{v:1,l:'1 paso'},{v:2,l:'2 pasos'},{v:3,l:'3 pasos'}] },
      { id:'lectura',  txt:'Lectura y ejecución ("cierre los ojos")', opts:[{v:0,l:'No ejecuta'},{v:1,l:'Ejecuta correctamente'}] },
      { id:'escritura',txt:'Escritura espontánea (frase con sujeto y verbo)', opts:[{v:0,l:'No puede o sin sentido'},{v:1,l:'Frase con sentido'}] },
      { id:'copia',    txt:'Copia de figura (dos pentágonos entrecruzados)', opts:[{v:0,l:'No puede o sin intersección'},{v:1,l:'Intersección correcta'}] },
    ],
    interpret: function(p){
      if(p>=26) return { label:'Funcionamiento cognitivo normal', color:'#43a047', bg:'rgba(67,160,71,.10)' };
      if(p>=21) return { label:'Deterioro cognitivo leve',        color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      if(p>=11) return { label:'Deterioro cognitivo moderado',    color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      return           { label:'Deterioro cognitivo severo',      color:'#e53935', bg:'rgba(229,57,53,.10)' };
    },
    nota:'Incluir resultado en hoja de derivación. Puntaje máximo: 30 puntos.'
  },
  {
    id:'audit', icono:'🍷', color:'#c0392b',
    nombre:'AUDIT',
    descripcion:'Identifica consumo de riesgo, consumo perjudicial y dependencia al alcohol. 10 ítems.',
    preguntas:[
      { id:'a1', txt:'¿Con qué frecuencia consume bebidas alcohólicas?', opts:[{v:0,l:'Nunca'},{v:1,l:'Una vez al mes o menos'},{v:2,l:'2–4 veces al mes'},{v:3,l:'2–3 veces a la semana'},{v:4,l:'4 o más veces a la semana'}] },
      { id:'a2', txt:'¿Cuántas bebidas alcohólicas consume en un día típico?', opts:[{v:0,l:'1 o 2'},{v:1,l:'3 o 4'},{v:2,l:'5 o 6'},{v:3,l:'7 a 9'},{v:4,l:'10 o más'}] },
      { id:'a3', txt:'¿Con qué frecuencia consume 6 o más bebidas en una sola ocasión?', opts:[{v:0,l:'Nunca'},{v:1,l:'Menos de una vez al mes'},{v:2,l:'Mensualmente'},{v:3,l:'Semanalmente'},{v:4,l:'A diario o casi a diario'}] },
      { id:'a4', txt:'¿Con qué frecuencia en el último año no pudo parar de beber una vez que había empezado?', opts:[{v:0,l:'Nunca'},{v:1,l:'Menos de una vez al mes'},{v:2,l:'Mensualmente'},{v:3,l:'Semanalmente'},{v:4,l:'A diario o casi a diario'}] },
      { id:'a5', txt:'¿Con qué frecuencia en el último año no pudo hacer lo que se esperaba de usted por beber?', opts:[{v:0,l:'Nunca'},{v:1,l:'Menos de una vez al mes'},{v:2,l:'Mensualmente'},{v:3,l:'Semanalmente'},{v:4,l:'A diario o casi a diario'}] },
      { id:'a6', txt:'¿Con qué frecuencia en el último año necesitó beber en ayunas para recuperarse?', opts:[{v:0,l:'Nunca'},{v:1,l:'Menos de una vez al mes'},{v:2,l:'Mensualmente'},{v:3,l:'Semanalmente'},{v:4,l:'A diario o casi a diario'}] },
      { id:'a7', txt:'¿Con qué frecuencia en el último año tuvo sentimientos de culpa por beber?', opts:[{v:0,l:'Nunca'},{v:1,l:'Menos de una vez al mes'},{v:2,l:'Mensualmente'},{v:3,l:'Semanalmente'},{v:4,l:'A diario o casi a diario'}] },
      { id:'a8', txt:'¿Con qué frecuencia en el último año no pudo recordar lo que había pasado por beber?', opts:[{v:0,l:'Nunca'},{v:1,l:'Menos de una vez al mes'},{v:2,l:'Mensualmente'},{v:3,l:'Semanalmente'},{v:4,l:'A diario o casi a diario'}] },
      { id:'a9', txt:'¿Usted o alguien resultó lesionado por su consumo de alcohol?', opts:[{v:0,l:'No'},{v:2,l:'Sí, pero no en el último año'},{v:4,l:'Sí, en el último año'}] },
      { id:'a10',txt:'¿Algún amigo, familiar o médico le ha manifestado preocupación por su consumo?', opts:[{v:0,l:'No'},{v:2,l:'Sí, pero no en el último año'},{v:4,l:'Sí, en el último año'}] },
    ],
    interpret: function(p){
      if(p<=7)  return { label:'Consumo de bajo riesgo',         color:'#43a047', bg:'rgba(67,160,71,.10)' };
      if(p<=15) return { label:'Consumo de riesgo',              color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      if(p<=19) return { label:'Consumo perjudicial',            color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      return           { label:'Dependencia probable al alcohol', color:'#e53935', bg:'rgba(229,57,53,.10)' };
    },
    nota:'≥16 puntos: derivar a programa AA o COSAM.'
  },
  {
    id:'necpal', icono:'🕊️', color:'#78909c',
    nombre:'NECPAL 4.0',
    descripcion:'Identifica personas con necesidades paliativas por enfermedad crónica avanzada.',
    preguntas:[
      { id:'n1',  txt:'P1. ¿Le sorprendería que este paciente muriera en los próximos 12 meses?', opts:[{v:0,l:'Sí me sorprendería (no hay indicación paliativa)'},{v:1,l:'No me sorprendería (indicación positiva)'}] },
      { id:'n2',  txt:'P2. El paciente o familia desea tratamiento paliativo o de confort', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n3',  txt:'P3. ¿Tiene enfermedad oncológica avanzada o metastásica?', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n4',  txt:'P4. ¿Tiene insuficiencia cardiaca avanzada (clase III–IV)?', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n5',  txt:'P5. ¿Tiene EPOC avanzado (VEF1 < 30% o disnea III–IV)?', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n6',  txt:'P6. ¿Tiene insuficiencia renal avanzada (TFGe < 15)?', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n7',  txt:'P7. ¿Tiene enfermedad hepática avanzada (Child-Pugh C)?', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n8',  txt:'P8. ¿Tiene enfermedad neurológica avanzada (demencia severa u otra)?', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n9',  txt:'P9. Pérdida de peso >10% en los últimos 6 meses', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n10', txt:'P10. Deterioro funcional marcado (Barthel < 35 o Karnofsky < 50)', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n11', txt:'P11. Síndrome confusional agudo recurrente', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'n12', txt:'P12. Síntomas persistentes pese a tratamiento óptimo', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
    ],
    interpret: function(p){
      if(p===0) return { label:'NECPAL negativo — sin indicación paliativa', color:'#43a047', bg:'rgba(67,160,71,.10)' };
      if(p===1) return { label:'NECPAL +: Evaluar si hay indicación paliativa',  color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      return           { label:'NECPAL +: Necesidades paliativas identificadas', color:'#e53935', bg:'rgba(229,57,53,.10)' };
    },
    nota:'Registrar cada P1…P12 en ficha como positiva o negativa. 1 positivo en P1 es suficiente.',
    scoreLabel:'positivos'
  },
  {
    id:'rfam', icono:'👨‍👩‍👧', color:'#43a047',
    nombre:'RFAM – Riesgo Familiar',
    descripcion:'Evalúa el riesgo familiar integral. Aplica CADA 3 AÑOS. 1 alta es suficiente para categorizar.',
    preguntas:[
      { id:'r1', txt:'Familia disfuncional (APGAR < 4)', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'r2', txt:'Familia en ciclo vital crítico (matrimonio, primer hijo, hijos escolares, jubilación, duelo)', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'r3', txt:'Padre o madre adolescente (< 20 años)', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'r4', txt:'Violencia intrafamiliar', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'r5', txt:'Miembro con discapacidad o dependencia severa', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'r6', txt:'Cesantía del jefe de hogar', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'r7', txt:'Hacinamiento (> 2.5 personas por dormitorio)', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
      { id:'r8', txt:'Familia con miembro con enfermedad terminal o crónica grave', opts:[{v:0,l:'No'},{v:1,l:'Sí'}] },
    ],
    interpret: function(p){
      if(p===0) return { label:'Sin riesgo familiar',  color:'#43a047', bg:'rgba(67,160,71,.10)' };
      if(p===1) return { label:'Riesgo leve',          color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      if(p<=3)  return { label:'Riesgo moderado',      color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      return           { label:'Riesgo alto',          color:'#e53935', bg:'rgba(229,57,53,.10)' };
    },
    nota:'Registrar en Rayen: Ficha familiar → evaluación familiar → Riesgo. Aplicar cada 3 años.',
    scoreLabel:'factores de riesgo'
  },
  {
    id:'zarit', icono:'🤝', color:'#d4820a',
    nombre:'Escala de Zarit – Sobrecarga del Cuidador',
    descripcion:'Evalúa el grado de sobrecarga subjetiva del cuidador principal de una persona dependiente. 22 ítems, rango 0–88.',
    preguntas:[
      { id:'z1',  txt:'¿Siente que su familiar le pide más ayuda de la que realmente necesita?',                opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z2',  txt:'¿Siente que debido al tiempo que dedica a su familiar no tiene suficiente tiempo para usted?', opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z3',  txt:'¿Se siente agotado cuando tiene que estar junto a su familiar y además atender otras obligaciones?', opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z4',  txt:'¿Se siente avergonzado por la conducta de su familiar?',                               opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z5',  txt:'¿Se siente irritado cuando está cerca de su familiar?',                                opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z6',  txt:'¿Cree que la situación actual afecta negativamente su relación con amigos u otros familiares?', opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z7',  txt:'¿Siente temor por el futuro que le espera a su familiar?',                             opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z8',  txt:'¿Siente que su familiar depende de usted?',                                            opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z9',  txt:'¿Se siente tenso cuando está cerca de su familiar?',                                   opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z10', txt:'¿Siente que su salud se ha resentido por cuidar a su familiar?',                       opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z11', txt:'¿Siente que no tiene la vida privada que desearía debido a su familiar?',               opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z12', txt:'¿Cree que su vida social se ha visto afectada por tener que cuidar a su familiar?',    opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z13', txt:'¿Se siente incómodo para invitar amigos a casa a causa de su familiar?',               opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z14', txt:'¿Cree que su familiar espera que usted le cuide, como si fuera la única persona con la que puede contar?', opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z15', txt:'¿Cree que no dispone de dinero suficiente para cuidar a su familiar además de sus otros gastos?', opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z16', txt:'¿Siente que será incapaz de cuidar a su familiar por mucho más tiempo?',               opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z17', txt:'¿Siente que ha perdido el control de su vida desde que la enfermedad de su familiar se manifestó?', opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z18', txt:'¿Desearía poder encargar el cuidado de su familiar a otras personas?',                 opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z19', txt:'¿Se siente inseguro acerca de lo que debe hacer con su familiar?',                     opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z20', txt:'¿Siente que debería hacer más de lo que hace por su familiar?',                        opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z21', txt:'¿Cree que podría cuidar a su familiar mejor de lo que lo hace?',                       opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
      { id:'z22', txt:'En general, ¿se siente muy sobrecargado por tener que cuidar a su familiar?',          opts:[{v:0,l:'Nunca'},{v:1,l:'Casi nunca'},{v:2,l:'A veces'},{v:3,l:'Bastantes veces'},{v:4,l:'Casi siempre'}] },
    ],
    interpret: function(p){
      if(p<=46)  return { label:'Sin sobrecarga o sobrecarga leve',   color:'#43a047', bg:'rgba(67,160,71,.10)' };
      if(p<=55)  return { label:'Sobrecarga leve – riesgo de burnout', color:'#fb8c00', bg:'rgba(251,140,0,.10)' };
      return             { label:'Sobrecarga intensa – intervención urgente', color:'#e53935', bg:'rgba(229,57,53,.10)' };
    },
    nota:'Puntaje máximo: 88. <47: sin sobrecarga. 47-55: sobrecarga leve. >55: sobrecarga intensa. Indicar apoyo psicológico y/o red de respiro si sobrecarga intensa.',
    scoreLabel:'puntos'
  },
];

// ── DOM refs ────────────────────────────────────────────────────────────────
var scalesList  = document.getElementById('scalesList');
var patientList = document.getElementById('patientList');
var modalBg     = document.getElementById('calcModalBg');
var modalIcon   = document.getElementById('modalIcon');
var modalTitle  = document.getElementById('modalTitle');
var modalSub    = document.getElementById('modalSub');
var modalQs     = document.getElementById('modalQuestions');
var resultBox   = document.getElementById('resultBox');
var resultScore = document.getElementById('resultScore');
var resultInterp= document.getElementById('resultInterp');
var resultNote  = document.getElementById('resultNote');
var btnCalc     = document.getElementById('btnCalc');
var saveWrap    = document.getElementById('saveWrap');
var patientName = document.getElementById('patientName');
var btnSave     = document.getElementById('btnSave');
var saveMsg     = document.getElementById('saveMsg');
var modalClose  = document.getElementById('modalClose');

function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

var activeEscala = null, activeAnswers = {}, activeScore = null, activeInterp = null;

// ── Build scale list ─────────────────────────────────────────────────────────
ESCALAS.forEach(function(e){
  var card = document.createElement('div');
  card.className = 'scale-card';
  card.style.borderLeftColor = e.color;
  card.innerHTML =
    '<span class="scale-icon">' + e.icono + '</span>' +
    '<div class="scale-info">' +
      '<div class="scale-name">' + esc(e.nombre) + '</div>' +
      '<div class="scale-desc">' + esc(e.descripcion) + '</div>' +
    '</div>' +
    '<span class="scale-arrow">→</span>';
  card.addEventListener('click', function(){ openModal(e, null); });
  scalesList.appendChild(card);
});

// ── Open modal ──────────────────────────────────────────────────────────────
function openModal(escala, savedData){
  activeEscala  = escala;
  activeAnswers = {};
  activeScore   = null;
  activeInterp  = null;
  modalIcon.textContent  = escala.icono;
  modalTitle.textContent = escala.nombre;
  modalSub.textContent   = escala.descripcion;
  resultBox.classList.remove('show');
  saveWrap.style.display = 'none';
  saveMsg.style.display  = 'none';
  patientName.value = savedData ? (savedData.paciente||'') : '';
  btnCalc.textContent = 'Calcular resultado';

  modalQs.innerHTML = '';
  escala.preguntas.forEach(function(q, qi){
    var blk = document.createElement('div');
    blk.className = 'q-block';
    blk.innerHTML = '<div class="q-label">' + (qi+1) + '. ' + esc(q.txt) + '</div><div class="q-opts" id="opts_' + esc(q.id) + '"></div>';
    var optsDiv = blk.querySelector('.q-opts');
    q.opts.forEach(function(o){
      var opt = document.createElement('label');
      opt.className = 'q-opt' + (savedData && savedData.respuestas && savedData.respuestas[q.id]===o.v ? ' selected' : '');
      opt.dataset.qid = q.id;
      opt.dataset.val = o.v;
      opt.innerHTML = '<input type="radio" name="q_'+esc(q.id)+'" value="'+o.v+'"/><span class="q-dot"></span>' + esc(o.l);
      opt.addEventListener('click', function(){
        optsDiv.querySelectorAll('.q-opt').forEach(function(el){ el.classList.remove('selected'); });
        opt.classList.add('selected');
        activeAnswers[q.id] = o.v;
        resultBox.classList.remove('show');
        saveWrap.style.display = 'none';
      });
      optsDiv.appendChild(opt);
      if(savedData && savedData.respuestas && savedData.respuestas[q.id]===o.v) activeAnswers[q.id] = o.v;
    });
    modalQs.appendChild(blk);
  });

  if(savedData) { _showResult(savedData.puntaje); }
  modalBg.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  modalBg.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modalBg.addEventListener('click', function(e){ if(e.target===modalBg) closeModal(); });
document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeModal(); });

// ── Calculate ────────────────────────────────────────────────────────────────
btnCalc.addEventListener('click', function(){
  if (!activeEscala) return;
  var unanswered = activeEscala.preguntas.filter(function(q){ return activeAnswers[q.id]===undefined; });
  if (unanswered.length > 0) {
    var names = unanswered.slice(0,3).map(function(q,i){ return (i+1)+'. '+q.txt.substring(0,40)+'…'; }).join('\n');
    showSaveMsg('⚠️ Responde todas las preguntas:\n'+names, '#c0392b');
    return;
  }
  var score = 0;
  activeEscala.preguntas.forEach(function(q){ score += (activeAnswers[q.id]||0); });
  _showResult(score);
});

function _showResult(score){
  activeScore  = score;
  var i = activeEscala.interpret(score);
  activeInterp = i;
  var label = activeEscala.scoreLabel || 'puntos';
  resultScore.textContent  = score + ' ' + label;
  resultScore.style.color  = i.color;
  resultInterp.textContent = i.label;
  resultInterp.style.color = i.color;
  resultNote.textContent   = activeEscala.nota || '';
  resultBox.style.background = i.bg;
  resultBox.style.border = '1.5px solid ' + i.color + '44';
  resultBox.style.borderRadius = '12px';
  resultBox.style.padding = '14px 18px';
  resultBox.classList.add('show');
  saveWrap.style.display = 'flex';
}

// ── Save ─────────────────────────────────────────────────────────────────────
btnSave.addEventListener('click', function(){
  var nombre = patientName.value.trim();
  if (!nombre) { patientName.focus(); showSaveMsg('⚠️ Ingresa el nombre del paciente.','#c0392b'); return; }
  if (activeScore===null) { showSaveMsg('⚠️ Calcula el resultado antes de guardar.','#c0392b'); return; }
  var record = {
    paciente:       nombre,
    escala:         activeEscala.nombre,
    escala_id:      activeEscala.id,
    puntaje:        activeScore,
    interpretacion: activeInterp ? activeInterp.label : '',
    respuestas:     Object.assign({}, activeAnswers),
    fecha:          new Date().toISOString()
  };
  // Save to Firestore if available
  if (window.ESCALAS_save) {
    window.ESCALAS_save(record).then(function(id){
      if(id) record._id = id;
      _addToLocal(record);
      showSaveMsg('✅ Guardado correctamente.','#43a047');
      renderPatients();
      setTimeout(closeModal, 1200);
    });
  } else {
    _addToLocal(record);
    showSaveMsg('✅ Guardado localmente.','#43a047');
    renderPatients();
    setTimeout(closeModal, 1200);
  }
});

var _localRecords = [];
function _addToLocal(r){ _localRecords.unshift(r); if(_localRecords.length>30) _localRecords.pop(); }

function showSaveMsg(txt, color){
  saveMsg.textContent = txt;
  saveMsg.style.display = 'block';
  saveMsg.style.background = color==='#43a047' ? 'rgba(67,160,71,.10)' : 'rgba(229,57,53,.10)';
  saveMsg.style.color = color;
  saveMsg.style.border = '1px solid ' + color + '44';
  saveMsg.style.borderRadius = '8px';
  saveMsg.style.padding = '8px 12px';
  setTimeout(function(){ saveMsg.style.display='none'; }, 3500);
}

// ── Render patients ──────────────────────────────────────────────────────────
function renderPatients(fromFirestore){
  var records = (fromFirestore && fromFirestore.length) ? fromFirestore : _localRecords;
  if (!records.length){
    patientList.innerHTML = '<div class="no-patients">Las escalas aplicadas aparecerán aquí.<br/>Los registros se eliminan a los 5 días.</div>';
    return;
  }
  patientList.innerHTML = '';
  records.slice(0,15).forEach(function(r){
    var card = document.createElement('div');
    card.className = 'patient-card';
    var d = r.fecha ? new Date(r.fecha) : new Date();
    var fecha = d.toLocaleDateString('es-CL', {day:'2-digit',month:'2-digit',year:'2-digit'});
    var hora  = d.toLocaleTimeString('es-CL', {hour:'2-digit',minute:'2-digit'});
    var escalaObj = ESCALAS.find(function(e){ return e.id===r.escala_id || e.nombre===r.escala; });
    var interp = escalaObj ? escalaObj.interpret(r.puntaje) : null;
    card.innerHTML =
      '<div class="pc-name">👤 ' + esc(r.paciente) + '</div>' +
      '<div class="pc-escala">' + esc(r.escala) + '</div>' +
      '<div class="pc-meta">' +
        '<span>' + fecha + ' ' + hora + '</span>' +
        '<span class="pc-score" style="color:' + (interp?interp.color:'var(--blue-700)') + '">' + r.puntaje + ' ' + (escalaObj&&escalaObj.scoreLabel ? escalaObj.scoreLabel : 'pts') + '</span>' +
      '</div>';
    card.addEventListener('click', function(){
      if (escalaObj) openModal(escalaObj, r);
    });
    patientList.appendChild(card);
  });
}

// Load recent from Firestore on start
if (window.ESCALAS_getRecent) {
  window.ESCALAS_getRecent().then(function(data){
    if (data && data.length) {
      data.forEach(function(r){ _addToLocal(r); });
      renderPatients();
    }
  });
}

})();
