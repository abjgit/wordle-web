export const APP_CONFIG = {
  url: process.env.VITE_APP_URL || 'https://wordle-web-nu.vercel.app',
  thirdwebClientId: process.env.VITE_THIRDWEB_CLIENT_ID,
  avalancheChainId: process.env.VITE_AVALANCHE_CHAIN_ID,
  avalancheRpcUrl: process.env.VITE_AVALANCHE_RPC_URL,
  avalancheExplorerUrl: process.env.VITE_AVALANCHE_EXPLORER_URL,
  avalancheContractAddress: process.env.VITE_AVALANCHE_CONTRACT_ADDRESS,
  firebaseApiKey: process.env.VITE_FIREBASE_API_KEY,
  firebaseAuthDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: process.env.VITE_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: process.env.VITE_FIREBASE_APP_ID,
  firebaseMeasurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};
