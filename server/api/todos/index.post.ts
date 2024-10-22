export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { text, todoAt } = await readBody(event);

  if (!text) {
    throw createError({
      statusCode: 400,
      message: 'Missing text for todo',
    });
  }

  const todoAtDate = getDate(todoAt);
  if (todoAt && !todoAtDate) {
    throw createError({
      statusCode: 400,
      message: 'Invalid date for todoAt',
    });
  }

  try {
    return await addToDo(user.id, text, todoAtDate);
  } catch (error) {
    console.error('Error adding todo:', error);

    throw createError({
      statusCode: 500,
      message: 'An error occurred while adding the todo',
    });
  }
});
