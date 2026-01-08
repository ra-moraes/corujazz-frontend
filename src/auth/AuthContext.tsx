import { createContext, useContext } from 'react';
import { type User } from '../types/auth';

interface AuthContextData {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export function useAuth() {
  return useContext(AuthContext);
}
