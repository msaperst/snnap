CREATE TABLE IF NOT EXISTS conversations
(
    id      int(11)   NOT NULL AUTO_INCREMENT,
    sender  int(11)   NOT NULL,
    recipient  int(11)   NOT NULL,
    sentAt  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    message LONGTEXT  NOT NULL,
    received boolean  NOT NULL DEFAULT 0,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
