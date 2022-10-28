FROM node:14-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci --silent

# Bundle app source
COPY server.js ./
COPY components ./components
COPY services ./services
COPY routes ./routes

# Exports
EXPOSE ${API_PORT}
CMD [ "npm", "run", "start" ]