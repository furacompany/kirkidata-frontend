import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'

interface AdminAuthGuardProps {
  children: React.ReactNode
}

const AdminAuthGuard: React.FC<AdminAuthGuardProps> = ({ children }) => {
  const navigate = useNavigate()
  const { logout } = useAdminStore()

  useEffect(() => {
    const checkAuth = () => {
      const adminAccessToken = localStorage.getItem('adminAccessToken')
      
      if (!adminAccessToken) {
        // Clear any existing auth state silently
        logout()
        // Redirect to admin login immediately
        navigate('/admin/login', { replace: true })
        return false
      }
      
      return true
    }

    // Check immediately and synchronously
    const hasToken = checkAuth()
    
    // If no token, don't set up interval
    if (!hasToken) {
      return
    }

    // Set up interval to check periodically (every 10 seconds for faster response)
    const interval = setInterval(checkAuth, 10000)

    return () => clearInterval(interval)
  }, [navigate, logout])

  // Don't render children if no token
  const adminAccessToken = localStorage.getItem('adminAccessToken')
  if (!adminAccessToken) {
    return null
  }

  return <>{children}</>
}

export default AdminAuthGuard
