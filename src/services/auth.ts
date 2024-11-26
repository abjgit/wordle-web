// Temporary mock implementation
export const verifyWalletSignature = async (_address: string, _message: string, _signature: string): Promise<boolean> => {
  return true;
};

export const getChainId = async (): Promise<number> => {
  return 1;
};

export const useMetaMaskAuth = () => {
  return {
    signInWithMetaMask: async () => true,
    isConnected: false,
    address: null,
  };
};
