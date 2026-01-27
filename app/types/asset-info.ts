export interface AssetInfo {
  symbol: string
  price: number
  currency: string
  name: string
}

export type TransactionType = 'register' | 'buy' | 'sell'

export interface Transaction {
  id: number
  symbol: string
  type: TransactionType
  amount: number
  price: number
  date: string
  currency: string
}

export interface Holding {
  symbol: string
  name: string
  quantity: number
  averageCost: number
  currentPrice: number
  currency: string
  value: number
  totalCost: number
  profit: number
  profitPercent: number
  valueUSD: number
  profitUSD: number
  totalCostUSD: number
}
