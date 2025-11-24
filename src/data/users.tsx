// src/data/users.tsx
import { getDB } from './db';
import * as CryptoJS from 'crypto-js';
import { User } from '../types/User';

const hashPassword = (password: string) => CryptoJS.SHA256(password).toString();

// Регистрация пользователя
export const registerUser = async (user: Omit<User, 'avatar'>): Promise<boolean> => {
  try {
    const db = await getDB();
    const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`;

    await db.withTransactionAsync(async () => {
      await db.runAsync(
        "INSERT INTO users (name, email, password, avatar) VALUES (?, ?, ?, ?);",
        [user.name, user.email, hashPassword(user.password), avatar]
      );
    });

    return true;
  } catch (err) {
    console.error('Ошибка регистрации:', err);
    return false;
  }
};

// Логин пользователя
export const loginUser = async (email: string, password: string): Promise<User | null> => {
  try {
    const db = await getDB();

    // getAllAsync возвращает массив объектов
    const rows = await db.getAllAsync(
      "SELECT * FROM users WHERE email = ? AND password = ?;",
      [email, hashPassword(password)]
    );

    if (rows.length > 0) {
      return rows[0] as User;
    }

    return null;
  } catch (err) {
    console.error('Ошибка логина:', err);
    return null;
  }
};
