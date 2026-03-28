import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { useRecipeStore } from '../store/useRecipeStore';
import { useFavoritesStore } from '../store/useFavoritesStore';
import RecipeCard from '../components/RecipeCard';
import { GridSkeletonList } from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

const { width } = Dimensions.get('window');

const CATEGORIES_PREVIEW = ['Beef', 'Chicken', 'Dessert', 'Pasta', 'Seafood', 'Vegetarian'];

export default function HomeScreen({ navigation }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const { recipes, loading, error, fetchFeaturedRecipes, clearError } = useRecipeStore();
  const { hydrate } = useFavoritesStore();

  useEffect(() => {
    hydrate();
    fetchFeaturedRecipes();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchFeaturedRecipes();
    setRefreshing(false);
  }, [fetchFeaturedRecipes]);

  const handleRecipePress = useCallback(
    (meal) => navigation.navigate('RecipeDetails', { mealId: meal.idMeal, meal }),
    [navigation],
  );

  const renderHeader = () => (
    <View>
      {/* Hero Banner */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={[styles.heroBanner, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.heroTopRow}>
          <View>
            <Text style={styles.heroGreeting}>Good {getGreeting()},</Text>
            <Text style={styles.heroTitle}>What are you{'\n'}cooking today?</Text>
          </View>
          <View style={styles.heroActions}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Search')}
              style={styles.heroActionBtn}
            >
              <Ionicons name="search" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleTheme} style={styles.heroActionBtn}>
              <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Pill */}
        <TouchableOpacity
          style={styles.searchPill}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Ionicons name="search-outline" size={18} color="#9CA3AF" />
          <Text style={styles.searchPillText}>Search for any recipe...</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Category Quick Filter */}
      <View style={[styles.section, { backgroundColor: theme.colors.background }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
            Categories
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={[styles.seeAll, { color: theme.colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES_PREVIEW}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chipRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.quickChip, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
              onPress={() => navigation.navigate('Categories', { selectedCategory: item })}
              activeOpacity={0.8}
            >
              <Text style={[styles.quickChipText, { color: theme.colors.textSecondary }]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Recipes Title */}
      <View style={[styles.sectionHeader, { paddingHorizontal: 16, paddingBottom: 4 }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textPrimary }]}>
          Featured Recipes
        </Text>
        <Text style={[styles.recipeCount, { color: theme.colors.textMuted }]}>
          {recipes.length > 0 ? `${recipes.length} meals` : ''}
        </Text>
      </View>
    </View>
  );

  if (loading && recipes.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
        {renderHeader()}
        <GridSkeletonList />
      </View>
    );
  }

  if (error && recipes.length === 0) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
        {renderHeader()}
        <ErrorState message={error} onRetry={fetchFeaturedRecipes} />
      </View>
    );
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'light-content'}
        backgroundColor={theme.colors.primary}
      />
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={({ item }) => (
          <RecipeCard meal={item} onPress={() => handleRecipePress(item)} />
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          !loading && (
            <EmptyState
              icon="restaurant-outline"
              title="No recipes found"
              message="Pull down to refresh and try again."
            />
          )
        }
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={[
          styles.listContent,
          { backgroundColor: theme.colors.background },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  heroBanner: {
    paddingHorizontal: 20,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  heroGreeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 34,
    marginTop: 2,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  heroActionBtn: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchPill: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    gap: 10,
  },
  searchPillText: {
    color: '#9CA3AF',
    fontSize: 14,
    flex: 1,
  },
  section: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
  },
  recipeCount: {
    fontSize: 13,
  },
  chipRow: {
    paddingHorizontal: 16,
    gap: 8,
  },
  quickChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  columnWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  listContent: {
    paddingBottom: 100,
  },
});
