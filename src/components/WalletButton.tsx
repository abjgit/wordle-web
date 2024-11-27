import { ConnectWallet } from "@thirdweb-dev/react";
import type { ReactElement } from 'react';

export const WalletButton = (): ReactElement => {
  return (
    <div className="absolute top-4 right-4">
      <ConnectWallet 
        theme="dark"
        btnTitle="Connect Wallet"
        modalSize="wide"
      />
    </div>
  );
};
