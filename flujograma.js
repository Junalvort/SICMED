// ═══════════════════════════════════════════════════════════════════════════
// SICMED – Algoritmo Clínico (Motor + Editor)
// Archivo independiente; no modifica estructuras existentes.
//
// MOTOR:   window.FLUJO_run(algoritmoData, containerEl)
//            → Ejecuta el algoritmo y muestra el resultado final con sus
//              campos clínicos configurados en el nodo (criterios, exámenes,
//              manejo, indicaciones, notas, etc.).
// EDITOR:  window.FLUJO_editor(containerEl, initialData)
//            → Editor visual de nodos. Retorna { getData() }.
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  function esc(s) {
    if (window.escapeHTML) return window.escapeHTML(s);
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ─── Estilos ─────────────────────────────────────────────────────────── */
  (function injectStyles() {
    if (document.getElementById('flujo-styles')) return;
    var s = document.createElement('style');
    s.id = 'flujo-styles';
    s.textContent = `
.flujo-wrap { width:100%; font-family:'DM Sans',system-ui,sans-serif; }
.result-flujo-inline .flujo-nodo { background:rgba(255,255,255,.70); border-color:rgba(58,134,200,.18); }
[data-theme="dark"] .result-flujo-inline .flujo-nodo { background:rgba(15,30,55,.55); border-color:rgba(60,110,160,.25); }

/* Breadcrumb */
.flujo-breadcrumb { display:flex;align-items:center;flex-wrap:wrap;gap:6px;margin-bottom:18px;font-size:.75rem;color:var(--text-muted); }
.flujo-breadcrumb-step { display:flex;align-items:center;gap:5px; }
.flujo-breadcrumb-step::after { content:'→';color:var(--blue-300);font-size:.85rem; }
.flujo-breadcrumb-step:last-child::after { content:''; }
.flujo-breadcrumb-step .bc-q { font-weight:600;color:var(--text-muted);background:var(--gray-100);border-radius:6px;padding:2px 8px;max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis; }
.flujo-breadcrumb-step .bc-a { color:var(--blue-700);font-weight:700; }

/* Nodo pregunta */
.flujo-nodo { background:rgba(255,255,255,.82);backdrop-filter:blur(16px);border:1.5px solid var(--glass-border);border-radius:var(--r-lg);padding:24px;animation:fadeUp .25s var(--ease); }
.flujo-nodo-label { font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:var(--blue-500);margin-bottom:8px; }
.flujo-pregunta { font-family:'Sora',sans-serif;font-size:1.05rem;font-weight:600;color:var(--blue-900);line-height:1.4;margin-bottom:20px; }
.flujo-opciones { display:flex;flex-direction:column;gap:10px; }
.flujo-opt-btn { display:flex;align-items:center;gap:12px;background:rgba(255,255,255,.75);border:1.5px solid var(--gray-200);border-radius:var(--r-md);padding:12px 18px;font-family:'DM Sans',sans-serif;font-size:.9rem;color:var(--text);cursor:pointer;text-align:left;transition:all .18s var(--ease);width:100%; }
.flujo-opt-btn:hover { border-color:var(--blue-300);background:rgba(58,134,200,.08);color:var(--blue-700);transform:translateX(4px); }
.flujo-opt-btn .opt-arrow { margin-left:auto;color:var(--blue-300);transition:transform .18s;flex-shrink:0; }
.flujo-opt-btn:hover .opt-arrow { transform:translateX(4px); }

/* Resultado */
.flujo-resultado { border-radius:var(--r-lg);padding:22px;animation:fadeUp .3s var(--ease); }
.flujo-resultado.color-error   { background:var(--p0-bg);border:1.5px solid var(--p0-bd); }
.flujo-resultado.color-warning { background:var(--p1-bg);border:1.5px solid var(--p1-bd); }
.flujo-resultado.color-ok      { background:var(--ges-bg);border:1.5px solid var(--ges-bd); }
.flujo-resultado.color-info    { background:var(--p2-bg);border:1.5px solid var(--p2-bd); }
.flujo-resultado-titulo { font-family:'Sora',sans-serif;font-size:1.05rem;font-weight:700;margin-bottom:8px; }
.flujo-resultado.color-error   .flujo-resultado-titulo { color:var(--p0-text); }
.flujo-resultado.color-warning .flujo-resultado-titulo { color:var(--p1-text); }
.flujo-resultado.color-ok      .flujo-resultado-titulo { color:var(--ges-text); }
.flujo-resultado.color-info    .flujo-resultado-titulo { color:var(--p2-text); }
.flujo-resultado-conducta { font-size:.88rem;color:var(--text);line-height:1.6;white-space:pre-line;margin-top:6px; }

/* Campos clínicos del nodo resultado */
.flujo-resultado-campos { margin-top:12px;display:flex;flex-direction:column;gap:8px; }
.flujo-resultado-campo { background:rgba(255,255,255,.55);border-radius:var(--r-sm);padding:10px 14px; }
.flujo-resultado-campo-label { font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--gray-400);margin-bottom:4px; }
.flujo-resultado-campo-value { font-size:.875rem;color:var(--text);line-height:1.55;white-space:pre-line; }
[data-theme="dark"] .flujo-resultado-campo { background:rgba(15,30,55,.40); }

/* Reiniciar */
.flujo-reiniciar-btn { margin-top:16px;display:inline-flex;align-items:center;gap:8px;background:rgba(58,134,200,.10);border:1.5px solid var(--blue-200);padding:8px 20px;border-radius:30px;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;color:var(--blue-700);cursor:pointer;transition:all .15s; }
.flujo-reiniciar-btn:hover { background:rgba(58,134,200,.18); }

/* ──── EDITOR ──── */
.flujo-editor-wrap { width:100%; }
.flujo-editor-toolbar { display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;align-items:center; }
.flujo-editor-nodos { display:flex;flex-direction:column;gap:14px; }
.flujo-node-card { background:rgba(255,255,255,.75);border:1.5px solid var(--glass-border);border-radius:var(--r-lg);padding:18px;position:relative; }
.flujo-node-card.is-inicio { border-color:var(--blue-300);box-shadow:0 0 0 3px rgba(58,134,200,.12); }
.flujo-node-card.is-resultado { border-color:rgba(22,163,74,.35); }
.flujo-node-header { display:flex;align-items:center;gap:10px;margin-bottom:14px; }
.flujo-node-id-badge { font-family:'Sora',sans-serif;font-size:.72rem;font-weight:700;padding:3px 10px;border-radius:20px;background:var(--blue-100);color:var(--blue-700);border:1px solid var(--blue-200);flex-shrink:0; }
.flujo-node-id-badge.badge-inicio { background:rgba(58,134,200,.15); }
.flujo-node-id-badge.badge-result { background:var(--ges-bg);color:var(--ges-text);border-color:var(--ges-bd); }
.flujo-node-tipo-label { font-size:.72rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--text-muted);flex:1; }
.flujo-node-del-btn { background:var(--p0-bg);border:1px solid var(--p0-bd);color:var(--p0-text);border-radius:8px;width:30px;height:30px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.9rem;flex-shrink:0;transition:background .15s; }
.flujo-node-del-btn:hover { background:rgba(239,68,68,.2); }
.flujo-opcion-row { display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:center;margin-bottom:8px; }
.flujo-opcion-row input,.flujo-opcion-row select { background:rgba(255,255,255,.95);border:1.5px solid var(--gray-200);border-radius:9px;padding:8px 11px;font-family:'DM Sans',sans-serif;font-size:.85rem;color:var(--text);outline:none;transition:border-color .2s; }
.flujo-opcion-row input:focus,.flujo-opcion-row select:focus { border-color:var(--blue-300); }
.flujo-del-opt-btn { background:none;border:none;color:var(--p0-text);cursor:pointer;font-size:1rem;padding:4px 6px;border-radius:6px;transition:background .15s; }
.flujo-del-opt-btn:hover { background:var(--p0-bg); }
.flujo-add-opt-btn { background:rgba(58,134,200,.08);border:1.5px dashed var(--blue-200);color:var(--blue-700);border-radius:9px;padding:7px 14px;cursor:pointer;font-size:.82rem;font-weight:600;margin-top:4px;width:100%;transition:all .15s; }
.flujo-add-opt-btn:hover { background:rgba(58,134,200,.15);border-color:var(--blue-400); }
.flujo-field-label { font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--gray-400);margin-bottom:5px; }
.flujo-input-full { background:rgba(255,255,255,.95);border:1.5px solid var(--gray-200);border-radius:10px;padding:10px 13px;font-family:'DM Sans',sans-serif;font-size:.88rem;color:var(--text);outline:none;width:100%;transition:border-color .2s; }
.flujo-input-full:focus { border-color:var(--blue-300);box-shadow:0 0 0 3px rgba(58,134,200,.10); }
.flujo-textarea-full { resize:vertical;min-height:70px;line-height:1.5; }
.flujo-color-select { appearance:none;cursor:pointer; }
.flujo-empty-state { text-align:center;padding:36px 20px;color:var(--text-muted);font-size:.88rem;line-height:1.6; }
.flujo-preview-btn { background:rgba(34,197,94,.10);border:1.5px solid rgba(22,163,74,.30);color:var(--ges-text);border-radius:30px;padding:8px 20px;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;display:inline-flex;align-items:center;gap:8px;transition:all .15s; }
.flujo-preview-btn:hover { background:rgba(34,197,94,.18); }
.flujo-editor-section-sep { font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:var(--blue-500);border-bottom:1px solid var(--blue-100);padding-bottom:6px;margin:18px 0 12px; }

/* Dark mode editor */
[data-theme="dark"] .flujo-nodo,[data-theme="dark"] .flujo-node-card { background:rgba(15,30,55,.70);border-color:rgba(60,110,160,.30); }
[data-theme="dark"] .flujo-opt-btn { background:rgba(15,30,55,.65);border-color:rgba(60,110,160,.30);color:var(--text); }
[data-theme="dark"] .flujo-opt-btn:hover { background:rgba(60,110,160,.20);border-color:var(--blue-300);color:var(--blue-700); }
[data-theme="dark"] .flujo-opcion-row input,[data-theme="dark"] .flujo-opcion-row select,[data-theme="dark"] .flujo-input-full { background:rgba(15,30,55,.85);border-color:rgba(60,110,160,.35);color:var(--text); }
[data-theme="dark"] .flujo-breadcrumb-step .bc-q { background:rgba(30,55,95,.60); }
`;
    document.head.appendChild(s);
  })();

  /* ═══════════════════════════════════════════════════════════════════════
     MOTOR
  ════════════════════════════════════════════════════════════════════════ */
  // Campos clínicos que se pueden configurar por nodo resultado
  var CAMPOS = [
    { key:'conducta',    label:'Conducta / Recomendación' },
    { key:'criterios',   label:'Criterios de derivación' },
    { key:'examenes',    label:'Exámenes mínimos (EMBD)' },
    { key:'destino',     label:'Destino de derivación' },
    { key:'manejo',      label:'Manejo inicial' },
    { key:'indicaciones',label:'Indicaciones' },
    { key:'notas',       label:'Notas importantes' },
  ];

  window.FLUJO_run = function (algoritmoData, containerEl) {
    if (!algoritmoData || !containerEl) return;
    var nodos   = algoritmoData.nodos || {};
    var history = [];
    var wrap    = document.createElement('div');
    wrap.className = 'flujo-wrap';
    containerEl.innerHTML = '';
    containerEl.appendChild(wrap);

    function render(nodoId) {
      var nodo = nodos[nodoId];
      if (!nodo) {
        wrap.innerHTML = '<div class="flujo-empty-state">Nodo no encontrado: <code>' + esc(nodoId) + '</code></div>';
        return;
      }
      wrap.innerHTML = '';

      // Breadcrumb
      if (history.length) {
        var bc = document.createElement('div');
        bc.className = 'flujo-breadcrumb';
        history.forEach(function (h) {
          var step = document.createElement('div');
          step.className = 'flujo-breadcrumb-step';
          step.innerHTML = '<span class="bc-q" title="' + esc(h.pregunta) + '">'
            + esc(h.pregunta.substring(0,35) + (h.pregunta.length>35?'…':''))
            + '</span><span class="bc-a">' + esc(h.opcionTexto) + '</span>';
          bc.appendChild(step);
        });
        wrap.appendChild(bc);
      }

      nodo.tipo === 'resultado' ? renderResultado(nodo) : renderPregunta(nodoId, nodo);
    }

    function renderPregunta(nodoId, nodo) {
      var card = document.createElement('div');
      card.className = 'flujo-nodo';
      var esInicio = nodoId === (algoritmoData.nodo_inicio || 'inicio');
      card.innerHTML = '<div class="flujo-nodo-label">' + (esInicio ? 'Punto de inicio' : 'Pregunta') + '</div>'
        + '<div class="flujo-pregunta">' + esc(nodo.texto) + '</div>'
        + '<div class="flujo-opciones" id="fopts-' + esc(nodoId) + '"></div>';
      wrap.appendChild(card);
      var optsDiv = card.querySelector('#fopts-' + nodoId);
      (nodo.opciones || []).forEach(function (opt) {
        var btn = document.createElement('button');
        btn.className = 'flujo-opt-btn';
        btn.innerHTML = '<span>' + esc(opt.texto) + '</span><span class="opt-arrow">→</span>';
        btn.addEventListener('click', function () {
          history.push({ nodoId: nodoId, pregunta: nodo.texto, opcionTexto: opt.texto });
          render(opt.siguiente);
        });
        optsDiv.appendChild(btn);
      });
    }

    function renderResultado(nodo) {
      var color = nodo.color || 'info';

      // Bloque resultado del algoritmo
      var resDiv = document.createElement('div');
      resDiv.className = 'flujo-resultado color-' + esc(color);

      var titulo = document.createElement('div');
      titulo.className = 'flujo-resultado-titulo';
      titulo.textContent = nodo.texto;
      resDiv.appendChild(titulo);

      // Campos clínicos del nodo (solo los que tienen valor)
      var conValor = CAMPOS.filter(function(c){ return nodo[c.key]; });
      if (conValor.length) {
        var camposWrap = document.createElement('div');
        camposWrap.className = 'flujo-resultado-campos';
        conValor.forEach(function (c) {
          var campo = document.createElement('div');
          campo.className = 'flujo-resultado-campo';
          campo.innerHTML = '<div class="flujo-resultado-campo-label">' + esc(c.label) + '</div>'
            + '<div class="flujo-resultado-campo-value">' + esc(nodo[c.key]) + '</div>';
          camposWrap.appendChild(campo);
        });
        resDiv.appendChild(camposWrap);
      }

      wrap.appendChild(resDiv);

      // Botón reiniciar
      var reinBtn = document.createElement('button');
      reinBtn.className = 'flujo-reiniciar-btn';
      reinBtn.textContent = 'Reiniciar';
      reinBtn.addEventListener('click', function () {
        history = [];
        render(algoritmoData.nodo_inicio || 'inicio');
      });
      wrap.appendChild(reinBtn);
    }

    render(algoritmoData.nodo_inicio || 'inicio');
  };

  /* ═══════════════════════════════════════════════════════════════════════
     EDITOR
  ════════════════════════════════════════════════════════════════════════ */
  var COLORES = [
    {v:'error',  l:'🔴 Urgente / Crítico'},
    {v:'warning',l:'🟠 Precaución / Moderado'},
    {v:'ok',     l:'🟢 Normal / Favorable'},
    {v:'info',   l:'🔵 Informativo'}
  ];

  // Campos clínicos configurables por nodo resultado (editor)
  var CAMPOS_EDITOR = [
    {key:'conducta',    label:'Conducta / Recomendación clínica',    ph:'Ej: Activar código infarto. EKG inmediato.'},
    {key:'criterios',   label:'Criterios de derivación',             ph:'Ej: HTA refractaria, sospecha feocromocitoma.'},
    {key:'examenes',    label:'Exámenes mínimos (EMBD)',             ph:'Ej: TSH, T4L, Hemograma.'},
    {key:'destino',     label:'Destino de derivación',               ph:'Ej: Endocrinología, Urgencia.'},
    {key:'manejo',      label:'Manejo inicial',                      ph:'Ej: Iniciar metformina 500 mg/día.'},
    {key:'indicaciones',label:'Indicaciones al paciente',            ph:'Ej: Dieta hipocalórica, 30 min actividad/día.'},
    {key:'notas',       label:'Notas importantes',                   ph:'Información adicional relevante.'},
  ];

  window.FLUJO_editor = function (containerEl, initialData) {
    if (!containerEl) return null;

    var state = {
      id:          (initialData && initialData.id)          || '',
      titulo:      (initialData && initialData.titulo)      || '',
      nodo_inicio: (initialData && initialData.nodo_inicio) || '',
      nodos:       {}
    };

    if (initialData && initialData.nodos) {
      Object.keys(initialData.nodos).forEach(function (k) {
        var n = initialData.nodos[k];
        var cloned = {
          tipo:    n.tipo || 'pregunta',
          texto:   n.texto || '',
          color:   n.color || 'info',
          opciones:(n.opciones||[]).map(function(o){return{texto:o.texto||'',siguiente:o.siguiente||''};})
        };
        CAMPOS_EDITOR.forEach(function(c){ cloned[c.key] = n[c.key] || ''; });
        state.nodos[k] = cloned;
      });
    }

    var nodeCounter = Object.keys(state.nodos).length;
    function newId() { nodeCounter++; return 'n' + nodeCounter; }

    function render() {
      containerEl.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.className = 'flujo-editor-wrap';

      // Título
      fieldGroup(wrap, 'Título del algoritmo', function(g){
        var inp = document.createElement('input');
        inp.className = 'flujo-input-full';
        inp.placeholder = 'Ej: Algoritmo diagnóstico de dolor torácico';
        inp.value = state.titulo;
        inp.addEventListener('input', function(){ state.titulo = inp.value; });
        g.appendChild(inp);
      }, 'margin-bottom:18px');

      // Nodo inicial
      var inicioWrap = document.createElement('div');
      inicioWrap.style.cssText = 'margin-bottom:20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap';
      var inicioLbl = document.createElement('span');
      inicioLbl.style.cssText = 'font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--gray-400)';
      inicioLbl.textContent = 'Nodo inicial:';
      var inicioSel = document.createElement('select');
      inicioSel.className = 'flujo-input-full';
      inicioSel.style.cssText = 'width:auto;max-width:260px';
      syncInicioSelect(inicioSel);
      inicioSel.addEventListener('change', function(){ state.nodo_inicio = inicioSel.value; render(); });
      inicioWrap.appendChild(inicioLbl);
      inicioWrap.appendChild(inicioSel);
      wrap.appendChild(inicioWrap);

      // Toolbar
      var toolbar = document.createElement('div');
      toolbar.className = 'flujo-editor-toolbar';
      toolbar.appendChild(makeBtn('+ Pregunta', 'btn-primary', function(){
        var id = newId();
        var nv = {tipo:'pregunta',texto:'',color:'info',opciones:[{texto:'',siguiente:''}]};
        CAMPOS_EDITOR.forEach(function(c){ nv[c.key]=''; });
        state.nodos[id] = nv;
        render();
        setTimeout(function(){
          var el = containerEl.querySelector('[data-node-id="'+id+'"]');
          if(el) el.scrollIntoView({behavior:'smooth',block:'center'});
        }, 80);
      }));
      toolbar.appendChild(makeBtn('+ Resultado', 'btn-ghost', function(){
        var id = newId();
        var nv = {tipo:'resultado',texto:'',color:'info',opciones:[]};
        CAMPOS_EDITOR.forEach(function(c){ nv[c.key]=''; });
        state.nodos[id] = nv;
        render();
      }));
      var prevBtn = document.createElement('button');
      prevBtn.className = 'flujo-preview-btn';
      prevBtn.innerHTML = '▶ Previsualizar';
      prevBtn.addEventListener('click', openPreview);
      toolbar.appendChild(prevBtn);
      wrap.appendChild(toolbar);

      // Nodos
      var nodesWrap = document.createElement('div');
      nodesWrap.className = 'flujo-editor-nodos';
      var ids = Object.keys(state.nodos);
      if (!ids.length) {
        var empty = document.createElement('div');
        empty.className = 'flujo-empty-state';
        empty.innerHTML = 'Sin nodos aún.<br>Agrega una <strong>Pregunta</strong> para iniciar el algoritmo.';
        nodesWrap.appendChild(empty);
      } else {
        ids.forEach(function(id){ nodesWrap.appendChild(buildNodeCard(id)); });
      }
      wrap.appendChild(nodesWrap);
      containerEl.appendChild(wrap);
      syncInicioSelect(inicioSel);
    }

    function syncInicioSelect(sel) {
      var prev = sel.value || state.nodo_inicio;
      sel.innerHTML = '';
      var pIds = Object.keys(state.nodos).filter(function(id){ return state.nodos[id].tipo==='pregunta'; });
      if (!pIds.length) {
        var o = document.createElement('option');
        o.value=''; o.textContent='— Sin preguntas aún —';
        sel.appendChild(o);
      } else {
        pIds.forEach(function(id){
          var n = state.nodos[id];
          var o = document.createElement('option');
          o.value = id;
          o.textContent = id + ': ' + (n.texto||'(sin texto)').substring(0,50);
          if (id === prev) o.selected = true;
          sel.appendChild(o);
        });
      }
      state.nodo_inicio = sel.value || (pIds[0]||'');
    }

    function buildNodeCard(id) {
      var nodo = state.nodos[id];
      var esInicio = id === state.nodo_inicio;
      var card = document.createElement('div');
      card.className = 'flujo-node-card'
        + (esInicio ? ' is-inicio' : '')
        + (nodo.tipo==='resultado' ? ' is-resultado' : '');
      card.dataset.nodeId = id;

      // Header
      var header = document.createElement('div');
      header.className = 'flujo-node-header';
      var badge = document.createElement('span');
      badge.className = 'flujo-node-id-badge'
        + (esInicio ? ' badge-inicio' : '')
        + (nodo.tipo==='resultado' ? ' badge-result' : '');
      badge.textContent = id + (esInicio ? ' ★' : '');
      var typeLabel = document.createElement('span');
      typeLabel.className = 'flujo-node-tipo-label';
      typeLabel.textContent = nodo.tipo==='resultado' ? 'Resultado final' : 'Pregunta';
      var delBtn = document.createElement('button');
      delBtn.className = 'flujo-node-del-btn';
      delBtn.innerHTML = '✕'; delBtn.title = 'Eliminar nodo';
      delBtn.addEventListener('click', function(){
        if (!confirm('¿Eliminar el nodo "'+id+'"?')) return;
        delete state.nodos[id];
        if (state.nodo_inicio===id) {
          var rem = Object.keys(state.nodos).filter(function(k){ return state.nodos[k].tipo==='pregunta'; });
          state.nodo_inicio = rem[0]||'';
        }
        render();
      });
      header.appendChild(badge); header.appendChild(typeLabel); header.appendChild(delBtn);
      card.appendChild(header);

      // Texto
      fieldGroup(card, nodo.tipo==='resultado' ? 'Título del resultado' : 'Texto de la pregunta', function(g){
        var el = document.createElement(nodo.tipo==='resultado' ? 'input' : 'textarea');
        el.className = 'flujo-input-full' + (nodo.tipo!=='resultado' ? ' flujo-textarea-full' : '');
        el.placeholder = nodo.tipo==='resultado'
          ? 'Ej: Sospecha de síndrome coronario agudo'
          : 'Ej: ¿Presenta dolor torácico opresivo?';
        el.value = nodo.texto;
        if (nodo.tipo!=='resultado') el.rows = 2;
        el.addEventListener('input', function(){ nodo.texto = el.value; });
        g.appendChild(el);
      }, 'margin-bottom:14px');

      if (nodo.tipo === 'resultado') {
        // Color
        fieldGroup(card, 'Severidad', function(g){
          var sel = document.createElement('select');
          sel.className = 'flujo-input-full flujo-color-select';
          sel.style.cssText = 'width:auto;max-width:240px';
          COLORES.forEach(function(c){
            var o = document.createElement('option');
            o.value=c.v; o.textContent=c.l;
            if(c.v===(nodo.color||'info')) o.selected=true;
            sel.appendChild(o);
          });
          sel.addEventListener('change', function(){ nodo.color=sel.value; });
          g.appendChild(sel);
        }, 'margin-bottom:14px');

        // Separador sección clínica
        var sep = document.createElement('div');
        sep.className = 'flujo-editor-section-sep';
        sep.textContent = 'Información clínica para este resultado';
        card.appendChild(sep);

        // Campos clínicos
        CAMPOS_EDITOR.forEach(function(campo){
          fieldGroup(card, campo.label, function(g){
            var ta = document.createElement('textarea');
            ta.className = 'flujo-input-full flujo-textarea-full';
            ta.rows = 2; ta.placeholder = campo.ph;
            ta.value = nodo[campo.key] || '';
            ta.addEventListener('input', function(){ nodo[campo.key] = ta.value; });
            g.appendChild(ta);
          }, 'margin-bottom:10px');
        });

      } else {
        // Opciones
        var optsSection = document.createElement('div');
        var optsLbl = document.createElement('div');
        optsLbl.className = 'flujo-field-label';
        optsLbl.textContent = 'Opciones de respuesta';
        optsSection.appendChild(optsLbl);

        var colH = document.createElement('div');
        colH.style.cssText = 'display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-bottom:5px';
        colH.innerHTML = '<span style="font-size:.68rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px">Texto de opción</span>'
          +'<span style="font-size:.68rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px">Ir a nodo</span>'
          +'<span></span>';
        optsSection.appendChild(colH);

        var listEl = document.createElement('div');
        nodo.opciones = nodo.opciones||[];
        nodo.opciones.forEach(function(opt){ listEl.appendChild(buildOptRow(nodo,opt,listEl)); });
        optsSection.appendChild(listEl);

        var addBtn = document.createElement('button');
        addBtn.className = 'flujo-add-opt-btn';
        addBtn.textContent = '+ Agregar opción';
        addBtn.addEventListener('click', function(){
          nodo.opciones.push({texto:'',siguiente:''});
          listEl.appendChild(buildOptRow(nodo, nodo.opciones[nodo.opciones.length-1], listEl));
        });
        optsSection.appendChild(addBtn);
        card.appendChild(optsSection);
      }

      return card;
    }

    function buildOptRow(nodo, opt, listEl) {
      var row = document.createElement('div');
      row.className = 'flujo-opcion-row';
      var txtIn = document.createElement('input');
      txtIn.type='text'; txtIn.placeholder='Ej: Sí / No…'; txtIn.value=opt.texto;
      txtIn.addEventListener('input', function(){ opt.texto=txtIn.value; });
      var destSel = document.createElement('select');
      buildDestOptions(destSel, opt.siguiente);
      destSel.addEventListener('change', function(){ opt.siguiente=destSel.value; });
      var del = document.createElement('button');
      del.className='flujo-del-opt-btn'; del.title='Eliminar opción'; del.innerHTML='✕';
      del.addEventListener('click', function(){
        var idx = nodo.opciones.indexOf(opt);
        if(idx!==-1) nodo.opciones.splice(idx,1);
        if(listEl.contains(row)) listEl.removeChild(row);
      });
      row.appendChild(txtIn); row.appendChild(destSel); row.appendChild(del);
      return row;
    }

    function buildDestOptions(sel, selected) {
      sel.innerHTML = '';
      var blank = document.createElement('option');
      blank.value=''; blank.textContent='— Seleccionar destino —';
      sel.appendChild(blank);
      ['pregunta','resultado'].forEach(function(tipo){
        var ids = Object.keys(state.nodos).filter(function(k){ return state.nodos[k].tipo===tipo; });
        if (!ids.length) return;
        var og = document.createElement('optgroup');
        og.label = tipo==='pregunta' ? 'Preguntas' : 'Resultados finales';
        ids.forEach(function(k){
          var o = document.createElement('option');
          o.value=k;
          o.textContent = k+': '+(state.nodos[k].texto||'(sin texto)').substring(0,40);
          if(k===selected) o.selected=true;
          og.appendChild(o);
        });
        sel.appendChild(og);
      });
    }

    function fieldGroup(parent, labelTxt, buildFn, style) {
      var g = document.createElement('div');
      if(style) g.style.cssText = style;
      var lbl = document.createElement('div');
      lbl.className='flujo-field-label'; lbl.textContent=labelTxt;
      g.appendChild(lbl); buildFn(g); parent.appendChild(g);
    }

    function makeBtn(txt, cls, handler) {
      var btn = document.createElement('button');
      btn.className='btn '+cls; btn.textContent=txt; btn.type='button';
      btn.addEventListener('click', handler);
      return btn;
    }

    function openPreview() {
      var data = getData();
      if (!data.nodo_inicio || !data.nodos[data.nodo_inicio]) {
        alert('Define al menos una pregunta y selecciona el nodo inicial.'); return;
      }
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:900;background:rgba(15,46,90,.35);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px';
      var box = document.createElement('div');
      box.style.cssText = 'background:var(--glass-bg-heavy,rgba(255,255,255,.94));border:1.5px solid var(--glass-border);border-radius:var(--r-xl);width:100%;max-width:560px;max-height:87vh;overflow-y:auto;padding:28px;box-shadow:0 24px 60px rgba(15,46,90,.22)';
      var titleRow = document.createElement('div');
      titleRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:20px';
      titleRow.innerHTML = '<span style="font-family:\'Sora\',sans-serif;font-size:1rem;font-weight:700;color:var(--blue-900)">Previsualización: '+esc(data.titulo||'Algoritmo')+'</span>';
      var closeBtn = document.createElement('button');
      closeBtn.className='diag-close-btn';
      closeBtn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      closeBtn.addEventListener('click', function(){ document.body.removeChild(overlay); });
      titleRow.appendChild(closeBtn); box.appendChild(titleRow);
      var motorDiv = document.createElement('div');
      box.appendChild(motorDiv); overlay.appendChild(box);
      overlay.addEventListener('click', function(e){ if(e.target===overlay) document.body.removeChild(overlay); });
      document.body.appendChild(overlay);
      window.FLUJO_run(data, motorDiv);
    }

    function getData() {
      return {
        id: state.id, titulo: state.titulo, version: 1,
        nodo_inicio: state.nodo_inicio,
        nodos: JSON.parse(JSON.stringify(state.nodos))
      };
    }

    render();
    return { getData: getData, refresh: render };
  };

})();
