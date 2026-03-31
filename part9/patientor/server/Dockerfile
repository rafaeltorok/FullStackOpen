# Build stage
FROM node:20-alpine AS build

WORKDIR /usr/src/app/server

COPY ./server/package*.json .
COPY ./server/src ./src
COPY ./shared/data ../shared/data
COPY ./shared/types.ts ../shared/types.ts
COPY ./server/tsconfig.json .

RUN npm install
RUN npm run tsc

# Production stage
FROM node:20-alpine AS production

WORKDIR /usr/src/app
COPY ./server/package*.json .
COPY --from=build /usr/src/app/server/build .
COPY ./shared/data ../shared/data

RUN npm ci
RUN apk add --no-cache curl

EXPOSE 3001

ENV PORT=3001

CMD ["node", "./server/src/index.js"]