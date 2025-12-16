This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


# Projet Final - Plateforme de Paris E-sportifs

Vous êtes un jeune étudiant, en troisième année d'école d'ingénierie informatique !
Un client vient vous voir, avec à ses côtés un de vos meilleurs amis !
(ou amie, comme vous voulez 😉)

Cette personne vous présente son projet **RÉVOLUTIONNAIRE** !

**L'idée du siècle !**

Une plateforme de paris sportifs en ligne ! Mais pas n'importe laquelle : une plateforme de paris **E-sportifs** !
Après quelques heures de discussions et d'explications, vous acceptez cette mission.
Un VC des Émirats Arabes Unis est derrière et a besoin d'un POC qui claque !
Sans quoi, il ne financera pas le projet, et vous pourrez dire adieu à toute possibilité de travailler avec ce client.

L'idée est donc de réaliser une première version fonctionnelle, la plus simple possible.
Chaque fonctionnalité ajoutée sera récompensée, et chaque élément créatif ou idée originale le sera également.

Vous avez à votre disposition un export SQL des données qu'on pourrait avoir dans ce genre d'application.
Vous êtes totalement libre sur le choix des technologies (seule condition : ça doit être du JS/TS dans l'écosystème).
Tout le reste est libre : le design, la direction artistique, et les équipes que vous voulez faire s’affronter.

Les données fournies ne sont pas obligatoires : vous pouvez, si vous le souhaitez, en ajouter, en supprimer, ou les modifier comme bon vous semble.
Vous pouvez demander un format de données spécifique en fonction de ce que vous avez en tête.

Je vous fournis également un moodboard, une charte graphique, et des liens vers toutes les ressources que vous pourrez utiliser.
VOUS AVEZ LA POSSIBILITÉE D'IGNORER TOTALEMENT CETTE PARTIE, et vous êtes libre de choisir la charte graphique que vous voulez

On vous demande les fonctionnalités suivantes :

- **Landing** : présentation de l'idée rapidement
- **Admin** : page de création d'une nouvelle équipe
  - pouvoir créer une nouvelle équipe
  - pouvoir uploader une image de profil de cette équipe
  - pouvoir modifier cette équipe
  - pouvoir supprimer une équipe

- **Admin** : page de création d'un match
  - pouvoir ajouter un nouveau match
  - pouvoir modifier un match en cours
  - pouvoir supprimer un match

- **Visiteur** : page de paris sur les matchs ouverts
  - possibilité de placer une nouvelle offre

- **Visiteur** : voir les résultats
- **Visiteur** : être capable de voir ses gains et ses pertes

Je ne vous demande pas spécifiquement de mettre en place un système d'authentification et de connexion, mais vous êtes libre de le faire.
Par exemple, si vous avez choisi de déporter votre backend vers un CMS ou une solution tierce, vous pouvez tout à fait l’implémenter : ce sera pris en compte dans l’évaluation.
Mais si vous ne vous en sentez pas capable, cela peut représenter une trop grande perte de temps.

(Je souligne que dans un vrai projet professionnel, ce serait une des premières briques à mettre en place.)


Docker Implementation Walkthrough
I have added Docker support to your project. Here is a summary of the changes and how to use them.

Changes Made
1. 
next.config.ts
Enabled standalone output. This tells Next.js to automatically trace import dependencies and create a smaller production build that doesn't require the strict node_modules structure of development.

const nextConfig: NextConfig = {
  output: "standalone",
};
2. 
.dockerignore
Added a 
.dockerignore
 file to ensure we don't copy unnecessary files (like your local node_modules or secrets) into the Docker image.

3. 
Dockerfile
Created a multi-stage 
Dockerfile
.

How to Build and Run
To build the Docker image:

docker build -t bet-to-legend .
To run the container:

docker run -p 3000:3000 bet-to-legend
detailed Explanation of the Dockerfile
The 
Dockerfile
 uses a technique called multi-stage builds to keep the final image size small.

Stage 1: deps: Installs dependencies. We separate this so that if you change your code but not your 
package.json
, Docker caches this layer and doesn't re-install node_modules.
Stage 2: builder:
Copies the modules from deps.
Runs npx prisma generate to create the Prisma client.
Runs npm run build to compile the Next.js app.
Stage 3: runner:
Starts with a fresh, empty Node.js alpine image.
Copies only the necessary files from the builder stage (standalone folder, static assets, public folder).
Sets up a non-root user (nextjs) for security.
Exposes port 3000 and starts the server with node server.js.