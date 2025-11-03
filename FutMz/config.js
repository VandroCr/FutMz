import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'https://futmz.onrender.com/api'; // URL de produção no Render

// URL base do servidor (sem /api)
export const SERVER_URL = 'https://futmz.onrender.com'; // URL de produção no Render

export const STORAGE_KEYS = {
  AUTH_TOKEN: '@FutMz:auth_token',
};

// Armazenar token de autenticação
export const storeAuthToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Erro ao salvar token:', error);
  }
};

// Obter token de autenticação
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return token;
  } catch (error) {
    console.error('Erro ao obter token:', error);
    return null;
  }
};

// Remover token de autenticação
export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Erro ao remover token:', error);
  }
};
