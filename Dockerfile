#####################################################
# Install dependencies only when needed             #
#####################################################
FROM public.ecr.aws/docker/library/node:lts-slim AS deps
USER root
ARG GH_NPM_TOKEN
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy lockfile and package manager files first for better caching
COPY .npmrc package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod


#####################################################
# Build the application                             #
#####################################################
FROM public.ecr.aws/docker/library/node:lts-slim AS builder
USER root
ARG GH_NPM_TOKEN
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependencies and source
COPY --from=deps /app/node_modules/ ./node_modules/
COPY .npmrc package.json pnpm-lock.yaml tsconfig.json ./
COPY ./src ./src

# Install full deps for building
RUN pnpm install --frozen-lockfile
RUN pnpm build


#####################################################
# Production image                                  #
#####################################################
FROM public.ecr.aws/docker/library/node:lts-slim AS runner
USER root
WORKDIR /app

# Install pnpm globally (needed for CMD)
RUN npm install -g pnpm

# Create non-root user
RUN addgroup --system --gid 1001 app && \
    adduser --system --home /home/app --group --uid 1001 app

# Copy necessary files from builder and deps
COPY --chown=app:app --from=deps /app/node_modules/ /app/node_modules/
COPY --chown=app:app --from=builder /app/package.json ./
COPY --chown=app:app --from=builder /app/dist/ ./dist/

# Disable npm update notifier
RUN npm config set update-notifier false

# Set environment
ENV NODE_ENV=production

# Switch to non-root user
USER app

# Run the app
CMD ["pnpm", "start"]