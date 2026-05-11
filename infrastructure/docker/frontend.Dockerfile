# Stage 1: Build
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
# Copy the build output to Nginx's default public folder
COPY --from=build /app/dist /usr/share/nginx/html

# Custom Nginx config to handle SPA routing
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
    listen 80;
    server_name localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        try_files \$uri \$uri/ /index.html;
    }

    # Proxy API requests to the backend (in K8s we usually handle this via Ingress, 
    # but this is a good fallback for local testing)
    location /api/ {
        proxy_pass http://backend:5000/api/;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
