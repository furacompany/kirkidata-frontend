import { clearAdminAuth } from '../utils/auth'
import { 
  OtoBillNetworksResponse, 
  OtoBillDataPlansResponse, 
  OtoBillPricingSummaryResponse,
  OtoBillDataPlansPricingResponse,
  OtoBillPricingUpdateResponse,
  OtoBillTransactionsResponse,
  OtoBillTransactionResponse,
  OtoBillStatsResponse
} from '../types'

const API_BASE_URL = 'https://api.kirkidata.ng/api/v1'

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

export interface UserByPhoneResponse {
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

export interface UserByEmailResponse {
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

export interface UpdateUserProfileByAdminRequest {
  firstName: string
  lastName: string
  state: string
}

export interface UpdateUserProfileByAdminResponse {
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
    __v: number
    state?: string
  }
  timestamp?: string
}

export interface UpdateUserWalletRequest {
  amount: number
  operation: 'add' | 'subtract'
  description: string
}

export interface UpdateUserWalletResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    newBalance: number
    operation: 'add' | 'subtract'
    amount: number
    description: string
  }
  timestamp?: string
}

export interface SearchUsersRequest {
  search?: string
  isActive?: boolean
  isEmailVerified?: boolean
  minWalletBalance?: number
  maxWalletBalance?: number
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface SearchUsersResponse {
  success: boolean
  message: string
  data?: {
    users: Array<{
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
    }>
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

export interface UserStatsRequest {
  period?: 'day' | 'week' | 'month' | 'year'
  startDate?: string
  endDate?: string
}

export interface UserStatsResponse {
  success: boolean
  message: string
  data?: {
    totalUsers: number
    activeUsers: number
    verifiedUsers: number
    averageWalletBalance: number
    totalWalletBalance: number
    newUsersThisPeriod: number
    period: string
  }
  timestamp?: string
}

export interface AdminStatsResponse {
  success: boolean
  message: string
  data?: {
    totalUsers: number
    activeUsers: number
    totalRevenue: number
    totalTransactions: number
    pendingTransactions: number
    successfulTransactions: number
    failedTransactions: number
    airtimeTransactions: number
    airtimeRevenue: number
    dataTransactions: number
    dataRevenue: number
    walletTransactions: number
    walletRevenue: number
    previousUsers?: number
    previousRevenue?: number
    previousTransactions?: number
    previousActiveUsers?: number
    networkStats?: {
      [key: string]: {
        successful: number
        total: number
        revenue: number
      }
    }
    recentTransactions?: any[]
    recentUsers?: any[]
  }
  timestamp?: string
}

export interface BulkUserOperationRequest {
  userIds: string[]
  operation: 'activate' | 'deactivate' | 'delete'
  additionalData?: Record<string, any>
}

export interface BulkUserOperationResponse {
  success: boolean
  message: string
  data?: {
    processed: number
    successful: number
    failed: number
    results: Array<{
      userId: string
      success: boolean
      message: string
    }>
  }
  timestamp?: string
}

export interface DeactivateUserResponse {
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
    __v: number
    state?: string
  }
  timestamp?: string
}

export interface ReactivateUserResponse {
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
    __v: number
    state?: string
  }
  timestamp?: string
}

export interface DeleteUserResponse {
  success: boolean
  message: string
  data?: {
    message: string
  }
  timestamp?: string
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

export interface AdminLoginRequest {
  email: string
  password: string
}

export interface AdminLoginResponse {
  success: boolean
  message: string
  data?: {
    admin: {
      id: string
      firstName: string
      lastName: string
      email: string
      phone: string
      isActive: boolean
      role: string
    }
    accessToken: string
    refreshToken: string
  }
  timestamp?: string
}

export interface AdminLogoutResponse {
  success: boolean
  message: string
  timestamp?: string
}

export interface AdminProfileResponse {
  success: boolean
  message: string
  data?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    isActive: boolean
    role: string
    lastLoginAt: string
    lastLogoutAt: string
    createdAt: string
    updatedAt: string
  }
  timestamp?: string
}

export interface UpdateAdminProfileRequest {
  firstName: string
  lastName: string
  phone: string
}

export interface UpdateAdminProfileResponse {
  success: boolean
  message: string
  data?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    isActive: boolean
    role: string
    lastLoginAt: string
    lastLogoutAt: string
    createdAt: string
    updatedAt: string
  }
  timestamp?: string
}

export interface ChangeAdminPasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface ChangeAdminPasswordResponse {
  success: boolean
  message: string
  data?: {
    message: string
  }
  timestamp?: string
}

export interface AdminSessionResponse {
  success: boolean
  message: string
  data?: {
    isActive: boolean
    lastLoginAt: string
    lastLogoutAt: string
  }
  timestamp?: string
}



class ApiService {
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

    const response = await fetch(url, config)
    let data
    try {
      data = await response.json()
    } catch (error) {
      // If we can't parse JSON, it might be a server error
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
      throw new Error('Invalid JSON response from server')
    }

    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 401 && !isRetry) {
        // Try to refresh the token automatically
        try {
          // Check if this is an admin request by looking at the access token
          const accessToken = localStorage.getItem('accessToken')
          const adminAccessToken = localStorage.getItem('adminAccessToken')
          
          let refreshResponse
          if (adminAccessToken && accessToken !== adminAccessToken) {
            // This is an admin request, use admin refresh
            refreshResponse = await this.adminRefreshToken()
            if (refreshResponse.success && refreshResponse.data) {
              // Update admin tokens in localStorage
              localStorage.setItem('adminAccessToken', refreshResponse.data.accessToken)
              localStorage.setItem('adminRefreshToken', refreshResponse.data.refreshToken)
            }
          } else {
            // This is a user request, use user refresh
            refreshResponse = await this.refreshToken()
            if (refreshResponse.success && refreshResponse.data) {
              // Update tokens in localStorage
              localStorage.setItem('accessToken', refreshResponse.data.accessToken)
              localStorage.setItem('refreshToken', refreshResponse.data.refreshToken)
            }
          }
          
          if (refreshResponse && refreshResponse.success && refreshResponse.data) {
            // Retry the original request with new token
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
          // If refresh also fails with 401, clear the tokens
          if (refreshError.message?.includes('401') || refreshError.message?.includes('Unauthorized')) {
            console.warn('Token refresh failed with 401, clearing tokens')
            clearAdminAuth()
          }
          // If refresh fails, throw the original error
        }
        
        // If refresh failed or no refresh token, throw the original error
        throw new Error(data?.message || 'Authentication required')
      } else if (response.status === 400) {
        // Handle specific error messages
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
        // Check the specific error message from the backend
        const errorMessage = data?.message || 'User already exists with this email or phone number'
        throw new Error(errorMessage)
      } else if (response.status === 500) {
        // Handle 500 server errors specifically
        throw new Error(data?.message || 'Server error occurred. Please try again later.')
      } else {
        throw new Error(data?.message || `HTTP error! status: ${response.status}`)
      }
    }

    return data
  }

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
    
    // Use the same endpoint as changePin but with a temporary new PIN to validate current PIN
    // This is a workaround since the validate endpoint is returning 500 errors
    const tempPin = '9999' // Temporary PIN that's different from the current one
    
    try {
      // Try to change to temp PIN to validate current PIN
      const response = await this.request<ChangePinResponse>('/auth/pin/change', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPin: pin, newPin: tempPin }),
      })
      
      if (response.success) {
        // If successful, change back to the original PIN
        await this.request<ChangePinResponse>('/auth/pin/change', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentPin: tempPin, newPin: pin }),
        })
        
        // Return success if both operations succeeded
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
    
    // Validate inputs before sending
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
    
    // Validate inputs before sending
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
        role: 'user' // Default to user role
      }),
    }, true) // Skip retry for refresh token requests
  }

  async adminRefreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('adminRefreshToken')
    
    if (!refreshToken) {
      throw new Error('No admin refresh token available')
    }
    
    return this.request<RefreshTokenResponse>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ 
        refreshToken,
        role: 'admin'
      }),
    }, true) // Skip retry for refresh token requests
  }

  // Admin Authentication Methods
  async adminLogin(loginData: AdminLoginRequest): Promise<AdminLoginResponse> {
    return this.request<AdminLoginResponse>('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
    })
  }

  async adminLogout(): Promise<AdminLogoutResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    return this.request<AdminLogoutResponse>('/auth/admin/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async getAdminProfile(): Promise<AdminProfileResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    return this.request<AdminProfileResponse>('/admins/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async getAdminSession(): Promise<AdminSessionResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    return this.request<AdminSessionResponse>('/auth/admin/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  }

  async updateAdminProfile(profileData: UpdateAdminProfileRequest): Promise<UpdateAdminProfileResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    return this.request<UpdateAdminProfileResponse>('/admins/me', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    })
  }

  async changeAdminPassword(passwordData: ChangeAdminPasswordRequest): Promise<ChangeAdminPasswordResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    return this.request<ChangeAdminPasswordResponse>('/admins/me/change-password', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    })
  }

  async validateAndRefreshTokens(): Promise<boolean> {
    try {
      const refreshResponse = await this.refreshToken()
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
  }

  // User Management Methods (Admin Only)
  async getUserByPhone(phone: string): Promise<UserByPhoneResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<UserByPhoneResponse>(`/users/phone/${phone}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: User not found')
      }
      throw error
    }
  }

  async getUserByEmail(email: string): Promise<UserByEmailResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<UserByEmailResponse>(`/users/email/${email}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: User not found')
      }
      throw error
    }
  }

  // Update User Profile by Admin
  async updateUserProfileByAdmin(userId: string, profileData: UpdateUserProfileByAdminRequest): Promise<UpdateUserProfileByAdminResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<UpdateUserProfileByAdminResponse>(`/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: User not found')
      }
      throw error
    }
  }

  // Update User Wallet Balance by Admin
  async updateUserWallet(userId: string, walletData: UpdateUserWalletRequest): Promise<UpdateUserWalletResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<UpdateUserWalletResponse>(`/users/${userId}/wallet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(walletData),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: User not found')
      }
      throw error
    }
  }

  // Search Users with Filters and Pagination
  async searchUsers(filters: SearchUsersRequest): Promise<SearchUsersResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams()
      
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString())
      if (filters.isEmailVerified !== undefined) queryParams.append('isEmailVerified', filters.isEmailVerified.toString())
      if (filters.minWalletBalance !== undefined) queryParams.append('minWalletBalance', filters.minWalletBalance.toString())
      if (filters.maxWalletBalance !== undefined) queryParams.append('maxWalletBalance', filters.maxWalletBalance.toString())
      if (filters.page) queryParams.append('page', filters.page.toString())
      if (filters.limit) queryParams.append('limit', filters.limit.toString())
      if (filters.sortBy) queryParams.append('sortBy', filters.sortBy)
      if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder)
      
      const queryString = queryParams.toString()
      const endpoint = `/users${queryString ? `?${queryString}` : ''}`
      
      const response = await this.request<SearchUsersResponse>(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      }
      throw error
    }
  }

  // Get User Statistics
  async getUserStats(filters: UserStatsRequest): Promise<UserStatsResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams()
      
      if (filters.period) queryParams.append('period', filters.period)
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)
      
      const queryString = queryParams.toString()
      const endpoint = `/users/stats/aggregate${queryString ? `?${queryString}` : ''}`
      
      const response = await this.request<UserStatsResponse>(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      }
      throw error
    }
  }

  // Get Admin Dashboard Statistics
  async getAdminStats(): Promise<AdminStatsResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<AdminStatsResponse>('/admin/stats/dashboard', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      }
      throw error
    }
  }

  // Bulk User Operations
  async bulkUserOperation(operationData: BulkUserOperationRequest): Promise<BulkUserOperationResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<BulkUserOperationResponse>('/users/bulk', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operationData),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('400')) {
        throw new Error('400: Invalid request data. Please check the user IDs format.')
      }
      throw error
    }
  }

  // Deactivate User
  async deactivateUser(userId: string): Promise<DeactivateUserResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<DeactivateUserResponse>(`/users/${userId}/deactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: User not found')
      }
      throw error
    }
  }

  // Reactivate User
  async reactivateUser(userId: string): Promise<ReactivateUserResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<ReactivateUserResponse>(`/users/${userId}/reactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: User not found')
      }
      throw error
    }
  }

  // Delete User
  async deleteUser(userId: string): Promise<DeleteUserResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<DeleteUserResponse>(`/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: User not found')
      }
      throw error
    }
  }

  // Data Purchase Methods
  async getNetworks(): Promise<NetworksResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
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
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  async getDataPlanCategories(networkName: string): Promise<DataPlanCategoriesResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
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
        throw new Error('401: Unauthorized access. Please log in.')
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
      throw new Error('401: Authentication required')
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
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  // Purchase Data
  async purchaseData(purchaseData: DataPurchaseRequest): Promise<DataPurchaseResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
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
        throw new Error('401: Unauthorized access. Please log in.')
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

  // Purchase Airtime
  async purchaseAirtime(purchaseData: AirtimePurchaseRequest): Promise<AirtimePurchaseResponse> {
    const accessToken = localStorage.getItem('accessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
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
        throw new Error('401: Unauthorized access. Please log in.')
      } else if (error.message?.includes('400')) {
        // Handle specific airtime purchase errors
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
      
      // If it's a response error with a message, use that
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message)
      }
      
      throw error
    }
  }

  // OtoBill API Methods
  async getOtoBillProfile(): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request('/otobill/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  async getOtoBillWalletBalance(): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request('/otobill/wallet/balance', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  // OtoBill Networks and Data Plans API Methods
  async getOtoBillNetworks(): Promise<OtoBillNetworksResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<OtoBillNetworksResponse>('/otobill/networks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  async getOtoBillDataPlansByNetwork(
    networkName: string, 
    planType: string, 
    page: number = 1, 
    limit: number = 20
  ): Promise<OtoBillDataPlansResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams({
        planType,
        page: page.toString(),
        limit: limit.toString()
      })
      
      const response = await this.request<OtoBillDataPlansResponse>(`/otobill/data-plans/network/${networkName}?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  // OtoBill Pricing Management API Methods
  async getOtoBillPricingSummary(): Promise<OtoBillPricingSummaryResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<OtoBillPricingSummaryResponse>('/otobill/pricing/summary', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  async getOtoBillDataPlansPricing(
    networkName: string,
    planType: string,
    page: number = 1,
    limit: number = 20
  ): Promise<OtoBillDataPlansPricingResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams({
        networkName,
        planType,
        page: page.toString(),
        limit: limit.toString()
      })
      
      const response = await this.request<OtoBillDataPlansPricingResponse>(`/otobill/data-plans/pricing?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  async updateOtoBillDataPlanPricing(
    planId: string,
    adminPrice: number
  ): Promise<OtoBillPricingUpdateResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<OtoBillPricingUpdateResponse>(`/otobill/data-plans/${planId}/pricing`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminPrice }),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  // OtoBill Transaction Management Methods
  async getOtoBillTransactions(
    page: number = 1,
    limit: number = 20,
    filters?: {
      transactionType?: 'data' | 'airtime'
      status?: 'successful' | 'pending' | 'failed'
      startDate?: string
      endDate?: string
      userId?: string
    }
  ): Promise<OtoBillTransactionsResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (filters?.transactionType) queryParams.append('transactionType', filters.transactionType)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.startDate) queryParams.append('startDate', filters.startDate)
      if (filters?.endDate) queryParams.append('endDate', filters.endDate)
      if (filters?.userId) queryParams.append('userId', filters.userId)
      
      const response = await this.request<OtoBillTransactionsResponse>(`/otobill/transactions?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  async getOtoBillTransaction(transactionId: string): Promise<OtoBillTransactionResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<OtoBillTransactionResponse>(`/otobill/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: Transaction not found')
      }
      throw error
    }
  }

  // OtoBill Statistics Methods
  async getOtoBillTransactionStats(
    startDate?: string,
    endDate?: string,
    type?: 'all' | 'data' | 'airtime'
  ): Promise<OtoBillStatsResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams()
      
      if (startDate) queryParams.append('startDate', startDate)
      if (endDate) queryParams.append('endDate', endDate)
      if (type) queryParams.append('type', type)
      
      const response = await this.request<OtoBillStatsResponse>(`/otobill/stats/transactions?${queryParams}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  // OtoBill Sync Methods
  async syncOtoBillDataPlans(): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>('/otobill/sync/data-plans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

  async syncOtoBillAirtimePricing(): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>('/otobill/sync/airtime-pricing', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }
}

export const apiService = new ApiService(API_BASE_URL)
