import { http } from "../../lib/http";
import { VirtualAccountTransactionsResponse } from "../../types";

export type BankId = "PALMPAY";

export type VirtualAccount = {
  _id: string;
  userId: string;
  reference: string;
  accountNumber: string;
  accountName: string;
  bankName: string;
  bankId: BankId;
  isActive: boolean;
  isKYCVerified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export async function createVirtualAccount() {
  const { data } = await http.post("virtual-accounts/");
  return data;
}

export async function getUserVirtualAccounts() {
  const { data } = await http.get<{ success: boolean; message: string; data: VirtualAccount[] }>(
    "virtual-accounts/"
  );
  return data;
}

export async function getVirtualAccountById(id: string) {
  const { data } = await http.get<{ success: boolean; message: string; data: VirtualAccount }>(
    `virtual-accounts/${id}`
  );
  return data;
}

export async function upgradeVirtualAccountKyc(bvn: string) {
  const { data } = await http.post("virtual-accounts/kyc/upgrade", { bvn });
  return data;
}

export async function getVirtualAccountTransactions(page: number = 1, limit: number = 10) {
  const { data } = await http.get<VirtualAccountTransactionsResponse>(
    `virtual-accounts/transactions?page=${page}&limit=${limit}`
  );
  return data;
}

export async function getVirtualAccountTransactionsById(
  virtualAccountId: string, 
  limit: number = 10
) {
  const { data } = await http.get<VirtualAccountTransactionsResponse>(
    `virtual-accounts/${virtualAccountId}/transactions?limit=${limit}`
  );
  return data;
}
