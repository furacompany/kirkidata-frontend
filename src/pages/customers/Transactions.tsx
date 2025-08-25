import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, Download, Eye, Smartphone, Wifi, CreditCard,
  CheckCircle, Clock, TrendingUp
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useUserStore } from '../../store/userStore'
// import { useAuthStore } from '../../store/authStore' // Not currently used
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

interface FilterOption {
  id: string
  name: string
  value: string
}

const filterOptions: FilterOption[] = [
  { id: 'all', name: 'All', value: 'all' },
  { id: 'airtime', name: 'Airtime', value: 'airtime' },
  { id: 'data', name: 'Data', value: 'data' },
  { id: 'wallet_funding', name: 'Wallet Funding', value: 'wallet_funding' },
]

const statusOptions: FilterOption[] = [
  { id: 'all', name: 'All Status', value: 'all' },
  { id: 'successful', name: 'Successful', value: 'successful' },
  { id: 'completed', name: 'Completed', value: 'completed' },
  { id: 'pending', name: 'Pending', value: 'pending' },
  { id: 'failed', name: 'Failed', value: 'failed' },
]

const Transactions: React.FC = () => {
  const { transactions, fetchTransactions } = useUserStore()
  // const { user } = useAuthStore() // Not currently used
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (transaction.network?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         transaction.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedType === 'all' || transaction.type === selectedType
    const matchesStatus = selectedStatus === 'all' || transaction.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
  })

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
        return 'text-gray-500 bg-gray-200 border-gray/200'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'airtime':
        return <Smartphone className="w-4 h-4" />
      case 'data':
        return <Wifi className="w-4 h-4" />
      case 'wallet_funding':
      case 'funding':
        return <CreditCard className="w-4 h-4" />
      case 'wallet_withdrawal':
      case 'withdrawal':
        return <TrendingUp className="w-4 h-4" />
      default:
        return <TrendingUp className="w-4 h-4" />
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

  const getTransactionStats = () => {
    const total = transactions.length
    const successful = transactions.filter(t => t.status === 'successful' || t.status === 'completed').length
    const pending = transactions.filter(t => t.status === 'pending').length
    const failed = transactions.filter(t => t.status === 'failed').length

    return { total, successful, pending, failed }
  }



  const stats = getTransactionStats()

  const handleExport = () => {
    // Simulate CSV export
    toast.success('Transactions exported successfully!')
  }

  return (
    <div className="space-y-6">
             {/* Mobile Filters - Fixed on top */}
       <div className="sm:hidden sticky top-16 z-30 bg-white border-b border-gray-200 pb-4 pt-2">
         <div className="flex gap-3 px-4">
           {/* Transaction Type Filter */}
           <div className="flex-1">
             <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
             <select
               value={selectedType}
               onChange={(e) => setSelectedType(e.target.value)}
               className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
             >
               {filterOptions.map((option) => (
                 <option key={option.id} value={option.value}>
                   {option.name}
                 </option>
               ))}
             </select>
           </div>

           {/* Status Filter */}
           <div className="flex-1">
             <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
             <select
               value={selectedStatus}
               onChange={(e) => setSelectedStatus(e.target.value)}
               className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
             >
               {statusOptions.map((option) => (
                 <option key={option.id} value={option.value}>
                   {option.name}
                 </option>
               ))}
             </select>
           </div>
         </div>
       </div>

      {/* Desktop Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden sm:block"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-2">
              View and manage your transaction history
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </motion.div>

      {/* Desktop Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
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
      </motion.div>

      {/* Desktop Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden sm:block"
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
                      {filterOptions.map((option) => (
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
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Transaction History</CardTitle>
            <CardDescription className="text-sm">
              {filteredTransactions.length} transactions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-full flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base truncate">{transaction.description}</div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                          {transaction.network && `${transaction.network} • `}
                          {transaction.phoneNumber && `${transaction.phoneNumber} • `}
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                      <div className="text-right">
                        <div className="font-bold text-sm sm:text-base">
                          {transaction.type === 'wallet_funding' || transaction.type === 'funding' ? '+' : '-'}{formatAmount(transaction.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.type === 'wallet_funding' || transaction.type === 'funding' ? 'Credit' : 'Debit'}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                        
                        <Link to={`/receipt/${transaction._id}`}>
                          <Button variant="ghost" size="sm" className="p-1 sm:p-2">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Start by making your first transaction'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default Transactions 