export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event);
  const { text } = await readBody(event);

  if (!text) {
    throw createError({
      statusCode: 400,
      message: 'Missing text for processing',
    });
  }

  try {
    return await handleUserMessage(user.id, text);
  } catch (error) {
    console.error('Error processing:', error);

    throw createError({
      statusCode: 500,
      message: 'Error processing.',
    });
  }
});
