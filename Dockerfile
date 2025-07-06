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
# -------- 3) Çalıştırma imajı --------
FROM node:18-alpine

# 1) Çalışma dizinini doğrudan server klasörüne ayarla
WORKDIR /hwSTAJ/server    # veya /app/server

# 2) Builder’dan server kodunu getir
COPY --from=builder-server /hwSTAJ/server .   # veya /app/server .

# 3) Builder’dan React build dosyalarını server altına kopyala
COPY --from=builder-client /hwSTAJ/client/build ./build

# 4) Üretim ortamı ayarları
ENV NODE_ENV=production
ENV PORT=${PORT:-3000}
EXPOSE ${PORT}

# 5) Doğrudan node ile çalıştır
CMD ["node", "server.js"]
