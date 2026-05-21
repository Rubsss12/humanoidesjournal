# Le Journal des Humanoïdes

L’hebdomadaire en ligne qui décrypte l’essor des robots humanoïdes — industrie,
technologie, société. Sans emballement ni catastrophisme.

Site éditorial construit avec **Next.js 16** (App Router) et **Tailwind CSS v4**.
Le contenu est rédigé en Markdown et publié par numéro hebdomadaire. Le site est
entièrement statique.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:3000
```

Autres commandes : `npm run build` (build de production), `npm run start` (sert
le build), `npm run lint`.

## Structure

```
content/
  numeros/      un fichier Markdown par numéro (l’éditorial)
  articles/     un fichier Markdown par article
src/
  app/          routes (App Router) : une, numéro, article, rubrique, archives
  components/   composants d’interface
  lib/          lecture du contenu, formatage
```

## Publier un nouveau numéro

Le journal paraît chaque semaine. Un numéro = un éditorial + plusieurs articles.

### 1. Créer le numéro — `content/numeros/03.md`

```markdown
---
numero: 3
titre: "Le titre du numéro"
sousTitre: "Une accroche courte"
chapo: "Résumé affiché sur la page d’accueil."
date: "2026-05-26"
---

Le texte de l’éditorial, signé *La rédaction*.
```

### 2. Ajouter des articles — `content/articles/mon-article.md`

Le nom du fichier devient l’URL de l’article (`/articles/mon-article`).

```markdown
---
titre: "Le titre de l’article"
numero: 3
date: "2026-05-26"
auteur: "Prénom Nom"
rubrique: "Décryptage"
chapo: "Le chapô : une ou deux phrases."
aLaUne: true
rang: 1
---

Le corps de l’article, en Markdown.
```

- `rubrique` : Décryptage, Industrie, Technologie, Société, Tribune… (toute
  nouvelle rubrique est créée automatiquement).
- `aLaUne` : met l’article en avant sur la page d’accueil.
- `rang` : ordonne les articles d’un numéro (`1` = article de tête).

## Rédaction : manuel + IA

Le journal suit un modèle hybride. La rédaction humaine choisit les angles,
hiérarchise l’information et valide. L’IA sert d’appui : recherche, synthèse de
sources, premières versions. Le format Markdown rend ce flux simple — on génère
un brouillon, on le relit, on le corrige, on le signe, on le publie.

## Déploiement

`next build` produit un site statique, déployable sur Vercel, Netlify ou tout
hébergeur de fichiers statiques.

---

Maquette de démonstration : les articles actuels sont des textes illustratifs,
fondés sur des connaissances générales du secteur.
