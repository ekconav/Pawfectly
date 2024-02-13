import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import style from '../Loginpage/style';


const LoginPage = () => {
  const navigation = useNavigation();
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


  const handleChoosePage = () => {
    navigation.navigate('ChoosePage');
    console.log('user is choosing..');
  }


  return (

    <View style={style.container}>
      <Text style={style.title}>LOGIN</Text>

      <TextInput
        style={style.input}
        placeholder="Username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />

      <TextInput
        style={style.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />  
      <Text>
      Don't have an account yet?{''}
        <TouchableOpacity onPress={handleChoosePage}>
          <Text style={style.text}>Sign up here</Text>
        </TouchableOpacity>
        </Text>

      <TouchableOpacity style={style.button} onPress={handleLogin}>
        <Text style={style.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginPage;

LoginPage.Js