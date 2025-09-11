import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  CreditCard, 
  Phone, 
  Wifi, 
  History, 
  User, 
  Shield,
  LogOut,
  Menu,
  X,
  Bell,
  Zap,
  Tv,
  BookOpen,
  ChevronDown
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { Button } from '../ui/Button'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Buy Airtime', href: '/buy-airtime', icon: Phone },
    { name: 'Buy Data', href: '/buy-data', icon: Wifi },
    { name: 'Fund Wallet', href: '/fund-wallet', icon: CreditCard },
    { name: 'Electricity', href: '/electricity', icon: Zap },
    { name: 'TV Subscription', href: '/tv-subscription', icon: Tv },
    { name: 'Exam Pins', href: '/exam-pins', icon: BookOpen },
    { name: 'Transaction History', href: '/transactions', icon: History },
    { name: 'KYC Verification', href: '/kyc', icon: Shield },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      setProfileDropdownOpen(false) // Close dropdown
      await logout()
      navigate('/login')
    } catch (error) {
      // Even if logout fails, redirect to login
      navigate('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-primary">
          <div className="flex h-16 items-center justify-between px-6 border-b border-primary-dark/20">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Kirkidata Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-white">KIRKIDATA</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* Mobile user section */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-white/60 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-primary">
          <div className="flex h-16 items-center px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img 
                  src="/logo.jpg" 
                  alt="Kirkidata Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-xl font-bold text-white">KIRKIDATA</h1>
            </div>
          </div>
          
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-white/10 text-white shadow-lg'
                      : 'text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          {/* Desktop user section */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-white/60 truncate">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              {/* User profile dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-x-2 sm:gap-x-3 px-2 sm:px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">Customer</p>
                  </div>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'customer@example.com'}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center gap-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <LogOut className="h-4 w-4" />
                      {isLoggingOut ? 'Signing out...' : 'Sign out'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout 