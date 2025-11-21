CREATE TABLE links (
  code VARCHAR(10) PRIMARY KEY,
  target TEXT NOT NULL,
  clicks INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  last_clicked TIMESTAMP
);
