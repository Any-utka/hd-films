// src/profile/profile.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../src/theme/theme';
import { loginUser } from '../../src/services/auth';
import { useUser } from '../../src/context/UserContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/**
 * Экран профиля и аутентификации пользователя
 * Показывает профиль, если пользователь вошёл,
 * или форму входа, если нет.
 * @returns JSX элемент экрана профиля
 */
export default function ProfileScreen() {
  const router = useRouter();
  const { user, setUser } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Анимация для глазика поля пароля
  const eyeScale = useState(new Animated.Value(1))[0];

  /**
   * Анимирует глазик при переключении видимости пароля
   */
  const animateEye = () => {
    Animated.sequence([
      Animated.timing(eyeScale, { toValue: 0.8, duration: 100, useNativeDriver: true }),
      Animated.timing(eyeScale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  /**
   * Переключает видимость пароля
   */
  const togglePassword = () => {
    animateEye();
    setShowPassword((prev) => !prev);
  };

  /**
   * Обработчик входа пользователя
   */
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Заполните все поля');
      return;
    }

    const loggedUser = await loginUser(email, password);
    if (loggedUser) {
      setUser(loggedUser);
      setError('');
    } else {
      setError('Неверный email или пароль');
    }
  };

  /**
   * Выход пользователя
   */
  const handleLogout = () => {
    setUser(null);
    setEmail('');
    setPassword('');
  };

  /**
   * Переход на экран регистрации
   */
  const goToRegister = () => router.push('/register');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {user ? (
          <View style={styles.profileCard}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>

            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Выйти</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.title}>Вход в аккаунт</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TextInput
              placeholder="Email"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
            />

            {/* Поле пароля с глазиком */}
            <View style={{ position: 'relative', justifyContent: 'center' }}>
              <TextInput
                placeholder="Пароль"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
              />

              <Animated.View
                style={{
                  position: 'absolute',
                  right: 16,
                  padding: 4,
                  transform: [{ scale: eyeScale }],
                }}
              >
                <TouchableOpacity onPress={togglePassword}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color="#888"
                  />
                </TouchableOpacity>
              </Animated.View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Войти</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.registerButton} onPress={goToRegister}>
              <Text style={styles.registerText}>Нет аккаунта? Зарегистрироваться</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing(2),
    paddingTop: theme.spacing(4),
  },
  form: {
    marginTop: theme.spacing(4),
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing(3),
    textAlign: 'center',
  },
  error: {
    color: '#ff6b6b',
    textAlign: 'center',
    marginBottom: theme.spacing(2),
  },
  input: {
    backgroundColor: theme.colors.card,
    color: theme.colors.text,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(3),
    paddingVertical: theme.spacing(2),
    marginBottom: theme.spacing(2),
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing(1.8),
    alignItems: 'center',
    marginTop: theme.spacing(2),
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerButton: {
    marginTop: theme.spacing(2),
    alignItems: 'center',
  },
  registerText: {
    color: theme.colors.accent,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  profileCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(4),
    alignItems: 'center',
    elevation: 6,
    marginTop: theme.spacing(4),
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: theme.spacing(2),
    borderWidth: 3,
    borderColor: theme.colors.accent,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing(1),
  },
  email: {
    fontSize: 16,
    color: theme.colors.muted,
    marginBottom: theme.spacing(3),
  },
});
