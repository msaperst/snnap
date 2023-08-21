CREATE TABLE IF NOT EXISTS notifications
(
    id                       int(11)   NOT NULL AUTO_INCREMENT,
    to_user                  int(11)   NOT NULL,
    what                     enum('applied', 'selected')  NOT NULL,
    hire_request             int(11),
    hire_request_application int(11),
    reviewed                 boolean   NOT NULL DEFAULT 0,
    timestamp                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

ALTER TABLE notifications RENAME COLUMN hire_request TO job;
ALTER TABLE notifications RENAME COLUMN hire_request_application TO job_application;
ALTER TABLE notifications CHANGE `what` `what` ENUM
    ('created', 'applied', 'selected');
