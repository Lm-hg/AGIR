# ✅ AGIR V2 - Deployment Checklist

## Pre-Launch Checklist (Avant déploiement)

### 1. Configuration Firebase
- [ ] Créer projet Firebase sur console.firebase.google.com
- [ ] Activer **Authentication → Anonymous**
- [ ] Créer **Firestore Database** en mode test
- [ ] Copier **Firebase Config** de Settings
- [ ] Coller config dans **firebase-init.js**
- [ ] Copier **Firestore Rules** de FIREBASE_SETUP.md
- [ ] Coller dans **Firestore → Rules → Publish**

### 2. Tests Locaux
- [ ] Lancer `python serve.py` (ou `vercel dev`)
- [ ] Accéder http://localhost:8000/index.html
- [ ] Cliquer "Oui" → Voir vote dans Firestore
- [ ] Remplir formulaire contribution → Voir en DB
- [ ] Accéder http://localhost:8000/admin.html
- [ ] Vérifier stats mises à jour en temps réel
- [ ] Vérifier Chart.js affiche les données
- [ ] Tester sur mobile (responsive)
- [ ] Tester sur 3 navigateurs différents

### 3. Vérification Sécurité
- [ ] Règles Firestore bien appliquées
- [ ] Impossible de modifier son vote (update: false)
- [ ] Contributions non lisibles publiquement
- [ ] Pas de secrets en localStorage
- [ ] HTTPS forcé en production

### 4. Optimisations Performance
- [ ] Réduire images (JPG optimisé)
- [ ] Minifier CSS/JS (optionnel)
- [ ] Vérifier Lighthouse > 90
- [ ] Tester vitesse chargement < 2s
- [ ] Tester sur connexion 4G

### 5. Accessibilité
- [ ] WCAG 2.1 Level AA
- [ ] Alt text sur images ✅ (logo)
- [ ] Labels sur inputs ✅
- [ ] Focus visible sur boutons ✅
- [ ] Contraste de couleur OK ✅
- [ ] Test avec lecteur d'écran (NVDA)

### 6. Content & Branding
- [ ] Logo AGIR en place
- [ ] Textes relus (pas de typos)
- [ ] Messages alignés avec mission
- [ ] Links fonctionnent (index → admin)
- [ ] Footer avec info légale

### 7. Analytics & Tracking
- [ ] Google Analytics configuré (optionnel)
- [ ] Firebase Events trackés
- [ ] Logs console clean (pas d'erreurs)

---

## Deploy to Firebase Hosting

### Prérequis
```bash
npm install -g firebase-tools
firebase login
```

### Initialiser Firebase Hosting
```bash
firebase init hosting
# → Choisir le projet créé
# → Public directory: .
# → Configure as SPA? y
# → Overwrite 404.html? y
```

### Déployer
```bash
firebase deploy
```

**Résultat** :
- URL: `https://agir-project.web.app`
- Certificat SSL automatique ✅
- CDN global ✅
- Redirection vers HTTPS ✅

### Post-Deploy Vérifications
- [ ] Site accessible via URL Firebase
- [ ] Toutes pages chargent
- [ ] Firebase DB sync fonctionne
- [ ] Admin panel affiche les données
- [ ] Pas d'erreurs console
- [ ] Lighthouse score ≥ 90

---

## Deploy to Vercel

### Prérequis
```bash
npm install -g vercel
vercel login
```

### Initialiser
```bash
vercel
# → Choisir "Deploy to Vercel for Git"
# → Confirmer settings
```

### Déployer
```bash
vercel --prod
```

**Résultat** :
- URL: `https://agir-[random].vercel.app`
- Preview URLs automatiques
- Redéploiement auto à chaque push

---

## Deploy to Netlify

### Via Drag & Drop (Plus simple)
1. Accéder [netlify.com/drop](https://app.netlify.com/drop)
2. Drag le dossier AGIR
3. Attendre déploiement
4. Site live ! 🚀

### Via CLI
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## Post-Deployment Monitoring

### Firebase Console
- [ ] Firestore Database → vérifier collections populées
- [ ] Authentication → voir utilisateurs anonymes
- [ ] Analytics → tracker les votes
- [ ] Pricing → monitorer usage

### Sentry (optionnel)
```bash
# Ajouter error tracking
npm install @sentry/browser
# Initialiser dans app.js
```

### Uptime Monitoring
- [ ] UptimeRobot ou similaire
- [ ] Alert si site down
- [ ] Check 5 min interval

---

## Maintenance Régulière

### Chaque semaine
- [ ] Vérifier stats votes
- [ ] Répondre contributeurs engagés
- [ ] Backup Firestore data

### Chaque mois
- [ ] Vérifier Firebase usage
- [ ] Mettre à jour dépendances
- [ ] Review Firestore rules
- [ ] Exporter data (CSV)

### Chaque trimestre
- [ ] Analyse engagement
- [ ] Plan prochaines features
- [ ] Maintenance sécurité
- [ ] Update docs

---

## Scaling Checklist

Si > 1000 votes/jour :

- [ ] Indexer Firestore sur `choice` + `timestamp`
- [ ] Réduire real-time listeners (cache 24h)
- [ ] Ajouter reCAPTCHA v3
- [ ] Rate limiting (30s entre votes)
- [ ] Compression images
- [ ] CDN pour assets

Si > 10000 votes/jour :

- [ ] Firestore sharding (multi-docs)
- [ ] Cloud Functions pour aggregate
- [ ] Admin panel auth requise
- [ ] Analytics dashboard séparé
- [ ] Email notifications
- [ ] SMS confirmations

---

## Troubleshooting Post-Deploy

| Problème | Cause | Solution |
|----------|-------|----------|
| "Firebase SDK not loaded" | Config manquante | Vérifier firebase-init.js |
| Votes ne sauvegardent pas | Règles Firestore | Vérifier allow create |
| Admin page 403 | Rules deny read | Ajouter allow read pour admin |
| Slow loading | Images trop lourdes | Optimiser/compresser images |
| CORS errors | Domain whitelist | Firebase auto-trust Netlify/Vercel |
| High costs | Data reads excessives | Ajouter cache/offline support |

---

## Legal & Compliance

- [ ] Privacy Policy rédigée
- [ ] Terms of Service rédigés
- [ ] GDPR compliance (EU)
- [ ] CCPA compliance (Californie)
- [ ] Données utilisateurs sécurisées
- [ ] Politique de retention (30j min)
- [ ] Right to delete (account deletion)

### Footer à ajouter
```html
<footer>
  <a href="/privacy">Politique de confidentialité</a>
  <a href="/terms">Conditions d'utilisation</a>
  <p>&copy; 2026 AGIR - Combat collectif contre le racisme</p>
</footer>
```

---

## Launch Day Checklist

### Matin du Launch
- [ ] Final test sur prod
- [ ] Database clean + vérifiée
- [ ] Contacts clés notifiés
- [ ] Communications préparées
- [ ] Support team prêt

### Go Live
- [ ] Tweeter/Social media
- [ ] Email liste contacts
- [ ] Blog post si existe
- [ ] Slack/Telegram announcement
- [ ] Community forums

### Pendant Launch
- [ ] Monitor Firestore usage
- [ ] Check error logs
- [ ] Respond to feedback
- [ ] Take screenshots success
- [ ] Celebrate ! 🎉

### Après Launch
- [ ] Collect user feedback
- [ ] Document issues
- [ ] Plan hotfixes
- [ ] Update roadmap
- [ ] Thank supporters

---

## Long-term Vision

### Months 1-3
- [ ] Stabiliser V2
- [ ] Collecter retours
- [ ] Plan V3 (email, onboarding)

### Months 3-6
- [ ] V3 release
- [ ] Mobile app planning
- [ ] Partnerships avocats

### Months 6-12
- [ ] Mobile app launch
- [ ] API backend
- [ ] Expand pays (EU, Africa)

### Year 2+
- [ ] Scaling legal ops
- [ ] Government recognition
- [ ] Partnerships media
- [ ] International expansion

---

## Quick Reference

### URLs
- **Live Site** : `https://agir-[hosting].com`
- **Firebase Console** : `console.firebase.google.com`
- **Admin Panel** : `https://[live-url]/admin.html`
- **GitHub** : `https://github.com/agir-project`

### Commands
```bash
# Local dev
python serve.py

# Deploy Firebase
firebase deploy

# Deploy Vercel
vercel --prod

# Deploy Netlify
netlify deploy --prod
```

### Contacts
- **Firebase Support** : [firebase.google.com/support](https://firebase.google.com/support)
- **AGIR Team** : [À définir]
- **Legal** : [À définir]

---

## ✨ Fin du Checklist

**Tous les points cochés ? 🎉**

Ton AGIR est prêt pour la production !

---

*Mis à jour: 2026-08-09*  
*AGIR V2 - Ready for Launch*
