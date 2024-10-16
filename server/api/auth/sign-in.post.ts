import { authSchema } from '~~/types';

type DBUser = {
  id: string;
  name: string;
  username: string;
  password: string;
};

const invalidCredentialsError = createError({
  statusCode: 401,
  statusMessage: 'Invalid username or password.',
});

export default defineEventHandler(async (event) => {
  const { username, password } = await readValidatedBody(
    event,
    authSchema.parse
  );

  const dbUser = await hubDatabase()
    .prepare('SELECT * FROM users WHERE username = ?1')
    .bind(username)
    .first<DBUser>();

  if (!dbUser) {
    throw invalidCredentialsError;
  }

  if (!(await verifyPassword(dbUser.password, password))) {
    throw invalidCredentialsError;
  }

  await setUserSession(event, { user: { username, name: dbUser.name } });
  return setResponseStatus(event, 201);
});
