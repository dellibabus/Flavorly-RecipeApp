import React, { useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../hooks/useTheme';
import { useFavoritesStore } from '../store/useFavoritesStore';
import { toast } from '../utils/toast';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function RecipeCard({ meal, onPress, style, variant = 'grid' }) {
  const { theme } = useTheme();
  const isFavorite = useFavoritesStore((s) => s.isFavorite(meal.idMeal));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const handleFavorite = useCallback(
    (e) => {
      e.stopPropagation();
      toggleFavorite(meal);
      toast[isFavorite ? 'info' : 'success'](
        isFavorite ? 'Removed from favorites' : 'Added to favorites!',
      );
    },
    [isFavorite, meal, toggleFavorite],
  );

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={[styles.listCard, { backgroundColor: theme.colors.card }, theme.shadow.sm, style]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.listImage}
          resizeMode="cover"
        />
        <View style={styles.listInfo}>
          <Text
            style={[styles.listTitle, { color: theme.colors.textPrimary }]}
            numberOfLines={2}
          >
            {meal.strMeal}
          </Text>
          {meal.strCategory && (
            <View style={[styles.categoryBadge, { backgroundColor: theme.colors.primary + '20' }]}>
              <Text style={[styles.categoryText, { color: theme.colors.primary }]}>
                {meal.strCategory}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity onPress={handleFavorite} style={styles.favBtn} hitSlop={8}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? '#EF4444' : theme.colors.textMuted}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }, theme.shadow.md, style]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: meal.strMealThumb }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.65)']}
          style={styles.gradient}
        />
        <TouchableOpacity onPress={handleFavorite} style={styles.favOverlay} hitSlop={8}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? '#EF4444' : '#fff'}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.info, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.title, { color: theme.colors.textPrimary }]} numberOfLines={2}>
          {meal.strMeal}
        </Text>
        {meal.strCategory && (
          <Text style={[styles.category, { color: theme.colors.textMuted }]} numberOfLines={1}>
            {meal.strCategory}
          </Text>
        )}
        {meal.strArea && (
          <View style={styles.areaRow}>
            <Ionicons name="location-outline" size={11} color={theme.colors.primary} />
            <Text style={[styles.area, { color: theme.colors.primary }]}>{meal.strArea}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid card
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  favOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 20,
    padding: 5,
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    marginBottom: 3,
  },
  category: {
    fontSize: 11,
    marginBottom: 3,
  },
  areaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  area: {
    fontSize: 11,
    fontWeight: '500',
  },

  // List card
  listCard: {
    flexDirection: 'row',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    alignItems: 'center',
    padding: 10,
  },
  listImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  listInfo: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 6,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
  },
  favBtn: {
    padding: 4,
  },
});
