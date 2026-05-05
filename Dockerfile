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
    NODE_OPTIONS="--max-old-space-size=4096" npm run build

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
# CMS content is read at runtime by app/[...slug]/page.tsx and the /admin editor.
# Standalone tracing won't pick it up since reads are dynamic.
COPY --from=builder /app/content ./content
# NOTE: /api/cms/publish requires a writable git working tree at /app and a
# GITHUB_TOKEN. In Coolify, mount a persistent volume containing the cloned
# repo at /app (or /app/.git + /app/content) so commits survive container
# restarts. Without that mount, only the local filesystem path of "Save"
# works; "Publish" returns an error.

EXPOSE 3000
CMD ["node", "server.js"]
