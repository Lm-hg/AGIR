# 🚀 AGIR V2 - Configuration Firebase

## Étapes de Configuration

### 1. Créer un projet Firebase
1. Accède à [Firebase Console](https://console.firebase.google.com/)
2. Clique sur "Créer un projet"
3. Nomme le projet **agir-project** (ou ton choix)
4. Désactive Google Analytics (optionnel)
5. Crée le projet

### 2. Configurer l'authentification
1. Accède à **Authentication** → **Sign-in method**
2. Active **Authentification anonyme** (Anonymous)
3. Active aussi **Google**
4. Clique sur "Enregistrer"

### 2.b Autoriser les domaines de connexion Google
1. Accède à **Authentication** → **Settings**
2. Dans **Authorized domains**, ajoute les domaines utilises en local et en prod
3. En local, ajoute au minimum : `localhost` et `127.0.0.1`
4. En production, ajoute ton domaine final (ex: `agir-defense.web.app`, `ton-domaine.com`)

### 3. Créer une base Firestore
1. Accède à **Firestore Database**
2. Clique sur "Créer une base de données"
3. Mode de sécurité : **Mode test** (pour dev)
4. Localisation : **europe-west1** (ou ta région)
5. Crée la base

### 4. Configurer les Règles Firestore

Accède à **Firestore Database** → **Règles** et remplace par :

```firebase
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email == "modestinhounga78@gmail.com";
    }

    // Votes collection - chacun peut lire, un vote par utilisateur
    match /votes/{document=**} {
      allow read: if true;
      allow create: if request.auth.uid != null && 
                       request.auth.token.firebase.sign_in_provider == 'anonymous' &&
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
    
    // Contributors collection - lecture reservee a l'admin
    match /contributors/{document=**} {
      allow read: if isAdmin();
      allow create: if request.auth.uid != null &&
                       request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

Clique sur "Publier"

### 5. Récupérer ta Configuration Firebase

1. Accède à **Settings** (roue en bas à gauche)
2. Clique sur ton projet
3. Descends à **Vos applications** → Clique sur l'icône **Web** (</> )
4. Copie ta configuration Firebase

### 6. Mettre à jour les fichiers

Remplace `AIzaSyDemoKeyReplace` et autres valeurs dans :
- `firebase-init.js`
- `firebase-config.js`

Avec ta vraie config :
```javascript
const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "TON_ID",
  appId: "TON_APP_ID"
};
```

## 📂 Structure des Collections Firestore

### Collection `votes`
```
{
  userId: "user_id_anonyme",
  choice: "yes" | "no",
  timestamp: Timestamp,
  userAgent: "..." // optionnel
}
```

### Collection `contributors`
```
{
  userId: "user_id_anonyme",
  email: "exemple@mail.com",
  fullName: "Nom Complet",
  contributionType: "developer" | "legal" | "communication" | "investigation" | "fundraising" | "volunteer",
  timestamp: Timestamp,
  status: "pending_review" | "active" | "archived"
}
```

## 🚀 Lancer en Local

### Option 1 : Serveur Python simple
```bash
python -m http.server 8000
# Accède à http://localhost:8000
```

### Option 2 : Node.js
```bash
npm install -g http-server
http-server
# Accède à http://localhost:8080
```

### Option 3 : VS Code Live Server
Clique droit sur `index.html` → "Open with Live Server"

## 📱 Pages

- **[index.html](index.html)** - Page de vote avec formulaire de contribution
- **[admin.html](admin.html)** - Tableau de bord en temps réel (password protégé ultérieurement)

## 🎨 Features

✅ Authentification anonyme Firebase  
✅ 1 vote par utilisateur  
✅ Animations et shaders CSS avancés  
✅ Formulaire de contribution post-vote Oui  
✅ Tableau admin temps réel avec Chart.js  
✅ Design dark mode moderne  
✅ Responsive mobile-first  
✅ Particules animées en arrière-plan  

## 🔒 Sécurité Admin

Le tableau admin est maintenant verrouille par email Google :
1. Seul `modestinhounga78@gmail.com` est accepte dans `admin.js`
2. Active le provider Google dans Firebase Authentication
3. Ajoute tes domaines dans **Authorized domains** pour eviter `auth/unauthorized-domain`
4. Applique la regle Firestore `isAdmin()` pour proteger les donnees sensibles

## 💾 Exporter les Données

Via Firebase Console :
1. **Firestore Database** → Menu ⋮ → Exporter/Importer
2. Ou crée un script Node.js avec Admin SDK

## 🚀 Déployer

### Option 1 : Firebase Hosting (recommandé)
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
Upload le dossier via [netlify.com/drop](https://app.netlify.com/drop)

---

**Questions ?** Contacte l'équipe AGIR 🎯
