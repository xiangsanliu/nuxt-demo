import YahooFinance from 'yahoo-finance2'

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
    const quote = await yahooFinance.quote(symbol)
    console.log('fetch stock price:', symbol)
    return {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency,
      name: quote.shortName || quote.longName
    }
  } catch (error: any) {
    console.error('Failed to fetch stock price:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch stock price: ${error.message}`
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

