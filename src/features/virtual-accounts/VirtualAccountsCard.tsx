import { useState, useEffect } from "react";
import { Copy, CheckCircle, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";
import {
  getUserVirtualAccounts,
  createVirtualAccount,
  type VirtualAccount,
} from "./api";

export default function VirtualAccountsCard() {

  const [userAccounts, setUserAccounts] = useState<VirtualAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const accountsResponse = await getUserVirtualAccounts();

      if (accountsResponse && accountsResponse.success) {
        // Handle both array and single object responses
        let accountsData: VirtualAccount[] = [];
        
        if (Array.isArray(accountsResponse.data)) {
          // If data is already an array, map each item
          accountsData = accountsResponse.data.map((account: any) => ({
            _id: account._id || account.id || 'unknown',
            userId: account.userId || 'unknown',
            reference: account.reference || 'unknown',
            accountNumber: account.accountNumber || account.virtualAccountNo,
            accountName: account.accountName || account.virtualAccountName,
            bankName: account.bankName || 'PALMPAY',
            bankId: account.bankId || 'PALMPAY',
            isActive: account.isActive || account.status === 'Enabled',
            isKYCVerified: account.isKYCVerified || false,
            createdAt: account.createdAt || new Date().toISOString(),
            updatedAt: account.updatedAt || new Date().toISOString(),
            __v: account.__v || 0
          }));
        } else if (accountsResponse.data && typeof accountsResponse.data === 'object') {
          // If data is a single account object, map it and wrap in array
          const accountData = accountsResponse.data as any;
          const mappedAccount: VirtualAccount = {
            _id: accountData._id || accountData.id || 'unknown',
            userId: accountData.userId || 'unknown',
            reference: accountData.reference || 'unknown',
            accountNumber: accountData.accountNumber || accountData.virtualAccountNo,
            accountName: accountData.accountName || accountData.virtualAccountName,
            bankName: accountData.bankName || 'PALMPAY',
            bankId: accountData.bankId || 'PALMPAY',
            isActive: accountData.isActive || accountData.status === 'Enabled',
            isKYCVerified: accountData.isKYCVerified || false,
            createdAt: accountData.createdAt || new Date().toISOString(),
            updatedAt: accountData.updatedAt || new Date().toISOString(),
            __v: accountData.__v || 0
          };
          accountsData = [mappedAccount];
        } else {
          // If data is null, undefined, or invalid, use empty array
          accountsData = [];
        }
        
        setUserAccounts(accountsData);
        
        if (isRefresh) {
          toast.success("Account data refreshed successfully");
        }
      } else {
        // If success is false or response is invalid, set empty array
        setUserAccounts([]);
      }
    } catch (err: any) {
      // Handle 401 errors silently - don't show error to user
      if (err?.response?.status === 401) {
        // Don't set error state for 401 - just return silently
        setUserAccounts([]);
        return;
      }
      
      // Handle 404 - No accounts found (this is normal for new users)
      if (err?.response?.status === 404) {
        // Don't log 404 errors as they're normal for users without accounts
        setUserAccounts([]);
        return;
      }
      
      // Only show other errors to user
      setError(err?.message || "Failed to load virtual account data");
      setUserAccounts([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreatePALMPAYAccount = async () => {
    try {
      setCreating(true);
      setError(null);
      
      const response = await createVirtualAccount();
      
      if (response.success) {
        toast.success("PALMPAY virtual account created successfully");
        // Refetch data to show the new account
        await fetchData();
      } else {
        throw new Error(response.message || "Failed to create PALMPAY virtual account");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to create PALMPAY virtual account";
      
      // Handle 401 errors silently - don't show error to user
      if (err?.response?.status === 401) {
        // Don't show toast or set error for 401
        return;
      }
      
      // Handle 409 - Account already exists
      if (err?.response?.status === 409) {
        toast.success("Virtual account already exists. Fetching your account...");
        // Refetch data to show the existing account
        await fetchData();
        return;
      }
      
      if (message.includes("duplicate reference")) {
        toast.error("Creation failed due to duplicate reference. Please try again.");
      } else {
        toast.error(message);
      }
      
      setError(message);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };



  const getCurrentBankAccount = () => {
    // Ensure userAccounts is an array before calling find
    if (!Array.isArray(userAccounts)) {
      return undefined;
    }
    return userAccounts.find(account => account.bankId === "PALMPAY");
  };

  const currentAccount = getCurrentBankAccount();
  const isBankAvailable = true; // PALMPAY is always available

  if (loading) {
    return (
      <Card className="border-0 shadow-md h-full">
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-gray-700">Virtual Account</CardTitle>
        
        {/* Bank Selection and Refresh Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing || loading}
            className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
            title="Refresh account data"
          >
            <RefreshCw className={`h-4 w-4 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <div className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white shadow-sm">
            PALMPAY
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Error Display */}
        {error && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        {/* Current Bank Account Display */}
        {currentAccount ? (
          <div className="space-y-3">
            {/* Account Number */}
            <div className="space-y-1">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Number</div>
              <div className="flex items-center gap-2">
                <div className="text-base font-bold tracking-wider text-gray-900 break-all">
                  {currentAccount.accountNumber}
                </div>
                <button
                  onClick={() => copyToClipboard(currentAccount.accountNumber, `${currentAccount._id}-num`)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0"
                  title="Copy account number"
                >
                  {copied === `${currentAccount._id}-num` ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
            </div>

                         {/* Account Name */}
             <div className="space-y-1">
               <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Account Name</div>
               <div className="text-sm font-medium text-gray-900 break-all">
                 {currentAccount.accountName}
               </div>
             </div>

            {/* Bank Name */}
            <div className="text-xs text-gray-500">
              Bank: PALMPAY
            </div>
          </div>
        ) : (
          /* No Account State */
          <div className="text-center py-6">
            <h3 className="text-base font-medium text-gray-900 mb-2">No PALMPAY Account</h3>
            <p className="text-sm text-gray-500 mb-3">
              Generate a PALMPAY virtual account to get started.
            </p>
            
            {isBankAvailable ? (
              <Button
                onClick={handleCreatePALMPAYAccount}
                disabled={creating}
                className="bg-primary hover:bg-primary/90 text-white text-sm px-4 py-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate PALMPAY Account"
                )}
              </Button>
            ) : (
              <div className="text-sm text-gray-500">
                PALMPAY is not available at the moment.
              </div>
            )}
          </div>
        )}


      </CardContent>
    </Card>
  );
}
