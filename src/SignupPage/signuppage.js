import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { doc, setDoc } from 'firebase/firestore';
import { auth, db} from '../FirebaseConfig'; // Import Firebase authentication and Firestore instances
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
      await setDoc(doc(db, 'users', userId), userData);
    } catch (error) {
      console.error('Error adding user data to Firestore:', error.message);
      throw error; // Propagate the error to the caller
    }
  };

  const handleSignup = async () => {
    if (email && password && mobileNumber) {
      try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user; // Retrieve the user object
  
        // Add user data to Firestore
        await addUserToFirestore(user.uid, {
          firstName: firstName,
          lastName: lastName,
          mobileNumber: mobileNumber,
          address: address,
          email: email,
        });
  

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
