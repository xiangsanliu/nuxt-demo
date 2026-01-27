export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'auth_session');
  if (!session) throw createError({ statusCode: 401 });
  
  const userSession = JSON.parse(session);
  const body = await readBody(event);
  const { oldPassword, newPassword } = body;

  if (!oldPassword || !newPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Old password and new password are required',
    });
  }

  const db = event.context.cloudflare.env.DB;
  
  // 1. 获取当前用户
  const user: any = await db.prepare('SELECT * FROM users WHERE id = ?')
    .bind(userSession.id)
    .first();

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' });
  }

  // 2. 验证旧密码
  if (!(await verifyPassword(oldPassword, user.password))) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Incorrect old password',
    });
  }

  // 3. 更新密码
  const hashedNewPassword = await hashPassword(newPassword);
  await db.prepare('UPDATE users SET password = ? WHERE id = ?')
    .bind(hashedNewPassword, user.id)
    .run();

  return { success: true };
});
