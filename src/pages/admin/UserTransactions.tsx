import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAdminStore } from '../../store/adminStore'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, Filter, Search, 
  CheckCircle, XCircle, Clock, AlertTriangle
} from 'lucide-react'

const UserTransactions: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const navigate = useNavigate()
  const { getUserTransactions } = useAdminStore()
  
  const [userInfo, setUserInfo] = useState<any>(null)
  const [userTransactions, setUserTransactions] = useState<any[]>([])
  const [transactionsPagination, setTransactionsPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [transactionFilters, setTransactionFilters] = useState({
    type: '',
    status: '',
    networkName: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Load user transactions
  const loadUserTransactions = async (page: number = 1) => {
    if (!userId) return
    
    setIsLoadingTransactions(true)
    try {
      const filters: any = {}
      if (transactionFilters.type) filters.type = transactionFilters.type
      if (transactionFilters.status) filters.status = transactionFilters.status
      if (transactionFilters.networkName) filters.networkName = transactionFilters.networkName
      if (transactionFilters.startDate) filters.startDate = transactionFilters.startDate
      if (transactionFilters.endDate) filters.endDate = transactionFilters.endDate
      if (transactionFilters.minAmount) filters.minAmount = parseFloat(transactionFilters.minAmount)
      if (transactionFilters.maxAmount) filters.maxAmount = parseFloat(transactionFilters.maxAmount)

      const response = await getUserTransactions(userId, page, 50, filters)
      
      if (response.success && response.data) {
        setUserTransactions(response.data.transactions)
        setTransactionsPagination(response.data.pagination)
        setUserInfo(response.data.user)
      }
    } catch (error: any) {
      toast.error('Failed to load user transactions')
    } finally {
      setIsLoadingTransactions(false)
    }
  }

  // Handle transaction filter change
  const handleFilterChange = (key: string, value: string) => {
    setTransactionFilters(prev => ({ ...prev, [key]: value }))
  }

  // Apply filters
  const applyFilters = async () => {
    await loadUserTransactions(1)
  }

  // Clear filters
  const clearFilters = () => {
    setTransactionFilters({
      type: '',
      status: '',
      networkName: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    })
  }

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    loadUserTransactions(newPage)
  }

  // Load transactions on component mount
  useEffect(() => {
    if (userId) {
      loadUserTransactions(1)
    }
  }, [userId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-gray-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!userId) {
    return (
      <div className="p-6">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid User ID</h2>
          <p className="text-gray-600 mb-4">The user ID is missing or invalid.</p>
          <Button onClick={() => navigate('/admin/users')}>
            Back to Users
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate('/admin/users')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Transactions</h1>
            {userInfo && (
              <p className="text-sm text-gray-600">
                {userInfo.firstName} {userInfo.lastName} • {userInfo.email} • {userInfo.phone}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      {userInfo && (
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">User Information</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Name:</span> {userInfo.firstName} {userInfo.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {userInfo.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Phone:</span> {userInfo.phone}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Wallet:</span> ₦{userInfo.wallet?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
              <div className="mt-2 space-y-1">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${userInfo.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-sm font-medium ${userInfo.isActive ? 'text-green-700' : 'text-red-700'}`}>
                    {userInfo.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${userInfo.isEmailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className={`text-sm font-medium ${userInfo.isEmailVerified ? 'text-green-700' : 'text-yellow-700'}`}>
                    {userInfo.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Transaction Summary</h3>
              <div className="mt-2 space-y-1">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Transactions:</span> {transactionsPagination.total}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Current Page:</span> {transactionsPagination.page} of {transactionsPagination.totalPages}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              <div className="mt-2 space-y-2">
                <Button
                  onClick={() => navigate(`/admin/users/${userId}/edit`)}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Edit User
                </Button>
                <Button
                  onClick={() => navigate('/admin/users')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  Back to Users
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Filters Section */}
      {showFilters && (
        <Card className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Transactions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={transactionFilters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Types</option>
                  <option value="airtime">Airtime</option>
                  <option value="data">Data</option>
                  <option value="funding">Funding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={transactionFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
                <select
                  value={transactionFilters.networkName}
                  onChange={(e) => handleFilterChange('networkName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Networks</option>
                  <option value="MTN">MTN</option>
                  <option value="Airtel">Airtel</option>
                  <option value="Glo">Glo</option>
                  <option value="9mobile">9mobile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <Input
                  type="date"
                  value={transactionFilters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <Input
                  type="date"
                  value={transactionFilters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount Range</label>
                <div className="flex space-x-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={transactionFilters.minAmount}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Max"
                    value={transactionFilters.maxAmount}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={clearFilters}
                variant="outline"
              >
                Clear Filters
              </Button>
              <Button
                onClick={applyFilters}
                className="flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Transactions List */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            <p className="text-sm text-gray-600">
              {transactionsPagination.total} total transactions
            </p>
          </div>

          {isLoadingTransactions ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : userTransactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No transactions found for this user.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userTransactions.map((transaction) => (
                <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <h4 className="font-medium text-gray-900">{transaction.description}</h4>
                          <p className="text-sm text-gray-600">
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} • 
                            {transaction.reference}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₦{transaction.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                      {transaction.data && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-md">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Network:</span> {transaction.data.networkName}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Phone:</span> {transaction.data.phoneNumber}
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Plan:</span> {transaction.data.planName}
                            </div>
                          </div>
                        </div>
                      )}

                  {transaction.funding && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Payer:</span> {transaction.funding.payerName}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Account:</span> {transaction.funding.payerAccountNumber}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Bank:</span> {transaction.funding.bankName}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <span>Profit: ₦{transaction.profit.toLocaleString()}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                    <span>{formatDate(transaction.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Pagination */}
      {userTransactions.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page {transactionsPagination.page} of {transactionsPagination.totalPages} 
              ({transactionsPagination.total} total transactions)
            </p>
            <div className="flex space-x-2">
              <Button
                onClick={() => handlePageChange(transactionsPagination.page - 1)}
                disabled={!transactionsPagination.hasPrev}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <Button
                onClick={() => handlePageChange(transactionsPagination.page + 1)}
                disabled={!transactionsPagination.hasNext}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default UserTransactions
