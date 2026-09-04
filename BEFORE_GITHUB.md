# 🎯 À FAIRE AVANT DE PUSHER SUR GITHUB

**Checklist à 100% complète avant le premier `git push`**

---

## 🚨 Étape 1: Créer firebase-config.js

```bash
# OBLIGATOIRE: Copier le template
cp firebase-config.example.js firebase-config.js
```

Puis **édite firebase-config.js** avec tes vraies clés Firebase:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXxxxxxxxxxxxxxxxxxxxxxxxxxxx",  // ← Ta vraie clé API
  authDomain: "agir-defense.firebaseapp.com",
  projectId: "agir-defense",
  storageBucket: "agir-defense.firebasestorage.app",
  messagingSenderId: "1024784205448",
  appId: "1:1024784205448:web:afa82813d6ce1d9088c13d",
  measurementId: "G-0R5ZZV1R5H"
};

export default firebaseConfig;
```

**⚠️ IMPORTANT:** Vérifie que firebase-config.js est dans .gitignore (il l'est):
```bash
grep "firebase-config.js" .gitignore
# Doit afficher: firebase-config.js
```

---

## ✅ Étape 2: Vérifier qu'AUCUN secret n'est en Git

```bash
# Chercher les patterns dangereux
git log --all -S "AIzaSy" 2>/dev/null
git log --all -S "firebase" 2>/dev/null | head -5
git log --all -S "1024784205448" 2>/dev/null

# Tous doivent retourner: (nothing)
```

**Si tu trouves des secrets:**

❌ **ARRÊTE** et nettoie l'historique avant GitHub:

```bash
# DANGER: Réécrit l'historique !
# Après ça, même les vieilles clés sont supprimées
git filter-branch --tree-filter 'rm -f firebase-config.js' -- --all
git push --force

# Puis tu DOIS rotationner les clés Firebase:
# Console Firebase → Settings → Web APIs → Supprimer l'ancienne clé
```

---

## ✅ Étape 3: Vérifier les Fichiers à Ignorer

```bash
# Vérifier que ces fichiers sont IGNORÉS par Git
git status --short

# Doit afficher: (nothing to commit, working tree clean)
# OU seulement des fichiers qu'on VEUT commiter
```

**Les fichiers suivants NE doivent JAMAIS apparaître:**

```
firebase-config.js           ← DOIT être ignoré
.env                         ← DOIT être ignoré
.env.local                   ← DOIT être ignoré
.firebaserc                  ← DOIT être ignoré
.firebase/                   ← DOIT être ignoré
```

---

## ✅ Étape 4: Vérifier les Fichiers DOIVENT être Là

Ces fichiers **DOIVENT** être dans le git:

```bash
git ls-files | grep -E "^firebase-config.example.js"
# Doit retourner: firebase-config.example.js

git ls-files | grep -E "^\.env\.example"
# Doit retourner: .env.example

git ls-files | grep -E "^README\.md"
# Doit retourner: README.md

git ls-files | grep -E "^SECURITY\.md"
# Doit retourner: SECURITY.md

git ls-files | grep -E "^\.gitignore"
# Doit retourner: .gitignore
```

---

## ✅ Étape 5: Git Status Final

```bash
git status

# Doit afficher:
# On branch main
# nothing to commit, working tree clean
```

Si tu vois du "modified:" ou "new file:", c'est qu'il manque un `git add` + `git commit`.

---

## ✅ Étape 6: Créer GitHub Repository

1. Va sur https://github.com/new
2. Remplis:
   - **Repository name:** `agir`
   - **Description:** "Mobilisation citoyenne contre le racisme | Vote + Contribution"
   - **Public** (recommandé)
   - **NE SÉLECTIONNE PAS** "Initialize this repository with README..."
3. Clique **"Create repository"**

---

## ✅ Étape 7: Ajouter Origin et Pousser

```bash
# Remplace TON_USERNAME par ton vrai username GitHub
git remote add origin https://github.com/TON_USERNAME/agir.git

# Branche par défaut = main
git branch -M main

# Vérifier
git remote -v
# Doit afficher:
# origin  https://github.com/TON_USERNAME/agir.git (fetch)
# origin  https://github.com/TON_USERNAME/agir.git (push)

# PUSH!
git push -u origin main
```

**Après quelques secondes, le code est sur GitHub! 🎉**

---

## ✅ Étape 8: Vérifier sur GitHub

1. Va sur https://github.com/TON_USERNAME/agir
2. **Vérifier la liste des fichiers:**

   ✅ Doit voir:
   ```
   index.html
   admin.html
   styles.css
   admin-styles.css
   app.js
   admin.js
   firebase-init.js
   firebase-config.example.js      ← TEMPLATE
   .env.example                    ← TEMPLATE
   README.md
   SECURITY.md
   GITHUB_SETUP.md
   LICENSE
   .gitignore
   ```

   ❌ Ne doit PAS voir:
   ```
   firebase-config.js              ← Pas là = bon!
   .env                            ← Pas là = bon!
   .firebaserc                     ← Pas là = bon!
   .firebase/                      ← Pas là = bon!
   ```

3. **Vérifier que README.md s'affiche bien** (markdown rendu)

---

## 🔐 Sécurité: Checklist Finale

Avant de dire "c'est prêt":

- [ ] firebase-config.js créé LOCALEMENT (pas en Git)
- [ ] firebase-config.js est dans .gitignore
- [ ] Aucun "AIzaSy" dans `git log`
- [ ] Aucun `.env` en Git
- [ ] Aucun `.firebaserc` en Git
- [ ] README.md présent et complet
- [ ] SECURITY.md présent et complet
- [ ] LICENSE présent
- [ ] firebase-config.example.js présent (template)
- [ ] .env.example présent (template)
- [ ] GITHUB_SETUP.md présent pour les contributeurs
- [ ] Git status = "working tree clean"
- [ ] GitHub repo créé et accessible
- [ ] Tous les fichiers visibles sur GitHub SAUF secrets

---

## 🎯 Summary

**✅ Ton projet AGIR est sécurisé et prêt pour GitHub!**

Prochains contributeurs peuvent:
1. Cloner: `git clone https://github.com/TON_USERNAME/agir.git`
2. Copier template: `cp firebase-config.example.js firebase-config.js`
3. Ajouter leurs clés Firebase
4. Lancer localement: `python -m http.server 8000`
5. Contribuer!

---

## ❓ Questions Avant GitHub?

- **"Où je mets ma clé Firebase?"** → Dans firebase-config.js (localement, jamais en Git)
- **"Je dois commiter .env?"** → Non! Copie .env.example et remplis-le localement
- **"Les autres contributeurs auront les mêmes clés?"** → Non, chacun fait son firebase-config.js perso
- **"C'est comment en production?"** → Firebase Hosting gère ça automatiquement
- **"Et si je commit par erreur une clé?"** → Voir SECURITY.md section "Rotation de Clés"

---

**Bonne chance avec AGIR! 🚀**

*Dernière mise à jour: 2026-09-04*
