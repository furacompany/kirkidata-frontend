import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, Loader2, AlertCircle, CheckCircle, UserCheck, FileText, Camera, Upload } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import toast from 'react-hot-toast'
import { upgradeVirtualAccountKyc } from '../../features/virtual-accounts/api'

const KYC: React.FC = () => {
  const [bvn, setBvn] = useState("")
  const [upgrading, setUpgrading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgradeKYC = async () => {
    if (!bvn.trim()) {
      toast.error("Please enter a BVN")
      return
    }

    if (bvn.trim().length !== 11) {
      toast.error("BVN must be 11 digits")
      return
    }

    try {
      setUpgrading(true)
      setError(null)
      
      const response = await upgradeVirtualAccountKyc(bvn.trim())
      
      if (response.success) {
        toast.success("KYC verification completed successfully!")
        setBvn("")
      } else {
        throw new Error(response.message || "Failed to complete KYC verification")
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to complete KYC verification"
      toast.error(message)
      setError(message)
    } finally {
      setUpgrading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Complete your Know Your Customer (KYC) verification to unlock full account features and higher transaction limits.
        </p>
      </motion.div>

      {/* KYC Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Verify Your Identity</CardTitle>
            <p className="text-gray-600">Enter your Bank Verification Number (BVN) to proceed</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-700">{error}</span>
              </motion.div>
            )}

            {/* BVN Input */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Bank Verification Number (BVN)
              </label>
              <div className="relative">
                <input
                  value={bvn}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '') // Only allow digits
                    setBvn(value)
                  }}
                  placeholder="Enter your 11-digit BVN"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base font-mono tracking-wider transition-all"
                  inputMode="numeric"
                  maxLength={11}
                  disabled={upgrading}
                />
                {bvn.length === 11 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Your BVN is a unique 11-digit number that identifies you in the Nigerian banking system
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleUpgradeKYC}
              disabled={upgrading || bvn.trim().length !== 11}
              className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-50 py-3 text-base font-medium"
            >
              {upgrading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 mr-2" />
                  Complete KYC Verification
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Benefits Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-4xl mx-auto"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-accent/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-bold text-gray-900">Benefits of KYC Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <UserCheck className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900">Higher Limits</h3>
                <p className="text-sm text-gray-600">Unlock higher transaction limits and account capabilities</p>
              </div>
              <div className="text-center space-y-3">
                <div className="p-3 bg-accent/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold text-gray-900">Enhanced Security</h3>
                <p className="text-sm text-gray-600">Additional security measures for your account protection</p>
              </div>
              <div className="text-center space-y-3">
                <div className="p-3 bg-success/10 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-semibold text-gray-900">Full Access</h3>
                <p className="text-sm text-gray-600">Access to all platform features and services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default KYC
