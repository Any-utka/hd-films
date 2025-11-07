// src/profile/edit.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';
import { User } from '../types/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const STORAGE_KEY = 'users';

export default function EditProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [genres, setGenres] = useState('');
  const [about, setAbout] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const usersJSON = await AsyncStorage.getItem(STORAGE_KEY);
      const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];
      if (users.length > 0) {
        const currentUser = users[0];
        setUser(currentUser);
        setName(currentUser.name);
        setAvatar(currentUser.avatar);
        setGenres(currentUser.genres?.join(', ') || '');
        setAbout(currentUser.about || '');
      }
    };
    loadUser();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    if (!name) {
      setError('Имя не может быть пустым');
      return;
    }

    const usersJSON = await AsyncStorage.getItem(STORAGE_KEY);
    const users: User[] = usersJSON ? JSON.parse(usersJSON) : [];

    const updatedUser: User = {
      ...user,
      name,
      avatar,
      genres: genres.split(',').map(g => g.trim()),
      about,
    };

    const updatedUsers = users.map(u =>
      u.email === user.email ? updatedUser : u
    );

await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
setUser(updatedUser);
setError('');
Alert.alert('Профиль обновлен');
router.replace('/profile');
  };

  if (!user) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.profileCard}>
          <Image source={{ uri: avatar }} style={styles.avatar} />

          <Text style={styles.label}>Имя</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Введите имя"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Аватар (URL)</Text>
          <TextInput
            style={styles.input}
            value={avatar}
            onChangeText={setAvatar}
            placeholder="Ссылка на изображение"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Предпочитаемые жанры</Text>
          <TextInput
            style={styles.input}
            value={genres}
            onChangeText={setGenres}
            placeholder="боевик, комедия, фантастика"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>О себе</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={about}
            onChangeText={setAbout}
            placeholder="Коротко о себе"
            placeholderTextColor="#888"
            multiline
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveText}>Сохранить изменения</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing(2),
    paddingTop: theme.spacing(3),
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing(3),
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: theme.colors.accent,
  },
  label: {
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 4,
    marginTop: theme.spacing(2),
  },
  input: {
    backgroundColor: '#1f1f2b',
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(2),
    paddingVertical: theme.spacing(1.5),
    fontSize: 16,
  },
  error: {
    color: '#ff6b6b',
    marginTop: theme.spacing(1),
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing(1.8),
    alignItems: 'center',
    marginTop: theme.spacing(3),
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
