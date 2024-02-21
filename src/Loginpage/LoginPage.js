import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method
import style from '../Loginpage/style';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const auth = getAuth;

  const handleLogin = async () => {
    setLoading(true)
    try {
      if (!email.trim() || !password.trim()) {
        // Display an alert if username or password is empty
        Alert.alert('Error', 'Username and password are required.');
        return;
      }
      const userCredential = await signInWithEmailAndPassword(auth,email,password);
      const user = userCredential.user;
      console.log('User logged in:', user.uid);
    
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Login failed:', error.message);
      Alert.alert('Error', 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChoosePage = () => {
    navigation.navigate('SignupPage');
    console.log('adopter signing up');
  };

  return (
    <View style={style.container}>
      <Text style={style.title}>LOGIN</Text>

      <TextInput
        style={style.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        style={style.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        autoCapitalize='none'
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
