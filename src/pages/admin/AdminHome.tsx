import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Activity,
  Smartphone, Wifi, CreditCard,
  Clock, ArrowUpRight, Shield,
  BarChart3, Calendar, TrendingUp, DollarSign, Target
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAdminStore } from '../../store/adminStore'
import { Link } from 'react-router-dom'

const AdminHome: React.FC = () => {
  const { 
    stats, 
    users, 
    transactions, 
    transactionStats,
    fetchUsers, 
    fetchTransactions, 
    fetchStats,
    fetchOtoBillTransactionStats,
    fetchTransactionStats
  } = useAdminStore()
  
  // Improved loading state management
  const [isLoadingStats, setIsLoadingStats] = React.useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = React.useState(true)
  const [isLoadingTransactions, setIsLoadingTransactions] = React.useState(true)
  const [isLoadingOtoBillStats, setIsLoadingOtoBillStats] = React.useState(true)
  const [isLoadingTransactionStats, setIsLoadingTransactionStats] = React.useState(true)
  
  // Date filter states
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  
  // Combined loading state for the entire dashboard
  const isDashboardLoading = isLoadingStats || isLoadingUsers || isLoadingTransactions || isLoadingOtoBillStats || isLoadingTransactionStats

  useEffect(() => {
    const loadData = async () => {
      // Check if admin token exists before making any API calls
      const adminAccessToken = localStorage.getItem('adminAccessToken')
      if (!adminAccessToken) {
        // If no token, don't make any API calls
        setIsLoadingStats(false)
        setIsLoadingOtoBillStats(false)
        setIsLoadingTransactionStats(false)
        setIsLoadingUsers(false)
        setIsLoadingTransactions(false)
        return
      }

      // Fetch stats
      if (typeof fetchStats === 'function') {
        try {
          setIsLoadingStats(true)
          await fetchStats()
        } catch (error) {
          console.error('Failed to fetch stats:', error)
        } finally {
          setIsLoadingStats(false)
        }
      } else {
        setIsLoadingStats(false)
      }

      // Fetch OtoBill transaction stats for revenue calculation
      if (typeof fetchOtoBillTransactionStats === 'function') {
        try {
          setIsLoadingOtoBillStats(true)
          await fetchOtoBillTransactionStats()
        } catch (error) {
          console.error('Failed to fetch OtoBill transaction stats:', error)
        } finally {
          setIsLoadingOtoBillStats(false)
        }
      } else {
        setIsLoadingOtoBillStats(false)
      }

      // Fetch transaction statistics
      if (typeof fetchTransactionStats === 'function') {
        try {
          setIsLoadingTransactionStats(true)
          await fetchTransactionStats()
        } catch (error) {
          console.error('Failed to fetch transaction stats:', error)
        } finally {
          setIsLoadingTransactionStats(false)
        }
      } else {
        setIsLoadingTransactionStats(false)
      }

      // Fetch users
      if (typeof fetchUsers === 'function') {
        try {
          setIsLoadingUsers(true)
          await fetchUsers()
        } catch (error) {
          console.error('Failed to fetch users:', error)
        } finally {
          setIsLoadingUsers(false)
        }
      } else {
        setIsLoadingUsers(false)
      }

      // Fetch transactions
      if (typeof fetchTransactions === 'function') {
        try {
          setIsLoadingTransactions(true)
          await fetchTransactions()
        } catch (error) {
          console.error('Failed to fetch transactions:', error)
        } finally {
          setIsLoadingTransactions(false)
        }
      } else {
        setIsLoadingTransactions(false)
      }
    }

    loadData()
  }, [fetchStats, fetchUsers, fetchTransactions, fetchOtoBillTransactionStats, fetchTransactionStats])

  // Only show data when not loading and data exists
  const recentTransactions = !isDashboardLoading && stats?.recentTransactions ? 
    stats.recentTransactions : 
    (!isDashboardLoading && Array.isArray(transactions) ? transactions.slice(0, 4) : [])
    
  const recentUsers = !isDashboardLoading && stats?.recentUsers ? 
    stats.recentUsers : 
    (!isDashboardLoading && Array.isArray(users) ? users.slice(0, 4) : [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
      case 'completed':
        return 'text-success bg-success/10 border-success/20'
      case 'pending':
        return 'text-yellow bg-yellow/10 border-yellow/20'
      case 'failed':
        return 'text-danger bg-danger/10 border-danger/20'
      default:
        return 'text-gray-500 bg-gray-100 border-gray/20'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'airtime':
        return <Smartphone className="w-4 h-4 text-green-600" />
      case 'data':
        return <Wifi className="w-4 h-4 text-blue-600" />
      case 'wallet_funding':
      case 'funding':
        return <CreditCard className="w-4 h-4 text-purple-600" />
      case 'wallet_withdrawal':
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const getTransactionAmount = (transaction: any) => {
    const isCredit = transaction.type === 'wallet_funding' || transaction.type === 'funding'
    return `${isCredit ? '+' : '-'}${formatAmount(transaction.amount)}`
  }


  const handleDateFilter = async () => {
    try {
      setIsLoadingTransactionStats(true)
      await fetchTransactionStats(startDate || undefined, endDate || undefined)
    } catch (error) {
      console.error('Failed to fetch filtered transaction stats:', error)
    } finally {
      setIsLoadingTransactionStats(false)
    }
  }

  const clearDateFilter = async () => {
    setStartDate('')
    setEndDate('')
    try {
      setIsLoadingTransactionStats(true)
      await fetchTransactionStats()
    } catch (error) {
      console.error('Failed to fetch transaction stats:', error)
    } finally {
      setIsLoadingTransactionStats(false)
    }
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
            <Shield className="w-8 h-8 text-primary" />
            System Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor platform performance and user activity in real-time.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={async () => {
              setIsLoadingStats(true)
              setIsLoadingOtoBillStats(true)
              setIsLoadingTransactionStats(true)
              try {
                await Promise.all([
                  fetchStats?.(),
                  fetchOtoBillTransactionStats?.(),
                  fetchTransactionStats?.(startDate || undefined, endDate || undefined)
                ])
              } catch (error) {
                console.error('Failed to refresh stats:', error)
              } finally {
                setIsLoadingStats(false)
                setIsLoadingOtoBillStats(false)
                setIsLoadingTransactionStats(false)
              }
            }}
            disabled={isDashboardLoading}
          >
            <Activity className="w-4 h-4 mr-2" />
            {isDashboardLoading ? 'Refreshing...' : 'Refresh Stats'}
          </Button>
          <Link to="/admin/users">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </Link>

        </div>
      </motion.div>

      {/* Dynamic Transaction Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-6"
      >
        {/* Date Filter Controls */}
        <Card className="border-0 shadow-lg bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Transaction Statistics
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {transactionStats?.period?.isOverall ? 'Overall statistics' : `Statistics from ${transactionStats?.period?.startDate ? new Date(transactionStats.period.startDate).toLocaleDateString() : 'N/A'} to ${transactionStats?.period?.endDate ? new Date(transactionStats.period.endDate).toLocaleDateString() : 'N/A'}`}
                </CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-40"
                  />
                  <Input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <Button
                  onClick={handleDateFilter}
                  disabled={isLoadingTransactionStats}
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  {isLoadingTransactionStats ? 'Loading...' : 'Filter'}
                </Button>
                <Button
                  onClick={clearDateFilter}
                  disabled={isLoadingTransactionStats}
                  variant="outline"
                  size="sm"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Users</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTransactionStats ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ) : transactionStats?.overview?.totalUsers ? (
                <>
                  <div className="text-2xl font-bold text-gray-900">{transactionStats.overview.totalUsers.toLocaleString()}</div>
                  <div className="text-xs text-blue-600 font-medium mt-1">
                    Registered users
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-500">No data available</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Transactions */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Transactions</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Activity className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTransactionStats ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ) : transactionStats?.overview?.totalTransactions ? (
                <>
                  <div className="text-2xl font-bold text-gray-900">{transactionStats.overview.totalTransactions.toLocaleString()}</div>
                  <div className="text-xs text-purple-600 font-medium mt-1">
                    All transactions
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-500">No data available</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Wallet Funding */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Wallet Funding</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTransactionStats ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ) : transactionStats?.overview?.totalWalletFunding ? (
                <>
                  <div className="text-2xl font-bold text-gray-900">{formatAmount(transactionStats.overview.totalWalletFunding)}</div>
                  <div className="text-xs text-green-600 font-medium mt-1">
                    Total funding
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-500">No data available</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Profit */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Total Profit</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Target className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTransactionStats ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
              ) : transactionStats?.overview?.totalProfit ? (
                <>
                  <div className="text-2xl font-bold text-gray-900">{formatAmount(transactionStats.overview.totalProfit)}</div>
                  <div className="text-xs text-orange-600 font-medium mt-1">
                    Platform profit
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-500">No data available</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>


      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Recent Transactions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">Recent Transactions</CardTitle>
                <CardDescription className="text-gray-600">
                  Latest platform activity
                </CardDescription>
              </div>
              <Link to="/admin/transactions">
                <Button variant="outline" size="sm">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isDashboardLoading ? (
                // Loading skeleton for recent transactions
                <>
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-5 bg-gray-300 rounded w-20 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <div className="w-4 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-28 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-5 bg-gray-300 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-gray-900">{getTransactionAmount(transaction)}</div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent transactions</h3>
                  <p className="text-gray-500">Transaction data will appear here once users start making purchases.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">New Registrations</CardTitle>
                <CardDescription className="text-gray-600">
                  Recently joined users
                </CardDescription>
              </div>
              <Link to="/admin/users">
                <Button variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  Manage All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isDashboardLoading ? (
                // Loading skeleton for recent users
                <>
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-32 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-24"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div>
                          <div className="h-4 bg-gray-300 rounded w-28 mb-2"></div>
                          <div className="h-3 bg-gray-300 rounded w-20"></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="h-3 bg-gray-300 rounded w-16 mb-2"></div>
                        <div className="h-6 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                </>
              ) : recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id || user.id || Math.random()} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {(user.firstName || user.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.name || 'Unknown User'
                          }
                        </div>
                        <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        {formatDate(user.createdAt)}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        user.isActive || user.status === 'active' 
                          ? 'text-success bg-success/10 border-success/20' 
                          : 'text-gray-500 bg-gray-100 border-gray/20'
                      }`}>
                        {user.isActive ? 'active' : (user.status || 'inactive')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent users</h3>
                  <p className="text-gray-500">New user registrations will appear here.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      
    </div>
  )
}

export default AdminHome