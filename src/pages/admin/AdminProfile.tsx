import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Mail, Phone, Shield, Eye, EyeOff,
  Camera, RefreshCw, Edit, Save, X, Crown
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAdminStore } from '../../store/adminStore'
import toast from 'react-hot-toast'

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const AdminProfile: React.FC = () => {
  const { admin, fetchAdminProfile, updateAdminProfile, changeAdminPassword } = useAdminStore()
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Edit profile state
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [originalProfileData, setOriginalProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Fetch admin profile data when component mounts
  useEffect(() => {
    fetchAdminProfileData()
  }, [])

  // Initialize profile form data when admin data is available
  useEffect(() => {
    if (admin) {
      setProfileForm({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        phone: admin.phone || ''
      })
      setOriginalProfileData({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        phone: admin.phone || ''
      })
    }
  }, [admin])

  const fetchAdminProfileData = async () => {
    try {
      await fetchAdminProfile()
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch admin profile')
    }
  }

  const handleRefreshProfile = async () => {
    setIsRefreshing(true)
    try {
      await fetchAdminProfileData()
      toast.success('Profile refreshed successfully!')
    } catch (error) {
      toast.error('Failed to refresh profile')
    } finally {
      setIsRefreshing(false)
    }
  }

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
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
    if (!profileForm.firstName.trim() || !profileForm.lastName.trim() || !profileForm.phone.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    
    try {
      await updateAdminProfile(
        profileForm.firstName.trim(),
        profileForm.lastName.trim(),
        profileForm.phone.trim()
      )
      
      setOriginalProfileData(profileForm)
      setIsEditingProfile(false)
    } catch (error: any) {
      // Error is already handled in the store
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
      await changeAdminPassword(
        passwordForm.currentPassword.trim(),
        passwordForm.newPassword.trim()
      )
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error: any) {
      // Error is already handled in the store
    } finally {
      setIsLoading(false)
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Administrator'
      case 'admin':
        return 'Administrator'
      default:
        return role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' ')
    }
  }

  // Show loading state if admin is not loaded yet
  if (!admin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold text-gray-900">Admin Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your administrator account information and settings
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
                    Your personal details. Email cannot be changed for security reasons.
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
                  value={isEditingProfile ? profileForm.firstName : admin.firstName}
                  onChange={isEditingProfile ? (e) => handleProfileChange('firstName', e.target.value) : undefined}
                  disabled={!isEditingProfile}
                  icon={<User className="w-4 h-4" />}
                />
                
                <Input
                  label="Last Name"
                  value={isEditingProfile ? profileForm.lastName : admin.lastName}
                  onChange={isEditingProfile ? (e) => handleProfileChange('lastName', e.target.value) : undefined}
                  disabled={!isEditingProfile}
                  icon={<User className="w-4 h-4" />}
                />
                
                <Input
                  label="Email Address (Read-only)"
                  type="email"
                  value={admin.email}
                  disabled={true}
                  icon={<Mail className="w-4 h-4" />}
                />
                
                <Input
                  label="Phone Number"
                  type="tel"
                  value={isEditingProfile ? profileForm.phone : admin.phone}
                  onChange={isEditingProfile ? (e) => handleProfileChange('phone', e.target.value) : undefined}
                  disabled={!isEditingProfile}
                  icon={<Phone className="w-4 h-4" />}
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
                Your administrator account overview
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Picture */}
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                  {getInitials(admin.firstName, admin.lastName)}
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
                  <span className="font-medium flex items-center gap-1">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    Administrator
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Role:</span>
                  <span className="font-medium text-primary">{getRoleDisplayName(admin.role)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since:</span>
                  <span className="font-medium">Jan 2024</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="font-medium">Recently</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${admin.isActive ? 'text-success' : 'text-red-500'}`}>
                    {admin.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-blue-900">Administrator Security</div>
                    <div className="text-xs text-blue-700">
                      Your account has elevated privileges. Keep your credentials secure.
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
              Update your administrator account password
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
    </div>
  )
}

export default AdminProfile
