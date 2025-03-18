#####################################################
# Install dependencies only when needed             #
#####################################################
FROM public.ecr.aws/docker/library/node:lts-slim AS deps
USER root
ARG GH_NPM_TOKEN
WORKDIR /app
COPY ./.npmrc ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile --production --prefer-offline


#####################################################
# Rebuild the source code only when needed          #
#####################################################
FROM public.ecr.aws/docker/library/node:lts-slim AS builder
USER root
ARG GH_NPM_TOKEN
WORKDIR /app
COPY --from=deps /app/node_modules/ ./node_modules/
COPY ./tsconfig.json ./.npmrc ./package.json ./yarn.lock /app/
COPY ./src /app/src/
RUN yarn install --frozen-lockfile && yarn build


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
ENV YARN_CACHE_FOLDER=/tmp/.yarn-cache

USER app
CMD ["yarn", "start:prod"]