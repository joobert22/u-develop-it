USE election;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS parties;

-- Parties table
CREATE TABLE parties (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

-- Candidates table
CREATE TABLE candidates (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  party_id INTEGER,
  industry_connected BOOLEAN NOT NULL,
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);

-- Because this constraint relies on the parties table, the parties table MUST be defined first before the candidates table.
-- In the same regard, the candidates table must be dropped before the parties table due to the foreign key constraint that requires the parties table to exist.