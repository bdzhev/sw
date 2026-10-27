# syntax=docker/dockerfile:1

# Stage 1: build
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# `BUN_INSTALL` is unset in this image, so the default cache path depends on
# $HOME. Pinning it means the cache mount below lands where bun actually looks.
ENV BUN_INSTALL_CACHE_DIR=/bun-cache

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/bun-cache bun install --frozen-lockfile

COPY . .
RUN bun run build-only

# Stage 2: serve
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY config.js.template /usr/share/nginx/html/config.js.template
COPY docker-entrypoint.sh /docker-entrypoint.sh

# SPA fallback plus the cache policy for hashed assets — see nginx.conf.
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
