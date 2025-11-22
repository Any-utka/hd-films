// app/(tabs)/library.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useMovies } from '../../src/hooks/useMovies';
import { useUser } from '../../src/context/UserContext';
import { useFocusEffect } from 'expo-router';

/**
 * Экран библиотеки с избранными фильмами пользователя
 * @returns JSX элемент экрана
 */
export default function LibraryScreen() {
  const { user } = useUser();
  const { movies, favorites: globalFavorites, toggleFav, loading, getFavorites } = useMovies(user);

  // Локальное состояние избранных фильмов
  const [favorites, setFavorites] = useState<number[]>(globalFavorites);

  // Синхронизация локальных избранных с глобальными
  // useEffect(() => {
  //   setFavorites(globalFavorites);
  // }, [globalFavorites]);

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const data = await getFavorites(user!);
        setFavorites(data ? JSON.parse(data) : []);
      })();
    }, [globalFavorites])
  );

  // Фильтруем фильмы только с пометкой "избранное"
  const favoriteMovies = movies.filter((movie) => favorites.includes(movie.id));

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Загрузка...</Text>
      </View>
    );
  }

  /**
   * Обработчик добавления/удаления фильма из избранного
   * @param id ID фильма
   */
  const handleToggleFav = (id: number) => {
    if (!user) {
      Alert.alert('Ошибка', 'Для изменения избранного нужно войти в профиль');
      return;
    }
    setFavorites((prev) => prev.filter((f) => f !== id));
    toggleFav(id);
  };

  return (
    <View style={styles.container}>
      {favoriteMovies.length === 0 ? (
        <Text style={styles.emptyText}>
          {user ? 'Нет понравившихся фильмов' : 'Войдите в профиль, чтобы видеть избранные фильмы'}
        </Text>
      ) : (
        <FlatList
          data={favoriteMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.movieItem}>
              <Image source={{ uri: item.poster }} style={styles.poster} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.genres}>{item.genres.join(', ')}</Text>
                <TouchableOpacity onPress={() => handleToggleFav(item.id)}>
                  <Text style={styles.remove}>Удалить из библиотеки ❤️</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.background, // фон экрана
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: '#1f1f2b',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  poster: { width: 80, height: 120, borderRadius: 8 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  genres: { color: theme.colors.muted, marginTop: 4 },
  remove: { color: 'red', marginTop: 8, fontWeight: 'bold' },
  emptyText: {
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
});
