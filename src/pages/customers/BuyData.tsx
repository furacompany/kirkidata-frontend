import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, CreditCard, Wallet, CheckCircle, ChevronDown, Phone, 
  Shield, Loader2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { apiService, DataPlan } from '../../services/api'
import toast from 'react-hot-toast'
import PinVerificationModal from '../../components/ui/PinVerificationModal'
import PinResetModal from '../../components/ui/PinResetModal'

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

const BuyData: React.FC = () => {
  const { walletBalance, updateWalletBalance, addTransaction } = useUserStore()
  const { user } = useAuthStore()
  
  // State for API data
  const [networks, setNetworks] = useState<NetworkOption[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([])
  
  // State for selections
  const [selectedNetwork, setSelectedNetwork] = useState<NetworkOption | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet')
  
  // State for UI
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(true)
  const [isLoadingCategories, setIsLoadingCategories] = useState(false)
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [showPinReset, setShowPinReset] = useState(false)
  const [purchaseSuccess, setPurchaseSuccess] = useState<any>(null)
  


  // Load networks on component mount
  useEffect(() => {
    loadNetworks()
  }, [])

  // Load categories when network changes
  useEffect(() => {
    if (selectedNetwork) {
      loadCategories(selectedNetwork.name)
      setSelectedCategory(null)
      setSelectedPlan(null)
      setDataPlans([])
    }
  }, [selectedNetwork])

  // Load plans when category changes
  useEffect(() => {
    if (selectedNetwork && selectedCategory) {
      loadDataPlans(selectedNetwork.name)
      setSelectedPlan(null)
    }
  }, [selectedNetwork, selectedCategory])

  const loadNetworks = async () => {
    try {
      setIsLoadingNetworks(true)
      const response = await apiService.getNetworks()
      
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
      console.error('Error loading networks:', error)
      toast.error(error.message || 'Failed to load networks')
    } finally {
      setIsLoadingNetworks(false)
    }
  }

  const loadCategories = async (networkName: string) => {
    try {
      setIsLoadingCategories(true)
      const response = await apiService.getDataPlanCategories(networkName)
      
      if (response.success && response.data) {
        setCategories(response.data)
      }
    } catch (error: any) {
      console.error('Error loading categories:', error)
      toast.error(error.message || 'Failed to load data plan categories')
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const loadDataPlans = async (networkName: string) => {
    try {
      setIsLoadingPlans(true)
      
      // Load all plans by requesting a very large page size
      // We'll modify the API call to get all plans at once
      const response = await apiService.getDataPlans(networkName, 1, 'price', 'asc')
      
      if (response.success && response.data) {
        // If there are more pages, load them all
        let allPlans = [...response.data.plans]
        let currentPage = 1
        
        while (response.data.hasNext && currentPage < 10) { // Safety limit
          currentPage++
          const nextResponse = await apiService.getDataPlans(networkName, currentPage, 'price', 'asc')
          if (nextResponse.success && nextResponse.data) {
            allPlans = [...allPlans, ...nextResponse.data.plans]
            if (!nextResponse.data.hasNext) break
          } else {
            break
          }
        }
        
        setDataPlans(allPlans)
      }
    } catch (error: any) {
      console.error('Error loading data plans:', error)
      toast.error(error.message || 'Failed to load data plans')
    } finally {
      setIsLoadingPlans(false)
    }
  }

  // Remove loadMorePlans function as it's no longer needed

  const handleNetworkSelect = (network: NetworkOption) => {
    setSelectedNetwork(network)
    setShowNetworkDropdown(false)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowCategoryDropdown(false)
  }

  const handlePlanSelect = (plan: DataPlan) => {
    setSelectedPlan(plan)
    setShowPlanDropdown(false)
  }



  const canProceed = () => {
    return selectedNetwork && selectedCategory && selectedPlan && phoneNumber.length >= 11
  }

  const handlePurchase = () => {
    if (!canProceed() || !selectedPlan) return
    
    // Show PIN verification modal
    setShowPinVerification(true)
  }

  const completePurchase = async () => {
    if (!selectedPlan) return

    setIsLoading(true)
    
    try {
      // Make actual API call for data purchase
      const purchaseResponse = await apiService.purchaseData({
        planId: selectedPlan.planId,
        phoneNumber: phoneNumber
      })
      
      if (purchaseResponse.success && purchaseResponse.data) {
        const purchaseData = purchaseResponse.data
        
        // Update wallet balance
        updateWalletBalance(walletBalance - purchaseData.amount)
        
        // Add transaction
        addTransaction({
          userId: user?.id || '',
          type: 'data',
          amount: purchaseData.amount,
          description: purchaseData.description,
          network: purchaseData.networkName,
          status: purchaseData.status,
          phoneNumber: purchaseData.phoneNumber,
          reference: purchaseData.reference,
          transactionId: purchaseData.transactionId
        })

        // Show success modal with purchase details
        setPurchaseSuccess(purchaseData)
        setShowConfirmation(false)
        setShowPinVerification(false)
      }
    } catch (error: any) {
      console.error('Purchase error:', error)
      toast.error(error.message || 'Failed to purchase data plan')
    } finally {
      setIsLoading(false)
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

  const filteredPlans = selectedCategory 
    ? dataPlans.filter(plan => plan.planType === selectedCategory)
    : dataPlans

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block"
      >
        <h1 className="text-3xl font-bold text-gray-900">Buy Data</h1>
        <p className="text-gray-600 mt-2">
          Purchase data bundles for any network instantly
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
                <Wifi className="w-5 h-5 text-accent" />
                Purchase Data
              </CardTitle>
              <CardDescription>
                Select network, plan, and phone number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phone Number - POSITION 1 */}
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
                            onClick={() => handleNetworkSelect(network)}
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

              {/* Category Selection - ALWAYS VISIBLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select Data Type</label>
                <div className="relative">
                  <button
                    onClick={() => selectedNetwork && setShowCategoryDropdown(!showCategoryDropdown)}
                    disabled={isLoadingCategories || !selectedNetwork}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {!selectedNetwork ? (
                        <span className="text-gray-400">Select network first</span>
                      ) : isLoadingCategories ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-gray-500">Loading categories...</span>
                        </>
                      ) : selectedCategory ? (
                        <span className="font-medium">{selectedCategory}</span>
                      ) : (
                        <span className="text-gray-500">Choose data type</span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showCategoryDropdown && !isLoadingCategories && selectedNetwork && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                    >
                      {categories.length > 0 ? (
                        <>
                          {categories.map((category) => (
                            <button
                              key={category}
                              onClick={() => handleCategorySelect(category)}
                              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                            >
                              <span className="font-medium">{category}</span>
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="p-3 text-center text-gray-500">
                          No categories available
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Data Plans - ALWAYS VISIBLE */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Select Data Plan</label>
                </div>
                <div className="relative">
                  <button
                    onClick={() => selectedNetwork && selectedCategory && setShowPlanDropdown(!showPlanDropdown)}
                    disabled={isLoadingPlans || !selectedNetwork || !selectedCategory}
                    className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      {!selectedNetwork ? (
                        <span className="text-gray-400">Select network first</span>
                      ) : !selectedCategory ? (
                        <span className="text-gray-400">Select data type first</span>
                      ) : isLoadingPlans ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-gray-500">Loading plans...</span>
                        </>
                      ) : selectedPlan ? (
                        <div className="text-left">
                          <div className="font-medium">{selectedPlan.name}</div>
                          <div className="text-sm text-gray-500">{selectedPlan.description} - {selectedPlan.formattedPrice}</div>
                        </div>
                      ) : (
                        <span className="text-gray-500">Choose data plan</span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showPlanDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showPlanDropdown && !isLoadingPlans && selectedNetwork && selectedCategory && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                    >
                      {filteredPlans.length > 0 ? (
                        <>
                          {filteredPlans.map((plan) => (
                            <button
                              key={plan.planId}
                              onClick={() => handlePlanSelect(plan)}
                              className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="text-left">
                                <div className="font-medium text-sm">{plan.name}</div>
                                <div className="text-xs text-gray-600">{plan.description}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-bold text-primary">
                                  {plan.formattedPrice}
                                </div>
                              </div>
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="p-3 text-center text-gray-500">
                          No plans available for this category
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Purchase Button */}
              <Button
                onClick={() => setShowConfirmation(true)}
                disabled={!canProceed()}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Processing...' : `Buy Data - ${selectedPlan ? selectedPlan.formattedPrice : '₦0'}`}
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
                Review your data purchase details
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

              {selectedCategory && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{selectedCategory}</div>
                    <div className="text-sm text-gray-500">Data Type</div>
                  </div>
                </div>
              )}

              {selectedPlan && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{selectedPlan.name}</div>
                    <div className="text-sm text-gray-500">{selectedPlan.description}</div>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {selectedPlan.formattedPrice}
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
                Are you sure you want to purchase {selectedPlan?.name} for {phoneNumber}?
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Network:</span>
                  <span className="font-medium">{selectedNetwork?.name}</span>
                </div>
                                 <div className="flex justify-between">
                   <span>Plan:</span>
                   <span className="font-medium">{selectedPlan?.name}</span>
                 </div>
                 <div className="flex justify-between">
                   <span>Amount:</span>
                   <span className="font-medium">{selectedPlan?.formattedPrice}</span>
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
        description={selectedPlan ? `Enter your PIN to confirm ${selectedPlan.name} purchase` : 'Enter your PIN to confirm this purchase'}
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
                Your data plan has been purchased successfully.
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
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium">{purchaseSuccess.planName}</span>
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
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">{purchaseSuccess.status}</span>
                </div>
              </div>
              
              <Button
                onClick={() => {
                  setPurchaseSuccess(null)
                  // Reset form
                  setSelectedNetwork(null)
                  setSelectedCategory(null)
                  setSelectedPlan(null)
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

export default BuyData 