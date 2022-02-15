CREATE TABLE IF NOT EXISTS job_types
(
    id     int(11)                                          NOT NULL AUTO_INCREMENT,
    type   varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci    NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 4
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

INSERT INTO job_types (type) VALUES ('Wedding');
INSERT INTO job_types (type) VALUES ('B\'nai Mitzvahs');
INSERT INTO job_types (type) VALUES ('Commercial Events');
INSERT INTO job_types (type) VALUES ('Misc');