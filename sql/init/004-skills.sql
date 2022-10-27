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

DELETE FROM skills WHERE name = 'Photography' OR name = 'Retouch' OR name = 'Lighting' OR name = 'Posing' OR name = 'Pets' OR name = 'Children';
INSERT INTO skills (id, name) VALUES (1, 'Off Camera Flash');
INSERT INTO skills (id, name) VALUES (2, 'Solo Photography');
INSERT INTO skills (id, name) VALUES (3, 'Natural Light');
INSERT INTO skills (id, name) VALUES (4, 'Post Production Editing');
