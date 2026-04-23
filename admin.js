// ─── SICMED Admin ─────────────────────────────────────────────────────────────
(function () {

  var CREDENTIALS = { user: 'admin', pass: 'sicmed2026' };

  /* ── DOM ── */
  var hamburger   = document.getElementById('hamburger');
  var navList     = document.getElementById('navList');
  var loginWrap   = document.getElementById('loginWrap');
  var adminWrap   = document.getElementById('adminWrap');
  var loginUser   = document.getElementById('loginUser');
  var loginPass   = document.getElementById('loginPass');
  var loginError  = document.getElementById('loginError');
  var btnLogin    = document.getElementById('btnLogin');
  var btnLogout   = document.getElementById('btnLogout');
  var btnResetDB  = document.getElementById('btnResetDB');
  var diagCount   = document.getElementById('diagCount');
  var espCount    = document.getElementById('espCount');
  var adminSearch = document.getElementById('adminSearch');
  var tbody       = document.getElementById('adminTbody');
  var espTbody    = document.getElementById('espTbody');
  var btnNew      = document.getElementById('btnNew');
  var btnNewEsp   = document.getElementById('btnNewEsp');
  /* modal diagnóstico */
  var modalBg     = document.getElementById('modalBg');
  var modalClose  = document.getElementById('modalClose');
  var modalCancel = document.getElementById('modalCancel');
  var modalSave   = document.getElementById('modalSave');
  var modalTitle  = document.getElementById('modalTitleText');
  /* modal especialidad */
  var modalEspBg     = document.getElementById('modalEspBg');
  var modalEspClose  = document.getElementById('modalEspClose');
  var modalEspCancel = document.getElementById('modalEspCancel');
  var modalEspSave   = document.getElementById('modalEspSave');
  var modalEspTitle  = document.getElementById('modalEspTitle');
  var mEspIcon       = document.getElementById('mEspIcon');
  var mEspNombre     = document.getElementById('mEspNombre');
  var mEspDesc       = document.getElementById('mEspDesc');
  var emojiPreview   = document.getElementById('emojiPreview');
  var emojiPalette   = document.getElementById('emojiPalette');

  var editingCie10  = null;
  var editingEspNombre = null;

  /* ── Hamburger ── */
  if (hamburger && navList)
    hamburger.addEventListener('click', function () { navList.classList.toggle('open'); });

  /* ────────────────────────────────────────────────────────────────────────
     TABS
  ──────────────────────────────────────────────────────────────────────── */
  document.getElementById('adminTabs').querySelectorAll('.admin-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.admin-tab').forEach(function(t){ t.classList.remove('active'); });
      document.querySelectorAll('.admin-tab-content').forEach(function(c){ c.style.display='none'; });
      tab.classList.add('active');
      document.getElementById('tab' + capitalize(tab.dataset.tab)).style.display = 'block';
    });
  });
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  /* ────────────────────────────────────────────────────────────────────────
     LOGIN
  ──────────────────────────────────────────────────────────────────────── */
  function doLogin() {
    if (loginUser.value.trim() === CREDENTIALS.user && loginPass.value === CREDENTIALS.pass) {
      loginWrap.style.display = 'none';
      adminWrap.style.display = 'block';
      loginError.textContent  = '';
      renderTable(window.DB);
      renderEspTable();
      poblarSelectEsp();
    } else {
      loginError.textContent = 'Usuario o código incorrecto.';
      loginPass.value = ''; loginPass.focus();
    }
  }
  btnLogin.addEventListener('click', doLogin);
  loginPass.addEventListener('keydown', function(e){ if(e.key==='Enter') doLogin(); });
  loginUser.addEventListener('keydown', function(e){ if(e.key==='Enter') loginPass.focus(); });
  btnLogout.addEventListener('click', function() {
    adminWrap.style.display='none'; loginWrap.style.display='flex';
    loginUser.value=''; loginPass.value='';
  });

  btnResetDB.addEventListener('click', function() { window.STORE_reset(); });

  /* ────────────────────────────────────────────────────────────────────────
     TABLA DIAGNÓSTICOS
  ──────────────────────────────────────────────────────────────────────── */
  var PRIOR_COLOR = { P0:'#EF5350', P1:'#FFA726', P2:'#42A5F5', GES:'#66BB6A' };

  function renderTable(data) {
    tbody.innerHTML = '';
    diagCount.textContent = window.DB.length;
    data.forEach(function(d) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td class="td-cie">'    + esc(d.cie10)       + '</td>' +
        '<td class="td-nombre">' + esc(d.nombre)      + '</td>' +
        '<td>'                   + esc(d.especialidad) + '</td>' +
        '<td>'                   + esc(d.destino)      + '</td>' +
        '<td><span style="font-weight:700;color:' + (PRIOR_COLOR[d.prioridad]||'#fff') + '">' + esc(d.prioridad) + '</span></td>' +
        '<td class="td-actions">' +
          '<button class="btn-edit" data-cie="' + esc(d.cie10) + '">✏️ Editar</button>' +
          '<button class="btn-del"  data-cie="' + esc(d.cie10) + '">🗑 Eliminar</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
    tbody.querySelectorAll('.btn-edit').forEach(function(b){
      b.addEventListener('click', function(){ openEdit(b.dataset.cie); });
    });
    tbody.querySelectorAll('.btn-del').forEach(function(b){
      b.addEventListener('click', function(){ confirmarEliminar(b.dataset.cie); });
    });
  }

  adminSearch.addEventListener('input', function() {
    var q = adminSearch.value.trim().toLowerCase();
    renderTable(q ? window.DB.filter(function(d){
      return d.cie10.toLowerCase().includes(q) ||
             d.nombre.toLowerCase().includes(q) ||
             d.especialidad.toLowerCase().includes(q);
    }) : window.DB);
  });

  /* ────────────────────────────────────────────────────────────────────────
     TABLA ESPECIALIDADES
  ──────────────────────────────────────────────────────────────────────── */
  function renderEspTable() {
    espTbody.innerHTML = '';
    espCount.textContent = window.ESPECIALIDADES.length;
    window.ESPECIALIDADES.forEach(function(e) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td style="font-size:1.5rem;text-align:center">' + (e.icon||'🏥') + '</td>' +
        '<td class="td-nombre">' + esc(e.nombre) + '</td>' +
        '<td style="font-size:.85rem;color:rgba(255,255,255,.5)">' + esc(e.desc||'') + '</td>' +
        '<td class="td-actions">' +
          '<button class="btn-edit" data-esp="' + esc(e.nombre) + '">✏️ Editar</button>' +
          '<button class="btn-del"  data-esp="' + esc(e.nombre) + '">🗑 Eliminar</button>' +
        '</td>';
      espTbody.appendChild(tr);
    });
    espTbody.querySelectorAll('.btn-edit').forEach(function(b){
      b.addEventListener('click', function(){ openEspEdit(b.dataset.esp); });
    });
    espTbody.querySelectorAll('.btn-del').forEach(function(b){
      b.addEventListener('click', function(){ confirmarEliminarEsp(b.dataset.esp); });
    });
  }

  /* ────────────────────────────────────────────────────────────────────────
     POBLAR SELECT ESPECIALIDAD en modal de diagnóstico
  ──────────────────────────────────────────────────────────────────────── */
  function poblarSelectEsp() {
    var sel = document.getElementById('mEspecialidad');
    sel.innerHTML = '';
    window.ESPECIALIDADES.forEach(function(e) {
      var opt = document.createElement('option');
      opt.value = e.nombre;
      opt.textContent = (e.icon ? e.icon + ' ' : '') + e.nombre;
      sel.appendChild(opt);
    });
  }

  /* ────────────────────────────────────────────────────────────────────────
     MODAL DIAGNÓSTICO
  ──────────────────────────────────────────────────────────────────────── */
  function abrirModal()  { modalBg.classList.add('open');    document.body.style.overflow='hidden'; }
  function cerrarModal() { modalBg.classList.remove('open'); document.body.style.overflow=''; editingCie10=null; }
  modalClose.addEventListener('click', cerrarModal);
  modalCancel.addEventListener('click', cerrarModal);
  modalBg.addEventListener('click', function(e){ if(e.target===modalBg) cerrarModal(); });

  function limpiarFormDiag() {
    ['mCie10','mNombre','mSinonimos','mCriterios','mExamenes','mNotas'].forEach(function(id){
      document.getElementById(id).value='';
    });
    document.getElementById('mPrioridad').value='P2';
    document.getElementById('mDestino').value='';
    if (window.ESPECIALIDADES.length) document.getElementById('mEspecialidad').value = window.ESPECIALIDADES[0].nombre;
  }

  btnNew.addEventListener('click', function(){
    editingCie10=null;
    modalTitle.textContent='Nuevo diagnóstico';
    limpiarFormDiag();
    abrirModal();
  });

  function openEdit(cie10) {
    var d = window.DB.find(function(x){ return x.cie10===cie10; });
    if (!d) return;
    editingCie10 = cie10;
    modalTitle.textContent = 'Editando: ' + d.cie10;
    document.getElementById('mCie10').value        = d.cie10;
    document.getElementById('mNombre').value       = d.nombre;
    document.getElementById('mSinonimos').value    = (d.sinonimos||[]).join(', ');
    document.getElementById('mEspecialidad').value = d.especialidad;
    document.getElementById('mDestino').value      = d.destino;
    document.getElementById('mPrioridad').value    = d.prioridad;
    document.getElementById('mCriterios').value    = d.criterios||'';
    document.getElementById('mExamenes').value     = d.examenes||'';
    document.getElementById('mNotas').value        = d.notas||'';
    abrirModal();
  }

  function confirmarEliminar(cie10) {
    var d = window.DB.find(function(x){ return x.cie10===cie10; });
    if (!d) return;
    if (confirm('¿Eliminar "' + d.nombre + '" (' + d.cie10 + ')?')) {
      window.STORE_delete(cie10).then(function(){
        mostrarToast('🗑 Diagnóstico eliminado', '#EF5350');
        refrescarTabla();
      });
    }
  }

  modalSave.addEventListener('click', function(){
    var cie10        = document.getElementById('mCie10').value.trim();
    var nombre       = document.getElementById('mNombre').value.trim();
    var especialidad = document.getElementById('mEspecialidad').value;
    var destino      = document.getElementById('mDestino').value.trim();
    var prioridad    = document.getElementById('mPrioridad').value;
    if (!cie10||!nombre||!especialidad||!destino) { alert('Completa los campos obligatorios (*).'); return; }
    var entry = {
      cie10, nombre,
      sinonimos: document.getElementById('mSinonimos').value.split(',').map(function(s){ return s.trim(); }).filter(Boolean),
      especialidad, destino, prioridad,
      criterios: document.getElementById('mCriterios').value.trim(),
      examenes:  document.getElementById('mExamenes').value.trim(),
      notas:     document.getElementById('mNotas').value.trim()
    };
    var accion;
    if (editingCie10) {
      var idx = window.DB.findIndex(function(d){ return d.cie10===editingCie10; });
      if (idx!==-1) { window.DB[idx]=entry; accion='EDITADO'; }
    } else {
      if (window.DB.find(function(d){ return d.cie10===cie10; })) {
        alert('El código CIE-10 "' + cie10 + '" ya existe.'); return;
      }
      window.DB.push(entry); accion='NUEVO';
    }
    window.STORE_save(accion, entry).then(function(){
      mostrarToast(accion==='NUEVO' ? '✅ Diagnóstico agregado' : '✅ Diagnóstico actualizado', '#66BB6A');
      refrescarTabla();
      cerrarModal();
    });
  });

  /* ────────────────────────────────────────────────────────────────────────
     EMOJI PICKER
  ──────────────────────────────────────────────────────────────────────── */
  var EMOJIS_MEDICOS = [
    '🏥','🩺','🔬','🧬','💊','💉','🩻','🩹','❤️','🫀','🫁','🧠',
    '🦷','👁','🦴','🦷','🩸','🧪','⚕','🌡','🩹','🧫','🔭','⚖',
    '🫘','🫁','🤍','🩶','💛','🩵','🟢','🔵','🟣','🔴','🟠',
    '⚡','🌿','🏃','💪','🧘','🤰','👶','🧒','🧓','👨‍⚕️','👩‍⚕️',
    '🦷','🦻','👃','👅','🫂','🧬','🔮','🧲','⚗','🧯','🚑'
  ];

  EMOJIS_MEDICOS.forEach(function(emoji) {
    var btn = document.createElement('button');
    btn.textContent = emoji;
    btn.style.cssText = 'font-size:1.4rem;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);' +
      'border-radius:8px;width:38px;height:38px;cursor:pointer;transition:.15s;display:flex;align-items:center;' +
      'justify-content:center;';
    btn.addEventListener('mouseenter', function(){ btn.style.background='rgba(79,195,247,.2)'; });
    btn.addEventListener('mouseleave', function(){ btn.style.background='rgba(255,255,255,.06)'; });
    btn.addEventListener('click', function(){
      mEspIcon.value = emoji;
      emojiPreview.textContent = emoji;
    });
    emojiPalette.appendChild(btn);
  });

  mEspIcon.addEventListener('input', function(){
    if (mEspIcon.value.trim()) emojiPreview.textContent = mEspIcon.value.trim();
  });
  emojiPreview.addEventListener('click', function(){ mEspIcon.focus(); });

  /* ────────────────────────────────────────────────────────────────────────
     MODAL ESPECIALIDAD
  ──────────────────────────────────────────────────────────────────────── */
  function abrirModalEsp()  { modalEspBg.classList.add('open');    document.body.style.overflow='hidden'; }
  function cerrarModalEsp() { modalEspBg.classList.remove('open'); document.body.style.overflow=''; editingEspNombre=null; }
  modalEspClose.addEventListener('click',  cerrarModalEsp);
  modalEspCancel.addEventListener('click', cerrarModalEsp);
  modalEspBg.addEventListener('click', function(e){ if(e.target===modalEspBg) cerrarModalEsp(); });

  function limpiarFormEsp() {
    mEspNombre.value = '';
    mEspDesc.value   = '';
    mEspIcon.value   = '';
    emojiPreview.textContent = '🏥';
  }

  btnNewEsp.addEventListener('click', function(){
    editingEspNombre = null;
    modalEspTitle.textContent = 'Nueva especialidad';
    limpiarFormEsp();
    abrirModalEsp();
  });

  function openEspEdit(nombre) {
    var e = window.ESPECIALIDADES.find(function(x){ return x.nombre===nombre; });
    if (!e) return;
    editingEspNombre = nombre;
    modalEspTitle.textContent = 'Editando: ' + nombre;
    mEspNombre.value = e.nombre;
    mEspDesc.value   = e.desc||'';
    mEspIcon.value   = e.icon||'';
    emojiPreview.textContent = e.icon||'🏥';
    abrirModalEsp();
  }

  function confirmarEliminarEsp(nombre) {
    // Verificar si tiene diagnósticos asociados
    var asociados = window.DB.filter(function(d){ return d.especialidad===nombre; }).length;
    var msg = '¿Eliminar la especialidad "' + nombre + '"?';
    if (asociados > 0) msg += '\n\n⚠️ Tiene ' + asociados + ' diagnóstico(s) asociado(s). Estos quedarán sin especialidad visible.';
    if (confirm(msg)) {
      window.ESP_delete(nombre).then(function(){
        mostrarToast('🗑 Especialidad eliminada', '#EF5350');
        renderEspTable();
        poblarSelectEsp();
      });
    }
  }

  modalEspSave.addEventListener('click', function(){
    var nombre = mEspNombre.value.trim();
    var icon   = mEspIcon.value.trim() || '🏥';
    var desc   = mEspDesc.value.trim();
    if (!nombre) { alert('El nombre de la especialidad es obligatorio.'); return; }

    // Si está editando y cambió el nombre, advertir
    if (editingEspNombre && editingEspNombre !== nombre) {
      if (!confirm('Cambiaste el nombre de "' + editingEspNombre + '" a "' + nombre + '".\n' +
          'Los diagnósticos asociados al nombre anterior NO se actualizarán automáticamente.\n\n¿Continuar?')) return;
      // Eliminar el anterior y crear nuevo
      window.ESP_delete(editingEspNombre);
    }

    var esp = { nombre: nombre, icon: icon, desc: desc };
    window.ESP_save(esp).then(function(){
      mostrarToast('✅ Especialidad guardada', '#66BB6A');
      renderEspTable();
      poblarSelectEsp();
      cerrarModalEsp();
    }).catch(function(err){
      alert('Error guardando especialidad: ' + err.message);
    });
  });

  /* ────────────────────────────────────────────────────────────────────────
     TOAST
  ──────────────────────────────────────────────────────────────────────── */
  function mostrarToast(mensaje, color) {
    var t = document.createElement('div');
    t.textContent = mensaje;
    t.style.cssText =
      'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);' +
      'background:' + color + ';color:#fff;padding:12px 24px;border-radius:30px;' +
      'font-family:Nunito,sans-serif;font-weight:700;font-size:.95rem;' +
      'box-shadow:0 4px 20px rgba(0,0,0,.4);z-index:9999;opacity:0;transition:all .3s;pointer-events:none;';
    document.body.appendChild(t);
    requestAnimationFrame(function(){
      t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)';
    });
    setTimeout(function(){
      t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)';
      setTimeout(function(){ document.body.removeChild(t); }, 350);
    }, 2800);
  }

  /* ── Helpers ── */
  function refrescarTabla() {
    var q = adminSearch.value.trim().toLowerCase();
    renderTable(q ? window.DB.filter(function(d){
      return d.cie10.toLowerCase().includes(q) ||
             d.nombre.toLowerCase().includes(q) ||
             d.especialidad.toLowerCase().includes(q);
    }) : window.DB);
  }
  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* Cerrar modales con Escape */
  document.addEventListener('keydown', function(e){
    if (e.key==='Escape') { cerrarModal(); cerrarModalEsp(); }
  });

})();
