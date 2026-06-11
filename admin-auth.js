// ═══════════════════════════════════════════════════════════════════════════
// SICMED – Autenticación Google para Admin
// Archivo: admin-auth.js  (cargado como type="module" desde admin.html)
// ═══════════════════════════════════════════════════════════════════════════

import { initializeApp, getApps, getApp }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth, GoogleAuthProvider,
         signInWithPopup, signInWithRedirect,
         getRedirectResult, onAuthStateChanged, signOut }
  from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// ── Config Firebase (misma que db.js) ────────────────────────────────────
const FIREBASE_CONFIG = {
  apiKey:            'AIzaSyAbT9L872CeyMcIuwHtK5UjyA3jJKAF8i0',
  authDomain:        'derivmed.firebaseapp.com',
  projectId:         'derivmed',
  storageBucket:     'derivmed.firebasestorage.app',
  messagingSenderId: '742083987090',
  appId:             '1:742083987090:web:9c9c32ca82a82cd882484b'
};

const ADMIN_UID = 'aAntB5dTtkUZSbGsN8ibrAkF0JG2';

// Reusar app si db.js ya la inicializó
const app      = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
const auth     = getAuth(app);
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

// ── Helpers UI (también en window para admin.js legacy) ──────────────────
function showAdmin() {
  document.getElementById('loginWrap').style.display  = 'none';
  document.getElementById('adminPanel').style.display = 'block';
}
function showLogin() {
  document.getElementById('loginWrap').style.display  = '';
  document.getElementById('adminPanel').style.display = 'none';
  clearError();
}
function showError(msg) {
  const el = document.getElementById('loginErr');
  if (!el) return;
  el.textContent   = msg;
  el.style.display = 'block';
}
function clearError() {
  const el = document.getElementById('loginErr');
  if (el) el.style.display = 'none';
}
function setBtn(loading) {
  const btn = document.getElementById('loginBtn');
  if (!btn) return;
  btn.disabled      = loading;
  btn.style.opacity = loading ? '0.7' : '';
  const span = btn.querySelector('span');
  if (!span) return;
  if (loading) {
    span.textContent = 'Conectando…';
  } else {
    span.innerHTML =
      '<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">' +
      '<path fill="#fff" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>' +
      '<path fill="#fff" opacity=".9" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>' +
      '<path fill="#fff" opacity=".75" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>' +
      '<path fill="#fff" opacity=".6" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>' +
      '</svg>Ingresar con Google';
  }
}

// ── Procesar resultado de redirect (volvemos desde google.com) ───────────
try {
  const rr = await getRedirectResult(auth);
  void rr; // onAuthStateChanged lo maneja
} catch (e) {
  const ignorable = ['auth/null-user', 'auth/no-current-user'];
  if (e.code && !ignorable.includes(e.code)) {
    showError('Error al volver de Google: ' + (e.code || e.message));
  }
}

// ── Listener de sesión ───────────────────────────────────────────────────
onAuthStateChanged(auth, (user) => {
  if (user && user.uid === ADMIN_UID) {
    showAdmin();
  } else {
    if (user && user.uid !== ADMIN_UID) {
      showError('Cuenta no autorizada: ' + (user.email || user.uid));
      signOut(auth);
    }
    showLogin();
  }
  setBtn(false);
});

// ── Función de login expuesta globalmente ────────────────────────────────
window._adminSignIn = async function () {
  setBtn(true);
  clearError();

  const POPUP_FALLBACK = [
    'auth/popup-blocked',
    'auth/popup-closed-by-user',
    'auth/cancelled-popup-request',
    'auth/operation-not-supported-in-this-environment',
    'auth/web-storage-unsupported'
  ];

  try {
    await signInWithPopup(auth, provider);
    // onAuthStateChanged llama showAdmin automáticamente
  } catch (err) {
    if (POPUP_FALLBACK.includes(err.code)) {
      // Popup bloqueado → redirigir a Google
      try {
        await signInWithRedirect(auth, provider);
        // La página se recargará — nada más aquí
      } catch (e2) {
        showError('Error: ' + (e2.code || e2.message));
        setBtn(false);
      }
    } else if (err.code === 'auth/user-cancelled') {
      setBtn(false); // usuario canceló — sin error
    } else {
      showError('Error: ' + (err.code || err.message));
      setBtn(false);
    }
  }
};

// ── Logout expuesto globalmente ──────────────────────────────────────────
window._adminSignOut = () => signOut(auth);

// ── Wiring del botón (el DOM ya está listo cuando este módulo ejecuta) ───
const loginBtn  = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('btnLogout');

if (loginBtn)  loginBtn.addEventListener('click',  () => window._adminSignIn());
if (logoutBtn) logoutBtn.addEventListener('click', () => window._adminSignOut());
