import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  get: async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (_) {
      return null;
    }
  },

  set: async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (_) {
      return false;
    }
  },

  remove: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  },

  clear: async () => {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (_) {
      return false;
    }
  },
};
