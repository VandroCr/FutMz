import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { API_URL, getAuthToken } from '../config';
import { Ionicons } from '@expo/vector-icons';

export default function ArticleDetailScreen({ route, navigation }) {
  const { articleId } = route.params;
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [token, setToken] = useState(null);

  useEffect(() => {
    loadArticle();
    checkIfLoggedIn();
  }, [articleId]);

  const checkIfLoggedIn = async () => {
    const authToken = await getAuthToken();
    setToken(authToken);
    if (authToken) {
      checkFavorite();
    }
  };

  const loadArticle = async () => {
    try {
      const response = await fetch(`${API_URL}/articles/${articleId}`);
      const data = await response.json();
      setArticle(data);
      loadComments();
    } catch (error) {
      console.error('Erro ao carregar artigo:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const response = await fetch(`${API_URL}/articles/${articleId}/comments`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
    }
  };

  const checkFavorite = async () => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_URL}/favorites/check/${articleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIsFavorite(data.is_favorite);
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!token) {
      Alert.alert('Login Necessário', 'Você precisa estar logado para adicionar favoritos');
      navigation.navigate('Login');
      return;
    }

    try {
      if (isFavorite) {
        await fetch(`${API_URL}/favorites/${articleId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setIsFavorite(false);
      } else {
        const response = await fetch(`${API_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ article_id: articleId }),
        });
        if (response.ok) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
    }
  };

  const submitComment = async () => {
    if (!token) {
      Alert.alert('Login Necessário', 'Você precisa estar logado para comentar');
      navigation.navigate('Login');
      return;
    }

    if (!newComment.trim()) {
      Alert.alert('Erro', 'Digite um comentário');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: newComment,
          article_id: articleId,
        }),
      });

      if (response.ok) {
        setNewComment('');
        loadComments();
      }
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
  };

  if (loading || !article) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a5f1a" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {article.image_url && (
        <Image source={{ uri: article.image_url }} style={styles.headerImage} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        
        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Por {article.author_name} • {new Date(article.created_at).toLocaleDateString('pt-MZ')}
          </Text>
          <View style={styles.views}>
            <Ionicons name="eye-outline" size={16} color="#666" />
            <Text style={styles.viewsText}>{article.views_count}</Text>
          </View>
        </View>

        {article.category && (
          <View style={styles.category}>
            <Text style={styles.categoryText}>{article.category}</Text>
          </View>
        )}

        {article.content && (
          <Text style={styles.body}>{article.content}</Text>
        )}

        {article.video_url && (
          <Text style={styles.videoLink}>Vídeo: {article.video_url}</Text>
        )}

        <View style={styles.actions}>
          <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? '#e74c3c' : '#666'}
            />
            <Text style={styles.favoriteText}>
              {isFavorite ? 'Nos Favoritos' : 'Adicionar aos Favoritos'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Comentários ({comments.length})</Text>
          
          {token ? (
            <View style={styles.commentForm}>
              <TextInput
                style={styles.commentInput}
                placeholder="Escreva um comentário..."
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity onPress={submitComment} style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={styles.loginPrompt}
            >
              <Text style={styles.loginPromptText}>
                Faça login para comentar
              </Text>
            </TouchableOpacity>
          )}

          {comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentAuthor}>{comment.username}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentDate}>
                {new Date(comment.created_at).toLocaleDateString('pt-MZ')}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  views: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewsText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  category: {
    backgroundColor: '#1a5f1a',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 30,
  },
  videoLink: {
    fontSize: 14,
    color: '#1a5f1a',
    marginBottom: 20,
  },
  actions: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 15,
    marginBottom: 30,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 10,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  commentForm: {
    marginBottom: 20,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    fontSize: 14,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#1a5f1a',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginPrompt: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  loginPromptText: {
    color: '#666',
    textAlign: 'center',
  },
  comment: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a5f1a',
    marginBottom: 5,
  },
  commentContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
});
