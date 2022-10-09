CREATE TABLE IF NOT EXISTS hire_requests_skills
(
    id           int(11) NOT NULL AUTO_INCREMENT,
    hire_request int(11) NOT NULL,
    skill        int(11) NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

ALTER TABLE hire_requests_skills RENAME job_skills;
ALTER TABLE job_skills RENAME COLUMN hire_request TO job;