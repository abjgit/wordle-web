import { ConnectWallet } from '@thirdweb-dev/react';
import { useAuthStore } from '@/stores/authStore';

export const AuthButtons = () => {
  const { user, signIn, signOut } = useAuthStore();

  return (
    <div className="flex flex-col items-center gap-4">
      {!user ? (
        <ConnectWallet
          theme="dark"
          btnTitle="Connect Wallet"
          modalTitle="Choose your wallet"
          modalSize="wide"
          welcomeScreen={{
            title: "Welcome to Wordle",
            subtitle: "Connect your wallet to start playing",
          }}
          modalTitleIconUrl="/wordle-icon.png"
          onConnect={signIn}
        />
      ) : (
        <button
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Disconnect
        </button>
      )}
    </div>
  );
};
