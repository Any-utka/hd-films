// src/components/MovieCard.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { theme } from '../theme/theme';
import { useUser } from '../context/UserContext';

export default function MovieCard({ movie, isFavorite: initialFavorite, onToggleFav }) {
  const { user } = useUser();
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [expanded, setExpanded] = useState(false); // ✅ состояние для описания

  useEffect(() => {
    setIsFavorite(initialFavorite);
  }, [initialFavorite]);

  const handleOpenLink = async () => {
    if (!user) {
      Alert.alert('Ошибка', 'Чтобы перейти на сайт фильма, нужно войти в профиль');
      return;
    }
    if (movie.link && (await Linking.canOpenURL(movie.link))) {
      await Linking.openURL(movie.link);
    }
  };

  const handleToggleFav = () => {
    if (!user) {
      Alert.alert('Ошибка', 'Чтобы добавить фильм в избранное, нужно войти в профиль');
      return;
    }
    setIsFavorite(prev => !prev);
    onToggleFav();
  };

  const toggleOverview = () => setExpanded(prev => !prev); // ✅ переключатель для описания

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={handleOpenLink}>
        <Image source={{ uri: movie.poster }} style={styles.poster} />
      </TouchableOpacity>

      <View style={styles.info}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>
          {movie.year} • {movie.duration} • {movie.age}
        </Text>
        <Text style={styles.genres}>{movie.genres.join(', ')}</Text>

        {/* ✅ Описание с возможностью разворачивания */}
        <Text style={styles.overview} numberOfLines={expanded ? undefined : 3}>
          {movie.overview}
        </Text>

        <TouchableOpacity onPress={toggleOverview}>
          <Text style={styles.showMore}>
            {expanded ? 'Свернуть ▲' : 'Показать больше ▼'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleToggleFav}>
          <Text style={styles.buttonText}>
            {isFavorite ? 'Удалить из библиотеки ❤️' : 'Добавить в библиотеку ♡'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.md,
    padding: theme.spacing(1.5),
    marginBottom: 12,
  },
  poster: {
    width: 100,
    height: 180,
    borderRadius: theme.radius.sm,
    marginRight: theme.spacing(1.5),
    backgroundColor: '#333',
  },
  info: { flex: 1 },
  title: {
    color: theme.colors.accent,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  meta: { color: theme.colors.muted, fontSize: 13, marginBottom: 4 },
  genres: {
    color: '#00d4ff',
    fontSize: 13,
    marginBottom: 6,
    fontWeight: '500',
  },
  overview: {
    color: '#ddd',
    fontSize: 12,
    lineHeight: 16,
  },
  showMore: {
    color: '#919090b4',
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 8,
    fontSize: 12,
  },
  button: {
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 7,
    borderRadius: 8,
    backgroundColor: '#44475a',
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: theme.colors.accent,
    fontWeight: 'bold',
  },
});
