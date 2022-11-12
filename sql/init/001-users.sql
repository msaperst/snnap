CREATE TABLE IF NOT EXISTS users
(
    id         int(11)                                       NOT NULL AUTO_INCREMENT,
    name       varchar(50) COLLATE utf8mb4_unicode_ci        NOT NULL,
    username   varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    email      varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    password   varchar(200) COLLATE utf8mb4_unicode_ci       NOT NULL,
    last_login datetime,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

ALTER TABLE users DROP COLUMN name;
ALTER TABLE users ADD COLUMN first_name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users ADD COLUMN last_name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users ADD COLUMN number varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users ADD COLUMN city varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users ADD COLUMN state varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users ADD COLUMN zip varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users ADD COLUMN avatar varchar(60) COLLATE utf8mb4_unicode_ci;
ALTER TABLE users MODIFY avatar LONGTEXT;
ALTER TABLE users ADD COLUMN date_registered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users DROP COLUMN number;
ALTER TABLE users DROP COLUMN city;
ALTER TABLE users DROP COLUMN state;
ALTER TABLE users DROP COLUMN zip;
ALTER TABLE users ADD COLUMN loc mediumtext NOT NULL;
ALTER TABLE users ADD COLUMN lat long NOT NULL;
ALTER TABLE users ADD COLUMN lon long NOT NULL;

ALTER TABLE users MODIFY COLUMN lat DOUBLE;
ALTER TABLE users MODIFY COLUMN lon DOUBLE;

ALTER TABLE users ADD COLUMN password_reset_code varchar(6) COLLATE utf8mb4_unicode_ci;
ALTER TABLE users ADD COLUMN password_reset_count int;

