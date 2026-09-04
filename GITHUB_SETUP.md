# 📦 Guide: Initialiser le Repo GitHub

Ce guide explique comment **mettre ton projet AGIR sur GitHub de manière sécurisée**.

---

## 📋 Pre-Checklist (Avant de créer le repo)

### ✅ Vérifications Locales

```bash
# 1. Vérifier que firebase-config.js est ignoré
grep "firebase-config.js" .gitignore
# Doit retourner: firebase-config.js

# 2. Vérifier qu'aucun secret n'a été commité
git log --all -S "AIzaSy" 2>/dev/null | wc -l
# Doit retourner: 0

# 3. Vérifier l'état du repo
git status
# Doit être clean (no changes)
```

Si tu vois des secrets dans l'historique, **nettoie-les avant de publier**:

```bash
# DANGER: Cela réécrit l'historique !
git filter-branch --tree-filter 'rm -f firebase-config.js' -- --all
git push origin --force
```

---

## 🚀 Créer le Repo GitHub

### Étape 1: Créer le Repository

1. Va sur https://github.com/new
2. Remplis:
   - **Repository name:** `agir` (ou `AGIR`)
   - **Description:** "Mobilisation citoyenne contre le racisme | Firebase + Real-time Admin"
   - **Visibility:** `Public` (recommandé pour open-source)
   - **Initialize with:** aucune (tu as déjà un repo local)

3. Clique **"Create repository"**

### Étape 2: Ajouter ton Remote GitHub

```bash
# Remplace TON_USERNAME par ton username GitHub
git remote add origin https://github.com/TON_USERNAME/agir.git

# Ou si tu préfères SSH:
git remote add origin git@github.com:TON_USERNAME/agir.git

# Vérifie
git remote -v
# Doit afficher:
# origin  https://github.com/TON_USERNAME/agir.git (fetch)
# origin  https://github.com/TON_USERNAME/agir.git (push)
```

### Étape 3: Créer la branche main et pusher

```bash
# Renomme la branche locale en 'main' si besoin
git branch -M main

# Push le code local vers GitHub
git push -u origin main
```

### Étape 4: Vérifier sur GitHub

- Va sur https://github.com/TON_USERNAME/agir
- Vérifie que tous les fichiers apparaissent SAUF:
  - ❌ `firebase-config.js`
  - ❌ `.env`
  - ❌ `.firebaserc`
  - ✅ `firebase-config.example.js` (template)
  - ✅ `.env.example` (template)

---

## 🔐 Configurer les Secrets GitHub (Optionnel)

Si tu veux utiliser **GitHub Actions** pour déploiement auto:

### Étape 1: Générer Firebase Token

```bash
firebase login:ci
# Cela ouvre un navigateur, valide Google
# Reçois un token très long
```

### Étape 2: Ajouter en GitHub Secret

1. Va sur https://github.com/TON_USERNAME/agir/settings/secrets/actions
2. Clique **"New repository secret"**
3. Remplis:
   - **Name:** `FIREBASE_TOKEN`
   - **Value:** Colle le token reçu à l'étape 1
4. Clique **"Add secret"**

### Étape 3: Créer workflow GitHub Actions (optionnel)

Crée `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: agir-defense
```

---

## 📝 Documentation GitHub

### Ajouter des Topics

Depuis la page du repo:
1. Settings → Topics (ou clique l'icône gear)
2. Ajoute: `firebase`, `activism`, `racism`, `javascript`, `civic-tech`

### Ajouter une Description

Settings → Short description:
```
Mobilisation citoyenne contre le racisme | Vote + Contribution system with Firebase
```

### Ajouter un Site Web (optionnel)

Settings → Website:
```
https://agir-defense.web.app
```

---

## 🎯 Branching Strategy (Recommandé)

Pour les futures mises à jour:

```bash
# Créer une feature branch
git checkout -b feature/my-feature

# Faire les changements
git add .
git commit -m "Add my feature"

# Pousser
git push origin feature/my-feature

# Créer une Pull Request sur GitHub
# (GitHub te proposera un lien)
```

---

## 🛡️ Branch Protection (Recommandé)

Pour plus de sécurité:

1. Va sur https://github.com/TON_USERNAME/agir/settings/branches
2. Ajoute une rule pour `main`:
   - Require a pull request before merging
   - Require status checks to pass
   - Require branches to be up to date

---

## 📣 Promotion du Repo

### Première annonce
```markdown
🎯 **AGIR est maintenant open-source!**

Mobilisation citoyenne contre le racisme.
Vote public + Système de contribution avec Firebase.

🔗 https://agir-defense.web.app
📄 https://github.com/ton-username/agir

Contribue pour renforcer le project!
```

### Où partager:
- Twitter/X: #activism #racism #civictech
- LinkedIn: #socialjustice #opensource
- Reddit: r/activism, r/opensource, r/france
- Discord communities: civic tech, activism

---

## 🔄 Maintenir le Repo

### Après publication:

1. **Ajouter CONTRIBUTING.md** (guidelines pour contribs)
2. **Ajouter ISSUES/PULL REQUEST templates**
3. **Ajouter GitHub Pages** (site web)
4. **Configurer branch protection**
5. **Ajouter tests/CI-CD**
6. **Configurer Dependabot** (pour les dépendances)

---

## 🚫 Erreurs Courantes

### ❌ "fatal: refspec main does not match any"
```bash
# Solution: la branche s'appelle 'master', pas 'main'
git branch -M main
git push -u origin main
```

### ❌ "error: failed to push some refs"
```bash
# Solution: le remote est différent
git remote -v
# Vérifier que origin pointe vers ton repo GitHub
```

### ❌ "firebase-config.js inclus par accident"
```bash
# Solution: nettoyer l'historique
git filter-branch --tree-filter 'rm -f firebase-config.js' -- --all
git push --force
# ATTENTION: Tous les contributeurs doivent faire git pull --force
```

### ❌ ".env commité accidentellement"
```bash
# Solution: même que ci-dessus
git filter-branch --tree-filter 'rm -f .env .env.local' -- --all
git push --force
# IMPORTANT: Changer tous les secrets compromis (Gmail, etc)
```

---

## 📊 Monitoring du Repo

### GitHub Insights

1. Va sur https://github.com/TON_USERNAME/agir/graphs
2. Vérifier:
   - **Traffic:** Qui clique sur le repo?
   - **Stargazers:** Qui met des ⭐?
   - **Network:** Qui fork/contribue?

### GitHub Security

1. Va sur Settings → Security & analysis
2. Activer:
   - ✅ Secret scanning (gratuit)
   - ✅ Dependabot alerts
   - ✅ Code scanning with CodeQL (gratuit)

---

## ✅ Final Checklist

Avant de "lancer" publiquement:

- [ ] Repo est public et visible
- [ ] README.md bien formaté
- [ ] SECURITY.md explique les bonnes pratiques
- [ ] LICENSE est MIT
- [ ] Pas de secrets dans l'historique git
- [ ] firebase-config.example.js est dans le repo
- [ ] .env.example est dans le repo
- [ ] .gitignore inclut tous les fichiers sensibles
- [ ] Description/Topics remplis sur GitHub
- [ ] Site web linked: https://agir-defense.web.app
- [ ] Email de sécurité configuré (Settings → Contact security researchers)

---

## 🎉 Félicitations!

Ton projet AGIR est maintenant sur GitHub! 🚀

Pour les contributeurs:
- Envoie le lien: https://github.com/TON_USERNAME/agir
- Encourage les forks
- Réponds aux issues
- Fusionne les PRs sympa

**Next: Ajouter les contributeurs existants comme collaborateurs**
```bash
Settings → Collaborators → Invite
```

---

*Dernière mise à jour: 2026-09-04*
