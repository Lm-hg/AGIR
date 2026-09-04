// Firebase Initialization Script
// ⚠️ Configuration chargée depuis firebase-config.js (qui charge .env.local)
// JAMAIS hardcoder les clés Firebase ici !

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import {
  getAuth,
  signInAnonymously,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Charger la config depuis le fichier config (qui doit être basé sur .env.local)
// Pour développement local: firebase-config.js (ajouté à .gitignore)
// Pour production: utilise les variables d'environnement ou une fonction de déploiement
let firebaseConfig;

try {
  // Tenter de charger desde un module config (pour dev)
  const configModule = await import('./firebase-config.js').catch(() => null);
  if (configModule?.default) {
    firebaseConfig = configModule.default;
  } else {
    firebaseConfig = window.__FIREBASE_CONFIG__ || {};
  }
} catch (e) {
  firebaseConfig = window.__FIREBASE_CONFIG__ || {};
}

// Fallback: chercher dans window si config pas trouvée
if (!firebaseConfig.apiKey && typeof window !== 'undefined') {
  console.warn('⚠️ Firebase config not found. Ensure firebase-config.js is set up correctly.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

async function initAnonymousAuth() {
  try {
    await signInAnonymously(auth);
    console.log("✓ Firebase: Authentification anonyme réussie");
  } catch (error) {
    console.error("✗ Firebase Auth Error:", error.message);
  }
}

async function signInAdminWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

function watchAuthState(callback) {
  return onAuthStateChanged(auth, callback);
}

async function signOutCurrentUser() {
  await signOut(auth);
}

// Export for use in other modules
export {
  app,
  auth,
  db,
  initAnonymousAuth,
  signInAdminWithGoogle,
  watchAuthState,
  signOutCurrentUser
};
