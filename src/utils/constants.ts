import { clusterApiUrl } from "@solana/web3.js";
import * as Linking from "expo-linking";

// export const NETWORK = createSolanaRpc("mainnet-beta");
export const NETWORK = clusterApiUrl("mainnet-beta");

export const REDIRECT_LINKS = {
  onConnect: Linking.createURL("onConnect"),
  onDisconnect: Linking.createURL("onDisconnect"),
  onSignAndSendTransaction: Linking.createURL("onSignAndSendTransaction"),
  onSignAllTransactions: Linking.createURL("onSignAllTransactions"),
  onSignTransaction: Linking.createURL("onSignTransaction"),
  onSignMessage: Linking.createURL("onSignMessage"),
};

export const APP_HOMEPAGE = "https://lockfit.xyz";

export const USE_UNIVERSAL_LINKS = false;

export const buildUrl = (path: string, params: URLSearchParams) =>
  `${USE_UNIVERSAL_LINKS ? "https://phantom.app/ul/" : "phantom://"}v1/${path}?${params.toString()}`; 