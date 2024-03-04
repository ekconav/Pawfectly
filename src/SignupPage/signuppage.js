import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { auth } from '../FirebaseConfig'; // Import Firebase authentication instance
import { createUserWithEmailAndPassword, signInWithPhoneNumber } from 'firebase/auth'; // Import Firebase authentication methods
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
  const [verificationId, setVerificationId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');

  const navigation = useNavigation();

  const handleSignup = async () => {
    if (email && password && mobileNumber) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert('', 'Signup Successful', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('OTPVerification', { mobileNumber }),
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
  const sendOtp = async () => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, mobileNumber);
      setVerificationId(confirmationResult.verificationId);
      navigation.navigate('OTPVerification'); // Navigate to OTP verification page
    } catch (error) {
      console.log('Error sending OTP:', error.message);
      Alert.alert('Error', 'Failed to send OTP');
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
    </View>
  );
};

export default SignupPage;
