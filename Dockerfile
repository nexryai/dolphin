FROM node:20-alpine3.19 AS base

ENV NODE_ENV=production

WORKDIR /dolphin

FROM base AS builder

RUN apk add --no-cache ca-certificates git alpine-sdk g++ build-base cmake clang libressl-dev vips-dev python3

COPY package.json yarn.lock ./
RUN yarn install
COPY . ./
RUN yarn build
RUN rm -rf .git

FROM base AS runner

ARG UID="991"
ARG GID="991"

RUN apk add --no-cache ca-certificates tini vips vips-cpp \
 && addgroup -g "${GID}" dolphin \
 && adduser -u "${UID}" -G dolphin -D -h /dolphin dolphin \
 && chown -R dolphin:dolphin /dolphin


COPY --chown=dolphin:dolphin --from=builder /dolphin/node_modules ./node_modules
COPY --chown=dolphin:dolphin --from=builder /dolphin/built ./built
COPY . ./

USER dolphin

ENV NODE_ENV=production
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "run", "migrateandstart"]
