#####################################################
# Install dependencies only when needed             #
#####################################################
FROM public.ecr.aws/docker/library/node:lts-slim AS deps
USER root
ARG GH_NPM_TOKEN
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY ./.npmrc ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod


#####################################################
# Rebuild the source code only when needed          #
#####################################################
FROM public.ecr.aws/docker/library/node:lts-slim AS builder
USER root
ARG GH_NPM_TOKEN
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

COPY --from=deps /app/node_modules/ ./node_modules/
COPY ./tsconfig.json ./.npmrc ./package.json ./pnpm-lock.yaml /app/
COPY ./src /app/src/
RUN pnpm install --frozen-lockfile && pnpm build


#####################################################
# Production image, copy all the files and run next #
#####################################################
FROM public.ecr.aws/docker/library/node:lts-slim AS runner
USER root
WORKDIR /app

RUN addgroup --system --gid 1001 app && adduser --system --home /home/app --group --uid 1001 app

COPY --chown=app:app --from=deps /app/node_modules/ /app/node_modules/
COPY --chown=app:app --from=builder /app/package.json /app/
COPY --chown=app:app --from=builder /app/dist/ /app/dist/
RUN npm config set update-notifier false

ENV NODE_ENV=production

USER app
CMD ["pnpm", "start:prod"]