// src/hooks/useMovies.tsx
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { getDB } from '../data/db';
import { User } from '../types/User';

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

export function useMovies(currentUser: User | null, dbReady: boolean) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!dbReady) return;

    const loadMovies = async () => {
      try {
        const db = await getDB();
        const moviesRes = await db.getAllAsync('SELECT * FROM movies;');
        const data: Movie[] = moviesRes.map((m: any) => ({
          id: m.id,
          title: m.title,
          overview: m.overview,
          age: m.age,
          genres: m.genres ? JSON.parse(m.genres) : [],
          duration: m.duration,
          year: m.year,
          poster: m.poster,
          link: m.link,
        }));
        setMovies(data);

        if (currentUser) {
          const userRow = await db.getFirstAsync('SELECT id FROM users WHERE email = ?;', [currentUser.email]);
          if (userRow) {
            const favRes = await db.getAllAsync('SELECT movieId FROM favorites WHERE userId = ?;', [userRow.id]);
            setFavorites(favRes.map((f: any) => f.movieId));
          } else {
            setFavorites([]);
          }
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error('Error loading movies/favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [currentUser, dbReady]);

  const toggleFav = async (movieId: number) => {
    if (!currentUser) {
      Alert.alert('Ошибка', 'Для добавления фильма в избранное нужно войти в профиль');
      return;
    }

    try {
      const db = await getDB();
      const userRow = await db.getFirstAsync('SELECT id FROM users WHERE email = ?;', [currentUser.email]);
      if (!userRow) return;

      const fav = await db.getFirstAsync(
        'SELECT * FROM favorites WHERE userId = ? AND movieId = ?;',
        [userRow.id, movieId]
      );

      if (fav) {
        await db.runAsync('DELETE FROM favorites WHERE userId = ? AND movieId = ?;', [userRow.id, movieId]);
        setFavorites(prev => prev.filter(f => f !== movieId));
      } else {
        await db.runAsync('INSERT INTO favorites (userId, movieId) VALUES (?, ?);', [userRow.id, movieId]);
        setFavorites(prev => [...prev, movieId]);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  return { movies, favorites, toggleFav, loading };
}
