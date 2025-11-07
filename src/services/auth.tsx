// src/services/auth.tsx
import { loginUser as loginFromFile, registerUser as registerToFile } from '../data/users';
import { User } from '../types/User';

// регистрация нового пользователя
export async function registerUser(user: Omit<User, 'avatar'>): Promise<boolean> {
  // обязательно ждем результат
  const success = await registerToFile(user);
  return success;
}

// логин пользователя
export async function loginUser(email: string, password: string): Promise<User | null> {
  // обязательно ждем результат
  const user = await loginFromFile(email, password);
  return user;
}
