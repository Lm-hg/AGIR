// firebase-config.example.js
// ⚠️ TEMPLATE : Renomme en firebase-config.js et remplis avec tes vraies clés
// JAMAIS commiter ce fichier avec des vraies clés (firebase-config.js est dans .gitignore)

const firebaseConfig = {
  apiKey: "AIzaSyXxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",  // Remplace par ta clé API
  authDomain: "agir-defense.firebaseapp.com",     // Remplace par ton authDomain
  projectId: "agir-defense",                      // Remplace par ton projectId
  storageBucket: "agir-defense.firebasestorage.app", // Remplace
  messagingSenderId: "1024784205448",             // Remplace
  appId: "1:1024784205448:web:xxxxxxxxxxxxxxxx", // Remplace
  measurementId: "G-0R5ZZV1R5H"                   // Remplace (optionnel)
};

export default firebaseConfig;

/*
  HOW TO SET UP:
  
  1. Va sur https://console.firebase.google.com
  2. Sélectionne ton projet (ou crée un nouveau)
  3. Clique sur "Paramètres" ⚙️ → Paramètres du projet
  4. Descends à "Tes apps" → Web (</>)
  5. Copie la config et remplis les valeurs ci-dessus
  6. Sauvegarde sous le nom "firebase-config.js" (note: .js, pas .example.js)
  7. N'oublie pas: firebase-config.js est IGNORÉ par Git (.gitignore)
*/
