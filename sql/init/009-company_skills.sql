CREATE TABLE IF NOT EXISTS company_skills
(
    id      int(11) NOT NULL AUTO_INCREMENT,
    company int(11) NOT NULL,
    skill   int(11) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;