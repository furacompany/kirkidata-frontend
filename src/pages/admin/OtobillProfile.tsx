import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, Wallet, Shield, Mail, Phone, CheckCircle, XCircle,
  Clock, Key, Globe, Calendar
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { useAdminStore } from '../../store/adminStore'



const OtobillProfile: React.FC = () => {
  const { 
    otobillProfile, 
    otobillWalletBalance, 
    fetchOtoBillProfile, 
    fetchOtoBillWalletBalance,
    checkAuthStatus
  } = useAdminStore()
  
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, validate the admin authentication
        const isAuthValid = await checkAuthStatus()
        
        if (!isAuthValid) {
          // Silent redirect - no error message
          setLoading(false)
          return
        }

        // Use admin store methods to fetch data
        await Promise.all([
          fetchOtoBillProfile(),
          fetchOtoBillWalletBalance()
        ])
        
      } catch (err: any) {
        // Silent fail - no error message
        console.error('Failed to fetch OtoBill data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [fetchOtoBillProfile, fetchOtoBillWalletBalance, checkAuthStatus])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">OtoBill Profile</h1>
              <p className="text-gray-600 mt-2">
                Loading OtoBill profile information...
              </p>
            </div>
          </div>
        </motion.div>
        
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  // No error display - silent fail

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">OtoBill Profile</h1>
            <p className="text-gray-600 mt-2">
              Manage and view OtoBill account information
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-x-2 rounded-lg bg-primary/10 px-4 py-2 border border-primary/20">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-gray-900">
                OtoBill Account
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Overview Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Overview
            </CardTitle>
            <CardDescription>
              Basic account information and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                                     <div>
                     <h3 className="font-semibold text-lg">
                       {otobillProfile?.firstName} {otobillProfile?.lastName}
                     </h3>
                     <p className="text-sm text-gray-500 capitalize">{otobillProfile?.role}</p>
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex items-center gap-3">
                     <Mail className="w-4 h-4 text-gray-400" />
                     <span className="text-sm">{otobillProfile?.email}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <Phone className="w-4 h-4 text-gray-400" />
                     <span className="text-sm">{otobillProfile?.phoneNumber}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-4 h-4 flex items-center justify-center">
                       {otobillProfile?.isEmailVerified ? (
                         <CheckCircle className="w-4 h-4 text-green-500" />
                       ) : (
                         <XCircle className="w-4 h-4 text-red-500" />
                       )}
                     </div>
                     <span className="text-sm">
                       Email {otobillProfile?.isEmailVerified ? 'Verified' : 'Not Verified'}
                     </span>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                     <Wallet className="w-5 h-5 text-green-600" />
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg text-green-600">
                       {otobillProfile?.formattedWalletBalance}
                     </h3>
                     <p className="text-sm text-gray-500">Current Balance</p>
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex items-center gap-3">
                     <div className="w-4 h-4 flex items-center justify-center">
                       {otobillProfile?.isActive ? (
                         <CheckCircle className="w-4 h-4 text-green-500" />
                       ) : (
                         <XCircle className="w-4 h-4 text-red-500" />
                       )}
                     </div>
                     <span className="text-sm">
                       Account {otobillProfile?.isActive ? 'Active' : 'Inactive'}
                     </span>
                   </div>
                   <div className="flex items-center gap-3">
                     <div className="w-4 h-4 flex items-center justify-center">
                       {otobillProfile?.hasSetPin ? (
                         <CheckCircle className="w-4 h-4 text-green-500" />
                       ) : (
                         <XCircle className="w-4 h-4 text-red-500" />
                       )}
                     </div>
                     <span className="text-sm">
                       PIN {otobillProfile?.hasSetPin ? 'Set' : 'Not Set'}
                     </span>
                   </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* API Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Information
            </CardTitle>
            <CardDescription>
              API key details and usage information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                                 <div>
                   <label className="text-sm font-medium text-gray-700">API Key Name</label>
                   <p className="text-sm text-gray-900 mt-1">{otobillProfile?.apiKeyName}</p>
                 </div>
                 
                 <div>
                   <label className="text-sm font-medium text-gray-700">IP Whitelist</label>
                   <div className="flex items-center gap-2 mt-1">
                     <Globe className="w-4 h-4 text-gray-400" />
                     <span className="text-sm text-gray-900">{otobillProfile?.ipWhitelist}</span>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <div>
                   <label className="text-sm font-medium text-gray-700">Created At</label>
                   <div className="flex items-center gap-2 mt-1">
                     <Calendar className="w-4 h-4 text-gray-400" />
                     <span className="text-sm text-gray-900">
                       {otobillProfile?.apiKeyCreatedAt ? formatDate(otobillProfile.apiKeyCreatedAt) : 'N/A'}
                     </span>
                   </div>
                 </div>
                 
                 <div>
                   <label className="text-sm font-medium text-gray-700">Last Used</label>
                   <div className="flex items-center gap-2 mt-1">
                     <Clock className="w-4 h-4 text-gray-400" />
                     <span className="text-sm text-gray-900">
                       {otobillProfile?.apiKeyLastUsed ? formatDate(otobillProfile.apiKeyLastUsed) : 'Never'}
                     </span>
                   </div>
                 </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet Details Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Wallet Details
            </CardTitle>
            <CardDescription>
              Current wallet balance and account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="text-center p-4 bg-green-50 rounded-lg">
                 <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <Wallet className="w-6 h-6 text-green-600" />
                 </div>
                 <h3 className="text-2xl font-bold text-green-600">
                   {otobillWalletBalance?.formattedBalance}
                 </h3>
                 <p className="text-sm text-gray-600">Current Balance</p>
               </div>
               
               <div className="text-center p-4 bg-blue-50 rounded-lg">
                 <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <User className="w-6 h-6 text-blue-600" />
                 </div>
                 <h3 className="text-lg font-semibold text-blue-600">
                   {otobillWalletBalance?.userId}
                 </h3>
                 <p className="text-sm text-gray-600">User ID</p>
               </div>
               
               <div className="text-center p-4 bg-purple-50 rounded-lg">
                 <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                   <Mail className="w-6 h-6 text-purple-600" />
                 </div>
                 <h3 className="text-sm font-semibold text-purple-600 break-all">
                   {otobillWalletBalance?.email}
                 </h3>
                 <p className="text-sm text-gray-600">Associated Email</p>
               </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default OtobillProfile
