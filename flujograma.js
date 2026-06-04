// ═══════════════════════════════════════════════════════════════════════════
// SICMED – Flujograma Clínico (Motor + Editor)
// Archivo independiente; no modifica estructuras existentes.
//
// MOTOR:   window.FLUJO_run(flujoData, containerEl)
//            → Renderiza el algoritmo interactivo en containerEl
// EDITOR:  window.FLUJO_editor(containerEl, initialData)
//            → Renderiza el editor visual de nodos en containerEl
//            → Retorna { getData() } para obtener el JSON del flujograma
// ═══════════════════════════════════════════════════════════════════════════

(function () {
  'use strict';

  /* ─── Utilidades ──────────────────────────────────────────────────────── */
  function esc(s) {
    if (window.escapeHTML) return window.escapeHTML(s);
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* ─── Estilos inyectados una sola vez ─────────────────────────────────── */
  (function injectStyles() {
    if (document.getElementById('flujo-styles')) return;
    var style = document.createElement('style');
    style.id = 'flujo-styles';
    style.textContent = `
/* ──── MOTOR: Ejecución del algoritmo ──── */
.flujo-wrap {
  width: 100%;
  font-family: 'DM Sans', system-ui, sans-serif;
}
/* Cuando el motor corre dentro del resultado inline, el contenedor
   ya tiene el fondo correcto — solo ajustamos el nodo para que se vea
   integrado sin doble borde/fondo */
.result-flujo-inline .flujo-nodo {
  background: rgba(255,255,255,0.70);
  border-color: rgba(58,134,200,0.18);
}
[data-theme="dark"] .result-flujo-inline .flujo-nodo {
  background: rgba(15,30,55,0.55);
  border-color: rgba(60,110,160,0.25);
}
.flujo-breadcrumb {
  display: flex; align-items: center; flex-wrap: wrap; gap: 6px;
  margin-bottom: 18px;
  font-size: .75rem; color: var(--text-muted);
}
.flujo-breadcrumb-step {
  display: flex; align-items: center; gap: 5px;
}
.flujo-breadcrumb-step::after {
  content: '→'; color: var(--blue-300); font-size: .85rem;
}
.flujo-breadcrumb-step:last-child::after { content: ''; }
.flujo-breadcrumb-step .bc-q {
  font-weight: 600; color: var(--text-muted);
  background: var(--gray-100); border-radius: 6px;
  padding: 2px 8px; max-width: 160px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.flujo-breadcrumb-step .bc-a {
  color: var(--blue-700); font-weight: 700;
}
.flujo-nodo {
  background: rgba(255,255,255,0.82);
  backdrop-filter: blur(16px);
  border: 1.5px solid var(--glass-border);
  border-radius: var(--r-lg);
  padding: 24px;
  animation: fadeUp .25s var(--ease);
}
.flujo-nodo-label {
  font-size: .68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 1.2px; color: var(--blue-500); margin-bottom: 8px;
}
.flujo-pregunta {
  font-family: 'Sora', sans-serif;
  font-size: 1.05rem; font-weight: 600;
  color: var(--blue-900); line-height: 1.4; margin-bottom: 20px;
}
.flujo-opciones {
  display: flex; flex-direction: column; gap: 10px;
}
.flujo-opt-btn {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.75);
  border: 1.5px solid var(--gray-200);
  border-radius: var(--r-md);
  padding: 12px 18px;
  font-family: 'DM Sans', sans-serif; font-size: .9rem;
  color: var(--text); cursor: pointer; text-align: left;
  transition: all .18s var(--ease);
  width: 100%;
}
.flujo-opt-btn:hover {
  border-color: var(--blue-300);
  background: rgba(58,134,200,.08);
  color: var(--blue-700);
  transform: translateX(4px);
}
.flujo-opt-btn .opt-arrow {
  margin-left: auto; color: var(--blue-300);
  transition: transform .18s; flex-shrink: 0;
}
.flujo-opt-btn:hover .opt-arrow { transform: translateX(4px); }

/* Resultado final */
.flujo-resultado {
  border-radius: var(--r-lg); padding: 22px;
  animation: fadeUp .3s var(--ease);
}
.flujo-resultado.color-error   { background: var(--p0-bg); border: 1.5px solid var(--p0-bd); }
.flujo-resultado.color-warning { background: var(--p1-bg); border: 1.5px solid var(--p1-bd); }
.flujo-resultado.color-ok      { background: var(--ges-bg); border: 1.5px solid var(--ges-bd); }
.flujo-resultado.color-info    { background: var(--p2-bg); border: 1.5px solid var(--p2-bd); }
.flujo-resultado-icon { font-size: 2rem; margin-bottom: 10px; }
.flujo-resultado-titulo {
  font-family: 'Sora', sans-serif; font-size: 1.05rem; font-weight: 700;
  margin-bottom: 8px;
}
.flujo-resultado.color-error   .flujo-resultado-titulo { color: var(--p0-text); }
.flujo-resultado.color-warning .flujo-resultado-titulo { color: var(--p1-text); }
.flujo-resultado.color-ok      .flujo-resultado-titulo { color: var(--ges-text); }
.flujo-resultado.color-info    .flujo-resultado-titulo { color: var(--p2-text); }
.flujo-resultado-conducta {
  font-size: .88rem; color: var(--text); line-height: 1.6;
  white-space: pre-line;
}
.flujo-reiniciar-btn {
  margin-top: 16px;
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(58,134,200,.10);
  border: 1.5px solid var(--blue-200);
  padding: 8px 20px; border-radius: 30px;
  font-family: 'DM Sans', sans-serif; font-size: .85rem;
  font-weight: 600; color: var(--blue-700); cursor: pointer;
  transition: all .15s;
}
.flujo-reiniciar-btn:hover { background: rgba(58,134,200,.18); }

/* ──── EDITOR de nodos ──── */
.flujo-editor-wrap { width: 100%; }
.flujo-editor-toolbar {
  display: flex; gap: 8px; flex-wrap: wrap;
  margin-bottom: 16px; align-items: center;
}
.flujo-editor-nodos { display: flex; flex-direction: column; gap: 14px; }
.flujo-node-card {
  background: rgba(255,255,255,0.75);
  border: 1.5px solid var(--glass-border);
  border-radius: var(--r-lg);
  padding: 18px;
  position: relative;
}
.flujo-node-card.is-inicio {
  border-color: var(--blue-300);
  box-shadow: 0 0 0 3px rgba(58,134,200,.12);
}
.flujo-node-card.is-resultado { border-color: rgba(22,163,74,.35); }
.flujo-node-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
}
.flujo-node-id-badge {
  font-family: 'Sora', sans-serif; font-size: .72rem; font-weight: 700;
  padding: 3px 10px; border-radius: 20px;
  background: var(--blue-100); color: var(--blue-700);
  border: 1px solid var(--blue-200);
  flex-shrink: 0;
}
.flujo-node-id-badge.badge-inicio { background: rgba(58,134,200,.15); color: var(--blue-700); }
.flujo-node-id-badge.badge-result { background: var(--ges-bg); color: var(--ges-text); border-color: var(--ges-bd); }
.flujo-node-tipo-label {
  font-size: .72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .8px; color: var(--text-muted); flex: 1;
}
.flujo-node-del-btn {
  background: var(--p0-bg); border: 1px solid var(--p0-bd);
  color: var(--p0-text); border-radius: 8px;
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; font-size: .9rem; flex-shrink: 0;
  transition: background .15s;
}
.flujo-node-del-btn:hover { background: rgba(239,68,68,.2); }
.flujo-opcion-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px; align-items: center;
  margin-bottom: 8px;
}
.flujo-opcion-row input,
.flujo-opcion-row select {
  background: rgba(255,255,255,.95);
  border: 1.5px solid var(--gray-200);
  border-radius: 9px; padding: 8px 11px;
  font-family: 'DM Sans', sans-serif; font-size: .85rem;
  color: var(--text); outline: none;
  transition: border-color .2s;
}
.flujo-opcion-row input:focus,
.flujo-opcion-row select:focus { border-color: var(--blue-300); }
.flujo-del-opt-btn {
  background: none; border: none; color: var(--p0-text);
  cursor: pointer; font-size: 1rem; padding: 4px 6px;
  border-radius: 6px; transition: background .15s;
}
.flujo-del-opt-btn:hover { background: var(--p0-bg); }
.flujo-add-opt-btn {
  background: rgba(58,134,200,.08);
  border: 1.5px dashed var(--blue-200);
  color: var(--blue-700); border-radius: 9px;
  padding: 7px 14px; cursor: pointer; font-size: .82rem;
  font-weight: 600; margin-top: 4px; width: 100%;
  transition: all .15s;
}
.flujo-add-opt-btn:hover { background: rgba(58,134,200,.15); border-color: var(--blue-400); }
.flujo-field-label {
  font-size: .68rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: .7px; color: var(--gray-400); margin-bottom: 5px;
}
.flujo-input-full {
  background: rgba(255,255,255,.95);
  border: 1.5px solid var(--gray-200);
  border-radius: 10px; padding: 10px 13px;
  font-family: 'DM Sans', sans-serif; font-size: .88rem;
  color: var(--text); outline: none; width: 100%;
  transition: border-color .2s;
}
.flujo-input-full:focus { border-color: var(--blue-300); box-shadow: 0 0 0 3px rgba(58,134,200,.10); }
.flujo-textarea-full {
  resize: vertical; min-height: 72px; line-height: 1.5;
}
.flujo-color-select {
  appearance: none; cursor: pointer;
}
.flujo-color-preview {
  display: inline-block; width: 12px; height: 12px;
  border-radius: 50%; margin-right: 6px; vertical-align: middle;
}
.flujo-inicio-badge {
  font-size: .72rem; font-weight: 700; padding: 2px 10px;
  border-radius: 20px; background: rgba(58,134,200,.15);
  color: var(--blue-700); border: 1px solid var(--blue-200);
  margin-left: 4px;
}
.flujo-empty-state {
  text-align: center; padding: 36px 20px;
  color: var(--text-muted); font-size: .88rem; line-height: 1.6;
}
.flujo-preview-btn {
  background: rgba(34,197,94,.10);
  border: 1.5px solid rgba(22,163,74,.30);
  color: var(--ges-text); border-radius: 30px;
  padding: 8px 20px; cursor: pointer;
  font-family: 'DM Sans', sans-serif; font-size: .85rem; font-weight: 600;
  display: inline-flex; align-items: center; gap: 8px;
  transition: all .15s;
}
.flujo-preview-btn:hover { background: rgba(34,197,94,.18); }

/* Dark mode */
[data-theme="dark"] .flujo-nodo,
[data-theme="dark"] .flujo-node-card {
  background: rgba(15,30,55,.70);
  border-color: rgba(60,110,160,.30);
}
[data-theme="dark"] .flujo-opt-btn {
  background: rgba(15,30,55,.65);
  border-color: rgba(60,110,160,.30);
  color: var(--text);
}
[data-theme="dark"] .flujo-opt-btn:hover {
  background: rgba(60,110,160,.20);
  border-color: var(--blue-300);
  color: var(--blue-700);
}
[data-theme="dark"] .flujo-opcion-row input,
[data-theme="dark"] .flujo-opcion-row select,
[data-theme="dark"] .flujo-input-full {
  background: rgba(15,30,55,.85);
  border-color: rgba(60,110,160,.35);
  color: var(--text);
}
[data-theme="dark"] .flujo-breadcrumb-step .bc-q {
  background: rgba(30,55,95,.60);
}
`;
    document.head.appendChild(style);
  })();

  /* ═══════════════════════════════════════════════════════════════════════
     MOTOR: Ejecución interactiva del algoritmo
  ════════════════════════════════════════════════════════════════════════ */

  window.FLUJO_run = function (flujoData, containerEl) {
    if (!flujoData || !containerEl) return;
    var nodos    = flujoData.nodos || {};
    var history  = [];   // [{ nodoId, pregunta, opcionTexto }]
    var wrap     = document.createElement('div');
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
          step.innerHTML = '<span class="bc-q" title="' + esc(h.pregunta) + '">' + esc(h.pregunta.substring(0, 35) + (h.pregunta.length > 35 ? '…' : '')) + '</span>'
            + '<span class="bc-a">' + esc(h.opcionTexto) + '</span>';
          bc.appendChild(step);
        });
        wrap.appendChild(bc);
      }

      if (nodo.tipo === 'resultado') {
        renderResultado(nodo);
      } else {
        renderPregunta(nodoId, nodo);
      }
    }

    function renderPregunta(nodoId, nodo) {
      var card = document.createElement('div');
      card.className = 'flujo-nodo';
      var esInicio = (nodoId === (flujoData.nodo_inicio || 'inicio'));
      card.innerHTML = '<div class="flujo-nodo-label">' + (esInicio ? 'Punto de inicio' : 'Pregunta') + '</div>'
        + '<div class="flujo-pregunta">' + esc(nodo.texto) + '</div>'
        + '<div class="flujo-opciones" id="flujo-opciones"></div>';
      wrap.appendChild(card);
      var optsDiv = card.querySelector('#flujo-opciones');
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
      var div = document.createElement('div');
      div.className = 'flujo-resultado color-' + esc(color);
      div.innerHTML = '<div class="flujo-resultado-titulo">' + esc(nodo.texto) + '</div>'
        + (nodo.conducta ? '<div class="flujo-resultado-conducta">' + esc(nodo.conducta) + '</div>' : '');
      var reiniciarBtn = document.createElement('button');
      reiniciarBtn.className = 'flujo-reiniciar-btn';
      reiniciarBtn.innerHTML = 'Reiniciar';
      reiniciarBtn.addEventListener('click', function () {
        history = [];
        render(flujoData.nodo_inicio || 'inicio');
      });
      div.appendChild(reiniciarBtn);
      wrap.appendChild(div);
    }

    render(flujoData.nodo_inicio || 'inicio');
  };

  /* ═══════════════════════════════════════════════════════════════════════
     EDITOR VISUAL DE NODOS
  ════════════════════════════════════════════════════════════════════════ */
  var TIPOS_NODO = ['pregunta', 'resultado'];
  var COLORES_RESULTADO = [
    { v: 'error',   l: '🔴 Urgente / Crítico' },
    { v: 'warning', l: '🟠 Precaución / Moderado' },
    { v: 'ok',      l: '🟢 Normal / Favorable' },
    { v: 'info',    l: '🔵 Informativo' }
  ];

  window.FLUJO_editor = function (containerEl, initialData) {
    if (!containerEl) return null;

    /* Estado interno del editor */
    var state = {
      titulo:      (initialData && initialData.titulo)      || '',
      nodo_inicio: (initialData && initialData.nodo_inicio) || 'inicio',
      nodos:       {}
    };

    /* Clonar nodos iniciales */
    if (initialData && initialData.nodos) {
      Object.keys(initialData.nodos).forEach(function (k) {
        var n = initialData.nodos[k];
        state.nodos[k] = {
          tipo:     n.tipo || 'pregunta',
          texto:    n.texto || '',
          conducta: n.conducta || '',
          color:    n.color || 'info',
          opciones: (n.opciones || []).map(function (o) {
            return { texto: o.texto || '', siguiente: o.siguiente || '' };
          })
        };
      });
    }

    var nodeCounter = Object.keys(state.nodos).length;

    function newNodeId() {
      nodeCounter++;
      return 'n' + nodeCounter;
    }

    /* ── Render principal ─────────────────────────────────────────────── */
    function render() {
      containerEl.innerHTML = '';
      var wrap = document.createElement('div');
      wrap.className = 'flujo-editor-wrap';

      /* Título del flujograma */
      var titGroup = document.createElement('div');
      titGroup.style.cssText = 'margin-bottom:18px';
      titGroup.innerHTML = '<div class="flujo-field-label">Título del flujograma</div>';
      var titInput = document.createElement('input');
      titInput.className = 'flujo-input-full';
      titInput.placeholder = 'Ej: Algoritmo diagnóstico de dolor torácico';
      titInput.value = state.titulo;
      titInput.addEventListener('input', function () { state.titulo = titInput.value; });
      titGroup.appendChild(titInput);
      wrap.appendChild(titGroup);

      /* Nodo inicio selector */
      var inicioGroup = document.createElement('div');
      inicioGroup.style.cssText = 'margin-bottom:20px;display:flex;align-items:center;gap:12px;flex-wrap:wrap';
      var inicioLabel = document.createElement('span');
      inicioLabel.style.cssText = 'font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:var(--gray-400)';
      inicioLabel.textContent = 'Nodo inicial:';
      var inicioSel = document.createElement('select');
      inicioSel.className = 'flujo-input-full';
      inicioSel.style.cssText = 'width:auto;max-width:220px';
      refreshInicioSelect(inicioSel);
      inicioSel.addEventListener('change', function () { state.nodo_inicio = inicioSel.value; render(); });
      inicioGroup.appendChild(inicioLabel);
      inicioGroup.appendChild(inicioSel);
      wrap.appendChild(inicioGroup);

      /* Toolbar */
      var toolbar = document.createElement('div');
      toolbar.className = 'flujo-editor-toolbar';

      var btnAddQ = makeBtn('+ Pregunta', 'btn-primary', function () {
        var id = newNodeId();
        state.nodos[id] = { tipo: 'pregunta', texto: '', opciones: [{ texto: '', siguiente: '' }] };
        render();
        setTimeout(function () {
          var el = containerEl.querySelector('[data-node-id="' + id + '"]');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 80);
      });

      var btnAddR = makeBtn('+ Resultado', 'btn-ghost', function () {
        var id = newNodeId();
        state.nodos[id] = { tipo: 'resultado', texto: '', conducta: '', color: 'info' };
        render();
      });

      var btnPreview = document.createElement('button');
      btnPreview.className = 'flujo-preview-btn';
      btnPreview.innerHTML = '▶ Previsualizar';
      btnPreview.addEventListener('click', openPreview);

      toolbar.appendChild(btnAddQ);
      toolbar.appendChild(btnAddR);
      toolbar.appendChild(btnPreview);
      wrap.appendChild(toolbar);

      /* Nodos */
      var nodesWrap = document.createElement('div');
      nodesWrap.className = 'flujo-editor-nodos';

      var ids = Object.keys(state.nodos);
      if (!ids.length) {
        var empty = document.createElement('div');
        empty.className = 'flujo-empty-state';
        empty.innerHTML = '🌱 Sin nodos aún.<br>Agrega una <strong>Pregunta</strong> para iniciar el algoritmo.';
        nodesWrap.appendChild(empty);
      } else {
        ids.forEach(function (id) { nodesWrap.appendChild(buildNodeCard(id)); });
      }
      wrap.appendChild(nodesWrap);
      containerEl.appendChild(wrap);

      /* Sync nodo_inicio select */
      refreshInicioSelect(inicioSel);
    }

    function refreshInicioSelect(sel) {
      var prev = sel.value || state.nodo_inicio;
      sel.innerHTML = '';
      var preguntaIds = Object.keys(state.nodos).filter(function (id) {
        return state.nodos[id].tipo === 'pregunta';
      });
      if (!preguntaIds.length) {
        var opt = document.createElement('option');
        opt.value = ''; opt.textContent = '— Sin preguntas aún —';
        sel.appendChild(opt);
      } else {
        preguntaIds.forEach(function (id) {
          var n = state.nodos[id];
          var opt = document.createElement('option');
          opt.value = id;
          opt.textContent = id + ': ' + (n.texto || '(sin texto)').substring(0, 50);
          if (id === prev) opt.selected = true;
          sel.appendChild(opt);
        });
      }
      /* Actualizar estado */
      state.nodo_inicio = sel.value || (preguntaIds[0] || '');
    }

    /* ── Tarjeta de nodo ──────────────────────────────────────────────── */
    function buildNodeCard(id) {
      var nodo = state.nodos[id];
      var esInicio = (id === state.nodo_inicio);

      var card = document.createElement('div');
      card.className = 'flujo-node-card' + (esInicio ? ' is-inicio' : '') + (nodo.tipo === 'resultado' ? ' is-resultado' : '');
      card.dataset.nodeId = id;

      /* Header */
      var header = document.createElement('div');
      header.className = 'flujo-node-header';

      var badge = document.createElement('span');
      badge.className = 'flujo-node-id-badge' + (esInicio ? ' badge-inicio' : '') + (nodo.tipo === 'resultado' ? ' badge-result' : '');
      badge.textContent = id;
      if (esInicio) badge.textContent += ' ★';

      var typeLabel = document.createElement('span');
      typeLabel.className = 'flujo-node-tipo-label';
      typeLabel.textContent = nodo.tipo === 'resultado' ? '🏁 Resultado final' : '❓ Pregunta';

      var delBtn = document.createElement('button');
      delBtn.className = 'flujo-node-del-btn';
      delBtn.innerHTML = '✕';
      delBtn.title = 'Eliminar nodo';
      delBtn.addEventListener('click', function () {
        if (!confirm('¿Eliminar el nodo "' + id + '"?\nLas opciones que apunten a este nodo quedarán sin destino.')) return;
        delete state.nodos[id];
        if (state.nodo_inicio === id) {
          var remaining = Object.keys(state.nodos).filter(function (k) { return state.nodos[k].tipo === 'pregunta'; });
          state.nodo_inicio = remaining[0] || '';
        }
        render();
      });

      header.appendChild(badge);
      header.appendChild(typeLabel);
      header.appendChild(delBtn);
      card.appendChild(header);

      /* Texto del nodo */
      var textoGroup = document.createElement('div');
      textoGroup.style.marginBottom = '14px';
      var textoLabel = document.createElement('div');
      textoLabel.className = 'flujo-field-label';
      textoLabel.textContent = nodo.tipo === 'resultado' ? 'Título del resultado' : 'Texto de la pregunta';
      var textoInput = document.createElement(nodo.tipo === 'resultado' ? 'input' : 'textarea');
      textoInput.className = 'flujo-input-full' + (nodo.tipo !== 'resultado' ? ' flujo-textarea-full' : '');
      textoInput.placeholder = nodo.tipo === 'resultado'
        ? 'Ej: Sospecha de síndrome coronario agudo'
        : 'Ej: ¿Presenta dolor torácico opresivo?';
      textoInput.value = nodo.texto;
      if (nodo.tipo !== 'resultado') textoInput.rows = 2;
      textoInput.addEventListener('input', function () { nodo.texto = textoInput.value; });
      textoGroup.appendChild(textoLabel);
      textoGroup.appendChild(textoInput);
      card.appendChild(textoGroup);

      if (nodo.tipo === 'resultado') {
        /* Conducta clínica */
        var condGroup = document.createElement('div');
        condGroup.style.marginBottom = '14px';
        var condLabel = document.createElement('div');
        condLabel.className = 'flujo-field-label';
        condLabel.textContent = 'Conducta / Recomendación clínica';
        var condTA = document.createElement('textarea');
        condTA.className = 'flujo-input-full flujo-textarea-full';
        condTA.rows = 3;
        condTA.placeholder = 'Ej: Activar código infarto. EKG inmediato. Evaluar trombolisis.';
        condTA.value = nodo.conducta || '';
        condTA.addEventListener('input', function () { nodo.conducta = condTA.value; });
        condGroup.appendChild(condLabel);
        condGroup.appendChild(condTA);
        card.appendChild(condGroup);

        /* Color */
        var colorGroup = document.createElement('div');
        colorGroup.style.display = 'flex'; colorGroup.style.alignItems = 'center'; colorGroup.style.gap = '12px';
        var colorLabel = document.createElement('div');
        colorLabel.className = 'flujo-field-label';
        colorLabel.textContent = 'Severidad / color';
        var colorSel = document.createElement('select');
        colorSel.className = 'flujo-input-full flujo-color-select';
        colorSel.style.cssText = 'width:auto;max-width:240px';
        COLORES_RESULTADO.forEach(function (c) {
          var o = document.createElement('option');
          o.value = c.v; o.textContent = c.l;
          if (c.v === (nodo.color || 'info')) o.selected = true;
          colorSel.appendChild(o);
        });
        colorSel.addEventListener('change', function () { nodo.color = colorSel.value; });
        colorGroup.appendChild(colorLabel);
        colorGroup.appendChild(colorSel);
        card.appendChild(colorGroup);

      } else {
        /* Opciones de respuesta */
        var optsSection = document.createElement('div');
        var optsLabel = document.createElement('div');
        optsLabel.className = 'flujo-field-label';
        optsLabel.textContent = 'Opciones de respuesta';
        optsSection.appendChild(optsLabel);

        /* Header columnas */
        var colHeader = document.createElement('div');
        colHeader.style.cssText = 'display:grid;grid-template-columns:1fr 1fr auto;gap:8px;margin-bottom:5px';
        colHeader.innerHTML = '<span style="font-size:.68rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px">Texto de opción</span>'
          + '<span style="font-size:.68rem;color:var(--text-muted);font-weight:600;text-transform:uppercase;letter-spacing:.5px">Ir a nodo</span>'
          + '<span></span>';
        optsSection.appendChild(colHeader);

        /* Lista de opciones */
        var optsListEl = document.createElement('div');
        nodo.opciones = nodo.opciones || [];
        nodo.opciones.forEach(function (opt, oi) {
          optsListEl.appendChild(buildOpcionRow(nodo, opt, oi, optsListEl));
        });
        optsSection.appendChild(optsListEl);

        /* Botón agregar opción */
        var addOptBtn = document.createElement('button');
        addOptBtn.className = 'flujo-add-opt-btn';
        addOptBtn.textContent = '+ Agregar opción';
        addOptBtn.addEventListener('click', function () {
          nodo.opciones.push({ texto: '', siguiente: '' });
          optsListEl.appendChild(buildOpcionRow(nodo, nodo.opciones[nodo.opciones.length - 1], nodo.opciones.length - 1, optsListEl));
        });
        optsSection.appendChild(addOptBtn);
        card.appendChild(optsSection);
      }

      return card;
    }

    /* ── Fila de una opción ───────────────────────────────────────────── */
    function buildOpcionRow(nodo, opt, oi, listEl) {
      var row = document.createElement('div');
      row.className = 'flujo-opcion-row';

      /* Texto opción */
      var txtIn = document.createElement('input');
      txtIn.type = 'text';
      txtIn.placeholder = 'Ej: Sí / No / A veces…';
      txtIn.value = opt.texto;
      txtIn.addEventListener('input', function () { opt.texto = txtIn.value; });

      /* Destino select */
      var destSel = document.createElement('select');
      buildDestinoOptions(destSel, opt.siguiente);
      destSel.addEventListener('change', function () { opt.siguiente = destSel.value; });

      /* Botón eliminar opción */
      var delBtn = document.createElement('button');
      delBtn.className = 'flujo-del-opt-btn';
      delBtn.title = 'Eliminar opción';
      delBtn.innerHTML = '✕';
      delBtn.addEventListener('click', function () {
        var idx = nodo.opciones.indexOf(opt);
        if (idx !== -1) nodo.opciones.splice(idx, 1);
        listEl.removeChild(row);
      });

      row.appendChild(txtIn);
      row.appendChild(destSel);
      row.appendChild(delBtn);
      return row;
    }

    /* ── Select de destino (todos los nodos excepto el propio) ─────────── */
    function buildDestinoOptions(sel, selected) {
      sel.innerHTML = '';
      var blank = document.createElement('option');
      blank.value = ''; blank.textContent = '— Seleccionar destino —';
      sel.appendChild(blank);

      var groups = { pregunta: 'Preguntas', resultado: 'Resultados finales' };
      Object.keys(groups).forEach(function (tipo) {
        var optGroup = document.createElement('optgroup');
        optGroup.label = groups[tipo];
        var ids = Object.keys(state.nodos).filter(function (k) { return state.nodos[k].tipo === tipo; });
        ids.forEach(function (k) {
          var n = state.nodos[k];
          var o = document.createElement('option');
          o.value = k;
          o.textContent = k + ': ' + (n.texto || '(sin texto)').substring(0, 40);
          if (k === selected) o.selected = true;
          optGroup.appendChild(o);
        });
        if (ids.length) sel.appendChild(optGroup);
      });
    }

    /* ── Helper botón ─────────────────────────────────────────────────── */
    function makeBtn(txt, cls, handler) {
      var btn = document.createElement('button');
      btn.className = 'btn ' + cls;
      btn.innerHTML = txt;
      btn.type = 'button';
      btn.addEventListener('click', handler);
      return btn;
    }

    /* ── Preview modal ────────────────────────────────────────────────── */
    function openPreview() {
      var data = getData();
      if (!data.nodo_inicio || !data.nodos[data.nodo_inicio]) {
        alert('⚠️ Define al menos un nodo de pregunta y configura el nodo inicial.');
        return;
      }
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:900;background:rgba(15,46,90,.35);backdrop-filter:blur(10px);display:flex;align-items:center;justify-content:center;padding:20px';
      var box = document.createElement('div');
      box.style.cssText = 'background:var(--glass-bg-heavy,rgba(255,255,255,.92));border:1.5px solid var(--glass-border);border-radius:var(--r-xl);width:100%;max-width:540px;max-height:85vh;overflow-y:auto;padding:28px;box-shadow:0 24px 60px rgba(15,46,90,.22)';
      var titleEl = document.createElement('div');
      titleEl.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:20px';
      titleEl.innerHTML = '<span style="font-family:\'Sora\',sans-serif;font-size:1rem;font-weight:700;color:var(--blue-900)">▶ Previsualización: ' + esc(data.titulo || 'Flujograma') + '</span>';
      var closeBtn = document.createElement('button');
      closeBtn.className = 'diag-close-btn';
      closeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="14" height="14"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      closeBtn.addEventListener('click', function () { document.body.removeChild(overlay); });
      titleEl.appendChild(closeBtn);
      box.appendChild(titleEl);
      var motorDiv = document.createElement('div');
      box.appendChild(motorDiv);
      overlay.appendChild(box);
      overlay.addEventListener('click', function (e) { if (e.target === overlay) document.body.removeChild(overlay); });
      document.body.appendChild(overlay);
      window.FLUJO_run(data, motorDiv);
    }

    /* ── API pública: obtener JSON del flujograma ─────────────────────── */
    function getData() {
      return {
        id:          state.id || '',
        titulo:      state.titulo,
        version:     1,
        nodo_inicio: state.nodo_inicio,
        nodos:       JSON.parse(JSON.stringify(state.nodos))
      };
    }

    /* Cargar el id si existe en initialData */
    if (initialData && initialData.id) state.id = initialData.id;

    render();
    return { getData: getData, refresh: render };
  };

})();
