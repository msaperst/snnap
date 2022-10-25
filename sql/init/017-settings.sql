CREATE TABLE IF NOT EXISTS settings
(
    user                int(11) NOT NULL,
    email_notifications boolean NOT NULL DEFAULT 1,
    push_notifications  boolean NOT NULL DEFAULT 0,
    PRIMARY KEY (user)
) ENGINE = InnoDB
  AUTO_INCREMENT = 1
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_unicode_ci;
