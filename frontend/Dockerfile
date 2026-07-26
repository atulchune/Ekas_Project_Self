# syntax=docker/dockerfile:1

FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ARG VITE_API_PROXY_TARGET
RUN npm run build

FROM nginx:1.27-alpine AS runtime
RUN apk add --no-cache curl
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://localhost:80/healthz || exit 1

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
