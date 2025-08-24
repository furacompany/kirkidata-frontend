import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, Mail, Settings } from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import toast from 'react-hot-toast'

type LoginFormData = {
  email: string
  password: string
}

const AdminLogin: React.FC = () => {
  const [showPassword, setShowPassword] = React.useState(false)
  const navigate = useNavigate()
  const { login, isLoading } = useAdminStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password)
      // Add a small delay to ensure state is properly set
      setTimeout(() => {
        navigate('/admin')
      }, 100)
    } catch (error: any) {
      toast.error(error.message || 'Invalid admin credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
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
            <CardTitle className="text-2xl font-bold text-gray-900">Admin Portal</CardTitle>
            <CardDescription className="text-gray-600">
              Sign in to your Kirkidata admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <Input
                  label="Admin Email"
                  type="email"
                  placeholder="Enter your admin email"
                  error={errors.email?.message}
                  {...register('email', { required: 'Email is required' })}
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>
              
              <div>
                <div className="relative">
                  <Input
                    label="Admin Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your admin password"
                    error={errors.password?.message}
                    {...register('password', { required: 'Password is required' })}
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
                <Settings className="w-4 h-4 mr-2" />
                Sign In to Admin Panel
              </Button>

            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export default AdminLogin 