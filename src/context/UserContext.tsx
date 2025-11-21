// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/User';

/**
 * Тип контекста пользователя
 */
type UserContextType = {
  user: User | null;            // текущий пользователь или null
  setUser: (user: User | null) => void; // функция для обновления пользователя
};

/**
 * Контекст пользователя
 */
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

/**
 * Провайдер контекста пользователя
 * @param {Object} props
 * @param {ReactNode} props.children Дочерние элементы
 * @returns JSX элемент провайдера
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * Хук для получения контекста пользователя
 * @returns {UserContextType} Значения контекста
 */
export const useUser = () => useContext(UserContext);
