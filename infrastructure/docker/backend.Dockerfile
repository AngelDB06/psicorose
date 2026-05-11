# Stage 1: Build & Dependencies
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev

# Stage 2: Production Image
FROM node:20-slim
WORKDIR /app

# Copy node_modules from base stage
COPY --from=base /app/node_modules ./node_modules
# Copy application code
COPY src ./src
COPY server.js ./
COPY .env ./
# Note: In production, .env should be managed via K8s Secrets/ConfigMaps, 
# but we copy it as a fallback or for local testing.

EXPOSE 5000
CMD ["node", "server.js"]
