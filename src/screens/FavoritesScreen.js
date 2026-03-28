import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useFavoritesStore } from '../store/useFavoritesStore';
import RecipeCard from '../components/RecipeCard';
import EmptyState from '../components/EmptyState';
import { toast } from '../utils/toast';

export default function FavoritesScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const favorites = useFavoritesStore((s) => s.favorites);
  const clearFavorites = useFavoritesStore((s) => s.clearFavorites);

  const handleRecipePress = useCallback(
    (meal) => navigation.navigate('RecipeDetails', { mealId: meal.idMeal, meal }),
    [navigation],
  );

  const handleClearAll = () => {
    if (favorites.length === 0) return;
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all saved recipes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            clearFavorites();
            toast.info('All favorites cleared.');
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 12,
            backgroundColor: theme.colors.background,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Favorites</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {favorites.length > 0
                ? `${favorites.length} saved recipe${favorites.length > 1 ? 's' : ''}`
                : 'Your saved recipes appear here'}
            </Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={toggleTheme}
              style={[styles.iconBtn, { backgroundColor: theme.colors.card }]}
            >
              <Ionicons
                name={isDark ? 'sunny-outline' : 'moon-outline'}
                size={20}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
            {favorites.length > 0 && (
              <TouchableOpacity
                onPress={handleClearAll}
                style={[styles.iconBtn, { backgroundColor: '#EF444418' }]}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* List */}
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <RecipeCard
            meal={item}
            variant="list"
            onPress={() => handleRecipePress(item)}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          favorites.length === 0 && styles.emptyListContent,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="heart-outline"
            title="No favorites yet"
            message="Tap the heart icon on any recipe to save it here."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  emptyListContent: {
    flex: 1,
  },
});
