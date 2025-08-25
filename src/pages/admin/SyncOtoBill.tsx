import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  RefreshCw, Wifi, Smartphone, AlertTriangle, CheckCircle,
  Download, Upload, Settings
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { adminApiService } from '../../services/adminApi'

interface SyncResponse {
  success: boolean
  message: string
  data?: {
    totalSynced: number
    totalCreated: number
    totalUpdated: number
    totalSkipped: number
    message: string
  }
}

const SyncOtoBill: React.FC = () => {
  const [isSyncingDataPlans, setIsSyncingDataPlans] = useState(false)
  const [isSyncingAirtime, setIsSyncingAirtime] = useState(false)
  const [showDataPlansModal, setShowDataPlansModal] = useState(false)
  const [showAirtimeModal, setShowAirtimeModal] = useState(false)
  const [lastSyncResult, setLastSyncResult] = useState<{
    type: 'data-plans' | 'airtime'
    result: SyncResponse
    timestamp: Date
  } | null>(null)

  const handleSyncDataPlans = async () => {
    setIsSyncingDataPlans(true)
    setShowDataPlansModal(false)
    
    try {
      const response = await adminApiService.syncOtoBillDataPlans()
      
      if (response.success) {
        toast.success('Data plans sync completed successfully!')
        setLastSyncResult({
          type: 'data-plans',
          result: response,
          timestamp: new Date()
        })
      } else {
        toast.error(`Sync failed: ${response.message}`)
      }
    } catch (error: any) {
      console.error('Error syncing data plans:', error)
      toast.error(`Sync failed: ${error.message || 'Unknown error occurred'}`)
    } finally {
      setIsSyncingDataPlans(false)
    }
  }

  const handleSyncAirtime = async () => {
    setIsSyncingAirtime(true)
    setShowAirtimeModal(false)
    
    try {
      const response = await adminApiService.syncOtoBillAirtimePricing()
      
      if (response.success) {
        toast.success('Airtime pricing sync completed successfully!')
        setLastSyncResult({
          type: 'airtime',
          result: response,
          timestamp: new Date()
        })
      } else {
        toast.error(`Sync failed: ${response.message}`)
      }
    } catch (error: any) {
      console.error('Error syncing airtime pricing:', error)
      toast.error(`Sync failed: ${error.message || 'Unknown error occurred'}`)
    } finally {
      setIsSyncingAirtime(false)
    }
  }

  const formatTimestamp = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-primary" />
            Sync from OtoBill
          </h1>
          <p className="text-gray-600">Synchronize data plans and airtime pricing from OtoBill API</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-base text-gray-500">
            Last Sync: {lastSyncResult ? formatTimestamp(lastSyncResult.timestamp) : 'Never'}
          </div>
        </div>
      </div>

      {/* Sync Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Data Plans Sync Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Wifi className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">Sync Data Plans</CardTitle>
                    <CardDescription className="text-gray-600">
                      Synchronize all data plans from OtoBill
                    </CardDescription>
                  </div>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Download className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Updates existing plans with latest pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Adds new plans from OtoBill</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Maintains plan availability status</span>
                </div>
              </div>
              
              <Button
                onClick={() => setShowDataPlansModal(true)}
                disabled={isSyncingDataPlans}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSyncingDataPlans ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Data Plans
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Airtime Pricing Sync Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Smartphone className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900">Sync Airtime Pricing</CardTitle>
                    <CardDescription className="text-gray-600">
                      Synchronize airtime pricing from OtoBill
                    </CardDescription>
                  </div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Upload className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Updates airtime rates for all networks</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Ensures competitive pricing</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Maintains profit margins</span>
                </div>
              </div>
              
              <Button
                onClick={() => setShowAirtimeModal(true)}
                disabled={isSyncingAirtime}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                {isSyncingAirtime ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Airtime Pricing
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Last Sync Result */}
      {lastSyncResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Last Sync Result
              </CardTitle>
              <CardDescription>
                Details from the most recent synchronization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      lastSyncResult.type === 'data-plans' ? 'bg-blue-100' : 'bg-green-100'
                    }`}>
                      {lastSyncResult.type === 'data-plans' ? (
                        <Wifi className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Smartphone className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {lastSyncResult.type === 'data-plans' ? 'Data Plans' : 'Airtime Pricing'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimestamp(lastSyncResult.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {lastSyncResult.result.success ? 'Success' : 'Failed'}
                    </div>
                  </div>
                </div>

                {lastSyncResult.result.data && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {lastSyncResult.result.data.totalSynced}
                      </div>
                      <div className="text-xs text-gray-500">Total Synced</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {lastSyncResult.result.data.totalCreated}
                      </div>
                      <div className="text-xs text-gray-500">Created</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {lastSyncResult.result.data.totalUpdated}
                      </div>
                      <div className="text-xs text-gray-500">Updated</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {lastSyncResult.result.data.totalSkipped}
                      </div>
                      <div className="text-xs text-gray-500">Skipped</div>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    {lastSyncResult.result.data?.message || lastSyncResult.result.message}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-0 bg-blue-50 border border-blue-200">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Sync Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Sync operations will update your local database with the latest data from OtoBill</p>
                  <p>• Existing records will be updated with new information</p>
                  <p>• New records will be created for items not in your database</p>
                  <p>• The sync process is safe and won't delete any existing data</p>
                  <p>• Sync operations may take a few minutes to complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Plans Confirmation Modal */}
      {showDataPlansModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowDataPlansModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Sync</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to sync data plans from OtoBill? This will update your local database with the latest pricing and plan information.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowDataPlansModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSyncDataPlans}
                  disabled={isSyncingDataPlans}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSyncingDataPlans ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    'Yes, Sync'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Airtime Confirmation Modal */}
      {showAirtimeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAirtimeModal(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirm Sync</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Are you sure you want to sync airtime pricing from OtoBill? This will update your local database with the latest airtime rates for all networks.
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAirtimeModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSyncAirtime}
                  disabled={isSyncingAirtime}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSyncingAirtime ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Syncing...
                    </>
                  ) : (
                    'Yes, Sync'
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default SyncOtoBill
