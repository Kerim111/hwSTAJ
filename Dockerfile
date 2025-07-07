# 1) Client’ı derle
FROM node:18-alpine AS builder-client
WORKDIR /app/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# 2) Server için prod bağımlılıkları + kod
FROM node:18-alpine AS builder-server
WORKDIR /app/server

# 2.1) Sadece package.json’larla bağımlılıkları yükle
COPY server/package*.json ./
RUN npm ci --omit=dev

# 2.2) Ardından tüm server dosyalarını kopyala
COPY server/ ./

# 3) Çalıştırma imajı
FROM node:18-alpine
WORKDIR /app/server

# 3.1) builder-server’dan tüm server klasörünü getir
COPY --from=builder-server /app/server . 

# 3.2) builder-client’dan derlenmiş React build’ini server içine kopyala
COPY --from=builder-client /app/client/build ./build

ENV NODE_ENV=production
ENV PORT=${PORT:-3000}
EXPOSE ${PORT}

RUN npx prisma generate  
RUN npx prisma migrate deploy  

# 3.3) Prod’da nodemon yerine doğrudan node kullanın
CMD ["node", "server.js"]
