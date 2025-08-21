import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Eye, EyeOff, X } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const schema = yup.object({
  pin: yup.string()
    .matches(/^\d{4}$/, 'PIN must be exactly 4 digits')
    .required('Transfer PIN is required'),
}).required()

type PinVerificationFormData = yup.InferType<typeof schema>

interface PinVerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onForgotPin: () => void
  title?: string
  description?: string
}

const PinVerificationModal: React.FC<PinVerificationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  onForgotPin,
  title = "Verify Your PIN",
  description = "Enter your 4-digit transfer PIN to complete this transaction"
}) => {
  const [showPin, setShowPin] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const { user } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<PinVerificationFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: PinVerificationFormData) => {
    if (!user) {
      toast.error('User not found. Please log in again.')
      return
    }

    setIsLoading(true)
    try {
      // Check if user has a PIN set locally (from registration)
      if (user.transferPin && data.pin === user.transferPin) {
        toast.success('PIN verified successfully!')
        reset()
        onSuccess()
      } else {
        toast.error('Incorrect PIN. Please try again.')
        setError('pin', { 
          type: 'manual', 
          message: 'Incorrect PIN. Please try again.' 
        })
      }
    } catch (error: any) {
      toast.error('Verification failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
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
              <CardTitle className="text-2xl font-bold text-gray-900">{title}</CardTitle>
              <CardDescription className="text-gray-600">
                {description}
              </CardDescription>
            </CardHeader>
            
                         <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                 <div>
                  <div className="relative">
                                         <Input
                       label="Transfer PIN"
                       type={showPin ? 'text' : 'password'}
                       placeholder="Enter your 4-digit PIN"
                       error={errors.pin?.message}
                       {...register('pin')}
                       icon={<Lock className="h-4 w-4" />}
                       maxLength={4}
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
                    Verify PIN
                  </Button>
                </div>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={onForgotPin}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    disabled={isLoading}
                  >
                    Forgot your PIN?
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PinVerificationModal 