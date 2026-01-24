export type RiskLevel = 'low' | 'medium' | 'high'
export type AiSignal = 'Bullish' | 'Neutral' | 'Bearish'

export type Holding = {
  symbol: string
  name: string
  sector: string
  shares: number
  avgCost: number
  price: number
  dayChangePct: number
  totalChangePct: number
  aiSignal: AiSignal
  riskLevel: RiskLevel
  confidence: number
}

export type Transaction = {
  id: string
  type: 'BUY' | 'SELL' | 'DIV'
  symbol: string
  name: string
  amount: number
  timestamp: string
}

export type PortfolioSeriesPoint = {
  label: string
  portfolio: number
  benchmark: number
  cash: number
}

export const mockHoldings: Holding[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Tech',
    shares: 18,
    avgCost: 162.4,
    price: 189.22,
    dayChangePct: 0.62,
    totalChangePct: 16.5,
    aiSignal: 'Bullish',
    riskLevel: 'low',
    confidence: 88,
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA',
    sector: 'Tech',
    shares: 6,
    avgCost: 610.1,
    price: 754.55,
    dayChangePct: -0.44,
    totalChangePct: 23.7,
    aiSignal: 'Neutral',
    riskLevel: 'medium',
    confidence: 74,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla',
    sector: 'Auto',
    shares: 10,
    avgCost: 234.2,
    price: 219.12,
    dayChangePct: -1.22,
    totalChangePct: -6.4,
    aiSignal: 'Bearish',
    riskLevel: 'high',
    confidence: 81,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    sector: 'Tech',
    shares: 8,
    avgCost: 345.7,
    price: 392.3,
    dayChangePct: 0.21,
    totalChangePct: 13.2,
    aiSignal: 'Bullish',
    riskLevel: 'low',
    confidence: 86,
  },
  {
    symbol: 'JPM',
    name: 'JPMorgan Chase',
    sector: 'Finance',
    shares: 14,
    avgCost: 151.9,
    price: 168.42,
    dayChangePct: 0.09,
    totalChangePct: 10.9,
    aiSignal: 'Neutral',
    riskLevel: 'medium',
    confidence: 69,
  },
  {
    symbol: 'GLD',
    name: 'SPDR Gold Shares',
    sector: 'Hedge',
    shares: 12,
    avgCost: 179.3,
    price: 188.02,
    dayChangePct: 0.18,
    totalChangePct: 4.9,
    aiSignal: 'Neutral',
    riskLevel: 'low',
    confidence: 63,
  },
]

export const mockTransactions: Transaction[] = [
  {
    id: 't1',
    type: 'BUY',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    amount: 850.0,
    timestamp: 'Today • 2:14 PM',
  },
  {
    id: 't2',
    type: 'DIV',
    symbol: 'MSFT',
    name: 'Microsoft',
    amount: 26.4,
    timestamp: 'Yesterday • 9:10 AM',
  },
  {
    id: 't3',
    type: 'SELL',
    symbol: 'TSLA',
    name: 'Tesla',
    amount: 540.0,
    timestamp: 'Jan 21 • 11:42 AM',
  },
  {
    id: 't4',
    type: 'BUY',
    symbol: 'NVDA',
    name: 'NVIDIA',
    amount: 1200.0,
    timestamp: 'Jan 18 • 4:03 PM',
  },
]

export const mockPortfolioSeries: PortfolioSeriesPoint[] = [
  { label: 'Jan', portfolio: 40210, benchmark: 39200, cash: 8200 },
  { label: 'Feb', portfolio: 41840, benchmark: 40110, cash: 7900 },
  { label: 'Mar', portfolio: 40920, benchmark: 39870, cash: 8600 },
  { label: 'Apr', portfolio: 43680, benchmark: 41640, cash: 8100 },
  { label: 'May', portfolio: 45110, benchmark: 42620, cash: 7800 },
  { label: 'Jun', portfolio: 44524, benchmark: 43010, cash: 8050 },
]
