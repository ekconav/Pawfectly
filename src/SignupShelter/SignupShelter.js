import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import styles from './styles';
import { db, auth } from '../FirebaseConfig';

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
      await setDoc(doc(db, 'shelters', userId), userData);
      console.log('User data added successfully to Firestore');
    } catch (error) {
      console.error('Error adding user data to Firestore:', error.message);
      throw error;
    }
  };

  const handleSignup = async () => {
    if (email && password && mobileNumber && confirmPassword) {
      if (password !== confirmPassword) {
        Alert.alert('', 'Passwords do not match. Please try again.');
        return;
      }
      try {
        const shelterEmail = email.trim() + '@shelter.com';
        const userCredential = await createUserWithEmailAndPassword(auth, shelterEmail, password);
        const user = userCredential.user;

        await addShelterToFirestore(user.uid, {
          shelterName: shelterName,
          mobileNumber: mobileNumber,
          address: address,
          email: shelterEmail,
        });

        navigation.navigate('LoginPage');
        Alert.alert('', 'SignUp Succesful');
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
      <Text style={styles.title}>Welcome Shelter</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Shelter Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setShelterName(text)}
          value={shelterName}
          placeholder="Enter shelter name"
        />
      </View>
      <View style={styles.inputGroupnumber}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.countryCode}>+63</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            onChangeText={text => setMobileNumber(text)}
            value={mobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setAddress(text)}
          value={address}
          placeholder="Enter address"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter email address"
            onChangeText={value => setEmail(value)}
            value={email}
            keyboardType="email-address"
          />
          <Text style={styles.emailSuffix}>@shelter.com</Text>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          onChangeText={value => setPassword(value)}
          value={password}
          secureTextEntry
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
          placeholder="Confirm password"
          secureTextEntry
        />
      </View>
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
