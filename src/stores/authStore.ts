import { create } from 'zustand';
import { User } from '@/types';
import { auth } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  signIn: async () => {
    set({ isLoading: true, error: null });
    try {
      // La lógica de signIn se maneja en el componente AuthButtons
      // usando ThirdWeb ConnectWallet
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to sign in', isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await auth.signOut();
      set({ user: null, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to sign out', isLoading: false });
    }
  },

  updateUser: async (updates: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, updates);
      set({ user: { ...user, ...updates } });
    } catch (error) {
      set({ error: 'Failed to update user' });
    }
  }
}));
