import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Copy, Banknote, Check, Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useUserStore } from '../../store/userStore'
import { getUserVirtualAccounts, type VirtualAccount } from '../../features/virtual-accounts/api'
import { logoutCustomer } from '../../services/userApi'
import toast from 'react-hot-toast'

const FundWallet: React.FC = () => {
  const { walletBalance, fetchWalletBalance } = useUserStore()
  
  const [copied, setCopied] = useState<string | null>(null)
  const [virtualAccounts, setVirtualAccounts] = useState<VirtualAccount[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)

  useEffect(() => {
    fetchVirtualAccounts()
    fetchWalletBalance()
  }, [fetchWalletBalance])

  const fetchVirtualAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const response = await getUserVirtualAccounts()
      if (response.success) {
        setVirtualAccounts(response.data)
      }
    } catch (error) {
      // Handle 401 errors silently - don't show error to user
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('Unauthorized'))) {
        logoutCustomer()
        return
      }
      console.error('Error fetching virtual accounts:', error)
    } finally {
      setLoadingAccounts(false)
    }
  }

  const handleCopyAccount = (accountNumber: string, accountId: string) => {
    navigator.clipboard.writeText(accountNumber)
    setCopied(accountId)
    toast.success('Account number copied!')
    setTimeout(() => setCopied(null), 2000)
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Fund Wallet</h1>
        <p className="text-gray-600 mt-2">
          Add money to your wallet using your virtual accounts
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Virtual Accounts</CardTitle>
              <CardDescription>
                Transfer to any of your virtual accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Loading State */}
              {loadingAccounts && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-gray-600">Loading virtual accounts...</span>
                </div>
              )}

              {/* Virtual Accounts */}
              {!loadingAccounts && virtualAccounts.length > 0 ? (
                virtualAccounts.map((account) => (
                  <div key={account._id} className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium text-blue-900">{account.bankName}</div>
                      <button
                        onClick={() => handleCopyAccount(account.accountNumber, account._id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        {copied === account._id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        <span className="text-sm">{copied === account._id ? 'Copied!' : 'Copy'}</span>
                      </button>
                    </div>
                    <div className="text-2xl font-mono font-bold text-blue-900 mb-1">
                      {account.accountNumber}
                    </div>
                    <div className="text-sm text-blue-700">
                      {account.accountName}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        account.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {account.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        account.isKYCVerified 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {account.isKYCVerified ? 'KYC Verified' : 'KYC Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : !loadingAccounts && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Banknote className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Virtual Accounts</h3>
                  <p className="text-gray-500 mb-4">You need to create a virtual account to fund your wallet.</p>
                  <Button 
                    onClick={() => window.location.href = '/dashboard'}
                    size="sm"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}

              {/* Current Balance */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-900 mb-2">Current Balance (₦)</div>
                <div className="text-2xl font-bold text-primary">
                  {formatAmount(walletBalance)}
                </div>
                <div className="text-sm text-gray-600">
                  Available for transactions
                </div>
              </div>


            </CardContent>
          </Card>
        </motion.div>
      </div>


    </div>
  )
}

export default FundWallet 