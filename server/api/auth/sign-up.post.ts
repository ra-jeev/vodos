import { signUpSchema } from '~~/types';

export default defineEventHandler(async (event) => {
  const { name, username, password } = await readValidatedBody(
    event,
    signUpSchema.parse
  );

  const hashedPassword = await hashPassword(password);

  try {
    await hubDatabase()
      .prepare(
        'INSERT INTO users (id, username, name, password) VALUES (?1, ?2, ?3, ?4)'
      )
      .bind(generateRandomId(), username, name, hashedPassword)
      .run();

    await setUserSession(event, { user: { username, name } });
    return setResponseStatus(event, 201);
  } catch (error) {
    console.error('Error signing up:', error);

    if (
      error instanceof Error &&
      error.message.includes('D1_ERROR: UNIQUE constraint failed')
    ) {
      throw createError({
        statusCode: 400,
        statusMessage:
          'Username unavailable. Please choose a different username.',
        data: {
          issues: [
            {
              message: 'Username not available. Please try another one.',
              path: ['username'],
            },
          ],
        },
      });
    }

    throw createError({
      statusCode: 422,
      statusMessage:
        'Signup failed. Please check your information and try again.',
    });
  }
});
