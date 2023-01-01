CREATE TABLE IF NOT EXISTS equipment
(
    id     int(11)                                          NOT NULL AUTO_INCREMENT,
    name   varchar(50) UNIQUE COLLATE utf8mb4_unicode_ci    NOT NULL,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;

INSERT INTO equipment (name) VALUES ('Camera');
INSERT INTO equipment (name) VALUES ('Flash');
INSERT INTO equipment (name) VALUES ('Lights');
DELETE FROM equipment WHERE name = 'Lights';
INSERT INTO equipment (name) VALUES ('Lenses');
INSERT INTO equipment (name) VALUES ('Other');