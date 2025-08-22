import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Activity, Filter, Search, Eye, Calendar, 
  RefreshCw, Download, ChevronLeft, ChevronRight, 
  User, Phone, CheckCircle, XCircle, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useAdminStore } from '../../store/adminStore'
import { OtoBillTransaction } from '../../types'
import toast from 'react-hot-toast'

interface FilterOption {
  id: string
  name: string
  value: string
}

const typeOptions: FilterOption[] = [
  { id: 'all', name: 'All Types', value: 'all' },
  { id: 'data', name: 'Data', value: 'data' },
  { id: 'airtime', name: 'Airtime', value: 'airtime' },
]

const statusOptions: FilterOption[] = [
  { id: 'all', name: 'All Status', value: 'all' },
  { id: 'successful', name: 'Successful', value: 'successful' },
  { id: 'pending', name: 'Pending', value: 'pending' },
  { id: 'failed', name: 'Failed', value: 'failed' },
]

const OtoBillTransactions: React.FC = () => {
  const { 
    otobillTransactions, 
    otobillTransactionsPagination,
    fetchOtoBillTransactions,
    fetchOtoBillTransaction
  } = useAdminStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<OtoBillTransaction | null>(null)
  const [showTransactionDetails, setShowTransactionDetails] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    loadTransactions()
  }, [currentPage, selectedType, selectedStatus, dateRange])

  const loadTransactions = async () => {
    setIsLoading(true)
    try {
      const filters: any = {}
      
      if (selectedType !== 'all') {
        filters.transactionType = selectedType
      }
      if (selectedStatus !== 'all') {
        filters.status = selectedStatus
      }
      if (dateRange.startDate) {
        filters.startDate = dateRange.startDate
      }
      if (dateRange.endDate) {
        filters.endDate = dateRange.endDate
      }
      
      await fetchOtoBillTransactions(currentPage, 20, filters)
    } catch (error: any) {
      console.error('Failed to load transactions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredTransactions = otobillTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId.phoneNumber.includes(searchTerm) ||
      (transaction.dataPhoneNumber && transaction.dataPhoneNumber.includes(searchTerm)) ||
      (transaction.airtimePhoneNumber && transaction.airtimePhoneNumber.includes(searchTerm)) ||
      transaction.topupmateRef.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <AlertCircle className="w-4 h-4" />
      case 'failed':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'data':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'airtime':
        return 'text-purple-600 bg-purple-50 border-purple-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
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

  const handleTransactionClick = async (transaction: OtoBillTransaction) => {
    try {
      const detailedTransaction = await fetchOtoBillTransaction(transaction._id)
      if (detailedTransaction) {
        setSelectedTransaction(detailedTransaction)
        setShowTransactionDetails(true)
      }
    } catch (error: any) {
      console.error('Failed to fetch transaction details:', error)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedStatus('all')
    setDateRange({ startDate: '', endDate: '' })
    setCurrentPage(1)
  }

  const exportTransactions = () => {
    toast.success('Export functionality coming soon!')
  }

  if (isLoading && otobillTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading transactions...</p>
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
            <Activity className="w-8 h-8 text-primary" />
            OtoBill Transactions
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and manage all OtoBill transactions
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={loadTransactions} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={exportTransactions} size="sm">
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Search
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions, users, phone numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                  {/* Transaction Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Transaction Type
                    </label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {typeOptions.map(option => (
                        <option key={option.id} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {statusOptions.map(option => (
                        <option key={option.id} value={option.value}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

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
                </motion.div>
              )}

              {/* Clear Filters */}
              {(selectedType !== 'all' || selectedStatus !== 'all' || dateRange.startDate || dateRange.endDate) && (
                <div className="flex justify-end">
                  <Button onClick={clearFilters} variant="ghost" size="sm">
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Transactions List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transactions ({otobillTransactionsPagination?.total || 0})</span>
              {isLoading && <RefreshCw className="w-4 h-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No transactions found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <motion.div
                    key={transaction._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(transaction.transactionType)}`}>
                              {transaction.transactionType.toUpperCase()}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(transaction.status)}`}>
                              {getStatusIcon(transaction.status)}
                              <span className="ml-1">{transaction.status}</span>
                            </span>
                          </div>
                          <p className="font-medium text-gray-900">{transaction.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {transaction.userId.fullName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {transaction.dataPhoneNumber || transaction.airtimePhoneNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(transaction.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{transaction.formattedAmount}</p>
                          {transaction.profitMargin !== null && transaction.profitMargin !== undefined && (
                            <p className={`text-sm ${transaction.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.formattedProfitMargin}
                            </p>
                          )}
                        </div>
                        <Eye className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {otobillTransactionsPagination && otobillTransactionsPagination.pages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700">
                  Showing page {otobillTransactionsPagination.page} of {otobillTransactionsPagination.pages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!otobillTransactionsPagination.hasPrev}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!otobillTransactionsPagination.hasNext}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Transaction Details Modal */}
      {showTransactionDetails && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Transaction Details</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTransactionDetails(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="text-sm text-gray-900">{selectedTransaction._id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reference</label>
                  <p className="text-sm text-gray-900">{selectedTransaction.topupmateRef}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(selectedTransaction.transactionType)}`}>
                    {selectedTransaction.transactionType.toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedTransaction.status)}`}>
                    {getStatusIcon(selectedTransaction.status)}
                    <span className="ml-1">{selectedTransaction.status}</span>
                  </span>
                </div>
              </div>

              {/* User Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Information</label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm"><strong>Name:</strong> {selectedTransaction.userId.fullName}</p>
                  <p className="text-sm"><strong>Email:</strong> {selectedTransaction.userId.email}</p>
                  <p className="text-sm"><strong>Phone:</strong> {selectedTransaction.userId.phoneNumber}</p>
                  <p className="text-sm"><strong>Status:</strong> {selectedTransaction.userId.accountStatus}</p>
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Transaction Details</label>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p className="text-sm"><strong>Amount:</strong> {selectedTransaction.formattedAmount}</p>
                  {selectedTransaction.originalAmount && (
                    <p className="text-sm"><strong>Original Amount:</strong> {selectedTransaction.formattedOriginalAmount}</p>
                  )}
                  {selectedTransaction.profitMargin !== null && (
                    <p className="text-sm"><strong>Profit Margin:</strong> {selectedTransaction.formattedProfitMargin}</p>
                  )}
                  <p className="text-sm"><strong>Description:</strong> {selectedTransaction.description}</p>
                  <p className="text-sm"><strong>Duration:</strong> {selectedTransaction.formattedDuration}</p>
                </div>
              </div>

              {/* Network Specific Info */}
              {selectedTransaction.transactionType === 'data' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Plan Details</label>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Network:</strong> {selectedTransaction.dataNetworkName}</p>
                    <p className="text-sm"><strong>Plan:</strong> {selectedTransaction.dataPlanName}</p>
                    <p className="text-sm"><strong>Phone Number:</strong> {selectedTransaction.dataPhoneNumber}</p>
                    <p className="text-sm"><strong>Plan Type:</strong> {selectedTransaction.dataPlanType}</p>
                    <p className="text-sm"><strong>Validity:</strong> {selectedTransaction.dataValidityDays} days</p>
                  </div>
                </div>
              )}

              {selectedTransaction.transactionType === 'airtime' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Airtime Details</label>
                  <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Network:</strong> {selectedTransaction.airtimeNetworkName}</p>
                    <p className="text-sm"><strong>Phone Number:</strong> {selectedTransaction.airtimePhoneNumber}</p>
                    <p className="text-sm"><strong>Amount:</strong> ₦{selectedTransaction.airtimeAmount}</p>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timestamps</label>
                <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                  <p className="text-sm"><strong>Created:</strong> {formatDate(selectedTransaction.createdAt)}</p>
                  <p className="text-sm"><strong>Updated:</strong> {formatDate(selectedTransaction.updatedAt)}</p>
                  {selectedTransaction.processedAt && (
                    <p className="text-sm"><strong>Processed:</strong> {formatDate(selectedTransaction.processedAt)}</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default OtoBillTransactions
