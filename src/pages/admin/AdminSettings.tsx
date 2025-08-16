import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Settings, Save, ToggleLeft, ToggleRight, Banknote, Smartphone,
  AlertCircle, CheckCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import toast from 'react-hot-toast'

interface SystemSettings {
  maintenanceMode: boolean
  registrationEnabled: boolean
  walletFundingEnabled: boolean
  airtimeEnabled: boolean
  dataEnabled: boolean
  maxWalletBalance: number
  minTransactionAmount: number
  maxTransactionAmount: number
}

const AdminSettings: React.FC = () => {
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    maintenanceMode: false,
    registrationEnabled: true,
    walletFundingEnabled: true,
    airtimeEnabled: true,
    dataEnabled: true,
    maxWalletBalance: 1000000,
    minTransactionAmount: 100,
    maxTransactionAmount: 50000
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleToggleSetting = (setting: keyof SystemSettings) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }))
  }

  const handleNumberSetting = (setting: keyof SystemSettings, value: string) => {
    const numValue = parseInt(value) || 0
    setSystemSettings(prev => ({
      ...prev,
      [setting]: numValue
    }))
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Settings saved successfully!')
    } catch (error) {
      toast.error('Failed to save settings. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600 mt-2">
          Configure platform settings
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure general system behavior and features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Feature Toggles */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-sm text-gray-500">Temporarily disable the platform</div>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('maintenanceMode')}
                    className="focus:outline-none"
                  >
                    {systemSettings.maintenanceMode ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">User Registration</div>
                    <div className="text-sm text-gray-500">Allow new user registrations</div>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('registrationEnabled')}
                    className="focus:outline-none"
                  >
                    {systemSettings.registrationEnabled ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Wallet Funding</div>
                    <div className="text-sm text-gray-500">Allow users to fund their wallets</div>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('walletFundingEnabled')}
                    className="focus:outline-none"
                  >
                    {systemSettings.walletFundingEnabled ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Airtime Purchase</div>
                    <div className="text-sm text-gray-500">Allow airtime purchases</div>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('airtimeEnabled')}
                    className="focus:outline-none"
                  >
                    {systemSettings.airtimeEnabled ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">Data Purchase</div>
                    <div className="text-sm text-gray-500">Allow data purchases</div>
                  </div>
                  <button
                    onClick={() => handleToggleSetting('dataEnabled')}
                    className="focus:outline-none"
                  >
                    {systemSettings.dataEnabled ? (
                      <ToggleRight className="w-8 h-8 text-primary" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transaction Limits */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-accent" />
                Transaction Limits
              </CardTitle>
              <CardDescription>
                Set wallet and transaction limits for users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Input
                  label="Maximum Wallet Balance"
                  type="number"
                  value={systemSettings.maxWalletBalance}
                  onChange={(e) => handleNumberSetting('maxWalletBalance', e.target.value)}
                  icon={<Banknote className="w-4 h-4" />}
                  helperText={`Currently: ${formatAmount(systemSettings.maxWalletBalance)}`}
                />

                <Input
                  label="Minimum Transaction Amount"
                  type="number"
                  value={systemSettings.minTransactionAmount}
                  onChange={(e) => handleNumberSetting('minTransactionAmount', e.target.value)}
                  icon={<Banknote className="w-4 h-4" />}
                  helperText={`Currently: ${formatAmount(systemSettings.minTransactionAmount)}`}
                />

                <Input
                  label="Maximum Transaction Amount"
                  type="number"
                  value={systemSettings.maxTransactionAmount}
                  onChange={(e) => handleNumberSetting('maxTransactionAmount', e.target.value)}
                  icon={<Banknote className="w-4 h-4" />}
                  helperText={`Currently: ${formatAmount(systemSettings.maxTransactionAmount)}`}
                />
              </div>

              <Button
                onClick={handleSaveSettings}
                disabled={isLoading}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Saving...' : 'Save Limits'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Status Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-success" />
              System Status
            </CardTitle>
            <CardDescription>
              Current platform status and information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">Platform Online</div>
                  <div className="text-sm text-green-700">All systems operational</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Settings className="w-5 h-5 text-blue-600" />
                <div>
                  <div className="font-medium text-blue-900">Services Active</div>
                  <div className="text-sm text-blue-700">All features enabled</div>
                </div>
              </div>

              {systemSettings.maintenanceMode && (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-900">Maintenance Mode</div>
                    <div className="text-sm text-yellow-700">Platform under maintenance</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminSettings 