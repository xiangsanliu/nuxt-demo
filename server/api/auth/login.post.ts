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
  // 在 Cloudflare Workers 环境下，event.context.cloudflare 存在
  const isCloudflare = !!event.context.cloudflare;
  // 综合判断：协议是 HTTPS，或者在 Cloudflare 环境，都启用 Secure。
  // 移除 process.env.NODE_ENV 避免 Cloudflare Workers 运行时报错 (因为没有 Node 环境)
  const isSecure = getRequestProtocol(event) === 'https' || isCloudflare;
  
  setCookie(event, 'auth_session', JSON.stringify({ id: user.id, email: user.email }), {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax', // 显式设置 Lax 以兼容 Safari
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });

  return { success: true, user: { email: user.email } };
});