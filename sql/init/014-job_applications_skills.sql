CREATE TABLE IF NOT EXISTS hire_request_applications_skills
(
    id                       int(11) NOT NULL AUTO_INCREMENT,
    hire_request_application int(11) NOT NULL,
    skill                    int(11) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

ALTER TABLE hire_request_applications_skills RENAME job_applications_skills;
ALTER TABLE job_applications_skills RENAME COLUMN hire_request_application TO job_application;