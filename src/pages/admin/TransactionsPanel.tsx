import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Activity, Edit, Eye,
  CheckCircle, Clock, Smartphone, Wifi, CreditCard,
  TrendingUp, Download
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
  { id: 'wallet_funding', name: 'Wallet Funding', value: 'wallet_funding' },
]

const statusOptions: FilterOption[] = [
  { id: 'all', name: 'All Status', value: 'all' },
  { id: 'successful', name: 'Successful', value: 'successful' },
  { id: 'pending', name: 'Pending', value: 'pending' },
  { id: 'failed', name: 'Failed', value: 'failed' },
]

const TransactionsPanel: React.FC = () => {
  const { transactions, fetchTransactions, updateTransactionStatus } = useAdminStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.network?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         transaction.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-success bg-success/10 border-success/20'
      case 'pending':
        return 'text-yellow bg-yellow/10 border-yellow/20'
      case 'failed':
        return 'text-danger bg-danger/10 border-danger/20'
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
      case 'wallet_funding':
        return <CreditCard className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
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

  const handleStatusToggle = async (transactionId: string, currentStatus: string) => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    let newStatus = currentStatus
    if (currentStatus === 'pending') {
      newStatus = 'successful'
    } else if (currentStatus === 'successful') {
      newStatus = 'failed'
    } else {
      newStatus = 'pending'
    }
    
    updateTransactionStatus(transactionId, newStatus as 'pending' | 'successful' | 'failed')
    toast.success(`Transaction status updated to ${newStatus}`)
    setIsLoading(false)
  }

  const handleViewTransaction = (transaction: any) => {
    setSelectedTransaction(transaction)
    setShowTransactionDetails(true)
  }

  const handleExport = () => {
    // Simulate CSV export
    toast.success('Transactions exported successfully!')
  }

  const getTransactionStats = () => {
    const total = transactions.length
    const successful = transactions.filter(t => t.status === 'successful').length
    const pending = transactions.filter(t => t.status === 'pending').length
    const failed = transactions.filter(t => t.status === 'failed').length
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)

    return { total, successful, pending, failed, totalAmount }
  }

  const stats = getTransactionStats()

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
                <p className="text-2xl font-bold text-success">{stats.successful}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-primary">{formatAmount(stats.totalAmount)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
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
                  placeholder="Search transactions..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              {filteredTransactions.length} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction.id}
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
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold">
                          {transaction.type === 'wallet_funding' ? '+' : '-'}{formatAmount(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.type === 'wallet_funding' ? 'Credit' : 'Debit'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewTransaction(transaction)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStatusToggle(transaction.id || '', transaction.status)}
                            disabled={isLoading}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
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
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowTransactionDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Transaction Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTransactionDetails(false)}
              >
                ×
              </Button>
            </div>
            
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
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{selectedTransaction.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount (₦):</span>
                  <span className="font-bold text-primary">
                    {selectedTransaction.type === 'wallet_funding' ? '+' : '-'}{formatAmount(selectedTransaction.amount)}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedTransaction.status)}`}>
                    {selectedTransaction.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(selectedTransaction.createdAt)}</span>
                </div>
                
                {selectedTransaction.network && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="font-medium">{selectedTransaction.network}</span>
                  </div>
                )}
                
                {selectedTransaction.phoneNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{selectedTransaction.phoneNumber}</span>
                  </div>
                )}
                
                {selectedTransaction.userName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">User:</span>
                    <span className="font-medium">{selectedTransaction.userName}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => handleStatusToggle(selectedTransaction.id, selectedTransaction.status)}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Toggle Status
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowTransactionDetails(false)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default TransactionsPanel 