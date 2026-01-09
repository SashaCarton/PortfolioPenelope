# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY . .

# Build for production
RUN npm run build

# Stage 2: Production - Serve with Vite preview
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

EXPOSE 4173

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "4173"]

# Stage 3: Development
FROM node:20-alpine AS development

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copy source code
COPY . .

EXPOSE 5173

CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port 5173"]
