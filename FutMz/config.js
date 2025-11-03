import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// URL da API - ajustar conforme necessário
// IMPORTANTE: Substitua SEU_IP_AQUI pelo IP da sua máquina na rede Wi-Fi
// Para descobrir: Windows (ipconfig) | Mac/Linux (ifconfig)
// Para web, usa localhost, para mobile usa o IP da rede Wi-Fi
const DEV_API_URL = Platform.OS === 'web' 
  ? 'http://localhost:8000/api' 
  : 'http://192.168.43.171:8000/api'; // IP da sua máquina na rede Wi-Fi

const DEV_SERVER_URL = Platform.OS === 'web'
  ? 'http://localhost:8000'
  : 'http://192.168.43.171:8000'; // IP da sua máquina na rede Wi-Fi

// Forçar uso do Render em produção
export const API_URL = 'https://futmz.onrender.com/api'; // Sempre usar Render

// URL base do servidor (sem /api)
export const SERVER_URL = 'https://futmz.onrender.com'; // Sempre usar Render

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
