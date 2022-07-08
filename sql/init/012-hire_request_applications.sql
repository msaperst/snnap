CREATE TABLE IF NOT EXISTS hire_request_applications
(
    id              int(11)                                 NOT NULL AUTO_INCREMENT,
    hire_request_id int(11)                                 NOT NULL,
    user_id         int(11)                                 NOT NULL,
    company_id      int(11),
    user_name       varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
    company_name    varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
    website         mediumtext                              NULL,
    insta           mediumtext                              NULL,
    fb              mediumtext                              NULL,
    experience      longtext                                NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
