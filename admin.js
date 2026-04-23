// ─── DERIVMED Admin ───────────────────────────────────────────────────────────
(function () {

  var CREDENTIALS = { user: 'admin', pass: 'sicmed2026' };

  /* DOM */
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
  var adminSearch = document.getElementById('adminSearch');
  var tbody       = document.getElementById('adminTbody');
  var btnNew      = document.getElementById('btnNew');
  var modalBg     = document.getElementById('modalBg');
  var modalClose  = document.getElementById('modalClose');
  var modalCancel = document.getElementById('modalCancel');
  var modalSave   = document.getElementById('modalSave');
  var modalTitle  = document.getElementById('modalTitleText');

  var editingCie10 = null;

  /* Hamburger */
  if (hamburger && navList) {
    hamburger.addEventListener('click', function () { navList.classList.toggle('open'); });
  }

  /* ── LOGIN ──────────────────────────────────────────────────────────────── */
  function doLogin() {
    if (loginUser.value.trim() === CREDENTIALS.user && loginPass.value === CREDENTIALS.pass) {
      loginWrap.style.display = 'none';
      adminWrap.style.display = 'block';
      loginError.textContent  = '';
      renderTable(DB);
    } else {
      loginError.textContent = 'Usuario o código incorrecto.';
      loginPass.value = '';
      loginPass.focus();
    }
  }
  btnLogin.addEventListener('click', doLogin);
  loginPass.addEventListener('keydown', function (e) { if (e.key === 'Enter') doLogin(); });
  loginUser.addEventListener('keydown', function (e) { if (e.key === 'Enter') loginPass.focus(); });
  btnLogout.addEventListener('click', function () {
    adminWrap.style.display = 'none';
    loginWrap.style.display = 'flex';
    loginUser.value = ''; loginPass.value = '';
  });

  /* ── RESET BD ────────────────────────────────────────────────────────────── */
  btnResetDB.addEventListener('click', function () {
    if (confirm('¿Resetear la base de datos a los valores originales del protocolo SSMOCC?\n\nEsto eliminará TODOS los cambios locales y el historial de actualizaciones.')) {
      STORE_reset();
      location.reload();
    }
  });

  /* ── TABLA ───────────────────────────────────────────────────────────────── */
  var PRIOR_COLOR = { P0:'#EF5350', P1:'#FFA726', P2:'#42A5F5', GES:'#66BB6A' };

  function renderTable(data) {
    tbody.innerHTML   = '';
    diagCount.textContent = DB.length;
    data.forEach(function (d) {
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
    tbody.querySelectorAll('.btn-edit').forEach(function (b) {
      b.addEventListener('click', function () { openEdit(b.dataset.cie); });
    });
    tbody.querySelectorAll('.btn-del').forEach(function (b) {
      b.addEventListener('click', function () { confirmarEliminar(b.dataset.cie); });
    });
  }

  adminSearch.addEventListener('input', function () {
    var q = adminSearch.value.trim().toLowerCase();
    renderTable(q ? DB.filter(function (d) {
      return d.cie10.toLowerCase().includes(q) ||
             d.nombre.toLowerCase().includes(q) ||
             d.especialidad.toLowerCase().includes(q);
    }) : DB);
  });

  /* ── MODAL ───────────────────────────────────────────────────────────────── */
  function abrirModal()  { modalBg.classList.add('open');    document.body.style.overflow = 'hidden'; }
  function cerrarModal() { modalBg.classList.remove('open'); document.body.style.overflow = ''; editingCie10 = null; }
  modalClose.addEventListener('click', cerrarModal);
  modalCancel.addEventListener('click', cerrarModal);
  modalBg.addEventListener('click', function (e) { if (e.target === modalBg) cerrarModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') cerrarModal(); });

  function limpiarForm() {
    ['mCie10','mNombre','mSinonimos','mCriterios','mExamenes','mNotas'].forEach(function (id) {
      document.getElementById(id).value = '';
    });
    document.getElementById('mPrioridad').value    = 'P2';
    document.getElementById('mEspecialidad').value = 'Endocrinología';
    document.getElementById('mDestino').value      = '';
  }

  btnNew.addEventListener('click', function () {
    editingCie10 = null;
    modalTitle.textContent = 'Nuevo diagnóstico';
    limpiarForm();
    abrirModal();
  });

  function openEdit(cie10) {
    var d = DB.find(function (x) { return x.cie10 === cie10; });
    if (!d) return;
    editingCie10 = cie10;
    modalTitle.textContent = 'Editando: ' + d.cie10;
    document.getElementById('mCie10').value        = d.cie10;
    document.getElementById('mNombre').value       = d.nombre;
    document.getElementById('mSinonimos').value    = (d.sinonimos || []).join(', ');
    document.getElementById('mEspecialidad').value = d.especialidad;
    document.getElementById('mDestino').value      = d.destino;
    document.getElementById('mPrioridad').value    = d.prioridad;
    document.getElementById('mCriterios').value    = d.criterios  || '';
    document.getElementById('mExamenes').value     = d.examenes   || '';
    document.getElementById('mNotas').value        = d.notas      || '';
    abrirModal();
  }

  function confirmarEliminar(cie10) {
    var d = DB.find(function (x) { return x.cie10 === cie10; });
    if (!d) return;
    if (confirm('¿Eliminar "' + d.nombre + '" (' + d.cie10 + ')?')) {
      var copia = { cie10: d.cie10, nombre: d.nombre, especialidad: d.especialidad, prioridad: d.prioridad };
      var idx   = DB.findIndex(function (x) { return x.cie10 === cie10; });
      if (idx !== -1) DB.splice(idx, 1);
      STORE_save('ELIMINADO', copia);           // ← guarda en localStorage + log
      mostrarToast('🗑 Diagnóstico eliminado', '#EF5350');
      refrescarTabla();
    }
  }

  /* ── GUARDAR MODAL ───────────────────────────────────────────────────────── */
  modalSave.addEventListener('click', function () {
    var cie10        = document.getElementById('mCie10').value.trim();
    var nombre       = document.getElementById('mNombre').value.trim();
    var especialidad = document.getElementById('mEspecialidad').value;
    var destino      = document.getElementById('mDestino').value.trim();
    var prioridad    = document.getElementById('mPrioridad').value;
    if (!cie10 || !nombre || !especialidad || !destino) {
      alert('Completa los campos obligatorios (*).');
      return;
    }
    var entry = {
      cie10:        cie10,
      nombre:       nombre,
      sinonimos:    document.getElementById('mSinonimos').value.split(',').map(function (s) { return s.trim(); }).filter(Boolean),
      especialidad: especialidad,
      destino:      destino,
      prioridad:    prioridad,
      criterios:    document.getElementById('mCriterios').value.trim(),
      examenes:     document.getElementById('mExamenes').value.trim(),
      notas:        document.getElementById('mNotas').value.trim()
    };

    var accion;
    if (editingCie10) {
      var idx = DB.findIndex(function (d) { return d.cie10 === editingCie10; });
      if (idx !== -1) { DB[idx] = entry; accion = 'EDITADO'; }
    } else {
      if (DB.find(function (d) { return d.cie10 === cie10; })) {
        alert('El código CIE-10 "' + cie10 + '" ya existe. Usa un código único.');
        return;
      }
      DB.push(entry);
      accion = 'NUEVO';
    }

    STORE_save(accion, entry);                // ← guarda en localStorage + log
    mostrarToast(accion === 'NUEVO' ? '✅ Diagnóstico agregado' : '✅ Diagnóstico actualizado', '#66BB6A');
    refrescarTabla();
    cerrarModal();
  });

  /* ── TOAST ───────────────────────────────────────────────────────────────── */
  function mostrarToast(mensaje, color) {
    var t = document.createElement('div');
    t.textContent = mensaje;
    t.style.cssText =
      'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);' +
      'background:' + color + ';color:#fff;padding:12px 24px;border-radius:30px;' +
      'font-family:Nunito,sans-serif;font-weight:700;font-size:.95rem;' +
      'box-shadow:0 4px 20px rgba(0,0,0,.4);z-index:9999;' +
      'opacity:0;transition:all .3s;pointer-events:none;';
    document.body.appendChild(t);
    requestAnimationFrame(function () {
      t.style.opacity    = '1';
      t.style.transform  = 'translateX(-50%) translateY(0)';
    });
    setTimeout(function () {
      t.style.opacity   = '0';
      t.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(function () { document.body.removeChild(t); }, 350);
    }, 2800);
  }

  /* ── Helpers ─────────────────────────────────────────────────────────────── */
  function refrescarTabla() {
    var q = adminSearch.value.trim().toLowerCase();
    renderTable(q ? DB.filter(function (d) {
      return d.cie10.toLowerCase().includes(q) ||
             d.nombre.toLowerCase().includes(q) ||
             d.especialidad.toLowerCase().includes(q);
    }) : DB);
  }

  function esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();
