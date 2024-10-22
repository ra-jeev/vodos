export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { completed, due_date: dueDate } = getQuery(event);

  const todoAtDate = getDate(dueDate as string | undefined);

  return await getToDos(user.id, {
    dueDate: todoAtDate,
    completed: typeof completed === 'string' ? completed === 'true' : undefined,
  });
});
