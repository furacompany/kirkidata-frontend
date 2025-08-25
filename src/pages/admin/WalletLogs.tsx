import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, Filter, CreditCard, Eye, Download, TrendingUp,
  CheckCircle, Clock, Banknote, Smartphone
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

const statusOptions: FilterOption[] = [
  { id: 'all', name: 'All Status', value: 'all' },
  { id: 'successful', name: 'Successful', value: 'successful' },
  { id: 'pending', name: 'Pending', value: 'pending' },
  { id: 'failed', name: 'Failed', value: 'failed' },
]

const methodOptions: FilterOption[] = [
  { id: 'all', name: 'All Methods', value: 'all' },
  { id: 'card', name: 'Card Payment', value: 'card' },
  { id: 'bank', name: 'Bank Transfer', value: 'bank' },
  { id: 'ussd', name: 'USSD Transfer', value: 'ussd' },
  { id: 'wallet', name: 'Wallet', value: 'wallet' },
]

const WalletLogs: React.FC = () => {
  const { walletLogs, fetchWalletLogs } = useAdminStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedMethod, setSelectedMethod] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [showLogDetails, setShowLogDetails] = useState(false)

  useEffect(() => {
    fetchWalletLogs()
  }, [fetchWalletLogs])

  // Use real wallet logs from the store
  const displayLogs = walletLogs

  const filteredLogs = displayLogs.filter(log => {
    const matchesSearch = (log.userName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (log.userEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (log.reference?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (log.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus
    const matchesMethod = selectedMethod === 'all' || log.paymentMethod === selectedMethod
    
    return matchesSearch && matchesStatus && matchesMethod
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

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return <CreditCard className="w-4 h-4" />
      case 'ussd':
        return <Smartphone className="w-4 h-4" />
      case 'bank':
        return <Banknote className="w-4 h-4" />
      default:
        return <Banknote className="w-4 h-4" />
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

  const handleViewLog = (log: any) => {
    setSelectedLog(log)
    setShowLogDetails(true)
  }

  const handleExport = () => {
    // Simulate CSV export
    toast.success('Wallet logs exported successfully!')
  }

  const getWalletStats = () => {
    const total = displayLogs.length
    const successful = displayLogs.filter(log => log.status === 'successful').length
    const pending = displayLogs.filter(log => log.status === 'pending').length
    const failed = displayLogs.filter(log => log.status === 'failed').length
    const totalAmount = displayLogs.reduce((sum, log) => sum + log.amount, 0)

    return { total, successful, pending, failed, totalAmount }
  }

  const stats = getWalletStats()

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
            <h1 className="text-3xl font-bold text-gray-900">Wallet Logs</h1>
            <p className="text-gray-600 mt-2">
              Monitor all wallet funding activities
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
                <p className="text-sm text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CreditCard className="w-8 h-8 text-primary" />
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
                  placeholder="Search logs by user, email, or reference..."
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

                  {/* Method Filter */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Payment Method</label>
                    <div className="flex flex-wrap gap-2">
                      {methodOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedMethod(option.value)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                            selectedMethod === option.value
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

      {/* Wallet Logs List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Wallet Funding Logs</CardTitle>
            <CardDescription>
              {filteredLogs.length} logs found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredLogs.length > 0 ? (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-full">
                        {getMethodIcon(log.paymentMethod)}
                      </div>
                      <div>
                        <div className="font-medium">{log.userName}</div>
                        <div className="text-sm text-gray-500">{log.userEmail}</div>
                        <div className="text-xs text-gray-400">
                          Ref: {log.reference} • {formatDate(log.createdAt)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-primary">
                          +{formatAmount(log.amount)}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {log.paymentMethod} payment
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(log.status)}`}>
                          {log.status}
                        </span>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewLog(log)}
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
                  <CreditCard className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No wallet logs found</h3>
                <p className="text-gray-500">
                  {searchTerm || selectedStatus !== 'all' || selectedMethod !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'No wallet funding activities have been recorded yet'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Log Details Modal */}
      {showLogDetails && selectedLog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLogDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Wallet Log Details</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLogDetails(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  {getMethodIcon(selectedLog.paymentMethod)}
                </div>
                <div>
                  <h4 className="font-medium">{selectedLog.userName}</h4>
                  <p className="text-sm text-gray-600">{selectedLog.userEmail}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Log ID:</span>
                  <span className="font-medium">{selectedLog.id}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount (₦):</span>
                  <span className="font-bold text-primary">+{formatAmount(selectedLog.amount)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(selectedLog.status)}`}>
                    {selectedLog.status}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{selectedLog.paymentMethod}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium">{selectedLog.reference}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formatDate(selectedLog.createdAt)}</span>
                </div>
                
                {selectedLog.bankName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank:</span>
                    <span className="font-medium">{selectedLog.bankName}</span>
                  </div>
                )}
                
                {selectedLog.accountNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account:</span>
                    <span className="font-medium">{selectedLog.accountNumber}</span>
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowLogDetails(false)}
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

export default WalletLogs 