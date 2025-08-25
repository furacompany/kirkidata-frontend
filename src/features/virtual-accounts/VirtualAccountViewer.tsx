import { useState } from "react";
import { Search, Loader2, AlertCircle, CheckCircle, Activity, CreditCard, ArrowUpRight } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { getVirtualAccountById, getVirtualAccountTransactionsById, type VirtualAccount } from "./api";
import { Transaction } from "../../types";
import toast from "react-hot-toast";

export default function VirtualAccountViewer() {
  const [accountId, setAccountId] = useState("");
  const [account, setAccount] = useState<VirtualAccount | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!accountId.trim()) {
      toast.error("Please enter an account ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setAccount(null);
      setTransactions([]);

      const response = await getVirtualAccountById(accountId.trim());
      
      if (response.success) {
        setAccount(response.data);
        
        // Fetch transactions for this account
        try {
          const transactionsResponse = await getVirtualAccountTransactionsById(accountId.trim(), 10);
          if (transactionsResponse.success && transactionsResponse.data) {
            setTransactions(transactionsResponse.data.transactions);
          }
        } catch (transactionError) {
          // Don't show error for transactions as it might be expected for new accounts
        }
        
        toast.success("Account found!");
      } else {
        throw new Error(response.message || "Account not found");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to fetch account";
      
      // Handle 401 errors silently - don't show error to user
      if (message.includes('401') || err?.response?.status === 401) {
        // Don't show error or toast for 401
        return;
      }
      
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const getBankLogo = (bankId: string) => {
    switch (bankId) {
      case "PALMPAY":
        return "🏦";
      case "9PSB":
        return "🏛️";
      default:
        return "🏦";
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'funding':
        return <CreditCard className="w-4 h-4 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'failed':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const formatAmount = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h4 className="text-sm font-medium text-gray-700 mb-3">View Account by ID</h4>
      
      <div className="flex gap-2 mb-4">
        <input
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          placeholder="Enter Virtual Account ID"
          className="flex-1 rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          disabled={loading}
        />
        <Button
          onClick={handleSearch}
          disabled={loading || !accountId.trim()}
          size="sm"
          className="px-4"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      {/* Account Display */}
      {account && (
        <div className="rounded-lg border bg-gray-50 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-gray-900">Account Found</span>
          </div>
          
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getBankLogo(account.bankId)}</span>
              <span className="font-medium">{account.bankName}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Account Number:</span>
              <span className="ml-2 font-mono font-bold">{account.accountNumber}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Account Name:</span>
              <span className="ml-2 font-medium">{account.accountName}</span>
            </div>
            
            <div>
              <span className="text-gray-600">Reference:</span>
              <span className="ml-2 font-mono text-xs">{account.reference}</span>
            </div>
            
            <div className="flex gap-2">
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  account.isActive
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {account.isActive ? "Active" : "Inactive"}
              </span>
              <span
                className={`rounded-full px-2 py-1 text-xs ${
                  account.isKYCVerified
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {account.isKYCVerified ? "KYC Verified" : "KYC Pending"}
              </span>
            </div>
            
            <div className="text-xs text-gray-500">
              Created: {new Date(account.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      )}

      {/* Transactions Display */}
      {transactions.length > 0 && (
        <div className="rounded-lg border bg-gray-50 p-4">
          <h5 className="text-sm font-medium text-gray-900 mb-3">Recent Transactions</h5>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{transaction.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</span>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    {transaction.type === 'funding' ? '+' : '-'}{formatAmount(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">{transaction.reference}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {account && transactions.length === 0 && (
        <div className="rounded-lg border bg-gray-50 p-4 text-center">
          <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">No transactions found for this account</p>
        </div>
      )}
    </div>
  );
}
