import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { API_URL, getAuthToken, removeAuthToken } from '../config';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (token) {
      loadFavorites();
    }
  }, [token]);

  const checkAuth = async () => {
    const authToken = await getAuthToken();
    if (!authToken) {
      navigation.navigate('Login');
    } else {
      setToken(authToken);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await fetch(`${API_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      } else if (response.status === 401) {
        // Token inválido, fazer logout
        await removeAuthToken();
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFavorite = ({ item }) => (
    <TouchableOpacity
      style={styles.favoriteCard}
      onPress={() => navigation.navigate('ArticleDetail', { articleId: item.article_id })}
    >
      <Text style={styles.favoriteTitle}>{item.article_title}</Text>
      <Text style={styles.favoriteDate}>
        Adicionado em {new Date(item.created_at).toLocaleDateString('pt-MZ')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a5f1a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Favoritos</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Nenhum favorito ainda</Text>
          <Text style={styles.emptySubtext}>
            Marque artigos como favoritos para ler depois
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          renderItem={renderFavorite}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshing={loading}
          onRefresh={loadFavorites}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#1a5f1a',
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  list: {
    padding: 10,
  },
  favoriteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  favoriteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  favoriteDate: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
