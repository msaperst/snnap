# build environment
FROM node:14-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

# setup our modules
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent

# copy in the files and build things
COPY public ./public
COPY src ./src
RUN npm run build --prod

# production environment
FROM nginx:stable-alpine

# remove default nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# replace with custom one
COPY nginx.conf /etc/nginx/conf.d

# copy over our files
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]