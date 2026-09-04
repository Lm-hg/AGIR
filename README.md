# 🎯 AGIR - Agence de Gestion des Investigations et Recours

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Français](https://img.shields.io/badge/Langue-Français-blue.svg)](#)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFA500.svg)](https://firebase.google.com)
[![Chart.js](https://img.shields.io/badge/Charts-Chart.js-FF6384.svg)](https://www.chartjs.org/)

**Mobilisation citoyenne contre le racisme et les discriminations systémiques**

> *"Car c'est parce qu'ils sont seuls qu'ils finissent par laisser tomber et le racisme continue."*

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture Technique](#-architecture-technique)
- [Mise en Place](#-mise-en-place)
- [Configuration Firebase](#-configuration-firebase)
- [Utilisation](#-utilisation)
- [Sécurité](#-sécurité)
- [Déploiement](#-déploiement)
- [Contribution](#-contribution)
- [Licence](#-licence)

---

## 📖 À Propos

**AGIR** est une plateforme de mobilisation collective conçue pour transformer l'indignation face au racisme en **action légale et visible**. 

### Objectif
Créer un bouclier juridique et une plateforme d'appui technique pour les victimes de racisme systémique, structuré autour de trois pôles :

1. **🔊 Signalement & Qualification** - Recueil sécurisé des faits, tri pénal vs civil
2. **🔍 Investigation & Preuve** - Extraction numérique et horodatage certifié
3. **⚖️ Contentieux & Recours** - Réseau d'avocats partenaires, saisine Défenseur

---

## 🚀 Fonctionnalités

### Page d'Accueil (Public)
✅ **Landing Page Modern**
- Design dark mode premium avec glassmorphism
- Animations shaders CSS + particules flottantes
- Présentation du contexte AGIR et mission

✅ **Système de Vote Anonyme**
- Vote Oui/Non sur l'engagement collectif
- 1 vote par utilisateur (deduplication via Firebase UID + localStorage)
- Affichage temps réel des résultats avec barres de progression
- Déduplication garantie avec Firestore rules

✅ **Formulaire de Contribution**
Après vote Oui, les utilisateurs peuvent s'engager :
- 👨‍💻 Développement/Tech
- ⚖️ Expertise juridique  
- 📢 Communication/Réseaux
- 🔎 Investigation
- 💰 Fundraising
- 🤝 Bénévolat général

Status "Pending Review" par défaut (admin review manuel)

### Tableau Admin (Protégé)
✅ **Dashboard en Temps Réel**
- Authentification Google
- Statistiques Oui/Non avec mise à jour live
- Graphique doughnut Chart.js avec couleurs thématiques
- Tableau des 50 derniers votes
- Liste des contributeurs engagés avec breakdown par type
- Export-ready des données

✅ **Contrôle d'Accès**
- Gate d'authentification obligatoire
- Vérification email (modestinhounga78@gmail.com uniquement)
- Messages d'erreur user-friendly en français
- Page robot excluded du SEO (`noindex, nofollow`)

---

## 🏗️ Architecture Technique

### Tech Stack

```
Frontend:
├── HTML5 + CSS3 (aucune dépendance build)
├── JavaScript ES6+ (modules)
├── Canvas Shader Animations
└── Responsive Mobile-First

Backend:
├── Firebase Firestore (base de données)
├── Firebase Authentication (OAuth + Anonyme)
└── Firebase Hosting (déploiement)

Librairies:
├── Chart.js 4.4.0 (graphiques)
└── Firebase SDK 10.7.0
```

### Collections Firestore

#### `votes`
```json
{
  "voterKey": "document-id (crypto.randomUUID)",
  "userId": "firebase-uid-anonyme",
  "choice": "yes" | "no",
  "timestamp": "serverTimestamp()",
  "userAgent": "browser-info (optionnel)"
}
```

**Règles de Firestore:**
- ✅ Lecture: Public (tout le monde voit les stats)
- ✅ Création: Anonymes uniquement (userId anonyme)
- ❌ Modification/Suppression: Bloquée

#### `contributors`
```json
{
  "userId": "firebase-uid-anonyme",
  "email": "user@example.com",
  "fullName": "Prénom Nom",
  "contributionType": "developer" | "legal" | "comm" | "investigation" | "fundraising" | "volunteer",
  "timestamp": "serverTimestamp()",
  "status": "pending_review" | "approved" | "rejected"
}
```

**Règles de Firestore:**
- ✅ Lecture: Admin only (modestinhounga78@gmail.com)
- ✅ Création: Anonymes uniquement
- ❌ Modification: Admin only (future)
- ❌ Suppression: Bloquée

---

## 🛠️ Mise en Place

### Prérequis

- Un compte Firebase (gratuit: https://firebase.google.com)
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
- (Optionnel) Git pour cloner le repo

### Installation Locale

1. **Clone le repository**
```bash
git clone https://github.com/ton-username/agir.git
cd agir
```

2. **Configure Firebase**
```bash
# Copie le template de config
cp firebase-config.example.js firebase-config.js

# Édite firebase-config.js avec tes vraies clés Firebase
nano firebase-config.js  # ou ouvre dans l'éditeur
```

3. **Lance un serveur local**
```bash
# Option 1: Python 3
python -m http.server 8000

# Option 2: Node.js (npm)
npx http-server

# Puis ouvre http://localhost:8000
```

---

## 🔥 Configuration Firebase

### 1️⃣ Créer un Projet Firebase

1. Va sur [Firebase Console](https://console.firebase.google.com)
2. Clique **"Create a new project"**
3. Nomme-le `agir-defense`
4. Active Google Analytics (optionnel)
5. Crée le projet

### 2️⃣ Ajouter une Application Web

1. Depuis la console, clique le bouton **</>** (Add app → Web)
2. Nomme l'app `AGIR V2`
3. **Copie la config Firebase** qui apparaît
4. Colle-la dans `firebase-config.js` (remplace les valeurs placeholder)

### 3️⃣ Configurer Firestore Database

1. Depuis la console, va à **Firestore Database** (dans le menu gauche)
2. Clique **"Create database"**
3. Démarre en mode **Production** (nous allons ajouter des règles)
4. Choisis la région **Europe (eur3)** ou proche de toi

### 4️⃣ Configurer Authentication

#### Anonymous Auth (pour votes publics)
1. Depuis la console, va à **Authentication** → onglet **Sign-in method**
2. Active **Anonymous** (par défaut)
3. Sauvegarde

#### Google OAuth (pour admin)
1. Toujours dans **Sign-in method** → Active **Google**
2. Remplis "Nom du projet": `AGIR Admin`
3. Email support: `modestinhounga78@gmail.com`
4. Sauvegarde
5. Ajoute ton domaine à **Authorized domains**:
   - `localhost` (dev)
   - `127.0.0.1` (dev)
   - `agir-defense.firebaseapp.com` (production)

### 5️⃣ Ajouter les Règles Firestore

1. Va à **Firestore Database** → onglet **Rules**
2. Remplace le contenu par ceci:

```firebase
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email_verified == true
        && request.auth.token.email == "modestinhounga78@gmail.com";
    }

    // Votes collection - public read, one vote per browser via voterKey
    match /votes/{voterKey} {
      allow read: if true;
      allow create: if request.auth.uid != null 
                    && request.resource.data.voterKey == voterKey
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
    
    // Contributors collection - admin read only, auth create
    match /contributors/{contributorId} {
      allow read: if isAdmin();
      allow create: if request.auth.uid != null
                    && request.resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

3. Clique **Publish**

### 6️⃣ Configurer Email Admin

Actuellement l'admin email est hardcodé: `modestinhounga78@gmail.com`

**Pour changer:**
- Édite `admin.js` ligne ~15: `const ADMIN_EMAIL = "ton-email@example.com";`
- Mets à jour dans `firebase-config.example.js` aussi (documentation)

---

## 🔒 Sécurité

### 🚨 JAMAIS Commiter Ces Fichiers

Fichiers **obligatoirement ignorés par Git** (voir `.gitignore`):
- ❌ `firebase-config.js` (contient clés API)
- ❌ `.env` (secrets)
- ❌ `.firebaserc` (config privée)
- ❌ Tout fichier `.key` ou `.pem`

### ✅ Checklist Sécurité Avant Prod

```
☑️ firebase-config.js créé ET ignoré par Git
☑️ .gitignore inclut firebase-config.js
☑️ Admin email changé si nécessaire (admin.js + config example)
☑️ Firestore rules publiées ✔️ (vérifiés ci-dessus)
☑️ Domaines autorisés ajoutés à Firebase Console
☑️ Pas de tokens/clés dans les commits (vérifier git log)
☑️ HTTPS forcé sur domaine production
```

### Authentication Flow

**Public (Vote):**
- Anonyme Firebase Auth (pas de données perso)
- Voteur identifié par: `crypto.randomUUID()` sauvegardé en localStorage
- Impossible de voter deux fois (voterKey unique + Firestore rules)

**Admin (Dashboard):**
- Google OAuth 2.0 popup
- Vérification email: `modestinhounga78@gmail.com`
- Session maintenue via Firebase onAuthStateChanged()

---

## 💡 Utilisation

### Page Publique (index.html)

```
1. Utilisateur arrive sur la page
2. Lit le contexte AGIR
3. Vote Oui/Non
4. Voir les résultats temps réel
5. Si Oui → Formulaire de contribution (email, nom, type d'engagement)
6. Contribution enregistrée en attente de review admin
```

### Dashboard Admin (admin.html)

```
1. Clique "Se connecter"
2. Google login popup
3. Accepte permission Google
4. Dashboard charge si email = modestinhounga78@gmail.com
5. Voir stats, graphique, votes/contributeurs
6. Actualisation auto toutes les secondes
```

**Note:** Si email ≠ admin → Message "Accès refusé, tu n'es pas admin"

---

## 🚀 Déploiement

### Déployer sur Firebase Hosting

1. **Installe Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login Firebase**
```bash
firebase login
```

3. **Configure le projet**
```bash
firebase init hosting
# Répondre:
# - What do you want to use as your public directory? → .
# - Configure as SPA? → No (on est du HTML statique)
```

4. **Deploy**
```bash
firebase deploy
```

Ton site sera live sur: `https://agir-defense.firebaseapp.com` 🎉

### Production Checklist

```
✅ firebase-config.js rempli avec config PROD
✅ Admin email configuré dans admin.js
✅ Firestore rules publiées ET testées
✅ Domaine firebaseapp.com added à Authorized domains
✅ robots.txt configured (noindex sur /admin.html)
✅ sitemap.xml soumis à Google Search Console
✅ HTTPS forcé (Firebase Hosting = HTTPS auto)
```

---

## 🤝 Contribution

Les contributions sont bienvenues! Pour contribuer:

1. **Fork** le repository
2. Crée une **branche** (`git checkout -b feature/amazing-feature`)
3. **Commit** tes changements (`git commit -m 'Add amazing feature'`)
4. **Push** (`git push origin feature/amazing-feature`)
5. Ouvre une **Pull Request**

### Guidelines

- Respecte le style de code existant (ES6+)
- Commente les sections complexes
- Teste sur mobile et desktop
- Pas de données sensibles dans les PR

---

## 📁 Structure des Fichiers

```
agir/
├── index.html              # Page publique (vote + contribution)
├── admin.html              # Dashboard admin (protégé)
├── styles.css              # Styles page publique
├── admin-styles.css        # Styles dashboard
├── app.js                  # Logic vote + contribution
├── admin.js                # Logic dashboard admin
├── firebase-init.js        # Firebase setup (charge config depuis firebase-config.js)
├── firebase-config.example.js  # ⚠️ TEMPLATE (remplace valeurs + renomme en firebase-config.js)
├── logo_agir.png          # Logo AGIR
├── robots.txt             # SEO crawler directives
├── sitemap.xml            # XML sitemap pour Google
├── firebase.json          # Firebase Hosting config
├── .firebaserc            # ⚠️ Firebase project ref (ignoré par Git)
├── .gitignore             # ⚠️ Ignore fichiers sensibles
├── .env.example           # Template variables env
├── README.md              # Ce fichier
└── docs/                  # Documentation complémentaire
    ├── QUICK_START.md
    ├── FIREBASE_SETUP.md
    ├── ARCHITECTURE.md
    └── DEPLOYMENT_CHECKLIST.md
```

---

## 🔧 Troubleshooting

### ❌ "firebase-config.js not found"
**Solution:** Crée le fichier depuis le template:
```bash
cp firebase-config.example.js firebase-config.js
# Puis remplis avec tes vraies clés Firebase
```

### ❌ "Admin access denied" après Google login
**Vérifier:**
1. Ton email Firebase = `modestinhounga78@gmail.com` (ou changé dans admin.js)?
2. Domaine ajouté à "Authorized domains" dans Firebase Console?
3. Firestore rules publiées?

### ❌ "Vote collection empty" sur admin dashboard
**Vérifier:**
1. Firestore Database créée (pas Realtime Database)?
2. Règles Firestore publiées?
3. Ouvrir index.html, voter, puis attendre 2-3 sec avant refresh admin

### ❌ "Impossible de récupérer" sitemap dans Search Console
**Solution:** C'est un cache Google, réessaye demain ou force re-crawl

---

## 📞 Support & Contact

Pour des questions:
- Ouvre une **Issue** sur GitHub
- Consulte la [Documentation Complète](docs/)
- Envoie un email (contacter Modeste)

---

## 📜 Licence

Ce projet est sous licence **MIT**. Voir [LICENSE](LICENSE) pour détails.

---

## 🙏 Remerciements

- Firebase pour l'infrastructure gratuite
- Chart.js pour les graphiques
- Tous les contributeurs AGIR

---

**Made with ❤️ for collective action against racism**

*Dernière mise à jour: 2026-09-04*
