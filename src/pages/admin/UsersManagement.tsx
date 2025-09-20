import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'
import { 
  Users, 
  AlertTriangle, CheckCircle, XCircle,
  Edit, Eye
} from 'lucide-react'

interface UserData {
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

const UsersManagement: React.FC = () => {
  const navigate = useNavigate()
  const { 
    getUserByPhone, 
    getUserByEmail, 
    bulkUserOperation,
    searchUsers
  } = useAdminStore()
  const [searchType, setSearchType] = useState<'phone' | 'email'>('phone')
  const [searchValue, setSearchValue] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Bulk operations state
  const [showBulkOperations, setShowBulkOperations] = useState(false)
  const [bulkUserIds, setBulkUserIds] = useState('')
  const [bulkOperation, setBulkOperation] = useState<'activate' | 'deactivate' | 'delete'>('activate')
  const [isPerformingBulkOperation, setIsPerformingBulkOperation] = useState(false)

  // User action states
  const [bulkOperationResult, setBulkOperationResult] = useState<any>(null)

  // Users list state
  const [usersList, setUsersList] = useState<any[]>([])
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  // const [selectedUserForEdit, setSelectedUserForEdit] = useState<any>(null)


  // Load all users with pagination
  const loadUsers = async (page: number = 1) => {
    setIsLoadingUsers(true)
    try {
      const response = await searchUsers({
        page,
        limit: 20,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })
      
      if (response.success && response.data) {
        setUsersList(response.data.users)
        setPagination(response.data.pagination)
      }
    } catch (error: any) {
      toast.error('Failed to load users')
    } finally {
      setIsLoadingUsers(false)
    }
  }

  // Handle user edit from list
  const handleUserEditFromList = (user: any) => {
    navigate(`/admin/users/${user._id}/edit`)
  }

  // Handle view user transactions
  const handleViewTransactions = (user: any) => {
    navigate(`/admin/users/${user._id}/transactions`)
  }


  // Handle pagination
  const handlePageChange = (newPage: number) => {
    loadUsers(newPage)
  }

  // Load users on component mount
  useEffect(() => {
    loadUsers(1)
  }, [])

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error('Please enter a search value')
      return
    }

    setIsLoading(true)
    setError(null)
    setUserData(null)

    try {
      let response
      if (searchType === 'phone') {
        response = await getUserByPhone(searchValue.trim())
      } else {
        response = await getUserByEmail(searchValue.trim())
      }

      if (response.success && response.data) {
        setUserData(response.data)
        toast.success('User found successfully!')
      } else {
        setError(response.message || 'User not found')
      }
    } catch (error: any) {
      // Silent fail - no error message
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchValue('')
    setUserData(null)
    setError(null)
    setBulkOperationResult(null)
  }


  // Bulk Operations Handlers
  const handleBulkOperation = async () => {
    if (!bulkUserIds.trim()) {
      toast.error('Please enter user IDs')
      return
    }

    const userIds = bulkUserIds.split(',').map(id => id.trim()).filter(id => id)
    if (userIds.length === 0) {
      toast.error('Please enter valid user IDs')
      return
    }

    // Validate user IDs format (24 character hex string)
    const userIdRegex = /^[0-9a-fA-F]{24}$/
    const invalidIds = userIds.filter(id => !userIdRegex.test(id))
    if (invalidIds.length > 0) {
      toast.error(`Invalid user ID format: ${invalidIds.join(', ')}`)
      return
    }

    setIsPerformingBulkOperation(true)
    try {
      const response = await bulkUserOperation(userIds, bulkOperation)
      if (response.success) {
        setBulkOperationResult(response.data)
        setBulkUserIds('')
        setShowBulkOperations(false)
        
        // If we have a current user and their ID is in the bulk operation, refresh their data
        if (userData && userIds.includes(userData._id)) {
          await handleSearch()
        }
      }
    } catch (error: any) {
      console.error('Bulk operation error:', error)
    } finally {
      setIsPerformingBulkOperation(false)
    }
  }

  const handleBulkCancel = () => {
    setShowBulkOperations(false)
    setBulkUserIds('')
    setBulkOperation('activate')
  }


  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-600">Search and manage user accounts</p>
      </div>

      {/* Search Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Search by:</label>
            <div className="flex space-x-2">
              <button
                onClick={() => setSearchType('phone')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  searchType === 'phone'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Phone Number
              </button>
              <button
                onClick={() => setSearchType('email')}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  searchType === 'email'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Email Address
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Input
              type={searchType === 'phone' ? 'tel' : 'email'}
              placeholder={searchType === 'phone' ? 'Enter phone number' : 'Enter email address'}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={isLoading || !searchValue.trim()}
              className="px-6"
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>
            <Button
              onClick={clearSearch}
              variant="outline"
              className="px-6"
            >
              Clear
            </Button>
          </div>
        </div>
      </Card>

      {/* Bulk Operations Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Bulk User Operations
              </h3>
              <p className="text-sm text-gray-600">Perform operations on multiple users at once</p>
            </div>
            <Button
              onClick={() => setShowBulkOperations(!showBulkOperations)}
              variant="outline"
              className="flex items-center gap-2"
            >
              {showBulkOperations ? 'Hide' : 'Show'} Bulk Operations
            </Button>
          </div>

          {showBulkOperations && (
            <div className="space-y-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Operation Type</label>
                  <select
                    value={bulkOperation}
                    onChange={(e) => setBulkOperation(e.target.value as 'activate' | 'deactivate' | 'delete')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="activate">Activate Users</option>
                    <option value="deactivate">Deactivate Users</option>
                    <option value="delete">Delete Users</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User IDs (comma-separated)
                  </label>
                  <Input
                    type="text"
                    value={bulkUserIds}
                    onChange={(e) => setBulkUserIds(e.target.value)}
                    placeholder="e.g., 689b6933562f641b63247efe, 689cd6b83f1947591b79c7ea"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <div className="text-sm text-yellow-800">
                  <strong>Important:</strong> User IDs must be valid 24-character MongoDB ObjectId format (e.g., 689b6933562f641b63247efe). 
                  {bulkOperation === 'delete' && ' Delete operation is irreversible!'}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="text-sm text-blue-800">
                  <strong>Tip:</strong> You can copy user IDs from the user details below. Separate multiple IDs with commas.
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  onClick={handleBulkCancel}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleBulkOperation}
                  disabled={isPerformingBulkOperation || !bulkUserIds.trim()}
                  className={`px-4 py-2 ${
                    bulkOperation === 'delete' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-primary hover:bg-primary/90 text-white'
                  }`}
                >
                  {isPerformingBulkOperation ? 'Processing...' : `Bulk ${bulkOperation.charAt(0).toUpperCase() + bulkOperation.slice(1)}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* No error display - silent fail */}

      {/* Bulk Operation Result Display */}
      {bulkOperationResult && (
        <Card className="p-4 border-green-200 bg-green-50">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h4 className="font-medium text-green-900">Bulk Operation Completed</h4>
              <Button
                onClick={() => setBulkOperationResult(null)}
                variant="outline"
                size="sm"
                className="ml-auto text-xs"
              >
                Dismiss
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-800">Processed:</span> {bulkOperationResult.processed}
              </div>
              <div>
                <span className="font-medium text-green-800">Successful:</span> {bulkOperationResult.successful}
              </div>
              <div>
                <span className="font-medium text-red-800">Failed:</span> {bulkOperationResult.failed}
              </div>
            </div>
            {bulkOperationResult.results && bulkOperationResult.results.length > 0 && (
              <div className="mt-3">
                <details className="text-sm">
                  <summary className="cursor-pointer font-medium text-green-800 hover:text-green-900">
                    View Detailed Results
                  </summary>
                  <div className="mt-2 space-y-1">
                    {bulkOperationResult.results.map((result: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-600" />
                        )}
                        <span className="font-mono text-xs">{result.userId}</span>
                        <span className="text-xs text-gray-600">- {result.message}</span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Search Results Display */}
      {userData && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
              <p className="text-sm text-gray-600">User found from search</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wallet
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{userData.firstName} {userData.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {userData.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${userData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {userData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₦{userData.wallet.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleUserEditFromList(userData)}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit User"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleViewTransactions(userData)}
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:text-green-900"
                          title="View Transactions"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}



      {/* Instructions */}
      {!userData && !error && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium text-blue-900">How to Search</h3>
            <p className="text-blue-700 text-sm">
              Use the search form above to find users by their phone number or email address.
              Only administrators can access this user management system.
            </p>
          </div>
        </Card>
      )}

      {/* All Users Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            All Users
          </h3>
        </div>

        <div className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium text-gray-900">Users List</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Page {pagination.page} of {pagination.totalPages}</span>
                <Button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                  variant="outline"
                  className="px-3 py-2"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                  variant="outline"
                  className="px-3 py-2"
                >
                  Next
                </Button>
              </div>
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading users...</p>
              </div>
            ) : usersList.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Wallet
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usersList.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₦{user.wallet.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleUserEditFromList(user)}
                              variant="outline"
                              size="sm"
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit User"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleViewTransactions(user)}
                              variant="outline"
                              size="sm"
                              className="text-green-600 hover:text-green-900"
                              title="View Transactions"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default UsersManagement
