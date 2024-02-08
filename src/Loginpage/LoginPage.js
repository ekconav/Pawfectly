import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import styles from './style';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = () => {

    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Username and password are required.');
      return;
    }
    console.log('Username:', username);
    console.log('Password:', password);
  };

  const handleSignup = () => {
    console.log('Signup');
  };


  return (

    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />  
      <Text>
      Don't have an account yet?{''}
        <TouchableOpacity 
        onPress={(handleSignup) => navigation.navigate('Signup')}  >
          <Text style={styles.text}>Sign up here</Text>
        </TouchableOpacity>
        </Text>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};