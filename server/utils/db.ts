export async function addToDo(userId: string, text: string, todoAt?: Date) {
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

export async function getToDos(
  userId: string,
  filters?: { dueDate?: Date; completed?: boolean }
) {
  let query = 'SELECT * FROM todos WHERE userId = ?1';
  const params: string[] = [userId];

  if (filters?.dueDate) {
    query += ' AND todoAt = ?2';
    params.push(filters.dueDate.toISOString());
  }

  if (typeof filters?.completed !== 'undefined') {
    query += ` AND completed = ?${params.length + 1}`;
    params.push(filters.completed ? 'TRUE' : 'FALSE');
  }

  const response = await hubDatabase()
    .prepare(query)
    .bind(...params)
    .all();

  return response.results;
}
