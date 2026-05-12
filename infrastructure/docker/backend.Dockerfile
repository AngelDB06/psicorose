# Stage 1: Build & Dependencies
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Stage 2: Production Image
FROM node:20-slim
WORKDIR /app

# Copiamos node_modules
COPY --from=base /app/node_modules ./node_modules
# Copiamos el código
COPY src ./src
COPY server.js ./

# CREAMOS LA CARPETA DE UPLOADS Y DAMOS PERMISOS
RUN mkdir -p uploads/avatars uploads/posts && chmod -R 777 uploads

EXPOSE 5000
CMD ["node", "server.js"]
