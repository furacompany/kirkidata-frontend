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
  _id: string
  userId: string
  virtualAccountId?: {
    _id: string
    accountNumber: string
    bankName: string
  }
  type: 'airtime' | 'data' | 'wallet_funding' | 'wallet_withdrawal' | 'funding' | 'withdrawal'
  amount: number
  currency: string
  status: 'pending' | 'successful' | 'failed' | 'completed'
  reference: string
  wiaxyRef?: string
  merchantReference?: string
  description: string
  phoneNumber?: string
  network?: string
  dataPlan?: string
  transactionId?: string
  otobillRef?: string
  profit?: number
  planId?: string
  planName?: string
  createdAt: string
  updatedAt: string
  metadata?: {
    payerAccountNumber?: string
    bankName?: string
    accountNumber?: string
    accountName?: string
  }
  // Legacy fields for backward compatibility
  id?: string
  userName?: string
}

// New interface for virtual account transactions response
export interface VirtualAccountTransactionsResponse {
  success: boolean
  message: string
  data: {
    transactions: Transaction[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
  timestamp?: string
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