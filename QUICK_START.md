# 🎯 AGIR V2 - Quick Start Guide

## Ce qui est inclus

✅ **Page de Vote** (`index.html`)
- Design moderne sombre avec animations
- Shaders CSS animés
- Particules en arrière-plan
- Vote Oui/Non avec authentification Firebase
- Formulaire de contribution post-vote Oui
- Responsive mobile-first

✅ **Tableau Admin** (`admin.html`)
- Statistiques en temps réel
- Graphique Chart.js
- Tables votes et contributeurs
- Breakdown des types de contribution
- Design moderne cohérent

✅ **Backend Firebase**
- Authentification anonyme
- Firestore temps réel
- 1 vote par utilisateur garanti
- Stockage des contributions

---

## 🚀 Configuration Rapide (10 min)

### 1️⃣ Créer un projet Firebase

**Aller sur** [console.firebase.google.com](https://console.firebase.google.com/)

```
Créer un projet → "agir-project"
→ Skip Analytics
→ Créer
```

### 2️⃣ Activer l'Authentification Anonyme

```
Authentication → Sign-in method
→ Activer "Anonymous"
→ Activer "Google"
→ Enregistrer
```

### 2.b️⃣ Ajouter les domaines autorisés Firebase

```
Authentication → Settings → Authorized domains
→ Ajouter localhost
→ Ajouter 127.0.0.1
→ Ajouter ton domaine de production (ex: agir-defense.web.app)
```

Sans cette etape, la connexion Google admin peut echouer avec `auth/unauthorized-domain`.

### 3️⃣ Créer une base Firestore

```
Firestore Database → Créer une base
→ Mode test
→ europe-west1 (ou ta région)
→ Activer
```

### 4️⃣ Copier ta Configuration Firebase

Dans Firebase Console :
```
Settings (⚙️) → Project settings
→ Descendre à "Vos applications"
→ Cliquer </> (Web)
→ Copier le code
```

### 5️⃣ Mettre à Jour `firebase-init.js`

Remplace ceci :
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyReplace",
  authDomain: "agir-demo.firebaseapp.com",
  projectId: "agir-demo",
  storageBucket: "agir-demo.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

Avec TA config :
```javascript
const firebaseConfig = {
  apiKey: "TA_CLE_API",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "TON_ID",
  appId: "TON_APP_ID"
};
```

### 6️⃣ Lancer en Local

**Option 1 : Python** (plus simple)
```bash
python serve.py
```
→ Va sur http://localhost:8000

**Option 2 : Node.js**
```bash
npx http-server
```
→ Va sur http://localhost:8080

**Option 3 : Live Server (VS Code)**
Clique droit sur `index.html` → "Open with Live Server"

---

## ✅ Vérifier Que Ça Marche

1. **Ouvre** http://localhost:8000
2. **Clique** "Oui, je veux participer"
3. **Remplis** le formulaire de contribution
4. **Ouvre** http://localhost:8000/admin.html
5. **Connecte-toi avec** modestinhounga78@gmail.com
6. **Vois** ton vote apparaître en temps réel ! 🎉

---

## 🎨 Features Avancées

### Animations
- Shaders CSS animés (canvas)
- Particules flottantes
- Gradients animés
- Transitions fluides

### Design
- Dark mode premium
- Glassmorphism (backdrop blur)
- Couleurs : Cyan, Bleu, Orange
- Typographie Bebas Neue + Manrope

### Temps Réel
- Firestore listeners
- Chat.js pour les graphs
- Mise à jour instantanée

---

## 📊 Structure des Fichiers

```
AGIR/
├── index.html           # Page de vote
├── admin.html           # Tableau admin
├── styles.css           # Styles page vote
├── admin-styles.css     # Styles admin
├── app.js              # Logic vote + contribution
├── admin.js            # Logic tableau admin
├── firebase-init.js    # Init Firebase
├── firebase-config.js  # Config placeholder
├── serve.py            # Serveur dev local
├── FIREBASE_SETUP.md   # Guide détaillé Firebase
├── QUICK_START.md      # Ce fichier
├── projet.md           # Doc AGIR originale
└── logo_agir.png       # Logo du projet
```

---

## 🔒 Règles Firestore (Important!)

Va dans **Firestore Database → Règles** et colle :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email == "modestinhounga78@gmail.com";
    }

    match /votes/{document=**} {
      allow read: if true;
      allow create: if request.auth.uid != null;
      allow update, delete: if false;
    }
    
    match /contributors/{document=**} {
      allow read: if isAdmin();
      allow create: if request.auth.uid != null;
      allow update, delete: if false;
    }
  }
}
```

Clique "Publier"

---

## 🚀 Déployer en Production

### Option 1 : Firebase Hosting (Recommandé)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### Option 2 : Vercel
```bash
vercel deploy
```

### Option 3 : Netlify
Upload le dossier sur [netlify.com/drop](https://app.netlify.com/drop)

---

## 🐛 Troubleshooting

**Erreur: "Cannot read property 'db' of undefined"**
→ Attends un peu, Firebase initialise. Le console log dit quand c'est ready.

**Les votes ne sauvegardent pas**
→ Vérifie ta config Firebase dans `firebase-init.js`
→ Ouvre la console (F12) pour les erreurs

**Le formulaire de contribution n'apparaît pas**
→ Clique sur "Oui" en premier
→ Attends 500ms (animation)

**Le tableau admin affiche rien**
→ Va d'abord voter sur la page principale
→ Puis rafraîchis admin.html

---

## 📞 Support

- **Firebase Docs** : [firebase.google.com/docs](https://firebase.google.com/docs)
- **Chart.js Docs** : [chartjs.org](https://www.chartjs.org)
- **CSS Animations** : [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/animation)

---

## ✨ Prochaines Améliorations Possibles

- [ ] Protection admin par mot de passe
- [ ] Export des données (CSV/JSON)
- [ ] Email de confirmation
- [ ] Multi-langue
- [ ] Dark/Light mode toggle
- [ ] Google Analytics
- [ ] Shareable vote link
- [ ] QR code pour la page

---

**Bonne chance pour AGIR ! 🎯🚀**
