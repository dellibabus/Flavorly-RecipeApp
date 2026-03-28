import { create } from 'zustand';
import { recipeService } from '../services/recipeService';

export const useRecipeStore = create((set, get) => ({
  // State
  recipes: [],
  categories: [],
  searchResults: [],
  selectedCategory: null,
  categoryRecipes: [],
  loading: false,
  searchLoading: false,
  categoryLoading: false,
  error: null,

  // Actions
  fetchFeaturedRecipes: async () => {
    set({ loading: true, error: null });
    try {
      const meals = await recipeService.getFeatured();
      set({ recipes: meals, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load recipes', loading: false });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await recipeService.getCategories();
      set({ categories, loading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load categories', loading: false });
    }
  },

  searchRecipes: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], searchLoading: false });
      return;
    }
    set({ searchLoading: true, error: null });
    try {
      const results = await recipeService.searchByName(query);
      set({ searchResults: results, searchLoading: false });
    } catch (err) {
      set({ error: err.message || 'Search failed', searchLoading: false });
    }
  },

  fetchByCategory: async (category) => {
    set({ categoryLoading: true, selectedCategory: category, error: null });
    try {
      const meals = await recipeService.filterByCategory(category);
      set({ categoryRecipes: meals, categoryLoading: false });
    } catch (err) {
      set({ error: err.message || 'Failed to load category', categoryLoading: false });
    }
  },

  clearSearch: () => set({ searchResults: [] }),
  clearError: () => set({ error: null }),
}));
