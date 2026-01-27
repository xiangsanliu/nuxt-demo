export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email and password are required',
    });
  }

  const db = event.context.cloudflare.env.DB;
  const hashedPassword = await hashPassword(password);

  try {
    await db.prepare('INSERT INTO users (email, password) VALUES (?, ?)')
      .bind(email, hashedPassword)
      .run();

    return { success: true };
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      throw createError({
        statusCode: 409,
        statusMessage: 'User already exists',
      });
    }
    throw error;
  }
});