import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import styles from './styles';

const SignupShelter = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [document, setDocument] = useState(null);

  const handleSignup = () => {
    // You can handle signup logic here, such as sending the data to your backend

    console.log('Signing up...');
    // You can perform validation and further processing here

    if (!email || !password || !name || !address || !contactInfo || !document) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Address:', address);
    console.log('Mobile Number:', mobileNumber);
    console.log('Document:', document);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        setDocument(result);
      }
    } catch (err) {
      console.log('Document picker error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shelter Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        value={mobileNumber}
        onChangeText={setMobileNumber}
        keyboardType="phone-pad"
      />
       <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={pickDocument}>
        <Text style={styles.buttonText}>Upload Document</Text>
      </TouchableOpacity>
      {document && <Text style={styles.documentName}>{document.name}</Text>}
      <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

export default SignupShelter;
