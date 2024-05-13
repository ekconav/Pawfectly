import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { signInWithEmailAndPassword } from 'firebase/auth';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import style from '../Loginpage/style';
import { auth } from '../FirebaseConfig'


const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (email && password) {
    try {
      setLoading(true);
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      
      // Get the user's email
      const userEmail = userCredential.user.email;

      // Check if the user is signing in with @user.com
      if (userEmail.endsWith('@user.com')) {
        console.log('User logged in');
      } 
      // Check if the user is signing in with @shelter.com
      else if (userEmail.endsWith('@shelter.com')) {
        console.log('Shelter logged in');
      } 
      // If the user is signing in with neither @user.com nor @shelter.com
      else {
        console.log('Unknown user logged in');
      }

      // Redirect the user to the appropriate screen based on their email domain
      Alert.alert('', 'Login Sucessful')
      navigation.navigate(userEmail.endsWith('@user.com') ? 'UserStack' : 'ShelterStack');
    } catch (error) {
      setLoading(false);
      console.error('Sign-in Error:', error.message);
      Alert.alert('Oopss!', 'Please Check Your Email and Password');
    }
  } else {
    Alert.alert('Error', 'Please fill in all fields.');
  }
};

  const handleChoosePage = () => {
    navigation.navigate('ChoosePage');
    console.log('User is choosing');
  };

  return (
    <View style={style.container}>
      <Text style={style.title}>Welcome Pawfectly User</Text>

      <Image style={style.image} source={require('../components/pawlogin.png')}/>

      <Text style={style.inputLabel}>Email</Text>
      <TextInput
        style={style.input}
        onChangeText={(value) => setEmail(value)}
        value={email}
      />
      <Text style={style.inputLabel}>Password</Text>
      <TextInput
        style={style.input}
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry
      />  
      <TouchableOpacity style={style.button} onPress={handleLogin}>
        <Text style={style.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={style.subtitle}>Don't have an account yet?{' '}</Text>
  <TouchableOpacity onPress={handleChoosePage}>
    <Text style={style.text}>Sign up here</Text>
  </TouchableOpacity>
    </View>
  );
};

export default LoginPage;