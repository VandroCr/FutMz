import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { API_URL } from '../config';

export default function HomeScreen({ navigation }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/articles?published=true&limit=10`);
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('ArticleDetail', { articleId: item.id })}
    >
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.articleImage} />
      )}
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        {item.excerpt && <Text style={styles.articleExcerpt}>{item.excerpt}</Text>}
        <View style={styles.articleMeta}>
          <Text style={styles.articleMetaText}>
            {item.author_name} • {new Date(item.created_at).toLocaleDateString('pt-MZ')}
          </Text>
        </View>
      </View>
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
        <Text style={styles.headerTitle}>Só Futebol</Text>
        <Text style={styles.headerSubtitle}>Futebol Moçambicano</Text>
      </View>
      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchArticles}
      />
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
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#d4e6d4',
    fontSize: 16,
    marginTop: 5,
  },
  list: {
    padding: 10,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  articleMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  articleMetaText: {
    fontSize: 12,
    color: '#999',
  },
});
