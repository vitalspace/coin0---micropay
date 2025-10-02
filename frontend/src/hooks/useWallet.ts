import { derived, type Readable } from "svelte/store";
import {
  walletStore,
  userStore,
  walletService,
} from "@/services/walletServices";

export const useWallet = () => {
  const connect = async () => {
    await walletService.connectWallet();
  };

  const disconnect = async () => {
    await walletService.disconnectWallet();
  };

  const checkConnection = async () => {
    await walletService.checkConnection();
  };

  const isConnected: Readable<boolean> = derived(
    walletStore,
    ($walletStore) => $walletStore.isConnected
  );

  const address: Readable<string> = derived(
    walletStore,
    ($walletStore) => $walletStore.address
  );

  const provider = walletService.aptosProvider;

  return {
    walletStore,
    userStore,
    connect,
    disconnect,
    checkConnection,
    isConnected,
    address,
    provider,
  };
};
