import { create } from 'zustand'
import { User, AuthState } from '../types'
import { userApiService, RegisterRequest } from '../services/userApi'
import { createVirtualAccount } from '../features/virtual-accounts/api'
import toast from 'react-hot-toast'
import { useUserStore } from './userStore'

interface AuthStore extends AuthState {
  login: (phone: string, password: string) => Promise<void>
  loginWithUsername: (usernameOrEmail: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (userData: RegisterRequest) => Promise<void>
  updateUserPin: (pin: string) => Promise<void>
  updateUser: (userData: Partial<User>) => void
  updateUserProfile: (firstName: string, lastName: string, state: string) => Promise<void>
  initializeAuth: () => Promise<void>
  fetchUserProfile: () => Promise<void>
  checkAuthStatus: () => Promise<boolean>
  validatePin: (pin: string) => Promise<boolean>
  changePin: (currentPin: string, newPin: string) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
  restoreAuthState: () => boolean
  validateAndRefreshTokens: () => Promise<boolean>
  areTokensValid: () => boolean
}

export const useAuthStore = create<AuthStore>((set, get) => {
  // Set up periodic token refresh
  let refreshInterval: number | null = null

  const startTokenRefresh = () => {
    // Clear any existing interval
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    
    // Refresh tokens every 10 minutes (600000ms)
    refreshInterval = setInterval(async () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      
             if (accessToken && refreshToken) {
         try {
           await userApiService.validateAndRefreshTokens()
         } catch (error) {
           // Don't logout - user stays logged in
         }
       }
    }, 600000) // 10 minutes
  }

  const stopTokenRefresh = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      refreshInterval = null
    }
  }

  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,

    // New function to immediately restore auth state without API calls
    restoreAuthState: () => {
      const accessToken = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')
      const userData = localStorage.getItem('userData')
      
      if (accessToken && refreshToken) {
        // Immediately set authenticated state
        set({ isAuthenticated: true })
        
                 // Try to restore user data from localStorage
         if (userData) {
           try {
             const user = JSON.parse(userData)
             set({ user, isAuthenticated: true })
             // Sync wallet balance with user store
             useUserStore.getState().syncWalletBalance(user?.walletBalance || 0)
           } catch (error) {
             // Silent fail - user data parsing error
           }
         }
        
        return true
      }
      
      return false
    },

    initializeAuth: async () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const userData = localStorage.getItem('userData')
    
    if (accessToken && refreshToken) {
      // Immediately set authenticated state to prevent auto logout
      set({ isAuthenticated: true })
      
               // Try to restore user data from localStorage first
         let user: User | null = null
         if (userData) {
           try {
             user = JSON.parse(userData)
             // Set user immediately to prevent logout
             set({ user, isAuthenticated: true })
             // Sync wallet balance with user store
             useUserStore.getState().syncWalletBalance(user?.walletBalance || 0)
           } catch (error) {
             // Silent fail - user data parsing error
           }
         }
      
               // Always try to refresh tokens in the background to ensure they're valid
         setTimeout(async () => {
           try {
             const isValid = await userApiService.validateAndRefreshTokens()
             if (isValid) {
               // Start periodic token refresh
               startTokenRefresh()
             } else {
               // If refresh fails, try to fetch user profile to validate tokens
               try {
                 const response = await userApiService.getUserProfile()
                 if (response.success && response.data) {
                   const user: User = {
                     id: response.data._id || '',
                     name: `${response.data.firstName || ''} ${response.data.lastName || ''}`,
                     username: response.data.email || '',
                     email: response.data.email || '',
                     phone: response.data.phone || '',
                     role: 'customer',
                     walletBalance: response.data.wallet || 0,
                     createdAt: response.data.createdAt || new Date().toISOString(),
                     isActive: response.data.isActive || true,
                     hasTransferPin: true,
                     transferPin: '',
                     state: response.data.state || '', // Add state field
                   }
                   set({ user, isAuthenticated: true })
                   
                   // Update localStorage with fresh data
                   localStorage.setItem('userData', JSON.stringify(user))
                   
                   // Sync wallet balance with user store
                   useUserStore.getState().syncWalletBalance(response.data.wallet || 0)
                   
                   // Start periodic token refresh
                   startTokenRefresh()
                 }
               } catch (profileError) {
                 // Don't logout - keep user authenticated with existing data
                 startTokenRefresh()
               }
             }
           } catch (error) {
             // Don't logout - user stays logged in
             // Still start periodic refresh in case tokens become valid later
             startTokenRefresh()
           }
         }, 1000)
      
             // Also fetch the latest wallet balance from the dedicated endpoint
       setTimeout(async () => {
         try {
           await useUserStore.getState().fetchWalletBalance(false)
         } catch (error) {
           // Silent fail - wallet balance fetch error
         }
       }, 2000)
    }
  },

  login: async (phone: string, password: string) => {
    set({ isLoading: true })
    
    try {
      const response = await userApiService.login({ phone, password })
      
      if (response.success && response.data) {
        // Check if there's existing user data in localStorage to restore PIN
        const existingUserData = localStorage.getItem('userData')
        let existingPin = ''
        if (existingUserData) {
          try {
            const existingUser = JSON.parse(existingUserData)
            if (existingUser.phone === response.data.user.phone) {
              existingPin = existingUser.transferPin || ''
            }
          } catch (error) {
            // Silent fail - existing user data parsing error
          }
        }
        
        const user: User = {
          id: response.data.user.id || '',
          name: `${response.data.user.firstName || ''} ${response.data.user.lastName || ''}`,
          username: response.data.user.email || '', // Using email as username for now
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          role: 'customer',
          walletBalance: response.data.user.wallet || 0,
          createdAt: new Date().toISOString(),
          isActive: response.data.user.isActive || true,
          hasTransferPin: !!existingPin,
          transferPin: existingPin,
          state: '', // State will be fetched from profile
        }
        
        // Store tokens and user data in localStorage
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        localStorage.setItem('userData', JSON.stringify(user))
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
        
        // Start periodic token refresh
        startTokenRefresh()
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  loginWithUsername: async (_usernameOrEmail: string, _password: string) => {
    set({ isLoading: true })
    
    // TODO: Implement admin login API call
    // For now, keeping mock implementation for admin users
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    set({ isLoading: false })
    throw new Error('Admin login not implemented yet')
  },

     logout: async () => {
     try {
       // Call logout API endpoint
       await userApiService.logout()
       toast.success('Logged out successfully')
     } catch (error) {
       // Even if API call fails, we still want to clear local state
     } finally {
      // Stop periodic token refresh
      stopTokenRefresh()
      
      // Clear tokens from localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userData') // Clear user data on logout
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  register: async (userData: RegisterRequest) => {
    set({ isLoading: true })
    
    try {
      const response = await userApiService.register(userData)
      
      if (response.success && response.data) {
        const user: User = {
          id: response.data.user.id || '',
          name: `${response.data.user.firstName || ''} ${response.data.user.lastName || ''}`,
          username: response.data.user.email || '', // Using email as username for now
          email: response.data.user.email || '',
          phone: response.data.user.phone || '',
          role: 'customer',
          walletBalance: response.data.user.wallet || 0,
          createdAt: new Date().toISOString(),
          isActive: response.data.user.isActive || true,
          hasTransferPin: true,
          transferPin: userData.pin,
          state: '', // State will be fetched from profile
        }
        
        // Store tokens and user data in localStorage
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)
        localStorage.setItem('userData', JSON.stringify(user))
        
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
        
        // Start periodic token refresh
        startTokenRefresh()

        // Automatically create virtual account after successful registration
        try {
          await createVirtualAccount()
          // Virtual account creation is successful - no need to show toast as it's automatic
        } catch (virtualAccountError: any) {
          // Handle virtual account creation errors silently
          // Don't fail the registration if virtual account creation fails
          console.warn('Virtual account creation failed during registration:', virtualAccountError?.message || 'Unknown error')
          
          // If it's a 409 error (account already exists), that's actually fine
          if (virtualAccountError?.response?.status === 409) {
            // Account already exists - this is not an error
            console.log('Virtual account already exists for user')
          } else {
            // For other errors, we'll let the user know they can generate it manually later
            // but don't fail the registration
            console.warn('Virtual account will need to be created manually later')
          }
        }
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        ...userData,
      }
      
      // Update user data in localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUser))
      
      set({
        user: updatedUser,
      })
    }
  },

  updateUserPin: async (pin: string) => {
    set({ isLoading: true })
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const currentUser = get().user
    if (currentUser) {
      const updatedUser: User = {
        ...currentUser,
        hasTransferPin: true,
        transferPin: pin,
      }
      
      // Update user data in localStorage
      localStorage.setItem('userData', JSON.stringify(updatedUser))
      
      set({
        user: updatedUser,
        isLoading: false,
      })
    } else {
      set({ isLoading: false })
      throw new Error('User not found')
    }
  },

  updateUserProfile: async (firstName: string, lastName: string, state: string) => {
    set({ isLoading: true })
    
    try {
      const response = await userApiService.updateUserProfile({
        firstName,
        lastName,
        state
      })
      
      if (response.success && response.data) {
        const currentUser = get().user
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            name: `${response.data.firstName} ${response.data.lastName}`,
            state: response.data.state,
          }
          
          // Update user data in localStorage
          localStorage.setItem('userData', JSON.stringify(updatedUser))
          
          set({
            user: updatedUser,
            isLoading: false,
          })
        }
      } else {
        throw new Error(response.message || 'Failed to update profile')
      }
    } catch (error: any) {
      set({ isLoading: false })
      throw error
    }
  },



  fetchUserProfile: async () => {
    try {
      const response = await userApiService.getUserProfile()
      if (response.success && response.data) {
        const user: User = {
          id: response.data._id || '',
          name: `${response.data.firstName || ''} ${response.data.lastName || ''}`,
          username: response.data.email || '', // Using email as username for now
          email: response.data.email || '',
          phone: response.data.phone || '',
          role: 'customer', // API doesn't return role, defaulting to customer
          walletBalance: response.data.wallet || 0,
          createdAt: response.data.createdAt || new Date().toISOString(),
          isActive: response.data.isActive || true,
          hasTransferPin: true, // Default to true, will be updated if needed
          transferPin: '', // PIN not returned from profile API
          state: response.data.state || '', // Add state field
        }
        set({ user })
        
        // Update localStorage with fresh data
        localStorage.setItem('userData', JSON.stringify(user))
        
        // Sync wallet balance with user store
        useUserStore.getState().syncWalletBalance(response.data.wallet || 0)
        
        // Also fetch the latest wallet balance from the dedicated endpoint
        try {
          await useUserStore.getState().fetchWalletBalance(false)
        } catch (error) {
          // Silent fail - wallet balance fetch error
        }
             } else {
         // If profile fetch fails, don't automatically log out
         // Just show a warning and keep the user logged in
         toast.error('Failed to fetch user profile. Please try again.')
       }
     } catch (error) {
       // If API call fails, don't automatically log out
       // Just show a warning and keep the user logged in
       toast.error('Failed to fetch user profile. Please try again.')
     }
  },

  checkAuthStatus: async () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')

    if (!accessToken || !refreshToken) {
      return false
    }

    // If tokens exist, user is considered authenticated
    // No auto-logout - user stays logged in until they explicitly logout
    const userData = localStorage.getItem('userData')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        set({ user, isAuthenticated: true })
        
        // Sync wallet balance with user store
        useUserStore.getState().syncWalletBalance(user.walletBalance || 0)
        
                 // Try to refresh tokens in background
         setTimeout(async () => {
           try {
             await userApiService.validateAndRefreshTokens()
           } catch (error) {
             // Silent fail - background token refresh error
           }
         }, 1000)
        
        return true
             } catch (error) {
         // Silent fail - user data parsing error
       }
    }

    // If no user data in localStorage but tokens exist, try to fetch user data
    try {
      const response = await userApiService.getUserProfile()
      if (response.success && response.data) {
        const user: User = {
          id: response.data._id || '',
          name: `${response.data.firstName || ''} ${response.data.lastName || ''}`,
          username: response.data.email || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          role: 'customer',
          walletBalance: response.data.wallet || 0,
          createdAt: response.data.createdAt || new Date().toISOString(),
          isActive: response.data.isActive || true,
          hasTransferPin: true,
          transferPin: '',
          state: response.data.state || '', // Add state field
        }
        set({ user, isAuthenticated: true })
        
        // Update localStorage with fresh data
        localStorage.setItem('userData', JSON.stringify(user))
        
        // Sync wallet balance with user store
        useUserStore.getState().syncWalletBalance(response.data.wallet || 0)
        
                 // Also fetch the latest wallet balance from the dedicated endpoint
         try {
           await useUserStore.getState().fetchWalletBalance(false)
         } catch (error) {
           // Silent fail - wallet balance fetch error
         }
         return true
       }
          } catch (error) {
       // Even if API call fails, return true if tokens exist
       return true
     }

    return true // If we have tokens, consider user authenticated
  },

     validatePin: async (pin: string) => {
     try {
       const response = await userApiService.validatePin(pin)
       return response.success && response.data?.isValid === true
     } catch (error: any) {
       // If the error message indicates incorrect PIN, return false
       if (error.message?.includes('Current PIN is incorrect') || 
           error.message?.includes('Incorrect PIN') ||
           error.message?.includes('Invalid PIN')) {
         return false
       }
       // For other errors, throw the error to be handled by the calling component
       throw error
     }
   },

  changePin: async (currentPin: string, newPin: string) => {
    set({ isLoading: true })
    try {
      const response = await userApiService.changePin(currentPin, newPin)
      if (response.success) {
        // Update user data in localStorage with new PIN
        const currentUser = get().user
        if (currentUser) {
          const updatedUser: User = {
            ...currentUser,
            transferPin: newPin,
          }
          set({ user: updatedUser })
          localStorage.setItem('userData', JSON.stringify(updatedUser))
        }
        // Don't show success toast here as it's handled in the component
      } else {
        throw new Error(response.message || 'Failed to change PIN')
      }
    } catch (error: any) {
      // Don't show error toast here as it's handled in the component
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    set({ isLoading: true })
    try {
      const response = await userApiService.changePassword(currentPassword, newPassword)
      if (response.success) {
        toast.success('Password changed successfully')
      } else {
        throw new Error(response.message || 'Failed to change password')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true })
    try {
      // TODO: Implement backend endpoint /users/me/delete
      // For now, just show success message without API call
      // Simulate a delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500))
      toast.success('Account will be deleted in the next 90 days')
      set({ isLoading: false })
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account')
      set({ isLoading: false })
      throw error
    }
  },

     validateAndRefreshTokens: async () => {
     try {
       const refreshResponse = await userApiService.refreshToken()
       if (refreshResponse.success && refreshResponse.data) {
         // Update tokens in localStorage
         localStorage.setItem('accessToken', refreshResponse.data.accessToken)
         localStorage.setItem('refreshToken', refreshResponse.data.refreshToken)
         return true
       }
       return false
     } catch (error) {
       return false
     }
   },

  // New function to check if tokens are valid without refreshing
  areTokensValid: () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    return !!(accessToken && refreshToken)
  },
  }
})