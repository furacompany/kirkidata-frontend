import { create } from 'zustand'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'
import { AdminStats, User, Transaction, WalletLog } from '../types'

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
  updateUserProfile: (userId: string, firstName: string, lastName: string, state: string) => Promise<any>
  updateUserWallet: (userId: string, amount: number, operation: 'add' | 'subtract', description: string) => Promise<any>
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
}

export const useAdminStore = create<AdminAuthStore>((set, _get) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: false,
  stats: null,
  users: [],
  transactions: [],
  walletLogs: [],

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
      console.log('Admin store: getUserByPhone called with:', phone)
      const response = await apiService.getUserByPhone(phone)
      console.log('Admin store: getUserByPhone response:', response)
      return response
    } catch (error: any) {
      console.error('Admin store: getUserByPhone error:', error)
      toast.error(error.message || 'Failed to get user by phone')
      throw error
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      console.log('Admin store: getUserByEmail called with:', email)
      const response = await apiService.getUserByEmail(email)
      console.log('Admin store: getUserByEmail response:', response)
      return response
    } catch (error: any) {
      console.error('Admin store: getUserByEmail error:', error)
      toast.error(error.message || 'Failed to get user by email')
      throw error
    }
  },

  // Update User Profile by Admin
  updateUserProfile: async (userId: string, firstName: string, lastName: string, state: string) => {
    try {
      console.log('Admin store: updateUserProfile called with:', { userId, firstName, lastName, state })
      const response = await apiService.updateUserProfileByAdmin(userId, { firstName, lastName, state })
      console.log('Admin store: updateUserProfile response:', response)
      toast.success('User profile updated successfully!')
      return response
    } catch (error: any) {
      console.error('Admin store: updateUserProfile error:', error)
      toast.error(error.message || 'Failed to update user profile')
      throw error
    }
  },

  // Update User Wallet by Admin
  updateUserWallet: async (userId: string, amount: number, operation: 'add' | 'subtract', description: string) => {
    try {
      console.log('Admin store: updateUserWallet called with:', { userId, amount, operation, description })
      const response = await apiService.updateUserWallet(userId, { amount, operation, description })
      console.log('Admin store: updateUserWallet response:', response)
      toast.success('User wallet updated successfully!')
      return response
    } catch (error: any) {
      console.error('Admin store: updateUserWallet error:', error)
      toast.error(error.message || 'Failed to update user wallet')
      throw error
    }
  },

  // Search Users with Filters and Pagination
  searchUsers: async (filters: any) => {
    try {
      console.log('Admin store: searchUsers called with filters:', filters)
      const response = await apiService.searchUsers(filters)
      console.log('Admin store: searchUsers response:', response)
      return response
    } catch (error: any) {
      console.error('Admin store: searchUsers error:', error)
      toast.error(error.message || 'Failed to search users')
      throw error
    }
  },

  // Get User Statistics
  getUserStats: async (filters: any) => {
    try {
      console.log('Admin store: getUserStats called with filters:', filters)
      const response = await apiService.getUserStats(filters)
      console.log('Admin store: getUserStats response:', response)
      return response
    } catch (error: any) {
      console.error('Admin store: getUserStats error:', error)
      toast.error(error.message || 'Failed to get user statistics')
      throw error
    }
  },

  // Bulk User Operations
  bulkUserOperation: async (userIds: string[], operation: 'activate' | 'deactivate' | 'delete', additionalData?: any) => {
    try {
      console.log('Admin store: bulkUserOperation called with:', { userIds, operation, additionalData })
      const response = await apiService.bulkUserOperation({ userIds, operation, additionalData })
      console.log('Admin store: bulkUserOperation response:', response)
      
      if (response.success) {
        const operationText = operation.charAt(0).toUpperCase() + operation.slice(1)
        toast.success(`Bulk ${operationText} operation completed successfully!`)
      }
      
      return response
    } catch (error: any) {
      console.error('Admin store: bulkUserOperation error:', error)
      toast.error(error.message || 'Failed to perform bulk user operation')
      throw error
    }
  },

  // Deactivate User
  deactivateUser: async (userId: string) => {
    try {
      console.log('Admin store: deactivateUser called with userId:', userId)
      const response = await apiService.deactivateUser(userId)
      console.log('Admin store: deactivateUser response:', response)
      
      if (response.success) {
        toast.success('User deactivated successfully!')
      }
      
      return response
    } catch (error: any) {
      console.error('Admin store: deactivateUser error:', error)
      toast.error(error.message || 'Failed to deactivate user')
      throw error
    }
  },

  // Reactivate User
  reactivateUser: async (userId: string) => {
    try {
      console.log('Admin store: reactivateUser called with userId:', userId)
      const response = await apiService.reactivateUser(userId)
      console.log('Admin store: reactivateUser response:', response)
      
      if (response.success) {
        toast.success('User reactivated successfully!')
      }
      
      return response
    } catch (error: any) {
      console.error('Admin store: reactivateUser error:', error)
      toast.error(error.message || 'Failed to reactivate user')
      throw error
    }
  },

  // Delete User
  deleteUser: async (userId: string) => {
    try {
      console.log('Admin store: deleteUser called with userId:', userId)
      const response = await apiService.deleteUser(userId)
      console.log('Admin store: deleteUser response:', response)
      
      if (response.success) {
        toast.success('User deleted successfully!')
      }
      
      return response
    } catch (error: any) {
      console.error('Admin store: deleteUser error:', error)
      toast.error(error.message || 'Failed to delete user')
      throw error
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    
    try {
      const response = await apiService.adminLogin({ email, password })
      
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
      await apiService.adminLogout()
      toast.success('Admin logged out successfully')
    } catch (error) {
      // Even if API call fails, we still want to clear local state
    } finally {
      // Clear admin tokens from localStorage
      localStorage.removeItem('adminAccessToken')
      localStorage.removeItem('adminRefreshToken')
      localStorage.removeItem('adminData')
      
      set({
        admin: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  fetchAdminProfile: async () => {
    try {
      const response = await apiService.getAdminProfile()
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
      const response = await apiService.updateAdminProfile({ firstName, lastName, phone })
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
      const response = await apiService.changeAdminPassword({ currentPassword, newPassword })
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
      set({ admin: null, isAuthenticated: false })
      return false
    }

    // If tokens exist, admin is considered authenticated
    // No auto-logout - admin stays logged in until they explicitly logout
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
      const response = await apiService.getAdminProfile()
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
    } catch (error) {
      // Even if API call fails, if we have tokens, consider admin authenticated
      // This prevents auto-logout on network issues
      return true
    }

    // If we have tokens, consider admin authenticated regardless of API response
    set({ isAuthenticated: true })
    return true
  },

  // Data fetching methods - TODO: Implement these methods in apiService
  fetchStats: async () => {
    try {
      // const response = await apiService.getAdminStats()
      // if (response.success && response.data) {
      //   set({ stats: response.data })
      // }
      console.log('fetchStats: Method not yet implemented in apiService')
    } catch (error: any) {
      console.error('Failed to fetch stats:', error)
      toast.error('Failed to fetch statistics')
    }
  },

  fetchUsers: async () => {
    try {
      // const response = await apiService.getAllUsers()
      // if (response.success && response.data) {
      //   set({ users: response.data })
      // }
      console.log('fetchUsers: Method not yet implemented in apiService')
    } catch (error: any) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to fetch users')
    }
  },

  fetchTransactions: async () => {
    try {
      // const response = await apiService.getAllTransactions()
      // if (response.success && response.data) {
      //   set({ transactions: response.data })
      // }
      console.log('fetchTransactions: Method not yet implemented in apiService')
    } catch (error: any) {
      console.error('Failed to fetch transactions:', error)
      toast.error('Failed to fetch transactions')
    }
  },

  fetchWalletLogs: async () => {
    try {
      // const response = await apiService.getWalletLogs()
      // if (response.success && response.data) {
      //   set({ walletLogs: response.data })
      // }
      console.log('fetchWalletLogs: Method not yet implemented in apiService')
    } catch (error: any) {
      console.error('Failed to fetch wallet logs:', error)
      toast.error('Failed to fetch wallet logs')
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
      console.log('updateTransactionStatus: Method not yet implemented in apiService')
    } catch (error: any) {
      console.error('Failed to update transaction status:', error)
      toast.error('Failed to update transaction status')
      throw error
    }
  },
})) 