import type { AssetInfo, Transaction } from '~/types/asset-info'

export const useAssets = () => {
  const { locale } = useI18n()
  // 数据库计算好的原始持仓数据
  const rawHoldings = useState<any[]>('raw_holdings', () => [])
  const currentPrices = useState<Record<string, AssetInfo>>('currentPrices', () => ({}))
  const transactions = useState<Transaction[]>('transactions', () => [])
  const isLoading = useState<boolean>('assets_loading', () => false)
  const isPriceLoading = useState<boolean>('prices_loading', () => false)
  
  // 当前显示的币种
  const displayCurrency = useState<string>('display_currency', () => 'USD')

  // 汇率表：存储 1 USD 对应多少目标货币 (例如: rates['HKD'] = 7.8)
  const rates = useState<Record<string, number>>('rates', () => ({
    'USD': 1
  }))

  // 从后端加载聚合后的资产
  const refreshHoldings = async () => {
    isLoading.value = true
    try {
      const data = await $fetch<any[]>('/api/assets')
      rawHoldings.value = data
      await Promise.all([
        refreshPrices(),
        refreshRates()
      ])
    } finally {
      isLoading.value = false
    }
  }

  // 刷新所有相关的汇率
  const refreshRates = async () => {
    // 收集所有需要转换的币种：原始持仓币种 + 当前显示币种
    const currencies = new Set<string>()
    rawHoldings.value.forEach(h => { if (h.currency && h.currency !== 'USD') currencies.add(h.currency) })
    if (displayCurrency.value !== 'USD') currencies.add(displayCurrency.value)

    if (currencies.size === 0) return

    // 雅虎财经货币符号通常为 "USD[CURR]=X"，表示 1 USD 等于多少目标货币
    for (const currency of currencies) {
      try {
        const symbol = `USD${currency}=X`
        const data = await $fetch<AssetInfo>('/api/stock', { query: { symbol } })
        if (data && data.price) {
          rates.value[currency] = data.price
        }
      } catch (e) {
        // 如果 USDXXX=X 失败，尝试 XXX=X (部分币种如 HKD=X 也常用)
        try {
          const data = await $fetch<AssetInfo>('/api/stock', { query: { symbol: `${currency}=X` } })
          if (data && data.price) {
            rates.value[currency] = data.price
          }
        } catch (err) {
          console.error(`Failed to fetch rate for ${currency}`, err)
        }
      }
    }
  }

  // 监听显示币种变化，自动刷新汇率
  watch(displayCurrency, () => {
    refreshRates()
  })

  // 监听语言变化，自动设置默认币种
  watch(locale, (newLocale) => {
    if (newLocale === 'zh-CN') displayCurrency.value = 'CNY'
    else if (newLocale === 'zh-TW') displayCurrency.value = 'HKD'
    else if (newLocale === 'en') displayCurrency.value = 'USD'
  }, { immediate: true })

  // 获取特定币种对 USD 的汇率 (1 XXX = ? USD)
  const getRateToUSD = (currency: string) => {
    if (!currency || currency === 'USD') return 1
    const rate = rates.value[currency]
    return rate ? 1 / rate : 1 // 如果 1 USD = 7.8 HKD, 则 1 HKD = 1/7.8 USD
  }

  // 获取 USD 到特定币种的汇率 (1 USD = ? XXX)
  const getRateFromUSD = (toCurrency: string) => {
    if (!toCurrency || toCurrency === 'USD') return 1
    return rates.value[toCurrency] || 1
  }

  // 提交交易记录
  const addTransaction = async (t: { symbol: string, type: string, amount: number, price: number, currency: string, date?: string }) => {
    await $fetch('/api/transactions', {
      method: 'POST',
      body: t
    })
    await refreshHoldings()
    await refreshTransactions()
  }

  const refreshTransactions = async () => {
    const data = await $fetch<Transaction[]>('/api/transactions')
    transactions.value = data
  }

  const deleteTransaction = async (id: number) => {
    await $fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    await refreshTransactions()
    await refreshHoldings()
  }

  const updateTransaction = async (id: number, t: Partial<Transaction>) => {
    await $fetch(`/api/transactions/${id}`, {
      method: 'PATCH',
      body: t
    })
    await refreshTransactions()
    await refreshHoldings()
  }

  const refreshPrices = async (force = false) => {
    const symbols = rawHoldings.value.map(h => h.symbol)
    if (symbols.length === 0) return

    isPriceLoading.value = true
    try {
      for (const symbol of symbols) {
        try {
          const query: any = { symbol }
          if (force) query.refresh = Date.now() // 增加随机参数

          const data = await $fetch<AssetInfo>('/api/stock', { query })
          if (data) {
            currentPrices.value[symbol] = data
          }
        } catch (e) {
          console.error(`Failed to fetch price for ${symbol}`, e)
        }
      }
    } finally {
      isPriceLoading.value = false
    }
  }

  // 将原始持仓与实时价格、汇率结合进行计算
  const holdings = computed(() => {
    const targetCurrency = displayCurrency.value

    return rawHoldings.value.map(h => {
      const info = currentPrices.value[h.symbol]
      const totalCost = h.amount * h.avgPrice
      const originalCurrency = h.currency || 'USD'
      
      const baseData = {
        symbol: h.symbol,
        name: info?.name || h.symbol,
        quantity: h.amount,
        averageCost: h.avgPrice,
        totalCost: totalCost,
        currency: originalCurrency,
        currentPrice: info?.price || 0,
      }

      // 1. 先换算为基准货币 USD
      const rateToUSD = getRateToUSD(originalCurrency)
      const totalCostUSD = totalCost * rateToUSD
      const currentPriceUSD = baseData.currentPrice * rateToUSD
      const valueUSD = h.amount * currentPriceUSD
      const profitUSD = valueUSD - totalCostUSD
      const profitPercent = totalCostUSD > 0 ? (profitUSD / totalCostUSD) * 100 : 0

      // 2. 再由 USD 换算为当前显示的币种
      const rateFromUSD = getRateFromUSD(targetCurrency)
      const displayValue = valueUSD * rateFromUSD
      const displayProfit = profitUSD * rateFromUSD
      const displayTotalCost = totalCostUSD * rateFromUSD

      return {
        ...baseData,
        displayValue,
        displayProfit,
        displayTotalCost,
        displayCurrency: targetCurrency,
        profitPercent,
        valueUSD,
        profitUSD,
        totalCostUSD
      }
    })
  })

  return {
    holdings,
    transactions,
    displayCurrency,
    isLoading,
    isPriceLoading,
    addTransaction,
    refreshHoldings,
    refreshPrices,
    refreshRates,
    refreshTransactions,
    deleteTransaction,
    updateTransaction,
    rates
  }
}
