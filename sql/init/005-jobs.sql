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
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

ALTER TABLE hire_requests ADD COLUMN user int(11) NOT NULL;
ALTER TABLE hire_requests DROP COLUMN units;
ALTER TABLE hire_requests ADD COLUMN durationMax int(11);
ALTER TABLE hire_requests MODIFY location varchar(256);
ALTER TABLE hire_requests MODIFY details longtext;
ALTER TABLE hire_requests DROP COLUMN equipment;
ALTER TABLE hire_requests DROP COLUMN skills;
ALTER TABLE hire_requests ADD COLUMN date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE hire_requests ADD COLUMN application_selected int(11);
ALTER TABLE hire_requests ADD COLUMN date_application_selected TIMESTAMP;
ALTER TABLE hire_requests DROP COLUMN location;
ALTER TABLE hire_requests ADD COLUMN loc mediumtext NOT NULL;
ALTER TABLE hire_requests ADD COLUMN lat long NOT NULL;
ALTER TABLE hire_requests ADD COLUMN lon long NOT NULL;

ALTER TABLE hire_requests RENAME jobs;

ALTER TABLE jobs MODIFY COLUMN lat DOUBLE;
ALTER TABLE jobs MODIFY COLUMN lon DOUBLE;
ALTER TABLE jobs ADD COLUMN subtype int(11) NOT NULL;
ALTER TABLE jobs ADD COLUMN equipment mediumtext;
