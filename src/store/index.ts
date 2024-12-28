// import '../utils/crypto-polyfill';
import { Buffer } from "buffer";
import "react-native-url-polyfill/auto";
import "react-native-get-random-values";
global.Buffer = global.Buffer || Buffer;

import { create } from 'zustand'
import { PhantomWalletService } from '../services/PhantomWalletService'
import { WalletService } from '../services/WalletService'
import { Transaction } from '@solana/web3.js'
import { router } from "expo-router";
import * as SecureStore from 'expo-secure-store';

type WalletType = 'phantom' | 'local' | null

export interface AuthState {
  walletType: WalletType
  publicKey: string | null
  isAuthenticated: boolean
  isLoading: boolean
  phantomWallet: PhantomWalletService | null
  localWallet: typeof WalletService | null
  login: (type: WalletType) => Promise<void>
  logout: () => Promise<void>
  signTransaction: (transaction: Transaction) => Promise<Transaction>
  exportPrivateKey: () => Promise<string>
  loadExistingWallet: (publicKey: string) => void
  setPhantomWallet: (wallet: PhantomWalletService) => void
}

export const useStore = create<AuthState>((set, get) => ({
  walletType: null,
  publicKey: null,
  isAuthenticated: false,
  isLoading: false,
  phantomWallet: null,
  localWallet: null,

  loadExistingWallet: (publicKey: string) => {
    set({
      walletType: 'local',
      localWallet: WalletService,
      isAuthenticated: true,
      publicKey
    });
  },

  setPhantomWallet: (wallet: PhantomWalletService) => {
    set({
      walletType: 'phantom',
      phantomWallet: wallet,
      isAuthenticated: false,
      publicKey: null
    });
  },

  login: async (type: WalletType) => {
    set({ isLoading: true });
    try {
      await SecureStore.setItemAsync('preferred_wallet', type || '');

      if (type === 'phantom') {
        const { phantomWallet } = get();
        if (!phantomWallet) {
          throw new Error('PhantomWallet not initialized');
        }

        if (!phantomWallet.getPublicKey()) {
          await phantomWallet.connect();
        } else {
          set({
            walletType: 'phantom',
            isAuthenticated: true,
            publicKey: phantomWallet.getPublicKey()?.toString() || null
          });
        }
      } else if (type === 'local') {
        const wallet = await WalletService.createWallet();
        set({
          walletType: 'local',
          localWallet: WalletService,
          isAuthenticated: true,
          publicKey: wallet.publicKey.toString()
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      if (type === 'phantom') {
        set({
          walletType: null,
          phantomWallet: null,
          isAuthenticated: false,
          publicKey: null
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    const { walletType, phantomWallet, localWallet } = get()
    if (walletType === 'phantom' && phantomWallet) {
      await phantomWallet.disconnect()
    } else if (walletType === 'local' && localWallet) {
      await localWallet.deleteWallet()
    }
    set({
      walletType: null,
      phantomWallet: null,
      localWallet: null,
      publicKey: null,
      isAuthenticated: false
    })
    router.push('/LoginScreen')
  },

  signTransaction: async (transaction: Transaction) => {
    const { walletType, phantomWallet, localWallet } = get()

    if (!walletType || !get().isAuthenticated) {
      throw new Error('Not authenticated')
    }

    if (walletType === 'phantom' && phantomWallet) {
      await phantomWallet.signTransaction()
      return transaction
    } else if (walletType === 'local' && localWallet) {
      return await localWallet.signTransaction(transaction)
    }

    throw new Error('No wallet available')
  },

  exportPrivateKey: async () => {
    const { walletType, localWallet } = get()

    if (walletType === 'phantom') {
      throw new Error('Cannot export private key from Phantom wallet')
    }

    if (walletType === 'local' && localWallet) {
      const privateKey = await localWallet.exportPrivateKey()
      if (!privateKey) throw new Error('No private key available')
      return privateKey
    }

    throw new Error('No wallet available')
  }
})) 