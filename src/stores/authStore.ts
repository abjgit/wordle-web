import { create } from 'zustand';
import { AuthState, User } from '@/types';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signInWithCustomToken } from 'firebase/auth';

interface AuthStore extends AuthState {
  login: (walletAddress: string) => Promise<void>;
  loginWithEmail: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (walletAddress: string) => {
    set({ isLoading: true, error: null });
    try {
      // Verificar si el usuario existe en Firestore
      const userRef = doc(db, 'users', walletAddress);
      const userDoc = await getDoc(userRef);

      let userData: User;

      if (userDoc.exists()) {
        userData = userDoc.data() as User;
      } else {
        // Crear nuevo usuario si no existe
        userData = {
          id: walletAddress,
          address: walletAddress,
          gamesPlayed: 0,
          gamesWon: 0,
          currentStreak: 0,
          bestStreak: 0,
          totalPoints: 0,
          createdAt: new Date().toISOString(),
        };
        await setDoc(userRef, userData);
      }

      set({ user: userData, isLoading: false });
    } catch (error) {
      console.error('Error logging in with wallet:', error);
      set({ error: 'Failed to login with wallet', isLoading: false });
    }
  },

  loginWithEmail: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      // Implementar lógica de login con email si es necesario
      set({ isLoading: false });
    } catch (error) {
      console.error('Error logging in with email:', error);
      set({ error: 'Failed to login with email', isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await auth.signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      console.error('Error logging out:', error);
      set({ error: 'Failed to logout', isLoading: false });
    }
  },

  updateUser: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      const updatedUser = { ...user, ...data };
      await setDoc(doc(db, 'users', user.id), updatedUser);
      set({ user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      set({ error: 'Failed to update user' });
    }
  },
}));
