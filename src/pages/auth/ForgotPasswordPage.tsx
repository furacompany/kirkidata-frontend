import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { Mail, Smartphone, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { userApiService } from '../../services/userApi'
import toast from 'react-hot-toast'
import SEO from '../../components/SEO'

// Step 1: Request password reset
const requestResetSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
}).required()

// Step 2: Reset password with OTP
const resetPasswordSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  otp: yup.string()
    .matches(/^[0-9]{6}$/, 'OTP must be 6 digits')
    .required('OTP is required'),
  newPassword: yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('New password is required'),
}).required()

type RequestResetFormData = yup.InferType<typeof requestResetSchema>
type ResetPasswordFormData = yup.InferType<typeof resetPasswordSchema>

const ForgotPasswordPage: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState<'request' | 'reset'>('request')
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const navigate = useNavigate()

  // Step 1: Request password reset
  const requestResetForm = useForm<RequestResetFormData>({
    resolver: yupResolver(requestResetSchema),
  })

  // Step 2: Reset password
  const resetPasswordForm = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  })

  const handleRequestReset = async (data: RequestResetFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await userApiService.requestPasswordReset({ email: data.email })
      
      if (response.success) {
        setEmail(data.email)
        setCurrentStep('reset')
        toast.success('OTP sent to your email!')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Something went wrong. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await userApiService.resetPassword({
        email: data.email,
        otp: data.otp,
        newPassword: data.newPassword,
      })
      
      if (response.success) {
        toast.success('Password reset successfully!')
        navigate('/login')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Something went wrong. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const goBackToRequest = () => {
    setCurrentStep('request')
    setError(null)
    resetPasswordForm.reset()
  }

  const clearError = () => {
    setError(null)
  }

  // Step 2: Reset password form
  if (currentStep === 'reset') {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center px-4">
        {/* SEO Component */}
        <SEO 
          title="Reset Password | Kirkidata"
          description="Reset your Kirkidata account password securely. Enter the OTP sent to your email to create a new password."
          keywords="Kirkidata reset password, forgot password, password recovery, OTP verification"
          canonicalUrl="https://www.kirkidata.com/forgot-password"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                  <img 
                    src="/logo.jpg" 
                    alt="Kirkidata Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
              <CardDescription className="text-gray-600">
                Enter the OTP sent to your email and your new password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative mb-6" 
                  role="alert"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{error}</span>
                    </div>
                    <button
                      onClick={clearError}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}

              <form onSubmit={resetPasswordForm.handleSubmit(handleResetPassword)} className="space-y-5">
                <div>
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    error={resetPasswordForm.formState.errors.email?.message}
                    {...resetPasswordForm.register('email', {
                      onChange: clearError,
                      value: email
                    })}
                    icon={<Mail className="h-4 w-4" />}
                    disabled
                  />
                </div>

                <div>
                  <Input
                    label="OTP Code"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    error={resetPasswordForm.formState.errors.otp?.message}
                    {...resetPasswordForm.register('otp', {
                      onChange: clearError
                    })}
                    icon={<Smartphone className="h-4 w-4" />}
                    helperText="Enter the 6-digit code sent to your email"
                  />
                </div>

                <div>
                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your new password"
                      error={resetPasswordForm.formState.errors.newPassword?.message}
                      {...resetPasswordForm.register('newPassword', {
                        onChange: clearError
                      })}
                      icon={<Lock className="h-4 w-4" />}
                      helperText="Password must be at least 6 characters"
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

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-md"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Reset Password
                </Button>

                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBackToRequest}
                    className="w-full"
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Request Reset
                  </Button>

                  <Link to="/login">
                    <Button variant="outline" className="w-full">
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Step 1: Request password reset form
  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      {/* SEO Component */}
      <SEO 
        title="Forgot Password | Kirkidata"
        description="Forgot your Kirkidata password? Request a password reset OTP sent to your registered email address."
        keywords="Kirkidata forgot password, password reset, OTP request, account recovery"
        canonicalUrl="https://www.kirkidata.com/forgot-password"
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4 shadow-lg overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Kirkidata Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">Reset Password</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email address to receive a reset OTP
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative mb-6" 
                role="alert"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{error}</span>
                  </div>
                  <button
                    onClick={clearError}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}

            <form onSubmit={requestResetForm.handleSubmit(handleRequestReset)} className="space-y-5">
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email address"
                  error={requestResetForm.formState.errors.email?.message}
                  {...requestResetForm.register('email', {
                    onChange: clearError
                  })}
                  icon={<Mail className="h-4 w-4" />}
                  helperText="We'll send a 6-digit OTP to your registered email"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-md"
                loading={isLoading}
                disabled={isLoading}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Reset OTP
              </Button>

              <div className="text-center text-sm text-gray-600">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default ForgotPasswordPage 