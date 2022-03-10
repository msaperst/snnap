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
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

ALTER TABLE users
    DROP COLUMN name;
ALTER TABLE users
    ADD COLUMN first_name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users
    ADD COLUMN last_name varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users
    ADD COLUMN number varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users
    ADD COLUMN city varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users
    ADD COLUMN state varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users
    ADD COLUMN zip varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL;
ALTER TABLE users
    ADD COLUMN avatar varchar(60) COLLATE utf8mb4_unicode_ci;