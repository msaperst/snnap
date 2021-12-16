# Snnap

## Basic System Install
A few tools are needed to be installed for basic development:
* Docker
* NodeJS
* NPM

## Deploying Application
### Using Docker Compose
You probably want this for testing and prod deployments, not for development use
In main directory run:
```shell
docker-compose up --build
docker exec -i snnap_mysql ./setup-database.sh
```
### Individual Components
You probably want this for development or testing use, not prod deployments 
#### Database
```shell
export $(grep -v '^#' .env | xargs)
cd sql
docker image build . -t snnap_mysql
docker container run --name=snnap_mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} -e MYSQL_USER=${MYSQL_USER} -e MYSQL_PASSWORD=${MYSQL_PASSWORD} -e MYSQL_DATABASE=${MYSQL_DATABASE} snnap_mysql:latest
docker exec -i snnap_mysql ./setup-database.sh
```

#### API Server
```shell
export $(grep -v '^#' .env | xargs)
cd api
npm install
npm run start
```

#### React UI
```shell
export $(grep -v '^#' .env | xargs)
cd ui
npm install
npm run start
```

## Testing

### Unit

### Integration

### Functional
```shell
export $(grep -v '^#' .env | xargs)
npm install
npm run test
```
This defaults to run tests on the port 3000 (hosted by default from React).
If you are running the application from docker-compose, or deployed elsewhere, you'll
want to change the location that tests run, by providing the `APP` url.
```shell
APP=http://localhost npm run test
```

### DevOps Strategy
Using GitHub actions to manage all automated testing. Currently, each module (api, ui) has
a GitHub action that runs on each push. This runs UTs, ITs, along with some linting and 
security scanning of dependencies.
When a PR is opened, the functional tests are executed.
These are all set as checks before the code can be merged into `main`

## Things to fix
- Auto populate db using ./setup-database.sh script
- Retrieve backend port using env for nginx instead of hard-coding

REFACTOR FOR UI UT TESTING