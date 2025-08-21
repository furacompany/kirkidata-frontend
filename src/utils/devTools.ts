/**
 * Development utilities for debugging authentication issues
 */

import { clearAdminAuth, clearUserAuth, clearAllAuth } from './auth'

/**
 * Debug authentication state
 */
export const debugAuthState = () => {
  console.log('=== Authentication Debug Info ===')
  
  // Check admin tokens
  const adminAccessToken = localStorage.getItem('adminAccessToken')
  const adminRefreshToken = localStorage.getItem('adminRefreshToken')
  const adminData = localStorage.getItem('adminData')
  
  console.log('Admin Access Token:', adminAccessToken ? 'Present' : 'Missing')
  console.log('Admin Refresh Token:', adminRefreshToken ? 'Present' : 'Missing')
  console.log('Admin Data:', adminData ? 'Present' : 'Missing')
  
  // Check user tokens
  const userAccessToken = localStorage.getItem('accessToken')
  const userRefreshToken = localStorage.getItem('refreshToken')
  const userData = localStorage.getItem('userData')
  
  console.log('User Access Token:', userAccessToken ? 'Present' : 'Missing')
  console.log('User Refresh Token:', userRefreshToken ? 'Present' : 'Missing')
  console.log('User Data:', userData ? 'Present' : 'Missing')
  
  // Check if tokens are valid (basic check)
  if (adminAccessToken) {
    try {
      const payload = JSON.parse(atob(adminAccessToken.split('.')[1]))
      const expiry = new Date(payload.exp * 1000)
      console.log('Admin Token Expiry:', expiry.toISOString())
      console.log('Admin Token Expired:', expiry < new Date())
    } catch (error) {
      console.log('Admin Token: Invalid format')
    }
  }
  
  if (userAccessToken) {
    try {
      const payload = JSON.parse(atob(userAccessToken.split('.')[1]))
      const expiry = new Date(payload.exp * 1000)
      console.log('User Token Expiry:', expiry.toISOString())
      console.log('User Token Expired:', expiry < new Date())
    } catch (error) {
      console.log('User Token: Invalid format')
    }
  }
  
  console.log('================================')
}

/**
 * Clear all authentication data and reload the page
 */
export const clearAuthAndReload = () => {
  clearAllAuth()
  console.log('All authentication data cleared. Reloading page...')
  window.location.reload()
}

/**
 * Clear admin authentication data and reload the page
 */
export const clearAdminAuthAndReload = () => {
  clearAdminAuth()
  console.log('Admin authentication data cleared. Reloading page...')
  window.location.reload()
}

// Make these functions available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuthState = debugAuthState
  ;(window as any).clearAuthAndReload = clearAuthAndReload
  ;(window as any).clearAdminAuthAndReload = clearAdminAuthAndReload
  ;(window as any).clearAdminAuth = clearAdminAuth
  ;(window as any).clearUserAuth = clearUserAuth
  ;(window as any).clearAllAuth = clearAllAuth
}
