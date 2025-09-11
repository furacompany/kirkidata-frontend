import { create } from 'zustand'
import { adminApiService } from '../services/adminApi'
import toast from 'react-hot-toast'
import { 
  AdminStats, 
  User, 
  Transaction, 
  WalletLog, 
  OtoBillProfile, 
  OtoBillWalletBalance,
  OtoBillTransaction,
  OtoBillTransactionStats,
  TransactionStats
} from '../types'
import { clearAdminAuth } from '../utils/auth'

interface Admin {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  isActive: boolean
  role: string
}

interface AdminAuthState {
  admin: Admin | null
  isAuthenticated: boolean
  isLoading: boolean
  stats: AdminStats | null
  users: User[]
  transactions: Transaction[]
  walletLogs: WalletLog[]
  otobillProfile: OtoBillProfile | null
  otobillWalletBalance: OtoBillWalletBalance | null
  otobillTransactions: OtoBillTransaction[]
  otobillTransactionStats: OtoBillTransactionStats | null
  otobillTransactionsPagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  } | null
  transactionStats: TransactionStats | null
}

interface AdminAuthStore extends AdminAuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchAdminProfile: () => Promise<void>
  updateAdminProfile: (firstName: string, lastName: string, phone: string) => Promise<void>
  changeAdminPassword: (currentPassword: string, newPassword: string) => Promise<void>
  checkAuthStatus: () => Promise<boolean>
  restoreAuthState: () => boolean
  // User Management
  getUserByPhone: (phone: string) => Promise<any>
  getUserByEmail: (email: string) => Promise<any>
  getUserById: (userId: string) => Promise<any>
  updateUserProfile: (userId: string, firstName: string, lastName: string, state: string) => Promise<any>
  updateUserWallet: (userId: string, amount: number, description: string) => Promise<any>
  searchUsers: (filters: any) => Promise<any>
  getUserStats: (filters: any) => Promise<any>
  bulkUserOperation: (userIds: string[], operation: 'activate' | 'deactivate' | 'delete', additionalData?: any) => Promise<any>
  deactivateUser: (userId: string) => Promise<any>
  reactivateUser: (userId: string) => Promise<any>
  deleteUser: (userId: string) => Promise<any>
  // Data fetching methods
  fetchStats: () => Promise<void>
  fetchUsers: () => Promise<void>
  fetchTransactions: () => Promise<void>
  fetchWalletLogs: () => Promise<void>
  updateTransactionStatus: (transactionId: string, status: 'pending' | 'successful' | 'failed') => Promise<void>
  // OtoBill methods
  fetchOtoBillProfile: () => Promise<void>
  fetchOtoBillWalletBalance: () => Promise<void>
  fetchOtoBillTransactions: (page?: number, limit?: number, filters?: any) => Promise<void>
  fetchOtoBillTransaction: (transactionId: string) => Promise<OtoBillTransaction | null>
  fetchOtoBillTransactionStats: (startDate?: string, endDate?: string, type?: 'all' | 'data' | 'airtime') => Promise<void>
  fetchTransactionStats: (startDate?: string, endDate?: string) => Promise<void>
}

export const useAdminStore = create<AdminAuthStore>((set) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: false,
  stats: null,
  users: [],
  transactions: [],
  walletLogs: [],
  otobillProfile: null,
  otobillWalletBalance: null,
  otobillTransactions: [],
  otobillTransactionStats: null,
  otobillTransactionsPagination: null,
  transactionStats: null,

  restoreAuthState: () => {
    const accessToken = localStorage.getItem('adminAccessToken')
    const refreshToken = localStorage.getItem('adminRefreshToken')
    const adminData = localStorage.getItem('adminData')
    
    if (accessToken && refreshToken) {
      set({ isAuthenticated: true })
      
      if (adminData) {
        try {
          const admin = JSON.parse(adminData)
          set({ admin, isAuthenticated: true })
        } catch (error) {
          // Silent fail - admin data parsing error
        }
      }
      
      return true
    }
    
    return false
  },

  // User Management Methods
  getUserByPhone: async (phone: string) => {
    try {
      const response = await adminApiService.getUserByPhone(phone)
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to get user by phone')
      throw error
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      const response = await adminApiService.getUserByEmail(email)
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to get user by email')
      throw error
    }
  },

  // Update User Profile by Admin
  updateUserProfile: async (userId: string, firstName: string, lastName: string, state: string) => {
    try {
      const response = await adminApiService.updateUserProfileByAdmin(userId, { firstName, lastName, state })
      toast.success('User profile updated successfully!')
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user profile')
      throw error
    }
  },

  // Update User Wallet by Admin
  updateUserWallet: async (userId: string, amount: number, description: string) => {
    try {
      const response = await adminApiService.updateUserWallet(userId, { amount, description })
      toast.success('User wallet updated successfully!')
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user wallet')
      throw error
    }
  },

  // Search Users with Filters and Pagination
  searchUsers: async (filters: any) => {
    try {
      const response = await adminApiService.searchUsers(filters)
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to search users')
      throw error
    }
  },

  // Get User Statistics
  getUserStats: async (filters: any) => {
    try {
      const response = await adminApiService.getUserStats(filters)
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to get user statistics')
      throw error
    }
  },

  // Bulk User Operations
  bulkUserOperation: async (userIds: string[], operation: 'activate' | 'deactivate' | 'delete', additionalData?: any) => {
    try {
      const response = await adminApiService.bulkUserOperation({ userIds, operation, additionalData })
      
      if (response.success) {
        const operationText = operation.charAt(0).toUpperCase() + operation.slice(1)
        toast.success(`Bulk ${operationText} operation completed successfully!`)
      }
      
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to perform bulk user operation')
      throw error
    }
  },

  // Deactivate User
  deactivateUser: async (userId: string) => {
    try {
      const response = await adminApiService.deactivateUser(userId)
      
      if (response.success) {
        toast.success('User deactivated successfully!')
      }
      
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to deactivate user')
      throw error
    }
  },

  // Reactivate User
  reactivateUser: async (userId: string) => {
    try {
      const response = await adminApiService.reactivateUser(userId)
      
      if (response.success) {
        toast.success('User reactivated successfully!')
      }
      
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to reactivate user')
      throw error
    }
  },

  // Delete User
  deleteUser: async (userId: string) => {
    try {
      const response = await adminApiService.deleteUser(userId)
      
      if (response.success) {
        toast.success('User deleted successfully!')
      }
      
      return response
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user')
      throw error
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    
    try {
      const response = await adminApiService.adminLogin({ email, password })
      
      if (response.success && response.data) {
        const admin: Admin = {
          id: response.data.admin.id || '',
          firstName: response.data.admin.firstName,
          lastName: response.data.admin.lastName,
          email: response.data.admin.email,
          phone: response.data.admin.phone,
          isActive: response.data.admin.isActive,
          role: response.data.admin.role,
        }
        
        // Store admin tokens and data in localStorage
        localStorage.setItem('adminAccessToken', response.data.accessToken)
        localStorage.setItem('adminRefreshToken', response.data.refreshToken)
        localStorage.setItem('adminData', JSON.stringify(admin))
        
        set({
          admin,
          isAuthenticated: true,
          isLoading: false,
        })
        
        toast.success('Admin login successful!')
      } else {
        throw new Error(response.message || 'Admin login failed')
      }
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },

  logout: async () => {
    try {
      // Call admin logout API endpoint
      await adminApiService.adminLogout()
      toast.success('Admin logged out successfully')
    } catch (error) {
      // Even if API call fails, we still want to clear local state
    } finally {
      // Clear admin tokens from localStorage
      clearAdminAuth()
      
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  fetchAdminProfile: async () => {
    try {
      const response = await adminApiService.getAdminProfile()
      if (response.success && response.data) {
        const admin: Admin = {
          id: response.data._id,
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email,
          phone: response.data.phone,
          isActive: response.data.isActive || true,
          role: response.data.role,
        }
        
        set({ admin })
        localStorage.setItem('adminData', JSON.stringify(admin))
      } else {
        throw new Error(response.message || 'Failed to fetch admin profile')
      }
    } catch (error: any) {
      toast.error('Failed to fetch admin profile')
      throw error
    }
  },

  updateAdminProfile: async (firstName: string, lastName: string, phone: string) => {
    try {
      const response = await adminApiService.updateAdminProfile({ firstName, lastName, phone })
      if (response.success && response.data) {
        const admin: Admin = {
          id: response.data._id,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone,
          isActive: response.data.isActive,
          role: response.data.role,
        }
        
        set({ admin })
        localStorage.setItem('adminData', JSON.stringify(admin))
        toast.success('Profile updated successfully!')
      } else {
        throw new Error(response.message || 'Failed to update admin profile')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update admin profile')
      throw error
    }
  },

  changeAdminPassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await adminApiService.changeAdminPassword({ currentPassword, newPassword })
      if (response.success) {
        toast.success('Password changed successfully!')
      } else {
        throw new Error(response.message || 'Failed to change password')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
      throw error
    }
  },

  checkAuthStatus: async () => {
    const accessToken = localStorage.getItem('adminAccessToken')
    const refreshToken = localStorage.getItem('adminRefreshToken')

    if (!accessToken || !refreshToken) {
      // Clear auth state and redirect to login
      clearAdminAuth()
      set({ admin: null, isAuthenticated: false })
      return false
    }

    // If tokens exist, admin is considered authenticated
    const adminData = localStorage.getItem('adminData')
    if (adminData) {
      try {
        const admin = JSON.parse(adminData)
        set({ admin, isAuthenticated: true })
        return true
      } catch (error) {
        // Silent fail - admin data parsing error
        console.error('Error parsing admin data:', error)
      }
    }

    // If no admin data in localStorage but tokens exist, try to fetch admin data
    try {
      const response = await adminApiService.getAdminProfile()
      if (response.success && response.data) {
        const admin: Admin = {
          id: response.data._id,
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email,
          phone: response.data.phone,
          isActive: response.data.isActive || true,
          role: response.data.role,
        }
        set({ admin, isAuthenticated: true })
        localStorage.setItem('adminData', JSON.stringify(admin))
        return true
      }
    } catch (error: any) {
      // If we get a 401 error, clear the invalid tokens
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        console.warn('Admin tokens are invalid, clearing them')
        clearAdminAuth()
        set({ isAuthenticated: false, admin: null })
        return false
      }
      
      // For other errors (network issues), keep the tokens but don't set as authenticated
      console.warn('Admin auth check failed:', error.message)
      return false
    }

    // If we have tokens but no API response, don't assume authenticated
    return false
  },

  // Data fetching methods
  fetchStats: async () => {
    try {
      // Fetch user statistics
      const userStatsResponse = await adminApiService.getUserStats({
        period: 'month',
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0]
      })

      // Use OtoBill transactions for revenue calculation instead of virtual account transactions
      let transactions: any[] = []
      try {
        const otobillTransactionsResponse = await adminApiService.getOtoBillTransactions(1, 50)
        if (otobillTransactionsResponse.success && otobillTransactionsResponse.data) {
          transactions = otobillTransactionsResponse.data.transactions
        }
      } catch (transactionError) {
        console.warn('OtoBill transactions failed, using fallback data:', transactionError)
        // Use fallback transaction data
        transactions = []
      }
      
      // Calculate stats from real data
      const userStats = userStatsResponse.success ? userStatsResponse.data : null
      
      // Calculate revenue and transaction stats
      const totalRevenue = transactions.reduce((sum: number, t: any) => {
        if (t.status === 'successful' && (t.transactionType === 'airtime' || t.transactionType === 'data')) {
          return sum + (t.amount || 0)
        }
        return sum
      }, 0)

      const totalTransactions = transactions.length
      const successfulTransactions = transactions.filter((t: any) => t.status === 'successful').length
      const pendingTransactions = transactions.filter((t: any) => t.status === 'pending').length
      const failedTransactions = transactions.filter((t: any) => t.status === 'failed').length

      // Calculate transaction type breakdown
      const airtimeTransactions = transactions.filter((t: any) => t.transactionType === 'airtime' && t.status === 'successful').length
      const airtimeRevenue = transactions.reduce((sum: number, t: any) => {
        if (t.transactionType === 'airtime' && t.status === 'successful') {
          return sum + (t.amount || 0)
        }
        return sum
      }, 0)

      const dataTransactions = transactions.filter((t: any) => t.transactionType === 'data' && t.status === 'successful').length
      const dataRevenue = transactions.reduce((sum: number, t: any) => {
        if (t.transactionType === 'data' && t.status === 'successful') {
          return sum + (t.amount || 0)
        }
        return sum
      }, 0)

      const walletTransactions = 0 // OtoBill doesn't have wallet funding transactions
      const walletRevenue = 0 // OtoBill doesn't have wallet funding transactions

      // Calculate network stats
      const networkStats: any = {}
      const networkTransactions = transactions.filter((t: any) => (t.dataNetworkName || t.airtimeNetworkName) && t.status === 'successful')
      
      networkTransactions.forEach((t: any) => {
        const networkName = t.dataNetworkName || t.airtimeNetworkName
        if (!networkStats[networkName]) {
          networkStats[networkName] = { successful: 0, total: 0, revenue: 0 }
        }
        networkStats[networkName].successful++
        networkStats[networkName].revenue += t.amount || 0
      })

      // Add total counts for each network
      transactions.forEach((t: any) => {
        const networkName = t.dataNetworkName || t.airtimeNetworkName
        if (networkName) {
          if (!networkStats[networkName]) {
            networkStats[networkName] = { successful: 0, total: 0, revenue: 0 }
          }
          networkStats[networkName].total++
        }
      })

      // Create comprehensive stats object
      const stats = {
        totalUsers: userStats?.totalUsers || 0,
        activeUsers: userStats?.activeUsers || 0,
        totalRevenue: totalRevenue || 0,
        totalTransactions: totalTransactions || 0,
        pendingTransactions: pendingTransactions || 0,
        successfulTransactions: successfulTransactions || 0,
        failedTransactions: failedTransactions || 0,
        airtimeTransactions: airtimeTransactions || 0,
        airtimeRevenue: airtimeRevenue || 0,
        dataTransactions: dataTransactions || 0,
        dataRevenue: dataRevenue || 0,
        walletTransactions: walletTransactions || 0,
        walletRevenue: walletRevenue || 0,
        previousUsers: userStats?.totalUsers ? Math.floor(userStats.totalUsers * 0.9) : 0, // Estimate previous month
        previousRevenue: totalRevenue ? Math.floor(totalRevenue * 0.85) : 0, // Estimate previous month
        previousTransactions: totalTransactions ? Math.floor(totalTransactions * 0.87) : 0, // Estimate previous month
        previousActiveUsers: userStats?.activeUsers ? Math.floor(userStats.activeUsers * 0.85) : 0, // Estimate previous month
        networkStats: Object.keys(networkStats).length > 0 ? networkStats : {},
        recentTransactions: transactions.slice(0, 4),
        recentUsers: [] // Will be populated by fetchUsers
      }

      set({ stats })
    } catch (error: any) {
      console.error('Failed to fetch stats:', error)
      // Don't show toast error for stats - we'll use fallback values
    }
  },

  fetchUsers: async () => {
    try {
      const response = await adminApiService.searchUsers({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })
      if (response.success && response.data) {
        // Transform the user data to match the User interface
        const transformedUsers = response.data.users.map((user: any) => ({
          id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          username: user.email,
          email: user.email,
          phone: user.phone,
          role: 'customer' as const,
          walletBalance: user.wallet || 0,
          createdAt: user.createdAt,
          isActive: user.isActive,
          hasTransferPin: false,
          state: user.state
        }))
        
        set({ users: transformedUsers })
        
        // Also update the recentUsers in stats
        set((state) => ({
          stats: state.stats ? {
            ...state.stats,
            recentUsers: response.data?.users?.slice(0, 4) || []
          } : null
        }))
      } else {
        throw new Error(response.message || 'Failed to fetch users')
      }
    } catch (error: any) {
      console.error('Failed to fetch users:', error)
      // Don't show toast error - we'll use fallback values
      // toast.error('Failed to fetch users')
    }
  },

  fetchTransactions: async () => {
    try {
      const response = await adminApiService.getOtoBillTransactions(1, 50)
      if (response.success && response.data) {
        // Transform OtoBillTransaction to Transaction format
        const transformedTransactions = response.data.transactions.map((otobillTx: any) => ({
          _id: otobillTx._id,
          userId: otobillTx.userId._id,
          type: otobillTx.transactionType,
          amount: otobillTx.amount,
          currency: 'NGN',
          status: otobillTx.status,
          reference: otobillTx.topupmateRef,
          description: otobillTx.description,
          phoneNumber: otobillTx.dataPhoneNumber || otobillTx.airtimePhoneNumber,
          network: otobillTx.dataNetworkName || otobillTx.airtimeNetworkName,
          dataPlan: otobillTx.dataPlanName,
          transactionId: otobillTx._id,
          otobillRef: otobillTx.topupmateRef,
          profit: otobillTx.profitMargin,
          planId: otobillTx.dataPlanId,
          planName: otobillTx.dataPlanName,
          createdAt: otobillTx.createdAt,
          updatedAt: otobillTx.updatedAt,
          metadata: {
            payerAccountNumber: '',
            bankName: '',
            accountNumber: '',
            accountName: ''
          },
          id: otobillTx._id,
          userName: otobillTx.userId.fullName
        }))
        
        set({ transactions: transformedTransactions })
        
        // Also update the recentTransactions in stats
        set((state) => ({
          stats: state.stats ? {
            ...state.stats,
            recentTransactions: transformedTransactions.slice(0, 4)
          } : null
        }))
      } else {
        throw new Error(response.message || 'Failed to fetch transactions')
      }
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error)
      // Don't show toast error - we'll use fallback values
      // toast.error('Failed to fetch transactions')
    }
  },

  fetchWalletLogs: async () => {
    try {
      // Use OtoBill transactions as wallet logs instead of virtual account transactions
      const response = await adminApiService.getOtoBillTransactions(1, 100)
      if (response.success && response.data) {
        // Transform OtoBill transactions to WalletLog format
        const walletLogs = response.data.transactions.map((transaction: any) => ({
          id: transaction._id,
          userId: transaction.userId._id,
          userName: transaction.userId.fullName || 'Unknown User',
          userEmail: transaction.userId.email || 'No email',
          type: 'credit' as 'credit' | 'debit', // OtoBill transactions are typically credits
          amount: transaction.amount,
          balance: 0, // Balance not available in transaction data
          description: transaction.description,
          reference: transaction.topupmateRef,
          paymentMethod: 'otobill',
          status: transaction.status as 'successful' | 'pending' | 'failed',
          createdAt: transaction.createdAt
        }))
        
        set({ walletLogs })
      } else {
        throw new Error(response.message || 'Failed to fetch wallet logs')
      }
    } catch (error: any) {
      console.error('Failed to fetch wallet logs:', error)
      // Don't show toast error - we'll use empty array as fallback
      set({ walletLogs: [] })
    }
  },

  updateTransactionStatus: async (_transactionId: string, _status: 'pending' | 'successful' | 'failed') => {
    try {
      // const response = await apiService.updateTransactionStatus(transactionId, { status })
      // if (response.success) {
      //   // Update local state
      //   const { transactions } = get()
      //   const updatedTransactions = transactions.map(t => 
      //     t.id === transactionId ? { ...t, status } : t
      //   )
      //   set({ transactions: updatedTransactions })
      //   toast.success('Transaction status updated successfully!')
      // }
      // Method not yet implemented in apiService
    } catch (error: any) {
      console.error('Failed to update transaction status:', error)
      toast.error('Failed to update transaction status')
      throw error
    }
  },

  // OtoBill methods
  fetchOtoBillProfile: async () => {
    try {
      const response = await adminApiService.getOtoBillProfile()
      if (response.success && response.data) {
        set({ otobillProfile: response.data })
      } else {
        throw new Error(response.message || 'Failed to fetch OtoBill profile')
      }
    } catch (error: any) {
      console.error('Failed to fetch OtoBill profile:', error)
      // Silent fail - no error message
      throw error
    }
  },

  fetchOtoBillWalletBalance: async () => {
    try {
      const response = await adminApiService.getOtoBillWalletBalance()
      if (response.success && response.data) {
        set({ otobillWalletBalance: response.data })
      } else {
        throw new Error(response.message || 'Failed to fetch OtoBill wallet balance')
      }
    } catch (error: any) {
      console.error('Failed to fetch OtoBill wallet balance:', error)
      // Silent fail - no error message
      throw error
    }
  },

  fetchOtoBillTransactions: async (page?: number, limit?: number, filters?: any) => {
    try {
      const response = await adminApiService.getOtoBillTransactions(page, limit, filters);
      if (response.success && response.data) {
        set({
          otobillTransactions: response.data.transactions,
          otobillTransactionsPagination: {
            page: response.data.page,
            limit: limit || 20,
            total: response.data.total,
            pages: response.data.pages,
            hasNext: response.data.hasNext,
            hasPrev: response.data.hasPrev
          }
        });
      } else {
        throw new Error(response.message || 'Failed to fetch OtoBill transactions');
      }
    } catch (error: any) {
      console.error('Failed to fetch OtoBill transactions:', error);
      // Silent fail - no error message
      throw error;
    }
  },

  fetchOtoBillTransaction: async (transactionId: string) => {
    try {
      const response = await adminApiService.getOtoBillTransaction(transactionId);
      if (response.success && response.data) {
        return response.data;
      } else {
        return null;
      }
    } catch (error: any) {
      console.error('Failed to fetch OtoBill transaction:', error);
      // Silent fail - no error message
      throw error;
    }
  },

  fetchOtoBillTransactionStats: async (startDate?: string, endDate?: string, type?: 'all' | 'data' | 'airtime') => {
    try {
      const response = await adminApiService.getOtoBillTransactionStats(startDate, endDate, type);
      if (response.success && response.data) {
        set({ otobillTransactionStats: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch OtoBill transaction stats');
      }
    } catch (error: any) {
      console.error('Failed to fetch OtoBill transaction stats:', error);
      // Silent fail - no error message
      throw error;
    }
  },

  fetchTransactionStats: async (startDate?: string, endDate?: string) => {
    try {
      const response = await adminApiService.getTransactionStats(startDate, endDate);
      if (response.success && response.data) {
        set({ transactionStats: response.data });
      } else {
        throw new Error(response.message || 'Failed to fetch transaction stats');
      }
    } catch (error: any) {
      console.error('Failed to fetch transaction stats:', error);
      // Silent fail - no error message
      throw error;
    }
  },

  getUserById: async (userId: string) => {
    try {
      const response = await adminApiService.getUserById(userId);
      return response;
    } catch (error: any) {
      console.error('Failed to fetch user by ID:', error);
      throw error;
    }
  },
})) 