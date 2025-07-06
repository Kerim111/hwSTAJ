# -------- 1) Build aşaması --------
FROM node:18-alpine AS builder
WORKDIR /app

# Kök package.json (workspace vs. kullanıyorsanız) ve alt dizinler için
COPY package*.json ./
COPY frontend/package*.json frontend/
COPY backend/package*.json backend/
RUN npm install

# Frontend’i derle
COPY frontend/ frontend/
RUN cd frontend && npm run build

# -------- 2) Çalıştırma aşaması --------
FROM node:18-alpine
WORKDIR /app

# Sadece production bağımlılıklarını yükle
COPY backend/package*.json backend/
RUN cd backend && npm install --production

# Backend kodunu ve build edilmiş React’i kopyala
COPY backend/ backend/
COPY --from=builder /app/frontend/build backend/build

WORKDIR /app/backend
ENV NODE_ENV=production
ENV PORT=${PORT:-3000}
EXPOSE ${PORT}

# Uygulamayı başlat
CMD ["npm", "run", "start"]
