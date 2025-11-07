// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types/User';

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // глобальный пользователь в сессии

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
