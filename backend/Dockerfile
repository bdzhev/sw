# syntax=docker/dockerfile:1
FROM oven/bun:1-alpine

WORKDIR /app

# `BUN_INSTALL` is unset in this image, so the default cache path depends on
# $HOME. Pinning it means the cache mount below lands where bun actually looks.
ENV BUN_INSTALL_CACHE_DIR=/bun-cache

COPY package.json bun.lock ./
RUN --mount=type=cache,target=/bun-cache bun install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["bun", "run", "src/app/server.ts"]
