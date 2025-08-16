import React, { useState, useEffect } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
// import toast from 'react-hot-toast' // commented out as not currently used

interface User {
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

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const SearchUsers: React.FC = () => {
  const { searchUsers } = useAdminStore()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState({
    search: '',
    isActive: '',
    isEmailVerified: '',
    minWalletBalance: '',
    maxWalletBalance: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })) // Reset to page 1 when filters change
  }

  const handleSearch = async (page: number = 1) => {
    setIsLoading(true)
    setError(null)

    try {
      // Build filters object, excluding empty values
      const searchFilters: any = { page }
      
      if (filters.search.trim()) searchFilters.search = filters.search.trim()
      if (filters.isActive !== '') searchFilters.isActive = filters.isActive === 'true'
      if (filters.isEmailVerified !== '') searchFilters.isEmailVerified = filters.isEmailVerified === 'true'
      if (filters.minWalletBalance) searchFilters.minWalletBalance = parseFloat(filters.minWalletBalance)
      if (filters.maxWalletBalance) searchFilters.maxWalletBalance = parseFloat(filters.maxWalletBalance)
      if (filters.limit) searchFilters.limit = parseInt(filters.limit.toString())
      if (filters.sortBy) searchFilters.sortBy = filters.sortBy
      if (filters.sortOrder) searchFilters.sortOrder = filters.sortOrder

      const response = await searchUsers(searchFilters)

      if (response.success && response.data) {
        setUsers(response.data.users)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to search users')
        setUsers([])
        setPagination(null)
      }
    } catch (error: any) {
      console.error('Search error:', error)
      setError(error.message || 'An error occurred while searching')
      setUsers([])
      setPagination(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
    handleSearch(newPage)
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      isActive: '',
      isEmailVerified: '',
      minWalletBalance: '',
      maxWalletBalance: '',
      page: 1,
      limit: 10,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })
    setUsers([])
    setPagination(null)
    setError(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  useEffect(() => {
    // Initial search with default filters
    handleSearch()
  }, [])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Search Users</h1>
        <p className="text-sm text-gray-600">Advanced user search with filters and pagination</p>
      </div>

      {/* Search Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Search Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Text</label>
              <Input
                type="text"
                placeholder="Name, email, or phone"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Status</label>
              <select
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            {/* Email Verification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Verification</label>
              <select
                value={filters.isEmailVerified}
                onChange={(e) => handleFilterChange('isEmailVerified', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Users</option>
                <option value="true">Verified</option>
                <option value="false">Not Verified</option>
              </select>
            </div>

            {/* Results Per Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Results Per Page</label>
              <select
                value={filters.limit}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Min Wallet Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Wallet Balance (₦)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minWalletBalance}
                onChange={(e) => handleFilterChange('minWalletBalance', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {/* Max Wallet Balance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Wallet Balance (₦)</label>
              <Input
                type="number"
                placeholder="10000"
                value={filters.maxWalletBalance}
                onChange={(e) => handleFilterChange('maxWalletBalance', e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Registration Date</option>
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="email">Email</option>
                <option value="wallet">Wallet Balance</option>
                <option value="lastLoginAt">Last Login</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="px-6"
            >
              {isLoading ? 'Searching...' : 'Search Users'}
            </Button>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="px-6"
            >
              Clear Filters
            </Button>
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

      {/* Results Summary */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
          </p>
          <p className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </p>
        </div>
      )}

      {/* Users List */}
      {users.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">ID: {user._id.slice(-8)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                        {user.state && <div className="text-xs text-gray-400">{user.state}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className={`text-xs font-medium ${user.isActive ? 'text-green-700' : 'text-red-700'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${user.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                            <span className={`text-xs font-medium ${user.isEmailVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                              {user.isEmailVerified ? 'Verified' : 'Not Verified'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(user.wallet)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>Created: {formatDate(user.createdAt)}</div>
                        <div>Last Login: {user.lastLoginAt ? formatDate(user.lastLoginAt) : 'Never'}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={!pagination.hasPrev}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <Button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={!pagination.hasNext}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
            
            <div className="text-sm text-gray-500">
              {pagination.total} total users
            </div>
          </div>
        </Card>
      )}

      {/* No Results */}
      {!isLoading && users.length === 0 && !error && (
        <Card className="p-6 bg-gray-50 border-gray-200">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-gray-900">No Users Found</h3>
            <p className="text-gray-700 text-sm">
              Try adjusting your search filters or search criteria to find users.
            </p>
          </div>
        </Card>
      )}

      {/* Instructions */}
      {!users.length && !error && !isLoading && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-blue-900">How to Search Users</h3>
            <p className="text-blue-700 text-sm">
              Use the filters above to search for users by name, email, phone, status, verification, or wallet balance.
              You can also sort results and control pagination for better user management.
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default SearchUsers
