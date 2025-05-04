#!/bin/bash
set -e
set -o pipefail

# Rediriger les sorties d'autossh vers des fichiers de log
echo "Démarrage des tunnels SSH..."
autossh -M 0 -f -N -R 8080:localhost:80 ubuntu@54.36.209.81 &
autossh -M 0 -f -N -R 6969:localhost:69 ubuntu@54.36.209.81 -p 22 &

# Vérification que les tunnels sont actifs
if ! ps aux | grep -v grep | grep "autossh"; then
  echo "Erreur : Les tunnels SSH n'ont pas démarré correctement."
  exit 1
fi

# Se placer dans le répertoire principal du projet
PROJECT_DIR="/Agence/Web/Penelope"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || { echo "Erreur: répertoire principal introuvable"; exit 1; }
pwd

echo "Fetching and pulling latest changes from Git..."
git fetch origin main || { echo "Erreur: git fetch failed"; exit 1; }
git reset --hard origin/main || { echo "Erreur: git reset failed"; exit 1; }

# Aller dans le répertoire du front-end
echo "Navigating to frontend directory: $FRONTEND_DIR"
cd "$FRONTEND_DIR" || { echo "Erreur: répertoire front-end introuvable"; exit 1; }
pwd

echo "Installing frontend dependencies..."
npm install || { echo "Erreur: npm install failed"; exit 1; }

echo "Building frontend..."
npm run build || { echo "Erreur: npm run build failed"; exit 1; }

# Revenir au répertoire principal et démarrer le backend
echo "Navigating to backend directory: $BACKEND_DIR"
cd "$BACKEND_DIR" || { echo "Erreur: répertoire backend introuvable"; exit 1; }

echo "Installing backend dependencies..."
npm install || { echo "Erreur: npm install failed"; exit 1; }

echo "Building backend..."
npm run build || { echo "Erreur: npm run build failed"; exit 1; }

echo "Restarting backend with PM2..."
pm2 stop strapi || echo "Strapi was not running, skipping stop"
pm2 start npm --name strapi -- run start &

echo "Déploiement terminé avec succès !"