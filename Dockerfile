FROM node:18-bullseye as build

WORKDIR /usr/src/app

COPY package*.json /usr/src/app/

RUN npm install

COPY . .

RUN npm run build

FROM node:18-bullseye-slim as app

WORKDIR /usr/src/app

# Copy the built files from the build stage
COPY --from=build --chown=node:node /usr/src/app/dist /usr/src/app/dist

COPY --chown=node:node package*.json /usr/src/app/
COPY --chown=node:node ./.env.example /usr/src/app/.env

RUN npm install --only=production

ENV NODE_ENV production
USER node

EXPOSE 3000

CMD ["node", "dist/main"]
