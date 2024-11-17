# Wordle Web3 Game

A modern implementation of Wordle with Web3 authentication and a tier-based progression system. Built with React, TypeScript, and blockchain technology.

## Features

- 🎮 Classic Wordle gameplay
- 🌐 Web3 wallet integration (MetaMask, Rabby, Core)
- 📧 Email authentication option
- 🏆 Tier-based progression system
- 💎 Points system with multipliers
- 🎨 Modern, responsive UI
- ⌨️ Virtual and physical keyboard support

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/) (v7 or higher)
- A Web3 wallet (MetaMask, Rabby, or Core)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wordle-web.git
cd wordle-web
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password provider
4. Create a Firestore database
5. Copy your Firebase configuration to the `.env` file

## ThirdWeb Setup

1. Go to [ThirdWeb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project
3. Get your Client ID
4. Copy it to the `.env` file as `VITE_THIRDWEB_CLIENT_ID`

## Development

To run the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

1. Create a production build:
```bash
npm run build
```

2. Preview the production build locally:
```bash
npm run preview
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel
```

### Firebase Hosting Deployment

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase:
```bash
firebase init
```
- Select Hosting
- Choose your Firebase project
- Set build as your public directory
- Configure as a single-page app
- Don't overwrite build/index.html

4. Deploy to Firebase:
```bash
firebase deploy
```

## Project Structure

```
wordle-web/
├── src/
│   ├── components/     # React components
│   ├── config/         # Configuration files
│   ├── lib/           # Firebase and other initializations
│   ├── stores/        # Zustand state management
│   ├── types/         # TypeScript type definitions
│   ├── App.tsx        # Main App component
│   └── main.tsx       # Entry point
├── public/            # Static assets
├── .env              # Environment variables
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

## Game Mechanics

### Tiers
- Beginner: 1 word/day, 1x points multiplier
- Intermediate: 2 words/day, 1.5x points multiplier (requires 1000 points)
- Advanced: 3 words/day, 2x points multiplier (requires 2500 points)

### Points System
- Base points: 100
- Bonus points: 50 per remaining attempt
- Points are multiplied by tier coefficient

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email your-email@example.com or open an issue in the GitHub repository.

## Acknowledgments

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [ThirdWeb](https://thirdweb.com/)
- [Firebase](https://firebase.google.com/)
- [Styled Components](https://styled-components.com/)
- [Zustand](https://github.com/pmndrs/zustand)
