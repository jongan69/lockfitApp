import { Keypair, Transaction } from "@solana/web3.js";
import * as SecureStore from 'expo-secure-store';
import nacl from 'tweetnacl';

export class WalletService {
  private static readonly WALLET_KEY = 'local_wallet';
  private static currentWallet: Keypair | null = null;
  
  static async createWallet(): Promise<Keypair> {
    const newWallet = Keypair.generate();
    
    // Save wallet securely
    await SecureStore.setItemAsync(
      this.WALLET_KEY,
      Buffer.from(newWallet.secretKey).toString('base64')
    );
    
    this.currentWallet = newWallet;
    return newWallet;
  }
  
  static async loadWallet(): Promise<Keypair | null> {
    const savedWallet = await SecureStore.getItemAsync(this.WALLET_KEY);
    
    if (!savedWallet) {
      return null;
    }
    
    const secretKey = Buffer.from(savedWallet, 'base64');
    this.currentWallet = Keypair.fromSecretKey(secretKey);
    return this.currentWallet;
  }
  
  static async deleteWallet(): Promise<void> {
    await SecureStore.deleteItemAsync(this.WALLET_KEY);
    this.currentWallet = null;
  }

  static async signTransaction(transaction: Transaction): Promise<Transaction> {
    if (!this.currentWallet) {
      throw new Error("No wallet available");
    }
    transaction.sign(this.currentWallet);
    return transaction;
  }

  static async signMessage(message: Uint8Array): Promise<Uint8Array> {
    if (!this.currentWallet) {
      throw new Error("No wallet available");
    }
    return nacl.sign.detached(message, this.currentWallet.secretKey);
  }

  static getCurrentWallet(): Keypair | null {
    return this.currentWallet;
  }

  static async exportPrivateKey(): Promise<string | null> {
    // WARNING: This function exports sensitive key material.
    // Only use this for backup purposes and ensure secure handling of the output.
    if (!this.currentWallet) {
      throw new Error("No wallet available");
    }
    
    return Buffer.from(this.currentWallet.secretKey).toString('base64');
  }
} 