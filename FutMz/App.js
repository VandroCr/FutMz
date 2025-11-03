import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, FlatList, Image, ActivityIndicator, Alert, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { API_URL, SERVER_URL, storeAuthToken, getAuthToken, removeAuthToken } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  const [screen, setScreen] = useState('login'); // 'home', 'login', 'register', 'admin', 'edit', 'article', 'teams'
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Teams state
  const [teams, setTeams] = useState([]);
  const [editingTeam, setEditingTeam] = useState(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [selectedTeamLogo, setSelectedTeamLogo] = useState(null);
  const [editSelectedTeamLogo, setEditSelectedTeamLogo] = useState(null);
  
  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Register state
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // Admin Article Creation state
  const [newArticleTitle, setNewArticleTitle] = useState('');
  const [newArticleContent, setNewArticleContent] = useState('');
  const [newArticleExcerpt, setNewArticleExcerpt] = useState('');
  const [newArticleImageUrl, setNewArticleImageUrl] = useState('');
  const [newArticleCategory, setNewArticleCategory] = useState('');
  const [creatingArticle, setCreatingArticle] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deletingArticle, setDeletingArticle] = useState(null);
  
  // Image picker state
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedContentImages, setSelectedContentImages] = useState([]);
  const [headerImage, setHeaderImage] = useState('https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  const [headerImageKey, setHeaderImageKey] = useState(0); // Para forçar reload da imagem
  
  // Edit article state
  const [editArticleTitle, setEditArticleTitle] = useState('');
  const [editArticleContent, setEditArticleContent] = useState('');
  const [editArticleExcerpt, setEditArticleExcerpt] = useState('');
  const [editArticleImageUrl, setEditArticleImageUrl] = useState('');
  const [editArticleCategory, setEditArticleCategory] = useState('');
  const [editArticleFeatured, setEditArticleFeatured] = useState(false);
  const [editSelectedImage, setEditSelectedImage] = useState(null);
  const [editSelectedVideo, setEditSelectedVideo] = useState(null);
  const [updatingArticle, setUpdatingArticle] = useState(false);
  
  // Article detail state
  const [selectedArticle, setSelectedArticle] = useState(null);

  useEffect(() => {
    if (screen === 'home') {
      loadArticles();
      loadFeaturedArticles();
      loadTeams();
    }
    checkAuth();
  }, [screen]);

  // Verificar autenticação ao carregar o app e redirecionar se já estiver logado
  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = await getAuthToken();
      if (token) {
        // Se já tiver token, ir direto para home
        setScreen('home');
      }
    };
    checkExistingAuth();
  }, []);

  // Carregar foto do header ao iniciar o app
  useEffect(() => {
    loadHeaderImage();
  }, []);

  // Solicitar permissão para acessar a câmera/galeria
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para fazer upload de fotos');
      }
    })();
  }, []);

  const uploadImageToServer = async (imageUri) => {
    try {
      console.log('Iniciando upload da imagem:', imageUri);
      
      const formData = new FormData();
      
      // Criar arquivo com nome único
      const filename = `image_${Date.now()}.jpg`;
      
      // Para web, precisamos converter a URI em Blob
      if (Platform.OS === 'web') {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        formData.append('file', blob, filename);
      } else {
        // Para mobile, usar o formato original
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg',
          name: filename,
        });
      }
      
      console.log('FormData criado, fazendo upload...');
      
      // Fazer upload para o servidor
      const uploadResponse = await fetch(`${API_URL}/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          // Não definir Content-Type, deixar o fetch definir automaticamente para FormData
        },
        body: formData,
      });
      
      console.log('Resposta do upload:', uploadResponse.status);
      
      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log('Upload bem-sucedido:', result);
        // Retornar URL completa da imagem
        return `${SERVER_URL}${result.image_url}`;
      } else {
        const errorText = await uploadResponse.text();
        console.error('Erro no upload:', uploadResponse.status, errorText);
        throw new Error(`Erro no upload da imagem: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      throw error;
    }
  };

  const uploadVideoToServer = async (videoUri) => {
    try {
      console.log('Iniciando upload do vídeo:', videoUri);
      
      const formData = new FormData();
      
      // Criar arquivo com nome único
      const filename = `video_${Date.now()}.mp4`;
      
      // Para web, precisamos converter a URI em Blob
      if (Platform.OS === 'web') {
        const response = await fetch(videoUri);
        const blob = await response.blob();
        formData.append('file', blob, filename);
      } else {
        // Para mobile, usar o formato original
        formData.append('file', {
          uri: videoUri,
          type: 'video/mp4',
          name: filename,
        });
      }
      
      console.log('FormData criado, fazendo upload do vídeo...');
      
      // Fazer upload para o servidor
      const uploadResponse = await fetch(`${API_URL}/upload-video`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          // Não definir Content-Type, deixar o fetch definir automaticamente para FormData
        },
        body: formData,
      });
      
      console.log('Resposta do upload do vídeo:', uploadResponse.status);
      
      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        console.log('Upload do vídeo bem-sucedido:', result);
        // Retornar URL completa do vídeo
        return `${SERVER_URL}${result.video_url}`;
      } else {
        const errorText = await uploadResponse.text();
        console.error('Erro no upload do vídeo:', uploadResponse.status, errorText);
        throw new Error(`Erro no upload do vídeo: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.error('Erro ao fazer upload do vídeo:', error);
      throw error;
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setNewArticleImageUrl(result.assets[0].uri);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedVideo(result.assets[0].uri);
    }
  };

  const pickContentImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map(asset => asset.uri);
      setSelectedContentImages(prev => [...prev, ...newImages]);
    }
  };

  const pickTeamLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedTeamLogo(result.assets[0].uri);
    }
  };

  const pickEditTeamLogo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditSelectedTeamLogo(result.assets[0].uri);
    }
  };

  const pickEditImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditSelectedImage(result.assets[0].uri);
      setEditArticleImageUrl(result.assets[0].uri);
    }
  };

  const pickEditVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setEditSelectedVideo(result.assets[0].uri);
    }
  };

  const pickHeaderImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      try {
        // Fazer upload da imagem para o servidor
        const uploadedImageUrl = await uploadImageToServer(result.assets[0].uri);
        console.log('Header image uploaded with URL:', uploadedImageUrl);
        
        // Atualizar estado e salvar no AsyncStorage
        setHeaderImage(uploadedImageUrl);
        setHeaderImageKey(prev => prev + 1); // Forçar reload da imagem
        await saveHeaderImage(uploadedImageUrl);
        
        Alert.alert('Sucesso', 'Foto do header alterada com sucesso!');
      } catch (error) {
        console.error('Error uploading header image:', error);
        Alert.alert('Erro', 'Erro ao fazer upload da foto do header');
      }
    }
  };

  const saveHeaderImage = async (imageUri) => {
    try {
      await AsyncStorage.setItem('@SoFutebol:header_image', imageUri);
    } catch (error) {
      console.error('Erro ao salvar foto do header:', error);
    }
  };

  const loadHeaderImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem('@SoFutebol:header_image');
      if (savedImage) {
        // Corrigir URL se necessário (para web, substituir IP por localhost)
        let imageUrl = savedImage;
        if (Platform.OS === 'web') {
          // Se a URL contém o IP da rede, substituir por localhost
          imageUrl = savedImage.replace(/http:\/\/192\.168\.\d+\.\d+:8000/g, 'http://localhost:8000');
        }
        console.log('Loading header image:', imageUrl);
        setHeaderImage(imageUrl);
      } else {
        console.log('No saved header image found');
      }
    } catch (error) {
      console.error('Erro ao carregar foto do header:', error);
    }
  };

  const openArticle = (article) => {
    if (!authToken) {
      Alert.alert(
        'Login Necessário',
        'Você precisa fazer login para ler o conteúdo completo dos artigos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Fazer Login', onPress: () => setScreen('login') }
        ]
      );
      return;
    }
    
    setSelectedArticle(article);
    setScreen('article');
  };

  const startEditArticle = (article) => {
    setEditingArticle(article);
    setEditArticleTitle(article.title);
    setEditArticleContent(article.content);
    setEditArticleExcerpt(article.excerpt || '');
    setEditArticleImageUrl(article.image_url || '');
    setEditArticleCategory(article.category || '');
    setEditArticleFeatured(article.featured || false);
    setEditSelectedImage(null);
    setScreen('edit');
  };

  const checkAuth = async () => {
    const token = await getAuthToken();
    if (token) {
      setAuthToken(token);
      // Carregar dados do usuário
      try {
        const userResponse = await fetch(`${API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setIsAdmin(userData.is_admin || false);
          setCurrentUser(userData);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
      }
    }
  };

  const loadArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/articles?published=true&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Erro ao carregar artigos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFeaturedArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/articles/featured?limit=3`);
      if (response.ok) {
        const data = await response.json();
        setFeaturedArticles(data);
      }
    } catch (error) {
      console.error('Erro ao carregar artigos em destaque:', error);
    }
  };

  const loadTeams = async () => {
    try {
      const response = await fetch(`${API_URL}/teams/`);
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Erro ao carregar equipas:', error);
    }
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      console.log('Tentando login com:', { username, password: '***' });
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Login success, token:', data.access_token?.substring(0, 20) + '...');
        await storeAuthToken(data.access_token);
        setAuthToken(data.access_token);
        
        // Buscar dados do usuário para verificar se é admin
        try {
          const userResponse = await fetch(`${API_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${data.access_token}`
            }
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setIsAdmin(userData.is_admin || false);
            setCurrentUser(userData);
            console.log('User is admin:', userData.is_admin);
          }
        } catch (err) {
          console.error('Erro ao buscar dados do usuário:', err);
        }
        
        Alert.alert('Sucesso', 'Login realizado com sucesso!');
        setScreen('home');
      } else {
        const errorData = await response.json();
        console.log('Login error:', errorData);
        Alert.alert('Erro', errorData.detail || 'Credenciais inválidas');
      }
    } catch (error) {
      console.error('Login exception:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  };

  const handleRegister = async () => {
    if (!regUsername.trim() || !regEmail.trim() || !regPassword.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: regUsername,
          email: regEmail,
          password: regPassword,
          full_name: regFullName,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        setScreen('login');
      } else {
        Alert.alert('Erro', 'Erro ao criar conta');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  };

  const handleCreateArticle = async () => {
    if (!newArticleTitle.trim() || !newArticleContent.trim()) {
      Alert.alert('Erro', 'Preencha título e conteúdo');
      return;
    }

    if (!newArticleImageUrl.trim() && !selectedImage) {
      Alert.alert('Erro', 'Selecione uma foto para o artigo');
      return;
    }

    if (!newArticleCategory) {
      Alert.alert('Erro', 'Selecione a categoria Nacional');
      return;
    }

    if (!authToken) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    setCreatingArticle(true);
    try {
      let imageUrl = newArticleImageUrl;
      let videoUrl = null;
      let contentImagesUrls = [];
      
      // Se há uma imagem selecionada, fazer upload
      if (selectedImage) {
        try {
          imageUrl = await uploadImageToServer(selectedImage);
        } catch (uploadError) {
          Alert.alert('Erro', 'Erro ao fazer upload da imagem');
          setCreatingArticle(false);
          return;
        }
      }

      // Se há um vídeo selecionado, fazer upload
      if (selectedVideo) {
        try {
          videoUrl = await uploadVideoToServer(selectedVideo);
        } catch (uploadError) {
          Alert.alert('Erro', 'Erro ao fazer upload do vídeo');
          setCreatingArticle(false);
          return;
        }
      }

      // Se há imagens de conteúdo selecionadas, fazer upload
      if (selectedContentImages.length > 0) {
        try {
          contentImagesUrls = await Promise.all(
            selectedContentImages.map(imageUri => uploadImageToServer(imageUri))
          );
        } catch (uploadError) {
          Alert.alert('Erro', 'Erro ao fazer upload das imagens de conteúdo');
          setCreatingArticle(false);
          return;
        }
      }

      const response = await fetch(`${API_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: newArticleTitle,
          content: newArticleContent,
          excerpt: newArticleExcerpt || newArticleContent.substring(0, 200),
          image_url: imageUrl,
          video_url: videoUrl,
          content_images: contentImagesUrls,
          category: newArticleCategory || 'Geral',
          featured: false,
          published: true,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Artigo criado com sucesso!');
        // Limpar formulário
        setNewArticleTitle('');
        setNewArticleContent('');
        setNewArticleExcerpt('');
        setNewArticleImageUrl('');
        setNewArticleCategory('');
        setSelectedImage(null);
        setSelectedVideo(null);
        setSelectedContentImages([]);
        setScreen('home');
        loadArticles();
        loadFeaturedArticles();
      } else {
        const error = await response.json();
        Alert.alert('Erro', error.detail || 'Erro ao criar artigo');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    } finally {
      setCreatingArticle(false);
    }
  };

  const handleLogout = async () => {
    await removeAuthToken();
    setAuthToken(null);
    setCurrentUser(null);
    setIsAdmin(false);
    setScreen('home');
  };

  const handleUpdateArticle = async () => {
    if (!editArticleTitle.trim() || !editArticleContent.trim()) {
      Alert.alert('Erro', 'Preencha título e conteúdo');
      return;
    }

    if (!editArticleImageUrl.trim() && !editSelectedImage) {
      Alert.alert('Erro', 'Selecione uma foto para o artigo');
      return;
    }

    if (!editArticleCategory) {
      Alert.alert('Erro', 'Selecione a categoria Nacional');
      return;
    }

    if (!authToken) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    setUpdatingArticle(true);
    try {
      let imageUrl = editArticleImageUrl;
      
      // Se há uma nova imagem selecionada, fazer upload
      if (editSelectedImage) {
        try {
          imageUrl = await uploadImageToServer(editSelectedImage);
        } catch (uploadError) {
          Alert.alert('Erro', 'Erro ao fazer upload da imagem');
          setUpdatingArticle(false);
          return;
        }
      }

      const response = await fetch(`${API_URL}/articles/${editingArticle.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          title: editArticleTitle,
          content: editArticleContent,
          excerpt: editArticleExcerpt || editArticleContent.substring(0, 200),
          image_url: imageUrl,
          category: editArticleCategory || 'Geral',
          featured: editArticleFeatured,
          published: true,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Artigo atualizado com sucesso!');
        // Limpar formulário
        setEditingArticle(null);
        setEditArticleTitle('');
        setEditArticleContent('');
        setEditArticleExcerpt('');
        setEditArticleImageUrl('');
        setEditArticleCategory('');
        setEditArticleFeatured(false);
        setEditSelectedImage(null);
        setScreen('home');
        loadArticles();
        loadFeaturedArticles();
      } else {
        const error = await response.json();
        Alert.alert('Erro', error.detail || 'Erro ao atualizar artigo');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    } finally {
      setUpdatingArticle(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir este artigo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/articles/${articleId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
              });

              if (response.ok) {
                Alert.alert('Sucesso', 'Artigo excluído com sucesso!');
                loadArticles();
                loadFeaturedArticles();
              } else {
                Alert.alert('Erro', 'Erro ao excluir artigo');
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro ao conectar ao servidor');
            }
          }
        }
      ]
    );
  };

  const toggleFeatured = async (article) => {
    try {
      const response = await fetch(`${API_URL}/articles/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          featured: !article.featured
        }),
      });

      if (response.ok) {
        const action = article.featured ? 'removido dos' : 'adicionado aos';
        Alert.alert('Sucesso', `Artigo ${action} destaques!`);
        loadArticles();
        loadFeaturedArticles();
      } else {
        Alert.alert('Erro', 'Erro ao atualizar destaque do artigo');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  };

  // Team CRUD Functions
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) {
      Alert.alert('Erro', 'Digite o nome da equipa');
      return;
    }

    if (!authToken) {
      Alert.alert('Erro', 'Você precisa estar logado');
      return;
    }

    try {
      let logoUrl = null;
      
      if (selectedTeamLogo) {
        try {
          logoUrl = await uploadImageToServer(selectedTeamLogo);
        } catch (uploadError) {
          Alert.alert('Erro', 'Erro ao fazer upload do logotipo');
          return;
        }
      }

      const response = await fetch(`${API_URL}/teams/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: newTeamName,
          logo_url: logoUrl,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Equipa criada com sucesso!');
        setNewTeamName('');
        setSelectedTeamLogo(null);
        loadTeams();
        setScreen('home');
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.detail || 'Erro ao criar equipa');
      }
    } catch (error) {
      console.error('Erro ao criar equipa:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  };

  const handleUpdateTeam = async (team) => {
    try {
      let logoUrl = team.logo_url;
      
      if (editSelectedTeamLogo) {
        try {
          logoUrl = await uploadImageToServer(editSelectedTeamLogo);
        } catch (uploadError) {
          Alert.alert('Erro', 'Erro ao fazer upload do logotipo');
          return;
        }
      }

      const response = await fetch(`${API_URL}/teams/${team.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name: editingTeam.name,
          logo_url: logoUrl,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Equipa atualizada com sucesso!');
        setEditingTeam(null);
        setEditSelectedTeamLogo(null);
        loadTeams();
        setScreen('home');
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.detail || 'Erro ao atualizar equipa');
      }
    } catch (error) {
      console.error('Erro ao atualizar equipa:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja excluir esta equipa?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(`${API_URL}/teams/${teamId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${authToken}`
                }
              });

              if (response.ok) {
                Alert.alert('Sucesso', 'Equipa excluída com sucesso!');
                loadTeams();
              } else {
                Alert.alert('Erro', 'Erro ao excluir equipa');
              }
            } catch (error) {
              Alert.alert('Erro', 'Erro ao conectar ao servidor');
            }
          }
        }
      ]
    );
  };

  const startEditTeam = (team) => {
    setEditingTeam(team);
    setEditSelectedTeamLogo(null);
    setScreen('teams');
  };

  const renderArticleContent = (content, contentImages = []) => {
    // Dividir o conteúdo por quebras de linha
    const paragraphs = content.split('\n');
    let imageIndex = 0;
    
    return paragraphs.map((paragraph, index) => {
      // Se há imagens de conteúdo e chegou na hora de mostrar uma
      if (contentImages.length > 0 && imageIndex < contentImages.length && paragraph.trim() === '') {
        const imageUrl = contentImages[imageIndex];
        imageIndex++;
        
        return (
          <View key={`image-${index}`} style={styles.contentParagraph}>
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.contentImage}
              resizeMode="cover"
            />
          </View>
        );
      } else if (paragraph.trim()) {
        return (
          <Text key={index} style={styles.articleDetailText}>
            {paragraph}
          </Text>
        );
      }
      return null;
    });
  };

  // Render Article Detail Screen
  if (screen === 'article' && selectedArticle) {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
        <ScrollView style={styles.articleScroll}>
          <View style={styles.articleHeader}>
            <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.articleHeaderTitle}>Artigo</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.articleDetailContainer}>
            {selectedArticle.image_url && (
              <Image 
                source={{ uri: selectedArticle.image_url }} 
                style={styles.articleDetailImage}
                resizeMode="cover"
              />
            )}
            
            <View style={styles.articleDetailContent}>
              <Text style={styles.articleDetailTitle}>{selectedArticle.title}</Text>
              
              <View style={styles.articleDetailMeta}>
                <Text style={styles.articleDetailDate}>
                  {new Date(selectedArticle.created_at).toLocaleDateString('pt-MZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                {selectedArticle.category && (
                  <View style={[
                    styles.articleDetailCategory,
                    selectedArticle.category.toLowerCase() === 'nacional' 
                      ? styles.articleDetailCategoryNacional 
                      : styles.articleDetailCategoryInternacional
                  ]}>
                    <Text style={styles.articleDetailCategoryText}>
                      {selectedArticle.category}
                    </Text>
                  </View>
                )}
              </View>

              {renderArticleContent(selectedArticle.content, selectedArticle.content_images || [])}
            </View>
          </View>
        </ScrollView>
    </View>
    );
  }

  // Render Edit Screen
  if (screen === 'edit') {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView style={styles.adminScroll}>
          <View style={styles.adminHeader}>
            <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.adminTitle}>Editar Artigo</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.form}>
            <View style={styles.formSection}>
              <Text style={styles.label}>Título do Artigo *</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Liga Moçambicana 2025"
                placeholderTextColor="#999"
                value={editArticleTitle}
                onChangeText={setEditArticleTitle}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Categoria *</Text>
              <View style={styles.categoryButtons}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    editArticleCategory === 'Nacional' && styles.categoryButtonActive
                  ]}
                  onPress={() => setEditArticleCategory('Nacional')}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    editArticleCategory === 'Nacional' && styles.categoryButtonTextActive
                  ]}>Nacional</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Foto do Artigo *</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={pickEditImage}
              >
                <Ionicons name="camera-outline" size={24} color="#228B22" />
                <Text style={styles.uploadButtonText}>
                  {editSelectedImage ? 'Nova Foto Selecionada' : 'Trocar Foto'}
                </Text>
              </TouchableOpacity>
              {(editSelectedImage || editArticleImageUrl) && (
                <View style={styles.imagePreview}>
                  <Image 
                    source={{ uri: editSelectedImage || editArticleImageUrl }} 
                    style={styles.imagePreviewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => {
                      setEditSelectedImage(null);
                      setEditArticleImageUrl('');
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Marcar como Destaque</Text>
              <TouchableOpacity 
                style={[
                  styles.featuredToggle,
                  editArticleFeatured && styles.featuredToggleActive
                ]}
                onPress={() => setEditArticleFeatured(!editArticleFeatured)}
              >
                <Ionicons 
                  name={editArticleFeatured ? "star" : "star-outline"} 
                  size={24} 
                  color={editArticleFeatured ? "#ffd700" : "#666"} 
                />
                <Text style={[
                  styles.featuredToggleText,
                  editArticleFeatured && styles.featuredToggleTextActive
                ]}>
                  {editArticleFeatured ? 'Em Destaque' : 'Marcar como Destaque'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Resumo do Artigo</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Escreva uma breve descrição..."
                placeholderTextColor="#999"
                value={editArticleExcerpt}
                onChangeText={setEditArticleExcerpt}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Conteúdo Completo *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Escreva o conteúdo completo do artigo..."
                placeholderTextColor="#999"
                value={editArticleContent}
                onChangeText={setEditArticleContent}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formSection}>
              <TouchableOpacity
                style={[styles.button, updatingArticle && styles.buttonDisabled]}
                onPress={handleUpdateArticle}
                disabled={updatingArticle}
              >
                {updatingArticle ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Salvar Alterações</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setScreen('home')}
              >
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Render Admin Screen
  if (screen === 'admin') {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView style={styles.adminScroll}>
          <View style={styles.adminHeader}>
            <TouchableOpacity onPress={() => setScreen('home')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.adminTitle}>Criar Artigo</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.form}>
            <View style={styles.formSection}>
              <Text style={styles.label}>Título do Artigo</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Liga Moçambicana 2025"
                placeholderTextColor="#999"
                value={newArticleTitle}
                onChangeText={setNewArticleTitle}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Categoria</Text>
              <View style={styles.categoryButtons}>
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    newArticleCategory === 'Nacional' && styles.categoryButtonActive
                  ]}
                  onPress={() => setNewArticleCategory('Nacional')}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    newArticleCategory === 'Nacional' && styles.categoryButtonTextActive
                  ]}>Nacional</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Foto do Artigo</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={pickImage}
              >
                <Ionicons name="camera-outline" size={24} color="#228B22" />
                <Text style={styles.uploadButtonText}>
                  {selectedImage ? 'Foto Selecionada' : 'Escolher da Galeria'}
                </Text>
              </TouchableOpacity>
              {(selectedImage || newArticleImageUrl) && (
                <View style={styles.imagePreview}>
                  <Image 
                    source={{ uri: selectedImage || newArticleImageUrl }} 
                    style={styles.imagePreviewImage}
                    resizeMode="cover"
                  />
                  <TouchableOpacity 
                    style={styles.removeImageButton}
                    onPress={() => {
                      setSelectedImage(null);
                      setNewArticleImageUrl('');
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Vídeo do Artigo (Opcional)</Text>
              <TouchableOpacity 
                style={styles.uploadButton}
                onPress={pickVideo}
              >
                <Ionicons name="videocam-outline" size={24} color="#228B22" />
                <Text style={styles.uploadButtonText}>
                  {selectedVideo ? 'Vídeo Selecionado' : 'Escolher Vídeo'}
                </Text>
              </TouchableOpacity>
              {selectedVideo && (
                <View style={styles.videoPreview}>
                  <Text style={styles.videoPreviewText}>Vídeo selecionado</Text>
                  <TouchableOpacity 
                    style={styles.removeVideoButton}
                    onPress={() => {
                      setSelectedVideo(null);
                    }}
                  >
                    <Ionicons name="close-circle" size={24} color="#DC143C" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Resumo do Artigo</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Escreva uma breve descrição..."
                placeholderTextColor="#999"
                value={newArticleExcerpt}
                onChangeText={setNewArticleExcerpt}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Conteúdo Completo</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Escreva o conteúdo completo do artigo..."
                placeholderTextColor="#999"
                value={newArticleContent}
                onChangeText={setNewArticleContent}
                multiline
                numberOfLines={10}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.formSection}>
              <TouchableOpacity
                style={[styles.button, creatingArticle && styles.buttonDisabled]}
                onPress={handleCreateArticle}
                disabled={creatingArticle}
              >
                {creatingArticle ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Publicar Artigo</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={() => setScreen('home')}
              >
                <Text style={styles.buttonSecondaryText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  // Render Teams Screen
  if (screen === 'teams') {
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ScrollView style={styles.adminScroll}>
          <View style={styles.adminHeader}>
            <TouchableOpacity onPress={() => { setScreen('home'); setEditingTeam(null); }} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.adminTitle}>{editingTeam ? 'Editar Equipa' : 'Gerenciar Equipas'}</Text>
            <View style={{ width: 24 }} />
          </View>

          {editingTeam ? (
            // Editar equipa
            <View style={styles.form}>
              <View style={styles.formSection}>
                <Text style={styles.label}>Nome da Equipa *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: UD Songo"
                  placeholderTextColor="#999"
                  value={editingTeam.name}
                  onChangeText={(text) => setEditingTeam({ ...editingTeam, name: text })}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Logotipo</Text>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={pickEditTeamLogo}
                >
                  <Ionicons name="image-outline" size={24} color="#228B22" />
                  <Text style={styles.uploadButtonText}>
                    {editSelectedTeamLogo || editingTeam.logo_url ? 'Logotipo Selecionado' : 'Escolher Logotipo'}
                  </Text>
                </TouchableOpacity>
                {(editSelectedTeamLogo || editingTeam.logo_url) && (
                  <View style={styles.logoPreview}>
                    <Image 
                      source={{ uri: editSelectedTeamLogo || editingTeam.logo_url }} 
                      style={styles.logoPreviewImage}
                      resizeMode="contain"
                    />
                    <TouchableOpacity 
                      style={styles.removeLogoButton}
                      onPress={() => {
                        setEditSelectedTeamLogo(null);
                        setEditingTeam({ ...editingTeam, logo_url: null });
                      }}
                    >
                      <Ionicons name="close-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.formSection}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleUpdateTeam(editingTeam)}
                >
                  <Text style={styles.buttonText}>Atualizar Equipa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.buttonSecondary]}
                  onPress={() => { setEditingTeam(null); setEditSelectedTeamLogo(null); }}
                >
                  <Text style={styles.buttonSecondaryText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            // Lista de equipas
            <View style={styles.form}>
              <View style={styles.formSection}>
                <Text style={styles.label}>Criar Nova Equipa</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: UD Songo"
                  placeholderTextColor="#999"
                  value={newTeamName}
                  onChangeText={setNewTeamName}
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.label}>Logotipo</Text>
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={pickTeamLogo}
                >
                  <Ionicons name="image-outline" size={24} color="#228B22" />
                  <Text style={styles.uploadButtonText}>
                    {selectedTeamLogo ? 'Logotipo Selecionado' : 'Escolher Logotipo'}
                  </Text>
                </TouchableOpacity>
                {selectedTeamLogo && (
                  <View style={styles.logoPreview}>
                    <Image 
                      source={{ uri: selectedTeamLogo }} 
                      style={styles.logoPreviewImage}
                      resizeMode="contain"
                    />
                    <TouchableOpacity 
                      style={styles.removeLogoButton}
                      onPress={() => setSelectedTeamLogo(null)}
                    >
                      <Ionicons name="close-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.formSection}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleCreateTeam}
                >
                  <Text style={styles.buttonText}>Criar Equipa</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Equipas Cadastradas</Text>
                {teams.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Nenhuma equipa cadastrada</Text>
                  </View>
                ) : (
                  teams.map((team) => (
                    <View key={team.id} style={styles.teamCard}>
                      {team.logo_url ? (
                        <Image source={{ uri: team.logo_url }} style={styles.teamLogo} />
                      ) : (
                        <View style={styles.teamLogoPlaceholder}>
                          <Ionicons name="shirt-outline" size={32} color="#228B22" />
                        </View>
                      )}
                      <Text style={styles.teamName}>{team.name}</Text>
                      <View style={styles.teamActions}>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => startEditTeam(team)}
                        >
                          <Ionicons name="pencil" size={20} color="#228B22" />
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.actionButton}
                          onPress={() => handleDeleteTeam(team.id)}
                        >
                          <Ionicons name="trash" size={20} color="#DC143C" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // Render Home Screen Component
  const renderHomeScreen = () => (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.headerHome}>
        <Image 
          key={headerImageKey}
          source={{ uri: headerImage }}
          style={styles.headerBackgroundImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay}>
          <Text style={styles.headerTitle}>Só Futebol</Text>
          <Text style={styles.headerSubtitle}>Futebol Moçambicano</Text>
          {authToken && (
            <View style={styles.headerButtons}>
              {isAdmin && (
                <>
                  <TouchableOpacity style={styles.adminButton} onPress={() => setScreen('admin')}>
                    <Ionicons name="add-circle" size={24} color="#fff" />
                    <Text style={styles.headerButtonText}> Novo Artigo</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerImageButton} onPress={pickHeaderImage}>
                    <Ionicons name="camera" size={20} color="#fff" />
                    <Text style={styles.headerButtonText}> Foto</Text>
                  </TouchableOpacity>
                </>
              )}
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.headerButtonText}>Sair</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#228B22" />
        </View>
      ) : (
        <ScrollView>
          {/* Artigos em Destaque */}
          {featuredArticles.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Artigos em Destaque</Text>
              <FlatList
                data={featuredArticles}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredScrollContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    key={item.id} 
                    style={styles.featuredCardScroll} 
                    onPress={() => openArticle(item)}
                  >
                    <Image source={{ uri: item.image_url }} style={styles.featuredImageScroll} />
                    <View style={styles.featuredOverlayScroll}>
                      <Text style={styles.featuredTitleScroll} numberOfLines={3}>{item.title}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}

          {/* Todos os Artigos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Todos os Artigos</Text>
            {articles.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhum artigo disponível ainda</Text>
              </View>
            ) : (
              articles.map((item) => (
                <View key={item.id} style={styles.articleCard}>
                  <TouchableOpacity onPress={() => openArticle(item)}>
                    <View style={styles.imageContainer}>
                      {item.image_url && (
                        <Image source={{ uri: item.image_url }} style={styles.articleImage} />
                      )}
                      {/* Tag de Categoria */}
                      {item.category && (
                        <View style={[
                          styles.categoryTag,
                          item.category.toLowerCase() === 'nacional' ? styles.categoryTagNacional : styles.categoryTagInternacional
                        ]}>
                          <Text style={styles.categoryTagText}>// {item.category.toUpperCase()} //</Text>
                        </View>
                      )}
                      {/* Indicador de Destaque */}
                      {item.featured && (
                        <View style={styles.featuredIndicator}>
                          <Ionicons name="star" size={16} color="#ffd700" />
                        </View>
                      )}
                    </View>
                    <View style={styles.articleContent}>
                      <Text style={styles.articleTitle} numberOfLines={2} ellipsizeMode="tail">
                        {item.title}
                      </Text>
                      {item.excerpt && (
                        <Text style={styles.articleExcerpt} numberOfLines={3} ellipsizeMode="tail">
                          {item.excerpt}
                        </Text>
                      )}
                      <Text style={styles.articleMeta}>
                        {new Date(item.created_at).toLocaleDateString('pt-MZ')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {isAdmin && (
                    <View style={styles.articleActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => startEditArticle(item)}
                      >
                        <Ionicons name="create-outline" size={20} color="#228B22" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[
                          styles.actionButton,
                          item.featured && styles.featuredActionButton
                        ]}
                        onPress={() => toggleFeatured(item)}
                      >
                        <Ionicons 
                          name={item.featured ? "star" : "star-outline"} 
                          size={20} 
                          color={item.featured ? "#ffd700" : "#228B22"} 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteArticle(item.id)}
                      >
                        <Ionicons name="trash-outline" size={20} color="#DC143C" />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );

  // Render Search Screen Component (Tabela)
  const renderSearchScreen = () => {
    // Dados da classificação
    const classificacao = [
      { pos: 1, equipa: 'UD Songo', j: 18, v: 15, e: 2, d: 1, gm: 40, gs: 10, dg: 30, pts: 47, dp: 0, highlight: '#d4edda' },
      { pos: 2, equipa: 'Ferroviário Beira', j: 19, v: 8, e: 6, d: 5, gm: 16, gs: 12, dg: 4, pts: 30, dp: 17 },
      { pos: 3, equipa: 'Black Bulls', j: 15, v: 8, e: 3, d: 4, gm: 24, gs: 17, dg: 7, pts: 27, dp: 3 },
      { pos: 4, equipa: 'Costa do Sol', j: 18, v: 6, e: 9, d: 3, gm: 15, gs: 11, dg: 4, pts: 27, dp: 0 },
      { pos: 5, equipa: 'Ferroviário Lichinga', j: 18, v: 7, e: 6, d: 5, gm: 30, gs: 27, dg: 3, pts: 27, dp: 0 },
      { pos: 6, equipa: 'Ferroviário Maputo', j: 16, v: 5, e: 10, d: 1, gm: 19, gs: 11, dg: 8, pts: 25, dp: 2 },
      { pos: 7, equipa: 'Ferroviário Nacala', j: 19, v: 6, e: 7, d: 6, gm: 13, gs: 14, dg: -1, pts: 25, dp: 0 },
      { pos: 8, equipa: 'Bala de Pemba', j: 19, v: 6, e: 6, d: 7, gm: 18, gs: 17, dg: 1, pts: 24, dp: 1 },
      { pos: 9, equipa: 'Chingale Tete', j: 17, v: 4, e: 8, d: 5, gm: 12, gs: 15, dg: -3, pts: 20, dp: 4 },
      { pos: 10, equipa: 'AD Vilankulo', j: 16, v: 4, e: 6, d: 6, gm: 15, gs: 18, dg: -3, pts: 18, dp: 2 },
      { pos: 11, equipa: 'Textafrica Chimolo', j: 18, v: 3, e: 7, d: 8, gm: 11, gs: 21, dg: -10, pts: 16, dp: 2 },
      { pos: 12, equipa: 'Ferroviário Nampula', j: 17, v: 3, e: 7, d: 7, gm: 13, gs: 24, dg: -11, pts: 16, dp: 0 },
      { pos: 13, equipa: 'Desportivo Nacala', j: 17, v: 3, e: 5, d: 9, gm: 13, gs: 24, dg: -11, pts: 14, dp: 2, highlight: '#f8d7da' },
      { pos: 14, equipa: 'Desportivo Matola', j: 17, v: 1, e: 4, d: 12, gm: 9, gs: 27, dg: -18, pts: 7, dp: 7, highlight: '#f8d7da' },
    ];

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.searchHeader}>
          <Text style={styles.searchHeaderTitle}>Tabela</Text>
        </View>
        <View style={styles.tableSubtitleContainer}>
          <Text style={styles.tableSubtitle}>Classificação - 21ª Jornada</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Cabeçalho da tabela */}
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderText}>Pos</Text>
              <Text style={[styles.tableHeaderText, styles.tableTeamColumn]}>Equipa</Text>
              <Text style={styles.tableHeaderText}>J</Text>
              <Text style={styles.tableHeaderText}>V</Text>
              <Text style={styles.tableHeaderText}>E</Text>
              <Text style={styles.tableHeaderText}>D</Text>
              <Text style={styles.tableHeaderText}>GM</Text>
              <Text style={styles.tableHeaderText}>GS</Text>
              <Text style={styles.tableHeaderText}>DG</Text>
              <Text style={styles.tableHeaderText}>P</Text>
            </View>
            
            {/* Linhas da tabela */}
            {classificacao.map((item) => (
              <View key={item.pos} style={[styles.tableRow, item.highlight && { backgroundColor: item.highlight }]}>
                <Text style={styles.tableCell}>{item.pos}</Text>
                <Text style={[styles.tableCell, styles.tableTeamColumn, styles.tableTeamName]}>{item.equipa}</Text>
                <Text style={styles.tableCell}>{item.j}</Text>
                <Text style={styles.tableCell}>{item.v}</Text>
                <Text style={styles.tableCell}>{item.e}</Text>
                <Text style={styles.tableCell}>{item.d}</Text>
                <Text style={styles.tableCell}>{item.gm}</Text>
                <Text style={styles.tableCell}>{item.gs}</Text>
                <Text style={styles.tableCell}>{item.dg}</Text>
                <Text style={[styles.tableCell, styles.tablePoints]}>{item.pts}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Notas da classificação</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, styles.legendSquareGreen]} />
            <Text style={styles.legendText}>CAF Champions League</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSquare, styles.legendSquareRed]} />
            <Text style={styles.legendText}>Despromoção</Text>
          </View>
        </View>
      </View>
    );
  };

  // Render Ideas Screen Component (Partidas)
  const renderIdeasScreen = () => {
    // Últimas partidas (com placares)
    const ultimasPartidas = [
      { rodada: 19, data: '03.11', hora: '15:00', time1: 'Ferroviário Lichinga', time2: 'Textafrica', placar1: '5', placar2: '3' },
      { rodada: 19, data: '02.11', hora: '15:00', time1: 'Ferroviário Nampula', time2: 'Baia de Pemba', placar1: '0', placar2: '2' },
      { rodada: 19, data: '02.11', hora: '15:00', time1: 'Ferroviário Nacala', time2: 'Black Bulls', placar1: '1', placar2: '0' },
      { rodada: 19, data: '01.11', hora: '15:00', time1: 'Ferroviário Maputo', time2: 'Ferroviário Beira', placar1: '3', placar2: '1' },
      { rodada: 19, data: '31.10', hora: '15:00', time1: 'Chingale Tete', time2: 'Costa do Sol', placar1: '0', placar2: '0' },
      { rodada: 19, data: '28.10', hora: '15:00', time1: 'Desportivo Matola', time2: 'UD Songo', placar1: '0', placar2: '4' },
      { rodada: 18, data: '02.11', hora: '14:45', time1: 'UD Songo', time2: 'ENH Vilankulo', placar1: '2', placar2: '0' },
      { rodada: 18, data: '26.10', hora: '15:00', time1: 'Ferroviário Beira', time2: 'Ferroviário Nampula', placar1: '2', placar2: '1' },
      { rodada: 18, data: '25.10', hora: '14:45', time1: 'Costa do Sol', time2: 'Desportivo Matola', placar1: '2', placar2: '1' },
      { rodada: 10, data: '28.10', hora: '15:00', time1: 'ENH Vilankulo', time2: 'Baia de Pemba', placar1: '1', placar2: '0' },
      { rodada: 10, data: '24.10', hora: '15:00', time1: 'Baia de Pemba', time2: 'UD Songo', placar1: '0', placar2: '2' },
      { rodada: 19, data: '20.09', hora: '14:00', time1: 'AD Vilankulo', time2: 'Desportivo Nacala', placar1: 'ADI', placar2: '' },
    ];

    // Próximas partidas (sem placares)
    const proximasPartidas = [
      { rodada: 16, data: '05.11', hora: '15:00', time1: 'UD Songo', time2: 'Ferroviário Maputo', placar1: '-', placar2: '-' },
      { rodada: 10, data: '06.11', hora: '15:00', time1: 'Black Bulls', time2: 'ENH Vilankulo', placar1: '-', placar2: '-' },
      { rodada: 18, data: '09.11', hora: '14:45', time1: 'Textafrica', time2: 'Ferroviário Maputo', placar1: '-', placar2: '-' },
      { rodada: 19, data: '09.11', hora: '15:00', time1: 'ENH Vilankulo', time2: 'Nacala', placar1: '-', placar2: '-' },
      { rodada: 17, data: '09.11', hora: '16:00', time1: 'Costa do Sol', time2: 'Black Bulls', placar1: '-', placar2: '-' },
      { rodada: 17, data: '12.11', hora: '15:00', time1: 'Ferroviário Maputo', time2: 'Nacala', placar1: '-', placar2: '-' },
    ];

    // Agrupar últimas partidas por rodada
    const ultimasPorRodada = {};
    ultimasPartidas.forEach(partida => {
      if (!ultimasPorRodada[partida.rodada]) {
        ultimasPorRodada[partida.rodada] = [];
      }
      ultimasPorRodada[partida.rodada].push(partida);
    });

    // Agrupar próximas partidas por rodada
    const proximasPorRodada = {};
    proximasPartidas.forEach(partida => {
      if (!proximasPorRodada[partida.rodada]) {
        proximasPorRodada[partida.rodada] = [];
      }
      proximasPorRodada[partida.rodada].push(partida);
    });

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.searchHeader}>
          <Text style={styles.searchHeaderTitle}>Partidas</Text>
        </View>
        <ScrollView>
          <View style={styles.tableSubtitleContainer}>
            <Text style={styles.tableSubtitle}>Últimas partidas</Text>
          </View>
          {Object.keys(ultimasPorRodada).sort((a, b) => b - a).map((rodada) => (
            <View key={rodada} style={styles.rodadaContainer}>
              <Text style={styles.rodadaTitle}>RODADA {rodada}</Text>
              {ultimasPorRodada[rodada].map((partida, index) => (
                <View key={index} style={styles.jogoCard}>
                  <View style={styles.jogoHeader}>
                    <Text style={styles.jogoData}>{partida.data} • {partida.hora}</Text>
                  </View>
                  <View style={styles.jogoTimes}>
                    <View style={styles.jogoTime}>
                      <Text style={styles.timeNome}>{partida.time1}</Text>
                      <Text style={styles.jogoPlacar}>{partida.placar1}</Text>
                    </View>
                    <Text style={styles.jogoVs}>VS</Text>
                    <View style={styles.jogoTime}>
                      <Text style={styles.timeNome}>{partida.time2}</Text>
                      <Text style={styles.jogoPlacar}>{partida.placar2}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
          <View style={styles.tableSubtitleContainer}>
            <Text style={styles.tableSubtitle}>Próximas partidas</Text>
          </View>
          {Object.keys(proximasPorRodada).sort((a, b) => b - a).map((rodada) => (
            <View key={`prox-${rodada}`} style={styles.rodadaContainer}>
              <Text style={styles.rodadaTitle}>RODADA {rodada}</Text>
              {proximasPorRodada[rodada].map((partida, index) => (
                <View key={index} style={styles.jogoCard}>
                  <View style={styles.jogoHeader}>
                    <Text style={styles.jogoData}>{partida.data} • {partida.hora}</Text>
                  </View>
                  <View style={styles.jogoTimes}>
                    <View style={styles.jogoTime}>
                      <Text style={styles.timeNome}>{partida.time1}</Text>
                      <Text style={styles.jogoPlacar}>{partida.placar1}</Text>
                    </View>
                    <Text style={styles.jogoVs}>VS</Text>
                    <View style={styles.jogoTime}>
                      <Text style={styles.timeNome}>{partida.time2}</Text>
                      <Text style={styles.jogoPlacar}>{partida.placar2}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  // Render Favorites Screen Component
  const renderFavoritesScreen = () => {
    const [favorites, setFavorites] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState(false);

    useEffect(() => {
      if (authToken && screen === 'home') {
        loadFavorites();
      }
    }, [authToken]);

    const loadFavorites = async () => {
      if (!authToken) return;
      
      setLoadingFavorites(true);
      try {
        const response = await fetch(`${API_URL}/favorites`, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      } finally {
        setLoadingFavorites(false);
      }
    };

    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.searchHeader}>
          <Text style={styles.searchHeaderTitle}>Favoritos</Text>
        </View>
        {loadingFavorites ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#228B22" />
          </View>
        ) : (
          <ScrollView>
            {favorites.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Você ainda não tem favoritos</Text>
              </View>
            ) : (
              favorites.map((fav) => (
                <TouchableOpacity key={fav.id} style={styles.articleCard} onPress={() => {
                  const article = articles.find(a => a.id === fav.article_id);
                  if (article) openArticle(article);
                }}>
                  <View style={styles.imageContainer}>
                    {fav.article_image_url && (
                      <Image source={{ uri: fav.article_image_url }} style={styles.articleImage} />
                    )}
                  </View>
                  <View style={styles.articleContent}>
                    <Text style={styles.articleTitle} numberOfLines={2}>{fav.article_title}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
    );
  };

  // Render Profile Screen Component
  const renderProfileScreen = () => (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.searchHeader}>
        <Text style={styles.searchHeaderTitle}>Perfil</Text>
      </View>
      <ScrollView>
        <View style={styles.profileContainer}>
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatar}>
              <Ionicons name="person" size={60} color="#228B22" />
            </View>
            <Text style={styles.profileName}>{currentUser?.full_name || currentUser?.username || 'Usuário'}</Text>
            {currentUser?.email && (
              <Text style={styles.profileEmail}>{currentUser.email}</Text>
            )}
            {isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>ADMIN</Text>
              </View>
            )}
          </View>
          
          <View style={styles.profileSection}>
            <TouchableOpacity style={styles.profileButton} onPress={() => setScreen('admin')}>
              <Ionicons name="create-outline" size={24} color="#228B22" />
              <Text style={styles.profileButtonText}>Criar Artigo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.profileButton} onPress={() => setScreen('teams')}>
              <Ionicons name="people-outline" size={24} color="#228B22" />
              <Text style={styles.profileButtonText}>Gerenciar Equipas</Text>
            </TouchableOpacity>
            
            {authToken ? (
              <TouchableOpacity style={[styles.profileButton, styles.logoutProfileButton]} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={24} color="#DC143C" />
                <Text style={[styles.profileButtonText, styles.logoutProfileButtonText]}>Sair</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.profileButton} onPress={() => setScreen('login')}>
                <Ionicons name="log-in-outline" size={24} color="#228B22" />
                <Text style={styles.profileButtonText}>Entrar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );

  // If there are modal screens (login, register, admin, edit, article), render them directly
  if (screen === 'login' || screen === 'register' || screen === 'admin' || screen === 'edit' || screen === 'article') {
    if (screen === 'login') {
      return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.logo}>Só Futebol</Text>
              <Text style={styles.subtitle}>Revista de Futebol</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Usuário</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                placeholderTextColor="#999"
                value={username}
                onChangeText={setUsername}
              />

              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.link} onPress={() => setScreen('register')}>
                <Text style={styles.linkText}>
                  Não tem conta? <Text style={styles.linkBold}>Cadastre-se</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }

    if (screen === 'register') {
      return (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text style={styles.logo}>Só Futebol</Text>
              <Text style={styles.subtitle}>Criar Nova Conta</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#999"
                value={regFullName}
                onChangeText={setRegFullName}
              />

              <Text style={styles.label}>Usuário *</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu usuário"
                placeholderTextColor="#999"
                value={regUsername}
                onChangeText={setRegUsername}
              />

              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu email"
                placeholderTextColor="#999"
                keyboardType="email-address"
                value={regEmail}
                onChangeText={setRegEmail}
              />

              <Text style={styles.label}>Senha *</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#999"
                secureTextEntry
                value={regPassword}
                onChangeText={setRegPassword}
              />

              <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Criar Conta</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.link} onPress={() => setScreen('login')}>
                <Text style={styles.linkText}>
                  Já tem conta? <Text style={styles.linkBold}>Faça login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      );
    }

    // Return existing modal screens (admin, edit, article)
    // These screens are defined earlier in the code (lines 727-1110)
    // Just keep the screen state logic here
    return null; // This should never be reached
  }

  // Render Tab Navigator for main app
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Início') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Tabela') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Partidas') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Favoritos') {
              iconName = focused ? 'heart' : 'heart-outline';
            } else if (route.name === 'Perfil') {
              iconName = focused ? 'person' : 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#228B22',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#E0E0E0',
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Início" component={renderHomeScreen} />
        <Tab.Screen name="Partidas" component={renderIdeasScreen} />
        <Tab.Screen name="Tabela" component={renderSearchScreen} />
        <Tab.Screen name="Favoritos" component={renderFavoritesScreen} />
        <Tab.Screen name="Perfil" component={renderProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Bege quente
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#8B4513', // Marrom quente
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2F4F2F', // Verde escuro
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D2691E', // Chocolate quente
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#228B22',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#228B22',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#228B22',
    fontSize: 18,
    fontWeight: '600',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 14,
    color: '#8B4513', // Marrom quente
  },
  linkBold: {
    fontWeight: '600',
    color: '#228B22',
  },
  headerHome: {
    position: 'relative',
    height: 200,
    overflow: 'hidden',
  },
  headerBackgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(34, 139, 34, 0.8)', // Verde da bandeira com transparência
    padding: 20,
    paddingTop: 50,
    justifyContent: 'flex-end',
  },
  headerTitle: {
    color: '#FFD700', // Amarelo da bandeira para o título
    fontSize: 28,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: 'rgb(255, 255, 255)', // Vermelho da bandeira para o subtítulo
    fontSize: 16,
    marginTop: 5,
    textShadowColor: 'rgb(82, 82, 82)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  headerButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  adminButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  headerImageButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.8)', // Amarelo da bandeira com transparência
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)', // Branco com transparência
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.8)', // Amarelo da bandeira com transparência
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)', // Branco com transparência
  },
  headerButtonText: {
    color: '#1a1a1a', // Preto da bandeira para melhor contraste
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  list: {
    padding: 10,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
  articleImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  articleContent: {
    padding: 12,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a', // Preto da bandeira
    marginBottom: 6,
    lineHeight: 22,
  },
  articleExcerpt: {
    fontSize: 13,
    color: '#8B4513', // Marrom quente
    lineHeight: 18,
    marginBottom: 8,
  },
  articleMeta: {
    fontSize: 11,
    color: '#8B7355', // Marrom claro
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a', // Preto da bandeira
    marginBottom: 16,
    marginTop: 12,
  },
  featuredScrollContainer: {
    paddingHorizontal: 15,
    gap: 12,
  },
  featuredCardScroll: {
    width: 280,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    position: 'relative',
  },
  featuredImageScroll: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featuredOverlayScroll: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
  },
  featuredTitleScroll: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 22,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8B7355', // Marrom claro
  },
  adminScroll: {
    flex: 1,
  },
  adminHeader: {
    backgroundColor: '#228B22',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  adminTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  articleActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    marginLeft: 10,
    padding: 8,
  },
  featuredActionButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 4,
  },
  featuredIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 20,
    padding: 6,
    zIndex: 1,
  },
  categoryTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    zIndex: 1,
  },
  categoryTagNacional: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // Amarelo da bandeira
  },
  categoryTagInternacional: {
    backgroundColor: 'rgba(255, 215, 0, 0.9)', // Amarelo da bandeira
  },
  categoryTagText: {
    color: '#1a1a1a', // Preto para contraste com fundo amarelo
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  categoryButtons: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  categoryButton: {
    flex: 1,
    backgroundColor: '#F5F5DC', // Bege quente
    borderWidth: 2,
    borderColor: '#D2691E', // Chocolate quente
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  categoryButtonActive: {
    backgroundColor: '#228B22',
    borderColor: '#228B22',
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513', // Marrom quente
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  formSection: {
    marginBottom: 20,
  },
  uploadButton: {
    backgroundColor: '#F5F5DC', // Bege quente
    borderWidth: 2,
    borderColor: '#228B22',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  uploadButtonText: {
    color: '#228B22',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreview: {
    marginTop: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#D2691E', // Chocolate quente
    position: 'relative',
  },
  imagePreviewImage: {
    width: '100%',
    height: 200,
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  videoPreview: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#F5F5DC', // Bege quente
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2691E', // Chocolate quente
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  videoPreviewText: {
    fontSize: 16,
    color: '#228B22',
    fontWeight: '500',
  },
  removeVideoButton: {
    padding: 5,
  },
  contentImagesPreview: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#F5F5DC', // Bege quente
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D2691E', // Chocolate quente
  },
  contentImagesPreviewText: {
    fontSize: 16,
    color: '#228B22',
    fontWeight: '500',
    marginBottom: 10,
  },
  contentImagePreview: {
    marginRight: 10,
    position: 'relative',
  },
  contentImagePreviewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeContentImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 10,
  },
  featuredToggle: {
    backgroundColor: '#F5F5DC', // Bege quente
    borderWidth: 2,
    borderColor: '#D2691E', // Chocolate quente
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  featuredToggleActive: {
    backgroundColor: '#FFF8DC', // Cornsilk quente
    borderColor: '#ffd700',
  },
  featuredToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B4513', // Marrom quente
  },
  featuredToggleTextActive: {
    color: '#DAA520', // Goldenrod mais quente
  },
  articleScroll: {
    flex: 1,
  },
  articleHeader: {
    backgroundColor: '#228B22',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  articleHeaderTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  articleDetailContainer: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  articleDetailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  articleDetailContent: {
    padding: 20,
  },
  articleDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a', // Preto da bandeira
    marginBottom: 15,
    lineHeight: 32,
  },
  articleDetailMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  articleDetailDate: {
    fontSize: 14,
    color: '#8B4513', // Marrom quente
    fontStyle: 'italic',
  },
  articleDetailCategory: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  articleDetailCategoryNacional: {
    backgroundColor: '#FFD700', // Amarelo da bandeira
  },
  articleDetailCategoryInternacional: {
    backgroundColor: '#FFD700', // Amarelo da bandeira
  },
  articleDetailCategoryText: {
    color: '#1a1a1a', // Preto para contraste com fundo amarelo
    fontSize: 12,
    fontWeight: 'bold',
  },
  articleDetailText: {
    fontSize: 16,
    color: '#2F4F2F', // Verde escuro
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 8,
  },
  contentParagraph: {
    marginBottom: 16,
  },
  contentImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 12,
    backgroundColor: '#F0E68C', // Khaki quente
  },
  searchHeader: {
    backgroundColor: '#228B22',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  searchHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F5F5DC',
    borderWidth: 1,
    borderColor: '#D2691E',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#228B22',
    padding: 12,
    borderRadius: 8,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchResults: {
    flex: 1,
    padding: 15,
  },
  profileContainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#F5F5DC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#228B22',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  adminBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
  },
  adminBadgeText: {
    color: '#1a1a1a',
    fontSize: 12,
    fontWeight: 'bold',
  },
  profileSection: {
    width: '100%',
    gap: 15,
  },
  profileButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#228B22',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    gap: 15,
  },
  profileButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#228B22',
  },
  logoutProfileButton: {
    borderColor: '#DC143C',
  },
  logoutProfileButtonText: {
    color: '#DC143C',
  },
  // Estilos para Partidas
  rodadaContainer: {
    marginBottom: 25,
    paddingHorizontal: 15,
  },
  rodadaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#228B22',
    marginBottom: 12,
    letterSpacing: 1,
  },
  jogoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#228B22',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  jogoHeader: {
    marginBottom: 12,
  },
  jogoData: {
    fontSize: 14,
    fontWeight: '600',
    color: '#228B22',
  },
  jogoTimes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  jogoTime: {
    flex: 1,
    alignItems: 'center',
  },
  timeNome: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
  },
  jogoVs: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#999',
    marginHorizontal: 10,
  },
  jogoPlacar: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC143C',
    marginTop: 4,
  },
  // Team styles
  logoPreview: {
    marginTop: 10,
    position: 'relative',
    alignItems: 'center',
  },
  logoPreviewImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f0f0f0',
  },
  removeLogoButton: {
    position: 'absolute',
    top: -5,
    right: '40%',
  },
  teamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  teamLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  teamLogoPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  teamName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  teamActions: {
    flexDirection: 'row',
    gap: 10,
  },
  // Table styles
  tableSubtitleContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  tableSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC143C',
  },
  tableContainer: {
    padding: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#228B22',
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
    minWidth: 30,
  },
  tableTeamColumn: {
    minWidth: 120,
    flex: 0,
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableCell: {
    fontSize: 12,
    color: '#1a1a1a',
    textAlign: 'center',
    minWidth: 30,
  },
  tableTeamName: {
    textAlign: 'left',
    fontWeight: '600',
  },
  tablePoints: {
    fontWeight: 'bold',
    color: '#228B22',
  },
  legendContainer: {
    padding: 15,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
    textAlign: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendSquare: {
    width: 20,
    height: 20,
    marginRight: 10,
    borderRadius: 4,
  },
  legendSquareGreen: {
    backgroundColor: '#d4edda',
  },
  legendSquareRed: {
    backgroundColor: '#f8d7da',
  },
  legendText: {
    fontSize: 14,
    color: '#1a1a1a',
  },
});
