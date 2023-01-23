FROM node:16-slim

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent --production

# Bundle app source
COPY server.js ./
COPY components ./components
COPY services ./services
COPY routes ./routes

# fix timezone
RUN apk add tzdata; cp /usr/share/zoneinfo/US/Eastern /etc/localtime; echo "US/Eastern" >  /etc/timezone; apk del tzdata

# Exports
EXPOSE ${API_PORT}
CMD [ "npm", "run", "start" ]