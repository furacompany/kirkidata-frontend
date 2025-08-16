import React, { useState, useEffect } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'

interface UserStatsData {
  totalUsers: number
  activeUsers: number
  verifiedUsers: number
  averageWalletBalance: number
  totalWalletBalance: number
  newUsersThisPeriod: number
  period: string
}

const UserStats: React.FC = () => {
  const { getUserStats } = useAdminStore()
  const [stats, setStats] = useState<UserStatsData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    period: 'month' as 'day' | 'week' | 'month' | 'year',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    // Set default dates for current month
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    
    setFilters(prev => ({
      ...prev,
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0]
    }))
  }, [])

  useEffect(() => {
    if (filters.startDate && filters.endDate) {
      fetchStats()
    }
  }, [filters.period])

  const fetchStats = async () => {
    if (!filters.startDate || !filters.endDate) {
      toast.error('Please select both start and end dates')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await getUserStats({
        period: filters.period,
        startDate: filters.startDate,
        endDate: filters.endDate
      })

      if (response.success && response.data) {
        setStats(response.data)
      } else {
        setError(response.message || 'Failed to fetch statistics')
      }
    } catch (error: any) {
      console.error('Stats fetch error:', error)
      setError(error.message || 'An error occurred while fetching statistics')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleRefresh = () => {
    fetchStats()
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const formatPercentage = (value: number, total: number) => {
    if (total === 0) return '0%'
    return `${((value / total) * 100).toFixed(1)}%`
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Statistics</h1>
        <p className="text-sm text-gray-600">Comprehensive user analytics and insights</p>
      </div>

      {/* Filters Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Filter Options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
              <select
                value={filters.period}
                onChange={(e) => handleFilterChange('period', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
              />
            </div>
            
            <div className="flex items-end">
              <Button
                onClick={handleRefresh}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Loading...' : 'Refresh Stats'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

      {/* Statistics Display */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Users */}
          <Card className="p-6 bg-blue-50 border-blue-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-blue-900">Total Users</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </Card>

          {/* Active Users */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-900">Active Users</h3>
              <p className="text-3xl font-bold text-green-600">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-green-700">
                {formatPercentage(stats.activeUsers, stats.totalUsers)} of total
              </p>
            </div>
          </Card>

          {/* Verified Users */}
          <Card className="p-6 bg-yellow-50 border-yellow-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-yellow-900">Verified Users</h3>
              <p className="text-3xl font-bold text-yellow-600">{stats.verifiedUsers.toLocaleString()}</p>
              <p className="text-sm text-yellow-700">
                {formatPercentage(stats.verifiedUsers, stats.totalUsers)} of total
              </p>
            </div>
          </Card>

          {/* New Users This Period */}
          <Card className="p-6 bg-purple-50 border-purple-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-purple-900">New Users</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.newUsersThisPeriod.toLocaleString()}</p>
              <p className="text-sm text-purple-700">This {filters.period}</p>
            </div>
          </Card>

          {/* Total Wallet Balance */}
          <Card className="p-6 bg-indigo-50 border-indigo-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-indigo-900">Total Wallet Balance</h3>
              <p className="text-3xl font-bold text-indigo-600">{formatCurrency(stats.totalWalletBalance)}</p>
              <p className="text-sm text-indigo-700">Across all users</p>
            </div>
          </Card>

          {/* Average Wallet Balance */}
          <Card className="p-6 bg-pink-50 border-pink-200">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-pink-900">Average Wallet Balance</h3>
              <p className="text-3xl font-bold text-pink-600">{formatCurrency(stats.averageWalletBalance)}</p>
              <p className="text-sm text-pink-700">Per user</p>
            </div>
          </Card>
        </div>
      )}

      {/* Instructions */}
      {!stats && !error && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-blue-900">How to View Statistics</h3>
            <p className="text-blue-700 text-sm">
              Select your desired period and date range above, then click "Refresh Stats" to view comprehensive user analytics.
              Statistics include user counts, verification status, wallet balances, and growth metrics.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default UserStats
