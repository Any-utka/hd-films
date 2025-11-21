// app/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../src/theme/theme';
import { registerUser } from '../src/data/users';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Экран регистрации нового пользователя
 * @returns JSX элемент экрана
 */
export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // состояние для глазика

  const router = useRouter();

  /**
   * Обработчик кнопки "Зарегистрироваться"
   * Проверяет поля, валидирует email и регистрирует пользователя
   */
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ошибка', 'Введите корректный email');
      return;
    }

    setLoading(true);
    const success = await registerUser({ name, email, password });
    setLoading(false);

    if (success) {
      Alert.alert('Успех', 'Регистрация прошла успешно!');
      router.replace('/profile'); 
    } else {
      Alert.alert('Ошибка', 'Пользователь с таким email уже существует');
    }
  };

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Регистрация</Text>

      <TextInput
        style={styles.input}
        placeholder="Имя"
        placeholderTextColor={theme.colors.muted}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={theme.colors.muted}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Поле пароля с глазиком */}
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        <TextInput
          style={styles.input}
          placeholder="Пароль"
          placeholderTextColor={theme.colors.muted}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={toggleShowPassword}
          style={{ position: 'absolute', right: 12, padding: 4 }}
        >
          <Ionicons
            name={showPassword ? 'eye-off' : 'eye'}
            size={24}
            color={theme.colors.muted}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Text>
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
});
