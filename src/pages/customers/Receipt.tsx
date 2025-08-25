import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Download, ArrowLeft, CheckCircle, Clock, XCircle,
  Smartphone, Wifi, CreditCard, Copy, Check, Printer
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useUserStore } from '../../store/userStore'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'
import html2canvas from 'html2canvas'

const Receipt: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { transactions } = useUserStore()
  const { user } = useAuthStore()
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const receiptRef = useRef<HTMLDivElement>(null)

  const transaction = transactions.find(t => t._id === id)

  useEffect(() => {
    if (!transaction) {
      toast.error('Transaction not found!')
      navigate('/transactions')
    }
  }, [transaction, navigate])

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold mb-2">Receipt Not Found</h2>
          <p className="text-gray-600 mb-4">The transaction receipt you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/transactions')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'successful':
      case 'completed':
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
      case 'pending':
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow" />
      case 'failed':
        return <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-danger" />
      default:
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'airtime':
        return <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
      case 'data':
        return <Wifi className="w-4 h-4 sm:w-5 sm:h-5" />
      case 'wallet_funding':
      case 'funding':
        return <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
      case 'wallet_withdrawal':
      case 'withdrawal':
        return <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
      default:
        return <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`
  }

  const handleCopyReceipt = () => {
    const receiptText = `
        Kirkidata Recharge Platform
Transaction Receipt

Transaction ID: ${transaction._id}
Reference: ${transaction.reference || 'N/A'}
Date: ${formatDate(transaction.createdAt)}
Type: ${transaction.type}
Amount: ${formatAmount(transaction.amount)}
Status: ${transaction.status}
Description: ${transaction.description}
${transaction.network ? `Network: ${transaction.network}` : ''}
${transaction.phoneNumber ? `Phone: ${transaction.phoneNumber}` : ''}
${transaction.metadata?.bankName ? `Bank: ${transaction.metadata.bankName}` : ''}
${transaction.metadata?.accountNumber ? `Account: ${transaction.metadata.accountNumber}` : ''}

        Thank you for using Kirkidata!
    `.trim()

    navigator.clipboard.writeText(receiptText)
    setCopied(true)
    toast.success('Receipt copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = async () => {
    if (!receiptRef.current) return
    
    setIsDownloading(true)
    try {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        width: receiptRef.current.scrollWidth,
        height: receiptRef.current.scrollHeight
      })
      
      const link = document.createElement('a')
      link.download = `receipt-${transaction._id}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
      
      toast.success('Receipt downloaded successfully!')
    } catch (error) {
      console.error('Error downloading receipt:', error)
      toast.error('Failed to download receipt')
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2 sm:py-8">
      <div className="max-w-lg sm:max-w-2xl mx-auto px-2 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-4 sm:mb-6"
        >
          <Button
            variant="outline"
            onClick={() => navigate('/transactions')}
            className="w-full sm:w-auto text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Button>
          
          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleCopyReceipt} className="flex-1 sm:flex-none text-xs sm:text-sm">
              {copied ? <Check className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDownload} 
              disabled={isDownloading}
              className="flex-1 sm:flex-none text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download'}</span>
            </Button>
            <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Printer className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Print</span>
            </Button>
          </div>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          ref={receiptRef}
        >
          <Card className="print:shadow-none">
            <CardHeader className="text-center border-b p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm sm:text-xl">K</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-bold text-primary">Kirkidata</h1>
                  <p className="text-xs sm:text-sm text-gray-600">Recharge Platform</p>
                </div>
              </div>
              
              <div className="text-center">
                <h2 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">Transaction Receipt</h2>
                <p className="text-xs sm:text-sm text-gray-600 break-all">Transaction ID: {transaction._id}</p>
                {transaction.reference && (
                  <p className="text-xs sm:text-sm text-gray-600 break-all">Reference: {transaction.reference}</p>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-3 sm:p-6">
              {/* Transaction Details */}
              <div className="space-y-4 sm:space-y-6">
                {/* Status Banner */}
                <div className={`p-3 sm:p-4 rounded-lg border-2 ${
                  transaction.status === 'successful' || transaction.status === 'completed'
                    ? 'bg-success/10 border-success/20' 
                    : transaction.status === 'pending'
                    ? 'bg-yellow/10 border-yellow/20'
                    : 'bg-danger/10 border-danger/20'
                }`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <div className="font-medium capitalize text-sm sm:text-base">{transaction.status}</div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        {transaction.status === 'successful' && 'Transaction completed successfully'}
                        {transaction.status === 'completed' && 'Transaction completed successfully'}
                        {transaction.status === 'pending' && 'Transaction is being processed'}
                        {transaction.status === 'failed' && 'Transaction failed'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transaction Info */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Transaction Type</label>
                      <div className="flex items-center gap-2 mt-1">
                        {getTransactionIcon(transaction.type)}
                        <span className="font-medium capitalize text-sm sm:text-base">{transaction.type.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Amount</label>
                      <div className="text-lg sm:text-2xl font-bold text-primary mt-1">
                        {formatAmount(transaction.amount)}
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Date & Time</label>
                      <div className="font-medium mt-1 text-xs sm:text-base">{formatDate(transaction.createdAt)}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Description</label>
                      <div className="font-medium mt-1 text-xs sm:text-base break-words">{transaction.description}</div>
                    </div>
                    
                    {transaction.network && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Network</label>
                        <div className="font-medium mt-1 text-xs sm:text-base">{transaction.network}</div>
                      </div>
                    )}
                    
                    {transaction.phoneNumber && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Phone Number</label>
                        <div className="font-medium mt-1 text-xs sm:text-base">{transaction.phoneNumber}</div>
                      </div>
                    )}

                    {transaction.metadata?.bankName && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Bank</label>
                        <div className="font-medium mt-1 text-xs sm:text-base">{transaction.metadata.bankName}</div>
                      </div>
                    )}

                    {transaction.metadata?.accountNumber && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-gray-600">Account Number</label>
                        <div className="font-medium mt-1 text-xs sm:text-base">{transaction.metadata.accountNumber}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Customer Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Customer Name</label>
                      <div className="font-medium text-xs sm:text-base break-words">{user?.name}</div>
                    </div>
                    <div>
                      <label className="text-xs sm:text-sm font-medium text-gray-600">Customer Email</label>
                      <div className="font-medium text-xs sm:text-base break-all">{user?.email}</div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t pt-4 sm:pt-6 text-center">
                  <p className="text-gray-600 mb-1 sm:mb-2 text-xs sm:text-sm">Thank you for using Kirkidata!</p>
                  <p className="text-xs text-gray-500">
                    For support, contact us at support@kirkidata.com
                  </p>
                  <p className="text-xs text-gray-400 mt-1 sm:mt-2">
                    Receipt generated on {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default Receipt 