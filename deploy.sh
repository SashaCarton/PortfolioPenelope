

# Se placer dans le répertoire principal du projet
PROJECT_DIR="/var/www/PortfolioPenelope"
FRONTEND_DIR="$PROJECT_DIR/frontend"

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
sudo npm install || { echo "Erreur: npm install failed"; exit 1; }

echo "Building frontend..."
sudo npm run build || { echo "Erreur: npm run build failed"; exit 1; }

echo "Déploiement terminé avec succès !"