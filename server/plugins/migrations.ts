export default defineNitroPlugin(() => {
  if (import.meta.dev) {
    onHubReady(async () => {
      await hubDatabase().exec(
        `CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          username TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          userId TEXT NOT NULL,
          text TEXT NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          todoAt DATETIME,
          CONSTRAINT todos_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
        );
      `.replace(/\n/g, '')
      );

      await hubDatabase().exec(
        `CREATE INDEX IF NOT EXISTS idx_todos_userId ON todos(userId);`
      );
    });
  }
});
