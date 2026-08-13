import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_CACHE_KEY = "@user_list_app:cached_users";
const PAGE_CACHE_KEY = "@user_list_app:cached_page";


export const storage = {
  async saveUsers(users) {
    try {
      await AsyncStorage.setItem(USERS_CACHE_KEY, JSON.stringify(users));
    } catch (error) {
      console.warn("Failed to cache users:", error);
    }
  },

  async getUsers() {
    try {
      const raw = await AsyncStorage.getItem(USERS_CACHE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      console.warn("Failed to read cached users:", error);
      return null;
    }
  },

  async savePage(page) {
    try {
      await AsyncStorage.setItem(PAGE_CACHE_KEY, String(page));
    } catch (error) {
      console.warn("Failed to cache page number:", error);
    }
  },

  async getPage() {
    try {
      const raw = await AsyncStorage.getItem(PAGE_CACHE_KEY);
      return raw ? parseInt(raw, 10) : null;
    } catch (error) {
      console.warn("Failed to read cached page number:", error);
      return null;
    }
  },

  async clear() {
    try {
      await AsyncStorage.multiRemove([USERS_CACHE_KEY, PAGE_CACHE_KEY]);
    } catch (error) {
      console.warn("Failed to clear cache:", error);
    }
  },
};
