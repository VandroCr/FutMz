import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { API_URL, storeAuthToken } from '../config';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          full_name: fullName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          'Sucesso',
          'Conta criada com sucesso! Faça login para continuar.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        Alert.alert('Erro', data.detail || 'Erro ao criar conta');
      }
    } catch (error) {
      console.error('Erro no registro:', error);
      Alert.alert('Erro', 'Erro ao conectar ao servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
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
            value={fullName}
            onChangeText={setFullName}
          />

          <Text style={styles.label}>Usuário *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu usuário"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Senha *</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Criar Conta</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={styles.loginLink}
          >
            <Text style={styles.loginText}>
              Já tem conta? <Text style={styles.loginTextBold}>Faça login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    color: '#1a5f1a',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#1a5f1a',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginTextBold: {
    fontWeight: '600',
    color: '#1a5f1a',
  },
});
