# Stage 1: Build & Dependencies
FROM node:20-slim AS base
WORKDIR /app
# Copiamos archivos de dependencias
COPY package*.json ./
RUN npm install --omit=dev

# Stage 2: Production Image
FROM node:20-slim
WORKDIR /app

# Copiamos node_modules desde la etapa base
COPY --from=base /app/node_modules ./node_modules
# Copiamos el código de la aplicación
COPY src ./src
COPY server.js ./

# No copiamos el .env aquí por seguridad y para evitar errores si no existe en el repo.
# Las variables se pasan vía Kubernetes Secrets.

EXPOSE 5000
CMD ["node", "server.js"]
