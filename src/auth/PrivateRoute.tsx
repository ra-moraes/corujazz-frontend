import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function PrivateRoute({ children }: Props) {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
}
