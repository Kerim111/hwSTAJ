# -------- 1) Build aşaması --------
FROM node:18-alpine AS builder
WORKDIR /app

# Kök package.json (workspace vs. kullanıyorsanız) ve alt dizinler için
COPY package*.json ./
COPY client/package*.json client/
COPY server/package*.json server/
RUN npm install

# client’i derle
COPY client/ client/
RUN cd client && npm run build

# -------- 2) Çalıştırma aşaması --------
FROM node:18-alpine
WORKDIR /app

# Sadece production bağımlılıklarını yükle
COPY server/package*.json server/
RUN cd server && npm install --production

# server kodunu ve build edilmiş React’i kopyala
COPY server/ server/
COPY --from=builder /app/client/build server/build

WORKDIR /app/server
ENV NODE_ENV=production
ENV PORT=${PORT:-3000}
EXPOSE ${PORT}

# Uygulamayı başlat
CMD ["npm", "run", "start"]
