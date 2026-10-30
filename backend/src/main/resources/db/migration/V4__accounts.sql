CREATE TABLE account_credentials (
 user_id CHAR(36) PRIMARY KEY,
 email VARCHAR(254) NOT NULL UNIQUE,
 password_algorithm VARCHAR(40) NOT NULL,
 iterations INT NOT NULL,
 salt VARCHAR(64) NOT NULL,
 password_hash VARCHAR(128) NOT NULL,
 updated_at DATETIME(6) NOT NULL,
 FOREIGN KEY(user_id) REFERENCES users(id)
);
