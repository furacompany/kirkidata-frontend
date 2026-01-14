import { clearAdminAuth } from '../utils/auth'

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
    let data: any = null
    try {
      const text = await response.text()
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          // If JSON parsing fails, data remains null
          data = null
        }
      }
    } catch (error) {
      // If reading response fails, data remains null
      data = null
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
        const errorMessage = data?.message || data?.error || 'Server error occurred. Please try again later.'
        throw new Error(errorMessage)
      } else {
        const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`
        throw new Error(errorMessage)
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

  async getAllTransactions(
    page: number = 1,
    limit: number = 20,
    filters?: {
      type?: 'airtime' | 'data' | 'funding' | 'debit'
      status?: 'pending' | 'completed' | 'failed' | 'cancelled'
      networkName?: string
      startDate?: string
      endDate?: string
      minAmount?: number
      maxAmount?: number
    }
  ): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (filters?.type) queryParams.append('type', filters.type)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.networkName) queryParams.append('networkName', filters.networkName)
      if (filters?.startDate) queryParams.append('startDate', filters.startDate)
      if (filters?.endDate) queryParams.append('endDate', filters.endDate)
      if (filters?.minAmount) queryParams.append('minAmount', filters.minAmount.toString())
      if (filters?.maxAmount) queryParams.append('maxAmount', filters.maxAmount.toString())
      
      const response = await this.request<any>(`/transactions?${queryParams}`, {
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

  async getTransactionById(transactionId: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>(`/transactions/${transactionId}`, {
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

  async generateVirtualAccount(userId: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>(`/users/${userId}/virtual-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      } else if (error.message?.includes('404')) {
        throw new Error('404: User not found')
      } else if (error.message?.includes('400')) {
        throw new Error('400: Invalid request. Virtual account may already exist.')
      }
      throw error
    }
  }

  async getUserTransactions(
    userId: string,
    page: number = 1,
    limit: number = 50,
    filters?: {
      type?: 'airtime' | 'data' | 'funding'
      status?: 'pending' | 'completed' | 'failed' | 'cancelled'
      networkName?: string
      startDate?: string
      endDate?: string
      minAmount?: number
      maxAmount?: number
    }
  ): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (filters?.type) queryParams.append('type', filters.type)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.networkName) queryParams.append('networkName', filters.networkName)
      if (filters?.startDate) queryParams.append('startDate', filters.startDate)
      if (filters?.endDate) queryParams.append('endDate', filters.endDate)
      if (filters?.minAmount) queryParams.append('minAmount', filters.minAmount.toString())
      if (filters?.maxAmount) queryParams.append('maxAmount', filters.maxAmount.toString())
      
      const response = await this.request<any>(`/transactions/user/${userId}?${queryParams}`, {
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

  // Aychindodata API Methods
  async getAychindodataUser(): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>('/aychindodata/user', {
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

  async getAychindodataNetworks(): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>('/aychindodata/networks', {
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

  // Data Plans API Methods
  async createDataPlan(planData: {
    planId: string
    name: string
    networkName: string
    planType: string
    dataSize: string
    validityDays: number
    originalPrice: number
    adminPrice: number
    isActive: boolean
  }): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>('/data-plans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      if (error.message?.includes('409')) {
        throw new Error('409: Data plan with this Plan ID already exists')
      }
      throw error
    }
  }

  async getDataPlans(filters?: {
    networkName?: string
    planType?: string
    isActive?: boolean
    page?: number
    limit?: number
  }): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams()
      if (filters?.networkName) queryParams.append('networkName', filters.networkName)
      if (filters?.planType) queryParams.append('planType', filters.planType)
      if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString())
      if (filters?.page) queryParams.append('page', filters.page.toString())
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      
      const queryString = queryParams.toString()
      const endpoint = `/data-plans${queryString ? `?${queryString}` : ''}`
      
      const response = await this.request<any>(endpoint, {
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

  async getDataPlanById(id: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>(`/data-plans/${id}`, {
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
      if (error.message?.includes('404')) {
        throw new Error('404: Data plan not found')
      }
      throw error
    }
  }

  async updateDataPlan(planId: string, updateData: {
    adminPrice?: number
    isActive?: boolean
  }): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>(`/data-plans/${planId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      if (error.message?.includes('404')) {
        throw new Error('404: Data plan not found')
      }
      throw error
    }
  }

  async deleteDataPlan(id: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>(`/data-plans/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
      return response
    } catch (error: any) {
      if (error.message?.includes('401')) {
        throw new Error('401: Unauthorized access. Please log in.')
      }
      if (error.message?.includes('404')) {
        throw new Error('404: Data plan not found')
      }
      throw error
    }
  }

  async getPlanTypesByNetwork(networkName: string): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const response = await this.request<any>(`/data-plans/network/${networkName}/types`, {
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

  async getPlansByNetworkAndType(
    networkName: string,
    planType: string,
    page: number = 1,
    limit: number = 20
  ): Promise<any> {
    const accessToken = localStorage.getItem('adminAccessToken')
    
    if (!accessToken) {
      throw new Error('401: Authentication required')
    }
    
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      const response = await this.request<any>(`/data-plans/network/${networkName}/type/${planType}?${queryParams}`, {
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
