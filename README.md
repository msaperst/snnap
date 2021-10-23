# Seconds

## Setup the Database
Needs a mysql DB
For now using a docker mysql manually

```shell
docker pull mysql/mysql-server:latest
docker run --name=mysql1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=root_password -d mysql/mysql-server:latest
docker exec -i mysql1 mysql -uroot -proot_password < db-setup.sql
```

## Run the Server
```shell
node_modules/nodemon/bin/nodemon.js server.js
```

Run Some Tests