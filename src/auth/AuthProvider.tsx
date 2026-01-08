import { useState } from 'react';
import { AuthContext } from './AuthContext';
import { type User } from '../types/auth';
import * as authService from './auth.service';

const STORAGE_KEY = '@corujazz:auth';

interface StoredAuth {
  token: string;
  user: User;
}

function loadStoredAuth(): StoredAuth | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedAuth = loadStoredAuth();

  const [user, setUser] = useState<User | null>(
    storedAuth?.user ?? null,
  );

  const [token, setToken] = useState<string | null>(
    storedAuth?.token ?? null,
  );

  const [loading] = useState(false);

  async function login(email: string, password: string) {
    const response = await authService.login(email, password);

    const user = {
      role: response.role
    }

    setUser(user);
    setToken(response.access_token);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: response.access_token,
        user: user,
      }),
    );
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
