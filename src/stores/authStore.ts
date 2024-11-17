import { create } from 'zustand';
import { AuthState, User } from '@/types';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ConnectWallet, useAddress } from '@thirdweb-dev/react';

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
      const userDoc = await getDoc(doc(db, 'users', walletAddress));
      
      if (userDoc.exists()) {
        set({ user: userDoc.data() as User });
      } else {
        const newUser: User = {
          id: walletAddress,
          walletAddress,
          tier: 'BEGINNER',
          points: 0,
          gamesPlayed: 0,
          attemptsToday: 0,
        };
        await setDoc(doc(db, 'users', walletAddress), newUser);
        set({ user: newUser });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  loginWithEmail: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      const userDoc = await getDoc(doc(db, 'users', email));
      
      if (userDoc.exists()) {
        set({ user: userDoc.data() as User });
      } else {
        const newUser: User = {
          id: email,
          email,
          tier: 'BEGINNER',
          points: 0,
          gamesPlayed: 0,
          attemptsToday: 0,
        };
        await setDoc(doc(db, 'users', email), newUser);
        set({ user: newUser });
      }
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await auth.signOut();
      set({ user: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  updateUser: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      await setDoc(doc(db, 'users', user.id), { ...user, ...data }, { merge: true });
      set({ user: { ...user, ...data } });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },
}));
