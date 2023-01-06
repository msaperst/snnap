CREATE TABLE IF NOT EXISTS job_subtypes
(
    id     int(11)                                       NOT NULL AUTO_INCREMENT,
    type   varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    plural varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

INSERT INTO job_subtypes (type, plural) VALUES ('Second Photographer', 'Second Photographers');
INSERT INTO job_subtypes (type, plural) VALUES ('Lead Photographer', 'Lead Photographers');
INSERT INTO job_subtypes (type, plural) VALUES ('Assistant', 'Assistants');
INSERT INTO job_subtypes (type, plural) VALUES ('Photobooth Attendant', 'Photobooth Attendants');
INSERT INTO job_subtypes (type, plural) VALUES ('Other', 'Other');
INSERT INTO job_subtypes (type, plural) VALUES ('Associate Photographer', 'Associate Photographers');
