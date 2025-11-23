// src/services/auth.tsx
import { loginUser as loginFromFile, registerUser as registerToFile } from '../data/users';
import { User } from '../types/User';

export async function registerUser(user: Omit<User, 'avatar'>): Promise<boolean> {
  return await registerToFile(user);
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  return await loginFromFile(email, password);
}
