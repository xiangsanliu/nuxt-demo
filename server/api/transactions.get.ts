export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'auth_session');
  if (!session) throw createError({ statusCode: 401 });
  
  const user = JSON.parse(session);
  const db = event.context.cloudflare.env.DB;

  const query = 'SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC';
  const results = await db.prepare(query).bind(user.id).all();
  
  return results.results;
});
