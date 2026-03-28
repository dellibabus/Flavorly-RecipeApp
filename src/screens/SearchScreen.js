import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useDebounce } from '../hooks/useDebounce';
import { useRecipeStore } from '../store/useRecipeStore';
import SearchBar from '../components/SearchBar';
import RecipeCard from '../components/RecipeCard';
import { ListSkeletonList } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';

const POPULAR_SEARCHES = ['Chicken', 'Pasta', 'Salad', 'Beef', 'Cake', 'Soup'];

export default function SearchScreen({ navigation }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  const { searchResults, searchLoading, searchRecipes, clearSearch } = useRecipeStore();

  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchRecipes(debouncedQuery);
    } else {
      clearSearch();
    }
  }, [debouncedQuery]);

  const handleClear = () => {
    setQuery('');
    clearSearch();
  };

  const handleRecipePress = (meal) => {
    navigation.navigate('RecipeDetails', { mealId: meal.idMeal, meal });
  };

  const hasSearched = debouncedQuery.trim().length > 0;

  return (
    <KeyboardAvoidingView
      style={[styles.screen, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 8, backgroundColor: theme.colors.background, borderBottomColor: theme.colors.border },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.textPrimary }]}>
            Search Recipes
          </Text>
          <View style={{ width: 26 }} />
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          onClear={handleClear}
          placeholder="Search for any recipe..."
          autoFocus
        />
      </View>

      {/* Popular suggestions - shown when no query */}
      {!hasSearched && (
        <View style={styles.suggestions}>
          <Text style={[styles.suggestTitle, { color: theme.colors.textSecondary }]}>
            Popular Searches
          </Text>
          <View style={styles.tagsRow}>
            {POPULAR_SEARCHES.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
                ]}
                onPress={() => setQuery(tag)}
              >
                <Ionicons name="trending-up" size={13} color={theme.colors.primary} />
                <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Loading */}
      {searchLoading && <ListSkeletonList count={6} />}

      {/* Results */}
      {!searchLoading && hasSearched && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => (
            <RecipeCard
              meal={item}
              variant="list"
              onPress={() => handleRecipePress(item)}
            />
          )}
          contentContainerStyle={styles.resultList}
          ListHeaderComponent={
            searchResults.length > 0 ? (
              <Text style={[styles.resultCount, { color: theme.colors.textMuted }]}>
                {searchResults.length} results for "{debouncedQuery}"
              </Text>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No results"
              message={`No recipes found for "${debouncedQuery}". Try a different keyword.`}
            />
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 0,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  suggestions: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  suggestTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
  },
  resultList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  resultCount: {
    fontSize: 13,
    marginBottom: 14,
  },
});
