
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const symbol = query.symbol as string

  if (!symbol) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Symbol is required'
    })
  }

  try {
    // 模拟真实的浏览器请求头，这在 Cloudflare 环境下非常重要

    const result = await yahooFinance.quote(symbol);

    if (!result) {
      throw createError({
        statusCode: 404,
        statusMessage: `Stock symbol "${symbol}" not found or unauthorized`
      })
    }

    return {
      symbol: result.symbol,
      price: result.regularMarketPrice,
      change: result.regularMarketChange,
      changePercent: result.regularMarketChangePercent,
      currency: result.currency,
      marketState: result.marketState,
      timestamp: new Date().toISOString()
    }
  } catch (error: any) {
    console.error('Fetch error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch stock data: ${error.message}`
    })
  }
}, {
  maxAge: 60 * 10, // 10 minutes
  name: 'getStockPrice',
  getKey: (event) => {
    const query = getQuery(event)
    return query.symbol as string
  }
})
