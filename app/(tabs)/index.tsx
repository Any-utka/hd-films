// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMovies } from '../../src/hooks/useMovies';
import MovieCard from '../../src/components/MovieCard';
import { theme } from '../../src/theme/theme';
import { useUser } from '../../src/context/UserContext';
import { Alert } from 'react-native';

export default function CatalogScreen() {
  const { user } = useUser();
  const { movies, favorites, toggleFav, loading } = useMovies(user);

  if (loading) return <Text style={styles.loading}>Загрузка...</Text>;

  const handleToggleFav = (id: number) => {
    if (!user) {
      Alert.alert('Ошибка', 'Для добавления фильма в избранное нужно войти в профиль');
      return;
    }
    toggleFav(id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.header}>MovieApp</Text>
        <Text style={styles.subheader}>Новые и популярные фильмы</Text>
      </View>

      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            isFavorite={favorites.includes(item.id)}
            onToggleFav={() => handleToggleFav(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: theme.colors.background, 
  },
  headerWrapper: {
    paddingTop: 10, // минимальный отступ сверху
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: theme.colors.text, 
    marginBottom: 2,
  },
  subheader: { 
    fontSize: 16, 
    color: theme.colors.muted, 
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 100, // добавлено, чтобы список не пересекался с нижними табами
  },
  loading: { 
    color: theme.colors.muted, 
    textAlign: 'center', 
    marginTop: 32,
  },
});
