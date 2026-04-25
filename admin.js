// ─── SICMED Admin (Light Theme) ───────────────────────────────────────────────
(function () {
  var adminWrap   = document.getElementById('adminWrap');
  var adminSearch = document.getElementById('adminSearch');
  var tbody       = document.getElementById('adminTbody');
  var tableCount  = document.getElementById('tableCount');
  var btnGuardar  = document.getElementById('btnGuardar');
  var btnLimpiar  = document.getElementById('btnLimpiar');
  var adminMsg    = document.getElementById('adminMsg');
  var espList     = document.getElementById('espList');

  function esc(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // ── Tabs ──────────────────────────────────────────────────────────────────
  document.querySelectorAll('.admin-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.admin-tab').forEach(function(t){ t.classList.remove('active'); });
      tab.classList.add('active');
      var t = tab.dataset.tab;
      document.getElementById('tabNuevo').style.display   = t === 'nuevo'    ? '' : 'none';
      document.getElementById('tabLista').style.display   = t === 'lista'    ? '' : 'none';
      document.getElementById('tabAcciones').style.display= t === 'acciones' ? '' : 'none';
      if (t === 'lista') renderTable('');
    });
  });

  // Populate especialidad datalist
  if (espList && window.ESPECIALIDADES) {
    window.ESPECIALIDADES.forEach(function(e) {
      var opt = document.createElement('option'); opt.value = e.nombre; espList.appendChild(opt);
    });
  }

  // ── Save new/edit ─────────────────────────────────────────────────────────
  var editingCie10 = null;

  if (btnGuardar) {
    btnGuardar.addEventListener('click', function() {
      var cie10 = document.getElementById('fCie10').value.trim();
      var nombre= document.getElementById('fNombre').value.trim();
      var esp   = document.getElementById('fEspecialidad').value.trim();
      var prio  = document.getElementById('fPrioridad').value;
      if (!cie10 || !nombre || !esp || !prio) {
        showMsg('⚠️ Por favor completa los campos obligatorios (*).', 'error');
        return;
      }
      var entrada = {
        cie10: cie10, nombre: nombre, especialidad: esp, prioridad: prio,
        destino:   document.getElementById('fDestino').value.trim(),
        criterios: document.getElementById('fCriterios').value.trim(),
        examenes:  document.getElementById('fExamenes').value.trim(),
        notas:     document.getElementById('fNotas').value.trim(),
        sinonimos: document.getElementById('fSinonimos').value.split(',').map(function(s){return s.trim();}).filter(Boolean)
      };
      var accion = editingCie10 ? 'EDITADO' : 'CREADO';
      window.STORE_save(entrada, accion).then ? 
        window.STORE_save(entrada, accion).then(function(){ showMsg('✓ Diagnóstico guardado correctamente.', 'success'); limpiar(); editingCie10 = null; }) : 
        (window.STORE_save(entrada, accion), showMsg('✓ Diagnóstico guardado.', 'success'), limpiar(), editingCie10 = null);
    });
  }

  if (btnLimpiar) btnLimpiar.addEventListener('click', function(){ limpiar(); editingCie10 = null; });

  function limpiar() {
    ['fCie10','fNombre','fEspecialidad','fPrioridad','fDestino','fCriterios','fExamenes','fSinonimos','fNotas']
      .forEach(function(id){ var el = document.getElementById(id); if(el) el.value = ''; });
    if (btnGuardar) btnGuardar.textContent = '💾 Guardar diagnóstico';
  }

  function showMsg(txt, type) {
    if (!adminMsg) return;
    adminMsg.style.display = 'block';
    adminMsg.style.color   = type === 'error' ? 'var(--p0-text)' : 'var(--ges-text)';
    adminMsg.style.background = type === 'error' ? 'var(--p0-bg)' : 'var(--ges-bg)';
    adminMsg.style.padding = '10px 14px'; adminMsg.style.borderRadius = 'var(--r-sm)';
    adminMsg.textContent = txt;
    setTimeout(function(){ adminMsg.style.display='none'; }, 3000);
  }

  // ── Table ─────────────────────────────────────────────────────────────────
  function renderTable(query) {
    if (!tbody) return;
    var data = query
      ? window.DB.filter(function(d){ var q=query.toLowerCase(); return d.cie10.toLowerCase().includes(q)||d.nombre.toLowerCase().includes(q)||d.especialidad.toLowerCase().includes(q); })
      : window.DB;
    if (tableCount) tableCount.textContent = data.length + ' diagnósticos';
    tbody.innerHTML = '';
    data.forEach(function(d) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><span style="font-family:\'Sora\',sans-serif;font-weight:700;color:var(--blue-700)">' + esc(d.cie10) + '</span></td>' +
        '<td>' + esc(d.nombre) + '</td>' +
        '<td style="color:var(--text-muted)">' + esc(d.especialidad) + '</td>' +
        '<td><span class="badge-urgencia ' + d.prioridad + '">' + esc(d.prioridad) + '</span></td>' +
        '<td><div class="tbl-actions">' +
          '<button class="tbl-btn edit" data-cie="' + esc(d.cie10) + '">✏️ Editar</button>' +
          '<button class="tbl-btn del"  data-cie="' + esc(d.cie10) + '">🗑 Borrar</button>' +
        '</div></td>';
      tbody.appendChild(tr);
    });
    // Edit/delete handlers
    tbody.querySelectorAll('.tbl-btn.edit').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var d = window.DB.find(function(x){ return x.cie10 === btn.dataset.cie; });
        if (!d) return;
        document.getElementById('fCie10').value       = d.cie10;
        document.getElementById('fNombre').value      = d.nombre;
        document.getElementById('fEspecialidad').value= d.especialidad;
        document.getElementById('fPrioridad').value   = d.prioridad;
        document.getElementById('fDestino').value     = d.destino || '';
        document.getElementById('fCriterios').value   = d.criterios || '';
        document.getElementById('fExamenes').value    = d.examenes || '';
        document.getElementById('fSinonimos').value   = (d.sinonimos || []).join(', ');
        document.getElementById('fNotas').value       = d.notas || '';
        editingCie10 = d.cie10;
        if (btnGuardar) btnGuardar.textContent = '💾 Actualizar diagnóstico';
        document.querySelector('[data-tab="nuevo"]').click();
      });
    });
    tbody.querySelectorAll('.tbl-btn.del').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var d = window.DB.find(function(x){ return x.cie10 === btn.dataset.cie; });
        if (!d || !confirm('¿Eliminar "' + d.nombre + '"?')) return;
        window.STORE_delete(d.cie10);
        renderTable(adminSearch ? adminSearch.value.trim() : '');
      });
    });
  }

  if (adminSearch) {
    adminSearch.addEventListener('input', function() { renderTable(adminSearch.value.trim()); });
  }
})();
