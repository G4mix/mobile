import * as SecureStore from 'expo-secure-store';

export const getItem = async (key: string) => {
  return await SecureStore.getItemAsync(key);
};

export const setItem = async (key: string, value: string) => {
  await SecureStore.setItemAsync(key, value);
};

export const removeItem = async (key: string) => {
  await SecureStore.deleteItemAsync(key);
};