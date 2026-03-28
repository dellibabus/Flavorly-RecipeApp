import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useRecipeStore } from '../store/useRecipeStore';
import RecipeCard from '../components/RecipeCard';
import { GridSkeletonList, CategorySkeleton } from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';

export default function CategoriesScreen({ navigation, route }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const {
    categories,
    categoryRecipes,
    selectedCategory,
    loading,
    categoryLoading,
    error,
    fetchCategories,
    fetchByCategory,
  } = useRecipeStore();

  useEffect(() => {
    if (categories.length === 0) fetchCategories();
  }, []);

  // Handle navigation param for pre-selected category
  useEffect(() => {
    if (route.params?.selectedCategory) {
      fetchByCategory(route.params.selectedCategory);
    } else if (categories.length > 0 && !selectedCategory) {
      fetchByCategory(categories[0].strCategory);
    }
  }, [categories, route.params?.selectedCategory]);

  const handleCategoryPress = useCallback(
    (cat) => {
      fetchByCategory(cat.strCategory);
    },
    [fetchByCategory],
  );

  const handleRecipePress = useCallback(
    (meal) => navigation.navigate('RecipeDetails', { mealId: meal.idMeal, meal }),
    [navigation],
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  }, []);

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
            <Text style={[styles.title, { color: theme.colors.textPrimary }]}>Categories</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Explore by cuisine type
            </Text>
          </View>
          <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: theme.colors.card }]}>
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Tabs */}
      <View style={[styles.categoryBar, { backgroundColor: theme.colors.background }]}>
        {loading && categories.length === 0 ? (
          <CategorySkeleton />
        ) : (
          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.idCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryList}
            renderItem={({ item }) => {
              const isSelected = selectedCategory === item.strCategory;
              return (
                <TouchableOpacity
                  onPress={() => handleCategoryPress(item)}
                  activeOpacity={0.8}
                  style={[
                    styles.categoryTab,
                    {
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.card,
                      borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                    },
                  ]}
                >
                  <Image
                    source={{ uri: item.strCategoryThumb }}
                    style={[styles.categoryThumb, { opacity: isSelected ? 1 : 0.75 }]}
                  />
                  <Text
                    style={[
                      styles.categoryLabel,
                      { color: isSelected ? '#fff' : theme.colors.textSecondary },
                    ]}
                  >
                    {item.strCategory}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      {/* Category Description */}
      {selectedCategory && !categoryLoading && (
        <View style={[styles.categoryInfo, { borderBottomColor: theme.colors.border }]}>
          <Text style={[styles.categoryName, { color: theme.colors.textPrimary }]}>
            {selectedCategory}
          </Text>
          <Text style={[styles.categoryCount, { color: theme.colors.textMuted }]}>
            {categoryRecipes.length} recipes
          </Text>
        </View>
      )}

      {/* Recipe Grid */}
      {categoryLoading ? (
        <GridSkeletonList />
      ) : error ? (
        <ErrorState message={error} onRetry={() => selectedCategory && fetchByCategory(selectedCategory)} />
      ) : (
        <FlatList
          data={categoryRecipes}
          keyExtractor={(item) => item.idMeal}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.recipeList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <RecipeCard meal={item} onPress={() => handleRecipePress(item)} />
          )}
          ListEmptyComponent={
            !categoryLoading && (
              <EmptyState
                icon="restaurant-outline"
                title="No recipes"
                message="No recipes found in this category."
              />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
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
  themeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBar: {
    paddingVertical: 14,
    borderBottomWidth: 0,
  },
  categoryList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
  },
  categoryThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
  },
  categoryCount: {
    fontSize: 13,
  },
  columnWrapper: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  recipeList: {
    paddingTop: 16,
    paddingBottom: 100,
  },
});
