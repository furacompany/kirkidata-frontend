import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Activity, Edit, Eye,
  CheckCircle, Clock, Smartphone, Wifi, CreditCard,
  TrendingUp, Download, X
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAdminStore } from '../../store/adminStore'
import toast from 'react-hot-toast'

interface FilterOption {
  id: string
  name: string
  value: string
}

const typeOptions: FilterOption[] = [
  { id: 'all', name: 'All Types', value: 'all' },
  { id: 'airtime', name: 'Airtime', value: 'airtime' },
  { id: 'data', name: 'Data', value: 'data' },
  { id: 'funding', name: 'Funding', value: 'funding' },
  { id: 'debit', name: 'Debit', value: 'debit' },
]

const statusOptions: FilterOption[] = [
  { id: 'all', name: 'All Status', value: 'all' },
  { id: 'completed', name: 'Completed', value: 'completed' },
  { id: 'pending', name: 'Pending', value: 'pending' },
  { id: 'failed', name: 'Failed', value: 'failed' },
]

const networkOptions: FilterOption[] = [
  { id: 'all', name: 'All Networks', value: 'all' },
  { id: 'MTN', name: 'MTN', value: 'MTN' },
  { id: 'AIRTEL', name: 'Airtel', value: 'AIRTEL' },
  { id: 'GLO', name: 'GLO', value: 'GLO' },
  { id: '9MOBILE', name: '9Mobile', value: '9MOBILE' },
]

const TransactionsPanel: React.FC = () => {
  const { transactions, fetchTransactions, getTransactionById, transactionStats, fetchTransactionStats, transactionsPagination, clearTransactions } = useAdminStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedNetwork, setSelectedNetwork] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit] = useState(20)
  const [observerTarget, setObserverTarget] = useState<HTMLDivElement | null>(null)
  
  // Filter states
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [minAmount, setMinAmount] = useState('')
  const [maxAmount, setMaxAmount] = useState('')

  // Load initial transactions and stats on mount and when filters change
  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1)
    clearTransactions()
    
    const loadInitial = async () => {
      setIsLoading(true)
      try {
        const filters: any = {}
        
        if (selectedType !== 'all') filters.type = selectedType
        if (selectedStatus !== 'all') filters.status = selectedStatus
        if (selectedNetwork !== 'all') filters.networkName = selectedNetwork
        if (startDate) filters.startDate = startDate
        if (endDate) filters.endDate = endDate
        if (minAmount) filters.minAmount = parseFloat(minAmount)
        if (maxAmount) filters.maxAmount = parseFloat(maxAmount)
        
        await fetchTransactions(1, limit, filters, false)
        setCurrentPage(1)
      } catch (error: any) {
        console.error('Failed to load transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadInitial()
    loadStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedType, selectedStatus, selectedNetwork, startDate, endDate, minAmount, maxAmount])

  // Infinite scroll observer
  useEffect(() => {
    if (!transactionsPagination?.hasNext || isLoadingMore || isLoading) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && transactionsPagination?.hasNext && !isLoadingMore && !isLoading) {
          loadMoreTransactions()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget) {
      observer.observe(observerTarget)
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerTarget, transactionsPagination?.hasNext, isLoadingMore, isLoading])

  const loadTransactions = async (page: number = 1, append: boolean = false) => {
    if (append) {
      setIsLoadingMore(true)
    } else {
      setIsLoading(true)
    }
    
    try {
      const filters: any = {}
      
      if (selectedType !== 'all') filters.type = selectedType
      if (selectedStatus !== 'all') filters.status = selectedStatus
      if (selectedNetwork !== 'all') filters.networkName = selectedNetwork
      if (startDate) filters.startDate = startDate
      if (endDate) filters.endDate = endDate
      if (minAmount) filters.minAmount = parseFloat(minAmount)
      if (maxAmount) filters.maxAmount = parseFloat(maxAmount)
      
      await fetchTransactions(page, limit, filters, append)
      setCurrentPage(page)
    } catch (error: any) {
      console.error('Failed to load transactions:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }

  const loadMoreTransactions = async () => {
    if (!transactionsPagination?.hasNext || isLoadingMore || isLoading) return
    
    try {
      const nextPage = currentPage + 1
      await loadTransactions(nextPage, true)
    } catch (error: any) {
      // Error is already logged in loadTransactions
      // Stop infinite scroll if there's an error
      console.error('Failed to load more transactions:', error)
    }
  }

  const loadStats = async () => {
    try {
      await fetchTransactionStats(startDate || undefined, endDate || undefined)
    } catch (error: any) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleApplyFilters = () => {
    setCurrentPage(1)
    clearTransactions()
    loadTransactions(1, false)
    loadStats()
  }

  const handleClearFilters = () => {
    setSelectedType('all')
    setSelectedStatus('all')
    setSelectedNetwork('all')
    setStartDate('')
    setEndDate('')
    setMinAmount('')
    setMaxAmount('')
    setSearchTerm('')
    setCurrentPage(1)
    clearTransactions()
  }

  const handleViewTransaction = async (transaction: any) => {
    setIsLoadingDetails(true)
    setShowTransactionDetails(true)
    
    try {
      // Fetch full transaction details by ID
      const response = await getTransactionById(transaction.id || transaction._id)
      if (response.success && response.data) {
        setSelectedTransaction(response.data)
      } else {
        // Fallback to the transaction from the list
        setSelectedTransaction(transaction)
      }
    } catch (error: any) {
      console.error('Failed to fetch transaction details:', error)
      // Fallback to the transaction from the list
      setSelectedTransaction(transaction)
    } finally {
      setIsLoadingDetails(false)
    }
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    toast.success('Transactions exported successfully!')
  }

  // Filter transactions by search term (client-side filtering for search)
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'successful':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-500 bg-gray-100 border-gray-200'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'airtime':
        return <Smartphone className="w-4 h-4" />
      case 'data':
        return <Wifi className="w-4 h-4" />
      case 'funding':
        return <CreditCard className="w-4 h-4" />
      case 'debit':
        return <CreditCard className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  // Get stats from API or calculate from transactions
  const stats = transactionStats?.data ? {
    total: transactionStats.data.overview?.totalTransactions || transactions.length,
    successful: transactionStats.data.breakdown?.byStatus?.find((s: any) => s._id === 'completed')?.count || 
      transactions.filter(t => t.status === 'completed' || t.status === 'successful').length,
    pending: transactionStats.data.breakdown?.byStatus?.find((s: any) => s._id === 'pending')?.count || 
      transactions.filter(t => t.status === 'pending').length,
    failed: transactionStats.data.breakdown?.byStatus?.find((s: any) => s._id === 'failed')?.count || 
      transactions.filter(t => t.status === 'failed').length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
    totalProfit: transactionStats.data.overview?.totalProfit || 0,
    totalWalletFunding: transactionStats.data.overview?.totalWalletFunding || 0,
  } : {
    total: transactions.length,
    successful: transactions.filter(t => t.status === 'completed' || t.status === 'successful').length,
    pending: transactions.filter(t => t.status === 'pending').length,
    failed: transactions.filter(t => t.status === 'failed').length,
    totalAmount: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
    totalProfit: 0,
    totalWalletFunding: 0,
  }

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
            <h1 className="text-3xl font-bold text-gray-900">Transactions Panel</h1>
            <p className="text-gray-600 mt-2">
              Monitor and manage all platform transactions
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.successful}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Profit</p>
                <p className="text-2xl font-bold text-primary">{formatAmount(stats.totalProfit)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Wallet Funding</p>
                <p className="text-2xl font-bold text-blue-600">{formatAmount(stats.totalWalletFunding)}</p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <Input
                  placeholder="Search transactions by description, reference, user, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                />
              </div>

              {/* Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {(selectedType !== 'all' || selectedStatus !== 'all' || selectedNetwork !== 'all' || startDate || endDate || minAmount || maxAmount) && (
                  <span className="ml-2 bg-primary text-white rounded-full px-2 py-0.5 text-xs">
                    Active
                  </span>
                )}
              </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Type Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Transaction Type</label>
                    <div className="flex flex-wrap gap-2">
                      {typeOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedType(option.value)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            selectedType === option.value
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-primary/50'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {statusOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedStatus(option.value)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            selectedStatus === option.value
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-primary/50'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Network Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Network</label>
                    <div className="flex flex-wrap gap-2">
                      {networkOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedNetwork(option.value)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            selectedNetwork === option.value
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-600 border-gray-300 hover:border-primary/50'
                          }`}
                        >
                          {option.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Start Date</label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">End Date</label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

                  {/* Amount Range */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Min Amount (₦)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Max Amount (₦)</label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-2 pt-2">
                  <Button onClick={handleApplyFilters} className="flex-1">
                    Apply Filters
                  </Button>
                  <Button onClick={handleClearFilters} variant="outline" className="flex-1">
                    Clear All
                  </Button>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>
              {isLoading ? 'Loading...' : `${filteredTransactions.length} transactions found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction._id || transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-full">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.description}</div>
                        <div className="text-sm text-gray-500">
                          {transaction.userName && `${transaction.userName} • `}
                          {transaction.network && `${transaction.network} • `}
                          {transaction.phoneNumber && `${transaction.phoneNumber} • `}
                          {formatDate(transaction.createdAt)}
                        </div>
                        {transaction.profit && transaction.profit > 0 && (
                          <div className="text-xs text-green-600 mt-1">
                            Profit: {formatAmount(transaction.profit)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">
                          {transaction.type === 'funding' ? '+' : '-'}{formatAmount(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.type === 'funding' ? 'Credit' : 'Debit'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewTransaction(transaction)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No transactions have been recorded yet'}
                </p>
              </div>
            )}

            {/* Infinite Scroll Loader */}
            {isLoadingMore && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span className="ml-3 text-gray-600">Loading more transactions...</span>
              </div>
            )}

            {/* End of List Indicator */}
            {!isLoading && !isLoadingMore && transactions.length > 0 && !transactionsPagination?.hasNext && (
              <div className="text-center py-6 text-gray-500 text-sm">
                All transactions loaded ({transactions.length} of {transactionsPagination?.total || transactions.length})
              </div>
            )}

            {/* Observer Target for Infinite Scroll */}
            {transactionsPagination?.hasNext && (
              <div ref={setObserverTarget} className="h-10" />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Details Modal */}
      {showTransactionDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => {
            setShowTransactionDetails(false)
            setSelectedTransaction(null)
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Transaction Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowTransactionDetails(false)
                  setSelectedTransaction(null)
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {isLoadingDetails ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading transaction details...</p>
              </div>
            ) : selectedTransaction ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-full">
                    {getTransactionIcon(selectedTransaction.type)}
                  </div>
                  <div>
                    <h4 className="font-medium">{selectedTransaction.description}</h4>
                    <p className="text-sm text-gray-600 capitalize">{selectedTransaction.type.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-sm">{selectedTransaction.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reference:</span>
                    <span className="font-medium text-sm">{selectedTransaction.reference}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-primary">
                      {formatAmount(selectedTransaction.amount)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedTransaction.status)}`}>
                      {selectedTransaction.status}
                    </span>
                  </div>
                  
                  {selectedTransaction.profit && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Profit:</span>
                      <span className="font-medium text-green-600">
                        {formatAmount(selectedTransaction.profit)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{formatDate(selectedTransaction.createdAt)}</span>
                  </div>
                  
                  {selectedTransaction.data?.networkName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Network:</span>
                      <span className="font-medium">{selectedTransaction.data.networkName}</span>
                    </div>
                  )}
                  
                  {selectedTransaction.data?.phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{selectedTransaction.data.phoneNumber}</span>
                    </div>
                  )}
                  
                  {selectedTransaction.data?.planName && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{selectedTransaction.data.planName}</span>
                    </div>
                  )}
                  
                  {selectedTransaction.user && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User:</span>
                        <span className="font-medium">
                          {selectedTransaction.user.name || `${selectedTransaction.user.firstName || ''} ${selectedTransaction.user.lastName || ''}`.trim()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">User Email:</span>
                        <span className="font-medium text-sm">{selectedTransaction.user.email}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-600">User Phone:</span>
                        <span className="font-medium">{selectedTransaction.user.phone}</span>
                      </div>
                    </>
                  )}
                  
                  {selectedTransaction.otobillRef && (
                    <div className="flex justify-between col-span-2">
                      <span className="text-gray-600">Otobill Ref:</span>
                      <span className="font-medium text-sm">{selectedTransaction.otobillRef}</span>
                    </div>
                  )}
                  
                  {selectedTransaction.metadata && (
                    <div className="col-span-2 mt-4 pt-4 border-t">
                      <h5 className="font-medium mb-2">Metadata</h5>
                      <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                        {JSON.stringify(selectedTransaction.metadata, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowTransactionDetails(false)
                      setSelectedTransaction(null)
                    }}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Transaction details not available</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default TransactionsPanel
