# syntax=docker/dockerfile:1

FROM node:20-alpine AS build
WORKDIR /app

# Install deps first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

FROM nginx:1.27-alpine

# Nginx config (SPA-friendly)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static assets
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
