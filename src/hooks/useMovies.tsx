// src/hooks/useMovies.tsx
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/User';
import { Alert } from 'react-native';

const FAVORITES_KEY = 'favorites_movies';

export type Movie = {
  id: number;
  title: string;
  overview: string;
  age: string;
  genres: string[];
  duration: string;
  year: number;
  poster: string;
  link?: string;
};

const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Рыжая Соня',
    overview: 'Рыжая Соня — последняя представительница своего народа и хранительница древней магии. Император Дрейган использует научные достижения, чтобы завоевать мир. Соню захватывают и бросают на арену, где она сражается за свою жизнь.',
    age: '18+',
    genres: ['фэнтези', 'боевик'],
    duration: '110 мин',
    year: 2025,
    poster: 'https://kinogo-films.biz/uploads/mini/fullstory8/29/4a8ccbc6b38f02169f7fa1074534be.webp',
    link: 'https://kinogo.online/filmy/111749-ryzhaya-sonya.html',
  },
  {
    id: 2,
    title: 'Семейный призрак',
    overview: 'В поисках новой квартиры Василий находит заманчивое предложение: просторное жильё за вполне подъёмную сумму. Однако в нём есть «сюрприз», на который он поначалу не обращает внимания.',
    age: '6+',
    genres: ['комедия', 'фантастика'],
    duration: '80 мин',
    year: 2025,
    poster: 'https://kinogo-films.biz/uploads/mini/fullstory8/27/a1be0449e7dabae21afcb26e8534e1.webp',
    link: 'https://kinogo.online/filmy/108573-semeynyy-prizrak.html',
  },
  {
    id: 3,
    title: 'Соловей против Муромца',
    overview: 'Армия Соловья-Разбойника нападает на Чернигов-град, но богатырь Илья Муромец разбил её. Однако позже в стародавние времена злодей Соловей-разбойник нашел способ одолеть благородного витязя Илью Муромца, переписал историю и присвоил его воинскую славу.',
    age: '12+',
    genres: ['приключения', 'фантастика'],
    duration: '115 мин',
    year: 2025,
    poster: 'https://kinogo-films.biz/uploads/mini/fullstory8/81/0eda04778767aa659a8564e99f1d79.webp',
    link: 'https://kinogo.online/filmy/106601-solovej-protiv-muromca.html',
  },
];

export function useMovies(currentUser: User | null) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // загрузка фильмов и избранного
  useEffect(() => {
    const timer = setTimeout(async () => {
      setMovies(MOCK_MOVIES);

      if (currentUser) {
        const data = await AsyncStorage.getItem(FAVORITES_KEY + '_' + currentUser.email);
        setFavorites(data ? JSON.parse(data) : []);
      } else {
        setFavorites([]);
      }

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [currentUser]);

  // переключение избранного с мгновенным обновлением UI
  const toggleFav = async (id: number) => {
    if (!currentUser) {
      Alert.alert('Ошибка', 'Для добавления фильма в избранное нужно войти в профиль');
      return;
    }

    setFavorites(prev => {
      let updated: number[];
      if (prev.includes(id)) {
        updated = prev.filter(f => f !== id);
      } else {
        updated = [...prev, id];
      }

      // сохраняем обновлённое состояние в AsyncStorage
      AsyncStorage.setItem(FAVORITES_KEY + '_' + currentUser.email, JSON.stringify(updated));
      return updated;
    });
  };

  return { movies, favorites, toggleFav, loading };
}
