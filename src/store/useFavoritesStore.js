import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@flavorly_favorites';

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  hydrated: false,

  // Load favorites from AsyncStorage on app start
  hydrate: async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_KEY);
      const favorites = stored ? JSON.parse(stored) : [];
      set({ favorites, hydrated: true });
    } catch (_) {
      set({ hydrated: true });
    }
  },

  // Persist to AsyncStorage
  _persist: async (favorites) => {
    try {
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (_) {}
  },

  isFavorite: (id) => {
    return get().favorites.some((m) => m.idMeal === id);
  },

  toggleFavorite: (meal) => {
    const { favorites, _persist } = get();
    const exists = favorites.some((m) => m.idMeal === meal.idMeal);
    const updated = exists
      ? favorites.filter((m) => m.idMeal !== meal.idMeal)
      : [...favorites, meal];
    set({ favorites: updated });
    _persist(updated);
  },

  removeFavorite: (id) => {
    const { favorites, _persist } = get();
    const updated = favorites.filter((m) => m.idMeal !== id);
    set({ favorites: updated });
    _persist(updated);
  },

  clearFavorites: () => {
    set({ favorites: [] });
    AsyncStorage.removeItem(FAVORITES_KEY).catch(() => {});
  },
}));
