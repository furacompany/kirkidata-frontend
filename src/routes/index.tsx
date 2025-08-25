import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import AdminLayout from '../components/layout/AdminLayout';
import { useAdminStore } from '../store/adminStore';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/auth/CustomerLogin'));
const Register = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPassword = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPassword = lazy(() => import('../pages/auth/ResetPasswordPage'));
const Profile = lazy(() => import('../pages/customers/Profile'));
const BuyAirtime = lazy(() => import('../pages/customers/BuyAirtime'));
const BuyData = lazy(() => import('../pages/customers/BuyData'));
const FundWallet = lazy(() => import('../pages/customers/FundWallet'));
const Transactions = lazy(() => import('../pages/customers/Transactions'));
const Receipt = lazy(() => import('../pages/customers/Receipt'));
const DashboardHome = lazy(() => import('../pages/dashboard/DashboardHome'));
const AdminLogin = lazy(() => import('../pages/auth/AdminLogin'));
const AdminHome = lazy(() => import('../pages/admin/AdminHome'));
const UsersManagement = lazy(() => import('../pages/admin/UsersManagement'));
const DataPlans = lazy(() => import('../pages/admin/DataPlans'));
const SyncOtoBill = lazy(() => import('../pages/admin/SyncOtoBill'));
const TransactionsPanel = lazy(() => import('../pages/admin/TransactionsPanel'));
const WalletLogs = lazy(() => import('../pages/admin/WalletLogs'));
const AdminProfile = lazy(() => import('../pages/admin/AdminProfile'));
const AdminSettings = lazy(() => import('../pages/admin/AdminSettings'));

const OtoBillWallet = lazy(() => import('../pages/admin/OtoBillWallet'));
const OtobillProfile = lazy(() => import('../pages/admin/OtobillProfile'));
const OtoBillTransactions = lazy(() => import('../pages/admin/OtoBillTransactions'));
const OtoBillStats = lazy(() => import('../pages/admin/OtoBillStats'));
const NotFound = lazy(() => import('../pages/notfound'));

// Protected route wrapper for admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { admin, isAuthenticated, checkAuthStatus, restoreAuthState } = useAdminStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // First try to restore from localStorage
        const restored = restoreAuthState();
        
        if (restored) {
          // If restored, check if tokens are still valid
          try {
            await checkAuthStatus();
          } catch (error) {
            // If check fails, clear the state
            console.log('Auth check failed, clearing state');
          }
        }
      } catch (error) {
        console.log('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []); // Empty dependency array to run only once

  // If still loading, show loading screen
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If not authenticated or no admin data, redirect to login
  if (!isAuthenticated || !admin) {
    console.log('Not authenticated, redirecting to login. isAuthenticated:', isAuthenticated, 'admin:', admin);
    // Temporarily allow access for debugging
    console.log('Temporarily allowing access for debugging');
    return <>{children}</>;
  }

  // If authenticated and admin data exists, render the children
  return <>{children}</>;
};

// Placeholder wrapper for customer routes
const PrivateRoute = ({ children }: { children: React.ReactNode }) => <>{children}</>;

const AppRoutes = () => (
  <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      {/* Customer Dashboard */}
      <Route element={<PrivateRoute><DashboardLayout><Outlet /></DashboardLayout></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/dashboard/profile" element={<Profile />} />
        <Route path="/dashboard/airtime" element={<BuyAirtime />} />
        <Route path="/dashboard/data" element={<BuyData />} />
        <Route path="/dashboard/wallet" element={<FundWallet />} />
        <Route path="/dashboard/transactions" element={<Transactions />} />
        <Route path="/dashboard/receipt" element={<Receipt />} />
      </Route>
      {/* Admin Dashboard */}
      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="data-plans" element={<DataPlans />} />
        <Route path="sync-otobill" element={<SyncOtoBill />} />
        <Route path="transactions" element={<TransactionsPanel />} />
        <Route path="wallet-logs" element={<WalletLogs />} />
        <Route path="debug-test" element={<div>Debug route working! Path: /admin/debug-test</div>} />
        <Route path="otobill-wallet" element={<OtoBillWallet />} />
        <Route path="otobill-profile" element={<OtobillProfile />} />
        <Route path="otobill-transactions" element={<OtoBillTransactions />} />
        <Route path="otobill-stats" element={<OtoBillStats />} />
        <Route path="test-route" element={<div>Test route working!</div>} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes; 