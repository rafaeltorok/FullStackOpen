# Build stage
FROM node:20-alpine AS build
WORKDIR /app/client
COPY ./client/package*.json ./
RUN npm install
COPY ./client .
COPY ./shared/types.ts ../shared/types.ts
RUN npm run build

# Production stage
FROM nginx:stable-alpine AS production

# Copy custom Nginx config
COPY ./client/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]