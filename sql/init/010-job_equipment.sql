CREATE TABLE IF NOT EXISTS hire_requests_equipment
(
    id           int(11) NOT NULL AUTO_INCREMENT,
    hire_request int(11) NOT NULL,
    equipment    int(11) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

ALTER TABLE hire_requests_equipment RENAME job_equipment;
ALTER TABLE job_equipment RENAME COLUMN hire_request TO job;