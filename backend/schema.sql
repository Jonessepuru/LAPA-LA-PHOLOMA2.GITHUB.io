-- Lapa la Pholoma - SQLite Schema
CREATE TABLE members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  gender TEXT CHECK(gender IN ('M','F','Other')),
  birth_date DATE,
  death_date DATE,
  photo_url TEXT,
  bio TEXT,
  generation INTEGER,
  aka TEXT,
  note TEXT
);

CREATE TABLE relationships (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  person_id INTEGER NOT NULL,
  related_to_id INTEGER NOT NULL,
  type TEXT CHECK(type IN ('parent','child','spouse','sibling')),
  FOREIGN KEY(person_id) REFERENCES members(id),
  FOREIGN KEY(related_to_id) REFERENCES members(id)
);

CREATE INDEX idx_relations_person ON relationships(person_id);
CREATE INDEX idx_members_generation ON members(generation);
