import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from '../hooks/useTheme';
import BottomTabNavigator from './BottomTabNavigator';
import RecipeDetailsScreen from '../screens/RecipeDetailsScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();

export default function RootNavigator() {
  const { theme, isDark } = useTheme();

  const navigationTheme = {
    dark: isDark,
    colors: {
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.textPrimary,
      border: theme.colors.border,
      notification: theme.colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.colors.background },
          presentation: 'card',
        }}
      >
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen
          name="RecipeDetails"
          component={RecipeDetailsScreen}
          options={{
            presentation: 'card',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            presentation: 'card',
            gestureEnabled: true,
            animationTypeForReplace: 'push',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
