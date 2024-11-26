import { create } from 'zustand';

// Temporary type definition
interface User {
  id: string;
  email?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) => 
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : null
    }))
}));
