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

// Admin API Interfaces
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

class AdminApiService {
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
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`)
      }
      throw new Error('Invalid JSON response from server')
    }

    if (!response.ok) {
      if (response.status === 401 && !isRetry) {
        try {
          const refreshResponse = await this.adminRefreshToken()
          if (refreshResponse.success && refreshResponse.data) {
            localStorage.setItem('adminAccessToken', refreshResponse.data.accessToken)
            localStorage.setItem('adminRefreshToken', refreshResponse.data.refreshToken)
            
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
          if (refreshError.message?.includes('401') || refreshError.message?.includes('Unauthorized')) {
            console.warn('Admin token refresh failed with 401, clearing tokens')
            clearAdminAuth()
            // Force redirect to login
            window.location.href = '/admin/login'
            throw new Error('Authentication required')
          }
        }
        
        // Clear tokens and redirect on 401
        clearAdminAuth()
        window.location.href = '/admin/login'
        throw new Error('Authentication required')
      } else if (response.status === 400) {
        throw new Error(data?.message || 'Invalid request data')
      } else if (response.status === 404) {
        throw new Error(data?.message || 'Resource not found')
      } else if (response.status === 500) {
        throw new Error(data?.message || 'Server error occurred. Please try again later.')
      } else {
        throw new Error(data?.message || `HTTP error! status: ${response.status}`)
      }
    }

    return data
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
    }, true)
  }

  // User Management Methods
  async getUserByPhone(phone: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>(`/users/phone/${phone}`, {
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

  async getUserByEmail(email: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>(`/users/email/${email}`, {
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

  async updateUserProfileByAdmin(userId: string, profileData: any): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>(`/users/${userId}`, {
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

  async updateUserWallet(userId: string, walletData: any): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>(`/users/${userId}/fund`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: walletData.amount,
          description: walletData.description
        }),
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

  async searchUsers(filters: any): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
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
      
      const response = await this.request<any>(endpoint, {
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

  async getUserStats(filters: any): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const queryParams = new URLSearchParams()
      
      if (filters.period) queryParams.append('period', filters.period)
      if (filters.startDate) queryParams.append('startDate', filters.startDate)
      if (filters.endDate) queryParams.append('endDate', filters.endDate)
      
      const queryString = queryParams.toString()
      const endpoint = `/users/stats/aggregate${queryString ? `?${queryString}` : ''}`
      
      const response = await this.request<any>(endpoint, {
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

  async getAdminStats(): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>('/admin/stats/dashboard', {
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

  async bulkUserOperation(operationData: any): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>('/users/bulk', {
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

  async deactivateUser(userId: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>(`/users/${userId}/deactivate`, {
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

  async reactivateUser(userId: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>(`/users/${userId}/reactivate`, {
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

  async deleteUser(userId: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Admin access token required')
    }
    
    try {
      const response = await this.request<any>(`/users/${userId}`, {
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
    networkName?: string,
    planType?: string,
    page: number = 1,
    limit: number = 20,
    includeInactive: boolean = true
  ): Promise<OtoBillDataPlansPricingResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams({
        includeInactive: includeInactive.toString(),
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (networkName) queryParams.append('networkName', networkName)
      if (planType) queryParams.append('planType', planType)
      
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
    adminPrice: number,
    isActive?: boolean
  ): Promise<OtoBillPricingUpdateResponse> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const body: { adminPrice: number; isActive?: boolean } = { adminPrice }
      if (isActive !== undefined) {
        body.isActive = isActive
      }
      
      const response = await this.request<OtoBillPricingUpdateResponse>(`/otobill/data-plans/${planId}/pricing`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      throw error
    }
  }

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

  async getTransactionStats(startDate?: string, endDate?: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const params = new URLSearchParams()
      if (startDate) params.append('startDate', startDate)
      if (endDate) params.append('endDate', endDate)
      
      const queryString = params.toString()
      const url = `/transactions/stats${queryString ? `?${queryString}` : ''}`
      
      const response = await this.request<any>(url, {
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

  async getUserById(userId: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>(`/users/${userId}`, {
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
}

export const adminApiService = new AdminApiService(API_BASE_URL)
