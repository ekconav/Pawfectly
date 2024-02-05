// LoginPage.js

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = () => {
    // Implement your login logic here

    if (!username.trim() || !password.trim()) {
      // Display an alert if username or password is empty
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
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.text}>Sign up here</Text>
        </TouchableOpacity>
        </Text>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 8,
    width: '100%',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    width: '20%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    
  },
  text: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  
  
});

export default LoginPage;

LoginPage.Js