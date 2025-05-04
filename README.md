# Portfolio de Pénélope Letienne

Ce projet est un portfolio interactif développé pour présenter les travaux et compétences de Pénélope Letienne, une graphiste et illustratrice indépendante. Le projet est divisé en deux parties : un frontend développé avec Vue.js et un backend basé sur Strapi.

## Fonctionnalités principales

- **Page d'accueil** : Présentation générale et introduction.
- **À propos** : Informations sur l'artiste, son parcours et ses études.
- **Projets** : Liste des projets avec des détails et des médias associés.
- **Contact** : Formulaire pour envoyer un message directement via l'API Strapi.
- **Administration** : Interface d'administration intégrée via Strapi pour gérer les contenus.

## Structure du projet

- **frontend/** : Contient le code source du frontend développé avec Vue.js et Vite.
- **backend/** : Contient le code source du backend basé sur Strapi.

## Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- PostgreSQL (pour la base de données du backend)

## Installation

1. Clonez le dépôt :

   ```bash
   git clone <URL_DU_DEPOT>
   cd PortfolioPenelope
   ```

2. Installez les dépendances pour le frontend et le backend :

   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Configurez les variables d'environnement :

   - Backend : Modifiez le fichier `.env` dans le dossier `backend` pour configurer la base de données et les clés secrètes.

## Démarrage du projet

### Backend (Strapi)

1. Démarrez le serveur Strapi :

   ```bash
   cd backend
   npm run develop
   ```

2. Accédez à l'interface d'administration Strapi :

   - URL : [http://localhost:1337/admin](http://localhost:1337/admin)

### Frontend (Vue.js)

1. Démarrez le serveur de développement :

   ```bash
   cd frontend
   npm run dev
   ```

2. Accédez à l'application :

   - URL : [http://localhost:5173](http://localhost:5173)

## Déploiement

Pour déployer le projet, configurez un serveur pour le backend (par exemple, Heroku ou AWS) et un hébergement statique pour le frontend (par exemple, Netlify ou Vercel).

## Contribution

Les contributions sont les bienvenues ! Veuillez soumettre une pull request ou ouvrir une issue pour discuter des changements.

## Licence

Ce projet est sous licence MIT.
