import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminStore } from '../store/adminStore'

export const useAdminAuth = () => {
  const navigate = useNavigate()
  const { logout, isAuthenticated } = useAdminStore()

  useEffect(() => {
    const checkAuth = () => {
      const adminAccessToken = localStorage.getItem('adminAccessToken')
      
      if (!adminAccessToken) {
        // Clear any existing auth state
        logout()
        // Redirect to admin login
        navigate('/admin/login', { replace: true })
        return false
      }
      
      return true
    }

    // Check immediately
    checkAuth()

    // Set up interval to check periodically (every 30 seconds)
    const interval = setInterval(checkAuth, 30000)

    return () => clearInterval(interval)
  }, [navigate, logout])

  return { isAuthenticated }
}
