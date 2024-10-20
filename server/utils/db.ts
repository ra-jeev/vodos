export async function addToDo(text: string, todoAt?: Date) {
  let query: string;
  let bindValues: string[];

  if (!todoAt) {
    query = 'INSERT INTO todos (userId, text) VALUES (?1, ?2)';
    bindValues = [userId, text];
  } else {
    query = 'INSERT INTO todos (userId,text, todoAt) VALUES (?1, ?2, ?3)';
    bindValues = [userId, text, todoAt.toISOString()];
  }

  const response = await hubDatabase()
    .prepare(query)
    .bind(...bindValues)
    .run();

  return { id: response.meta.last_row_id };
}
