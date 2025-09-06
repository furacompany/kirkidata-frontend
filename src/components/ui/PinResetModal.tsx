import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Eye, EyeOff, X, Key } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { useAuthStore } from '../../store/authStore'
import { userApiService } from '../../services/userApi'
import toast from 'react-hot-toast'

const resetPinSchema = yup.object({
  currentPassword: yup.string()
    .required('Login password is required'),
  newPin: yup.string()
    .matches(/^\d{4}$/, 'PIN must be exactly 4 digits')
    .required('New PIN is required'),
}).required()

type ResetPinFormData = yup.InferType<typeof resetPinSchema>

interface PinResetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PinResetModal: React.FC<PinResetModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess
}) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [showNewPin, setShowNewPin] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { updateUserPin } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<ResetPinFormData>({
    resolver: yupResolver(resetPinSchema),
  })

  const onSubmit = async (data: ResetPinFormData) => {
    setIsLoading(true)
    try {
      // Call the forgot PIN API
      const response = await userApiService.forgotPin(data.currentPassword, data.newPin)
      
      if (response.success) {
        // Update the local PIN in the auth store
        await updateUserPin(data.newPin)
        toast.success('PIN reset successfully!')
        handleClose()
        onSuccess()
      } else {
        toast.error(response.message || 'Failed to reset PIN. Please try again.')
      }
    } catch (error: any) {
      if (error.message?.includes('Current password is incorrect')) {
        setError('currentPassword', {
          type: 'manual',
          message: 'Login password is incorrect. Please provide the correct login password and reset your PIN.'
        })
      } else {
        toast.error(error.message || 'Failed to reset PIN. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setShowPassword(false)
    setShowNewPin(false)
    reset()
    onClose()
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
                onClick={handleClose}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">Reset Your PIN</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your login password and new transaction PIN
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <div className="relative">
                    <Input
                      label="Login Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your login password"
                      error={errors.currentPassword?.message}
                      {...register('currentPassword')}
                      icon={<Key className="h-4 w-4" />}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Input
                      label="New Transaction PIN"
                      type={showNewPin ? 'text' : 'password'}
                      placeholder="Enter new 4-digit PIN"
                      error={errors.newPin?.message}
                      {...register('newPin')}
                      icon={<Lock className="h-4 w-4" />}
                      maxLength={4}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
                      onClick={() => setShowNewPin(!showNewPin)}
                    >
                      {showNewPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">Security Notice</h4>
                      <p className="text-xs text-blue-700">
                        We need to verify your identity before allowing you to reset your transaction PIN.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-md"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Reset PIN
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PinResetModal 