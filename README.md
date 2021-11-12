# Seconds

## Basic System Install
A few tools are needed to be installed for basic development:
* Docker
* NodeJS
* NPM

## Deploy using Docker Compose
_Still in progress_
In main directory run:
```shell
docker-compose up --build
docker exec -i seconds_mysql ./setup-database.sh
```

## Setup the Database
Needs a mysql DB
For now using a docker mysql manually

```shell
cd sql
docker image build . -t seconds_mysql
docker container run --name=seconds_mysql -e MYSQL_ROOT_PASSWORD=root_password -e MYSQL_USER=seconds -e MYSQL_PASSWORD=password -e MYSQL_DATABASE=seconds seconds_mysql:latest
docker exec -i seconds_mysql ./setup-database.sh
```

## Run the Server
```shell
cd api
npm install
npm run start
```

## Run the UI
```shell
cd ui
npm install
npm run start
```

## Testing