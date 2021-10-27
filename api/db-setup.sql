CREATE DATABASE seconds;
USE seconds;

CREATE USER 'seconds'@'%' IDENTIFIED BY 'seconds_password';
GRANT ALL PRIVILEGES ON *.* TO 'seconds'@'%';
ALTER USER 'seconds'@'%' IDENTIFIED WITH mysql_native_password BY 'seconds_password';
FLUSH PRIVILEGES;

CREATE TABLE users
(
    id         int(11)                                       NOT NULL AUTO_INCREMENT,
    name       varchar(50) COLLATE utf8mb4_unicode_ci        NOT NULL,
    username   varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    email      varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    password   varchar(200) COLLATE utf8mb4_unicode_ci       NOT NULL,
    last_login datetime,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;