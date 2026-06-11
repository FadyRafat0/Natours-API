import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import API from '../api';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (formData: FormData) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const res = await API.get('/users/me');
      setUser(res.data.data);
    } catch {
      setUser(null);
    }
  }, []);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await API.get('/users/me');
        setUser(res.data.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await API.post('/users/login', { email, password });
    setUser(res.data.data);
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    passwordConfirm: string
  ) => {
    const res = await API.post('/users/signup', {
      name,
      email,
      password,
      passwordConfirm,
    });
    setUser(res.data.data);
  };

  const logout = async () => {
    await API.post('/users/logout');
    setUser(null);
  };

  const updateUser = async (formData: FormData) => {
    const res = await API.patch('/users/me', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    setUser(res.data.data);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, updateUser, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
