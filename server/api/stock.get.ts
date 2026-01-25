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
    const response = await fetch(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Yahoo API Error Response:', errorText)
      throw new Error(`Yahoo API status: ${response.status}`)
    }

    const data: any = await response.json()
    const quote = data.quoteResponse?.result?.[0]
    
    if (!quote) {
      throw createError({
        statusCode: 404,
        statusMessage: `Stock symbol "${symbol}" not found or unauthorized`
      })
    }

    return {
      symbol: quote.symbol,
      price: quote.regularMarketPrice,
      currency: quote.currency,
      name: quote.shortName || quote.longName
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
