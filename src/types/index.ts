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

export interface OtoBillProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
  walletBalance: number
  formattedWalletBalance: string
  apiKeyName: string
  ipWhitelist: string
  apiKeyCreatedAt: string
  apiKeyLastUsed: string
  isEmailVerified: boolean
  hasSetPin: boolean
  isActive: boolean
}

export interface OtoBillWalletBalance {
  balance: number
  formattedBalance: string
  userId: string
  email: string
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
      revenue?: number
    }
  }
  recentTransactions?: any[]
  recentUsers?: any[]
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

export interface OtoBillNetwork {
  id: string
  name: string
  status: string
  isActive: boolean
}

export interface OtoBillDataPlan {
  planId: string
  id: string
  name: string
  networkName: string
  planType: string
  validityDays: number
  originalPrice: number
  price: number
  formattedPrice: string
  profit: number
  formattedProfit: string
}

export interface OtoBillDataPlansResponse {
  success: boolean
  message: string
  data: {
    plans: OtoBillDataPlan[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface OtoBillNetworksResponse {
  success: boolean
  message: string
  data: OtoBillNetwork[]
}

export interface OtoBillPricingSummary {
  networks: {
    total: number
    active: number
  }
  dataPlans: {
    total: number
    active: number
    visible: number
  }
  airtimePricing: {
    total: number
    active: number
  }
}

export interface OtoBillPricingSummaryResponse {
  success: boolean
  message: string
  data: OtoBillPricingSummary
}

export interface OtoBillDataPlanWithPricing {
  planId: string
  name: string
  networkName: string
  planType: string
  validityDays: number
  originalPrice: number
  adminPrice: number
  profit: number
  isActive: boolean
  lastSynced: string
}

export interface OtoBillDataPlansPricingResponse {
  success: boolean
  message: string
  data: {
    plans: OtoBillDataPlanWithPricing[]
    pagination: {
      page: number
      limit: number
      total: number
      totalPages: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

export interface OtoBillPricingUpdateRequest {
  adminPrice: number
}

export interface OtoBillPricingUpdateResponse {
  success: boolean
  message: string
  data: {
    planId: string
    name: string
    networkName: string
    originalPrice: number
    adminPrice: number
    profit: number
  }
}

// OtoBill Transaction Management Interfaces
export interface OtoBillTransaction {
  _id: string
  userId: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    fullName: string
    accountStatus: string
    maskedPhoneNumber: string
    maskedEmail: string
    maskedApiKey: string | null
    upgradeCost: number | null
    id: string
  }
  transactionType: 'data' | 'airtime'
  status: 'successful' | 'pending' | 'failed'
  userRole: string
  amount: number
  originalAmount?: number
  topupmateRef: string
  dataPlanId?: string
  dataPlanName?: string
  dataNetworkId?: string
  dataNetworkName?: string
  dataPhoneNumber?: string
  dataPlanType?: string
  dataValidityDays?: number
  airtimeNetworkId?: string
  airtimeNetworkName?: string
  airtimePhoneNumber?: string
  airtimeAmount?: number
  description: string
  createdAt: string
  updatedAt: string
  processedAt?: string
  topupmateResponse?: {
    status: string
    Status: string
  }
  topupmateStatus: string
  formattedAmount: string
  formattedOriginalAmount?: string
  profitMargin?: number
  formattedProfitMargin?: string
  duration: number
  formattedDuration: string
  id: string
}

export interface OtoBillTransactionsResponse {
  success: boolean
  message: string
  data: {
    transactions: OtoBillTransaction[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
  timestamp?: string
}

export interface OtoBillTransactionResponse {
  success: boolean
  message: string
  data: OtoBillTransaction
  timestamp?: string
}

// OtoBill Statistics Interfaces
export interface OtoBillTransactionStats {
  totalTransactions: number
  totalAmount: number
  totalProfit: number
  airtime: {
    count: number
    amount: number
    profit: number
  }
  data: {
    count: number
    amount: number
    profit: number
  }
  period: string
}

export interface OtoBillStatsResponse {
  success: boolean
  message: string
  data: OtoBillTransactionStats
  timestamp?: string
} 