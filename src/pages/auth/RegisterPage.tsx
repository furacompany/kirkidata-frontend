import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, CreditCard } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'

interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  pin: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  pin?: string
  general?: string
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [formErrors, setFormErrors] = React.useState<FormErrors>({})
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuthStore()

  const {
    register,
    handleSubmit,
  } = useForm<RegisterFormData>()

  const onSubmit = async (data: RegisterFormData) => {
    // Clear previous errors
    setFormErrors({})

    // Basic validation - check if all required fields are filled
    const newErrors: FormErrors = {}
    
    if (!data.firstName) newErrors.firstName = 'First name is required'
    if (!data.lastName) newErrors.lastName = 'Last name is required'
    if (!data.email) newErrors.email = 'Email is required'
    if (!data.phone) newErrors.phone = 'Phone number is required'
    if (!data.password) newErrors.password = 'Password is required'
    if (!data.pin) newErrors.pin = 'Transaction PIN is required'

    // Validate first name - only letters allowed
    if (data.firstName && !/^[A-Za-z\s]+$/.test(data.firstName)) {
      newErrors.firstName = 'First name can only contain letters and spaces'
    }

    // Validate last name - only letters allowed
    if (data.lastName && !/^[A-Za-z\s]+$/.test(data.lastName)) {
      newErrors.lastName = 'Last name can only contain letters and spaces'
    }

    // Check if PIN is exactly 4 digits
    if (data.pin && data.pin.length !== 4) {
      newErrors.pin = 'PIN must be exactly 4 digits'
    }

    // If there are validation errors, display them and return
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors)
      return
    }

    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        pin: data.pin,
      })
      
      // Success - redirect to dashboard
      navigate('/dashboard')
    } catch (error: any) {
      const errorMessage = error.message || 'Registration failed. Please try again.'
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('pin must be exactly 4 digits')) {
        setFormErrors({ pin: 'PIN must be exactly 4 digits' })
      } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('phone')) {
        // Both email and phone exist
        setFormErrors({ 
          email: 'Email already exists', 
          phone: 'Phone number already exists' 
        })
      } else if (errorMessage.toLowerCase().includes('email')) {
        setFormErrors({ email: 'Email already exists' })
      } else if (errorMessage.toLowerCase().includes('phone')) {
        setFormErrors({ phone: 'Phone number already exists' })
      } else {
        setFormErrors({ general: errorMessage })
      }
    }
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4 py-8">
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
                  src="/src/assets/logo.jpg" 
                  alt="Kirkidata Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
            <CardDescription className="text-gray-600">
              Sign up for your Kirkidata account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Info Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                                     <div>
                     <Input
                       label="First Name"
                       type="text"
                       placeholder="Enter your first name"
                       error={formErrors.firstName}
                       {...register('firstName', {
                         onChange: (e) => {
                           // Only allow letters and spaces
                           e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')
                         }
                       })}
                       icon={<User className="h-4 w-4" />}
                     />
                   </div>

                  <div>
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="Enter your email"
                      error={formErrors.email}
                      {...register('email')}
                      icon={<Mail className="h-4 w-4" />}
                    />
                  </div>

                  <div>
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="e.g., 08012345678"
                      error={formErrors.phone}
                      {...register('phone')}
                      icon={<Phone className="h-4 w-4" />}
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                                     <div>
                     <Input
                       label="Last Name"
                       type="text"
                       placeholder="Enter your last name"
                       error={formErrors.lastName}
                       {...register('lastName', {
                         onChange: (e) => {
                           // Only allow letters and spaces
                           e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, '')
                         }
                       })}
                       icon={<User className="h-4 w-4" />}
                     />
                   </div>

                  <div>
                    <div className="relative">
                      <Input
                        label="Password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Create a password"
                        error={formErrors.password}
                        {...register('password')}
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

                  <div>
                    <Input
                      label="Transaction PIN"
                      type="text"
                      placeholder="Enter 4-digit PIN"
                      maxLength={4}
                      error={formErrors.pin}
                      {...register('pin', {
                        onChange: (e) => {
                          // Only allow numbers
                          e.target.value = e.target.value.replace(/[^0-9]/g, '')
                        }
                      })}
                      icon={<CreditCard className="h-4 w-4" />}
                      helperText="Enter a 4-digit PIN for transactions"
                    />
                  </div>
                </div>
              </div>

                             {/* Full Width Elements */}
               <div className="space-y-4 pt-4 border-t border-gray-100">
                 {/* General error display */}
                 {formErrors.general && (
                   <div className="bg-red-50 border border-red-200 rounded-md p-3">
                     <p className="text-sm text-red-600">{formErrors.general}</p>
                   </div>
                 )}

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-md"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Account
                </Button>

                <div className="text-center text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default RegisterPage 