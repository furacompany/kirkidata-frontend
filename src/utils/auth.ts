/**
 * Authentication utilities
 */

/**
 * Clear all admin authentication data from localStorage
 */
export const clearAdminAuth = () => {
  localStorage.removeItem('adminAccessToken')
  localStorage.removeItem('adminRefreshToken')
  localStorage.removeItem('adminData')
  console.log('Admin authentication data cleared')
}

/**
 * Clear all user authentication data from localStorage
 */
export const clearUserAuth = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('userData')
  console.log('User authentication data cleared')
}

/**
 * Clear all authentication data from localStorage
 */
export const clearAllAuth = () => {
  clearAdminAuth()
  clearUserAuth()
  console.log('All authentication data cleared')
}

/**
 * Check if admin tokens exist in localStorage
 */
export const hasAdminTokens = (): boolean => {
  const accessToken = localStorage.getItem('adminAccessToken')
  const refreshToken = localStorage.getItem('adminRefreshToken')
  return !!(accessToken && refreshToken)
}

/**
 * Check if user tokens exist in localStorage
 */
export const hasUserTokens = (): boolean => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  return !!(accessToken && refreshToken)
}
