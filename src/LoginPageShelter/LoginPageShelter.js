import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method
import styles from './style'; // Assuming you have separate styles for your login page
import { auth } from '../FirebaseConfig';

const LoginPageShelter = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shelterAuthenticated, setShelterAuthenticated] = useState(false);

  const handleLogin = async () => {
    if(email && password ) {
      try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const uid = user.uid; // Get the UID of the authenticated user
        Alert.alert('', 'Login Sucessfull')
        setShelterAuthenticated(true);
        navigation.navigate('HomePageScreenShelter');
      }catch(error){
        console.log('got error', error.message)
        Alert.alert('', 'Incorrect')
      }
    }
  };

  const handleSignupNavigation = () => {
    navigation.navigate('SignupShelter');
    console.log('Shelter signing up');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shelter Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(value) => setEmail(value)}
        value={email}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <Text>
        Don't have an account yet?{' '}
        <TouchableOpacity onPress={handleSignupNavigation}>
          <Text style={styles.text}>Sign up here</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

export default LoginPageShelter;
