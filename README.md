# Site antonindenis.com — mode d'emploi

Ce dossier contient un site web complet, statique (HTML/CSS/JS, aucune base
de données, aucun serveur à faire tourner), dont **tout le texte et les
photos sont modifiables via une interface d'administration** sans toucher au
code.

## Comment ça marche

- `index.html` — la page du site. Elle va chercher son contenu dans
  `content/site.json` au chargement.
- `content/site.json` — tout le texte, tous les chiffres, tous les chemins
  de photos. C'est ce fichier que l'interface d'administration modifie.
- `images/` — vos photos.
- `admin/` — l'interface d'administration (Decap CMS), qui affiche des
  formulaires au lieu du code JSON.
- `functions/api/` — deux petits fichiers qui gèrent la connexion sécurisée
  entre l'interface d'administration et GitHub (sans service tiers payant).

Quand vous modifiez un texte ou une photo dans l'admin et cliquez sur
« Publier », l'interface enregistre le changement dans votre dépôt GitHub,
et Cloudflare republie automatiquement le site en quelques secondes.

## Étape 1 — Créer un compte GitHub (gratuit)

Si vous n'en avez pas déjà un : https://github.com/signup

## Étape 2 — Créer le dépôt et y déposer les fichiers

1. Sur GitHub, cliquez sur **New repository**.
2. Nommez-le par exemple `antonindenis-site`. Laissez-le "Public" ou
   "Private" (Private fonctionne aussi, à votre préférence).
3. Une fois créé, déposez-y tous les fichiers de ce dossier (glisser-déposer
   possible depuis l'interface GitHub, "Add file" → "Upload files" ; ou en
   ligne de commande avec `git` si vous êtes à l'aise).

## Étape 3 — Créer le site sur Cloudflare Pages (gratuit)

1. Créez un compte sur https://dash.cloudflare.com si besoin.
2. Dans le tableau de bord, allez dans **Workers & Pages** → **Create** →
   onglet **Pages** → **Connect to Git**.
3. Choisissez votre dépôt GitHub `antonindenis-site`.
4. Paramètres de build : laissez tout vide / par défaut (aucune commande de
   build n'est nécessaire, c'est un site déjà prêt).
   - Build command : (laisser vide)
   - Build output directory : `/`
5. Cliquez sur **Save and Deploy**. Au bout d'une minute, vous obtenez une
   adresse du type `https://antonindenis-site.pages.dev`.

## Étape 4 — Créer l'application GitHub pour l'authentification

Ceci permet à l'interface d'administration de se connecter à GitHub en
toute sécurité.

1. Allez sur https://github.com/settings/developers → **New OAuth App**.
2. Remplissez :
   - **Application name** : `Admin Antonin Denis` (ou ce que vous voulez)
   - **Homepage URL** : votre adresse Cloudflare, ex.
     `https://antonindenis-site.pages.dev`
   - **Authorization callback URL** : la même adresse, ex.
     `https://antonindenis-site.pages.dev`
3. Cliquez sur **Register application**.
4. Notez le **Client ID** affiché, puis cliquez sur **Generate a new client
   secret** et notez-le aussi (il ne sera affiché qu'une seule fois).

## Étape 5 — Ajouter les identifiants dans Cloudflare

1. Dans votre projet Cloudflare Pages, allez dans **Settings** →
   **Environment variables**.
2. Ajoutez deux variables :
   - `GITHUB_CLIENT_ID` = le Client ID de l'étape 4
   - `GITHUB_CLIENT_SECRET` = le Client Secret de l'étape 4
3. Redéployez le site une fois ces variables ajoutées (bouton "Retry
   deployment" ou un nouveau commit).

## Étape 6 — Finaliser la configuration de l'admin

Ouvrez `admin/config.yml` dans votre dépôt GitHub (vous pouvez l'éditer
directement dans l'interface GitHub, bouton crayon) et remplacez, en haut du
fichier :

```yaml
backend:
  name: github
  repo: VOTRE-COMPTE-GITHUB/VOTRE-DEPOT      ← remplacez par ex. jdupont/antonindenis-site
  branch: main
  base_url: https://VOTRE-SITE.pages.dev     ← remplacez par votre adresse Cloudflare
  auth_endpoint: /api/auth

site_url: https://VOTRE-SITE.pages.dev       ← idem
display_url: https://VOTRE-SITE.pages.dev    ← idem
```

Enregistrez (« Commit changes »). Cloudflare republie automatiquement.

## Étape 7 — Se connecter à l'administration

Rendez-vous sur `https://VOTRE-SITE.pages.dev/admin/`. Cliquez sur
**Login with GitHub**, autorisez l'application. Vous arrivez sur
l'interface avec des formulaires pour chaque section du site (En-tête,
Mon approche, Formations, Références, Parcours, Témoignages, Contact,
Pied de page). Modifiez, cliquez sur **Publier**, le site se met à jour
en quelques secondes.

## Étape 8 — Brancher votre nom de domaine antonindenis.com

1. Dans Cloudflare Pages, projet → **Custom domains** → **Set up a custom
   domain** → entrez `antonindenis.com` (et `www.antonindenis.com` si
   besoin).
2. Cloudflare vous indique les enregistrements DNS à ajouter chez votre
   registrar actuel (celui utilisé pour Sitew). Ne coupez pas Sitew avant
   d'avoir vérifié que le nouveau site fonctionne bien sur l'adresse
   `.pages.dev`.

## Ce qu'il reste à compléter vous-même

- **Activer l'envoi du formulaire de contact** (fait avec Web3Forms,
  gratuit, sans backend à gérer) :
  1. Allez sur https://web3forms.com
  2. Entrez l'adresse `antonindenis@gmail.com` et cliquez sur
     **Create Access Key**.
  3. Vous recevez une clé par email (une suite de caractères).
  4. Dans l'admin du site (`/admin/`), section **Contact (formulaire)**,
     collez cette clé dans le champ **Clé d'accès Web3Forms**, puis
     publiez.
  5. Les messages envoyés depuis le formulaire arriveront directement
     dans `antonindenis@gmail.com`.
- **Mentions légales et politique de confidentialité** : les liens de
  pied de page pointent vers `#` — à remplacer dans l'admin une fois ces
  pages rédigées (obligatoires légalement pour un site professionnel
  français).
- Les liens **LinkedIn** et **Instagram** sont déjà renseignés dans
  `content/site.json`.
- **Design system Decap** : l'admin affiche des formulaires simples sans
  aperçu visuel en direct ; pour voir le rendu, ouvrez le site dans un
  autre onglet après publication.

## Limites de cette approche (pour rappel)

- Ajouter une **nouvelle section** ou changer la **mise en page** demande de
  modifier `index.html` — donc de repasser par moi ou un développeur.
  Modifier un texte, une photo ou une liste existante, en revanche, se fait
  entièrement depuis l'admin.
- Il n'y a pas d'aperçu en direct dans l'admin (contrairement à Carrd) :
  vous voyez le résultat en rafraîchissant le site après publication.
