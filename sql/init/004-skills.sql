CREATE TABLE IF NOT EXISTS skills
(
    id     int(11)                                          NOT NULL AUTO_INCREMENT,
    name   varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci    NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

INSERT INTO skills (name) VALUES ('Photography');
INSERT INTO skills (name) VALUES ('Retouch');
INSERT INTO skills (name) VALUES ('Lighting');
INSERT INTO skills (name) VALUES ('Posing');
INSERT INTO skills (name) VALUES ('Pets');
INSERT INTO skills (name) VALUES ('Children');

DELETE FROM skills;
INSERT INTO skills (name) VALUES ('Off Camera Flash');
INSERT INTO skills (name) VALUES ('Solo Photography');
INSERT INTO skills (name) VALUES ('Natural Light');
INSERT INTO skills (name) VALUES ('Post Production Editing');
