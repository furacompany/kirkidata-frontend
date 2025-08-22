import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, TrendingUp, Calendar, 
  RefreshCw, Download, Activity, DollarSign, 
  Smartphone, Wifi, PieChart
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAdminStore } from '../../store/adminStore'
import toast from 'react-hot-toast'

const OtoBillStats: React.FC = () => {
  const { 
    otobillTransactionStats,
    fetchOtoBillTransactionStats
  } = useAdminStore()
  
  const [isLoading, setIsLoading] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })
  const [selectedType, setSelectedType] = useState<'all' | 'data' | 'airtime'>('all')

  useEffect(() => {
    loadStats()
  }, [dateRange, selectedType])

  const loadStats = async () => {
    setIsLoading(true)
    try {
      await fetchOtoBillTransactionStats(
        dateRange.startDate || undefined,
        dateRange.endDate || undefined,
        selectedType
      )
    } catch (error: any) {
      console.error('Failed to load stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG').format(num)
  }

  const exportStats = () => {
    toast.success('Export functionality coming soon!')
  }

  const getCurrentPeriod = () => {
    if (dateRange.startDate && dateRange.endDate) {
      return `${dateRange.startDate} to ${dateRange.endDate}`
    }
    return 'All time'
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
            <BarChart3 className="w-8 h-8 text-primary" />
            OtoBill Statistics & Analysis
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive analytics and insights for OtoBill transactions
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadStats} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportStats} size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Date Range & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as 'all' | 'data' | 'airtime')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Types</option>
                  <option value="data">Data Only</option>
                  <option value="airtime">Airtime Only</option>
                </select>
              </div>

              {/* Period Display */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Period
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-600">
                  {getCurrentPeriod()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Total Transactions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Total Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : (
                formatNumber(otobillTransactionStats?.totalTransactions || 0)
              )}
            </div>
            <p className="text-sm text-gray-600">
              {otobillTransactionStats?.period || 'All time'}
            </p>
          </CardContent>
        </Card>

        {/* Total Amount */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
              ) : (
                formatCurrency(otobillTransactionStats?.totalAmount || 0)
              )}
            </div>
            <p className="text-sm text-gray-600">
              Transaction volume
            </p>
          </CardContent>
        </Card>

        {/* Total Profit */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Total Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : (
                formatCurrency(otobillTransactionStats?.totalProfit || 0)
              )}
            </div>
            <p className="text-sm text-gray-600">
              Net profit margin
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Data Transactions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wifi className="w-5 h-5 text-blue-600" />
              Data Transactions
            </CardTitle>
            <CardDescription>
              Statistics for data plan transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Count</span>
                <span className="font-semibold">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                  ) : (
                    formatNumber(otobillTransactionStats?.data.count || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="font-semibold">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                  ) : (
                    formatCurrency(otobillTransactionStats?.data.amount || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Profit</span>
                <span className="font-semibold">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                  ) : (
                    formatCurrency(otobillTransactionStats?.data.profit || 0)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average per Transaction</span>
                  <span className="font-semibold">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                    ) : (
                      otobillTransactionStats?.data.count ? 
                        formatCurrency(otobillTransactionStats.data.amount / otobillTransactionStats.data.count) :
                        '₦0.00'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Airtime Transactions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-purple-600" />
              Airtime Transactions
            </CardTitle>
            <CardDescription>
              Statistics for airtime transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Count</span>
                <span className="font-semibold">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                  ) : (
                    formatNumber(otobillTransactionStats?.airtime.count || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Amount</span>
                <span className="font-semibold">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                  ) : (
                    formatCurrency(otobillTransactionStats?.airtime.amount || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Profit</span>
                <span className="font-semibold">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                  ) : (
                    formatCurrency(otobillTransactionStats?.airtime.profit || 0)
                  )}
                </span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average per Transaction</span>
                  <span className="font-semibold">
                    {isLoading ? (
                      <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                    ) : (
                      otobillTransactionStats?.airtime.count ? 
                        formatCurrency(otobillTransactionStats.airtime.amount / otobillTransactionStats.airtime.count) :
                        '₦0.00'
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Summary Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Summary Insights
            </CardTitle>
            <CardDescription>
              Key insights and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Data vs Airtime Distribution */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Transaction Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data</span>
                    <span className="font-semibold">
                      {otobillTransactionStats?.totalTransactions ? 
                        `${((otobillTransactionStats.data.count / otobillTransactionStats.totalTransactions) * 100).toFixed(1)}%` :
                        '0%'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Airtime</span>
                    <span className="font-semibold">
                      {otobillTransactionStats?.totalTransactions ? 
                        `${((otobillTransactionStats.airtime.count / otobillTransactionStats.totalTransactions) * 100).toFixed(1)}%` :
                        '0%'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Profit Margins */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Profit Margins</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Data</span>
                    <span className="font-semibold">
                      {otobillTransactionStats?.data.amount ? 
                        `${((otobillTransactionStats.data.profit / otobillTransactionStats.data.amount) * 100).toFixed(1)}%` :
                        '0%'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Airtime</span>
                    <span className="font-semibold">
                      {otobillTransactionStats?.airtime.amount ? 
                        `${((otobillTransactionStats.airtime.profit / otobillTransactionStats.airtime.amount) * 100).toFixed(1)}%` :
                        '0%'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg Transaction</span>
                    <span className="font-semibold">
                      {otobillTransactionStats?.totalTransactions ? 
                        formatCurrency(otobillTransactionStats.totalAmount / otobillTransactionStats.totalTransactions) :
                        '₦0.00'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Overall Margin</span>
                    <span className="font-semibold">
                      {otobillTransactionStats?.totalAmount ? 
                        `${((otobillTransactionStats.totalProfit / otobillTransactionStats.totalAmount) * 100).toFixed(1)}%` :
                        '0%'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default OtoBillStats
