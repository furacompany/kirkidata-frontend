import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, MapPin, Shield, Eye, EyeOff,
  Camera, RefreshCw, Edit, Save, X, Trash2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAuthStore } from '../../store/authStore'
import { useUserStore } from '../../store/userStore'
import DeleteAccountModal from '../../components/ui/DeleteAccountModal'
import toast from 'react-hot-toast'

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PinForm {
  currentPin: string
  newPin: string
  confirmPin: string
}

const Profile: React.FC = () => {
  const { user, fetchUserProfile, changePassword, changePin, updateUserProfile, deleteAccount } = useAuthStore()
  const { walletBalance, fetchWalletBalance } = useUserStore()

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [pinForm, setPinForm] = useState<PinForm>({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  })

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    state: ''
  })
  const [originalProfileData, setOriginalProfileData] = useState({
    firstName: '',
    lastName: '',
    state: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showCurrentPin, setShowCurrentPin] = useState(false)
  const [showNewPin, setShowNewPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeletingAccount, setIsDeletingAccount] = useState(false)

  // Fetch user profile data when component mounts
  useEffect(() => {
    fetchUserProfile()
    fetchWalletBalance()
  }, [fetchUserProfile, fetchWalletBalance])

  // Initialize profile form data when user data is available
  useEffect(() => {
    if (user) {
      const firstName = user.name?.split(' ')[0] || ''
      const lastName = user.name?.split(' ').slice(1).join(' ') || ''
      const state = user.state || ''
      
      setProfileForm({ firstName, lastName, state })
      setOriginalProfileData({ firstName, lastName, state })
    }
  }, [user])

  // Show loading state if user is not loaded yet
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  const handleRefreshProfile = async () => {
    setIsRefreshing(true)
    try {
      await Promise.all([
        fetchUserProfile(),
        fetchWalletBalance()
      ])
      toast.success('Profile and wallet balance refreshed successfully!')
    } catch (error) {
      toast.error('Failed to refresh profile')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
  }

  const handlePinChange = (field: keyof PinForm, value: string) => {
    // Only allow numbers for PIN fields
    const numericValue = value.replace(/[^0-9]/g, '')
    setPinForm(prev => ({ ...prev, [field]: numericValue }))
  }

  const handleProfileChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }))
  }

  const handleStartEdit = () => {
    setIsEditingProfile(true)
  }

  const handleCancelEdit = () => {
    setProfileForm(originalProfileData)
    setIsEditingProfile(false)
  }

  const handleSaveProfile = async () => {
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.state.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    
    try {
      await updateUserProfile(
        profileForm.firstName.trim(),
        profileForm.lastName.trim(),
        profileForm.state.trim()
      )
      
      setOriginalProfileData(profileForm)
      setIsEditingProfile(false)
      toast.success('Profile updated successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    // Validate current password
    if (!passwordForm.currentPassword.trim()) {
      toast.error('Current password is required!')
      return
    }

    // Validate new password
    if (!passwordForm.newPassword.trim()) {
      toast.error('New password is required!')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters!')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match!')
      return
    }

    if (passwordForm.currentPassword === passwordForm.newPassword) {
      toast.error('New password must be different from current password!')
      return
    }

    setIsLoading(true)
    
    try {
      await changePassword(passwordForm.currentPassword.trim(), passwordForm.newPassword.trim())
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      toast.success('Password changed successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePin = async () => {
    // Validate current PIN
    if (!pinForm.currentPin || pinForm.currentPin.length !== 4) {
      toast.error('Current PIN must be exactly 4 digits!')
      return
    }

    if (!/^\d{4}$/.test(pinForm.currentPin)) {
      toast.error('Current PIN must contain only numbers!')
      return
    }

    // Validate new PIN
    if (!pinForm.newPin || pinForm.newPin.length !== 4) {
      toast.error('New PIN must be exactly 4 digits!')
      return
    }

    if (!/^\d{4}$/.test(pinForm.newPin)) {
      toast.error('New PIN must contain only numbers!')
      return
    }

    // Validate confirm PIN
    if (!pinForm.confirmPin || pinForm.confirmPin.length !== 4) {
      toast.error('Confirm PIN must be exactly 4 digits!')
      return
    }

    if (!/^\d{4}$/.test(pinForm.confirmPin)) {
      toast.error('Confirm PIN must contain only numbers!')
      return
    }

    if (pinForm.newPin !== pinForm.confirmPin) {
      toast.error('New PINs do not match!')
      return
    }

    if (pinForm.currentPin === pinForm.newPin) {
      toast.error('New PIN must be different from current PIN!')
      return
    }

    setIsLoading(true)
    
    try {
      await changePin(pinForm.currentPin, pinForm.newPin)
      setPinForm({
        currentPin: '',
        newPin: '',
        confirmPin: ''
      })
      toast.success('PIN changed successfully!')
    } catch (error: any) {
      // Show specific error message for PIN-related errors
      if (error.message?.includes('Current PIN is incorrect')) {
        toast.error('Current PIN is incorrect. Please check your PIN and try again.')
        // Clear only the current PIN field to allow retry
        setPinForm(prev => ({ ...prev, currentPin: '' }))
      } else {
        toast.error(error.message || 'Failed to change PIN. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true)
    try {
      await deleteAccount()
      // Show success and close modal
      setShowDeleteModal(false)
      setIsDeletingAccount(false)
    } catch (error: any) {
      // Error is already handled in the store
      setIsDeletingAccount(false)
      setShowDeleteModal(false)
    }
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const getFullName = () => {
    return user.name || ''
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and settings
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefreshProfile}
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your personal details. Email and Phone are read-only and cannot be changed.
                  </CardDescription>
                </div>
                {!isEditingProfile ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleStartEdit}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSaveProfile}
                      disabled={isLoading}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {isLoading ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={isEditingProfile ? profileForm.firstName : (user.name?.split(' ')[0] || '')}
                  onChange={isEditingProfile ? (e) => handleProfileChange('firstName', e.target.value) : undefined}
                  disabled={!isEditingProfile}
                  icon={<User className="w-4 h-4" />}
                />
                
                <Input
                  label="Last Name"
                  value={isEditingProfile ? profileForm.lastName : (user.name?.split(' ').slice(1).join(' ') || '')}
                  onChange={isEditingProfile ? (e) => handleProfileChange('lastName', e.target.value) : undefined}
                  disabled={!isEditingProfile}
                  icon={<User className="w-4 h-4" />}
                />
                
                <Input
                  label="Email Address (Read-only)"
                  type="email"
                  value={user.email || ''}
                  disabled={true}
                  icon={<Mail className="w-4 h-4" />}
                />
                
                <Input
                  label="Phone Number (Read-only)"
                  type="tel"
                  value={user.phone || ''}
                  disabled={true}
                  icon={<Phone className="w-4 h-4" />}
                />
                
                <Input
                  label="State"
                  value={isEditingProfile ? profileForm.state : (user.state || '')}
                  onChange={isEditingProfile ? (e) => handleProfileChange('state', e.target.value) : undefined}
                  disabled={!isEditingProfile}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>
                Your account overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {getInitials(getFullName())}
                </div>
                <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                  <Camera className="w-4 h-4 inline mr-1" />
                  Change Photo
                </button>
              </div>

              {/* Account Info */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type:</span>
                  <span className="font-medium">Customer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wallet Balance (₦):</span>
                  <span className="font-medium text-primary">{formatAmount(walletBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-success font-medium">Active</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">Account Security</div>
                    <div className="text-xs text-blue-700">
                      Your account is protected with bank-grade security.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your account password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Current Password"
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                icon={<Shield className="w-4 h-4" />}
                endIcon={
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              
              <Input
                label="New Password"
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                icon={<Shield className="w-4 h-4" />}
                endIcon={
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              
              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                icon={<Shield className="w-4 h-4" />}
                endIcon={
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>
            
            <Button
              onClick={handleChangePassword}
              disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
              className="w-full md:w-auto"
            >
              {isLoading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Change PIN */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Change Transfer PIN
            </CardTitle>
            <CardDescription>
              Update your 4-digit transfer PIN for secure transactions. Enter your current PIN and choose a new 4-digit PIN.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Current PIN"
                type={showCurrentPin ? 'text' : 'password'}
                value={pinForm.currentPin}
                onChange={(e) => handlePinChange('currentPin', e.target.value)}
                maxLength={4}
                placeholder="0000"
                inputMode="numeric"
                icon={<Shield className="w-4 h-4" />}
                endIcon={
                  <button
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              
              <Input
                label="New PIN"
                type={showNewPin ? 'text' : 'password'}
                value={pinForm.newPin}
                onChange={(e) => handlePinChange('newPin', e.target.value)}
                maxLength={4}
                placeholder="0000"
                inputMode="numeric"
                icon={<Shield className="w-4 h-4" />}
                endIcon={
                  <button
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              
              <Input
                label="Confirm New PIN"
                type={showConfirmPin ? 'text' : 'password'}
                value={pinForm.confirmPin}
                onChange={(e) => handlePinChange('confirmPin', e.target.value)}
                maxLength={4}
                placeholder="0000"
                inputMode="numeric"
                icon={<Shield className="w-4 h-4" />}
                endIcon={
                  <button
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>
            
            <div className="space-y-3">
              <Button
                onClick={handleChangePin}
                disabled={isLoading || !pinForm.currentPin || !pinForm.newPin || !pinForm.confirmPin}
                className="w-full md:w-auto"
              >
                {isLoading ? 'Changing PIN...' : 'Change PIN'}
              </Button>
              
              <div className="text-sm text-gray-600 space-y-1">
                <p>• PIN must be exactly 4 digits</p>
                <p>• New PIN must be different from current PIN</p>
                <p>• Keep your PIN secure and don't share it with anyone</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="w-5 h-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data. This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">
                <strong>Warning:</strong> Once you delete your account, it cannot be recovered. Your account will be deactivated immediately 
                and permanently deleted after 90 days. Please make sure you've downloaded any important data before proceeding.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Need more information? <a href="/account-deletion" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Read our account deletion guide</a>
                </p>
              </div>
              <Button
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={isDeletingAccount}
      />
    </div>
  )
}

export default Profile 