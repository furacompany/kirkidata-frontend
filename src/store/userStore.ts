import { create } from 'zustand'
import { UserState, Transaction } from '../types'
import { apiService } from '../services/api'
import toast from 'react-hot-toast'

interface UserStore extends UserState {
  updateWalletBalance: (amount: number) => void
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => void
  fetchTransactions: () => Promise<void>
  syncWalletBalance: (balance: number) => void
  fetchWalletBalance: () => Promise<void>
}

// Mock transactions for simulation
const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'airtime',
    amount: 1000,
    status: 'successful',
    description: 'Airtime purchase for MTN',
    phoneNumber: '+2348012345678',
    network: 'MTN',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    userId: '1',
    type: 'data',
    amount: 2500,
    status: 'successful',
    description: 'Data purchase for Airtel',
    phoneNumber: '+2348012345678',
    network: 'Airtel',
    dataPlan: '5GB - 30 Days',
    createdAt: '2024-01-14T15:20:00Z',
    updatedAt: '2024-01-14T15:20:00Z',
  },
  {
    id: '3',
    userId: '1',
    type: 'wallet_funding',
    amount: 10000,
    status: 'successful',
    description: 'Wallet funding via bank transfer',
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
  },
]

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
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    
    set(state => ({
      transactions: [newTransaction, ...state.transactions],
    }))
  },

  fetchTransactions: async () => {
    set({ isLoading: true })
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    set({
      transactions: mockTransactions,
      isLoading: false,
    })
  },

  syncWalletBalance: (balance: number) => {
    set({ walletBalance: balance })
  },

  fetchWalletBalance: async () => {
    try {
      const response = await apiService.getWalletBalance()
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