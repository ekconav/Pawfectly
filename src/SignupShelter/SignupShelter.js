
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method
import styles from './styles'
import { auth, db } from '../FirebaseConfig';


const SignupShelter = () => {

  const [shelterName, setShelterName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const addShelterToFirestore = async (userId, userData) => {
    try {
      console.log('Firestore DB:', db);
      await setDoc(doc(db, 'shelters', userId), userData);
      console.log('User data added successfully to Firestore');
    } catch (error) {
      console.error('Error adding user data to Firestore:', error.message);
      throw error; // Propagate the error to the caller
    }
  };

  const handleSignup = async () => {
    if (email && password && mobileNumber && confirmPassword) {
      if (password !== confirmPassword) {
        Alert.alert('', 'Passwords do not match. Please try again.');
        return;
      }
      try {
        // Concatenate the email with the shelter domain
        const shelterEmail = email.trim() + '@shelter.com';
  
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, shelterEmail, password);
        const user = userCredential.user; // Retrieve the user object
  
        // Add user data to Firestore
        await addShelterToFirestore(user.uid, {
          shelterName: shelterName,
          mobileNumber: mobileNumber,
          address: address,
          email: shelterEmail, // Use the concatenated email
        });
  
        navigation.navigate('LoginPage')
        Alert.alert('', 'Signup Successful', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('LoginPage')
          },
        ]);
      } catch (error) {
        console.error('Signup Error:', error.message);
        Alert.alert('', 'Error signing up. Please try again.');
      }
    } else {
      Alert.alert('', 'Please fill in all fields.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shelter Signuup</Text>
      <TextInput
        style={styles.input}
        placeholder="Shelter Name"
        onChangeText={text => setShelterName(text)}
        value={shelterName}
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
        onChangeText={value => setEmail(value)}
        value={email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={value => setPassword(value)}
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
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('LoginPage')}>
        <Text style={styles.backButtonText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupShelter;
