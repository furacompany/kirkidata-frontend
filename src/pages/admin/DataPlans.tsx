import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, Edit, ChevronDown, Search,
  Clock, Download, Settings, Grid, List, RefreshCw,
  DollarSign, Activity
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'
import { adminApiService } from '../../services/adminApi'
import { 
  OtoBillNetwork, 
  OtoBillDataPlan, 
  OtoBillDataPlanWithPricing,
  OtoBillPricingSummary
} from '../../types'

type ViewMode = 'card' | 'table'

const DataPlans: React.FC = () => {
  // State for networks and data plans
  const [networks, setNetworks] = useState<OtoBillNetwork[]>([])
  const [dataPlansWithPricing, setDataPlansWithPricing] = useState<OtoBillDataPlanWithPricing[]>([])
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(false)
  const [isLoadingPricing, setIsLoadingPricing] = useState(false)
  
  // Pricing summary state
  const [pricingSummary, setPricingSummary] = useState<OtoBillPricingSummary | null>(null)
  
  // Filter states
  const [selectedNetwork, setSelectedNetwork] = useState<OtoBillNetwork | null>(null)
  const [selectedPlanType, setSelectedPlanType] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  
  // UI states
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showPlanTypeDropdown, setShowPlanTypeDropdown] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  // Inline edit state removed; we use modal-based editing everywhere
  
  // Pricing edit modal state
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [selectedPlanForPricing, setSelectedPlanForPricing] = useState<OtoBillDataPlanWithPricing | null>(null)
  const [newAdminPrice, setNewAdminPrice] = useState<string>('')
  const [newIsActive, setNewIsActive] = useState<boolean | null>(null)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPlans, setTotalPlans] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  // Available plan types for MTN (based on your API examples)
  const availablePlanTypes = ['Corporate', 'SME', 'Gifting']

  // Fetch networks on component mount
  useEffect(() => {
    fetchNetworks()
    fetchPricingSummary()
  }, [])

  // Fetch data plans when filters change
  useEffect(() => {
    fetchDataPlansWithPricing()
  }, [selectedNetwork, selectedPlanType, currentPage])

  const fetchNetworks = async () => {
    setIsLoadingNetworks(true)
    try {
      const response = await adminApiService.getOtoBillNetworks()
      if (response.success) {
        setNetworks(response.data)
      } else {
        toast.error(response.message || 'Failed to fetch networks')
      }
    } catch (error: any) {
      console.error('Error fetching networks:', error)
      toast.error(error.message || 'Failed to fetch networks')
    } finally {
      setIsLoadingNetworks(false)
    }
  }

  const fetchPricingSummary = async () => {
    try {
      const response = await adminApiService.getOtoBillPricingSummary()
      if (response.success) {
        setPricingSummary(response.data)
      } else {
        console.warn('Failed to fetch pricing summary:', response.message)
      }
    } catch (error: any) {
      console.warn('Error fetching pricing summary:', error)
      // Don't show error toast for pricing summary as it's not critical
    }
  }

  const fetchDataPlansWithPricing = async () => {
    setIsLoadingPricing(true)
    try {
      const response = await adminApiService.getOtoBillDataPlansPricing(
        selectedNetwork?.name,
        selectedPlanType || undefined,
        currentPage,
        20,
        true // includeInactive = true
      )
      
      if (response.success) {
        setDataPlansWithPricing(response.data.plans)
        setTotalPages(response.data.pagination.totalPages)
        setTotalPlans(response.data.pagination.total)
        setHasNext(response.data.pagination.hasNext)
        setHasPrev(response.data.pagination.hasPrev)
      } else {
        toast.error(response.message || 'Failed to fetch data plans with pricing')
      }
    } catch (error: any) {
      console.error('Error fetching data plans with pricing:', error)
      toast.error(error.message || 'Failed to fetch data plans with pricing')
    } finally {
      setIsLoadingPricing(false)
    }
  }

  const handleNetworkSelect = (network: OtoBillNetwork) => {
    setSelectedNetwork(network)
    setSelectedPlanType('')
    setCurrentPage(1)
    setShowNetworkDropdown(false)
  }

  const handlePlanTypeSelect = (planType: string) => {
    setSelectedPlanType(planType)
    setCurrentPage(1)
    setShowPlanTypeDropdown(false)
  }


  // Open pricing modal for plan (now all plans have pricing data)
  const handleOpenPricingModalForPlan = async (plan: OtoBillDataPlan | OtoBillDataPlanWithPricing) => {
    // Since we now fetch all plans with pricing, we can open directly
    if ('adminPrice' in plan) {
      setSelectedPlanForPricing(plan as OtoBillDataPlanWithPricing)
      setNewAdminPrice('')
      setNewIsActive(plan.isActive)
      setShowPricingModal(true)
    } else {
      // Fallback for any basic plans that might still exist
      const fallback = {
        planId: plan.planId,
        name: plan.name,
        networkName: plan.networkName,
        planType: plan.planType,
        validityDays: plan.validityDays,
        originalPrice: 'price' in plan ? plan.price : 0,
        adminPrice: 'price' in plan ? plan.price : 0,
        profit: 0,
        isActive: true,
        lastSynced: new Date().toISOString(),
      } as unknown as OtoBillDataPlanWithPricing
      setSelectedPlanForPricing(fallback)
      setNewAdminPrice('')
      setNewIsActive(true)
      setShowPricingModal(true)
    }
  }

  const handlePricingEditStart = (plan: OtoBillDataPlanWithPricing) => {
    setSelectedPlanForPricing(plan)
    setNewAdminPrice('') // Start with empty input for better UX
    setNewIsActive(plan.isActive)
    setShowPricingModal(true)
  }

  const handlePricingEditCancel = () => {
    setShowPricingModal(false)
    setSelectedPlanForPricing(null)
    setNewAdminPrice('')
    setNewIsActive(null)
  }

  const handlePricingEditSave = async () => {
    if (!selectedPlanForPricing) return
    
    // Determine final price: use input if provided; else keep current
    const priceValue = newAdminPrice ? Number(newAdminPrice) : selectedPlanForPricing.adminPrice
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('Please enter a valid admin price or leave it unchanged.')
      return
    }

    setIsLoadingPricing(true)
    try {
      const response = await adminApiService.updateOtoBillDataPlanPricing(
        selectedPlanForPricing.planId,
        priceValue,
        typeof newIsActive === 'boolean' ? newIsActive : undefined
      )

      if (response.success) {
        setDataPlansWithPricing(prev => prev.map(plan => 
          plan.planId === selectedPlanForPricing.planId ? {
            ...plan,
            adminPrice: response.data.adminPrice,
            profit: response.data.profit,
            isActive: response.data.isActive
          } : plan
        ))
        setShowPricingModal(false)
        setSelectedPlanForPricing(null)
        setNewAdminPrice('')
        setNewIsActive(null)
        toast.success('Data plan updated successfully!')
        fetchPricingSummary()
      } else {
        toast.error(response.message || 'Failed to update plan')
      }
    } catch (error: any) {
      console.error('Error updating pricing:', error)
      toast.error(error.message || 'Failed to update plan. Please try again.')
    } finally {
      setIsLoadingPricing(false)
    }
  }

  const getProfitColor = (profit: number) => {
    if (profit > 0) return 'text-green-600'
    if (profit < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getProfitIcon = (profit: number) => {
    if (profit > 0) return '↗️'
    if (profit < 0) return '↘️'
    return '→'
  }

  const clearFilters = () => {
    setSelectedNetwork(null)
    setSelectedPlanType('')
    setSearchTerm('')
    setCurrentPage(1)
    // The useEffect will automatically fetch all data plans when filters are cleared
  }

  const filteredPlansWithPricing = dataPlansWithPricing.filter(plan => {
    if (!searchTerm) return true
    return plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  })

  // Use dataPlansWithPricing for all cases since we now fetch all plans with pricing
  const getDisplayPlans = () => {
    return filteredPlansWithPricing
  }

  // Helper function to get plan ID
  const getPlanId = (plan: OtoBillDataPlan | OtoBillDataPlanWithPricing) => {
    return plan.planId
  }

  // Helper function to get plan price
  const getPlanPrice = (plan: OtoBillDataPlan | OtoBillDataPlanWithPricing) => {
    if ('adminPrice' in plan) {
      return plan.adminPrice
    }
    return plan.price
  }

  // Helper function to get formatted price
  const getFormattedPrice = (plan: OtoBillDataPlan | OtoBillDataPlanWithPricing) => {
    if ('formattedPrice' in plan) {
      return plan.formattedPrice
    }
    return `₦${getPlanPrice(plan).toLocaleString()}`
  }

  // Helper function to get profit
  const getPlanProfit = (plan: OtoBillDataPlan | OtoBillDataPlanWithPricing) => {
    if ('profit' in plan) {
      return plan.profit
    }
    return 0
  }

  // Helper function to get formatted profit
  const getFormattedProfit = (plan: OtoBillDataPlan | OtoBillDataPlanWithPricing) => {
    if ('formattedProfit' in plan) {
      return plan.formattedProfit
    }
    const profit = getPlanProfit(plan)
    return profit > 0 ? `+₦${profit.toLocaleString()}` : `₦${profit.toLocaleString()}`
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const refreshData = () => {
    fetchDataPlansWithPricing()
  }

  const getNetworkLogo = (networkName: string) => {
    const logos: { [key: string]: string } = {
      'MTN': '🟡',
      'AIRTEL': '🔴',
      'GLO': '🟢',
      '9MOBILE': '🟢'
    }
    return logos[networkName] || '📱'
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
            Total Plans: <span className="font-semibold text-gray-900">{totalPlans}</span>
          </div>
          <Button
            onClick={refreshData}
            disabled={isLoadingPricing}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingPricing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Pricing Summary */}
      {pricingSummary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Networks</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pricingSummary.networks.active}/{pricingSummary.networks.total}
                  </p>
                  <p className="text-xs text-gray-500">Active/Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Wifi className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Data Plans</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pricingSummary.dataPlans.visible}/{pricingSummary.dataPlans.total}
                  </p>
                  <p className="text-xs text-gray-500">Visible/Total</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Airtime Pricing</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {pricingSummary.airtimePricing.active}/{pricingSummary.airtimePricing.total}
                  </p>
                  <p className="text-xs text-gray-500">Active/Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Filters & Search
          </CardTitle>
          <CardDescription>
            Filter data plans by network and plan type
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
                      <span className="text-lg">{getNetworkLogo(selectedNetwork.name)}</span>
                      <span className="font-medium">{selectedNetwork.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Select Network</span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showNetworkDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showNetworkDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {isLoadingNetworks ? (
                    <div className="p-3 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent mx-auto mb-2"></div>
                      Loading networks...
                    </div>
                  ) : (
                    <>
                      {networks.map((network) => (
                        <button
                          key={network.id}
                          onClick={() => handleNetworkSelect(network)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-lg">{getNetworkLogo(network.name)}</span>
                          <span className="font-medium">{network.name}</span>
                          <span className={`ml-auto w-2 h-2 rounded-full ${network.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                        </button>
                      ))}
                    </>
                  )}
                </motion.div>
              )}
            </div>

            {/* Plan Type Filter */}
            <div className="relative">
              <button
                onClick={() => setShowPlanTypeDropdown(!showPlanTypeDropdown)}
                className="w-full flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
                disabled={!selectedNetwork}
              >
                <div className="flex items-center gap-2">
                  {selectedPlanType ? (
                    <span className="font-medium">{selectedPlanType}</span>
                  ) : (
                    <span className="text-gray-500">
                      {selectedNetwork ? 'Select Plan Type' : 'Select Network First'}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPlanTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showPlanTypeDropdown && selectedNetwork && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
                >
                  {availablePlanTypes.map((planType) => (
                    <button
                      key={planType}
                      onClick={() => handlePlanTypeSelect(planType)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-medium">{planType}</span>
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

      {/* View Mode Toggle */}
      {dataPlansWithPricing.length > 0 ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">View Mode:</span>
            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('card')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'card' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Pagination Info */}
          <div className="text-sm text-gray-500">
            {selectedNetwork && selectedPlanType ? (
              `Page ${currentPage} of ${totalPages} • ${totalPlans} total plans`
            ) : selectedNetwork ? (
              `${totalPlans} total plans for ${selectedNetwork.name}`
            ) : (
              `${totalPlans} total plans across all networks`
            )}
          </div>
        </div>
      ) : null}

      {/* Data Plans Display */}
      {dataPlansWithPricing.length > 0 ? (
        <div className="space-y-6">
          {/* Network Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {selectedNetwork && (
                  <span className="text-2xl">{getNetworkLogo(selectedNetwork.name)}</span>
                )}
                <span>
                  {selectedNetwork && selectedPlanType 
                    ? `${selectedNetwork.name} ${selectedPlanType} Data Plans`
                    : selectedNetwork 
                    ? `${selectedNetwork.name} Data Plans`
                    : 'All Data Plans'
                  }
                </span>
                <span className="text-base font-normal text-gray-500">
                  ({totalPlans} plans)
                </span>
              </CardTitle>
              <CardDescription>
                {selectedNetwork && selectedPlanType 
                  ? `Manage ${selectedNetwork.name} ${selectedPlanType} data plan pricing and availability`
                  : selectedNetwork 
                  ? `Manage ${selectedNetwork.name} data plan pricing and availability`
                  : 'Manage data plan pricing and availability across all networks'
                }
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Loading State */}
          {isLoadingPricing && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500">Loading data plans with pricing...</p>
              </CardContent>
            </Card>
          )}

          {/* Data Plans Content */}
          {!isLoadingPricing && (
            <>
              {/* Card View */}
              {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {dataPlansWithPricing.map((plan) => (
                    <motion.div
                      key={plan.planId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 text-base">
                            {plan.name}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {plan.planType} • {plan.validityDays} days
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {plan.name.includes('GB') ? plan.name.split(' ')[0] : plan.name.split(' ')[0]}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {plan.validityDays} days
                            </span>
                          </div>
                          
                          {/* Pricing Information */}
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Original Price:</span>
                              <span className="font-medium text-gray-900">₦{plan.originalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Admin Price:</span>
                              <span className="font-medium text-primary">₦{plan.adminPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Profit:</span>
                              <span className={`font-medium ${getProfitColor(plan.profit)}`}>
                                {getProfitIcon(plan.profit)} ₦{plan.profit.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => handlePricingEditStart(plan)}
                            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                            title="Edit Pricing"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Status Indicator */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${plan.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="text-xs text-gray-500">
                            {plan.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Last synced: {new Date(plan.lastSynced).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Plan Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Validity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Original Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Admin Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Profit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {dataPlansWithPricing.map((plan) => (
                            <tr key={plan.planId} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                                <div className="text-sm text-gray-500">ID: {plan.planId}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {plan.planType}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {plan.validityDays} days
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ₦{plan.originalPrice.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-primary">
                                  ₦{plan.adminPrice.toLocaleString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`font-medium ${getProfitColor(plan.profit)}`}>
                                  {getProfitIcon(plan.profit)} ₦{plan.profit.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${plan.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                  <span className="text-sm text-gray-900">
                                    {plan.isActive ? 'Active' : 'Inactive'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handlePricingEditStart(plan)}
                                  className="text-blue-600 hover:text-blue-700"
                                  title="Edit Pricing"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Showing page {currentPage} of {totalPages}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={!hasPrev || isLoadingPricing}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!hasNext || isLoadingPricing}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      ) : (
        /* Comprehensive Overview - All Networks and Plan Types */
        <div className="space-y-6">
          {/* Overview Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Wifi className="w-6 h-6" />
                <span>All Networks Data Plans Overview</span>
                <span className="text-base font-normal text-gray-500">
                  ({totalPlans} total plans)
                </span>
              </CardTitle>
              <CardDescription>
                Comprehensive view of all data plans across all networks and plan types
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Loading State */}
          {isLoadingPricing && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500">Loading all data plans...</p>
              </CardContent>
            </Card>
          )}

          {/* All Data Plans Content */}
          {!isLoadingPricing && getDisplayPlans().length > 0 && (
            <>
              {/* Card View */}
              {viewMode === 'card' && (
                <div className="space-y-8">
                  {/* Group by Network */}
                  {Array.from(new Set(getDisplayPlans().map(plan => plan.networkName))).map((networkName) => (
                    <div key={networkName} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getNetworkLogo(networkName)}</span>
                        <h3 className="text-xl font-semibold text-gray-900">{networkName}</h3>
                      </div>
                      
                      {/* Group by Plan Type within Network */}
                      {Array.from(new Set(getDisplayPlans().filter(plan => plan.networkName === networkName).map(plan => plan.planType))).map((planType) => {
                        const networkTypePlans = getDisplayPlans().filter(plan => 
                          plan.networkName === networkName && plan.planType === planType
                        )
                        
                        return (
                          <div key={`${networkName}-${planType}`} className="ml-6 space-y-3">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                              <Wifi className="w-4 h-4 text-primary" />
                              <span className="font-semibold text-gray-700">{planType} Plans</span>
                              <span className="text-sm text-gray-500">({networkTypePlans.length})</span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {networkTypePlans.map((plan) => (
                                <motion.div
                                  key={getPlanId(plan)}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors bg-white"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 text-base">
                                        {plan.name}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        {plan.planType} • {plan.validityDays} days
                                      </div>
                                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                                        <span className="flex items-center gap-1">
                                          <Download className="w-3 h-3" />
                                          {plan.name.includes('GB') ? plan.name.split(' ')[0] : plan.name.split(' ')[0]}
                                        </span>
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {plan.validityDays} days
                                        </span>
                                      </div>
                                      
                                      {/* Pricing Information - Show if available */}
                                      {'adminPrice' in plan && (
                                        <div className="mt-3 space-y-2">
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Original Price:</span>
                                            <span className="font-medium text-gray-900">₦{plan.originalPrice.toLocaleString()}</span>
                                          </div>
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Admin Price:</span>
                                            <span className="font-medium text-primary">₦{plan.adminPrice.toLocaleString()}</span>
                                          </div>
                                          <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Profit:</span>
                                            <span className={`font-medium ${getProfitColor(plan.profit)}`}>
                                              {getProfitIcon(plan.profit)} ₦{plan.profit.toLocaleString()}
                                            </span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-3">
                                      <div className="text-right">
                                        <div className="font-bold text-primary text-base">
                                          {getFormattedPrice(plan)}
                                        </div>
                                        {'profit' in plan && getPlanProfit(plan) > 0 && (
                                          <div className="text-xs text-green-600">
                                            +{getFormattedProfit(plan)}
                                          </div>
                                        )}
                                      </div>
                                      <button
                                        onClick={() => handleOpenPricingModalForPlan(plan)}
                                        className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                                        title="Edit Pricing"
                                      >
                                        <Edit className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}

              {/* Table View */}
              {viewMode === 'table' && (
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Network
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Plan Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Validity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            {getDisplayPlans().some(plan => 'adminPrice' in plan) && (
                              <>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Admin Price
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Profit
                                </th>
                              </>
                            )}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {getDisplayPlans().map((plan) => (
                            <tr key={getPlanId(plan)} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{getNetworkLogo(plan.networkName)}</span>
                                  <span className="text-sm font-medium text-gray-900">{plan.networkName}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                                <div className="text-sm text-gray-500">ID: {getPlanId(plan)}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {plan.planType}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {plan.validityDays} days
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {getFormattedPrice(plan)}
                              </td>
                              {getDisplayPlans().some(p => 'adminPrice' in p) && (
                                <>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {'adminPrice' in plan ? `₦${plan.adminPrice.toLocaleString()}` : '-'}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {'profit' in plan ? (
                                      <span className={`font-medium ${getProfitColor(plan.profit)}`}>
                                        {getProfitIcon(plan.profit)} ₦{plan.profit.toLocaleString()}
                                      </span>
                                    ) : '-'}
                                  </td>
                                </>
                              )}
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                  onClick={() => handleOpenPricingModalForPlan(plan)}
                                  className="text-blue-600 hover:text-blue-700"
                                  title="Edit Price"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* No Data State */}
          {!isLoadingPricing && getDisplayPlans().length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Plans Available</h3>
                <p className="text-gray-500 mb-4">
                  No data plans are currently available. Please check your API connection or try refreshing.
                </p>
                <Button onClick={refreshData}>Refresh Data</Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* No Results State */}
      {!isLoadingPricing && filteredPlansWithPricing.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Plans Found</h3>
            <p className="text-gray-500 mb-4">
              No data plans match your search term "{searchTerm}". Try adjusting your search criteria.
            </p>
            <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
          </CardContent>
        </Card>
      )}

      {/* Pricing Edit Modal */}
      {showPricingModal && selectedPlanForPricing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md mx-4 w-full">
            <div className="space-y-6">
              {/* Header */}
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Data Plan Pricing</h3>
                <p className="text-sm text-gray-600">Update pricing for {selectedPlanForPricing.name}</p>
              </div>

              {/* Plan Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Network:</span>
                      <p className="font-medium text-gray-900">{selectedPlanForPricing.networkName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Plan Type:</span>
                      <p className="font-medium text-gray-900">{selectedPlanForPricing.planType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Plan Name:</span>
                      <p className="font-medium text-gray-900">{selectedPlanForPricing.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Validity:</span>
                      <p className="font-medium text-gray-900">{selectedPlanForPricing.validityDays} days</p>
                    </div>
                  </div>
                </div>

                {/* Current Pricing Display */}
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Current Pricing</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Original Price:</span>
                      <span className="text-lg font-bold text-gray-900">₦{selectedPlanForPricing.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Current Admin Price:</span>
                      <span className="text-lg font-bold text-primary">₦{selectedPlanForPricing.adminPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Current Profit:</span>
                      <span className={`text-lg font-bold ${getProfitColor(selectedPlanForPricing.profit)}`}>
                        {getProfitIcon(selectedPlanForPricing.profit)} ₦{selectedPlanForPricing.profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* New Admin Price Input */}
                                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-gray-700">
                     New Admin Price (₦)
                   </label>
                   <Input
                     type="number"
                     value={newAdminPrice}
                     onChange={(e) => setNewAdminPrice(e.target.value)}
                     placeholder="Enter new admin price"
                     min="1"
                     className="text-lg font-medium"
                   />
                 </div>

                 {/* Active Toggle */}
                 <div className="space-y-2">
                   <label className="block text-sm font-medium text-gray-700">Active Status</label>
                   <div className="flex items-center gap-3">
                     <button
                       type="button"
                       onClick={() => setNewIsActive(true)}
                       className={`px-3 py-1 rounded-md text-sm border ${newIsActive === true ? 'bg-green-600 text-white border-green-700' : 'bg-white text-gray-700 border-gray-300'}`}
                     >
                       Active
                     </button>
                     <button
                       type="button"
                       onClick={() => setNewIsActive(false)}
                       className={`px-3 py-1 rounded-md text-sm border ${newIsActive === false ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-700 border-gray-300'}`}
                     >
                       Inactive
                     </button>
                   </div>
                   <p className="text-xs text-gray-500">You can toggle status without changing the price.</p>
                 </div>

                                 {/* Preview of New Profit */}
                 {newAdminPrice && Number(newAdminPrice) > 0 && (
                   <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                     <div className="flex items-center justify-between">
                       <span className="text-sm font-medium text-gray-700">New Profit:</span>
                       <span className={`text-lg font-bold ${getProfitColor(Number(newAdminPrice) - selectedPlanForPricing.originalPrice)}`}>
                         {getProfitIcon(Number(newAdminPrice) - selectedPlanForPricing.originalPrice)} ₦{(Number(newAdminPrice) - selectedPlanForPricing.originalPrice).toLocaleString()}
                       </span>
                     </div>
                     <div className="text-xs text-gray-600 mt-1">
                       {Number(newAdminPrice) > selectedPlanForPricing.originalPrice 
                         ? `Profit margin: ${(((Number(newAdminPrice) - selectedPlanForPricing.originalPrice) / selectedPlanForPricing.originalPrice) * 100).toFixed(1)}%`
                         : 'This will result in a loss'
                       }
                     </div>
                   </div>
                 )}

                 {/* Warning for loss */}
                 {newAdminPrice && Number(newAdminPrice) > 0 && Number(newAdminPrice) < selectedPlanForPricing.originalPrice && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">⚠️</span>
                      <span className="text-sm text-red-700">
                        <strong>Warning:</strong> The new admin price is lower than the original price. This will result in a loss.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  onClick={handlePricingEditCancel}
                  variant="outline"
                  disabled={isLoadingPricing}
                >
                  Cancel
                </Button>
                                 <Button
                   onClick={handlePricingEditSave}
                   disabled={isLoadingPricing}
                   className="bg-primary hover:bg-primary/90"
                 >
                   {isLoadingPricing ? 'Updating...' : 'Update Pricing'}
                 </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

export default DataPlans
