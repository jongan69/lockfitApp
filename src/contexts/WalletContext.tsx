import React, { createContext, useContext, useEffect, useCallback } from 'react'
import { useStore } from '../store'
import type { AuthState } from '../store'
import * as SecureStore from 'expo-secure-store'
import { WalletService } from '../services/WalletService'
import { PhantomWalletService } from '../services/PhantomWalletService'
import bs58 from 'bs58'
import nacl from 'tweetnacl'
// import { PublicKey } from '@solana/web3.js'
import { decryptPayload } from '../utils/crypto'
import { router } from 'expo-router'
import { PublicKey } from '@solana/web3.js'

type WalletContextType = Pick<AuthState, 'isAuthenticated' | 'walletType' | 'publicKey' | 'logout'> & {
  handleConnectResponse: (deepLink: string) => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useStore(state => state.isAuthenticated)
  const walletType = useStore(state => state.walletType)
  const publicKey = useStore(state => state.publicKey)
  const login = useStore(state => state.login)
  const logout = useStore(state => state.logout)
  const loadExistingWallet = useStore(state => state.loadExistingWallet)
  const setPhantomWallet = useStore(state => state.setPhantomWallet)
  
  // Create a single instance of PhantomWalletService
  const [phantomWalletService] = React.useState(() => new PhantomWalletService());

  // Initialize the store with our PhantomWalletService instance
  useEffect(() => {
    if (!isAuthenticated) {  // Only set if not authenticated
      setPhantomWallet(phantomWalletService);
    }
  }, [phantomWalletService, setPhantomWallet, isAuthenticated]);

  useEffect(() => {
    async function checkStoredWallet() {
      try {
        // Check if we have a stored local wallet
        const wallet = await WalletService.loadWallet()
        if (wallet) {
          loadExistingWallet(wallet.publicKey.toString())
          return
        }

        // Check for stored Phantom connection
        const phantomSession = await SecureStore.getItemAsync('phantom_session')
        if (phantomSession) {
          await login('phantom')
        }
      } catch (error) {
        console.error('Error loading stored wallet:', error)
      }
    }

    if (!isAuthenticated) {
      checkStoredWallet()
    }
  }, [isAuthenticated, login, loadExistingWallet])

  const handleConnectResponse = useCallback(async (deepLink: string) => {
    try {
      console.log('=== Connection Response Debug ===');
      console.log('1. Raw deepLink received:', deepLink);
      
      // Wait for PhantomWalletService to be ready
      await phantomWalletService.waitForInit();
      console.log('2. PhantomWalletService initialized');
      
      // Parse the URL and its parameters
      const url = new URL(deepLink);
      const params = url.searchParams;
      
      console.log('3. URL Parameters:', {
        errorCode: params.get("errorCode"),
        errorMessage: params.get("errorMessage"),
        phantom_encryption_public_key: params.get("phantom_encryption_public_key"),
        data: params.get("data"),
        nonce: params.get("nonce")
      });

      if (params.get("errorCode")) {
        console.log('4. Connection error:', params.get("errorMessage"));
        console.log('5. Redirecting to home due to error');
        router.push('/');
        return;
      }

      // Use the same dappKeyPair that was used in the connect request
      const dappKeyPair = {
        publicKey: phantomWalletService.getDappPublicKey(),
        secretKey: phantomWalletService.getSecretKey()
      };

      console.log('6. Using dapp public key:', bs58.encode(dappKeyPair.publicKey));

      // Create shared secret using the dapp's secret key and phantom's public key
      const sharedSecret = nacl.box.before(
        bs58.decode(params.get("phantom_encryption_public_key")!),
        dappKeyPair.secretKey
      );
      console.log('7. Created shared secret');

      // Decrypt the payload
      const connectData = decryptPayload(
        params.get("data")!,
        params.get("nonce")!,
        sharedSecret
      );
      console.log('8. Decrypted connect data:', connectData);

      const publicKey = connectData.public_key;
      console.log('9. Using public key:', publicKey);
      
      // Save the connection data using the same shared secret
      await phantomWalletService.setConnectionData(
        sharedSecret,
        connectData.session,
        publicKey
      );
      console.log('10. Set connection data in wallet service');
      
      // Update the store with the connected wallet
      setPhantomWallet(phantomWalletService);
      
      // Now login
      await login('phantom');
      console.log('11. Completed login');
      router.push('/home/(root)');
    } catch (error) {
      console.error('=== Connection Error ===');
      console.error('Failed to connect wallet:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        deepLink: deepLink
      });
    }
  }, [login, phantomWalletService, setPhantomWallet]);

  // Also expose the phantomWalletService for connect operations
  const contextValue = React.useMemo(() => ({
    isAuthenticated,
    walletType,
    publicKey,
    logout,
    handleConnectResponse,
    phantomWalletService, // Expose the service instance
  }), [isAuthenticated, walletType, publicKey, logout, handleConnectResponse, phantomWalletService]);

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 