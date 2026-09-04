# 🔐 Guide de Sécurité - AGIR

Ce document explique comment maintenir la sécurité du projet AGIR, particulièrement pour les **données sensibles** et **clés Firebase**.

---

## 🚨 Règle d'Or

**JAMAIS commiter de vraies clés Firebase, tokens API, ou données personnelles.**

```
❌ INTERDIT:
- firebase-config.js (avec vraies clés)
- .env (avec secrets)
- Tokens d'accès
- Emails personnels
- Mots de passe

✅ AUTORISÉ:
- firebase-config.example.js (template)
- .env.example (template)
- Code source
- Documentation
```

---

## 📋 Fichiers Sensibles à Ignorer

Tous les fichiers suivants sont **automatiquement ignorés par Git** (voir `.gitignore`):

### Configuration
- `firebase-config.js` - ⚠️ Contient clés API Firebase
- `.env.local` - ⚠️ Variables d'environnement
- `.firebaserc` - ⚠️ Référence projet Firebase

### Clés & Certificats
- `*.key` - Clés privées
- `*.pem` - Certificats PEM
- `firebase-key.json` - Service account (jamais utilisé ici)

### Dépendances & Logs
- `node_modules/` - Librairies npm
- `.npm-debug.log`
- `yarn.lock` - Lock files

### Éditeurs & OS
- `.vscode/` - Settings VS Code
- `.idea/` - Settings IntelliJ
- `.DS_Store` - macOS
- `Thumbs.db` - Windows

---

## ✅ Setup Sécurisé (Checklist)

### Avant de publier sur GitHub:

1. **Créer firebase-config.js depuis template**
   ```bash
   cp firebase-config.example.js firebase-config.js
   ```

2. **Remplir firebase-config.js avec tes vraies clés Firebase**
   - NE PAS commiter ce fichier
   - Il est dans `.gitignore`

3. **Vérifier que .gitignore inclut firebase-config.js**
   ```bash
   grep "firebase-config.js" .gitignore
   # Doit retourner: firebase-config.js
   ```

4. **Vérifier qu'aucun secret n'est commité**
   ```bash
   # Chercher les patterns dangereux
   git log --all -S "AIzaSy" --name-only
   git log --all -S "firebase" --name-only
   
   # Doit être vide (aucun commit trouvé)
   ```

5. **Avant le premier push, nettoyer l'historique**
   Si tu as accidentellement commité un secret:
   ```bash
   # OPTION 1: Utiliser BFG Repo-Cleaner (recommandé)
   bfg --delete-files firebase-config.js
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   git push --force
   
   # OPTION 2: Utiliser git-filter-branch
   git filter-branch --tree-filter 'rm -f firebase-config.js' HEAD
   git push --force-with-lease
   ```

6. **Rotationner les clés Firebase compromises**
   - Va dans [Firebase Console](https://console.firebase.google.com)
   - Paramètres du projet → Clé API Web
   - Supprimer l'ancienne clé, générer une nouvelle

---

## 🔑 Clés Firebase: Qu'est-ce qui est "public"?

### ✅ SAFE (Public)
Ces données sont **visibles dans le code source** et c'est OK:

- `apiKey` - Juste une clé client pour le SDK Firebase
- `authDomain` - Domaine (public ici)
- `projectId` - ID du projet (public)
- `storageBucket` - Bucket storage (public)
- `messagingSenderId` - Sender ID (public)
- `appId` - App ID (public)

**Pourquoi?** Parce que la **vraie sécurité vient des Firestore Rules**, pas des clés.

### ❌ DANGEROUS (Privé)
Ces données **DOIVENT rester privées**:

- **Clés de compte de service** (firebase-adminsdk-*.json)
- **Tokens d'authentification** (JWT, OAuth tokens)
- **Email d'admin personnalisé** (modestinhounga78@gmail.com)
- **Mots de passe**

---

## 🛡️ Firestore Rules: La Vraie Protection

La sécurité vient des **règles Firestore**, pas des clés. Exemple:

```firebase
// ✅ BON: Votes publics en lecture
match /votes/{voterKey} {
  allow read: if true;  // Tout le monde peut lire
  allow create: if request.auth.uid != null;  // Que les utilisateurs auth
  allow update, delete: if false;  // Pas de modif
}

// ✅ BON: Contributors privés
match /contributors/{docId} {
  allow read: if isAdmin();  // Seulement admin
  allow create: if request.auth.uid != null;
  allow update, delete: if false;
}
```

---

## 🔄 Rotation de Clés

### Si tu découvres un secret commité:

1. **Immédiatement rotationner la clé**
   ```
   Firebase Console → Settings → Web APIs
   Supprimer → Créer nouvelle clé
   ```

2. **Nettoyer l'historique Git**
   ```bash
   git filter-branch --tree-filter 'rm -f firebase-config.js' HEAD
   git push --force
   ```

3. **Notifier l'équipe**
   - Envoyer email/message
   - Expliquer que la clé a été changée
   - Demander de faire `git pull` pour synchroniser

### Si ton compte Firebase est compromis:

1. **Changer le mot de passe du compte Google/Email**
2. **Activer 2FA sur le compte**
3. **Revérifier les Firestore Rules**
4. **Revérifier qui a accès au projet**

---

## 👤 Admin Email Protection

L'email admin est actuellement: `modestinhounga78@gmail.com`

### Si tu dois le changer:

1. **Édite admin.js:**
   ```javascript
   // Ligne ~15
   const ADMIN_EMAIL = "ton-email@example.com";
   ```

2. **Édite admin-styles.css** (commentaire):
   ```css
   /* Admin email: ton-email@example.com */
   ```

3. **Mets à jour firebase-config.example.js:**
   ```bash
   # Remplissage doc
   ADMIN_EMAIL=ton-email@example.com
   ```

4. **Redéploie:**
   ```bash
   firebase deploy
   ```

---

## 🚨 GitHub Secrets (Si tu uses Actions/CI-CD)

Si tu ajoutes GitHub Actions (ex: déploiement auto), **jamais hardcoder les secrets**:

### ✅ Correct: Utiliser GitHub Secrets
```yaml
- name: Deploy to Firebase
  run: firebase deploy --token ${{ secrets.FIREBASE_TOKEN }}
```

### ❌ Mauvais: Hardcoder en clair
```yaml
- run: firebase deploy --token AIzaSyDVerQsGzUBpvK9lIXaERGk6qIWZbCTzP0
```

Configurer dans GitHub:
1. Settings → Secrets and variables → Actions
2. New repository secret
3. Name: `FIREBASE_TOKEN`
4. Value: Ton token Firebase (généré via `firebase login:ci`)

---

## 🔍 Vérifications Régulières

### Hebdomadaire:
- [ ] Vérifier les Firestore Rules sont toujours correctes
- [ ] Vérifier aucune révision GitHub ne contient de secrets
- [ ] Vérifier les accès admin (qui peut se connecter?)

### Avant chaque déploiement:
- [ ] Vérifier pas de `firebase-config.js` dans le commit
- [ ] Vérifier pas de `.env` dans le commit
- [ ] Vérifier `git diff` pour chercher secrets
- [ ] Tester en local d'abord

### Tous les 6 mois:
- [ ] Rotationner les clés Firebase de sécurité
- [ ] Auditer les Firestore Rules
- [ ] Revérifier les authorized domains
- [ ] Revérifier les accès admin

---

## 📞 Incidents de Sécurité

### Si tu découvres une faille:

1. **NE PAS publiciser** (pas sur GitHub Issues public)
2. **Email privé** à modestinhounga78@gmail.com
3. **Inclure:**
   - Description de la vulnérabilité
   - Comment la reproduire
   - Impact potentiel
   - Suggestion de fix

---

## 🎓 Lectures Complémentaires

- [Firebase Security Best Practices](https://firebase.google.com/docs/firestore/security/get-started)
- [Google Cloud Security](https://cloud.google.com/security)
- [OWASP Web Application Security](https://owasp.org/www-project-top-ten/)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

**Merci de respecter ces pratiques pour garder AGIR sécurisé! 🔐**
