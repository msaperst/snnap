# build environment
FROM node:12-alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent
COPY public ./public
COPY src ./src
RUN npm run build --prod

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE ${UI_PORT}
CMD ["nginx", "-g", "daemon off;"]