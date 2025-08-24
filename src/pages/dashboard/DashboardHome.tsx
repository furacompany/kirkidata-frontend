import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Wallet, Activity, Smartphone, Wifi, CreditCard, 
  Eye, EyeOff, Plus, History, RefreshCw, ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../../components/SEO'

import VirtualAccountsCard from '../../features/virtual-accounts/VirtualAccountsCard'
import NinePSBCard from '../../features/virtual-accounts/NinePSBCard'

const DashboardHome: React.FC = () => {
  const { walletBalance, transactions, fetchTransactions, fetchWalletBalance } = useUserStore()
  const { user } = useAuthStore()
  const [showBalance, setShowBalance] = React.useState(true)
  const [refreshingBalance, setRefreshingBalance] = React.useState(false)
  const [activeVirtualAccount, setActiveVirtualAccount] = React.useState<'9PSB' | 'PALMPAY'>('9PSB')

  useEffect(() => {
    fetchTransactions()
    fetchWalletBalance()
  }, [fetchTransactions, fetchWalletBalance])

  const recentTransactions = transactions.slice(0, 4)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'successful':
      case 'completed':
        return 'text-success bg-success/10 border-success/20'
      case 'pending':
        return 'text-yellow bg-yellow/10 border-yellow/20'
      case 'failed':
        return 'text-danger bg-danger/10 border-danger/20'
      default:
        return 'text-gray-500 bg-gray-100 border-gray/20'
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'airtime':
        return <Smartphone className="w-4 h-4 text-green-600" />
      case 'data':
        return <Wifi className="w-4 h-4 text-blue-600" />
      case 'wallet_funding':
      case 'funding':
        return <CreditCard className="w-4 h-4 text-purple-600" />
      case 'wallet_withdrawal':
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const handleRefreshBalance = async () => {
    setRefreshingBalance(true)
    try {
      await fetchWalletBalance()
      toast.success('Balance refreshed successfully!')
    } catch (error) {
      toast.error('Failed to refresh balance')
    } finally {
      setRefreshingBalance(false)
    }
  }

  const getTransactionAmount = (transaction: any) => {
    const isCredit = transaction.type === 'wallet_funding' || transaction.type === 'funding'
    return `${isCredit ? '+' : '-'}${formatAmount(transaction.amount)}`
  }

  const getTransactionReference = (transaction: any) => {
    return transaction.reference || transaction.wiaxyRef || 'N/A'
  }

  // const successfulTransactions = transactions.filter(t => t.status === 'successful') // Not currently used
  // const thisMonthTransactions = transactions.filter(t => {
  //   const transactionDate = new Date(t.createdAt)
  //   const currentDate = new Date()
  //   return transactionDate.getMonth() === currentDate.getMonth() && 
  //          transactionDate.getFullYear() === currentDate.getFullYear()
  // })

  // const totalSpent = successfulTransactions.reduce((sum, t) => 
  //   t.type !== 'wallet_funding' ? sum + t.amount : sum, 0
  // )

  return (
    <div className="space-y-8">
      {/* SEO Component */}
      <SEO 
        title="Dashboard | Kirkidata"
        description="Manage your Kirkidata account, view wallet balance, transaction history, and buy airtime and data bundles."
        keywords="Kirkidata dashboard, wallet balance, transaction history, account management"
        canonicalUrl="https://www.kirkidata.com/dashboard"
      />
      
      {/* Welcome Section */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="hidden sm:flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
       >
         <div>
           <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
             Welcome back, {user?.name?.split(' ')[0]}! 👋
           </h1>
           <p className="text-gray-600 mt-1 text-sm sm:text-base">
             Here's what's happening with your account today.
           </p>
         </div>
         <Link to="/fund-wallet">
           <Button className="w-full sm:w-auto bg-success hover:bg-success/90 text-white shadow-lg">
             <Plus className="w-4 h-4 mr-2" />
             Fund Wallet
           </Button>
         </Link>
       </motion.div>

                                                                                                               {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 -mt-4 sm:mt-0"
          >
                                                                                {/* Wallet Balance */}
              <Card className="bg-primary text-white border-0 shadow-lg -mt-6 sm:mt-0 h-full">
                               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-6 sm:pt-6">
                 <div className="flex items-center gap-2">
                   <CardTitle className="text-sm font-medium text-white/90">
                     Wallet Balance
                   </CardTitle>
                   <button
                     onClick={handleRefreshBalance}
                     disabled={refreshingBalance}
                     className="p-1 hover:bg-white/10 rounded transition-colors disabled:opacity-50"
                     title="Refresh wallet balance"
                   >
                     <RefreshCw className={`h-4 w-4 text-white/70 ${refreshingBalance ? 'animate-spin' : ''}`} />
                   </button>
                 </div>
                 <Wallet className="h-5 w-5 text-white/70" />
               </CardHeader>
                               <CardContent className="pt-2 sm:pt-0">
                 <div className="flex items-center justify-between">
                   <div className="text-2xl font-bold">
                     {showBalance ? formatAmount(walletBalance) : '₦••••••'}
                   </div>
                   <button
                     onClick={() => setShowBalance(!showBalance)}
                     className="p-1 hover:bg-white/10 rounded transition-colors"
                   >
                     {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                 </div>
                 <p className="text-xs text-white/80 mt-1">
                   Available for transactions
                 </p>
                             </CardContent>
             </Card>

                          {/* 9PSB Virtual Account Card */}
                          <div className="hidden sm:block h-full">
                            <NinePSBCard />
                          </div>

                          {/* PalmPay Virtual Account Card */}
                          <div className="hidden sm:block h-full">
                            <VirtualAccountsCard />
                          </div>
        </motion.div>

                          {/* Mobile Layout - Separate from desktop grid */}
          <div className="sm:hidden">
                                           {/* Mobile Virtual Account Toggle Buttons - Close to wallet balance */}
             <div className="flex gap-1 -mt-8">
             <button
               onClick={() => setActiveVirtualAccount('9PSB')}
               className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                 activeVirtualAccount === '9PSB'
                   ? 'bg-primary text-white shadow-md'
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
               }`}
             >
               9PSB Account
             </button>
             <button
               onClick={() => setActiveVirtualAccount('PALMPAY')}
               className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                 activeVirtualAccount === 'PALMPAY'
                   ? 'bg-primary text-white shadow-md'
                   : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
               }`}
             >
               Palmpay Account
             </button>
           </div>

           {/* Mobile Virtual Account Cards - Close to buttons */}
           <div className="mt-2">
            {activeVirtualAccount === '9PSB' ? (
              <NinePSBCard />
            ) : (
              <VirtualAccountsCard />
            )}
          </div>
        </div>

             {/* Main Content Grid - Web View Only */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5, delay: 0.2 }}
         className="hidden sm:grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
       >
         {/* Buy Airtime Section */}
         <Card className="border-0 shadow-lg">
           <CardHeader className="pb-4">
             <div className="flex items-center justify-between">
               <div>
                 <CardTitle className="text-lg font-bold text-gray-900">Buy Airtime</CardTitle>
                 <CardDescription className="text-gray-600">
                   Quick airtime purchase for all networks
                 </CardDescription>
               </div>
               <div className="p-3 bg-green-50 rounded-lg">
                 <Smartphone className="w-6 h-6 text-green-600" />
               </div>
             </div>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-3">
               {['MTN', 'Airtel', 'Glo', '9mobile'].map((network) => (
                 <div key={network} className="p-3 border border-gray-200 rounded-lg text-center hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                   <div className="text-sm font-medium text-gray-900">{network}</div>
                 </div>
               ))}
             </div>
             <Link to="/buy-airtime" className="block">
               <Button className="w-full bg-success hover:bg-success/90 text-white">
                 Buy Airtime
               </Button>
             </Link>
           </CardContent>
         </Card>

         {/* Buy Data Section */}
         <Card className="border-0 shadow-lg">
           <CardHeader className="pb-4">
             <div className="flex items-center justify-between">
               <div>
                 <CardTitle className="text-lg font-bold text-gray-900">Buy Data</CardTitle>
                 <CardDescription className="text-gray-600">
                   Affordable data plans for all networks
                 </CardDescription>
               </div>
               <div className="p-3 bg-blue-50 rounded-lg">
                 <Wifi className="w-6 h-6 text-blue-600" />
               </div>
             </div>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="space-y-2">
               {['1GB - ₦500', '2GB - ₦1,000', '5GB - ₦2,500', '10GB - ₦5,000'].map((plan) => (
                 <div key={plan} className="flex justify-between items-center p-2 border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer">
                   <span className="text-sm font-medium text-gray-900">{plan}</span>
                 </div>
               ))}
             </div>
             <Link to="/buy-data" className="block">
               <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                 Buy Data
               </Button>
             </Link>
           </CardContent>
         </Card>
       </motion.div>

               {/* Mobile Buy Buttons - Mobile View Only */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="sm:hidden"
        >
          <div className="grid grid-cols-2 gap-3">
            <Link to="/buy-airtime" className="block">
              <Button className="w-full bg-success hover:bg-success/90 text-white py-4 text-lg font-semibold">
                <Smartphone className="w-5 h-5 mr-3" />
                Airtime
              </Button>
            </Link>
            <Link to="/buy-data" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg font-semibold">
                <Wifi className="w-5 h-5 mr-3" />
                Buy Data
              </Button>
            </Link>
          </div>
        </motion.div>



      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">Transaction History</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  Your recent transactions and activities
                </CardDescription>
              </div>
              <Link to="/transactions" className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <History className="w-4 h-4 mr-2" />
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{transaction.description}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(transaction.status)} w-fit`}>
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:ml-2">
                      <p className="text-sm font-bold text-gray-900">
                        {getTransactionAmount(transaction)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{getTransactionReference(transaction)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
                  <p className="text-gray-500 mb-6">Start by buying airtime or data to see your transaction history here.</p>
                  <div className="flex gap-3 justify-center">
                    <Link to="/buy-airtime">
                      <Button size="sm">Buy Airtime</Button>
                    </Link>
                    <Link to="/buy-data">
                      <Button variant="outline" size="sm">Buy Data</Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Fund Wallet CTA */}
      {walletBalance < 1000 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="border-0 bg-accent/10 border border-accent/20">
            <CardContent className="py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-accent rounded-lg flex-shrink-0">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Low Wallet Balance</h3>
                    <p className="text-sm text-gray-600">Fund your wallet to continue enjoying our services</p>
                  </div>
                </div>
                <Link to="/fund-wallet" className="w-full sm:w-auto">
                  <Button className="bg-success hover:bg-success/90 text-white w-full sm:w-auto">
                    Fund Wallet
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default DashboardHome 