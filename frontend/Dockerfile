# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .
RUN npm run build

# Stage 2: Production - Serve static files with Nginx
FROM nginx:alpine

# Supprime la conf par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copie les fichiers statiques
COPY --from=builder /app/dist /usr/share/nginx/html

# Copie un fichier de conf Nginx simple pour SPA
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 4173

CMD ["nginx", "-g", "daemon off;"]
