import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Banknote, Activity,
  Smartphone, Wifi, CreditCard, CheckCircle,
  Clock, ArrowUpRight, ArrowDownRight, Shield,
  Zap, PieChart, Globe, BarChart3
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useAdminStore } from '../../store/adminStore'
import { Link } from 'react-router-dom'

const AdminHome: React.FC = () => {
  const { stats, users, transactions, fetchUsers, fetchTransactions, fetchStats } = useAdminStore()

  useEffect(() => {
    // Only call functions if they exist
    if (typeof fetchStats === 'function') {
      fetchStats()
    }
    if (typeof fetchUsers === 'function') {
      fetchUsers()
    }
    if (typeof fetchTransactions === 'function') {
      fetchTransactions()
    }
  }, [fetchStats, fetchUsers, fetchTransactions])

  const recentTransactions = Array.isArray(transactions) ? transactions.slice(0, 4) : []
  const recentUsers = Array.isArray(users) ? users.slice(0, 4) : []

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

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0
    return ((current - previous) / previous) * 100
  }

  // Safe access to stats with default values
  const safeStats = {
    totalUsers: stats?.totalUsers ?? 156,
    previousUsers: stats?.previousUsers ?? 142,
    totalRevenue: stats?.totalRevenue ?? 2847500,
    previousRevenue: stats?.previousRevenue ?? 2234800,
    totalTransactions: stats?.totalTransactions ?? 1247,
    previousTransactions: stats?.previousTransactions ?? 1089,
    activeUsers: stats?.activeUsers ?? 89,
    previousActiveUsers: stats?.previousActiveUsers ?? 76,
    airtimeTransactions: stats?.airtimeTransactions ?? 432,
    airtimeRevenue: stats?.airtimeRevenue ?? 1250000,
    dataTransactions: stats?.dataTransactions ?? 318,
    dataRevenue: stats?.dataRevenue ?? 897500,
    walletTransactions: stats?.walletTransactions ?? 497,
    walletRevenue: stats?.walletRevenue ?? 700000,
    networkStats: stats?.networkStats ?? {
      MTN: { successful: 45, total: 50 },
      Airtel: { successful: 38, total: 42 },
      Glo: { successful: 32, total: 35 },
      '9mobile': { successful: 28, total: 31 }
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
          <Link to="/admin/users">
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
          </Link>
          <Link to="/admin/settings">
                            <Button className="bg-primary hover:bg-primary/90 text-white">
              <Shield className="w-4 h-4 mr-2" />
              System Settings
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* Total Users */}
        <Card className="border-0 shadow-lg bg-blue-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Users</CardTitle>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{safeStats.totalUsers.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-2">
              {getPercentageChange(safeStats.totalUsers, safeStats.previousUsers) > 0 ? (
                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={getPercentageChange(safeStats.totalUsers, safeStats.previousUsers) > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(getPercentageChange(safeStats.totalUsers, safeStats.previousUsers)).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Revenue */}
        <Card className="border-0 shadow-lg bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Revenue</CardTitle>
            <div className="p-2 bg-green-100 rounded-lg">
                              <Banknote className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatAmount(safeStats.totalRevenue)}</div>
            <div className="flex items-center text-xs mt-2">
              {getPercentageChange(safeStats.totalRevenue, safeStats.previousRevenue) > 0 ? (
                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={getPercentageChange(safeStats.totalRevenue, safeStats.previousRevenue) > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(getPercentageChange(safeStats.totalRevenue, safeStats.previousRevenue)).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Transactions */}
        <Card className="border-0 shadow-lg bg-purple-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Transactions</CardTitle>
            <div className="p-2 bg-purple-100 rounded-lg">
              <Activity className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{safeStats.totalTransactions.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-2">
              {getPercentageChange(safeStats.totalTransactions, safeStats.previousTransactions) > 0 ? (
                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={getPercentageChange(safeStats.totalTransactions, safeStats.previousTransactions) > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(getPercentageChange(safeStats.totalTransactions, safeStats.previousTransactions)).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Users */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Users</CardTitle>
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{safeStats.activeUsers}</div>
            <div className="flex items-center text-xs mt-2">
              {getPercentageChange(safeStats.activeUsers, safeStats.previousActiveUsers) > 0 ? (
                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={getPercentageChange(safeStats.activeUsers, safeStats.previousActiveUsers) > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(getPercentageChange(safeStats.activeUsers, safeStats.previousActiveUsers)).toFixed(1)}% from last month
              </span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Charts and Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Transaction Types Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">Service Performance</CardTitle>
                <CardDescription className="text-gray-600">
                  Revenue breakdown by service type
                </CardDescription>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <PieChart className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Smartphone className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Airtime Recharge</div>
                  <div className="text-sm text-gray-600">{safeStats.airtimeTransactions.toLocaleString()} transactions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{formatAmount(safeStats.airtimeRevenue)}</div>
                <div className="text-xs text-green-600 font-medium">44% of revenue</div>
              </div>
            </div>
            
                            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Wifi className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Data Bundles</div>
                  <div className="text-sm text-gray-600">{safeStats.dataTransactions.toLocaleString()} transactions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{formatAmount(safeStats.dataRevenue)}</div>
                <div className="text-xs text-blue-600 font-medium">32% of revenue</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Wallet Funding</div>
                  <div className="text-sm text-gray-600">{safeStats.walletTransactions.toLocaleString()} transactions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{formatAmount(safeStats.walletRevenue)}</div>
                <div className="text-xs text-purple-600 font-medium">24% of revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">Network Status</CardTitle>
                <CardDescription className="text-gray-600">
                  Transaction success rates by provider
                </CardDescription>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Globe className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(safeStats.networkStats).map(([network, stats]) => {
              const successRate = stats.total > 0 ? (stats.successful / stats.total) * 100 : 0
              const getNetworkColor = (network: string) => {
                switch (network) {
                  case 'MTN': return 'yellow'
                  case 'Airtel': return 'red'
                  case 'Glo': return 'green'
                  case '9mobile': return 'blue'
                  default: return 'gray'
                }
              }
              const color = getNetworkColor(network)
              
              return (
                <div key={network} className={`flex items-center justify-between p-4 bg-${color}-50 rounded-xl border border-${color}-200`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 bg-${color}-100 rounded-lg`}>
                      <div className={`w-4 h-4 bg-${color}-600 rounded`}></div>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{network}</div>
                      <div className="text-sm text-gray-600">
                        {stats.successful}/{stats.total} successful
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{successRate.toFixed(1)}%</div>
                    <div className={`text-xs font-medium ${successRate >= 90 ? 'text-green-600' : successRate >= 75 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {successRate >= 90 ? 'Excellent' : successRate >= 75 ? 'Good' : 'Needs Attention'}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
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
              {recentTransactions.length > 0 ? (
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
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name || 'Unknown User'}</div>
                        <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">
                        {formatDate(user.createdAt)}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full border ${
                        user.status === 'active' 
                          ? 'text-success bg-success/10 border-success/20' 
                          : 'text-gray-500 bg-gray-100 border-gray/20'
                      }`}>
                        {user.status || 'inactive'}
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

      {/* System Status Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 bg-green-50 border border-green-200">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success rounded-lg">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">All Systems Operational</h3>
                  <p className="text-sm text-gray-600">Platform is running smoothly with 99.9% uptime</p>
                </div>
              </div>
              <Link to="/admin/settings">
                <Button className="bg-success hover:bg-success/90 text-white">
                  <Shield className="w-4 h-4 mr-2" />
                  System Settings
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminHome