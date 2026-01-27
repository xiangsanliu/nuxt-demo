export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'auth_session');
  if (!session) throw createError({ statusCode: 401 });
  
  const user = JSON.parse(session);
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const { symbol, type, amount, price, currency, date } = body;
  
  const finalType = type?.toUpperCase();
  
  const db = event.context.cloudflare.env.DB;

  // Verify ownership
  const transaction = await db.prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?')
    .bind(id, user.id)
    .first();
  
  if (!transaction) {
    throw createError({ statusCode: 404, statusMessage: 'Transaction not found' });
  }

  await db.prepare(
    'UPDATE transactions SET symbol = ?, type = ?, amount = ?, price = ?, currency = ?, date = ? WHERE id = ?'
  )
  .bind(symbol.toUpperCase(), finalType, amount, price, currency, date, id)
  .run();

  return { success: true };
});
