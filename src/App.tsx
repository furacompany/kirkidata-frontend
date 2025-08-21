import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import { useAdminStore } from './store/adminStore'
import './utils/devTools' // Import for debugging utilities

// Landing Page
import Home from './pages/Home'

// Auth Pages
import CustomerLogin from './pages/auth/CustomerLogin'
import AdminLogin from './pages/auth/AdminLogin'
import RegisterPage from './pages/auth/RegisterPage'

import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'

// Customer Pages
import DashboardHome from './pages/dashboard/DashboardHome'
import BuyAirtime from './pages/customers/BuyAirtime'
import BuyData from './pages/customers/BuyData'
import FundWallet from './pages/customers/FundWallet'
import Transactions from './pages/customers/Transactions'
import Profile from './pages/customers/Profile'
import KYC from './pages/customers/KYC'
import Receipt from './pages/customers/Receipt'

// Admin Pages
import AdminHome from './pages/admin/AdminHome'
import UsersManagement from './pages/admin/UsersManagement'
import DataPlans from './pages/admin/DataPlans'
import TransactionsPanel from './pages/admin/TransactionsPanel'
import WalletLogs from './pages/admin/WalletLogs'
import AdminSettings from './pages/admin/AdminSettings'
import AdminProfile from './pages/admin/AdminProfile'
import OtobillProfile from './pages/admin/OtobillProfile'

// Layouts
import DashboardLayout from './components/layout/DashboardLayout'
import AdminLayout from './components/layout/AdminLayout'

// Components
import NotFound from './pages/notfound'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, areTokensValid } = useAuthStore()
  const { isAuthenticated: isAdminAuthenticated } = useAdminStore()

  // Check if tokens exist in localStorage even if auth state hasn't been restored yet
  const hasValidTokens = areTokensValid()
  const hasAdminTokens = localStorage.getItem('adminAccessToken') && localStorage.getItem('adminRefreshToken')

  if (adminOnly) {
    // For admin routes, check admin authentication
    // If we have admin tokens in localStorage, consider admin authenticated even if state hasn't been restored yet
    if (!isAdminAuthenticated && !hasAdminTokens) {
      return <Navigate to="/admin/login" replace />
    }
  } else {
    // For user routes, check user authentication
    if (!isAuthenticated && !hasValidTokens) {
      return <Navigate to="/login" replace />
    }
  }

  return <>{children}</>
}

const App: React.FC = () => {
  const { initializeAuth, restoreAuthState } = useAuthStore()
  const { restoreAuthState: restoreAdminAuthState, checkAuthStatus: checkAdminAuthStatus } = useAdminStore()

  useEffect(() => {
    // Immediately restore user auth state to prevent auto logout
    const isUserRestored = restoreAuthState()
    
    if (isUserRestored) {
      // If user auth state was restored, initialize full auth flow in background
      initializeAuth().catch(() => {
        // Silent fail - auth initialization error
      })
    }

    // Immediately restore admin auth state to prevent auto logout
    const isAdminRestored = restoreAdminAuthState()
    
    if (isAdminRestored) {
      // If admin auth state was restored, check auth status in background
      checkAdminAuthStatus().catch(() => {
        // Silent fail - admin auth check error
      })
    }
  }, [initializeAuth, restoreAuthState, restoreAdminAuthState, checkAdminAuthStatus])

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<Home />} />

          {/* Public Auth Routes */}
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Customer Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <DashboardHome />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy-airtime"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BuyAirtime />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/buy-data"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <BuyData />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/fund-wallet"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <FundWallet />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Transactions />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Profile />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/kyc"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <KYC />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/receipt/:id"
            element={
              <ProtectedRoute>
                <Receipt />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <AdminHome />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <UsersManagement />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/data-plans"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <DataPlans />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <TransactionsPanel />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/wallet-logs"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <WalletLogs />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <AdminProfile />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/otobill-profile"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout>
                  <OtobillProfile />
                </AdminLayout>
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4CAF50',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#EF5350',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
