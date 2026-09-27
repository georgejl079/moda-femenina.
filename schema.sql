CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value TEXT
);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  sort INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS promotions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  badge TEXT NOT NULL,
  title TEXT NOT NULL,
  sub TEXT NOT NULL,
  image TEXT NOT NULL,
  cat TEXT NOT NULL,
  full_description TEXT,
  valid_until TEXT,
  conditions TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  price REAL NOT NULL,
  cat TEXT NOT NULL,
  img TEXT NOT NULL,
  desc TEXT,
  description TEXT,
  details_json TEXT,
  colors_json TEXT,
  sizes_json TEXT,
  images_json TEXT,
  pairs_with_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  cat TEXT NOT NULL,
  location TEXT NOT NULL,
  client TEXT,
  duration TEXT,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  images_json TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  img TEXT NOT NULL,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  color_hex TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_products_cat ON products(cat);
CREATE INDEX IF NOT EXISTS idx_cart_session ON cart_items(session_id);
