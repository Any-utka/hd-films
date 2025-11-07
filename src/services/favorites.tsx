// src/services/favorites.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';

const FAVORITES_KEY = 'favorites_movies';

// получить избранное для конкретного пользователя
export async function getFavorites(user: User | null): Promise<number[]> {
  if (!user?.email) return [];
  const data = await AsyncStorage.getItem(FAVORITES_KEY + '_' + user.email);
  return data ? JSON.parse(data) : [];
}

// добавить фильм в избранное
export async function addFavorite(id: number, user: User | null) {
  if (!user?.email) return;
  const favorites = await getFavorites(user);
  if (!favorites.includes(id)) {
    favorites.push(id);
    await AsyncStorage.setItem(FAVORITES_KEY + '_' + user.email, JSON.stringify(favorites));
  }
}

// удалить фильм из избранного
export async function removeFavorite(id: number, user: User | null) {
  if (!user?.email) return;
  let favorites = await getFavorites(user);
  favorites = favorites.filter(favId => favId !== id);
  await AsyncStorage.setItem(FAVORITES_KEY + '_' + user.email, JSON.stringify(favorites));
}

// переключить состояние избранного
export async function toggleFavorite(id: number, user: User | null) {
  if (!user?.email) return;
  const favorites = await getFavorites(user);
  if (favorites.includes(id)) {
    await removeFavorite(id, user);
  } else {
    await addFavorite(id, user);
  }
}
