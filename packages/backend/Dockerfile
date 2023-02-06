# ==========================================================
# Install stage
# ==========================================================

FROM node:18-bullseye AS installer

RUN apt-get update \
    && apt-get install -y \
    && rm -rf /var/lib/apt/lists/*

# Enables Yarn
RUN corepack enable

WORKDIR /install

COPY yarn.lock .
COPY package.json .
COPY lerna.json .
COPY packages/backend ./packages/backend
COPY packages/backend-plugin-dashboard ./packages/backend-plugin-dashboard

RUN BUILD_SEQUENCE=1 yarn install \
    && yarn cache clean

# ==========================================================
# Build stage
# ==========================================================

FROM node:18-bullseye-slim AS builder

USER node

COPY --chown=node:node --from=installer /install /build

WORKDIR /build
RUN yarn build

# ==========================================================
# Run stage
# ==========================================================

FROM node:18-bullseye-slim AS runner

USER node

COPY --chown=node:node --from=builder /build /home/node

WORKDIR /home/node

ENV RUNNING_IN_DOCKER=1

CMD [ "node", "packages/backend" ]