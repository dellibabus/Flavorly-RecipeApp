import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { recipeService, parseIngredients, getYouTubeId } from '../services/recipeService';
import { toast } from '../utils/toast';
import ErrorState from '../components/ErrorState';

const { width, height } = Dimensions.get('window');
const HERO_HEIGHT = height * 0.42;

export default function RecipeDetailsScreen({ navigation, route }) {
  const { mealId, meal: initialMeal } = route.params;
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [meal, setMeal] = useState(initialMeal || null);
  const [loading, setLoading] = useState(!initialMeal);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('ingredients'); // 'ingredients' | 'instructions'

  const isFavorite = useFavoritesStore((s) => s.isFavorite(mealId));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  useEffect(() => {
    loadDetails();
  }, [mealId]);

  const loadDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await recipeService.getById(mealId);
      if (data) setMeal(data);
      else setError('Recipe not found.');
    } catch (err) {
      setError(err.message || 'Failed to load recipe.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = useCallback(() => {
    if (!meal) return;
    toggleFavorite(meal);
    toast[isFavorite ? 'info' : 'success'](
      isFavorite ? 'Removed from favorites' : 'Added to favorites!',
    );
  }, [meal, isFavorite, toggleFavorite]);

  const handleYouTube = useCallback(async () => {
    if (!meal?.strYoutube) return;
    try {
      await Linking.openURL(meal.strYoutube);
    } catch (_) {
      toast.error('Cannot open YouTube link.');
    }
  }, [meal]);

  if (loading) {
    return (
      <View style={[styles.loaderScreen, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.backBtnAbsolute, { top: insets.top + 8 }]}
        >
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <ErrorState message={error} onRetry={loadDetails} />
      </View>
    );
  }

  if (!meal) return null;

  const ingredients = parseIngredients(meal);
  const youtubeId = getYouTubeId(meal.strYoutube);

  return (
    <View style={[styles.screen, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        bounces
      >
        {/* Hero Image */}
        <View style={[styles.heroContainer, { height: HERO_HEIGHT }]}>
          <Image
            source={{ uri: meal.strMealThumb }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.45)', 'transparent', 'rgba(0,0,0,0.3)']}
            style={StyleSheet.absoluteFill}
          />

          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.backBtn, { top: insets.top + 8 }]}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            onPress={handleFavorite}
            style={[styles.favBtn, { top: insets.top + 8 }]}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? '#EF4444' : '#fff'}
            />
          </TouchableOpacity>

          {/* Category Badge on image */}
          {meal.strCategory && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{meal.strCategory}</Text>
            </View>
          )}
        </View>

        {/* Content Card */}
        <View
          style={[
            styles.contentCard,
            { backgroundColor: theme.colors.background, marginTop: -20 },
          ]}
        >
          {/* Title & Meta */}
          <View style={styles.titleSection}>
            <Text style={[styles.mealTitle, { color: theme.colors.textPrimary }]}>
              {meal.strMeal}
            </Text>

            <View style={styles.metaRow}>
              {meal.strArea && (
                <View style={styles.metaChip}>
                  <Ionicons name="location-outline" size={14} color={theme.colors.primary} />
                  <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                    {meal.strArea}
                  </Text>
                </View>
              )}
              {meal.strCategory && (
                <View style={styles.metaChip}>
                  <Ionicons name="grid-outline" size={14} color={theme.colors.secondary} />
                  <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                    {meal.strCategory}
                  </Text>
                </View>
              )}
              <View style={styles.metaChip}>
                <Ionicons name="list-outline" size={14} color={theme.colors.accent} />
                <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                  {ingredients.length} ingredients
                </Text>
              </View>
            </View>
          </View>

          {/* YouTube CTA */}
          {youtubeId && (
            <TouchableOpacity
              style={[styles.ytBtn, { borderColor: '#FF0000' + '30', backgroundColor: '#FF0000' + '10' }]}
              onPress={handleYouTube}
              activeOpacity={0.8}
            >
              <Ionicons name="logo-youtube" size={22} color="#FF0000" />
              <Text style={[styles.ytBtnText, { color: theme.colors.textPrimary }]}>
                Watch on YouTube
              </Text>
              <Ionicons name="open-outline" size={16} color={theme.colors.textMuted} />
            </TouchableOpacity>
          )}

          {/* Tab Switcher */}
          <View style={[styles.tabRow, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'ingredients' && { backgroundColor: theme.colors.primary }]}
              onPress={() => setActiveTab('ingredients')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'ingredients' ? '#fff' : theme.colors.textSecondary },
                ]}
              >
                Ingredients
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'instructions' && { backgroundColor: theme.colors.primary }]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === 'instructions' ? '#fff' : theme.colors.textSecondary },
                ]}
              >
                Instructions
              </Text>
            </TouchableOpacity>
          </View>

          {/* Ingredients Tab */}
          {activeTab === 'ingredients' && (
            <View style={styles.ingredientsContainer}>
              {ingredients.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.ingredientRow,
                    { borderBottomColor: theme.colors.divider },
                    index === ingredients.length - 1 && { borderBottomWidth: 0 },
                  ]}
                >
                  <View style={[styles.ingredientDot, { backgroundColor: theme.colors.primary }]} />
                  <Text style={[styles.ingredientName, { color: theme.colors.textPrimary }]}>
                    {item.ingredient}
                  </Text>
                  {item.measure ? (
                    <View style={[styles.measureBadge, { backgroundColor: theme.colors.primary + '18' }]}>
                      <Text style={[styles.measureText, { color: theme.colors.primary }]}>
                        {item.measure}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          )}

          {/* Instructions Tab */}
          {activeTab === 'instructions' && (
            <View style={styles.instructionsContainer}>
              {parseInstructions(meal.strInstructions).map((step, index) => (
                <View key={index} style={styles.stepRow}>
                  <View style={[styles.stepNumber, { backgroundColor: theme.colors.primary }]}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={[styles.stepText, { color: theme.colors.textPrimary }]}>
                    {step}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Tags */}
          {meal.strTags && (
            <View style={styles.tagsSection}>
              <Text style={[styles.tagsLabel, { color: theme.colors.textSecondary }]}>Tags</Text>
              <View style={styles.tagsRow}>
                {meal.strTags.split(',').map((tag) => tag.trim()).filter(Boolean).map((tag) => (
                  <View
                    key={tag}
                    style={[styles.tagChip, { backgroundColor: theme.colors.cardElevated }]}
                  >
                    <Text style={[styles.tagText, { color: theme.colors.textSecondary }]}>
                      #{tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function parseInstructions(instructions) {
  if (!instructions) return [];
  return instructions
    .split(/\r\n|\n|\r/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loaderScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroContainer: {
    width,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnAbsolute: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favBtn: {
    position: 'absolute',
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  categoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(150,150,150,0.1)',
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
  },
  ytBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 20,
  },
  ytBtnText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  tabRow: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  ingredientsContainer: {
    marginBottom: 24,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  ingredientDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ingredientName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  measureBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  measureText: {
    fontSize: 12,
    fontWeight: '600',
  },
  instructionsContainer: {
    marginBottom: 24,
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  stepNumberText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
