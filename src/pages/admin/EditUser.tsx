import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'
import { 
  UserCheck, UserX, Trash2, Users, 
  AlertTriangle, XCircle,
  Edit, ArrowLeft, Save, X, CreditCard
} from 'lucide-react'

interface VirtualAccount {
  virtualAccountNo: string
  virtualAccountName: string
  status: string
  provider: string
  customerName: string
  email: string
  accountReference: string
  createdAt: string
  updatedAt: string
}

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
  virtualAccount?: VirtualAccount
}

const EditUser: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { 
    getUserById,
    updateUserProfile, 
    updateUserWallet,
    deactivateUser,
    reactivateUser,
    deleteUser,
    generateVirtualAccount
  } = useAdminStore()

  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdatingWallet, setIsUpdatingWallet] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    state: ''
  })
  const [walletForm, setWalletForm] = useState({
    amount: '',
    description: ''
  })

  // User action states
  const [isPerformingAction, setIsPerformingAction] = useState(false)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [isGeneratingVirtualAccount, setIsGeneratingVirtualAccount] = useState(false)

  // Load user data on component mount
  useEffect(() => {
    if (userId) {
      loadUserData()
    }
  }, [userId])

  const loadUserData = async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await getUserById(userId)
      
      if (response.success && response.data) {
        setUserData(response.data)
        setEditForm({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          state: response.data.state || ''
        })
      } else {
        setError('User not found')
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load user data')
    } finally {
      setIsLoading(false)
    }
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
    setEditForm({
      firstName: userData?.firstName || '',
      lastName: userData?.lastName || '',
      state: userData?.state || ''
    })
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
      }
    } catch (error: any) {
      console.error('Edit error:', error)
      toast.error('Failed to update user profile')
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
        walletForm.description
      )
      
      if (response.success && response.data) {
        setUserData(prev => prev ? { ...prev, wallet: response.data.newBalance } : null)
        setWalletForm({ amount: '', description: '' })
        setShowWalletModal(false)
        toast.success('Wallet updated successfully!')
      } else {
        toast.error(response.message || 'Failed to update wallet')
      }
    } catch (error: any) {
      console.error('Wallet update error:', error)
      toast.error('Failed to update wallet')
    } finally {
      setIsUpdatingWallet(false)
    }
  }

  const handleWalletCancel = () => {
    setShowWalletModal(false)
    setIsUpdatingWallet(false)
    setWalletForm({ amount: '', description: '' })
  }

  // User Action Handlers
  const handleDeactivateUser = async () => {
    if (!userData) return

    setIsPerformingAction(true)
    try {
      const response = await deactivateUser(userData._id)
      if (response.success && response.data) {
        setUserData(response.data)
      }
    } catch (error: any) {
      console.error('Deactivate user error:', error)
      toast.error('Failed to deactivate user')
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
      }
    } catch (error: any) {
      console.error('Reactivate user error:', error)
      toast.error('Failed to reactivate user')
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
        navigate('/admin/users')
      }
    } catch (error: any) {
      console.error('Delete user error:', error)
      toast.error('Failed to delete user')
    } finally {
      setIsPerformingAction(false)
      setShowDeleteConfirmation(false)
    }
  }

  const handleGenerateVirtualAccount = async () => {
    if (!userData) return

    setIsGeneratingVirtualAccount(true)
    try {
      const response = await generateVirtualAccount(userData._id)
      if (response.success) {
        // Reload user data to get the newly generated virtual account
        await loadUserData()
      }
    } catch (error: any) {
      console.error('Generate virtual account error:', error)
      // Error toast is already shown by the store
    } finally {
      setIsGeneratingVirtualAccount(false)
    }
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

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-red-900">Error Loading User</h3>
              <p className="text-red-700 mt-2">{error}</p>
            </div>
            <Button
              onClick={() => navigate('/admin/users')}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-gray-600" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">User Not Found</h3>
              <p className="text-gray-600 mt-2">The requested user could not be found.</p>
            </div>
            <Button
              onClick={() => navigate('/admin/users')}
              variant="outline"
              className="mt-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Users
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/admin/users')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit User</h1>
            <p className="text-sm text-gray-600">Manage user account and settings</p>
          </div>
        </div>
      </div>

      {/* User Data Display */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
            <p className="text-sm text-gray-600">Details for {userData.firstName} {userData.lastName}</p>
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

          {/* Virtual Account Information */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Virtual Account
            </h3>
            {userData.virtualAccount ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Number</label>
                    <p className="text-gray-900 font-mono">{userData.virtualAccount.virtualAccountNo}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Account Name</label>
                    <p className="text-gray-900">{userData.virtualAccount.virtualAccountName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${userData.virtualAccount.status === 'Enabled' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${userData.virtualAccount.status === 'Enabled' ? 'text-green-700' : 'text-red-700'}`}>
                        {userData.virtualAccount.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Provider</label>
                    <p className="text-gray-900 capitalize">{userData.virtualAccount.provider}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Customer Name</label>
                    <p className="text-gray-900">{userData.virtualAccount.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900">{userData.virtualAccount.email}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-500">Account Reference</label>
                    <p className="text-gray-900 font-mono text-sm">{userData.virtualAccount.accountReference}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Created At</label>
                    <p className="text-gray-900">{formatDate(userData.virtualAccount.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Updated At</label>
                    <p className="text-gray-900">{formatDate(userData.virtualAccount.updatedAt)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div className="flex items-center space-x-2 text-gray-500">
                    <XCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">No virtual account</p>
                  </div>
                  <Button
                    onClick={handleGenerateVirtualAccount}
                    disabled={isGeneratingVirtualAccount}
                    className="px-4 py-2 flex items-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    {isGeneratingVirtualAccount ? 'Generating...' : 'Generate Virtual Account'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Activity Information */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
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

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleEditClick}
                variant="outline"
                className="px-4 py-2 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
              <Button
                onClick={() => setShowWalletModal(true)}
                variant="outline"
                className="px-4 py-2 flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
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

      {/* Edit Profile Form */}
      {isEditing && (
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
                className="px-4 py-2 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleEditSave}
                disabled={!editForm.firstName.trim() || !editForm.lastName.trim()}
                className="px-4 py-2 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Update Wallet Form */}
      {showWalletModal && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="space-y-4">
            <div className="border-b border-green-200 pb-4">
              <h3 className="text-lg font-semibold text-green-900">Update User Wallet</h3>
              <p className="text-sm text-green-700">Current balance: ₦{userData.wallet.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                <Input
                  type="number"
                  value={walletForm.amount}
                  onChange={(e) => setWalletForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount to add"
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
                  <span className="font-medium">New Balance Preview:</span>{' '}
                  <span className="font-mono text-green-600">
                    ₦{(userData.wallet + parseFloat(walletForm.amount)).toLocaleString()}
                  </span>
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-green-200">
              <Button
                onClick={handleWalletCancel}
                variant="outline"
                className="px-4 py-2 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </Button>
              <Button
                onClick={handleWalletUpdate}
                disabled={isUpdatingWallet || !walletForm.amount || !walletForm.description}
                className="px-4 py-2 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isUpdatingWallet ? 'Updating...' : 'Update Wallet'}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
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
                  className="flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteUser}
                  disabled={isPerformingAction}
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isPerformingAction ? 'Deleting...' : 'Delete User'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default EditUser
