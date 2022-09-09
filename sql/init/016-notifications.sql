CREATE TABLE IF NOT EXISTS notifications
(
    id                       int(11)  NOT NULL AUTO_INCREMENT,
    to_user                  int(11)  NOT NULL,
    from_user                int(11),
    hire_request             int(11),
    hire_request_application int(11),
    notification             longtext NOT NULL,
    reviewed                 boolean  NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
