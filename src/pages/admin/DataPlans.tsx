import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, Edit, Save, X, ChevronDown, Search, Banknote,
  Clock, Download, Settings, Plus
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'

interface Network {
  id: string
  name: string
  logo: string
  color: string
}

interface DataType {
  id: string
  name: string
  network: string
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

const initialDataPlans: DataPlan[] = [
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

  // 9mobile SME Plans
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

const DataPlans: React.FC = () => {
  const [dataPlans, setDataPlans] = useState<DataPlan[]>(initialDataPlans)
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [selectedDataType, setSelectedDataType] = useState<DataType | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showDataTypeDropdown, setShowDataTypeDropdown] = useState(false)
  const [editingPlan, setEditingPlan] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(false)
  
  // Add New Plan Modal States
  const [showAddModal, setShowAddModal] = useState(false)
  const [newPlan, setNewPlan] = useState({
    network: '',
    type: '',
    name: '',
    size: '',
    duration: '',
    price: 0,
    description: '',
    validity: ''
  })

  const availableDataTypes = selectedNetwork 
    ? dataTypes.filter(type => type.network === selectedNetwork.name)
    : []

  const filteredPlans = dataPlans.filter(plan => {
    const matchesNetwork = !selectedNetwork || plan.network === selectedNetwork.name
    const matchesType = !selectedDataType || plan.type === selectedDataType.name
    const matchesSearch = !searchTerm || 
      plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.size.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesNetwork && matchesType && matchesSearch
  })

  const handleNetworkSelect = (network: Network) => {
    setSelectedNetwork(network)
    setSelectedDataType(null)
    setShowNetworkDropdown(false)
  }

  const handleDataTypeSelect = (dataType: DataType) => {
    setSelectedDataType(dataType)
    setShowDataTypeDropdown(false)
  }

  const handleEditStart = (planId: string, currentPrice: number) => {
    setEditingPlan(planId)
    setEditPrice(currentPrice)
  }

  const handleEditCancel = () => {
    setEditingPlan(null)
    setEditPrice(0)
  }

  const handleEditSave = async (planId: string) => {
    if (editPrice <= 0) {
      toast.error('Price must be greater than 0')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setDataPlans(prev => prev.map(plan => 
        plan.id === planId ? { ...plan, price: editPrice } : plan
      ))
      
      setEditingPlan(null)
      setEditPrice(0)
      toast.success('Data plan price updated successfully!')
    } catch (error) {
      toast.error('Failed to update price. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const clearFilters = () => {
    setSelectedNetwork(null)
    setSelectedDataType(null)
    setSearchTerm('')
  }

  // Add New Plan Handlers
  const handleAddPlanClick = () => {
    setNewPlan({
      network: '',
      type: '',
      name: '',
      size: '',
      duration: '',
      price: 0,
      description: '',
      validity: ''
    })
    setShowAddModal(true)
  }

  const handleAddPlanCancel = () => {
    setShowAddModal(false)
    setNewPlan({
      network: '',
      type: '',
      name: '',
      size: '',
      duration: '',
      price: 0,
      description: '',
      validity: ''
    })
  }

  const handleAddPlanSave = async () => {
    // Validation
    if (!newPlan.network || !newPlan.type || !newPlan.name || !newPlan.size || 
        !newPlan.duration || newPlan.price <= 0 || !newPlan.description || !newPlan.validity) {
      toast.error('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const plan: DataPlan = {
        id: `new_plan_${Date.now()}`,
        network: newPlan.network,
        type: newPlan.type,
        name: newPlan.name,
        size: newPlan.size,
        duration: newPlan.duration,
        price: newPlan.price,
        description: newPlan.description,
        validity: newPlan.validity
      }
      
      setDataPlans(prev => [...prev, plan])
      setShowAddModal(false)
      setNewPlan({
        network: '',
        type: '',
        name: '',
        size: '',
        duration: '',
        price: 0,
        description: '',
        validity: ''
      })
      toast.success('New data plan added successfully!')
    } catch (error) {
      toast.error('Failed to add data plan. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getAvailableTypesForNetwork = (networkName: string) => {
    return dataTypes.filter(type => type.network === networkName)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Plans Management</h1>
          <p className="text-gray-600">Manage pricing for all data plans across networks</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-base text-gray-500">
            Total Plans: <span className="font-semibold text-gray-900">{filteredPlans.length}</span>
          </div>
          <Button
            onClick={handleAddPlanClick}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Plan
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter data plans by network, type, or search by name
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Network Filter */}
            <div className="relative">
              <button
                onClick={() => setShowNetworkDropdown(!showNetworkDropdown)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  {selectedNetwork ? (
                    <>
                      <span className="text-lg">{selectedNetwork.logo}</span>
                      <span className="font-medium">{selectedNetwork.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">All Networks</span>
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
                  <button
                    onClick={() => {
                      setSelectedNetwork(null)
                      setSelectedDataType(null)
                      setShowNetworkDropdown(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <span className="font-medium text-gray-600">All Networks</span>
                  </button>
                  {networks.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => handleNetworkSelect(network)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-lg">{network.logo}</span>
                      <span className="font-medium">{network.name}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Data Type Filter */}
            <div className="relative">
              <button
                onClick={() => setShowDataTypeDropdown(!showDataTypeDropdown)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                disabled={!selectedNetwork}
              >
                <div className="flex items-center gap-2">
                  {selectedDataType ? (
                    <span className="font-medium">{selectedDataType.name}</span>
                  ) : (
                    <span className="text-gray-500">
                      {selectedNetwork ? 'All Types' : 'Select Network First'}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showDataTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showDataTypeDropdown && selectedNetwork && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                >
                  <button
                    onClick={() => {
                      setSelectedDataType(null)
                      setShowDataTypeDropdown(false)
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <span className="font-medium text-gray-600">All Types</span>
                  </button>
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

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Plans List */}
      <div className="grid grid-cols-1 gap-6">
        {networks.map((network) => {
          const networkPlans = filteredPlans.filter(plan => plan.network === network.name)
          
          if (networkPlans.length === 0 && (selectedNetwork || searchTerm)) return null

          return (
            <motion.div
              key={network.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-2xl">{network.logo}</span>
                    <span>{network.name} Data Plans</span>
                    <span className="text-base font-normal text-gray-500">
                      ({networkPlans.length} plans)
                    </span>
                  </CardTitle>
                  <CardDescription>
                    Manage {network.name} data plan pricing and availability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {networkPlans.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No plans found for the selected filters
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Group by data type */}
                      {dataTypes
                        .filter(type => type.network === network.name)
                        .map((dataType) => {
                          const typePlans = networkPlans.filter(plan => plan.type === dataType.name)
                          
                          if (typePlans.length === 0) return null

                          return (
                            <div key={dataType.id} className="space-y-2">
                              <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <Wifi className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-gray-700">{dataType.name} Plans</span>
                                <span className="text-sm text-gray-500">({typePlans.length})</span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {typePlans.map((plan) => (
                                  <div
                                    key={plan.id}
                                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                                                              <div className="font-medium text-gray-900 text-base">
                                        {plan.name}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        {plan.description}
                                      </div>
                                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
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
                                      <div className="flex items-center gap-2 ml-3">
                                        {editingPlan === plan.id ? (
                                          <div className="flex items-center gap-2">
                                            <Input
                                              type="number"
                                              value={editPrice}
                                              onChange={(e) => setEditPrice(Number(e.target.value))}
                                                                                              className="w-20 h-8 text-base"
                                              min="1"
                                            />
                                            <button
                                              onClick={() => handleEditSave(plan.id)}
                                              disabled={isLoading}
                                              className="p-1 text-green-600 hover:text-green-700 transition-colors"
                                            >
                                              <Save className="w-4 h-4" />
                                            </button>
                                            <button
                                              onClick={handleEditCancel}
                                              disabled={isLoading}
                                              className="p-1 text-gray-500 hover:text-gray-600 transition-colors"
                                            >
                                              <X className="w-4 h-4" />
                                            </button>
                                          </div>
                                        ) : (
                                          <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                                                      <div className="font-bold text-primary text-base">
                                          {formatAmount(plan.price)}
                                        </div>
                                            </div>
                                            <button
                                              onClick={() => handleEditStart(plan.id, plan.price)}
                                              className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                                            >
                                              <Edit className="w-4 h-4" />
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {filteredPlans.length === 0 && (selectedNetwork || selectedDataType || searchTerm) && (
        <Card>
          <CardContent className="text-center py-12">
            <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Plans Found</h3>
            <p className="text-gray-500 mb-4">
              No data plans match your current filters. Try adjusting your search criteria.
            </p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </CardContent>
        </Card>
      )}

      {/* Add New Plan Modal */}
      {showAddModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleAddPlanCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add New Data Plan</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAddPlanCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             {/* Network Selection */}
               <div className="space-y-2">
                 <label className="text-base font-medium text-gray-700">Network *</label>
                <select
                  value={newPlan.network}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, network: e.target.value, type: '' }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Network</option>
                  {networks.map(network => (
                    <option key={network.id} value={network.name}>{network.name}</option>
                  ))}
                </select>
              </div>

                             {/* Data Type Selection */}
               <div className="space-y-2">
                 <label className="text-base font-medium text-gray-700">Data Type *</label>
                <select
                  value={newPlan.type}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={!newPlan.network}
                >
                  <option value="">Select Type</option>
                  {newPlan.network && getAvailableTypesForNetwork(newPlan.network).map(type => (
                    <option key={type.id} value={type.name}>{type.name}</option>
                  ))}
                </select>
              </div>

                             {/* Plan Name */}
               <div className="space-y-2">
                 <label className="text-base font-medium text-gray-700">Plan Name *</label>
                <Input
                  type="text"
                  placeholder="e.g., 1GB SME"
                  value={newPlan.name}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

                             {/* Data Size */}
               <div className="space-y-2">
                 <label className="text-base font-medium text-gray-700">Data Size *</label>
                <Input
                  type="text"
                  placeholder="e.g., 1GB, 500MB"
                  value={newPlan.size}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, size: e.target.value }))}
                />
              </div>

                             {/* Duration */}
               <div className="space-y-2">
                 <label className="text-base font-medium text-gray-700">Duration *</label>
                <Input
                  type="text"
                  placeholder="e.g., 30 Days, 7 Days"
                  value={newPlan.duration}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>

                             {/* Price */}
               <div className="space-y-2">
                 <label className="text-base font-medium text-gray-700">Price (₦) *</label>
                <Input
                  type="number"
                  placeholder="Enter price in Naira"
                  value={newPlan.price}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                  icon={<Banknote className="w-4 h-4" />}
                />
              </div>

                             {/* Validity */}
               <div className="space-y-2">
                 <label className="text-base font-medium text-gray-700">Validity *</label>
                <Input
                  type="text"
                  placeholder="e.g., 30 days, 7 days"
                  value={newPlan.validity}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, validity: e.target.value }))}
                />
              </div>

                             {/* Description - Full Width */}
               <div className="md:col-span-2 space-y-2">
                 <label className="text-base font-medium text-gray-700">Description *</label>
                <Input
                  type="text"
                  placeholder="e.g., 1GB for 30 days"
                  value={newPlan.description}
                  onChange={(e) => setNewPlan(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleAddPlanCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPlanSave}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Add Plan
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default DataPlans 