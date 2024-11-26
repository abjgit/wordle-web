import React from 'react';
import { ConnectWallet } from "@thirdweb-dev/react";

export const AuthButtons: React.FC = () => {
  return (
    <div className="flex justify-end p-4">
      <ConnectWallet />
    </div>
  );
};
