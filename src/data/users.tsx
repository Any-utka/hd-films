// src/data/users.tsx
import * as CryptoJS from 'crypto-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

const STORAGE_KEY = 'users';

/**
 * Хеширует пароль с помощью SHA256.
 * @param password Пароль пользователя
 * @returns Хеш пароля
 */
const hashPassword = (password: string) => CryptoJS.SHA256(password).toString();

/**
 * Дефолтные пользователи приложения
 */
const defaultUsers: User[] = [
  {
    name: 'Иван Иванов',
    email: 'ivan@mail.com',
    password: hashPassword('123456'),
    avatar: 'https://ui-avatars.com/api/?name=Иван+Иванов',
  },
  {
    name: 'Анна Смирнова',
    email: 'anna@mail.com',
    password: hashPassword('qwerty123'),
    avatar:
      'https://sun9-11.userapi.com/s/v1/ig2/svifrRP9diEduAHnGAmb8CrGb-Gz3YgV-PxvmbbSOPIwoKLUnMG4lEynPLTUZGv-H3gSz21X5nAsj0p13hr6IBva.jpg?quality=95&as=32x43,48x64,72x96,108x144,160x213,240x320,360x479,480x639,540x719,640x852,720x959,961x1280&from=bu&cs=961x0',
  },
];

/**
 * Получает список пользователей из хранилища.
 * Если данных нет, возвращает дефолтных пользователей.
 * @returns Список пользователей
 */
export async function getUsers(): Promise<User[]> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

/**
 * Сохраняет список пользователей в AsyncStorage
 * @param users Список пользователей
 */
async function saveUsers(users: User[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

/**
 * Регистрирует нового пользователя
 * @param user Данные пользователя без аватара
 * @returns true, если регистрация успешна, иначе false
 */
export async function registerUser(user: Omit<User, 'avatar'>): Promise<boolean> {
  const users = await getUsers();

  if (users.find((u) => u.email === user.email)) return false;

  const newUser: User = {
    ...user,
    password: hashPassword(user.password),
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`,
  };

  const updated = [...users, newUser];
  await saveUsers(updated);

  return true;
}

/**
 * Логинит пользователя по email и паролю
 * @param email Email пользователя
 * @param password Пароль пользователя
 * @returns Объект пользователя или null, если не найден
 */
export async function loginUser(email: string, password: string): Promise<User | null> {
  const users = await getUsers();
  const hashed = hashPassword(password);
  const found = users.find((u) => u.email === email && u.password === hashed) || null;

  return found;
}
