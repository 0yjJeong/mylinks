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
COPY example ./example
COPY packages/mylinks-dashboard ./packages/mylinks-dashboard

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

FROM nginx:latest AS runner

RUN rm -rf /etc/nginx/conf.d
COPY example/conf /etc/nginx

COPY --from=builder /build/example/dist /usr/share/nginx/html

EXPOSE 3000
CMD [ "nginx", "-g", "daemon off;" ]