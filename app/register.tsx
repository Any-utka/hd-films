import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { theme } from '../src/theme/theme';
import { registerUser } from '../src/data/users';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Ошибка', 'Заполните все поля');
      return;
    }

    const success = await registerUser({ name, email, password });
    if (success) {
      Alert.alert('Успех', 'Регистрация прошла успешно!');
      router.push('/profile/login');
    } else {
      Alert.alert('Ошибка', 'Пользователь с таким email уже существует');
    }
  };

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

      <TextInput
        style={styles.input}
        placeholder="Пароль"
        placeholderTextColor={theme.colors.muted}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Зарегистрироваться</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
