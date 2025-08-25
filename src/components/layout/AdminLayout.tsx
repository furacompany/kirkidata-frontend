import React, { useState } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Home, 
  Users, 
  FileText, 
  CreditCard, 
  Settings, 
  LogOut,
  Menu,
  X,
  Shield,
  Bell,
  User,
  Wifi,
  Activity,
  BarChart3,
  RefreshCw
} from 'lucide-react'
import { useAdminStore } from '../../store/adminStore'
import { Button } from '../ui/Button'

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { admin, logout } = useAdminStore()





  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Users Management', href: '/admin/users', icon: Users },
    { name: 'Data Plans', href: '/admin/data-plans', icon: Wifi },
    { name: 'Sync from OtoBill', href: '/admin/sync-otobill', icon: RefreshCw },
    { name: 'All Transactions', href: '/admin/transactions', icon: FileText },
    { name: 'Wallet Logs', href: '/admin/wallet-logs', icon: CreditCard },
    { name: 'OtoBill Profile', href: '/admin/otobill-profile', icon: Shield },
    { name: 'OtoBill Transactions', href: '/admin/otobill-transactions', icon: Activity },
    { name: 'OtoBill Analytics', href: '/admin/otobill-stats', icon: BarChart3 },
    { name: 'Profile', href: '/admin/profile', icon: User },
    { name: 'System Settings', href: '/admin/settings', icon: Settings },
  ]

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
      navigate('/admin/login')
    } catch (error) {
      // Even if logout fails, redirect to admin login
      navigate('/admin/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-primary">
          <div className="flex h-16 items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-white">ADMIN PANEL</h1>
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
          
          {/* Mobile admin user section */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{admin ? `${admin.firstName} ${admin.lastName}` : 'Admin'}</p>
                <p className="text-xs text-white/60 truncate">Administrator</p>
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
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-white">ADMIN PANEL</h1>
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
          
          {/* Desktop admin user section */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{admin ? `${admin.firstName} ${admin.lastName}` : 'Admin'}</p>
                <p className="text-xs text-white/60 truncate">Administrator</p>
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
                {navigation.find(item => isActive(item.href))?.name || 'Admin Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Admin badge */}
              <div className="flex items-center gap-x-2 rounded-lg bg-primary/10 px-4 py-2 border border-primary/20">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-gray-900">
                  Administrator
                </span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-gray-500" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
              </Button>

              {/* Admin profile dropdown */}
              <div className="relative">
                <div className="flex items-center gap-x-3 px-3 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-white">
                      {admin ? `${admin.firstName} ${admin.lastName}`.charAt(0).toUpperCase() : 'A'}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{admin ? `${admin.firstName} ${admin.lastName}` : 'Admin'}</p>
                    <p className="text-xs text-gray-500">System Admin</p>
                  </div>
                </div>
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
              <Outlet />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout 