# -------- 1) Client’ı derle --------
FROM node:18-alpine AS builder-client
WORKDIR /hwSTAJ/client

COPY client/package*.json ./
RUN npm ci

COPY client/ ./
RUN npm run build

# -------- 2) Server prod bağımlılıkları --------
FROM node:18-alpine AS builder-server
WORKDIR /hwSTAJ/server

COPY server/package*.json ./
RUN npm ci --omit=dev

# -------- 3) Çalıştırma imajı --------
FROM node:18-alpine
WORKDIR /hwSTAJ/server

# Builder’dan salt server kodunu al
COPY --from=builder-server /hwSTAJ/server . 

# Builder’dan build edilmiş React dosyalarını server içine kopyala
COPY --from=builder-client /hwSTAJ/client/build ./build

ENV NODE_ENV=production
ENV PORT=${PORT:-3000}
EXPOSE ${PORT}

CMD ["node", "server.js"]
