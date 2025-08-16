export interface User {
  id: string
  name: string
  username: string
  email: string
  phone: string
  role: 'customer' | 'admin'
  walletBalance: number
  createdAt: string
  isActive: boolean
  hasTransferPin: boolean
  transferPin?: string
  state?: string
  status?: string
}

export interface Transaction {
  id?: string
  userId: string
  type: 'airtime' | 'data' | 'wallet_funding' | 'wallet_withdrawal'
  amount: number
  status: 'pending' | 'successful' | 'failed'
  description: string
  phoneNumber?: string
  network?: string
  dataPlan?: string
  reference?: string
  createdAt: string
  updatedAt: string
  userName?: string
}

export interface AirtimePlan {
  id: string
  network: string
  amount: number
  description: string
  isActive: boolean
}

export interface DataPlan {
  id: string
  network: string
  name: string
  size: string
  price: number
  validity: string
  isActive: boolean
}

export interface WalletLog {
  id: string
  userId: string
  userName: string
  userEmail: string
  type: 'credit' | 'debit'
  amount: number
  balance: number
  description: string
  reference: string
  paymentMethod: string
  status: 'successful' | 'pending' | 'failed'
  createdAt: string
}

export interface Network {
  id: string
  name: string
  code: string
  logo: string
  isActive: boolean
}

export interface AdminStats {
  totalUsers: number
  totalTransactions: number
  totalRevenue: number
  activeUsers: number
  pendingTransactions: number
  previousUsers?: number
  previousRevenue?: number
  previousTransactions?: number
  previousActiveUsers?: number
  airtimeTransactions?: number
  airtimeRevenue?: number
  dataTransactions?: number
  dataRevenue?: number
  walletTransactions?: number
  walletRevenue?: number
  networkStats?: {
    [key: string]: {
      successful: number
      total: number
    }
  }
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface UserState {
  walletBalance: number
  transactions: Transaction[]
  isLoading: boolean
}

export interface AdminState {
  users: User[]
  transactions: Transaction[]
  walletLogs: WalletLog[]
  stats: AdminStats
  isLoading: boolean
} 