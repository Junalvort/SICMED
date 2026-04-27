// ─── SICMED – Especialidades (Light Theme) ────────────────────────────────────

var PRIOR_LABEL = { P0:"P0 – Urgencia", P1:"P1 – menos 30 días", P2:"P2 – menos 6 meses", GES:"GES" };

function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

var grid      = document.getElementById('cardsGrid');
var panel     = document.getElementById('diagPanel');
var diagTitle = document.getElementById('diagTitle');
var diagIcon  = document.getElementById('diagIcon');
var diagSub   = document.getElementById('diagSub');
var diagList  = document.getElementById('diagList');
var diagClose = document.getElementById('diagClose');
var priorFilter = document.getElementById('priorFilter');

// ── Build grid ──────────────────────────────────────────────────────────────
function buildCards() {
  grid.innerHTML = '';
  var groups = {};
  window.DB.forEach(function(d) {
    if (!groups[d.especialidad]) groups[d.especialidad] = [];
    groups[d.especialidad].push(d);
  });

  var esps = window.ESPECIALIDADES ? window.ESPECIALIDADES.slice() : [];
  var known = esps.map(function(e){ return e.nombre; });
  Object.keys(groups).forEach(function(n) {
    if (known.indexOf(n) === -1) esps.push({ nombre: n, icon: '🏥', desc: '' });
  });

  esps.forEach(function(esp, idx) {
    var diags = groups[esp.nombre] || [];
    var card = document.createElement('div');
    card.className = 'specialty-card';
    card.style.animationDelay = (idx * 0.04) + 's';
    card.style.animation = 'fadeUp 0.4s cubic-bezier(0.4,0,0.2,1) both';
    card.innerHTML =
      '<div class="sc-content">' +
        '<div class="sc-title">' + esc(esp.nombre) + '</div>' +
        '<div class="sc-count">' + diags.length + ' diagnóstico' + (diags.length !== 1 ? 's' : '') + '</div>' +
        (esp.desc ? '<div class="sc-desc">' + esc(esp.desc) + '</div>' : '') +
      '</div>' +
      '<div class="sc-icon">' + (esp.icon || '🏥') + '</div>' +
      '<span class="sc-arrow">→</span>';
    card.addEventListener('click', function() { openPanel(esp, groups[esp.nombre] || []); });
    grid.appendChild(card);
  });
}

buildCards();

// ── Panel ───────────────────────────────────────────────────────────────────
var currentDatos = [];

function openPanel(esp, datos) {
  currentDatos = datos;
  diagIcon.textContent  = esp.icon || '🏥';
  diagTitle.textContent = esp.nombre;
  diagSub.textContent   = datos.length + ' diagnóstico' + (datos.length !== 1 ? 's' : '');

  // Priority filter pills
  priorFilter.innerHTML = '';
  var prios = [];
  datos.forEach(function(d) { if (prios.indexOf(d.prioridad) === -1) prios.push(d.prioridad); });
  prios.sort();

  priorFilter.appendChild(makePill('Todos', null, true));
  prios.forEach(function(p) {
    priorFilter.appendChild(makePill(PRIOR_LABEL[p] || p, p, false));
  });

  renderList(datos, null);
  panel.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function makePill(label, val, active) {
  var btn = document.createElement('button');
  btn.className = 'prior-pill' + (active ? ' active' : '');
  btn.textContent = label;
  btn.addEventListener('click', function() {
    priorFilter.querySelectorAll('.prior-pill').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderList(currentDatos, val);
  });
  return btn;
}

function renderList(data, filterP) {
  diagList.innerHTML = '';
  var list = filterP ? data.filter(function(d){ return d.prioridad === filterP; }) : data;
  if (!list.length) {
    diagList.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text-muted);font-size:.875rem">Sin diagnósticos en esta prioridad</div>';
    return;
  }
  list.forEach(function(d) {
    var row = document.createElement('div');
    row.className = 'diag-row';
    var criterMeta = d.criterios ? '<div class="dr-meta"><strong style="color:var(--blue-700)">Criterios:</strong> ' + esc(d.criterios) + '</div>' : '';
    var examMeta   = d.examenes  ? '<div class="dr-meta"><strong style="color:var(--blue-500)">EMBD:</strong> ' + esc(d.examenes) + '</div>' : '';
    var notasMeta  = d.notas     ? '<div class="dr-meta" style="color:var(--blue-500)">💡 ' + esc(d.notas) + '</div>' : '';
    row.innerHTML =
      '<span class="dr-cie">' + esc(d.cie10) + '</span>' +
      '<div class="dr-info">' +
        '<div class="dr-nombre">' + esc(d.nombre) + '</div>' +
        (d.destino ? '<div class="dr-meta"><strong>Destino:</strong> ' + esc(d.destino) + '</div>' : '') +
        criterMeta + examMeta + notasMeta +
      '</div>' +
      '<span class="badge-urgencia ' + d.prioridad + '">' + esc(d.prioridad) + '</span>';
    diagList.appendChild(row);
  });
}

function closePanel() {
  panel.classList.remove('open');
  document.body.style.overflow = '';
}
diagClose.addEventListener('click', closePanel);
panel.addEventListener('click', function(e) { if (e.target === panel) closePanel(); });
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closePanel(); });
