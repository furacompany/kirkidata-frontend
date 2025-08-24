import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Smartphone } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import toast from 'react-hot-toast'
import SEO from '../../components/SEO'

const schema = yup.object({
  phone: yup.string()
    .matches(/^[0-9]{11}$/, 'Phone number must be 11 digits')
    .required('Phone number is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required()

type LoginFormData = yup.InferType<typeof schema>

const CustomerLogin: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [loginError, setLoginError] = React.useState<string | null>(null)
  const navigate = useNavigate()
  const { login, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null) // Clear any previous errors
      await login(data.phone, data.password)
      const user = useAuthStore.getState().user
      
      if (user?.role === 'admin') {
        toast.error('Please use the admin login page')
        await useAuthStore.getState().logout()
        return
      }
      
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (error: any) {
      const errorMessage = error.message || 'Invalid credentials. Please try again.'
      setLoginError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const clearError = () => {
    setLoginError(null)
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      {/* SEO Component */}
      <SEO 
        title="Customer Login | Kirkidata"
        description="Sign in to your Kirkidata account to buy airtime and data bundles instantly. Secure login for all Nigerian networks."
        keywords="Kirkidata login, customer login, airtime login, data login, Nigeria recharge login"
        canonicalUrl="https://www.kirkidata.com/login"
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
            <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your Kirkidata account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loginError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg relative mb-6" 
                role="alert"
                whileHover={{ scale: 1.02 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 20 
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">
                      {loginError === 'Invalid phone number or password' 
                        ? 'Invalid phone number or password. Please check your details and try again.'
                        : loginError
                      }
                    </span>
                  </div>
                  <button
                    onClick={() => setLoginError(null)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Input
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter your phone number (e.g., 08123456789)"
                  error={errors.phone?.message}
                  {...register('phone', {
                    onChange: clearError
                  })}
                  icon={<Smartphone className="h-4 w-4" />}
                />
              </div>
              
              <div>
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    error={errors.password?.message}
                    {...register('password', {
                      onChange: clearError
                    })}
                    icon={<Lock className="h-4 w-4" />}
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

              <div className="text-left mb-4">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-md"
                loading={isLoading}
                disabled={isLoading}
              >
                Sign In
              </Button>

              <div className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default CustomerLogin 