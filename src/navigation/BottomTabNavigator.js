import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import { useFavoritesStore } from '../store/useFavoritesStore';

const Tab = createBottomTabNavigator();

const TAB_CONFIG = [
  {
    name: 'Home',
    component: HomeScreen,
    icon: 'home',
    iconOutline: 'home-outline',
    label: 'Home',
  },
  {
    name: 'Categories',
    component: CategoriesScreen,
    icon: 'grid',
    iconOutline: 'grid-outline',
    label: 'Categories',
  },
  {
    name: 'Favorites',
    component: FavoritesScreen,
    icon: 'heart',
    iconOutline: 'heart-outline',
    label: 'Favorites',
  },
];

export default function BottomTabNavigator() {
  const { theme } = useTheme();
  const favCount = useFavoritesStore((s) => s.favorites.length);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          borderTopWidth: 0.5,
          height: Platform.OS === 'ios' ? 84 : 64,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const tab = TAB_CONFIG.find((t) => t.name === route.name);
          return (
            <Ionicons
              name={focused ? tab?.icon : tab?.iconOutline}
              size={focused ? size + 1 : size}
              color={color}
            />
          );
        },
      })}
    >
      {TAB_CONFIG.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarBadge:
              tab.name === 'Favorites' && favCount > 0 ? favCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: theme.colors.primary,
              color: '#fff',
              fontSize: 10,
              minWidth: 16,
              height: 16,
              borderRadius: 8,
            },
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
