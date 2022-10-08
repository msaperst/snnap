CREATE TABLE IF NOT EXISTS hire_request_applications_equipment
(
    id                       int(11) NOT NULL AUTO_INCREMENT,
    hire_request_application int(11) NOT NULL,
    equipment                int(11) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

ALTER TABLE hire_request_applications_equipment ADD COLUMN what mediumtext NOT NULL;
ALTER TABLE hire_request_applications_equipment RENAME job_applications_equipment;
ALTER TABLE job_applications_equipment RENAME COLUMN hire_request_application TO job_application;