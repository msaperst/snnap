FROM node:12

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY server.js ./
COPY components ./components
COPY services ./services

# Exports
EXPOSE ${API_PORT}
CMD [ "npm", "run", "start" ]