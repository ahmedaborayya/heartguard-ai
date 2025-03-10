import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  created_at: string;
}

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  checkAuth: () => void;
  setUser: (user: User | null) => void;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Mock user for demonstration
const MOCK_USER: User = {
  id: 'user-123',
  email: 'user@example.com',
  created_at: new Date().toISOString()
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  loading: true,
  
  checkAuth: () => {
    // Check if user is logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ user, loading: false, isAdmin: user.email === 'admin@example.com' });
      } catch (error) {
        localStorage.removeItem('user');
        set({ user: null, loading: false, isAdmin: false });
      }
    } else {
      set({ loading: false });
    }
  },
  
  setUser: (user) => set({ user, loading: false, isAdmin: user?.email === 'admin@example.com' }),
  
  signUp: async (data: SignUpData) => {
    // This would be replaced with your actual API call
    // const response = await fetch('/api/auth/signup', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data)
    // });
    // const userData = await response.json();
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          ...MOCK_USER,
          email: data.email
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        set({ user: newUser, loading: false, isAdmin: newUser.email === 'admin@example.com' });
        resolve();
      }, 1000);
    });
  },
  
  signIn: async (email: string, password: string) => {
    // This would be replaced with your actual API call
    // const response = await fetch('/api/auth/signin', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const userData = await response.json();
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // For demo purposes, any email/password combination works
        const user = {
          ...MOCK_USER,
          email
        };
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, loading: false, isAdmin: email === 'admin@example.com' });
        resolve();
      }, 1000);
    });
  },
  
  signOut: async () => {
    // This would be replaced with your actual API call
    // await fetch('/api/auth/signout', { method: 'POST' });
    
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('user');
        set({ user: null, loading: false, isAdmin: false });
        resolve();
      }, 500);
    });
  },
}));