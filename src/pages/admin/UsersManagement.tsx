import React, { useState, useEffect } from 'react'
import { useAdminStore } from '../../store/adminStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'
import { 
  UserCheck, UserX, Trash2, Users, 
  AlertTriangle, CheckCircle, XCircle,
  Eye, Edit
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
  const { 
    getUserByPhone, 
    getUserByEmail, 
    updateUserProfile, 
    updateUserWallet,
    deactivateUser,
    reactivateUser,
    deleteUser,
    bulkUserOperation,
    searchUsers
  } = useAdminStore()
  const [searchType, setSearchType] = useState<'phone' | 'email'>('phone')
  const [searchValue, setSearchValue] = useState('')
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdatingWallet, setIsUpdatingWallet] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    state: ''
  })
  const [walletForm, setWalletForm] = useState({
    amount: '',
    operation: 'add' as 'add' | 'subtract',
    description: ''
  })

  // Bulk operations state
  const [showBulkOperations, setShowBulkOperations] = useState(false)
  const [bulkUserIds, setBulkUserIds] = useState('')
  const [bulkOperation, setBulkOperation] = useState<'activate' | 'deactivate' | 'delete'>('activate')
  const [isPerformingBulkOperation, setIsPerformingBulkOperation] = useState(false)

  // User action states
  const [isPerformingAction, setIsPerformingAction] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
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
    // setSelectedUserForEdit(user)
    setUserData(user)
    setError(null)
    setSearchValue('')
    setIsEditing(false)
    setIsUpdatingWallet(false)
    setEditForm({ firstName: '', lastName: '', state: '' })
    setWalletForm({ amount: '', operation: 'add', description: '' })
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
        // Reset edit states when new user is found
        setIsEditing(false)
        setIsUpdatingWallet(false)
        setEditForm({ firstName: '', lastName: '', state: '' })
        setWalletForm({ amount: '', operation: 'add', description: '' })
        toast.success('User found successfully!')
      } else {
        setError(response.message || 'User not found')
      }
    } catch (error: any) {
      if (error.message?.includes('401')) {
        setError('Unauthorized access. Please log in as admin.')
      } else if (error.message?.includes('404')) {
        setError('User not found')
      } else if (error.message?.includes('Admin access token required')) {
        setError('Admin access token required. Please log in as admin.')
      } else {
        setError(error.message || 'An error occurred while searching')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearSearch = () => {
    setSearchValue('')
    setUserData(null)
    setError(null)
    setIsEditing(false)
    setIsUpdatingWallet(false)
    setEditForm({ firstName: '', lastName: '', state: '' })
    setWalletForm({ amount: '', operation: 'add', description: '' })
    setBulkOperationResult(null)
    // setSelectedUserForEdit(null) // commented out as not currently used
  }

  const handleEditClick = () => {
    if (userData) {
      setEditForm({
        firstName: userData.firstName,
        lastName: userData.lastName,
        state: userData.state || ''
      })
      setIsEditing(true)
    }
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditForm({ firstName: '', lastName: '', state: '' })
  }

  const handleEditSave = async () => {
    if (!userData) return

    if (!editForm.firstName.trim() || !editForm.lastName.trim()) {
      toast.error('First name and last name are required')
      return
    }

    try {
      const response = await updateUserProfile(
        userData._id,
        editForm.firstName.trim(),
        editForm.lastName.trim(),
        editForm.state.trim()
      )
      
      if (response.success && response.data) {
        setUserData(response.data)
        setIsEditing(false)
        setEditForm({ firstName: '', lastName: '', state: '' })
      }
    } catch (error: any) {
      console.error('Edit error:', error)
    }
  }

  const handleWalletUpdate = async () => {
    if (!userData || !walletForm.amount || !walletForm.description) {
      toast.error('Please fill in all wallet update fields')
      return
    }

    const amount = parseFloat(walletForm.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsUpdatingWallet(true)
    try {
      const response = await updateUserWallet(
        userData._id,
        amount,
        walletForm.operation,
        walletForm.description
      )
      
      if (response.success && response.data) {
        // Update the user data with new wallet balance
        setUserData(prev => prev ? { ...prev, wallet: response.data.newBalance } : null)
        setWalletForm({ amount: '', operation: 'add', description: '' })
        setIsUpdatingWallet(false)
      }
    } catch (error: any) {
      console.error('Wallet update error:', error)
      setIsUpdatingWallet(false)
    }
  }

  const handleWalletCancel = () => {
    setIsUpdatingWallet(false)
    setWalletForm({ amount: '', operation: 'add', description: '' })
  }

  // User Action Handlers
  const handleDeactivateUser = async () => {
    if (!userData) return

    setIsPerformingAction(true)
    try {
      const response = await deactivateUser(userData._id)
      if (response.success && response.data) {
        setUserData(response.data)
        toast.success('User deactivated successfully!')
      }
    } catch (error: any) {
      console.error('Deactivate user error:', error)
    } finally {
      setIsPerformingAction(false)
    }
  }

  const handleReactivateUser = async () => {
    if (!userData) return

    setIsPerformingAction(true)
    try {
      const response = await reactivateUser(userData._id)
      if (response.success && response.data) {
        setUserData(response.data)
        toast.success('User reactivated successfully!')
      }
    } catch (error: any) {
      console.error('Reactivate user error:', error)
    } finally {
      setIsPerformingAction(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!userData) return

    setIsPerformingAction(true)
    try {
      const response = await deleteUser(userData._id)
      if (response.success) {
        setUserData(null)
        setError(null)
        setSearchValue('')
        toast.success('User deleted successfully!')
      }
    } catch (error: any) {
      console.error('Delete user error:', error)
    } finally {
      setIsPerformingAction(false)
      setShowDeleteConfirmation(false)
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

      {/* Error Display */}
      {error && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-700">{error}</p>
          </div>
        </Card>
      )}

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

      {/* User Data Display */}
      {userData && (
        <Card className="p-6">
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
              <p className="text-sm text-gray-600">Details for user account</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Personal Details</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900">{userData.firstName} {userData.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Address</label>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone Number</label>
                    <p className="text-gray-900">{userData.phone}</p>
                  </div>
                  {userData.state && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">State</label>
                      <p className="text-gray-900">{userData.state}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Status</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${userData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${userData.isActive ? 'text-green-700' : 'text-red-700'}`}>
                        {userData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email Verification</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${userData.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                      <span className={`text-sm font-medium ${userData.isEmailVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                        {userData.isEmailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Wallet Balance</label>
                    <p className="text-gray-900">₦{userData.wallet.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Activity Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Login</label>
                  <p className="text-gray-900">{formatDate(userData.lastLoginAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Logout</label>
                  <p className="text-gray-900">
                    {userData.lastLogoutAt ? formatDate(userData.lastLogoutAt) : 'Never'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Account Created</label>
                  <p className="text-gray-900">{formatDate(userData.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-gray-900">{formatDate(userData.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* User ID */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-500">User ID</label>
                  <p className="text-sm text-gray-600 font-mono">{userData._id}</p>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(userData._id)
                    toast.success('User ID copied to clipboard!')
                  }}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Copy ID
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={handleEditClick}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={() => setIsUpdatingWallet(true)}
                  variant="outline"
                  className="px-4 py-2"
                >
                  Update Wallet
                </Button>
                
                {/* User Status Actions */}
                {userData.isActive ? (
                  <Button
                    onClick={handleDeactivateUser}
                    disabled={isPerformingAction}
                    variant="outline"
                    className="px-4 py-2 text-orange-600 border-orange-300 hover:bg-orange-50 flex items-center gap-2"
                  >
                    <UserX className="w-4 h-4" />
                    {isPerformingAction ? 'Deactivating...' : 'Deactivate User'}
                  </Button>
                ) : (
                  <Button
                    onClick={handleReactivateUser}
                    disabled={isPerformingAction}
                    variant="outline"
                    className="px-4 py-2 text-green-600 border-green-300 hover:bg-green-50 flex items-center gap-2"
                  >
                    <UserCheck className="w-4 h-4" />
                    {isPerformingAction ? 'Reactivating...' : 'Reactivate User'}
                  </Button>
                )}
                
                {/* Delete User Button */}
                <Button
                  onClick={() => setShowDeleteConfirmation(true)}
                  disabled={isPerformingAction}
                  variant="outline"
                  className="px-4 py-2 text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete User
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Edit Profile Modal */}
      {isEditing && userData && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="space-y-4">
            <div className="border-b border-blue-200 pb-4">
              <h3 className="text-lg font-semibold text-blue-900">Edit User Profile</h3>
              <p className="text-sm text-blue-700">Update user's personal information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <Input
                  type="text"
                  value={editForm.state}
                  onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                  placeholder="Enter state"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-blue-200">
              <Button
                onClick={handleEditCancel}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                disabled={!editForm.firstName.trim() || !editForm.lastName.trim()}
                className="px-4 py-2"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Update Wallet Modal */}
      {isUpdatingWallet && userData && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="space-y-4">
            <div className="border-b border-green-200 pb-4">
              <h3 className="text-lg font-semibold text-green-900">Update User Wallet</h3>
              <p className="text-sm text-green-700">Current balance: ₦{userData.wallet.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
                <select
                  value={walletForm.operation}
                  onChange={(e) => setWalletForm(prev => ({ ...prev, operation: e.target.value as 'add' | 'subtract' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="add">Add Credit</option>
                  <option value="subtract">Subtract Credit</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                <Input
                  type="number"
                  value={walletForm.amount}
                  onChange={(e) => setWalletForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <Input
                  type="text"
                  value={walletForm.description}
                  onChange={(e) => setWalletForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Bonus credit, Refund, etc."
                />
              </div>
            </div>

            {/* Balance Preview */}
            {walletForm.amount && !isNaN(parseFloat(walletForm.amount)) && (
              <div className="p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Balance Preview:</span>{' '}
                  <span className={`font-mono ${walletForm.operation === 'subtract' && parseFloat(walletForm.amount) > userData.wallet ? 'text-red-600' : 'text-green-600'}`}>
                    ₦{walletForm.operation === 'add' 
                      ? (userData.wallet + parseFloat(walletForm.amount)).toLocaleString()
                      : (userData.wallet - parseFloat(walletForm.amount)).toLocaleString()
                    }
                  </span>
                  {walletForm.operation === 'subtract' && parseFloat(walletForm.amount) > userData.wallet && (
                    <span className="text-red-600 text-xs block mt-1">
                      ⚠️ This will result in a negative balance
                    </span>
                  )}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-green-200">
              <Button
                onClick={handleWalletCancel}
                variant="outline"
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleWalletUpdate}
                disabled={isUpdatingWallet || !walletForm.amount || !walletForm.description}
                className="px-4 py-2"
              >
                {isUpdatingWallet ? 'Updating...' : 'Update Wallet'}
              </Button>
            </div>

            {/* Warning for negative balance */}
            {walletForm.amount && !isNaN(parseFloat(walletForm.amount)) && 
             walletForm.operation === 'subtract' && 
             parseFloat(walletForm.amount) > userData.wallet && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">
                  ⚠️ <strong>Warning:</strong> This operation will result in a negative wallet balance. 
                  Please ensure this is intentional.
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && userData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete User</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-800">
                  Are you sure you want to delete <strong>{userData.firstName} {userData.lastName}</strong>? 
                  This will permanently remove their account and all associated data.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={() => setShowDeleteConfirmation(false)}
                  variant="outline"
                  disabled={isPerformingAction}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteUser}
                  disabled={isPerformingAction}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isPerformingAction ? 'Deleting...' : 'Delete User'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
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
                        ID
                      </th>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <button
                            onClick={() => handleUserEditFromList(user)}
                            className="flex items-center text-blue-600 hover:underline"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            {user._id}
                          </button>
                        </td>
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
                          <Button
                            onClick={() => handleUserEditFromList(user)}
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
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
