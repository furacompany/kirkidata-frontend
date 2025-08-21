import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, RefreshCw, TrendingUp,
  DollarSign, Activity, Clock, Copy, Download,
  BarChart3, PieChart, Calendar, ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAdminStore } from '../../store/adminStore'
import toast from 'react-hot-toast'

const OtoBillWallet: React.FC = () => {
  const { otobillWalletBalance, fetchOtoBillWalletBalance } = useAdminStore()
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)



  useEffect(() => {
    loadWalletBalance()
  }, [])

  const loadWalletBalance = async () => {
    setIsLoading(true)
    try {
      await fetchOtoBillWalletBalance()
      setLastUpdated(new Date())
    } catch (error: any) {
      console.error('Failed to load wallet balance:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getBalanceColor = (balance: number) => {
    if (balance > 1000) return 'text-green-600'
    if (balance > 500) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getBalanceStatus = (balance: number) => {
    if (balance > 1000) return 'High Balance'
    if (balance > 500) return 'Moderate Balance'
    return 'Low Balance'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 animate-spin text-primary" />
          <span className="text-gray-600">Loading wallet balance...</span>
        </div>
      </div>
    )
  }

  if (!otobillWalletBalance) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Wallet Data</h3>
          <p className="text-gray-600 mb-4">Unable to load OtoBill wallet information.</p>
          <Button onClick={loadWalletBalance} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            OtoBill Wallet
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor your OtoBill wallet balance and transaction history.
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadWalletBalance} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Wallet className="w-6 h-6 text-primary" />
                Current Balance
              </CardTitle>
              <CardDescription className="text-gray-600">
                Your current OtoBill wallet balance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Balance Display */}
              <div className="text-center">
                <div className={`text-4xl font-bold ${getBalanceColor(otobillWalletBalance.balance)}`}>
                  {otobillWalletBalance.formattedBalance}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {getBalanceStatus(otobillWalletBalance.balance)}
                </p>
              </div>

              {/* Balance Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Available Balance</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {otobillWalletBalance.formattedBalance}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Account Status</p>
                      <p className="text-lg font-semibold text-green-600">Active</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Last Updated */}
              {lastUpdated && (
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Last updated: {formatDate(lastUpdated)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Manage your wallet and view reports
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className="w-full justify-start" 
                variant="outline"
                onClick={() => copyToClipboard(otobillWalletBalance.formattedBalance, 'Balance')}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Balance
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Reports
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <PieChart className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Transaction History
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Account Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your OtoBill wallet account details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">User ID</p>
                      <p className="text-sm text-gray-900">{otobillWalletBalance.userId}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(otobillWalletBalance.userId, 'User ID')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">Account Email</p>
                      <p className="text-sm text-gray-900">{otobillWalletBalance.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(otobillWalletBalance.email, 'Email')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Balance Status</p>
                      <p className={`text-lg font-bold ${getBalanceColor(otobillWalletBalance.balance)}`}>
                        {getBalanceStatus(otobillWalletBalance.balance)}
                      </p>
                    </div>
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ArrowUpRight className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Currency</p>
                      <p className="text-lg font-semibold text-gray-900">Nigerian Naira (₦)</p>
                    </div>
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your recent wallet transactions and activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Activity</h3>
              <p className="text-gray-600 mb-4">
                Transaction history will appear here when you have recent activities.
              </p>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Full History
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default OtoBillWallet
