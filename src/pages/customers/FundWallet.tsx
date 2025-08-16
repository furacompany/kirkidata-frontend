import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, Wallet, CheckCircle, Copy, Banknote, Smartphone, Check, AlertCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

interface PaymentMethod {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  color: string
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    name: 'Debit/Credit Card',
    icon: <CreditCard className="w-5 h-5" />,
    description: 'Pay with your card',
    color: 'text-blue-600'
  },
  {
    id: 'ussd',
    name: 'USSD Transfer',
    icon: <Smartphone className="w-5 h-5" />,
    description: 'Use USSD code',
    color: 'text-green-600'
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: <Banknote className="w-5 h-5" />,
    description: 'Transfer to account',
    color: 'text-purple-600'
  }
]

const FundWallet: React.FC = () => {
  const { walletBalance, updateWalletBalance, addTransaction } = useUserStore()
  const { user } = useAuthStore()
  
  const [amount, setAmount] = useState<string>('')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  // const [showVirtualAccount, setShowVirtualAccount] = useState(false) // Not currently used
  const [copied, setCopied] = useState(false)

  const virtualAccountNumber = '1234567890'
  const bankName = 'Kirkidata Bank'
  const accountName = 'Kirkidata Recharge Platform'

  const canProceed = () => {
    return amount && parseFloat(amount) > 0 && selectedMethod
  }

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(virtualAccountNumber)
    setCopied(true)
    toast.success('Account number copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleFundWallet = async () => {
    if (!canProceed()) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const fundAmount = parseFloat(amount)
    
    // Update wallet balance
    updateWalletBalance(walletBalance + fundAmount)
    
    // Add transaction
    addTransaction({
      userId: user?.id || '',
      type: 'wallet_funding',
      amount: fundAmount,
      description: `Wallet Funding - ${selectedMethod?.name}`,
      network: '',
      status: 'successful',
      phoneNumber: '',
    })

    toast.success('Wallet funded successfully!')
    setShowConfirmation(false)
    
    // Reset form
    setAmount('')
    setSelectedMethod(null)
    
    setIsLoading(false)
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000]

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
          Add money to your wallet using various payment methods
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funding Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-yellow" />
                Fund Your Wallet
              </CardTitle>
              <CardDescription>
                Choose amount and payment method
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Amount to Fund (₦)</label>
                <Input
                  type="number"
                  placeholder="Enter amount (₦)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  icon={<Banknote className="w-4 h-4" />}
                />
                
                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className="p-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      {formatAmount(quickAmount)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method)}
                      className={`w-full p-4 rounded-lg border transition-colors ${
                        selectedMethod?.id === method.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-300 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={method.color}>{method.icon}</div>
                        <div className="text-left">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-500">{method.description}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fund Button */}
              <Button
                onClick={() => setShowConfirmation(true)}
                disabled={!canProceed()}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Processing...' : `Fund Wallet - ${amount ? formatAmount(parseFloat(amount)) : '₦0'}`}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>
                Account information for transfers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Virtual Account */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-blue-900">Virtual Account Number</div>
                  <button
                    onClick={handleCopyAccount}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="text-2xl font-mono font-bold text-blue-900 mb-1">
                  {virtualAccountNumber}
                </div>
                <div className="text-sm text-blue-700">
                  {bankName} • {accountName}
                </div>
              </div>

              {/* USSD Code */}
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="font-medium text-green-900 mb-2">USSD Code</div>
                <div className="text-2xl font-mono font-bold text-green-900 mb-1">
                  *123*{virtualAccountNumber}#
                </div>
                <div className="text-sm text-green-700">
                  Dial this code on your phone
                </div>
              </div>

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

              {/* Security Notice */}
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-yellow-900">Important Notice</div>
                    <div className="text-sm text-yellow-700">
                      Please include your phone number as payment reference for faster processing.
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowConfirmation(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Confirm Funding</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to fund your wallet with {formatAmount(parseFloat(amount))}?
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Amount (₦):</span>
                  <span className="font-medium">{formatAmount(parseFloat(amount))}</span>
                </div>
                <div className="flex justify-between">
                  <span>Method:</span>
                  <span className="font-medium">{selectedMethod?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Balance (₦):</span>
                  <span className="font-medium">{formatAmount(walletBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>New Balance (₦):</span>
                  <span className="font-medium">{formatAmount(walletBalance + parseFloat(amount))}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleFundWallet}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Confirm Funding'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default FundWallet 