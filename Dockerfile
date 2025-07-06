# -------- 1) Client’ı derle --------
FROM node:18-alpine AS builder-client
WORKDIR /hwSTAJ/client

# 1.1) Client bağımlılıklarını yükle
COPY client/package*.json ./
RUN npm ci

# 1.2) Client kodunu kopyala ve build et
COPY client/ ./
RUN npm run build

# -------- 2) Server için prod bağımlılıkları --------
FROM node:18-alpine AS builder-server
WORKDIR /hwSTAJ/server

# 2.1) Server bağımlılıklarını yükle (sadece prod)
COPY server/package*.json ./
RUN npm ci --omit=dev

# -------- 3) Çalıştırma imajı --------
FROM node:18-alpine
WORKDIR /hwSTAJ

# 3.1) Server kodunu kopyala
COPY --from=builder-server /hwSTAJ/server ./server

# 3.2) Build edilmiş client’ı server içine al
COPY --from=builder-client /hwSTAJ/client/build ./server/build

WORKDIR /hwSTAJ/server
ENV NODE_ENV=production
# Render veya local fallback olarak
ENV PORT=${PORT:-3000}
EXPOSE ${PORT}

# Sunucuyu başlat
CMD ["npm", "run", "start"]
