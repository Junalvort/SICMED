// ─── SICMED – Especialidades ──────────────────────────────────────────────────

var PRIOR_COLOR = { P0:"#EF5350", P1:"#FFA726", P2:"#42A5F5", GES:"#66BB6A" };
var PRIOR_LABEL = { P0:"P0 – Urgencia", P1:"P1 – menos 30 días", P2:"P2 – menos 6 meses", GES:"GES" };

function escaparHTML(s) {
  return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

var hamburger   = document.getElementById("hamburger");
var navList     = document.getElementById("navList");
var grid        = document.getElementById("cardsGrid");
var panel       = document.getElementById("diagPanel");
var diagTitle   = document.getElementById("diagTitle");
var diagIcon    = document.getElementById("diagIcon");
var diagList    = document.getElementById("diagList");
var diagClose   = document.getElementById("diagClose");
var priorFilter = document.getElementById("priorFilter");

if (hamburger && navList) {
  hamburger.addEventListener("click", function() {
    navList.classList.toggle("open");
  });
}

// ── Construir tarjetas desde window.ESPECIALIDADES ───────────────────────────
function buildCards() {
  grid.innerHTML = "";

  // Agrupar diagnósticos por especialidad
  var groups = {};
  for (var i = 0; i < window.DB.length; i++) {
    var d = window.DB[i];
    if (!groups[d.especialidad]) groups[d.especialidad] = [];
    groups[d.especialidad].push(d);
  }

  // Usar el orden y metadata de window.ESPECIALIDADES
  var esps = window.ESPECIALIDADES;

  // Agregar especialidades que tengan diagnósticos pero no estén en ESPECIALIDADES
  var nombresConocidos = esps.map(function(e){ return e.nombre; });
  Object.keys(groups).forEach(function(nombre) {
    if (nombresConocidos.indexOf(nombre) === -1) {
      esps = esps.concat([{ nombre: nombre, icon: "🏥", desc: "" }]);
    }
  });

  esps.forEach(function(esp) {
    var diags = groups[esp.nombre] || [];
    var card  = document.createElement("div");
    card.className = "specialty-card";
    card.innerHTML =
      '<div class="sc-icon">' + (esp.icon || "🏥") + "</div>" +
      '<div class="sc-title">' + escaparHTML(esp.nombre) + "</div>" +
      '<div class="sc-count">' + diags.length + " diagnóstico" + (diags.length !== 1 ? "s" : "") + "</div>" +
      '<p style="font-size:.82rem;color:rgba(255,255,255,.45);margin-top:6px;line-height:1.4">' + escaparHTML(esp.desc || "") + "</p>" +
      '<span class="sc-arrow">→</span>';

    card.addEventListener("click", function() { openPanel(esp, groups[esp.nombre] || []); });
    grid.appendChild(card);
  });
}

buildCards();

// ─── Panel lateral ────────────────────────────────────────────────────────────
var currentDatos = [];

function openPanel(esp, datos) {
  currentDatos = datos;
  diagIcon.textContent  = esp.icon || "🏥";
  diagTitle.textContent = esp.nombre;

  priorFilter.innerHTML = "";
  var prios = [];
  for (var x = 0; x < datos.length; x++) {
    if (prios.indexOf(datos[x].prioridad) === -1) prios.push(datos[x].prioridad);
  }
  prios.sort();

  priorFilter.appendChild(makePill("Todos", null, true));
  for (var p = 0; p < prios.length; p++) {
    priorFilter.appendChild(makePill(PRIOR_LABEL[prios[p]] || prios[p], prios[p], false));
  }

  renderDiagList(datos, null);
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
    priorFilter.querySelectorAll("button").forEach(function(b) {
      b.style.background  = "rgba(255,255,255,.08)";
      b.style.color       = "rgba(255,255,255,.6)";
      b.style.borderColor = "rgba(255,255,255,.12)";
    });
    btn.style.background  = "rgba(79,195,247,.25)";
    btn.style.color       = "#4FC3F7";
    btn.style.borderColor = "rgba(79,195,247,.4)";
    renderDiagList(currentDatos, val);
  });
  return btn;
}

function renderDiagList(data, filterP) {
  diagList.innerHTML = "";
  var list = data.filter(function(d) { return !filterP || d.prioridad === filterP; });

  if (!list.length) {
    diagList.innerHTML = '<div style="text-align:center;padding:30px;color:rgba(255,255,255,.4);">Sin diagnósticos en esta prioridad</div>';
    return;
  }

  list.forEach(function(d) {
    var row = document.createElement("div");
    row.className = "diag-row";
    var criterHTML = d.criterios ? '<div class="dr-notas"><strong style="color:#80CBC4">Criterios:</strong> ' + escaparHTML(d.criterios) + "</div>" : "";
    var examHTML   = d.examenes  ? '<div class="dr-notas"><strong style="color:#FFCC80">EMBD:</strong> '     + escaparHTML(d.examenes)  + "</div>" : "";
    var notasHTML  = d.notas     ? '<div class="dr-notas">💡 ' + escaparHTML(d.notas) + "</div>" : "";
    row.innerHTML =
      '<span class="dr-cie">' + escaparHTML(d.cie10) + "</span>" +
      '<div class="dr-info">' +
        '<div class="dr-nombre">' + escaparHTML(d.nombre) + "</div>" +
        '<div class="dr-notas" style="margin-top:4px"><strong style="color:#90CAF9">Destino:</strong> ' + escaparHTML(d.destino) + "</div>" +
        criterHTML + examHTML + notasHTML +
      "</div>" +
      '<span class="badge-urgencia ' + d.prioridad + '" style="flex-shrink:0;align-self:flex-start;">' + escaparHTML(d.prioridad) + "</span>";
    diagList.appendChild(row);
  });
}

function closePanel() {
  panel.classList.remove("open");
  document.body.style.overflow = "";
}

diagClose.addEventListener("click", closePanel);
panel.addEventListener("click", function(e) { if (e.target === panel) closePanel(); });
document.addEventListener("keydown", function(e) { if (e.key === "Escape") closePanel(); });
