CREATE TABLE IF NOT EXISTS hire_requests
(
    id        int(11)                                  NOT NULL AUTO_INCREMENT,
    type      int(11)                                  NOT NULL,
    location  varchar(50) COLLATE utf8mb4_unicode_ci   NOT NULL,
    details   varchar(2000) COLLATE utf8mb4_unicode_ci NOT NULL,
    pay       double                                   NOT NULL,
    duration  int(11)                                  NOT NULL,
    units     varchar(50) COLLATE utf8mb4_unicode_ci   NOT NULL,
    date_time datetime,
    equipment varchar(200) COLLATE utf8mb4_unicode_ci  NOT NULL,
    skills    varchar(200) COLLATE utf8mb4_unicode_ci  NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
