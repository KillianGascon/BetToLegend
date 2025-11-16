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

  

1. **Architecture Full-Stack intégrée** : Next.js permet de développer à la fois le frontend et le backend dans le prjet, ce qui simplifie grandement le développement et le déploiement.
  

2. **Server-Side Rendering (SSR) et Static Site Generation (SSG)** : Pour le site de paris en ligne, le ssr permet de pré rendre les pages en chargeant les données.


3. **Optimisations** : Next fait aussi des traitements d'optimisation sur les images, liens, etc...
  

### Base de données : PostgreSQL avec Prisma ORM

  

**Pourquoi PostgreSQL ?**

  

 **Fiabilité et robustesse** : PostgreSQL est une base de données relationnelle qui sied au contexte de mon application tout en restant plutôt simple  

  

**Pourquoi Prisma ?**

  

1. **Facilité d'utilisation** : Prisma génère automatiquement un schéma de la BDD et des types TypeScript.

  

2. **Productivité** : L'API Prisma est intuitive, ce qui me permet d'écrire des requêtes complexes de manière simple.
  

### Authentification : Clerk

  

**Pourquoi Clerk ?**

  

1. **Rapidité d'implémentation** : Clerk permet de mettre en place un système d'authentification complet (inscription, connexion, gestion de session) en quelques minutes.

  

2. **Sécurité** : Clerk gère la sécurité (hashage de mots de passe, tokens JWT, protection CSRF) de manière professionnelle, ce qui est crucial pour cette application financière.
  

3. **Webhooks** : Le système de webhooks de clerk me permet .

  

### Traduction : i18next + react-i18next

  

**Pourquoi i18next ?**

  

1. **Support multi-langues** : i18next me permet de traduire le site grâce aux fichiers jsons 'locales', cela permet de supporter autant de langue que je souhaite.

  

2. **Détection automatique** : i18next  détecte automatiquement la langue du navigateur et me permet de la modifier manuellement.

  

### Linting et Formatage : Biome

  

**Pourquoi Biome ?**

  

**Performance** :Biome est rapide et versatile, il permet de remplacer Et prettier ET Eslint en un seul outil.

  

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

   git clone https://github.com/KillianGascon/BetToLegend.git

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

  3. **Configurer les variables d'environnement**

   - Créer un fichier `.env.local` à la racine du projet

   - Ajouter toutes les variables nécessaires (voir section suivante)


4. **Configurer la base de données**

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

├── app/                    # Pages et routes Next.js

│   ├── [locale]/           # Pages localisées (fr, en, ko)

│   │   ├── about/          # Page À propos

│   │   ├── admin/          # Page d'administration

│   │   ├── matchs/         # Pages de matchs

│   │   └── results/        # Page de résultats

│   ├── api/                # API Routes

│   │   ├── bets/           # Endpoints pour les paris

│   │   ├── games/          # Endpoints pour les jeux

│   │   ├── matches/        # Endpoints pour les matchs

│   │   ├── players/        # Endpoints pour les joueurs

│   │   ├── teams/          # Endpoints pour les équipes

│   │   ├── tournaments/   # Endpoints pour les tournois

│   │   ├── webhooks/       # Webhooks Clerk

│   │   └── me/             # Endpoint utilisateur actuel

│   ├── sign-in/            # Page de connexion

│   └── sign-up/            # Page d'inscription

├── components/             # Composants React

│   ├── admin/              # Composants admin

│   ├── landing/           # Composants landing page

│   ├── matchs/             # Composants matchs

│   ├── results/            # Composants résultats

│   └── Navbar.tsx          # Barre de navigation

├── lib/                    # Bibliothèques utilitaires

│   ├── i18n.ts             # Configuration i18n

│   └── prisma.ts           # Client Prisma

├── prisma/                 # Configuration Prisma

│   └── schema.prisma       # Schéma de base de données

├── public/                 # Fichiers statiques

│   └── uploads/            # Images uploadées

├── types/                  # Types TypeScript

├── utils/                  # Fonctions utilitaires

├── middleware.ts           # Middleware Next.js

├── next.config.ts          # Configuration Next.js

├── package.json            # Dépendances npm

└── tsconfig.json           # Configuration TypeScript

```

  

---

  

## Accès et configurations

  

### Variables d'environnement

  

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

  

```env

# Base de données PostgreSQL

DATABASE_URL="postgresql:...."

  

# Clerk - Authentification

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."

CLERK_SECRET_KEY="sk_..."

CLERK_WEBHOOK_SECRET="..."

```

Les variables ont étés envoyés par mail

### Accès à l'application

  

- **URL de développement** : [http://localhost:3000](http://localhost:3000)

- **URL de production** : https://www.syntaxlab.fr/fr

  

### Comptes de test

  

Pour tester l'application, vous pouvez :

  

1. **Créer un compte via l'interface**

   - Aller sur `/sign-up`

   - Créer un compte avec email/mot de passe

   - Le compte sera automatiquement synchronisé avec la base de données via webhook

  

2. **Utiliser le utilisateur admin

   - Se connecter au site avec le compte suivant
	   - Mail: gascon.killian007@gmail.com
	   - Mdp: Compte2tes)t

  

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

│                        CLIENT (Browser)                     │

│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │

│  │   React UI   │  │   i18next    │  │    Clerk     │     │

│  │  Components  │  │  (i18n)      │  │  (Auth UI)   │     │

│  └──────────────┘  └──────────────┘  └──────────────┘     │

└─────────────────────────────────────────────────────────────┘

                            │

                            │ HTTP Requests

                            ▼

┌─────────────────────────────────────────────────────────────┐

│                    NEXT.JS APPLICATION                      │

│  ┌──────────────────────────────────────────────────────┐   │

│  │              MIDDLEWARE (Clerk)                       │   │

│  │         - Authentication check                        │   │

│  │         - Route protection                            │   │

│  └──────────────────────────────────────────────────────┘   │

│                                                               │

│  ┌──────────────────┐  ┌──────────────────┐                │

│  │  APP ROUTER    │  │   API ROUTES      │                │

│  │  (Pages)       │  │   (Backend)       │                │

│  │                │  │                   │                │

│  │  - /[locale]   │  │  - /api/bets     │                │

│  │  - /sign-in    │  │  - /api/matches  │                │

│  │  - /sign-up    │  │  - /api/teams    │                │

│  │  - /admin      │  │  - /api/players  │                │

│  └──────────────────┘  └──────────────────┘                │

│                            │                                  │

│                            │ Prisma Client                    │

│                            ▼                                  │

│  ┌──────────────────────────────────────────────────────┐   │

│  │              PRISMA ORM                              │   │

│  │         - Type-safe queries                          │   │

│  │         - Migrations                                 │   │

│  └──────────────────────────────────────────────────────┘   │

└─────────────────────────────────────────────────────────────┘

                            │

                            │ SQL Queries

                            ▼

┌─────────────────────────────────────────────────────────────┐

│                   POSTGRESQL DATABASE                        │

│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │

│  │  users   │  │  matches │  │   bets    │  │  teams   │ │

│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │

│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │

│  │ players  │  │tournaments│ │  games   │                 │

│  └──────────┘  └──────────┘  └──────────┘                 │

└─────────────────────────────────────────────────────────────┘

                            │

                            │ Webhooks

                            ▼

┌─────────────────────────────────────────────────────────────┐

│                      CLERK SERVICE                          │

│         (User Management & Authentication)                   │

└─────────────────────────────────────────────────────────────┘

```

  

### Architecture des fichiers

  

```

app/

├── [locale]/              # Routes localisées

│   ├── page.tsx          # Landing page

│   ├── about/            # Page À propos

│   ├── admin/            # Page admin (CRUD)

│   ├── matchs/           # Pages matchs

│   │   ├── page.tsx      # Liste des matchs

│   │   └── [id]/         # Détail d'un match

│   └── results/          # Page résultats

│

├── api/                  # Backend API

│   ├── bets/            # Gestion des paris

│   ├── matches/         # Gestion des matchs

│   ├── teams/           # Gestion des équipes

│   ├── players/         # Gestion des joueurs

│   ├── tournaments/     # Gestion des tournois

│   ├── games/           # Gestion des jeux

│   ├── webhooks/        # Webhooks Clerk

│   └── me/              # Utilisateur actuel

│

├── sign-in/             # Page connexion

└── sign-up/             # Page inscription

  

components/

├── admin/               # Composants admin (CRUD)

├── landing/            # Composants landing

├── matchs/              # Composants matchs

├── results/             # Composants résultats

└── Navbar.tsx          # Navigation globale

  

lib/

├── i18n.ts             # Configuration i18n

└── prisma.ts           # Client Prisma singleton

  

prisma/

└── schema.prisma       # Schéma de base de données

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

  

Cette documentation couvre tous les aspects nécessaires pour comprendre, installer, configurer et déployer l'application BetToLegend.