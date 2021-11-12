#!/bin/bash
DRYRUN=$1;
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
PARENTDIR="$( dirname ${DIR} )";

#wait for database to be available
while ! mysqladmin ping --silent; do
    echo "Waiting for db"
    sleep 1
done

#create our database if it doesn't already exist
mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -e "CREATE DATABASE IF NOT EXISTS \`$MYSQL_DATABASE\`;" > /dev/null 2>&1
#fix our user permissions
mysql -u $MYSQL_USER -p$MYSQL_PASSWORD -e "ALTER USER '${MYSQL_USER}'@'%'  IDENTIFIED WITH mysql_native_password BY '${MYSQL_PASSWORD}';" > dev/null 2>&1

#setup our schema
for file in init/*.sql; do
    filename=${file##*/}
    echo "Running ${filename%.sql}";
    mysql --force -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < "$file" #> /dev/null 2>&1
done

rm -r init
rm setup-database.sh