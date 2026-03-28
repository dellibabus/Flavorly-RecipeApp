import apiClient from './apiClient';

export const recipeService = {
  // Fetch all meals by name (empty string returns all latest)
  searchByName: async (name = '') => {
    const data = await apiClient.get(`/search.php?s=${encodeURIComponent(name)}`);
    return data.meals || [];
  },

  // Get recipe details by ID
  getById: async (id) => {
    const data = await apiClient.get(`/lookup.php?i=${id}`);
    return data.meals?.[0] || null;
  },

  // Fetch all categories
  getCategories: async () => {
    const data = await apiClient.get('/categories.php');
    return data.categories || [];
  },

  // Filter meals by category
  filterByCategory: async (category) => {
    const data = await apiClient.get(`/filter.php?c=${encodeURIComponent(category)}`);
    return data.meals || [];
  },

  // Get a random meal
  getRandom: async () => {
    const data = await apiClient.get('/random.php');
    return data.meals?.[0] || null;
  },

  // Fetch latest/featured meals (search with empty gives all)
  getFeatured: async () => {
    const data = await apiClient.get('/search.php?s=');
    return data.meals || [];
  },
};

// Parse ingredients and measures from a meal object
export const parseIngredients = (meal) => {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({
        ingredient: ingredient.trim(),
        measure: measure?.trim() || '',
      });
    }
  }
  return ingredients;
};

// Extract YouTube video ID from URL
export const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([^&\n?]+)/);
  return match?.[1] || null;
};
