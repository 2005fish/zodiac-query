import db from './database.js'

export function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      username    TEXT    NOT NULL UNIQUE,
      password    TEXT    NOT NULL,
      nickname    TEXT    NOT NULL,
      avatar      TEXT    DEFAULT '',
      gender      INTEGER DEFAULT 0,
      created_at  TEXT    DEFAULT (datetime('now','localtime')),
      updated_at  TEXT    DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT    NOT NULL UNIQUE,
      icon       TEXT    DEFAULT '',
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS novels (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT    NOT NULL,
      author        TEXT    NOT NULL,
      cover_url     TEXT    NOT NULL,
      summary       TEXT    NOT NULL,
      status        INTEGER DEFAULT 0,
      total_words   INTEGER DEFAULT 0,
      rating        REAL    DEFAULT 0,
      read_count    INTEGER DEFAULT 0,
      category_id   INTEGER NOT NULL,
      created_at    TEXT    DEFAULT (datetime('now','localtime')),
      updated_at    TEXT    DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (category_id) REFERENCES categories(id)
    );

    CREATE TABLE IF NOT EXISTS novel_tags (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      novel_id INTEGER NOT NULL,
      tag_name TEXT    NOT NULL,
      FOREIGN KEY (novel_id) REFERENCES novels(id)
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      novel_id       INTEGER NOT NULL,
      chapter_number INTEGER NOT NULL,
      title          TEXT    NOT NULL,
      content        TEXT    NOT NULL,
      word_count     INTEGER DEFAULT 0,
      is_free        INTEGER DEFAULT 1,
      created_at     TEXT    DEFAULT (datetime('now','localtime')),
      UNIQUE(novel_id, chapter_number),
      FOREIGN KEY (novel_id) REFERENCES novels(id)
    );
    CREATE INDEX IF NOT EXISTS idx_chapters_novel ON chapters(novel_id, chapter_number);

    CREATE TABLE IF NOT EXISTS bookshelf (
      id       INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id  INTEGER NOT NULL,
      novel_id INTEGER NOT NULL,
      added_at TEXT    DEFAULT (datetime('now','localtime')),
      UNIQUE(user_id, novel_id),
      FOREIGN KEY (user_id)  REFERENCES users(id),
      FOREIGN KEY (novel_id) REFERENCES novels(id)
    );

    CREATE TABLE IF NOT EXISTS reading_history (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL,
      novel_id        INTEGER NOT NULL,
      chapter_id      INTEGER,
      chapter_number  INTEGER NOT NULL DEFAULT 1,
      progress        REAL    DEFAULT 0,
      read_at         TEXT    DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (user_id)  REFERENCES users(id),
      FOREIGN KEY (novel_id) REFERENCES novels(id),
      FOREIGN KEY (chapter_id) REFERENCES chapters(id)
    );
    CREATE INDEX IF NOT EXISTS idx_history_user ON reading_history(user_id, read_at DESC);

    CREATE TABLE IF NOT EXISTS reading_settings (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      novel_id   INTEGER,
      font_size  INTEGER DEFAULT 18,
      line_height REAL DEFAULT 1.8,
      theme      TEXT    DEFAULT 'day',
      page_mode  TEXT    DEFAULT 'scroll',
      UNIQUE(user_id, novel_id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS banners (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT    NOT NULL,
      image_url  TEXT    NOT NULL,
      link_type  TEXT    DEFAULT 'novel',
      link_value TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active  INTEGER DEFAULT 1
    );
  `)
  console.log('Database schema initialized.')
}
