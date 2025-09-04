import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Smartphone, CreditCard, Wallet, CheckCircle,
  ChevronDown, Phone, Banknote, Shield, Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { userApiService, AirtimePurchaseRequest } from '../../services/userApi'
import toast from 'react-hot-toast'
import PinVerificationModal from '../../components/ui/PinVerificationModal'
import PinResetModal from '../../components/ui/PinResetModal'
import SEO from '../../components/SEO'

interface NetworkOption {
  id: string
  name: string
  logo: string
  color: string
  isActive: boolean
}



const getNetworkLogo = (networkName: string): string => {
  switch (networkName.toUpperCase()) {
    case 'MTN':
      return '🟡'
    case 'AIRTEL':
      return '🔴'
    case 'GLO':
      return '🟢'
    case '9MOBILE':
      return '🟢'
    default:
      return '📱'
  }
}

const getNetworkColor = (networkName: string): string => {
  switch (networkName.toUpperCase()) {
    case 'MTN':
      return 'bg-yellow-500'
    case 'AIRTEL':
      return 'bg-red-500'
    case 'GLO':
      return 'bg-green-500'
    case '9MOBILE':
      return 'bg-green-600'
    default:
      return 'bg-gray-500'
  }
}

const BuyAirtime: React.FC = () => {
  const { walletBalance, updateWalletBalance, addTransaction } = useUserStore()
  const { user } = useAuthStore()
  
  // State for API data
  const [networks, setNetworks] = useState<NetworkOption[]>([])
  
  // State for selections
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(100)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [phoneNumberError, setPhoneNumberError] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet')
  
  // State for UI
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [showPinReset, setShowPinReset] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState<any>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  // Load networks on component mount
  useEffect(() => {
    loadNetworks()
  }, [])

  const loadNetworks = async () => {
    try {
      setIsLoadingNetworks(true)
      const response = await userApiService.getNetworks()
      
      if (response.success && response.data) {
        const networkOptions: NetworkOption[] = response.data
          .filter(network => network.isActive)
          .map(network => ({
            id: network.id,
            name: network.name,
            logo: getNetworkLogo(network.name),
            color: getNetworkColor(network.name),
            isActive: network.isActive
          }))
        
        // Rearrange networks: MTN first, then Airtel, Glo, 9mobile
        const sortedNetworks = networkOptions.sort((a, b) => {
          const order = { 'MTN': 1, 'AIRTEL': 2, 'GLO': 3, '9MOBILE': 4 }
          const aOrder = order[a.name.toUpperCase() as keyof typeof order] || 5
          const bOrder = order[b.name.toUpperCase() as keyof typeof order] || 5
          return aOrder - bOrder
        })
        
        setNetworks(sortedNetworks)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load networks')
    } finally {
      setIsLoadingNetworks(false)
    }
  }

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
    return selectedNetwork && getFinalAmount() > 0 && phoneNumber.length === 11 && !phoneNumberError
  }

  const handlePurchase = () => {
    if (!canProceed()) return
    
    // Validate phone number before proceeding
    if (phoneNumber.length !== 11) {
      setPhoneNumberError("Phone number must be exactly 11 digits")
      return
    }
    
    // Show PIN verification modal
    setShowPinVerification(true)
  }

  const completePurchase = async () => {
    if (!selectedNetwork) return

    setIsLoading(true)
    
    try {
      const purchaseData: AirtimePurchaseRequest = {
        networkName: selectedNetwork.name,
        phoneNumber: phoneNumber,
        amount: getFinalAmount()
      }

      // Make actual API call for airtime purchase
      const purchaseResponse = await userApiService.purchaseAirtime(purchaseData)
      
      if (purchaseResponse.success && purchaseResponse.data) {
        const airtimeData = purchaseResponse.data
        
        // Update wallet balance
        updateWalletBalance(walletBalance - airtimeData.totalCost)
        
        // Add transaction
        addTransaction({
          userId: user?.id || '',
          type: 'airtime',
          amount: airtimeData.totalCost,
          currency: 'NGN',
          status: airtimeData.status as 'pending' | 'successful' | 'failed' | 'completed',
          reference: airtimeData.reference,
          description: airtimeData.description,
          network: airtimeData.networkName,
          phoneNumber: airtimeData.phoneNumber,
          transactionId: airtimeData.transactionId,
          otobillRef: airtimeData.otobillRef
        })

        // Show success modal with purchase details
        setPurchaseSuccess(airtimeData)
        setShowConfirmation(false)
        setShowPinVerification(false)
      }
    } catch (error: any) {
      // Handle specific error cases from API
      if (error.message?.includes('Insufficient balance')) {
        toast.error(error.message)
      } else if (error.message?.includes('Amount must be at least')) {
        toast.error(error.message)
      } else if (error.message?.includes('400')) {
        // Handle 400 Bad Request errors
        toast.error(error.message || 'Invalid request. Please check your input.')
      } else {
        toast.error(error.message || 'Failed to purchase airtime')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyPin = async () => {
    setIsVerifying(true)
    try {
      await completePurchase()
      setIsVerifying(false)
      setShowPinVerification(false)
    } catch (error: any) {
      setIsVerifying(false)
      setShowPinVerification(false)
      // Error is already handled in completePurchase function
    }
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
      {/* SEO Component */}
      <SEO 
        title="Buy Airtime Online | Kirkidata - All Nigerian Networks"
        description="Buy airtime instantly for MTN, Airtel, Glo, and 9mobile networks in Nigeria. Fast, secure, and reliable airtime top-up with Kirkidata."
        keywords="buy airtime online, MTN airtime, Airtel airtime, Glo airtime, 9mobile airtime, Nigeria recharge, instant airtime top-up"
        canonicalUrl="https://kirkidata.com/buy-airtime"
        ogImage="https://kirkidata.com/logo.jpg"
      />
      
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
              {/* Phone Number - POSITION 1 */}
              <div className="space-y-2">
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter 11-digit phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                    if (value.length <= 11) {
                      setPhoneNumber(value);
                      setPhoneNumberError(''); // Clear error when user types
                    }
                  }}
                  maxLength={11}
                  error={phoneNumberError}
                  icon={<Phone className="w-4 h-4" />}
                />
                <p className="text-xs text-gray-500">Phone number must be exactly 11 digits</p>
              </div>

              {/* Network Selection - POSITION 2 */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Network</label>
                <div className="relative">
                  <button
                    onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                    disabled={isLoadingNetworks}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {isLoadingNetworks ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-gray-500">Loading networks...</span>
                        </>
                      ) : selectedNetwork ? (
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
                  
                  {showNetworkDropdown && !isLoadingNetworks && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                    >
                      {networks.length > 0 ? (
                        networks.map((network) => (
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
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500">
                          No networks available
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Amount Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Amount (₦)</label>
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 200, 500, 1000, 2000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-2 md:p-3 rounded-lg border transition-colors ${
                        selectedAmount === amount && !customAmount
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-gray-300 hover:border-primary/50'
                      }`}
                    >
                      <div className="font-medium text-sm md:text-base">{formatAmount(amount)}</div>
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
        isVerifying={isVerifying}
        onVerifyPin={handleVerifyPin}
      />

      {/* PIN Reset Modal */}
      <PinResetModal
        isOpen={showPinReset}
        onClose={() => setShowPinReset(false)}
        onSuccess={handlePinResetSuccess}
      />

      {/* Purchase Success Modal */}
      {purchaseSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setPurchaseSuccess(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-green-600">Purchase Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your airtime has been purchased successfully.
              </p>
              
              <div className="space-y-3 mb-6 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium text-sm">{purchaseSuccess.transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium text-sm">{purchaseSuccess.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Network:</span>
                  <span className="font-medium">{purchaseSuccess.networkName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{purchaseSuccess.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₦{purchaseSuccess.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Cost:</span>
                  <span className="font-medium">₦{purchaseSuccess.totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">{purchaseSuccess.status}</span>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  setPurchaseSuccess(null)
                  // Reset form
                  setSelectedNetwork(null)
                  setSelectedAmount(100)
                  setCustomAmount('')
                  setPhoneNumber('')
                }}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default BuyAirtime 