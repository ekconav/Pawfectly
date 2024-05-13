import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../FirebaseConfig'; // Import Firebase authentication and Firestore instances
import { createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase authentication method
import styles from './styles';

const SignupPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const addUserToFirestore = async (userId, userData) => {
    try {
      console.log('Firestore DB:', db);
      const userDocRef = doc(db, 'users', userId);
      console.log('User Document Reference:', userDocRef);
      await setDoc(userDocRef, userData);
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
        // Concatenate the email with the user domain
        const userEmail = email.trim() + '@user.com';

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, userEmail, password);
        const user = userCredential.user; // Retrieve the user object

        // Add user data to Firestore
        await addUserToFirestore(user.uid, {
          firstName: firstName,
          lastName: lastName,
          mobileNumber: mobileNumber,
          address: address,
          email: userEmail, // Use the concatenated email
        });

        navigation.navigate('LoginPage');
        Alert.alert('', 'Signup Successful', [
          {
            text: 'OK',
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
      <Text style={styles.title}>Sign Up</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setFirstName(text)}
          value={firstName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setLastName(text)}
          value={lastName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mobile Number</Text>
        <View style={styles.mobileInput}>
          <Text style={styles.countryCode}>+63</Text>
          <TextInput
            style={styles.mobileNumberInput}
            onChangeText={text => setMobileNumber(text)}
            value={mobileNumber}
            keyboardType="phone-pad"
            maxLength={10} // Set maximum length to 10 digits
          />
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setAddress(text)}
          value={address}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <View style={styles.emailInput}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            onChangeText={value => setEmail(value)}
            value={email}
            keyboardType="email-address"
          />
          <Text style={styles.emailSuffix}>@user.com</Text>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={value => setPassword(value)}
          value={password}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          onChangeText={text => setConfirmPassword(text)}
          value={confirmPassword}
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

export default SignupPage;
