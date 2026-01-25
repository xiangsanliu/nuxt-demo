import YahooFinance from 'yahoo-finance2'

const yahooFinance = new YahooFinance();

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  console.log(query)
  const symbol = query.symbol as string
  console.log(symbol)
  if (!symbol) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Symbol is required'
    })
  }

  try {
    const quote = await yahooFinance.quote(symbol)
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
})

