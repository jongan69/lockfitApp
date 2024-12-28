import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";
import * as Linking from "expo-linking";
import * as SecureStore from 'expo-secure-store';
import { encryptPayload } from "../utils/crypto";
import { REDIRECT_LINKS, buildUrl } from "../utils/constants";
import { createTransferTransaction } from "../utils/transactions";

export class PhantomWalletService {
  private static readonly PHANTOM_SESSION_KEY = 'phantom_session';
  private static readonly DAPP_KEYPAIR_KEY = 'phantom_dapp_keypair';
  private dappKeyPair: nacl.BoxKeyPair;
  private sharedSecret?: Uint8Array;
  private session?: string;
  private phantomWalletPublicKey?: PublicKey;
  private isReady: boolean = false;
  private initPromise: Promise<void>;

  constructor() {
    this.dappKeyPair = nacl.box.keyPair();
    this.initPromise = this.initializeKeyPair().then(() => {
      this.isReady = true;
    });
  }

  private async initializeKeyPair() {
    try {
      // Try to load existing keypair
      const storedKeyPair = await SecureStore.getItemAsync(PhantomWalletService.DAPP_KEYPAIR_KEY);
      if (storedKeyPair) {
        const { publicKey, secretKey } = JSON.parse(storedKeyPair);
        this.dappKeyPair = {
          publicKey: new Uint8Array(Object.values(publicKey)),
          secretKey: new Uint8Array(Object.values(secretKey))
        };
        console.log('Loaded existing dapp keypair');
      } else {
        // Generate and store a new keypair
        this.dappKeyPair = nacl.box.keyPair();
        // Store the new keypair
        await SecureStore.setItemAsync(
          PhantomWalletService.DAPP_KEYPAIR_KEY,
          JSON.stringify({
            publicKey: Array.from(this.dappKeyPair.publicKey),
            secretKey: Array.from(this.dappKeyPair.secretKey)
          })
        );
        console.log('Generated and stored new dapp keypair');
      }
      console.log('Using dapp public key:', bs58.encode(this.dappKeyPair.publicKey));
    } catch (error) {
      console.error('Error initializing keypair:', error);
      // If there's an error loading, generate a new keypair but don't store it
      this.dappKeyPair = nacl.box.keyPair();
      console.log('Generated fallback dapp keypair');
    }
  }

  private async waitForReady() {
    if (!this.isReady) {
      await new Promise(resolve => {
        const check = () => {
          if (this.isReady) resolve(true);
          else setTimeout(check, 100);
        };
        check();
      });
    }
  }

  public async setConnectionData(sharedSecret: Uint8Array, session: string, publicKey: PublicKey) {
    await this.waitForReady(); // Ensure keypair is initialized
    this.sharedSecret = sharedSecret;
    this.session = session;
    this.phantomWalletPublicKey = publicKey;

    // Store session in SecureStore
    await SecureStore.setItemAsync(PhantomWalletService.PHANTOM_SESSION_KEY, session);
  }

  public async clearConnectionData() {
    this.sharedSecret = undefined;
    this.session = undefined;
    this.phantomWalletPublicKey = undefined;

    // Remove session from SecureStore, but keep the keypair
    await SecureStore.deleteItemAsync(PhantomWalletService.PHANTOM_SESSION_KEY);
  }

  // Add method to explicitly clear everything including keypair
  public async clearAll() {
    await this.clearConnectionData();
    await SecureStore.deleteItemAsync(PhantomWalletService.DAPP_KEYPAIR_KEY);
    // Generate new keypair after clearing
    this.dappKeyPair = nacl.box.keyPair();
    await this.initializeKeyPair();
  }

  public getDappPublicKey(): Uint8Array {
    if (!this.isReady) {
      throw new Error('PhantomWalletService not ready');
    }
    return this.dappKeyPair.publicKey;
  }

  public getSecretKey(): Uint8Array {
    if (!this.isReady) {
      throw new Error('PhantomWalletService not ready');
    }
    return this.dappKeyPair.secretKey;
  }

  public getSharedSecret(): Uint8Array | undefined {
    return this.sharedSecret;
  }

  public getPublicKey(): PublicKey | undefined {
    return this.phantomWalletPublicKey;
  }

  public async connect() {
    await this.waitForReady();
    console.log('=== PhantomWalletService Debug ===');
    console.log('Dapp public key:', bs58.encode(this.dappKeyPair.publicKey));
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(this.dappKeyPair.publicKey),
      cluster: "mainnet-beta",
      app_url: "https://phantom.app",
      redirect_link: REDIRECT_LINKS.onConnect
    });

    const url = buildUrl("connect", params);
    await Linking.openURL(url);
  }

  public async disconnect() {
    if (!this.session) return;

    const payload = { session: this.session };
    const [nonce, encryptedPayload] = encryptPayload(payload, this.sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(this.dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: REDIRECT_LINKS.onDisconnect,
      payload: bs58.encode(encryptedPayload)
    });

    const url = buildUrl("disconnect", params);
    await Linking.openURL(url);

    // Clear connection data after disconnecting
    this.sharedSecret = undefined;
    this.session = undefined;
    this.phantomWalletPublicKey = undefined;
    await SecureStore.deleteItemAsync(PhantomWalletService.PHANTOM_SESSION_KEY);
  }

  public async signAndSendTransaction() {
    if (!this.phantomWalletPublicKey || !this.session) return;

    const transaction = await createTransferTransaction(new PublicKey(this.phantomWalletPublicKey), new PublicKey(this.phantomWalletPublicKey), 100);
    const serializedTransaction = transaction.serialize({ requireAllSignatures: false });

    const payload = {
      session: this.session,
      transaction: bs58.encode(serializedTransaction)
    };
    const [nonce, encryptedPayload] = encryptPayload(payload, this.sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(this.dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: REDIRECT_LINKS.onSignAndSendTransaction,
      payload: bs58.encode(encryptedPayload)
    });

    const url = buildUrl("signAndSendTransaction", params);
    await Linking.openURL(url);
  }

  public async signAllTransactions() {
    if (!this.phantomWalletPublicKey || !this.session) return;

    const transactions = await Promise.all([
      createTransferTransaction(new PublicKey(this.phantomWalletPublicKey), new PublicKey(this.phantomWalletPublicKey), 100),
      createTransferTransaction(new PublicKey(this.phantomWalletPublicKey), new PublicKey(this.phantomWalletPublicKey), 100)
    ]);

    const serializedTransactions = transactions.map((t) =>
      bs58.encode(t.serialize({ requireAllSignatures: false }))
    );

    const payload = {
      session: this.session,
      transactions: serializedTransactions
    };

    const [nonce, encryptedPayload] = encryptPayload(payload, this.sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(this.dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: REDIRECT_LINKS.onSignAllTransactions,
      payload: bs58.encode(encryptedPayload)
    });

    const url = buildUrl("signAllTransactions", params);
    await Linking.openURL(url);
  }

  public async signTransaction() {
    if (!this.phantomWalletPublicKey || !this.session) return;

    const transaction = await createTransferTransaction(new PublicKey(this.phantomWalletPublicKey), new PublicKey(this.phantomWalletPublicKey), 100);
    const serializedTransaction = bs58.encode(
      transaction.serialize({ requireAllSignatures: false })
    );

    const payload = {
      session: this.session,
      transaction: serializedTransaction
    };

    const [nonce, encryptedPayload] = encryptPayload(payload, this.sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(this.dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: REDIRECT_LINKS.onSignTransaction,
      payload: bs58.encode(encryptedPayload)
    });

    const url = buildUrl("signTransaction", params);
    await Linking.openURL(url);
  }

  public async signMessage(message: string) {
    if (!this.session) return;

    const payload = {
      session: this.session,
      message: bs58.encode(Buffer.from(message))
    };

    const [nonce, encryptedPayload] = encryptPayload(payload, this.sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(this.dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: REDIRECT_LINKS.onSignMessage,
      payload: bs58.encode(encryptedPayload)
    });

    const url = buildUrl("signMessage", params);
    await Linking.openURL(url);
  }

  // Add method to wait for initialization
  public async waitForInit() {
    await this.initPromise;
  }

  // Add other methods (signAndSendTransaction, signMessage, etc.)
} 