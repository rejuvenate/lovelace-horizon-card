# Reproducible build/test environment for lovelace-horizon-card.
# Everything (install, lint, test, build) runs inside the container so the
# host never needs local node/yarn/library installs.
#
#   docker build -f docker/Dockerfile -t horizon-card-ci .
#   docker run --rm horizon-card-ci                 # lint + test + build
#   docker run --rm horizon-card-ci sh -lc "yarn test"
#
# syntax=docker/dockerfile:1
FROM node:22-bookworm

# Yarn 4 is pinned via package.json "packageManager"; corepack provisions it.
RUN corepack enable

WORKDIR /app

# --- dependency layer (cached unless manifests or patches change) ---
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/ .yarn/
RUN yarn install --immutable

# --- source ---
COPY . .

# Default: the same steps CI runs.
CMD ["sh", "-lc", "yarn lint && yarn test && yarn build"]
