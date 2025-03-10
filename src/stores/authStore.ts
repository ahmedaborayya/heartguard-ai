import { create } from 'zustand';

export type UserRole = 'patient' | 'doctor' | 'admin';

interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

interface SignUpData {
  email: string;
  password: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAdmin: boolean;
  isDoctor: boolean;
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
  role: 'patient',
  created_at: new Date().toISOString()
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isDoctor: false,
  loading: true,
  
  checkAuth: () => {
    // Check if user is logged in (e.g., from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        set({ 
          user, 
          loading: false, 
          isAdmin: user.role === 'admin',
          isDoctor: user.role === 'doctor'
        });
      } catch (error) {
        localStorage.removeItem('user');
        set({ user: null, loading: false, isAdmin: false, isDoctor: false });
      }
    } else {
      set({ loading: false });
    }
  },
  
  setUser: (user) => set({ 
    user, 
    loading: false, 
    isAdmin: user?.role === 'admin',
    isDoctor: user?.role === 'doctor'
  }),
  
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
          email: data.email,
          role: data.role
        };
        localStorage.setItem('user', JSON.stringify(newUser));
        set({ 
          user: newUser, 
          loading: false, 
          isAdmin: newUser.role === 'admin',
          isDoctor: newUser.role === 'doctor'
        });
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
        // For demo purposes, determine role based on email domain
        let role: UserRole = 'patient';
        if (email.endsWith('@admin.com')) role = 'admin';
        else if (email.endsWith('@doctor.com')) role = 'doctor';

        const user = {
          ...MOCK_USER,
          email,
          role
        };
        localStorage.setItem('user', JSON.stringify(user));
        set({ 
          user, 
          loading: false, 
          isAdmin: role === 'admin',
          isDoctor: role === 'doctor'
        });
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
        set({ user: null, loading: false, isAdmin: false, isDoctor: false });
        resolve();
      }, 500);
    });
  },
}));