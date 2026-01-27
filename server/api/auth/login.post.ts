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
  const user: any = await db.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first();

  if (!user || !(await verifyPassword(password, user.password))) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password',
    });
  }

  // Set a simple session cookie
  setCookie(event, 'auth_session', JSON.stringify({ id: user.id, email: user.email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { success: true, user: { email: user.email } };
});