import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Shield, Eye, EyeOff, X, Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './Card'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const emailSchema = yup.object({
  email: yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
}).required()

const pinSchema = yup.object({
  newPin: yup.string()
    .matches(/^\d{4}$/, 'PIN must be exactly 4 digits')
    .required('New PIN is required'),
  confirmPin: yup.string()
    .oneOf([yup.ref('newPin')], 'PINs must match')
    .required('Please confirm your PIN'),
}).required()

type EmailFormData = yup.InferType<typeof emailSchema>
type PinFormData = yup.InferType<typeof pinSchema>

interface PinResetModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type ResetStep = 'email' | 'verification' | 'newpin'

const PinResetModal: React.FC<PinResetModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess
}) => {
  const [currentStep, setCurrentStep] = React.useState<ResetStep>('email')
  const [showNewPin, setShowNewPin] = React.useState(false)
  const [showConfirmPin, setShowConfirmPin] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  // const [verificationSent, setVerificationSent] = React.useState(false) // Not currently used
  const [email, setEmail] = React.useState('')
  const { user, updateUserPin } = useAuthStore()

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm<EmailFormData>({
    resolver: yupResolver(emailSchema),
  })

  const {
    register: registerPin,
    handleSubmit: handlePinSubmit,
    formState: { errors: pinErrors },
    reset: resetPinForm,
    watch,
  } = useForm<PinFormData>({
    resolver: yupResolver(pinSchema),
  })

  const newPin = watch('newPin')

  const onEmailSubmit = async (data: EmailFormData) => {
    if (user && data.email !== user.email) {
      toast.error('Email does not match your account email.')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
      
      setEmail(data.email)
      // setVerificationSent(true) // Not currently used
      setCurrentStep('verification')
      toast.success('Verification code sent to your email!')
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationNext = () => {
    setCurrentStep('newpin')
  }

  const onPinSubmit = async (data: PinFormData) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API delay
      
      await updateUserPin(data.newPin)
      toast.success('Transfer PIN updated successfully!')
      
      handleClose()
      onSuccess()
    } catch (error) {
      toast.error('Failed to update PIN. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setCurrentStep('email')
    // setVerificationSent(false) // Not currently used
    setEmail('')
    resetEmailForm()
    resetPinForm()
    onClose()
  }

  const handleBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('email')
      // setVerificationSent(false) // Not currently used
    } else if (currentStep === 'newpin') {
      setCurrentStep('verification')
    }
  }

  if (!isOpen) return null

  const renderEmailStep = () => (
    <>
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
            <Mail className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <CardTitle className="text-2xl font-bold text-gray-900">Reset Your PIN</CardTitle>
        <CardDescription className="text-gray-600">
          Enter your email address to receive a verification code
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-5">
          <div>
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your registered email"
              error={emailErrors.email?.message}
              {...registerEmail('email')}
              icon={<Mail className="h-4 w-4" />}
            />
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
              Send Code
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  )

  const renderVerificationStep = () => (
    <>
      <CardHeader className="text-center pb-6 relative">
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
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
          <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4 shadow-lg">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <CardTitle className="text-2xl font-bold text-gray-900">Check Your Email</CardTitle>
        <CardDescription className="text-gray-600">
          We've sent a verification code to {email}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-5">
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-start space-x-3">
              <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Verification Sent</h4>
                <p className="text-xs text-gray-600">
                  Please check your email and click the verification link to proceed with PIN reset.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              type="button"
              className="flex-1 bg-success hover:bg-success/90 text-white transition-all duration-200 shadow-md"
              onClick={handleVerificationNext}
            >
              I've Verified
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  )

  const renderNewPinStep = () => (
    <>
      <CardHeader className="text-center pb-6 relative">
        <button
          onClick={handleBack}
          className="absolute left-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
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
          <div className="mx-auto w-16 h-16 bg-success rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <CardTitle className="text-2xl font-bold text-gray-900">Set New PIN</CardTitle>
        <CardDescription className="text-gray-600">
          Create a new 4-digit transfer PIN for your account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handlePinSubmit(onPinSubmit)} className="space-y-5">
          <div>
            <div className="relative">
              <Input
                label="New Transfer PIN"
                type={showNewPin ? 'text' : 'password'}
                placeholder="Enter new 4-digit PIN"
                error={pinErrors.newPin?.message}
                {...registerPin('newPin')}
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

          <div>
            <div className="relative">
              <Input
                label="Confirm New PIN"
                type={showConfirmPin ? 'text' : 'password'}
                placeholder="Confirm your new PIN"
                error={pinErrors.confirmPin?.message}
                {...registerPin('confirmPin')}
                icon={<Lock className="h-4 w-4" />}
                maxLength={4}
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

          {newPin && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-success" />
                <span className="text-gray-700">PIN strength: Strong</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleBack}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-success hover:bg-success/90 text-white transition-all duration-200 shadow-md"
              loading={isLoading}
              disabled={isLoading}
            >
              <Shield className="w-4 h-4 mr-2" />
              Update PIN
            </Button>
          </div>
        </form>
      </CardContent>
    </>
  )

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
            {currentStep === 'email' && renderEmailStep()}
            {currentStep === 'verification' && renderVerificationStep()}
            {currentStep === 'newpin' && renderNewPinStep()}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PinResetModal 