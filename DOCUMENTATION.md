# Documentation du Projet BetToLegend

## Table des matières

1. [Choix technologiques](#choix-technologiques)
2. [Fonctionnalités bonus](#fonctionnalités-bonus)
3. [Ressources nécessaires](#ressources-nécessaires)
4. [Accès et configurations](#accès-et-configurations)
5. [Architecture](#architecture)

---

## Choix technologiques

### Framework : Next.js 15.5.4

**Pourquoi Next.js ?**

J'ai choisi Next.js pour plusieurs raisons stratégiques :

1. **Architecture Full-Stack intégrée** : Next.js permet de développer à la fois le frontend et le backend dans un seul projet, ce qui simplifie grandement le développement et le déploiement. Les API Routes (`app/api/`) permettent de créer des endpoints RESTful sans avoir besoin d'un serveur backend séparé.

2. **Server-Side Rendering (SSR) et Static Site Generation (SSG)** : Pour une plateforme de paris en temps réel, le SSR permet de pré-rendre les pages avec les données les plus récentes, améliorant les performances perçues et le SEO.

3. **App Router (Next.js 13+)** : L'utilisation du nouveau App Router avec React Server Components permet une meilleure séparation des préoccupations, une gestion optimale des données, et des performances améliorées grâce au streaming et au code splitting automatique.

4. **Optimisations intégrées** : Next.js inclut nativement l'optimisation d'images, le code splitting, le lazy loading, et la compression, essentiels pour une application web moderne.

5. **Écosystème React** : Next.js étant construit sur React, il bénéficie de tout l'écosystème React (composants, hooks, bibliothèques) tout en ajoutant des fonctionnalités spécifiques au web.

6. **Déploiement simplifié** : Vercel (créateur de Next.js) offre un déploiement en un clic, mais Next.js peut aussi être déployé sur n'importe quelle plateforme Node.js.

### Base de données : PostgreSQL avec Prisma ORM

**Pourquoi PostgreSQL ?**

1. **Fiabilité et robustesse** : PostgreSQL est une base de données relationnelle mature et fiable, parfaite pour gérer des transactions financières (paris, gains, pertes).

2. **Intégrité des données** : Les contraintes de clés étrangères, les index, et les types de données stricts garantissent la cohérence des données critiques.

3. **Performance** : Excellente performance pour les requêtes complexes avec de nombreuses relations (équipes, joueurs, matchs, paris, cotes).

**Pourquoi Prisma ?**

1. **Type-safety** : Prisma génère des types TypeScript automatiquement à partir du schéma, réduisant drastiquement les erreurs de typage.

2. **Productivité** : L'API Prisma est intuitive et expressive, permettant d'écrire des requêtes complexes de manière simple.

3. **Migrations** : Système de migrations intégré pour gérer l'évolution du schéma de base de données de manière versionnée.

4. **Relations** : Gestion automatique des relations entre modèles, simplifiant les requêtes avec jointures.

### Authentification : Clerk

**Pourquoi Clerk ?**

1. **Rapidité d'implémentation** : Clerk permet de mettre en place un système d'authentification complet (inscription, connexion, gestion de session) en quelques minutes.

2. **Sécurité** : Clerk gère la sécurité (hashage de mots de passe, tokens JWT, protection CSRF) de manière professionnelle, ce qui est crucial pour une application financière.

3. **Intégration Next.js** : Clerk offre une intégration native avec Next.js via `@clerk/nextjs`, avec middleware et composants React prêts à l'emploi.

4. **Webhooks** : Système de webhooks pour synchroniser les utilisateurs Clerk avec la base de données locale (création, mise à jour, suppression).

5. **UI personnalisable** : Les composants Clerk peuvent être stylisés pour correspondre au design de l'application.

### Internationalisation : i18next + react-i18next

**Pourquoi i18next ?**

1. **Support multi-langues** : i18next est la solution standard pour l'internationalisation dans React, supportant 3 langues (FR, EN, KO).

2. **Détection automatique** : Détection automatique de la langue du navigateur avec possibilité de changement manuel.

3. **Structure modulaire** : Les traductions sont organisées par namespace et par langue, facilitant la maintenance.

4. **Performance** : Chargement lazy des traductions et mise en cache dans le localStorage.

### Styling : Tailwind CSS 4

**Pourquoi Tailwind CSS ?**

1. **Utility-first** : Approche utility-first permettant de construire des interfaces rapidement sans écrire de CSS custom.

2. **Responsive design** : Classes responsive intégrées (`sm:`, `md:`, `lg:`, `xl:`) facilitant la création d'interfaces adaptatives.

3. **Cohérence** : Système de design cohérent avec des couleurs, espacements, et typographies prédéfinis.

4. **Performance** : Purge automatique du CSS non utilisé en production, réduisant la taille du bundle.

5. **Personnalisation** : Configuration via `tailwind.config` pour définir des couleurs custom (legend-red, legend-blue, legend-dark).

### Validation : Zod

**Pourquoi Zod ?**

1. **Type-safety** : Zod permet de valider les données à l'exécution tout en inférant des types TypeScript.

2. **Sécurité** : Validation des données entrantes dans les API Routes, protégeant contre les injections et les données malformées.

3. **Messages d'erreur** : Messages d'erreur clairs et personnalisables pour une meilleure expérience développeur.

### Linting et Formatage : Biome

**Pourquoi Biome ?**

1. **Performance** : Biome est extrêmement rapide, remplaçant ESLint et Prettier en un seul outil.

2. **Simplicité** : Configuration minimale, règles sensées par défaut.

3. **Intégration** : Intégration native avec les éditeurs et les pipelines CI/CD.

---

## Fonctionnalités bonus

Voici une liste des fonctionnalités supplémentaires que j'ai implémentées au-delà des exigences de base :

### 1. **Système d'authentification complet avec Clerk**
   - Inscription et connexion utilisateurs
   - Gestion de session sécurisée
   - Synchronisation automatique avec la base de données via webhooks
   - Protection des routes sensibles (admin)
   - Interface de connexion/inscription personnalisée avec design cohérent

### 2. **Internationalisation (i18n) - 3 langues**
   - Support du français, anglais et coréen
   - Détection automatique de la langue
   - Sélecteur de langue dans la navbar
   - Traductions complètes de l'interface utilisateur
   - Persistance de la langue choisie dans le localStorage

### 3. **Interface utilisateur avancée**
   - **Navbar sticky avec effet blur** : La navbar reste fixe en haut lors du scroll avec un effet de flou sur le background
   - **Design responsive** : Interface adaptée pour mobile, tablette et desktop
   - **Menu hamburger mobile** : Navigation optimisée pour les petits écrans
   - **Animations et transitions** : Transitions fluides sur les interactions (hover, click, scroll)
   - **Design system cohérent** : Palette de couleurs personnalisée (legend-red, legend-blue, legend-dark)

### 4. **Page de résultats avancée**
   - **Vue calendrier** : Affichage des matchs par jour dans une grille calendrier
   - **Vue liste** : Affichage en liste avec filtres par jour
   - **Vue carrousel horizontal** : Navigation fluide entre les matchs
   - **Vue intelligente** : Adaptation automatique selon le nombre de matchs
   - **États vides** : Messages informatifs quand aucun match n'est disponible

### 5. **Page de détail de match enrichie**
   - **Scoreboard en temps réel** : Affichage des scores et statut du match
   - **Section de paris en direct** : Interface dédiée pour placer des paris pendant le match
   - **Panneau de paris** : Affichage des paris de l'utilisateur avec statuts
   - **Informations détaillées** : Format du match, date, équipes, cotes
   - **Design optimisé pour l'action** : Interface pensée pour réduire la charge cognitive

### 6. **Système de calcul de cotes dynamique**
   - **Calcul automatique des cotes** : Les cotes sont calculées dynamiquement en fonction des volumes de paris
   - **Mise à jour en temps réel** : Les cotes s'ajustent automatiquement quand un pari est placé
   - **Formule de calcul équilibrée** : Algorithme qui garantit l'équité et la rentabilité

### 7. **Gestion complète des entités**
   - **CRUD complet pour les équipes** : Création, lecture, mise à jour, suppression
   - **CRUD complet pour les matchs** : Gestion complète du cycle de vie d'un match
   - **CRUD pour les joueurs** : Gestion des profils de joueurs
   - **CRUD pour les jeux** : Gestion des jeux e-sport
   - **CRUD pour les tournois** : Gestion des compétitions
   - **CRUD pour les équipes-joueurs** : Gestion des rosters

### 8. **Upload d'images**
   - Upload de logos d'équipes
   - Upload d'avatars de joueurs
   - Stockage local dans `/public/uploads/`
   - Validation des types de fichiers

### 9. **Page "À propos" complète**
   - Section hero avec présentation de la plateforme
   - Mission et valeurs
   - Highlights des fonctionnalités
   - Call-to-action

### 10. **Gestion des statuts de paris**
   - Statuts : `pending`, `won`, `lost`
   - Calcul automatique des gains/pertes
   - Historique des paris de l'utilisateur
   - Affichage du solde et statistiques

### 11. **Système de rôles**
   - Rôles utilisateurs dans la base de données (`user`, `admin`)
   - Protection des routes admin
   - Interface admin dédiée

### 12. **Optimisations techniques**
   - **Turbopack** : Utilisation de Turbopack pour des builds et rechargements ultra-rapides
   - **TypeScript strict** : Typage strict pour éviter les erreurs
   - **Code splitting automatique** : Optimisation du chargement des pages
   - **Images optimisées** : Utilisation de `next/image` pour l'optimisation automatique

---

## Ressources nécessaires

### Prérequis système

- **Node.js** : Version 18.x ou supérieure
- **npm** ou **yarn** ou **pnpm** : Gestionnaire de paquets
- **PostgreSQL** : Version 14 ou supérieure
- **Git** : Pour cloner le repository

### Installation

1. **Cloner le repository**
   ```bash
   git clone <url-du-repository>
   cd BetToLegend
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Configurer la base de données**
   - Créer une base de données PostgreSQL
   - Configurer la variable d'environnement `DATABASE_URL` (voir section suivante)
   - Exécuter les migrations Prisma :
     ```bash
     npx prisma migrate dev
     ```
   - Générer le client Prisma :
     ```bash
     npx prisma generate
     ```

4. **Configurer les variables d'environnement**
   - Créer un fichier `.env.local` à la racine du projet
   - Ajouter toutes les variables nécessaires (voir section suivante)

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   ```

6. **Ouvrir l'application**
   - Ouvrir [http://localhost:3000](http://localhost:3000) dans votre navigateur

### Commandes disponibles

- `npm run dev` : Lance le serveur de développement avec Turbopack
- `npm run build` : Construit l'application pour la production
- `npm run start` : Lance le serveur de production
- `npm run lint` : Vérifie le code avec Biome
- `npm run format` : Formate le code avec Biome

### Structure des fichiers

```
BetToLegend/
├── app/                    # Pages et routes Next.js
│   ├── [locale]/           # Pages localisées (fr, en, ko)
│   │   ├── about/          # Page À propos
│   │   ├── admin/          # Page d'administration
│   │   ├── matchs/         # Pages de matchs
│   │   └── results/        # Page de résultats
│   ├── api/                # API Routes
│   │   ├── bets/           # Endpoints pour les paris
│   │   ├── games/          # Endpoints pour les jeux
│   │   ├── matches/        # Endpoints pour les matchs
│   │   ├── players/        # Endpoints pour les joueurs
│   │   ├── teams/          # Endpoints pour les équipes
│   │   ├── tournaments/   # Endpoints pour les tournois
│   │   ├── webhooks/       # Webhooks Clerk
│   │   └── me/             # Endpoint utilisateur actuel
│   ├── sign-in/            # Page de connexion
│   └── sign-up/            # Page d'inscription
├── components/             # Composants React
│   ├── admin/              # Composants admin
│   ├── landing/           # Composants landing page
│   ├── matchs/             # Composants matchs
│   ├── results/            # Composants résultats
│   └── Navbar.tsx          # Barre de navigation
├── lib/                    # Bibliothèques utilitaires
│   ├── i18n.ts             # Configuration i18n
│   └── prisma.ts           # Client Prisma
├── prisma/                 # Configuration Prisma
│   └── schema.prisma       # Schéma de base de données
├── public/                 # Fichiers statiques
│   └── uploads/            # Images uploadées
├── types/                  # Types TypeScript
├── utils/                  # Fonctions utilitaires
├── middleware.ts           # Middleware Next.js
├── next.config.ts          # Configuration Next.js
├── package.json            # Dépendances npm
└── tsconfig.json           # Configuration TypeScript
```

---

## Accès et configurations

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Base de données PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/bet_to_legend?schema=public"

# Clerk - Authentification
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."

# URL de l'application (pour les redirections)
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Configuration Clerk

1. **Créer un compte Clerk**
   - Aller sur [https://clerk.com](https://clerk.com)
   - Créer un compte gratuit
   - Créer une nouvelle application

2. **Récupérer les clés API**
   - Dans le dashboard Clerk, aller dans "API Keys"
   - Copier `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `CLERK_SECRET_KEY`
   - Les ajouter dans `.env.local`

3. **Configurer les webhooks**
   - Dans le dashboard Clerk, aller dans "Webhooks"
   - Créer un nouveau webhook pointant vers : `https://votre-domaine.com/api/webhooks/clerk`
   - Sélectionner les événements : `user.created`, `user.updated`, `user.deleted`
   - Copier le "Signing Secret" et l'ajouter comme `CLERK_WEBHOOK_SECRET` dans `.env.local`

### Configuration de la base de données

1. **Installer PostgreSQL**
   - Télécharger depuis [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
   - Installer et créer un utilisateur/mot de passe

2. **Créer la base de données**
   ```sql
   CREATE DATABASE bet_to_legend;
   ```

3. **Configurer la connexion**
   - Mettre à jour `DATABASE_URL` dans `.env.local` avec vos identifiants

4. **Exécuter les migrations**
   ```bash
   npx prisma migrate dev --name init
   ```

### Accès à l'application

- **URL de développement** : [http://localhost:3000](http://localhost:3000)
- **URL de production** : (à configurer selon votre hébergement)

### Comptes de test

Pour tester l'application, vous pouvez :

1. **Créer un compte via l'interface**
   - Aller sur `/sign-up`
   - Créer un compte avec email/mot de passe
   - Le compte sera automatiquement synchronisé avec la base de données via webhook

2. **Créer un utilisateur admin manuellement**
   - Se connecter à la base de données
   - Mettre à jour le champ `role` de l'utilisateur à `"admin"` dans la table `users`

### Accès aux ressources externes

- **Clerk Dashboard** : [https://dashboard.clerk.com](https://dashboard.clerk.com)
- **Documentation Next.js** : [https://nextjs.org/docs](https://nextjs.org/docs)
- **Documentation Prisma** : [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Documentation Clerk** : [https://clerk.com/docs](https://clerk.com/docs)

---

## Architecture

### Architecture logicielle

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   React UI   │  │   i18next    │  │    Clerk     │     │
│  │  Components  │  │  (i18n)      │  │  (Auth UI)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP Requests
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              MIDDLEWARE (Clerk)                       │   │
│  │         - Authentication check                        │   │
│  │         - Route protection                            │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  APP ROUTER    │  │   API ROUTES      │                │
│  │  (Pages)       │  │   (Backend)       │                │
│  │                │  │                   │                │
│  │  - /[locale]   │  │  - /api/bets     │                │
│  │  - /sign-in    │  │  - /api/matches  │                │
│  │  - /sign-up    │  │  - /api/teams    │                │
│  │  - /admin      │  │  - /api/players  │                │
│  └──────────────────┘  └──────────────────┘                │
│                            │                                  │
│                            │ Prisma Client                    │
│                            ▼                                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              PRISMA ORM                              │   │
│  │         - Type-safe queries                          │   │
│  │         - Migrations                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   POSTGRESQL DATABASE                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │  users   │  │  matches │  │   bets    │  │  teams   │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ players  │  │tournaments│ │  games   │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Webhooks
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CLERK SERVICE                          │
│         (User Management & Authentication)                   │
└─────────────────────────────────────────────────────────────┘
```

### Architecture des fichiers

```
app/
├── [locale]/              # Routes localisées
│   ├── page.tsx          # Landing page
│   ├── about/            # Page À propos
│   ├── admin/            # Page admin (CRUD)
│   ├── matchs/           # Pages matchs
│   │   ├── page.tsx      # Liste des matchs
│   │   └── [id]/         # Détail d'un match
│   └── results/          # Page résultats
│
├── api/                  # Backend API
│   ├── bets/            # Gestion des paris
│   ├── matches/         # Gestion des matchs
│   ├── teams/           # Gestion des équipes
│   ├── players/         # Gestion des joueurs
│   ├── tournaments/     # Gestion des tournois
│   ├── games/           # Gestion des jeux
│   ├── webhooks/        # Webhooks Clerk
│   └── me/              # Utilisateur actuel
│
├── sign-in/             # Page connexion
└── sign-up/             # Page inscription

components/
├── admin/               # Composants admin (CRUD)
├── landing/            # Composants landing
├── matchs/              # Composants matchs
├── results/             # Composants résultats
└── Navbar.tsx          # Navigation globale

lib/
├── i18n.ts             # Configuration i18n
└── prisma.ts           # Client Prisma singleton

prisma/
└── schema.prisma       # Schéma de base de données
```

### Flux de données

#### 1. Authentification utilisateur

```
User → /sign-in → Clerk UI → Clerk Service
                                    │
                                    │ Webhook (user.created)
                                    ▼
                            /api/webhooks/clerk
                                    │
                                    │ Prisma
                                    ▼
                            PostgreSQL (users table)
```

#### 2. Placement d'un pari

```
User → Match Page → BetModal → POST /api/bets
                                        │
                                        ├─ Validation (Zod)
                                        ├─ Vérification solde
                                        ├─ Calcul cotes dynamique
                                        ├─ Création pari (Prisma)
                                        └─ Mise à jour solde
                                        │
                                        ▼
                            PostgreSQL (bets, users tables)
```

#### 3. Gestion admin (CRUD)

```
Admin → /admin → AdminPage → API Route (POST/PUT/DELETE)
                                        │
                                        ├─ Validation (Zod)
                                        ├─ Upload image (si applicable)
                                        ├─ Prisma operation
                                        └─ Return updated data
                                        │
                                        ▼
                            PostgreSQL (teams/matches/players/etc.)
```

### Communication entre applications

#### Frontend ↔ Backend (API Routes)

- **Protocole** : HTTP/HTTPS
- **Format** : JSON
- **Méthodes** : GET, POST, PUT, DELETE
- **Authentification** : Clerk session tokens (via middleware)

#### Next.js ↔ PostgreSQL

- **ORM** : Prisma Client
- **Connexion** : Connection pool via `DATABASE_URL`
- **Requêtes** : Type-safe queries générées depuis le schéma Prisma

#### Next.js ↔ Clerk

- **SDK** : `@clerk/nextjs`
- **Authentification** : JWT tokens gérés par Clerk
- **Webhooks** : Svix pour vérifier la signature des webhooks
- **Synchronisation** : Webhooks pour créer/mettre à jour/supprimer les utilisateurs dans la DB locale

### Schéma de base de données

```
users
  ├── id (UUID, PK)
  ├── clerkid (String, unique)
  ├── username (String, unique)
  ├── email (String, unique)
  ├── balance (Decimal)
  ├── total_bet (Decimal)
  ├── total_won (Decimal)
  └── role (String, default: "user")
      │
      └── bets (1:N)

bets
  ├── id (UUID, PK)
  ├── user_id (UUID, FK → users)
  ├── match_id (UUID, FK → matches)
  ├── team_id (UUID, FK → teams)
  ├── amount (Decimal)
  ├── odds (Decimal)
  ├── potential_payout (Decimal)
  ├── status (String: "pending" | "won" | "lost")
  └── placed_at (DateTime)

matches
  ├── id (UUID, PK)
  ├── tournament_id (UUID, FK → tournaments)
  ├── team1_id (UUID, FK → teams)
  ├── team2_id (UUID, FK → teams)
  ├── game_id (UUID, FK → games)
  ├── match_date (DateTime)
  ├── status (String: "scheduled" | "live" | "finished")
  ├── team1_score (Int)
  ├── team2_score (Int)
  ├── winner_id (UUID, FK → teams)
  └── format (String)
      │
      ├── bets (1:N)
      └── match_odds (1:N)

teams
  ├── id (UUID, PK)
  ├── name (String)
  ├── tag (String, unique)
  ├── country (String)
  ├── logo_url (String)
  ├── founded_year (Int)
  └── total_earnings (Decimal)
      │
      ├── bets (1:N)
      ├── match_odds (1:N)
      └── team_players (1:N)

players
  ├── id (UUID, PK)
  ├── username (String, unique)
  ├── real_name (String)
  ├── country (String)
  ├── age (Int)
  ├── role (String)
  ├── avatar_url (String)
  └── total_earnings (Decimal)
      │
      └── team_players (1:N)

team_players
  ├── id (UUID, PK)
  ├── team_id (UUID, FK → teams)
  ├── player_id (UUID, FK → players)
  ├── position (String)
  ├── join_date (Date)
  ├── salary (Decimal)
  └── is_active (Boolean)

games
  ├── id (UUID, PK)
  ├── name (String)
  └── category (String)
      │
      ├── matches (1:N)
      └── tournaments (1:N)

tournaments
  ├── id (UUID, PK)
  ├── name (String)
  ├── game_id (UUID, FK → games)
  ├── prize_pool (Decimal)
  ├── start_date (Date)
  ├── end_date (Date)
  ├── location (String)
  └── status (String)
      │
      └── matches (1:N)

match_odds
  ├── id (UUID, PK)
  ├── match_id (UUID, FK → matches)
  ├── team_id (UUID, FK → teams)
  ├── odds (Decimal)
  ├── created_at (DateTime)
  └── updated_at (DateTime)
```

### Sécurité

1. **Authentification** : Clerk gère l'authentification de manière sécurisée
2. **Validation** : Zod valide toutes les données entrantes
3. **Protection CSRF** : Next.js et Clerk incluent une protection CSRF
4. **Webhooks sécurisés** : Signature Svix pour vérifier l'authenticité des webhooks
5. **SQL Injection** : Prisma prépare automatiquement les requêtes, empêchant les injections SQL
6. **Type-safety** : TypeScript et Prisma garantissent la cohérence des types

---

## Conclusion

Cette documentation couvre tous les aspects nécessaires pour comprendre, installer, configurer et déployer l'application BetToLegend. Le projet utilise des technologies modernes et éprouvées, avec une architecture claire et maintenable.

Pour toute question ou problème, référez-vous à la documentation officielle des technologies utilisées ou contactez l'équipe de développement.

