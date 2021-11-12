# Seconds

## Basic System Install
A few tools are needed to be installed for basic development:
* Docker
* NodeJS
* NPM

## Deploying Application
### Using Docker Compose
_Still in progress_
You probably want this for testing and prod deployments, not for development use
In main directory run:
```shell
docker-compose up --build
docker exec -i seconds_mysql ./setup-database.sh
```
### Individual Components
You probably want this for development or testing use, not prod deployments 
#### Database
```shell
cd sql
docker image build . -t seconds_mysql
docker container run --name=seconds_mysql -e MYSQL_ROOT_PASSWORD=root_password -e MYSQL_USER=seconds -e MYSQL_PASSWORD=password -e MYSQL_DATABASE=seconds seconds_mysql:latest
docker exec -i seconds_mysql ./setup-database.sh
```

#### API Server
```shell
cd api
npm install
npm run start
```

#### React UI
```shell
cd ui
npm install
npm run start
```

## Testing