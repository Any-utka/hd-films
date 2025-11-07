// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { UserProvider } from '../../src/context/UserContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { theme } from '../../src/theme/theme';

export default function TabLayout() {
  return (
    <UserProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
            height: 60, // уменьшил высоту хедера (по умолчанию ~96)
          },
          headerTitleStyle: {
            color: theme.colors.accent,
            fontWeight: 'bold',
            fontSize: 18, // чуть меньше, чтобы гармонично смотрелось
          },
          //headerTitleAlign: 'right',
          headerShadowVisible: false,

          // ↓↓↓ Настройки нижних табов ↓↓↓
          tabBarStyle: {
            backgroundColor: '#1a1a24',
            borderTopColor: '#333',
            height: 100,
            paddingBottom: 2,
            paddingTop: 4,
            position: 'absolute',
            bottom: 0,
            elevation: 12,
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
          },
          tabBarActiveTintColor: theme.colors.accent,
          tabBarInactiveTintColor: theme.colors.muted,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Каталог',
            tabBarIcon: ({ color }) => <FontAwesome size={22} name="film" color={color} />,
          }}
        />
        
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color }) => <FontAwesome size={22} name="user" color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Избранное',
            tabBarIcon: ({ color }) => <FontAwesome size={22} name="heart" color={color} />,
          }}
        />
      </Tabs>
    </UserProvider>
  );
}
