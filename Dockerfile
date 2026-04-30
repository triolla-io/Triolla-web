FROM node:22-alpine AS base

# Stage 1: build
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,id=triolla-npm,target=/root/.npm \
    --mount=type=cache,id=triolla-node-modules,target=/app/node_modules \
    npm ci --ignore-scripts
COPY . .
RUN --mount=type=cache,id=triolla-node-modules,target=/app/node_modules \
    --mount=type=cache,id=triolla-next,target=/app/.next/cache \
    npm run build

# Stage 2: production runner (standalone — no node_modules needed)
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# lib/ holds snapshotRegistry.json and widgetProps/ read at runtime;
# standalone tracing should include them but this is an explicit safety net.
COPY --from=builder /app/lib ./lib

EXPOSE 3000
CMD ["node", "server.js"]
