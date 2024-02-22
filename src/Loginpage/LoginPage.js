import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method
import { Auth } from 'firebase/auth';
import style from '../Loginpage/style';

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = async () => {
    if(email && password ) {
      try{
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('', 'Login Sucessfull')
      }catch(error){
        console.log('got eeror', error.message)
      }
    }
    navigation.navigate('HomeScreen')
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
        onChangeText={(value) => setEmail(value)}
        value={email}
      />

      <TextInput
        style={style.input}
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
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
