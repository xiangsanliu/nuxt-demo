export default defineEventHandler(async (event) => {
  const session = getCookie(event, 'auth_session');
  if (!session) throw createError({ statusCode: 401 });
  
  const user = JSON.parse(session);
  const db = event.context.cloudflare.env.DB;

  // 使用 SQL 聚合计算：
  // 1. amount: 买入总量 - 卖出总量
  // 2. total_cost: 买入的总花费 - 卖出的总收入 (这是一种简单的移动平均法，也可以根据需要调整算法)
  const query = `
    SELECT 
      symbol,
      currency,
      CAST(SUM(CASE WHEN UPPER(type) IN ('BUY', 'REGISTER') THEN amount ELSE -amount END) AS REAL) as net_amount,
      CAST(SUM(CASE WHEN UPPER(type) IN ('BUY', 'REGISTER') THEN amount * price ELSE -(amount * price) END) AS REAL) as net_cost
    FROM transactions
    WHERE user_id = ?
    GROUP BY symbol, currency
    HAVING net_amount > 0
  `;

  const results = await db.prepare(query).bind(user.id).all();
  
  return results.results.map((r: any) => ({
    symbol: r.symbol,
    currency: r.currency,
    amount: Number(r.net_amount),
    avgPrice: Number(r.net_cost) / Number(r.net_amount)
  }));
});