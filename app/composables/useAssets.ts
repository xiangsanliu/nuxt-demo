import type { Transaction, Holding, TransactionType, AssetInfo } from '~/types/asset-info'

export const useAssets = () => {
  const transactions = useState<Transaction[]>('transactions', () => [])

  // Load transactions from localStorage on client-side
  onMounted(() => {
    const saved = localStorage.getItem('transactions')
    if (saved) {
      transactions.value = JSON.parse(saved)
    }
  })

  // Watch and save to localStorage
  watch(transactions, (newVal) => {
    localStorage.setItem('transactions', JSON.stringify(newVal))
  }, { deep: true })

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...t,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)
    }
    transactions.value.push(transaction)
  }

  const holdings = computed(() => {
    const map = new Map<string, { quantity: number; totalCost: number; symbol: string; currency: string }>()
    
    for (const t of transactions.value) {
      if (!map.has(t.symbol)) {
        map.set(t.symbol, { quantity: 0, totalCost: 0, symbol: t.symbol, currency: t.currency })
      }
      const h = map.get(t.symbol)!
      if (t.type === 'buy' || t.type === 'register') {
        h.quantity += t.quantity
        h.totalCost += t.quantity * t.price
      } else if (t.type === 'sell') {
        const avgCost = h.quantity > 0 ? h.totalCost / h.quantity : 0
        h.quantity -= t.quantity
        h.totalCost -= t.quantity * avgCost
      }
    }

    return Array.from(map.values())
      .filter(h => h.quantity > 0)
      .map(h => ({
        symbol: h.symbol,
        name: h.symbol,
        quantity: h.quantity,
        averageCost: h.totalCost / h.quantity,
        totalCost: h.totalCost,
        currentPrice: 0,
        currency: h.currency,
        value: 0,
        profit: 0,
        profitPercent: 0,
        valueUSD: 0,
        profitUSD: 0,
        totalCostUSD: 0
      }))
  })

  const currentPrices = useState<Record<string, AssetInfo>>('currentPrices', () => ({}))

  const refreshPrices = async () => {
    const symbols = holdings.value.map(h => h.symbol)
    if (symbols.length === 0) return

    // For simplicity, we fetch one by one or create a bulk API
    // Let's just fetch one by one for now if there aren't many, 
    // but a bulk API would be better.
    for (const symbol of symbols) {
      try {
        const data = await $fetch<AssetInfo>('/api/stock', { query: { symbol } })
        if (data) {
          currentPrices.value[symbol] = data
        }
      } catch (e) {
        console.error(`Failed to fetch price for ${symbol}`, e)
      }
    }
  }

  const rates = useState<Record<string, number>>('rates', () => ({
    'USD': 1,
    'HKD': 0.128, // Default approx
    'CNY': 0.138  // Default approx
  }))

  const refreshRates = async () => {
    const pairs = ['HKDUSD=X', 'CNYUSD=X']
    for (const pair of pairs) {
      try {
        const data = await $fetch<AssetInfo>('/api/stock', { query: { symbol: pair } })
        if (data) {
          const from = pair.substring(0, 3)
          rates.value[from] = data.price
        }
      } catch (e) {
        console.error(`Failed to fetch rate for ${pair}`, e)
      }
    }
  }

  const holdingsWithPrices = computed(() => {
    return holdings.value.map(h => {
      const info = currentPrices.value[h.symbol]
      if (!info) return h

      const currentPrice = info.price
      const value = h.quantity * currentPrice
      const profit = value - h.totalCost
      const profitPercent = h.totalCost > 0 ? (profit / h.totalCost) * 100 : 0
      
      const rate = rates.value[h.currency] || 1
      const valueUSD = value * rate
      const profitUSD = profit * rate
      const totalCostUSD = h.totalCost * rate

      return {
        ...h,
        name: info.name,
        currentPrice,
        value,
        profit,
        profitPercent,
        valueUSD,
        profitUSD,
        totalCostUSD
      }
    })
  })

  return {
    transactions,
    holdings: holdingsWithPrices,
    addTransaction,
    refreshPrices,
    refreshRates,
    rates
  }
}
