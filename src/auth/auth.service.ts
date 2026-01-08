import api from '../services/api';
import { type LoginResponse } from '../types/auth';

export async function login(email: string, password: string) {
  const { data } = await api.post<LoginResponse>('/auth/login', {
    email,
    password,
  });

  return data;
}
