export default defineNitroPlugin(() => {
  if (import.meta.dev) {
    onHubReady(async () => {
      await hubDatabase().exec(
        `CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          completed BOOLEAN DEFAULT FALSE,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          todoAt DATETIME
        );
      `.replace(/\n/g, '')
      );
    });
  }
});
