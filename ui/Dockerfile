# build environment
FROM node:16-alpine as build

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ARG REACT_APP_DOMAIN
ENV REACT_APP_DOMAIN ${REACT_APP_DOMAIN}
ARG REACT_APP_WS_PROTOCOL
ENV REACT_APP_WS_PROTOCOL ${REACT_APP_WS_PROTOCOL}
ARG REACT_APP_WS_PORT
ENV REACT_APP_WS_PORT ${REACT_APP_WS_PORT}
ARG REACT_APP_GA_TRACKING_CODE
ENV REACT_APP_GA_TRACKING_CODE ${REACT_APP_GA_TRACKING_CODE}
ARG REACT_APP_GEOAPIFY_API_KEY
ENV REACT_APP_GEOAPIFY_API_KEY ${REACT_APP_GEOAPIFY_API_KEY}

# setup our modules
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent --production

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

# fix timezone
RUN apk add tzdata; cp /usr/share/zoneinfo/US/Eastern /etc/localtime; echo "US/Eastern" >  /etc/timezone; apk del tzdata

CMD ["nginx", "-g", "daemon off;"]