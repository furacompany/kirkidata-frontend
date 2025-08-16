import { http } from "../../lib/http";
import { VirtualAccountTransactionsResponse } from "../../types";

export type BankId = "PALMPAY" | "9PSB";

export type AvailableBanksResponse = {
  success: boolean;
  message: string;
  data: {
    available: { bankId: BankId; bankName: string }[];
    existing: { bankId: BankId; bankName: string; accountNumber: string }[];
  };
};

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

export async function getAvailableBanks() {
  const { data } = await http.get<AvailableBanksResponse>("virtual-accounts/available-banks");
  return data;
}

export async function createVirtualAccount(bank: BankId) {
  const { data } = await http.post("virtual-accounts", { bank });
  return data;
}

export async function getUserVirtualAccounts() {
  const { data } = await http.get<{ success: boolean; message: string; data: VirtualAccount[] }>(
    "virtual-accounts"
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
