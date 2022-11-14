CREATE TABLE IF NOT EXISTS ratings
(
    id         int(11)   NOT NULL AUTO_INCREMENT,
    job        int(11)   NOT NULL,
    job_date   TIMESTAMP NOT NULL,
    rater       int(11)   NOT NULL,
    ratee       int(11)   NOT NULL,
    rating     boolean,
    date_rated TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
