CREATE TABLE IF NOT EXISTS companies
(
    id         int(11)                                NOT NULL AUTO_INCREMENT,
    user       int(11) UNIQUE                         NOT NULL,
    name       varchar(50) COLLATE utf8mb4_unicode_ci NULL,
    website    mediumtext                             NULL,
    insta      mediumtext                             NULL,
    fb         mediumtext                             NULL,
    equipment  varchar(200)                           NULL,
    experience longtext                               NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;