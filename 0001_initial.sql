-- Migration number: 0001 	 2025-04-09
DROP TABLE IF EXISTS calls;
DROP TABLE IF EXISTS prospects;
DROP TABLE IF EXISTS categories;

-- Categories table to store prospect categories and their sales scripts
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  sales_script TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Prospects table to store prospect information
CREATE TABLE IF NOT EXISTS prospects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category_id INTEGER NOT NULL,
  location TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  notes TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Calls table to track interactions with prospects
CREATE TABLE IF NOT EXISTS calls (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  prospect_id INTEGER NOT NULL,
  call_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  outcome TEXT,
  follow_up_date DATETIME,
  follow_up_notes TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (prospect_id) REFERENCES prospects (id)
);

-- Create indexes for better performance
CREATE INDEX idx_prospects_category_id ON prospects(category_id);
CREATE INDEX idx_calls_prospect_id ON calls(prospect_id);
CREATE INDEX idx_calls_follow_up_date ON calls(follow_up_date);

-- Initial data for categories
INSERT INTO categories (name, sales_script) VALUES 
  ('Distributors', 'See sales_pitches.md for Distributor sales pitch'),
  ('Contractors', 'See sales_pitches.md for Contractor sales pitch'),
  ('Roofers', 'See sales_pitches.md for Roofer sales pitch'),
  ('Gutter Installers', 'See sales_pitches.md for Gutter Installer sales pitch'),
  ('Competitors', 'See sales_pitches.md for Competitor''s Customers sales pitch');
