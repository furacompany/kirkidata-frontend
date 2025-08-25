import { create } from 'zustand'
import { toast } from 'react-hot-toast'
import { userApiService } from '../services/userApi'
import { getVirtualAccountTransactions } from '../features/virtual-accounts/api'
import { UserState, Transaction } from '../types'

interface UserStore extends UserState {
  updateWalletBalance: (amount: number) => void
  addTransaction: (transactionData: Partial<Transaction>) => void
  fetchTransactions: () => Promise<void>
  syncWalletBalance: (balance: number) => void
  fetchWalletBalance: () => Promise<void>
}

export const useUserStore = create<UserStore>((set) => ({
  walletBalance: 5000,
  transactions: [],
  isLoading: false,

  updateWalletBalance: (amount: number) => {
    set(state => ({
      walletBalance: state.walletBalance + amount,
    }))
  },

  addTransaction: (transactionData) => {
    const newTransaction: Transaction = {
      ...transactionData,
      _id: Date.now().toString(),
      userId: '', // Will be set by the API
      type: 'wallet_funding',
      amount: 0,
      currency: 'NGN',
      status: 'pending',
      reference: '',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Transaction
    
    set(state => ({
      transactions: [newTransaction, ...state.transactions],
    }))
  },

  fetchTransactions: async () => {
    set({ isLoading: true })
    
    try {
      const response = await getVirtualAccountTransactions(1, 50)
      if (response.success && response.data) {
        set({
          transactions: response.data.transactions,
          isLoading: false,
        })
      } else {
        throw new Error(response.message || 'Failed to fetch transactions')
      }
    } catch (error) {
      console.error('Error fetching transactions:', error)
      set({ isLoading: false })
      // Don't show error toast for transactions as it might be expected for new users
    }
  },

  syncWalletBalance: (balance: number) => {
    set({ walletBalance: balance })
  },

  fetchWalletBalance: async () => {
    try {
      const response = await userApiService.getWalletBalance()
      if (response.success && response.data) {
        set({ walletBalance: response.data.walletBalance })
      } else {
        throw new Error(response.message || 'Failed to fetch wallet balance')
      }
    } catch (error) {
      toast.error('Failed to fetch wallet balance')
    }
  },
})) 