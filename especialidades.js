// ─── DERIVMED – Especialidades ───────────────────────────────────────────────

var SPECIALTIES_META = {
  "Endocrinología":    { icon: "🔬", desc: "Tiroides, suprarrenales, metabolismo" },
  "Gastroenterología": { icon: "🫁", desc: "Aparato digestivo, hígado, páncreas" },
  "Hematología":       { icon: "🩸", desc: "Enfermedades de la sangre y coagulación" },
  "Nefrología":        { icon: "🫘", desc: "Riñón, ERC, síndrome nefrótico" },
  "Neurología":        { icon: "🧠", desc: "Sistema nervioso, cefaleas, movimientos" },
  "Oftalmología":      { icon: "👁", desc: "Enfermedades oculares y visuales" },
  "Cirugía Bariátrica":{ icon: "⚖", desc: "Programa obesidad HSJD" },
  "Medicina Interna":  { icon: "🏥", desc: "Patología general ambulatoria" }
};

var PRIOR_COLOR = { P0:"#EF5350", P1:"#FFA726", P2:"#42A5F5", GES:"#66BB6A" };
var PRIOR_LABEL = { P0:"P0 – Urgencia", P1:"P1 – menos 30 días", P2:"P2 – menos 6 meses", GES:"GES" };

function escaparHTML(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

// DOM refs - todos declarados ANTES de usarlos
var hamburger   = document.getElementById("hamburger");
var navList     = document.getElementById("navList");
var grid        = document.getElementById("cardsGrid");
var panel       = document.getElementById("diagPanel");
var diagTitle   = document.getElementById("diagTitle");
var diagIcon    = document.getElementById("diagIcon");
var diagList    = document.getElementById("diagList");
var diagClose   = document.getElementById("diagClose");
var priorFilter = document.getElementById("priorFilter");

// Hamburger menu
if (hamburger && navList) {
  hamburger.addEventListener("click", function() {
    navList.classList.toggle("open");
  });
}

// Agrupar diagnósticos por especialidad
var groups = {};
for (var i = 0; i < DB.length; i++) {
  var d = DB[i];
  if (!groups[d.especialidad]) groups[d.especialidad] = [];
  groups[d.especialidad].push(d);
}

// Orden de presentación
var ORDER = [
  "Endocrinología","Gastroenterología","Hematología","Nefrología",
  "Neurología","Oftalmología","Cirugía Bariátrica","Medicina Interna"
];

var espKeys = [];
for (var o = 0; o < ORDER.length; o++) {
  if (groups[ORDER[o]]) espKeys.push(ORDER[o]);
}
// agregar si hay especialidades extra no contempladas
var allKeys = Object.keys(groups);
for (var k = 0; k < allKeys.length; k++) {
  if (espKeys.indexOf(allKeys[k]) === -1) espKeys.push(allKeys[k]);
}

// Crear tarjetas
for (var e = 0; e < espKeys.length; e++) {
  (function(esp) {
    var meta  = SPECIALTIES_META[esp] || { icon:"🏥", desc:"" };
    var count = groups[esp].length;
    var card  = document.createElement("div");
    card.className = "specialty-card";
    card.innerHTML =
      '<div class="sc-icon">' + meta.icon + "</div>" +
      '<div class="sc-title">' + escaparHTML(esp) + "</div>" +
      '<div class="sc-count">' + count + " diagnóstico" + (count !== 1 ? "s" : "") + "</div>" +
      '<p style="font-size:.82rem;color:rgba(255,255,255,.45);margin-top:6px;line-height:1.4">' + escaparHTML(meta.desc) + "</p>" +
      '<span class="sc-arrow">→</span>';

    card.addEventListener("click", function() { openPanel(esp, meta); });
    grid.appendChild(card);
  })(espKeys[e]);
}

// ─── Panel lateral ────────────────────────────────────────────────────────────
var currentEsp = null;

function openPanel(esp, meta) {
  currentEsp = esp;
  diagIcon.textContent  = meta.icon;
  diagTitle.textContent = esp;

  // Pills de prioridad
  priorFilter.innerHTML = "";
  var prios = [];
  var datos = groups[esp];
  for (var x = 0; x < datos.length; x++) {
    if (prios.indexOf(datos[x].prioridad) === -1) prios.push(datos[x].prioridad);
  }
  prios.sort();

  priorFilter.appendChild(makePill("Todos", null, true));
  for (var p = 0; p < prios.length; p++) {
    priorFilter.appendChild(makePill(PRIOR_LABEL[prios[p]] || prios[p], prios[p], false));
  }

  renderDiagList(groups[esp], null);

  panel.classList.add("open");
  document.body.style.overflow = "hidden";
}

function makePill(label, val, active) {
  var btn = document.createElement("button");
  btn.textContent = label;
  btn.style.cssText =
    "padding:5px 14px;border-radius:20px;cursor:pointer;" +
    "font-family:'Nunito',sans-serif;font-size:.8rem;font-weight:600;" +
    "background:" + (active ? "rgba(79,195,247,.25)" : "rgba(255,255,255,.08)") + ";" +
    "color:"      + (active ? "#4FC3F7" : "rgba(255,255,255,.6)") + ";" +
    "border:1px solid " + (active ? "rgba(79,195,247,.4)" : "rgba(255,255,255,.12)") + ";" +
    "transition:.2s;margin-bottom:4px;";

  btn.addEventListener("click", function() {
    var btns = priorFilter.querySelectorAll("button");
    for (var b = 0; b < btns.length; b++) {
      btns[b].style.background  = "rgba(255,255,255,.08)";
      btns[b].style.color       = "rgba(255,255,255,.6)";
      btns[b].style.borderColor = "rgba(255,255,255,.12)";
    }
    btn.style.background  = "rgba(79,195,247,.25)";
    btn.style.color       = "#4FC3F7";
    btn.style.borderColor = "rgba(79,195,247,.4)";
    renderDiagList(groups[currentEsp], val);
  });

  return btn;
}

function renderDiagList(data, filterP) {
  diagList.innerHTML = "";

  var list = [];
  for (var i = 0; i < data.length; i++) {
    if (!filterP || data[i].prioridad === filterP) list.push(data[i]);
  }

  if (list.length === 0) {
    diagList.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,.4);">Sin diagnósticos en esta prioridad</div>';
    return;
  }

  for (var j = 0; j < list.length; j++) {
    var d   = list[j];
    var row = document.createElement("div");
    row.className = "diag-row";

    var criterHTML = d.criterios
      ? '<div class="dr-notas"><strong style="color:#80CBC4">Criterios:</strong> ' + escaparHTML(d.criterios) + "</div>"
      : "";
    var examHTML = d.examenes
      ? '<div class="dr-notas"><strong style="color:#FFCC80">EMBD:</strong> ' + escaparHTML(d.examenes) + "</div>"
      : "";
    var notasHTML = d.notas
      ? '<div class="dr-notas">💡 ' + escaparHTML(d.notas) + "</div>"
      : "";

    row.innerHTML =
      '<span class="dr-cie">' + escaparHTML(d.cie10) + "</span>" +
      '<div class="dr-info">' +
        '<div class="dr-nombre">' + escaparHTML(d.nombre) + "</div>" +
        '<div class="dr-notas" style="margin-top:4px"><strong style="color:#90CAF9">Destino:</strong> ' + escaparHTML(d.destino) + "</div>" +
        criterHTML + examHTML + notasHTML +
      "</div>" +
      '<span class="badge-urgencia ' + d.prioridad + '" style="flex-shrink:0;align-self:flex-start;">' +
        escaparHTML(d.prioridad) +
      "</span>";

    diagList.appendChild(row);
  }
}

function closePanel() {
  panel.classList.remove("open");
  document.body.style.overflow = "";
}

diagClose.addEventListener("click", closePanel);

panel.addEventListener("click", function(e) {
  if (e.target === panel) closePanel();
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closePanel();
});
