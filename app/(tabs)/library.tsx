// app/(tabs)/library.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../../src/theme/theme';
import { useMovies } from '../../src/hooks/useMovies';
import { useUser } from '../../src/context/UserContext';
import { useFocusEffect } from 'expo-router';
import { setupDatabase, getDB } from '../../src/data/db';

export default function LibraryScreen() {
  const { user } = useUser();
  const [dbReady, setDbReady] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Инициализация БД и загрузка избранного при каждом фокусе
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const initDBAndLoadFavorites = async () => {
        try {
          await setupDatabase();
          if (!isActive) return;
          setDbReady(true);

          if (!user) {
            setFavorites([]);
            return;
          }

          const db = await getDB();
          const userRow = await db.getFirstAsync('SELECT id FROM users WHERE email = ?;', [user.email]);
          if (!userRow) {
            setFavorites([]);
            return;
          }

          const favRes = await db.getAllAsync('SELECT movieId FROM favorites WHERE userId = ?;', [userRow.id]);
          if (isActive) setFavorites(favRes.map((f: any) => f.movieId));
        } catch (err) {
          console.error('Ошибка инициализации БД или загрузки избранного:', err);
        }
      };

      initDBAndLoadFavorites();
      return () => { isActive = false; };
    }, [user])
  );

  const { movies, toggleFav, loading } = useMovies(user, dbReady);
  const favoriteMovies = movies.filter((movie) => favorites.includes(movie.id));

  const handleToggleFav = async (id: number) => {
    if (!user) {
      Alert.alert('Ошибка', 'Для изменения избранного нужно войти в профиль');
      return;
    }

    // Оптимистично обновляем UI
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

    try {
      await toggleFav(id);
    } catch (err) {
      console.error('Ошибка при toggleFav:', err);
    }
  };

  if (!dbReady || loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Загрузка...</Text>
      </View>
    );
  }

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
  container: { flex: 1, padding: 16, backgroundColor: theme.colors.background },
  movieItem: { flexDirection: 'row', backgroundColor: '#1f1f2b', padding: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  poster: { width: 80, height: 120, borderRadius: 8 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  genres: { color: theme.colors.muted, marginTop: 4 },
  remove: { color: 'red', marginTop: 8, fontWeight: 'bold' },
  emptyText: { color: theme.colors.muted, textAlign: 'center', marginTop: 32, fontSize: 16 },
});
