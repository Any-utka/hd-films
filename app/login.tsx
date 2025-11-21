// app/login.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../src/theme/theme';
import { loginUser } from '../src/data/users';
import { useRouter } from 'expo-router';

/**
 * Экран входа пользователя
 * @returns JSX элемент экрана
 */
export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Обработчик кнопки "Войти"
   * Проверяет поля и логинит пользователя
   */
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    const user = await loginUser(email, password);
    if (user) {
      Alert.alert('Успех', `Добро пожаловать, ${user.name}!`);
      router.push('/profile');
    } else {
      Alert.alert('Ошибка', 'Неверный email или пароль');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Вход</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor={theme.colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Войти</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/profile/register')}>
        <Text style={styles.link}>Нет аккаунта? Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // фон экрана
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: theme.colors.text,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderRadius: theme.radius.sm,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: theme.colors.accent,
    padding: 14,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: theme.colors.text,
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: theme.colors.accent,
    textAlign: 'center',
    marginTop: 12,
    textDecorationLine: 'underline',
  },
});
