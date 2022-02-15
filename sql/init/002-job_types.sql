CREATE TABLE IF NOT EXISTS job_types
(
    id     int(11)                                       NOT NULL AUTO_INCREMENT,
    type   varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    plural varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

INSERT INTO job_types (type, plural) VALUES ('Wedding', 'Weddings');
INSERT INTO job_types (type, plural) VALUES ('B\'nai Mitzvah', 'B\'nai Mitzvahs');
INSERT INTO job_types (type, plural) VALUES ('Commercial Event', 'Commercial Events');
INSERT INTO job_types (type, plural) VALUES ('Misc', 'Misc');