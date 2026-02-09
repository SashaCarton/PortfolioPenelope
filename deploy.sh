

# Se placer dans le répertoire principal du projet
PROJECT_DIR="/var/www/PortfolioPenelope"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "Navigating to project directory: $PROJECT_DIR"
cd "$PROJECT_DIR" || { echo "Erreur: répertoire principal introuvable"; exit 1; }
pwd

echo "Fetching and pulling latest changes from Git..."
git fetch origin main || { echo "Erreur: git fetch failed"; exit 1; }
git reset --hard origin/main || { echo "Erreur: git reset failed"; exit 1; }

# ── Backend ──
echo "Navigating to backend directory: $BACKEND_DIR"
cd "$BACKEND_DIR" || { echo "Erreur: répertoire back-end introuvable"; exit 1; }
pwd

echo "Installing backend dependencies..."
npm install || { echo "Erreur: npm install backend failed"; exit 1; }

# Corriger les permissions sur dist/ (évite EACCES sur tsbuildinfo)
if [ -d "dist" ]; then
  sudo chown -R $(whoami):$(whoami) dist/
fi

echo "Building backend (Strapi)..."
npm run build || { echo "Erreur: npm run build backend failed"; exit 1; }

echo "Restarting Strapi..."
sudo systemctl restart strapi 2>/dev/null || sudo pm2 restart strapi 2>/dev/null || echo "⚠️  Pensez à redémarrer Strapi manuellement"

# ── Frontend ──
echo "Navigating to frontend directory: $FRONTEND_DIR"
cd "$FRONTEND_DIR" || { echo "Erreur: répertoire front-end introuvable"; exit 1; }
pwd

echo "Installing frontend dependencies..."
npm install || { echo "Erreur: npm install failed"; exit 1; }

echo "Building frontend..."
npm run build || { echo "Erreur: npm run build failed"; exit 1; }

echo "Déploiement terminé avec succès !"