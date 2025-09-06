import { useAuthStore } from '../store/authStore'

const API_BASE_URL = 'https://api.kirkidata.ng/api/v1'

// User/Customer API Interfaces
export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  pin: string
}

export interface LoginRequest {
  phone: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
      isEmailVerified: boolean
      isActive: boolean
      wallet: number
    }
    accessToken: string
    refreshToken: string
  }
  timestamp?: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    user: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
      isEmailVerified: boolean
      isActive: boolean
      wallet: number
    }
    accessToken: string
    refreshToken: string
  }
  timestamp?: string
}

export interface LogoutResponse {
  success: boolean
  message: string
  timestamp?: string
}

export interface RequestPasswordResetRequest {
  email: string
}

export interface RequestPasswordResetResponse {
  success: boolean
  message: string
  timestamp?: string
}

export interface ResetPasswordRequest {
  email: string
  otp: string
  newPassword: string
}

export interface ResetPasswordResponse {
  success: boolean
  message: string
  timestamp?: string
}

export interface UserProfileResponse {
  success: boolean
  message: string
  data?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    isEmailVerified: boolean
    isActive: boolean
    wallet: number
    lastLoginAt: string
    lastLogoutAt: string
    createdAt: string
    updatedAt: string
    state?: string
  }
  timestamp?: string
}

export interface WalletBalanceResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    walletBalance: number
    currency: string
  }
  timestamp?: string
}

export interface SessionResponse {
  success: boolean
  message: string
  data?: {
    isActive: boolean
    lastLoginAt: string
    lastLogoutAt: string
  }
  timestamp?: string
}

export interface ValidatePinRequest {
  pin: string
}

export interface ValidatePinResponse {
  success: boolean
  message: string
  data?: {
    isValid: boolean
  }
  timestamp?: string
}

export interface ChangePinRequest {
  currentPin: string
  newPin: string
}

export interface ChangePinResponse {
  success: boolean
  message: string
  data?: {
    message: string
  }
  timestamp?: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangePasswordResponse {
  success: boolean
  message: string
  data?: {
    message: string
  }
  timestamp?: string
}

export interface ForgotPinRequest {
  currentPassword: string
  newPin: string
}

export interface ForgotPinResponse {
  success: boolean
  message: string
  data?: {
    message: string
  }
  timestamp?: string
}

export interface UpdateUserProfileRequest {
  firstName: string
  lastName: string
  state: string
}

export interface UpdateUserProfileResponse {
  success: boolean
  message: string
  data?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    state: string
    isEmailVerified: boolean
    isActive: boolean
    wallet: number
    lastLoginAt: string
    lastLogoutAt: string
    createdAt: string
    updatedAt: string
    __v: number
  }
  timestamp?: string
}

export interface RefreshTokenRequest {
  refreshToken: string
  role: string
}

export interface RefreshTokenResponse {
  success: boolean
  message: string
  data?: {
    accessToken: string
    refreshToken: string
  }
  timestamp?: string
}

export interface ApiError {
  success: false
  message: string
  timestamp: string
}

// Data Purchase Interfaces
export interface Network {
  id: string
  name: string
  status: string
  isActive: boolean
  airtimeMarkup: number
}

export interface NetworksResponse {
  success: boolean
  message: string
  data?: Network[]
  timestamp?: string
}

export interface DataPlanCategoriesResponse {
  success: boolean
  message: string
  data?: string[]
  timestamp?: string
}

export interface DataPlan {
  planId: string
  name: string
  networkName: string
  planType: string
  validityDays: number
  price: number
  formattedPrice: string
  description: string
}

export interface DataPlansFilters {
  networkName: string
  planType: string
  sortBy: string
  sortOrder: string
}

export interface DataPlansResponse {
  success: boolean
  message: string
  data?: {
    plans: DataPlan[]
    total: number
    page: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
    filters: DataPlansFilters
  }
  timestamp?: string
}

// Data Purchase Request/Response Interfaces
export interface DataPurchaseRequest {
  planId: string
  phoneNumber: string
}

export interface DataPurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    amount: number
    profit: number
    status: string
    description: string
    networkName: string
    phoneNumber: string
    planId: string
    planName: string
    otobillRef: string
  }
  timestamp?: string
}

// Airtime Purchase Request/Response Interfaces
export interface AirtimePurchaseRequest {
  networkName: string
  phoneNumber: string
  amount: number
}

export interface AirtimePurchaseResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    reference: string
    amount: number
    markup: number
    totalCost: number
    status: string
    description: string
    networkName: string
    phoneNumber: string
    otobillRef: string
  }
  timestamp?: string
}

class UserApiService {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    isRetry: boolean = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    let response
    try {
      response = await fetch(url, config)
    } catch (error: any) {
      // Handle network connectivity errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Please check your internet connection and try again.')
      }
      if (error.name === 'NetworkError' || error.message.includes('network')) {
        throw new Error('Please check your internet connection and try again.')
      }
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Please check your internet connection and try again.')
      }
      // For other fetch errors, provide a user-friendly message
      throw new Error('Connection error. Please check your internet connection and try again.')
    }

    let data
    try {
      data = await response.json()
    } catch (error) {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
      throw new Error('Invalid JSON response from server')
    }

    if (!response.ok) {
      if (response.status === 401 && !isRetry) {
        try {
          const refreshResponse = await this.refreshToken()
          if (refreshResponse.success && refreshResponse.data) {
            localStorage.setItem('accessToken', refreshResponse.data.accessToken)
            localStorage.setItem('refreshToken', refreshResponse.data.refreshToken)
            
            const newConfig: RequestInit = {
              ...config,
              headers: {
                ...config.headers,
                'Authorization': `Bearer ${refreshResponse.data.accessToken}`,
              },
            }
            
            const retryResponse = await fetch(url, newConfig)
            let retryData
            try {
              retryData = await retryResponse.json()
            } catch (error) {
              throw new Error('Invalid JSON response from server')
            }
            
            if (!retryResponse.ok) {
              throw new Error(retryData?.message || `HTTP error! status: ${retryResponse.status}`)
            }
            
            return retryData
          }
        } catch (refreshError: any) {
          // If refresh fails, silently logout and redirect
          console.log('Token refresh failed, logging out user')
          logoutCustomer()
          // Return a resolved promise to prevent error propagation
          return Promise.resolve({} as T)
        }
        
        // If we reach here, token refresh failed
        logoutCustomer()
        return Promise.resolve({} as T)
      } else if (response.status === 400) {
        if (data?.message?.includes('Invalid or expired OTP')) {
          throw new Error('Invalid or expired OTP. Please check your OTP and try again.')
        } else if (data?.message?.includes('Current PIN is incorrect') || data?.message?.includes('currentPin')) {
          throw new Error('Current PIN is incorrect')
        } else if (data?.message?.includes('Current password is incorrect')) {
          throw new Error('Current password is incorrect')
        } else if (data?.message?.includes('Cannot destructure property')) {
          throw new Error('Current PIN is incorrect')
        } else if (data?.message?.includes('PIN is incorrect')) {
          throw new Error('Current PIN is incorrect')
        }
        throw new Error(data?.message || 'Invalid request data')
      } else if (response.status === 409) {
        const errorMessage = data?.message || 'User already exists with this email or phone number'
        throw new Error(errorMessage)
      } else if (response.status === 500) {
        throw new Error(data?.message || 'Server error occurred. Please try again later.')
      } else {
        throw new Error(data?.message || `HTTP error! status: ${response.status}`)
      }
    }

    return data
  }

  // User Authentication Methods
  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
  }

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    })
  }

  async logout(): Promise<LogoutResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    return this.request<LogoutResponse>('/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async requestPasswordReset(data: RequestPasswordResetRequest): Promise<RequestPasswordResetResponse> {
    return this.request<RequestPasswordResetResponse>('/auth/request-password-reset', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
    return this.request<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserProfile(): Promise<UserProfileResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    return this.request<UserProfileResponse>('/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async getWalletBalance(): Promise<WalletBalanceResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    return this.request<WalletBalanceResponse>('/users/me/wallet', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async getSession(): Promise<SessionResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    return this.request<SessionResponse>('/auth/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async validatePin(pin: string): Promise<ValidatePinResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    const tempPin = '9999'
    
    try {
      const response = await this.request<ChangePinResponse>('/auth/pin/change', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPin: pin, newPin: tempPin }),
      })
      
      if (response.success) {
        await this.request<ChangePinResponse>('/auth/pin/change', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPin: tempPin, newPin: pin }),
        })
        
        return {
          success: true,
          message: 'PIN validated successfully',
          data: { isValid: true }
        }
      } else {
        return {
          success: false,
          message: response.message || 'Invalid PIN',
          data: { isValid: false }
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'PIN validation failed',
        data: { isValid: false }
      }
    }
  }

  async changePin(currentPin: string, newPin: string): Promise<ChangePinResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!currentPin || !newPin) {
      throw new Error('Current PIN and new PIN are required')
    }
    
    if (currentPin.length !== 4 || newPin.length !== 4) {
      throw new Error('PIN must be exactly 4 digits')
    }
    
    if (!/^\d{4}$/.test(currentPin) || !/^\d{4}$/.test(newPin)) {
      throw new Error('PIN must contain only numbers')
    }
    
    return this.request<ChangePinResponse>('/auth/pin/change', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPin, newPin }),
    })
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<ChangePasswordResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!currentPassword || !newPassword) {
      throw new Error('Current password and new password are required')
    }
    
    if (newPassword.length < 6) {
      throw new Error('New password must be at least 6 characters')
    }
    
    if (currentPassword === newPassword) {
      throw new Error('New password must be different from current password')
    }
    
    return this.request<ChangePasswordResponse>('/auth/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
  }

  async forgotPin(currentPassword: string, newPin: string): Promise<ForgotPinResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!currentPassword || !newPin) {
      throw new Error('Current password and new PIN are required')
    }
    
    if (newPin.length !== 4) {
      throw new Error('PIN must be exactly 4 digits')
    }
    
    if (!/^\d{4}$/.test(newPin)) {
      throw new Error('PIN must contain only numbers')
    }
    
    return this.request<ForgotPinResponse>('/auth/pin/forgot', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ currentPassword, newPin }),
    })
  }

  async updateUserProfile(userData: UpdateUserProfileRequest): Promise<UpdateUserProfileResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    return this.request<UpdateUserProfileResponse>('/users/me', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    return this.request<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ 
        refreshToken,
        role: 'user'
      }),
    }, true)
  }

  async validateAndRefreshTokens(): Promise<boolean> {
    try {
      const refreshResponse = await this.refreshToken()
      if (refreshResponse.success && refreshResponse.data) {
        localStorage.setItem('accessToken', refreshResponse.data.accessToken)
        localStorage.setItem('refreshToken', refreshResponse.data.refreshToken)
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  // Data Purchase Methods
  async getNetworks(): Promise<NetworksResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      logoutCustomer()
      return Promise.resolve({} as NetworksResponse)
    }
    
    try {
      const response = await this.request<NetworksResponse>('/purchases/networks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        // Silently logout and redirect for 401 errors
        logoutCustomer()
        return Promise.resolve({} as NetworksResponse)
      }
      throw error
    }
  }

  async getDataPlanCategories(networkName: string): Promise<DataPlanCategoriesResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      logoutCustomer()
      return Promise.resolve({} as DataPlanCategoriesResponse)
    }
    
    try {
      const response = await this.request<DataPlanCategoriesResponse>(`/purchases/data-plans/network/${networkName}/categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        // Silently logout and redirect for 401 errors
        logoutCustomer()
        return Promise.resolve({} as DataPlanCategoriesResponse)
      }
      throw error
    }
  }

  async getDataPlans(
    networkName: string, 
    page: number = 1, 
    sortBy: string = 'price', 
    sortOrder: string = 'asc'
  ): Promise<DataPlansResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      logoutCustomer()
      return Promise.resolve({} as DataPlansResponse)
    }
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        sortBy,
        sortOrder
      })
      
      const response = await this.request<DataPlansResponse>(`/purchases/data-plans/network/${networkName}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        // Silently logout and redirect for 401 errors
        logoutCustomer()
        return Promise.resolve({} as DataPlansResponse)
      }
      throw error
    }
  }

  async purchaseData(purchaseData: DataPurchaseRequest): Promise<DataPurchaseResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      logoutCustomer()
      return Promise.resolve({} as DataPurchaseResponse)
    }
    
    try {
      const response = await this.request<DataPurchaseResponse>('/purchases/data', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        // Silently logout and redirect for 401 errors
        logoutCustomer()
        return Promise.resolve({} as DataPurchaseResponse)
      } else if (error.message?.includes('400')) {
        throw new Error('Invalid purchase data. Please check your phone number and plan selection.')
      } else if (error.message?.includes('402')) {
        throw new Error('Insufficient wallet balance. Please fund your wallet.')
      } else if (error.message?.includes('409')) {
        throw new Error('Purchase failed. Please try again.')
      }
      throw error
    }
  }

  async purchaseAirtime(purchaseData: AirtimePurchaseRequest): Promise<AirtimePurchaseResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      logoutCustomer()
      return Promise.resolve({} as AirtimePurchaseResponse)
    }
    
    try {
      const response = await this.request<AirtimePurchaseResponse>('/purchases/airtime', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        // Silently logout and redirect for 401 errors
        logoutCustomer()
        return Promise.resolve({} as AirtimePurchaseResponse)
      } else if (error.message?.includes('400')) {
        if (error.message?.includes('Insufficient balance')) {
          throw new Error(error.message)
        } else if (error.message?.includes('Amount must be at least')) {
          throw new Error(error.message)
        } else {
          throw new Error('Invalid purchase data. Please check your phone number and amount.')
        }
      } else if (error.message?.includes('402')) {
        throw new Error('Insufficient wallet balance. Please fund your wallet.')
      } else if (error.message?.includes('409')) {
        throw new Error('Purchase failed. Please try again.')
      }
      
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  }
}

// Customer logout function to handle expired tokens
export const logoutCustomer = () => {
  // Clear all customer-related data
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userData')
  
  // Reset auth state
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })
  
  // Redirect to login page
  window.location.href = '/login'
}

export const userApiService = new UserApiService(API_BASE_URL)
