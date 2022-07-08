CREATE TABLE IF NOT EXISTS hire_request_applications_portfolios
(
    id                       int(11)    NOT NULL AUTO_INCREMENT,
    hire_request_application int(11)    NOT NULL,
    link                     mediumtext NOT NULL,
    description              mediumtext NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
