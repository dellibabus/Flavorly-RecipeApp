import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

function ShimmerBox({ style }) {
  const { theme } = useTheme();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View
      style={[
        { backgroundColor: theme.colors.shimmer, opacity },
        style,
      ]}
    />
  );
}

export function RecipeCardSkeleton() {
  return (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      <ShimmerBox style={styles.image} />
      <View style={styles.info}>
        <ShimmerBox style={styles.titleLine} />
        <ShimmerBox style={styles.subtitleLine} />
      </View>
    </View>
  );
}

export function RecipeListSkeleton() {
  return (
    <View style={styles.listCard}>
      <ShimmerBox style={styles.listImage} />
      <View style={styles.listInfo}>
        <ShimmerBox style={styles.listTitleLine} />
        <ShimmerBox style={styles.listSubtitle} />
        <ShimmerBox style={styles.listBadge} />
      </View>
    </View>
  );
}

export function GridSkeletonList({ count = 6 }) {
  return (
    <View style={styles.gridContainer}>
      {Array.from({ length: count }).map((_, i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </View>
  );
}

export function ListSkeletonList({ count = 5 }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <RecipeListSkeleton key={i} />
      ))}
    </View>
  );
}

export function CategorySkeleton({ count = 6 }) {
  return (
    <View style={styles.categoryRow}>
      {Array.from({ length: count }).map((_, i) => (
        <ShimmerBox key={i} style={styles.categoryChip} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    height: 130,
    borderRadius: 16,
  },
  info: {
    padding: 10,
    gap: 6,
  },
  titleLine: {
    height: 13,
    borderRadius: 6,
    width: '85%',
  },
  subtitleLine: {
    height: 11,
    borderRadius: 6,
    width: '55%',
  },
  // List
  listCard: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 12,
  },
  listImage: {
    width: 72,
    height: 72,
    borderRadius: 10,
  },
  listInfo: {
    flex: 1,
    gap: 8,
  },
  listTitleLine: {
    height: 14,
    borderRadius: 6,
    width: '80%',
  },
  listSubtitle: {
    height: 11,
    borderRadius: 6,
    width: '60%',
  },
  listBadge: {
    height: 22,
    borderRadius: 11,
    width: 80,
  },
  // Category
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  categoryChip: {
    height: 34,
    width: 90,
    borderRadius: 17,
  },
});
