# -------- FRONT BUILD: Angular --------
FROM node:20-alpine AS front-builder
WORKDIR /app/front

# Install front dependencies
COPY remina-survey-front/package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy source and build for production
COPY remina-survey-front/ .
RUN npm run build -- --configuration production

# -------- BACK BUILD: NestJS --------
FROM node:latest AS back-builder
WORKDIR /app/back

# Install back dependencies
COPY remina-survey-back/package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy back sources
COPY remina-survey-back/ .

# Copy Angular build into Nest public folder
COPY --from=front-builder /app/front/dist/remina-survey-front/browser ./public

# Build NestJS -> dist/
RUN npm run build

# Also copy seed data file into dist so the runtime seed script can access it via __dirname path
RUN mkdir -p dist/data && cp -r data/* dist/data/ || true

# Install production dependencies only (dans un dossier séparé)
RUN npm ci --omit=dev --prefer-offline --no-audit && npm cache clean --force

# -------- RUNTIME (slim, non-root) --------
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Install curl for healthcheck
RUN apk add --no-cache curl

# Switch to node user BEFORE copying files
USER node

# Copy with correct ownership from the start
COPY --from=back-builder --chown=node:node /app/back/package*.json ./
COPY --from=back-builder --chown=node:node /app/back/node_modules ./node_modules
COPY --from=back-builder --chown=node:node /app/back/dist ./dist
COPY --from=back-builder --chown=node:node /app/back/public ./public
# Copy TS sources and configs for ts-node runtime seeding
COPY --from=back-builder --chown=node:node /app/back/src ./src
COPY --from=back-builder --chown=node:node /app/back/data ./data
COPY --from=back-builder --chown=node:node /app/back/tsconfig*.json ./

# Listen on Nest default port
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --retries=5 \
    CMD curl -fsS http://localhost:3000/ || exit 1

CMD ["sh", "-c", "npm run --prefix . seed:words && node dist/main.js"]