import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, CheckCircle, Eye, EyeOff, X } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const schema = yup.object({
  pin: yup.string()
    .matches(/^\d{4}$/, 'PIN must be exactly 4 digits')
    .required('Transfer PIN is required'),
  confirmPin: yup.string()
    .oneOf([yup.ref('pin')], 'PINs must match')
    .required('Please confirm your PIN'),
}).required()

type PinSetupFormData = yup.InferType<typeof schema>

interface PinSetupModalProps {
  isOpen: boolean
  onClose: () => void
}

const PinSetupModal: React.FC<PinSetupModalProps> = ({ isOpen, onClose }) => {
  const [showPin, setShowPin] = React.useState(false)
  const [showConfirmPin, setShowConfirmPin] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { updateUserPin } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PinSetupFormData>({
    resolver: yupResolver(schema),
  })

  const pin = watch('pin')

  const onSubmit = async (data: PinSetupFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
      await updateUserPin(data.pin)
      toast.success('Transfer PIN set successfully!')
      reset()
      onClose()
    } catch (error) {
      toast.error('Failed to set PIN. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4 z-50"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md relative"
        >
          <Card className="shadow-2xl border-0 bg-white">
            <CardHeader className="text-center pb-6 relative">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">Set Your Transfer PIN</CardTitle>
              <CardDescription className="text-gray-600">
                Create a 4-digit PIN to secure your transactions
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Why do I need a Transfer PIN?</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• Secure all your transactions (airtime, data, transfers)</li>
                        <li>• Prevent unauthorized purchases from your account</li>
                        <li>• Required for every transaction for your security</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Input
                      label="Transfer PIN"
                      type={showPin ? 'text' : 'password'}
                      placeholder="Enter 4-digit PIN"
                      error={errors.pin?.message}
                      {...register('pin')}
                      icon={<Lock className="h-4 w-4" />}
                      maxLength={4}
                      helperText="Choose a secure 4-digit PIN"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPin(!showPin)}
                    >
                      {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Input
                      label="Confirm Transfer PIN"
                      type={showConfirmPin ? 'text' : 'password'}
                      placeholder="Confirm your 4-digit PIN"
                      error={errors.confirmPin?.message}
                      {...register('confirmPin')}
                      icon={<Lock className="h-4 w-4" />}
                      maxLength={4}
                      helperText="Re-enter your PIN to confirm"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                    >
                      {showConfirmPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {pin && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-gray-700">PIN strength: Strong</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Keep your PIN secure and don't share it with anyone
                    </p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Later
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-success hover:bg-success/90 text-white transition-all duration-200 shadow-md"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Set PIN
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    You can change your PIN later in your account settings
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PinSetupModal 