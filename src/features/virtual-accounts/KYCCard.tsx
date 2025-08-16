import { useState } from "react";
import { Shield, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import toast from "react-hot-toast";
import { upgradeVirtualAccountKyc } from "./api";

export default function KYCCard() {
  const [bvn, setBvn] = useState("");
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpgradeKYC = async () => {
    if (!bvn.trim()) {
      toast.error("Please enter a BVN");
      return;
    }

    if (bvn.trim().length !== 11) {
      toast.error("BVN must be 11 digits");
      return;
    }

    try {
      setUpgrading(true);
      setError(null);
      
      const response = await upgradeVirtualAccountKyc(bvn.trim());
      
      if (response.success) {
        toast.success("Account upgraded successfully");
        setBvn("");
        // You can add a callback here to refresh parent data if needed
      } else {
        throw new Error(response.message || "Failed to upgrade KYC");
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Failed to upgrade KYC";
      toast.error(message);
      setError(message);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700">KYC Verification</CardTitle>
        <div className="p-2 bg-green-50 rounded-lg">
          <Shield className="h-4 w-4 text-green-600" />
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

        {/* BVN Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Bank Verification Number (BVN)
          </label>
          <div className="relative">
            <input
              value={bvn}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                setBvn(value);
              }}
              placeholder="Enter your 11-digit BVN"
              className="w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base font-mono tracking-wider"
              inputMode="numeric"
              maxLength={11}
              disabled={upgrading}
            />
            {bvn.length === 11 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            )}
          </div>

        </div>

        {/* Upgrade Button */}
        <Button
          onClick={handleUpgradeKYC}
          disabled={upgrading || bvn.trim().length !== 11}
          className="w-full rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-50 py-2"
        >
          {upgrading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Upgrading...
            </>
          ) : (
            <>
              <Shield className="h-4 w-4 mr-2" />
              Upgrade KYC
            </>
          )}
        </Button>


      </CardContent>
    </Card>
  );
}
