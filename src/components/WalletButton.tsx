import { ConnectWallet } from "@thirdweb-dev/react";
import type { ReactElement } from 'react';

export const WalletButton = (): ReactElement => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ConnectWallet 
        theme="light"
        btnTitle="Connect Wallet"
        modalSize="wide"
        className="!bg-pink-500 hover:!bg-pink-600"
      />
    </div>
  );
};
