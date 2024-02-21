import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../FirebaseConfig'; // Import Firebase authentication instance
import styles from './styles';

const SignupPage = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      // Check if passwords match
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }
      
      // Create user with email and password
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);

      // Optionally, you can add additional user information to your Firestore database here
      
      Alert.alert('Success', 'User signed up successfully');
      navigation.navigate('HomeScreen');
    } catch (error) {
      console.error('Signup failed:', error.message);
      Alert.alert('Error', 'Signup failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adopter Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={text => setFirstName(text)}
        value={firstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={text => setLastName(text)}
        value={lastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        onChangeText={text => setMobileNumber(text)}
        value={mobileNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        onChangeText={text => setAddress(text)}
        value={address}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => setEmail(text)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={text => setConfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default SignupPage;
