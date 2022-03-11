CREATE TABLE IF NOT EXISTS companies
(
    id         int(11)                                       NOT NULL AUTO_INCREMENT,
    name       varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    website    mediumtext                                    NULL,
    insta      mediumtext                                    NULL,
    fb         mediumtext                                    NULL,
    equipment  varchar(200)                                  NULL,
    experience longtext                                      NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;