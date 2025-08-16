import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, CreditCard, Wallet, CheckCircle, ChevronDown, Phone, 
  Shield, Clock, Download
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

interface DataPlan {
  id: string
  name: string
  size: string
  duration: string
  price: number
  network: string
  type: string
  description: string
  validity: string
}

interface DataType {
  id: string
  name: string
  network: string
}

const networks: Network[] = [
  { id: 'mtn', name: 'MTN', logo: '🟡', color: 'bg-yellow-500' },
  { id: 'airtel', name: 'Airtel', logo: '🔴', color: 'bg-red-500' },
  { id: 'glo', name: 'Glo', logo: '🟢', color: 'bg-green-500' },
  { id: '9mobile', name: '9mobile', logo: '🟢', color: 'bg-green-600' },
]

const dataTypes: DataType[] = [
  // MTN types
  { id: 'mtn_sme', name: 'SME', network: 'MTN' },
  { id: 'mtn_corporate', name: 'Corporate', network: 'MTN' },
  { id: 'mtn_gifting', name: 'Gifting', network: 'MTN' },
  // Airtel types
  { id: 'airtel_gifting', name: 'Gifting', network: 'Airtel' },
  // Glo types
  { id: 'glo_corporate', name: 'Corporate', network: 'Glo' },
  // 9mobile types
  { id: '9mobile_sme', name: 'SME', network: '9mobile' },
]

const dataPlans: DataPlan[] = [
  // MTN SME Plans
  {
    id: 'mtn_sme_500mb',
    name: '500MB SME',
    size: '500MB',
    duration: '7 Days',
    price: 500,
    network: 'MTN',
    type: 'SME',
    description: '500MB SME for 7 days',
    validity: '7 days'
  },
  {
    id: 'mtn_sme_1gb',
    name: '1GB SME',
    size: '1GB',
    duration: '30 Days',
    price: 700,
    network: 'MTN',
    type: 'SME',
    description: '1GB SME for 30 days',
    validity: '30 days'
  },
  {
    id: 'mtn_sme_2gb',
    name: '2GB SME',
    size: '2GB',
    duration: '30 Days',
    price: 1300,
    network: 'MTN',
    type: 'SME',
    description: '2GB SME for 30 days',
    validity: '30 days'
  },
  {
    id: 'mtn_sme_3gb',
    name: '3GB SME',
    size: '3GB',
    duration: '30 Days',
    price: 1900,
    network: 'MTN',
    type: 'SME',
    description: '3GB SME for 30 days',
    validity: '30 days'
  },
  {
    id: 'mtn_sme_5gb',
    name: '5GB SME',
    size: '5GB',
    duration: '30 Days',
    price: 2500,
    network: 'MTN',
    type: 'SME',
    description: '5GB SME for 30 days',
    validity: '30 days'
  },

  // MTN Gifting Plans
  {
    id: 'mtn_gifting_75mb',
    name: '75MB Gifting',
    size: '75MB',
    duration: '1 Days',
    price: 90,
    network: 'MTN',
    type: 'Gifting',
    description: '75MB Gifting for 1 day',
    validity: '1 days'
  },
  {
    id: 'mtn_gifting_110mb',
    name: '110MB Gifting',
    size: '110MB',
    duration: '1 Days',
    price: 120,
    network: 'MTN',
    type: 'Gifting',
    description: '110MB Gifting for 1 day',
    validity: '1 days'
  },
  {
    id: 'mtn_gifting_1gb',
    name: '1GB Gifting',
    size: '1GB',
    duration: '1 Days',
    price: 500,
    network: 'MTN',
    type: 'Gifting',
    description: '1GB Gifting for 1 day',
    validity: '1 days'
  },
  {
    id: 'mtn_gifting_2gb',
    name: '2GB Gifting',
    size: '2GB',
    duration: '2 Days',
    price: 760,
    network: 'MTN',
    type: 'Gifting',
    description: '2GB Gifting for 2 days',
    validity: '2 days'
  },
  {
    id: 'mtn_gifting_2_5gb',
    name: '2.5GB Gifting',
    size: '2.5GB',
    duration: '2 Days',
    price: 900,
    network: 'MTN',
    type: 'Gifting',
    description: '2.5GB Gifting for 2 days',
    validity: '2 days'
  },
  {
    id: 'mtn_gifting_3_2gb',
    name: '3.2GB Gifting',
    size: '3.2GB',
    duration: '2 Days',
    price: 1000,
    network: 'MTN',
    type: 'Gifting',
    description: '3.2GB Gifting for 2 days',
    validity: '2 days'
  },
  {
    id: 'mtn_gifting_6gb',
    name: '6GB Gifting',
    size: '6GB',
    duration: '7 Days',
    price: 2460,
    network: 'MTN',
    type: 'Gifting',
    description: '6GB Gifting for 7 days',
    validity: '7 days'
  },
  {
    id: 'mtn_gifting_11gb',
    name: '11GB Gifting',
    size: '11GB',
    duration: '7 Days',
    price: 3500,
    network: 'MTN',
    type: 'Gifting',
    description: '11GB Gifting for 7 days',
    validity: '7 days'
  },
  {
    id: 'mtn_gifting_16_5gb',
    name: '16.5GB Gifting',
    size: '16.5GB',
    duration: '30 Days',
    price: 6500,
    network: 'MTN',
    type: 'Gifting',
    description: '16.5GB Gifting for 30 days',
    validity: '30 days'
  },
  {
    id: 'mtn_gifting_1_5gb_2days',
    name: '1.5GB Gifting',
    size: '1.5GB',
    duration: '2 Days',
    price: 650,
    network: 'MTN',
    type: 'Gifting',
    description: '1.5GB Gifting for 2 days',
    validity: '2 days'
  },
  {
    id: 'mtn_gifting_1_5gb_7days',
    name: '1.5GB Gifting',
    size: '1.5GB',
    duration: '7 Days',
    price: 990,
    network: 'MTN',
    type: 'Gifting',
    description: '1.5GB Gifting for 7 days',
    validity: '7 days'
  },
  {
    id: 'mtn_gifting_1_2gb',
    name: '1.2GB Gifting',
    size: '1.2GB',
    duration: '7 Days',
    price: 800,
    network: 'MTN',
    type: 'Gifting',
    description: '1.2GB Gifting for 7 days',
    validity: '7 days'
  },
  {
    id: 'mtn_gifting_230mb',
    name: '230MB Gifting',
    size: '230MB',
    duration: '1 Days',
    price: 220,
    network: 'MTN',
    type: 'Gifting',
    description: '230MB Gifting for 1 day',
    validity: '1 days'
  },
  {
    id: 'mtn_gifting_750mb',
    name: '750MB Gifting',
    size: '750MB',
    duration: '3 Days',
    price: 455,
    network: 'MTN',
    type: 'Gifting',
    description: '750MB Gifting for 3 days',
    validity: '3 days'
  },
  {
    id: 'mtn_gifting_36gb',
    name: '36GB Gifting',
    size: '36GB',
    duration: '30 Days',
    price: 11000,
    network: 'MTN',
    type: 'Gifting',
    description: '36GB Gifting for 30 days',
    validity: '30 days'
  },
  {
    id: 'mtn_gifting_1_12gb_calls',
    name: '1.12GB (Plus 35Mins Call) Gifting',
    size: '1.12GB + 35Mins',
    duration: '30 Days',
    price: 1500,
    network: 'MTN',
    type: 'Gifting',
    description: '1.12GB plus 35 minutes call for 30 days',
    validity: '30 days'
  },
  {
    id: 'mtn_gifting_5gb_calls',
    name: '5GB (Plus 35Mins Call) Gifting',
    size: '5GB + 35Mins',
    duration: '30 Days',
    price: 3000,
    network: 'MTN',
    type: 'Gifting',
    description: '5GB plus 35 minutes call for 30 days',
    validity: '30 days'
  },

  // MTN Corporate Plans
  {
    id: 'mtn_corporate_20mb_facebook',
    name: '20MB (Facebook) Corporate',
    size: '20MB',
    duration: '1 Days',
    price: 35,
    network: 'MTN',
    type: 'Corporate',
    description: '20MB Facebook Corporate for 1 day',
    validity: '1 days'
  },
  {
    id: 'mtn_corporate_20mb_whatsapp',
    name: '20MB (Whatsapp) Corporate',
    size: '20MB',
    duration: '1 Days',
    price: 35,
    network: 'MTN',
    type: 'Corporate',
    description: '20MB WhatsApp Corporate for 1 day',
    validity: '1 days'
  },
  {
    id: 'mtn_corporate_40mb_whatsapp',
    name: '40MB (Whatsapp) Corporate',
    size: '40MB',
    duration: '1 Days',
    price: 60,
    network: 'MTN',
    type: 'Corporate',
    description: '40MB WhatsApp Corporate for 1 day',
    validity: '1 days'
  },
  {
    id: 'mtn_corporate_110mb_whatsapp',
    name: '110MB (Whatsapp) Corporate',
    size: '110MB',
    duration: '7 Days',
    price: 170,
    network: 'MTN',
    type: 'Corporate',
    description: '110MB WhatsApp Corporate for 7 days',
    validity: '7 days'
  },
  {
    id: 'mtn_corporate_230mb_coupon',
    name: '230MB (Coupon) Corporate',
    size: '230MB',
    duration: '1 Days',
    price: 210,
    network: 'MTN',
    type: 'Corporate',
    description: '230MB Coupon Corporate for 1 day',
    validity: '1 days'
  },
  {
    id: 'mtn_corporate_500mb_coupon',
    name: '500MB (Coupon) Corporate',
    size: '500MB',
    duration: '7 Days',
    price: 510,
    network: 'MTN',
    type: 'Corporate',
    description: '500MB Coupon Corporate for 7 days',
    validity: '7 days'
  },
  {
    id: 'mtn_corporate_750mb_coupon',
    name: '750MB (Coupon) Corporate',
    size: '750MB',
    duration: '3 Days',
    price: 450,
    network: 'MTN',
    type: 'Corporate',
    description: '750MB Coupon Corporate for 3 days',
    validity: '3 days'
  },
  {
    id: 'mtn_corporate_1_2gb_social',
    name: '1.2GB (Social Only) Corporate',
    size: '1.2GB',
    duration: '7 Days',
    price: 460,
    network: 'MTN',
    type: 'Corporate',
    description: '1.2GB Social Only Corporate for 7 days',
    validity: '7 days'
  },
  {
    id: 'mtn_corporate_1_5gb_coupon',
    name: '1.5GB (Coupon) Corporate',
    size: '1.5GB',
    duration: '7 Days',
    price: 990,
    network: 'MTN',
    type: 'Corporate',
    description: '1.5GB Coupon Corporate for 7 days',
    validity: '7 days'
  },

  // Airtel Gifting Plans
  {
    id: 'airtel_gifting_warning',
    name: 'Do Not Buy If You Are Owing Airtel Gifting',
    size: '0MB',
    duration: '1 Days',
    price: 0,
    network: 'Airtel',
    type: 'Gifting',
    description: 'Warning: Do not buy if you owe Airtel',
    validity: '1 days'
  },
  {
    id: 'airtel_gifting_150mb',
    name: '150MB Gifting',
    size: '150MB',
    duration: '1 Days',
    price: 70,
    network: 'Airtel',
    type: 'Gifting',
    description: '150MB Gifting for 1 day',
    validity: '1 days'
  },
  {
    id: 'airtel_gifting_300mb',
    name: '300MB Gifting',
    size: '300MB',
    duration: '2 Days',
    price: 130,
    network: 'Airtel',
    type: 'Gifting',
    description: '300MB Gifting for 2 days',
    validity: '2 days'
  },
  {
    id: 'airtel_gifting_600mb',
    name: '600MB Gifting',
    size: '600MB',
    duration: '1 Days',
    price: 230,
    network: 'Airtel',
    type: 'Gifting',
    description: '600MB Gifting for 1 day',
    validity: '1 days'
  },
  {
    id: 'airtel_gifting_2gb',
    name: '2GB Gifting',
    size: '2GB',
    duration: '2 Days',
    price: 600,
    network: 'Airtel',
    type: 'Gifting',
    description: '2GB Gifting for 2 days',
    validity: '2 days'
  },
  {
    id: 'airtel_gifting_7gb',
    name: '7GB Gifting',
    size: '7GB',
    duration: '7 Days',
    price: 2200,
    network: 'Airtel',
    type: 'Gifting',
    description: '7GB Gifting for 7 days',
    validity: '7 days'
  },
  {
    id: 'airtel_gifting_10gb',
    name: '10GB Gifting',
    size: '10GB',
    duration: '30 Days',
    price: 3300,
    network: 'Airtel',
    type: 'Gifting',
    description: '10GB Gifting for 30 days',
    validity: '30 days'
  },
  {
    id: 'airtel_gifting_1gb_social',
    name: '1GB (Social Only) Gifting',
    size: '1GB',
    duration: '3 Days',
    price: 370,
    network: 'Airtel',
    type: 'Gifting',
    description: '1GB Social Only Gifting for 3 days',
    validity: '3 days'
  },
  {
    id: 'airtel_gifting_13gb',
    name: '13GB Gifting',
    size: '13GB',
    duration: '30 Days',
    price: 5200,
    network: 'Airtel',
    type: 'Gifting',
    description: '13GB Gifting for 30 days',
    validity: '30 days'
  },
  {
    id: 'airtel_gifting_4gb',
    name: '4GB Gifting',
    size: '4GB',
    duration: '2 Days',
    price: 800,
    network: 'Airtel',
    type: 'Gifting',
    description: '4GB Gifting for 2 days',
    validity: '2 days'
  },
  {
    id: 'airtel_gifting_3_5gb_bonus',
    name: '3.5GB (+3.5GB Bonus) Gifting',
    size: '3.5GB + 3.5GB',
    duration: '7 Days',
    price: 1500,
    network: 'Airtel',
    type: 'Gifting',
    description: '3.5GB plus 3.5GB bonus for 7 days',
    validity: '7 days'
  },
  {
    id: 'airtel_gifting_1_5gb',
    name: '1.5GB Gifting',
    size: '1.5GB',
    duration: '1 Days',
    price: 455,
    network: 'Airtel',
    type: 'Gifting',
    description: '1.5GB Gifting for 1 day',
    validity: '1 days'
  },
  {
    id: 'airtel_gifting_1gb',
    name: '1GB Gifting',
    size: '1GB',
    duration: '1 Days',
    price: 380,
    network: 'Airtel',
    type: 'Gifting',
    description: '1GB Gifting for 1 day',
    validity: '1 days'
  },

  // Glo Corporate Plans
  {
    id: 'glo_corporate_200mb',
    name: '200MB Corporate',
    size: '200MB',
    duration: '30 Days',
    price: 95,
    network: 'Glo',
    type: 'Corporate',
    description: '200MB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: 'glo_corporate_500mb',
    name: '500MB Corporate',
    size: '500MB',
    duration: '30 Days',
    price: 230,
    network: 'Glo',
    type: 'Corporate',
    description: '500MB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: 'glo_corporate_1gb',
    name: '1GB Corporate',
    size: '1GB',
    duration: '30 Days',
    price: 450,
    network: 'Glo',
    type: 'Corporate',
    description: '1GB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: 'glo_corporate_2gb',
    name: '2GB Corporate',
    size: '2GB',
    duration: '30 Days',
    price: 900,
    network: 'Glo',
    type: 'Corporate',
    description: '2GB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: 'glo_corporate_3gb',
    name: '3GB Corporate',
    size: '3GB',
    duration: '30 Days',
    price: 1350,
    network: 'Glo',
    type: 'Corporate',
    description: '3GB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: 'glo_corporate_5gb',
    name: '5GB Corporate',
    size: '5GB',
    duration: '30 Days',
    price: 2250,
    network: 'Glo',
    type: 'Corporate',
    description: '5GB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: 'glo_corporate_10gb',
    name: '10GB Corporate',
    size: '10GB',
    duration: '30 Days',
    price: 4500,
    network: 'Glo',
    type: 'Corporate',
    description: '10GB Corporate for 30 days',
    validity: '30 days'
  },

  // 9mobile SME Plans (same as Glo Corporate per user's instruction)
  {
    id: '9mobile_sme_200mb',
    name: '200MB Corporate',
    size: '200MB',
    duration: '30 Days',
    price: 95,
    network: '9mobile',
    type: 'SME',
    description: '200MB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: '9mobile_sme_500mb',
    name: '500MB Corporate',
    size: '500MB',
    duration: '30 Days',
    price: 230,
    network: '9mobile',
    type: 'SME',
    description: '500MB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: '9mobile_sme_1gb',
    name: '1GB Corporate',
    size: '1GB',
    duration: '30 Days',
    price: 450,
    network: '9mobile',
    type: 'SME',
    description: '1GB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: '9mobile_sme_2gb',
    name: '2GB Corporate',
    size: '2GB',
    duration: '30 Days',
    price: 900,
    network: '9mobile',
    type: 'SME',
    description: '2GB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: '9mobile_sme_3gb',
    name: '3GB Corporate',
    size: '3GB',
    duration: '30 Days',
    price: 1350,
    network: '9mobile',
    type: 'SME',
    description: '3GB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: '9mobile_sme_5gb',
    name: '5GB Corporate',
    size: '5GB',
    duration: '30 Days',
    price: 2250,
    network: '9mobile',
    type: 'SME',
    description: '5GB Corporate for 30 days',
    validity: '30 days'
  },
  {
    id: '9mobile_sme_10gb',
    name: '10GB Corporate',
    size: '10GB',
    duration: '30 Days',
    price: 4500,
    network: '9mobile',
    type: 'SME',
    description: '10GB Corporate for 30 days',
    validity: '30 days'
  },
]

const BuyData: React.FC = () => {
  const { walletBalance, updateWalletBalance, addTransaction } = useUserStore()
  const { user } = useAuthStore()
  
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [selectedDataType, setSelectedDataType] = useState<DataType | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null)
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card'>('wallet')
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showDataTypeDropdown, setShowDataTypeDropdown] = useState(false)
  const [showPlanDropdown, setShowPlanDropdown] = useState(false)
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [showPinReset, setShowPinReset] = useState(false)

  const availableDataTypes = selectedNetwork 
    ? dataTypes.filter(type => type.network === selectedNetwork.name)
    : []

  const filteredPlans = selectedNetwork && selectedDataType
    ? dataPlans.filter(plan => plan.network === selectedNetwork.name && plan.type === selectedDataType.name)
    : []

  const canProceed = () => {
    return selectedNetwork && selectedDataType && selectedPlan && phoneNumber.length >= 11 && walletBalance >= selectedPlan.price
  }

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network)
    setSelectedDataType(null)
    setSelectedPlan(null)
    setShowNetworkDropdown(false)
  }

  const handleDataTypeSelect = (dataType: DataType) => {
    setSelectedDataType(dataType)
    setSelectedPlan(null)
    setShowDataTypeDropdown(false)
  }

  const handlePlanSelect = (plan: DataPlan) => {
    setSelectedPlan(plan)
    setShowPlanDropdown(false)
  }

  const handlePurchase = () => {
    if (!canProceed() || !selectedPlan) return
    
    // Show PIN verification modal
    setShowPinVerification(true)
  }

  const completePurchase = async () => {
    if (!selectedPlan) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update wallet balance
    updateWalletBalance(walletBalance - selectedPlan.price)
    
    // Add transaction
    addTransaction({
      userId: user?.id || '',
      type: 'data',
      amount: selectedPlan.price,
      description: `${selectedPlan.name} - ${phoneNumber}`,
      network: selectedPlan.network,
      status: 'successful',
      phoneNumber: phoneNumber,
    })

    toast.success('Data plan purchased successfully!')
    setShowConfirmation(false)
    setShowPinVerification(false)
    
    // Reset form
    setSelectedNetwork(null)
    setSelectedPlan(null)
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
                          onClick={() => handleNetworkSelect(network)}
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

              {/* Data Type Selection */}
              {selectedNetwork && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Data Type</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowDataTypeDropdown(!showDataTypeDropdown)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {selectedDataType ? (
                          <span className="font-medium">{selectedDataType.name}</span>
                        ) : (
                          <span className="text-gray-500">Choose data type</span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showDataTypeDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showDataTypeDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                      >
                        {availableDataTypes.map((dataType) => (
                          <button
                            key={dataType.id}
                            onClick={() => handleDataTypeSelect(dataType)}
                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium">{dataType.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

              {/* Data Plans */}
              {selectedNetwork && selectedDataType && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Select Data Plan</label>
                  <div className="relative">
                    <button
                      onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                      className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {selectedPlan ? (
                          <div className="text-left">
                            <div className="font-medium">{selectedPlan.name}</div>
                            <div className="text-sm text-gray-500">{selectedPlan.size} - {selectedPlan.duration} - {formatAmount(selectedPlan.price)}</div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Choose data plan</span>
                        )}
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${showPlanDropdown ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {showPlanDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      >
                        {filteredPlans.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => handlePlanSelect(plan)}
                            className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                          >
                            <div className="text-left">
                              <div className="font-medium text-sm">{plan.name}</div>
                              <div className="text-xs text-gray-600">{plan.description}</div>
                              <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                <span className="flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  {plan.size}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {plan.validity}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-primary">
                                {formatAmount(plan.price)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </div>
              )}

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
                {isLoading ? 'Processing...' : `Buy Data - ${selectedPlan ? formatAmount(selectedPlan.price) : '₦0'}`}
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

              {selectedDataType && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{selectedDataType.name}</div>
                    <div className="text-sm text-gray-500">Data Type</div>
                  </div>
                </div>
              )}

              {selectedPlan && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{selectedPlan.name}</div>
                    <div className="text-sm text-gray-500">{selectedPlan.description}</div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {selectedPlan.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {selectedPlan.validity}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {formatAmount(selectedPlan.price)}
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
                  <span>Amount (₦):</span>
                  <span className="font-medium">{selectedPlan ? formatAmount(selectedPlan.price) : '₦0'}</span>
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
    </div>
  )
}

export default BuyData 