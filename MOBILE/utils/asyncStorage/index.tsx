import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key: string, value: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    // Error handled silently
  }
};
  
export const getItem = async (key: string): Promise<any> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    } catch (error) {
      return null;
    }
  };
  
export const removeItem = async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      // Error handled silently
    }
  };