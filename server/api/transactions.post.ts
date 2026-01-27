export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'auth_session');
  if (!session) throw createError({ statusCode: 401 });
  
  const user = JSON.parse(session);
  const body = await readBody(event);
  const { symbol, type, price, quantity, amount, currency, date } = body;
  
  const finalAmount = amount || quantity;
  const finalCurrency = currency || 'USD';
  const finalDate = date || new Date().toISOString();
  let finalType = type?.toUpperCase();
  
  if (finalType === 'REGISTER') finalType = 'BUY';

  if (!symbol || !finalType || !finalAmount || !price) {
    throw createError({ statusCode: 400, statusMessage: 'Missing fields' });
  }

  const db = event.context.cloudflare.env.DB;
  
  await db.prepare(
    'INSERT INTO transactions (user_id, symbol, type, amount, price, currency, date) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
  .bind(user.id, symbol.toUpperCase(), finalType, finalAmount, price, finalCurrency, finalDate)
  .run();

  return { success: true };
});