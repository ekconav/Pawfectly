import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native'; 
import style from '../LoginPageShelter/style';


const LoginPageShelter = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  

  const handleLogin = async () => {
    if(email && password ) {
      try{
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert('', 'Login Sucessfull')
      }catch(error){
        console.log('got error', error.message)
        Alert.alert('', 'Incorrect')
      }
    }
  };

  const handleChoosePage = () => {
    navigation.navigate('SignupShelter');
    console.log('shelter signing up');

  }

  return (

    <View style={style.container}>
      <Text style={style.title}>Welcome Shelter</Text>

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

export default LoginPageShelter;
