import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wifi, Edit, ChevronDown, Search,
  Clock, Download, Settings, Grid, List, RefreshCw,
  Plus, Trash2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'
import { adminApiService } from '../../services/adminApi'
import { 
  DataPlan
} from '../../types'

type ViewMode = 'card' | 'table'

interface Network {
  id: string
  name: string
  status: string
  isActive: boolean
}

const DataPlans: React.FC = () => {
  // State for networks and data plans
  const [networks, setNetworks] = useState<Network[]>([])
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([])
  const [isLoadingNetworks, setIsLoadingNetworks] = useState(false)
  const [isLoadingPlans, setIsLoadingPlans] = useState(false)
  
  // Filter states
  const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null)
  const [selectedPlanType, setSelectedPlanType] = useState<string>('')
  const [availablePlanTypes, setAvailablePlanTypes] = useState<string[]>([])
  const [isLoadingPlanTypes, setIsLoadingPlanTypes] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  // UI states
  const [showNetworkDropdown, setShowNetworkDropdown] = useState(false)
  const [showPlanTypeDropdown, setShowPlanTypeDropdown] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('card')
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null)
  const [newAdminPrice, setNewAdminPrice] = useState<string>('')
  const [newIsActive, setNewIsActive] = useState<boolean | null>(null)
  
  // Create modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createFormData, setCreateFormData] = useState({
    planId: '',
    name: '',
    networkName: '',
    planType: '',
    dataSize: '',
    validityDays: '',
    originalPrice: '',
    adminPrice: '',
    isActive: true
  })
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<DataPlan | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPlans, setTotalPlans] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [hasPrev, setHasPrev] = useState(false)

  // Fetch networks on component mount
  useEffect(() => {
    fetchNetworks()
  }, [])

  // Fetch plan types when network changes
  useEffect(() => {
    if (selectedNetwork) {
      fetchPlanTypes(selectedNetwork.name)
    } else {
      setAvailablePlanTypes([])
      setSelectedPlanType('')
    }
  }, [selectedNetwork])

  // Fetch data plans when filters change
  useEffect(() => {
    fetchDataPlans()
  }, [selectedNetwork, selectedPlanType, currentPage])

  const fetchNetworks = async () => {
    setIsLoadingNetworks(true)
    try {
      const response = await adminApiService.getAychindodataNetworks()
      if (response.success && response.data) {
        setNetworks(response.data)
      } else {
        toast.error(response.message || 'Failed to fetch networks')
      }
    } catch (error: any) {
      console.error('Error fetching networks:', error)
      toast.error('Failed to fetch networks')
    } finally {
      setIsLoadingNetworks(false)
    }
  }

  const fetchPlanTypes = async (networkName: string) => {
    setIsLoadingPlanTypes(true)
    try {
      const response = await adminApiService.getPlanTypesByNetwork(networkName)
      if (response.success && response.data) {
        // Filter out "Standard" from plan types
        const filteredTypes = response.data.filter((type: string) => type !== 'Standard')
        setAvailablePlanTypes(filteredTypes)
      } else {
        console.warn('Failed to fetch plan types:', response.message)
      }
    } catch (error: any) {
      console.error('Error fetching plan types:', error)
    } finally {
      setIsLoadingPlanTypes(false)
    }
  }

  const fetchDataPlans = async () => {
    setIsLoadingPlans(true)
    try {
      let response
      if (selectedNetwork && selectedPlanType) {
        // Use specific endpoint for network and type
        response = await adminApiService.getPlansByNetworkAndType(
          selectedNetwork.name,
          selectedPlanType,
          currentPage,
          20
        )
      } else {
        // Use general endpoint with filters - ensure we only get plans from new API
        response = await adminApiService.getDataPlans({
          networkName: selectedNetwork?.name,
          planType: selectedPlanType || undefined,
          page: currentPage,
          limit: 20
        })
      }
      
      if (response.success && response.data) {
        // Filter out any plans with "Standard" plan type and ensure we only have new API plans
        const plans = (response.data.plans || []).filter((plan: DataPlan) => {
          // Exclude Standard plan type
          if (plan.planType === 'Standard') return false
          // Ensure plan has the required fields from new API structure
          return plan.id && plan.planId
        })
        
        setDataPlans(plans)
        if (response.data.pagination) {
          setTotalPages(response.data.pagination.pages || 1)
          // Use filtered count for display, but keep pagination info from API
          setTotalPlans(plans.length)
          setHasNext(response.data.pagination.hasNext || false)
          setHasPrev(response.data.pagination.hasPrev || false)
        }
      } else {
        toast.error(response.message || 'Failed to fetch data plans')
      }
    } catch (error: any) {
      console.error('Error fetching data plans:', error)
      toast.error(error.message || 'Failed to fetch data plans')
    } finally {
      setIsLoadingPlans(false)
    }
  }

  const handleNetworkSelect = (network: Network) => {
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
  // Edit handlers
  const handleEditPlan = (plan: DataPlan) => {
    setSelectedPlan(plan)
    setNewAdminPrice('')
    setNewIsActive(plan.isActive)
    setShowEditModal(true)
  }

  const handleEditCancel = () => {
    setShowEditModal(false)
    setSelectedPlan(null)
    setNewAdminPrice('')
    setNewIsActive(null)
  }

  const handleEditSave = async () => {
    if (!selectedPlan) return
    
    const priceValue = newAdminPrice ? Number(newAdminPrice) : selectedPlan.adminPrice
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error('Please enter a valid admin price or leave it unchanged.')
      return
    }

    setIsLoadingPlans(true)
    try {
      const updateData: any = {}
      if (newAdminPrice) updateData.adminPrice = priceValue
      if (typeof newIsActive === 'boolean') updateData.isActive = newIsActive

      const response = await adminApiService.updateDataPlan(selectedPlan.planId, updateData)

      if (response.success && response.data) {
        setDataPlans(prev => prev.map(plan => 
          plan.id === selectedPlan.id ? response.data : plan
        ))
        setShowEditModal(false)
        setSelectedPlan(null)
        setNewAdminPrice('')
        setNewIsActive(null)
        toast.success('Data plan updated successfully!')
        fetchDataPlans()
      } else {
        toast.error(response.message || 'Failed to update plan')
      }
    } catch (error: any) {
      console.error('Error updating plan:', error)
      if (error.message?.includes('404')) {
        toast.error('Data plan not found')
      } else {
        toast.error(error.message || 'Failed to update plan. Please try again.')
      }
    } finally {
      setIsLoadingPlans(false)
    }
  }

  // Create handlers
  const handleCreatePlan = () => {
    setCreateFormData({
      planId: '',
      name: '',
      networkName: '',
      planType: '',
      dataSize: '',
      validityDays: '',
      originalPrice: '',
      adminPrice: '',
      isActive: true
    })
    setShowCreateModal(true)
  }

  const handleCreateCancel = () => {
    setShowCreateModal(false)
    setCreateFormData({
      planId: '',
      name: '',
      networkName: '',
      planType: '',
      dataSize: '',
      validityDays: '',
      originalPrice: '',
      adminPrice: '',
      isActive: true
    })
  }

  const handleCreateSave = async () => {
    // Validation
    if (!createFormData.planId || !createFormData.name || !createFormData.networkName || 
        !createFormData.planType || !createFormData.dataSize || !createFormData.validityDays ||
        !createFormData.originalPrice || !createFormData.adminPrice) {
      toast.error('Please fill in all required fields')
      return
    }

    const validityDays = Number(createFormData.validityDays)
    const originalPrice = Number(createFormData.originalPrice)
    const adminPrice = Number(createFormData.adminPrice)

    if (isNaN(validityDays) || validityDays <= 0) {
      toast.error('Please enter a valid validity days (must be greater than 0)')
      return
    }

    if (isNaN(originalPrice) || originalPrice <= 0) {
      toast.error('Please enter a valid original price (must be greater than 0)')
      return
    }

    if (isNaN(adminPrice) || adminPrice <= 0) {
      toast.error('Please enter a valid admin price (must be greater than 0)')
      return
    }

    setIsCreating(true)
    try {
      const response = await adminApiService.createDataPlan({
        planId: createFormData.planId,
        name: createFormData.name,
        networkName: createFormData.networkName,
        planType: createFormData.planType,
        dataSize: createFormData.dataSize,
        validityDays,
        originalPrice,
        adminPrice,
        isActive: createFormData.isActive
      })

      if (response.success && response.data) {
        toast.success('Data plan created successfully!')
        setShowCreateModal(false)
        handleCreateCancel()
        fetchDataPlans()
      } else {
        toast.error(response.message || 'Failed to create plan')
      }
    } catch (error: any) {
      console.error('Error creating plan:', error)
      if (error.message?.includes('409')) {
        toast.error('Data plan with this Plan ID already exists')
      } else {
        toast.error(error.message || 'Failed to create plan. Please try again.')
      }
    } finally {
      setIsCreating(false)
    }
  }

  // Delete handlers
  const handleDeletePlan = (plan: DataPlan) => {
    setPlanToDelete(plan)
    setShowDeleteModal(true)
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
    setPlanToDelete(null)
  }

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return

    setIsDeleting(true)
    try {
      const response = await adminApiService.deleteDataPlan(planToDelete.id)

      if (response.success) {
        toast.success('Data plan deleted successfully!')
        setShowDeleteModal(false)
        setPlanToDelete(null)
        fetchDataPlans()
      } else {
        toast.error(response.message || 'Failed to delete plan')
      }
    } catch (error: any) {
      console.error('Error deleting plan:', error)
      if (error.message?.includes('404')) {
        toast.error('Data plan not found')
      } else {
        toast.error(error.message || 'Failed to delete plan. Please try again.')
      }
    } finally {
      setIsDeleting(false)
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
  }

  const filteredPlans = dataPlans.filter(plan => {
    if (!searchTerm) return true
    return plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           plan.planId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           plan.networkName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const refreshData = () => {
    fetchDataPlans()
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
            onClick={handleCreatePlan}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4" />
            Create Data Plan
          </Button>
          <Button
            onClick={refreshData}
            disabled={isLoadingPlans}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingPlans ? 'animate-spin' : ''}`} />
            Refresh
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
                disabled={!selectedNetwork || isLoadingPlanTypes}
              >
                <div className="flex items-center gap-2">
                  {isLoadingPlanTypes ? (
                    <span className="text-gray-500">Loading types...</span>
                  ) : selectedPlanType ? (
                    <span className="font-medium">{selectedPlanType}</span>
                  ) : (
                    <span className="text-gray-500">
                      {selectedNetwork ? 'Select Plan Type' : 'Select Network First'}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPlanTypeDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {showPlanTypeDropdown && selectedNetwork && !isLoadingPlanTypes && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  {availablePlanTypes.length > 0 ? (
                    availablePlanTypes.map((planType) => (
                      <button
                        key={planType}
                        onClick={() => handlePlanTypeSelect(planType)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium">{planType}</span>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-center text-gray-500">
                      No plan types available
                    </div>
                  )}
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
      {filteredPlans.length > 0 ? (
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
      {filteredPlans.length > 0 ? (
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
          {isLoadingPlans && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-gray-500">Loading data plans...</p>
              </CardContent>
            </Card>
          )}

          {/* Data Plans Content */}
          {!isLoadingPlans && (
            <>
              {/* Card View */}
              {viewMode === 'card' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPlans.map((plan) => (
                    <motion.div
                      key={plan.id}
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
                              {plan.dataSize}
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
                            onClick={() => handleEditPlan(plan)}
                            className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                            title="Edit Plan"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlan(plan)}
                            className="p-1 text-red-600 hover:text-red-700 transition-colors"
                            title="Delete Plan"
                          >
                            <Trash2 className="w-4 h-4" />
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
                          Plan ID: {plan.planId}
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
                          {filteredPlans.map((plan) => (
                            <tr key={plan.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{plan.name}</div>
                                <div className="text-sm text-gray-500">Plan ID: {plan.planId}</div>
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
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleEditPlan(plan)}
                                    className="text-blue-600 hover:text-blue-700"
                                    title="Edit Plan"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeletePlan(plan)}
                                    className="text-red-600 hover:text-red-700"
                                    title="Delete Plan"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
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
                          disabled={!hasPrev || isLoadingPlans}
                        >
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!hasNext || isLoadingPlans}
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
        /* No Data State */
        <Card>
          <CardContent className="text-center py-12">
            <Wifi className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Plans Available</h3>
            <p className="text-gray-500 mb-4">
              {isLoadingPlans ? 'Loading data plans...' : 'No data plans are currently available. Please check your API connection or try refreshing.'}
            </p>
            <Button onClick={refreshData}>Refresh Data</Button>
          </CardContent>
        </Card>
      )}

      {/* No Results State */}
      {!isLoadingPlans && filteredPlans.length === 0 && searchTerm && (
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

      {/* Edit Modal */}
      {showEditModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleEditCancel}>
          <Card className="p-6 max-w-md mx-4 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Data Plan</h3>
                <p className="text-sm text-gray-600">Update pricing for {selectedPlan.name}</p>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Network:</span>
                      <p className="font-medium text-gray-900">{selectedPlan.networkName}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Plan Type:</span>
                      <p className="font-medium text-gray-900">{selectedPlan.planType}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Plan Name:</span>
                      <p className="font-medium text-gray-900">{selectedPlan.name}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Plan ID:</span>
                      <p className="font-medium text-gray-900">{selectedPlan.planId}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">MongoDB ID:</span>
                      <p className="font-medium text-gray-900 text-xs break-all">{selectedPlan.id}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Current Pricing</h4>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Original Price:</span>
                      <span className="text-lg font-bold text-gray-900">₦{selectedPlan.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Current Admin Price:</span>
                      <span className="text-lg font-bold text-primary">₦{selectedPlan.adminPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Current Profit:</span>
                      <span className={`text-lg font-bold ${getProfitColor(selectedPlan.profit)}`}>
                        {getProfitIcon(selectedPlan.profit)} ₦{selectedPlan.profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">New Admin Price (₦)</label>
                  <Input
                    type="number"
                    value={newAdminPrice}
                    onChange={(e) => setNewAdminPrice(e.target.value)}
                    placeholder="Enter new admin price"
                    min="1"
                    className="text-lg font-medium"
                  />
                </div>
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
                </div>
                {newAdminPrice && Number(newAdminPrice) > 0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">New Profit:</span>
                      <span className={`text-lg font-bold ${getProfitColor(Number(newAdminPrice) - selectedPlan.originalPrice)}`}>
                        {getProfitIcon(Number(newAdminPrice) - selectedPlan.originalPrice)} ₦{(Number(newAdminPrice) - selectedPlan.originalPrice).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button onClick={handleEditCancel} variant="outline" disabled={isLoadingPlans}>
                  Cancel
                </Button>
                <Button onClick={handleEditSave} disabled={isLoadingPlans} className="bg-primary hover:bg-primary/90">
                  {isLoadingPlans ? 'Updating...' : 'Update Plan'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleCreateCancel}>
          <Card className="p-6 max-w-2xl mx-4 w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Create New Data Plan</h3>
                <p className="text-sm text-gray-600">Add a new data plan to the system</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Plan ID *</label>
                  <Input
                    type="text"
                    value={createFormData.planId}
                    onChange={(e) => setCreateFormData({...createFormData, planId: e.target.value})}
                    placeholder="e.g., 9"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Plan Name *</label>
                  <Input
                    type="text"
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({...createFormData, name: e.target.value})}
                    placeholder="e.g., 230MB"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Network Name *</label>
                  <select
                    value={createFormData.networkName}
                    onChange={async (e) => {
                      const networkName = e.target.value
                      setCreateFormData({...createFormData, networkName, planType: ''})
                      if (networkName) {
                        try {
                          const response = await adminApiService.getPlanTypesByNetwork(networkName)
                          if (response.success && response.data) {
                            // Filter out "Standard" from plan types
                            const filteredTypes = response.data.filter((type: string) => type !== 'Standard')
                            setAvailablePlanTypes(filteredTypes)
                          }
                        } catch (error) {
                          console.error('Error fetching plan types:', error)
                        }
                      }
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Network</option>
                    {networks.map((network) => (
                      <option key={network.id} value={network.name}>{network.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Plan Type *</label>
                  <Input
                    type="text"
                    value={createFormData.planType}
                    onChange={(e) => setCreateFormData({...createFormData, planType: e.target.value})}
                    placeholder="e.g., SME, Gifting, Corporate"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Data Size *</label>
                  <Input
                    type="text"
                    value={createFormData.dataSize}
                    onChange={(e) => setCreateFormData({...createFormData, dataSize: e.target.value})}
                    placeholder="e.g., 230MB"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Validity Days *</label>
                  <Input
                    type="number"
                    value={createFormData.validityDays}
                    onChange={(e) => setCreateFormData({...createFormData, validityDays: e.target.value})}
                    placeholder="e.g., 1"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Original Price (₦) *</label>
                  <Input
                    type="number"
                    value={createFormData.originalPrice}
                    onChange={(e) => setCreateFormData({...createFormData, originalPrice: e.target.value})}
                    placeholder="e.g., 196"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Admin Price (₦) *</label>
                  <Input
                    type="number"
                    value={createFormData.adminPrice}
                    onChange={(e) => setCreateFormData({...createFormData, adminPrice: e.target.value})}
                    placeholder="e.g., 250"
                    min="1"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Active Status</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setCreateFormData({...createFormData, isActive: true})}
                      className={`px-3 py-1 rounded-md text-sm border ${createFormData.isActive === true ? 'bg-green-600 text-white border-green-700' : 'bg-white text-gray-700 border-gray-300'}`}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      onClick={() => setCreateFormData({...createFormData, isActive: false})}
                      className={`px-3 py-1 rounded-md text-sm border ${createFormData.isActive === false ? 'bg-red-600 text-white border-red-700' : 'bg-white text-gray-700 border-gray-300'}`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button onClick={handleCreateCancel} variant="outline" disabled={isCreating}>
                  Cancel
                </Button>
                <Button onClick={handleCreateSave} disabled={isCreating} className="bg-primary hover:bg-primary/90">
                  {isCreating ? 'Creating...' : 'Create Plan'}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && planToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={handleDeleteCancel}>
          <Card className="p-6 max-w-md mx-4 w-full" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-900">Delete Data Plan</h3>
                <p className="text-sm text-gray-600">Are you sure you want to delete this data plan?</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="font-medium text-gray-900">{planToDelete.name}</p>
                  <p className="text-sm text-gray-600">Network: {planToDelete.networkName}</p>
                  <p className="text-sm text-gray-600">Plan ID: {planToDelete.planId}</p>
                  <p className="text-sm text-red-600 font-medium mt-2">This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button onClick={handleDeleteCancel} variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
                <Button onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                  {isDeleting ? 'Deleting...' : 'Delete Plan'}
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
