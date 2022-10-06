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
docker container run --name=snnap_mysql -p ${MYSQL_PORT}:3306 -e MYSQL_ROOT_PASSWORD=${MYSQL_ROOT_PASSWORD} -e MYSQL_USER=${MYSQL_USER} -e MYSQL_PASSWORD=${MYSQL_PASSWORD} -e MYSQL_DATABASE=${MYSQL_DATABASE} snnap_mysql:latest
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
Create a `.env` file with local connection information in the `ui` directory
```shell
#ui/.env
REACT_APP_GEOAPIFY_API_KEY=[mygeoapifyapikey]
REACT_APP_HTTP_PORT=3001
```
```shell
export $(grep -v '^#' .env | xargs)
cd ui
npm install
npm run start
```

## Testing

### Unit
Unit tests exist for both the API and the UI. To execute these tests, simply navigate 
to the folder, and run the test command:
```shell
npm install
npm run test
```
Coverage goals are set to 95%, so even if all tests pass, the execution might fail 
if desired coverage isn't acheived. With that, not all directories are required for
coverage; checkout `package.json` in each directory to determine what files need
coverage.

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

## Documentation

[Workflow](https://docs.google.com/presentation/d/1BjzJkv9XqFue_Srer7AKXsyXZ8qBxGLwcC6cHl9HGp4/edit#slide=id.p)
[Design](https://www.figma.com/file/FBqEl0QylgkvUPxU27RxTh)
[Feedback](https://app.markup.io/markup/35f53d33-98fc-4a1a-83b9-5888530c2c4f)