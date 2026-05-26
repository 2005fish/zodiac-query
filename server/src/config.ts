export const config = {
  port: Number(process.env.PORT) || 3001,
  jwtSecret: process.env.JWT_SECRET || 'novel-reader-secret-key-2024',
  dbPath: process.env.DB_PATH || './data/novel.db',
}
