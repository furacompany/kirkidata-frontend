import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Smartphone, CreditCard, Wallet, CheckCircle,
  ChevronDown, Phone, Banknote, Shield
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import PinVerificationModal from '../../components/ui/PinVerificationModal'
import PinResetModal from '../../components/ui/PinResetModal'

interface Network {
  id: string
  name: string
  logo: string
  color: string
}

interface AmountOption {
  value: number
  label: string
  bonus?: string
}

const networks: Network[] = [
  { id: 'mtn', name: 'MTN', logo: '🟡', color: 'bg-yellow-500' },
  { id: 'airtel', name: 'Airtel', logo: '🔴', color: 'bg-red-500' },
  { id: 'glo', name: 'Glo', logo: '🟢', color: 'bg-green-500' },
  { id: '9mobile', name: '9mobile', logo: '🟢', color: 'bg-green-600' },
]

const amountOptions: AmountOption[] = [
  { value: 50, label: '₦50' },
  { value: 100, label: '₦100' },
  { value: 200, label: '₦200' },
  { value: 500, label: '₦500' },
  { value: 1000, label: '₦1,000' },
  { value: 2000, label: '₦2,000' },
]

const BuyAirtime: React.FC = () => {
  const { walletBalance, updateWalletBalance, addTransaction } = useUserStore()
  const { user } = useAuthStore()
  
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(100)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [showPinReset, setShowPinReset] = useState(false)

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    if (value) {
      setSelectedAmount(0)
    }
  }

  const getFinalAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount
  }

  const canProceed = () => {
    return selectedNetwork && getFinalAmount() > 0 && phoneNumber.length >= 11 && walletBalance >= getFinalAmount()
  }

  const handlePurchase = () => {
    if (!canProceed()) return
    
    // Show PIN verification modal
    setShowPinVerification(true)
  }

  const completePurchase = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const amount = getFinalAmount()
    
    // Update wallet balance
    updateWalletBalance(walletBalance - amount)
    
    // Add transaction
    addTransaction({
      userId: user?.id || '',
      type: 'airtime',
      amount: amount,
      description: `${selectedNetwork?.name} Airtime - ${phoneNumber}`,
      network: selectedNetwork?.name || '',
      status: 'successful',
      phoneNumber: phoneNumber,
    })

    toast.success('Airtime purchased successfully!')
    setShowConfirmation(false)
    setShowPinVerification(false)
    
    // Reset form
    setSelectedNetwork(null)
    setSelectedAmount(100)
    setCustomAmount('')
    setPhoneNumber('')
    
    setIsLoading(false)
  }

  const handlePinSuccess = () => {
    completePurchase()
  }

  const handleForgotPin = () => {
    setShowPinVerification(false)
    setShowPinReset(true)
  }

  const handlePinResetSuccess = () => {
    setShowPinReset(false)
    toast.success('You can now use your new PIN for transactions!')
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
        className="hidden md:block"
      >
        <h1 className="text-3xl font-bold text-gray-900">Buy Airtime</h1>
        <p className="text-gray-600 mt-2">
          Purchase airtime for any network instantly
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Purchase Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="-mt-8 md:mt-0"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary" />
                Purchase Airtime
              </CardTitle>
              <CardDescription>
                Select network, amount, and phone number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Network Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Network</label>
                <div className="relative">
                  <button
                    onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {selectedNetwork ? (
                        <>
                          <span className="text-2xl">{selectedNetwork.logo}</span>
                          <span className="font-medium">{selectedNetwork.name}</span>
                        </>
                      ) : (
                        <span className="text-gray-500">Choose a network</span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showNetworkDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showNetworkDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                    >
                      {networks.map((network) => (
                        <button
                          key={network.id}
                          onClick={() => {
                            setSelectedNetwork(network)
                            setShowNetworkDropdown(false)
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-2xl">{network.logo}</span>
                          <span className="font-medium">{network.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Amount (₦)</label>
                <div className="grid grid-cols-3 gap-2">
                  {amountOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAmountSelect(option.value)}
                      className={`p-2 md:p-3 rounded-lg border transition-colors ${
                        selectedAmount === option.value && !customAmount
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-300 hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-sm md:text-base">{option.label}</div>
                      {option.bonus && (
                        <div className="text-xs text-success">{option.bonus}</div>
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Custom Amount */}
                <div className="mt-4">
                  <Input
                                          label="Custom Amount (₦)"
                    type="number"
                                          placeholder="Enter custom amount (₦)"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    icon={<Banknote className="w-4 h-4" />}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  icon={<Phone className="w-4 h-4" />}
                />
              </div>

              {/* Purchase Button */}
              <Button
                onClick={() => setShowConfirmation(true)}
                disabled={!canProceed()}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Processing...' : `Buy Airtime - ${formatAmount(getFinalAmount())}`}
              </Button>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Payment Method</label>
                <div className="w-full">
                  <button
                    onClick={() => setPaymentMethod('wallet')}
                    className={`w-full p-3 rounded-lg border transition-colors ${
                      paymentMethod === 'wallet'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-gray-300 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4" />
                      <span className="font-medium">Wallet</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Balance: {formatAmount(walletBalance)}
                    </div>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                Review your airtime purchase details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedNetwork && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{selectedNetwork.logo}</span>
                    <div>
                      <div className="font-medium">{selectedNetwork.name}</div>
                      <div className="text-sm text-gray-500">Network</div>
                    </div>
                  </div>
                </div>
              )}

              {getFinalAmount() > 0 && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Amount</div>
                    <div className="text-sm text-gray-500">Airtime value</div>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {formatAmount(getFinalAmount())}
                  </div>
                </div>
              )}

              {phoneNumber && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">Phone Number</div>
                    <div className="text-sm text-gray-500">Recipient</div>
                  </div>
                  <div className="font-medium">{phoneNumber}</div>
                </div>
              )}

              {paymentMethod && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {paymentMethod === 'wallet' ? <Wallet className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                    <div>
                      <div className="font-medium capitalize">{paymentMethod}</div>
                      <div className="text-sm text-gray-500">Payment method</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <div className="font-medium text-blue-900">Secure Transaction</div>
                    <div className="text-sm text-blue-700">
                      Your payment is protected with bank-grade security. All transactions are encrypted and secure.
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
              <h3 className="text-xl font-bold mb-2">Confirm Purchase</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to purchase {formatAmount(getFinalAmount())} airtime for {phoneNumber}?
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="font-medium">{selectedNetwork?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount (₦):</span>
                  <span className="font-medium">{formatAmount(getFinalAmount())}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span className="font-medium">{phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <span className="font-medium capitalize">{paymentMethod}</span>
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
                  onClick={handlePurchase}
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Processing...' : 'Confirm Purchase'}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* PIN Verification Modal */}
      <PinVerificationModal
        isOpen={showPinVerification}
        onClose={() => setShowPinVerification(false)}
        onSuccess={handlePinSuccess}
        onForgotPin={handleForgotPin}
        title="Verify Purchase"
        description={`Enter your PIN to confirm ${formatAmount(getFinalAmount())} airtime purchase`}
      />

      {/* PIN Reset Modal */}
      <PinResetModal
        isOpen={showPinReset}
        onClose={() => setShowPinReset(false)}
        onSuccess={handlePinResetSuccess}
      />
    </div>
  )
}

export default BuyAirtime 