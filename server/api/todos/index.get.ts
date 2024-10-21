export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);

  const { completed, due_date: dueDate } = getQuery(event);

  let todoAtDate: Date | undefined = undefined;
  if (dueDate) {
    todoAtDate = new Date(dueDate as string);
    if (isNaN(todoAtDate.getTime())) {
      todoAtDate = undefined;
    }
  }

  return await getToDos(user.id, {
    dueDate: todoAtDate,
    completed: typeof completed === 'string' ? completed === 'true' : undefined,
  });
});
