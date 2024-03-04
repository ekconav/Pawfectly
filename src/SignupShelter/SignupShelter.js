import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { storage } from '../FirebaseConfig'
import styles from './styles';

const SignupShelter = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [businessPermit, setBusinessPermit] = useState(null);
  const [mayorsPermit, setMayorsPermit] = useState(null);
  const [idDocument, setIdDocument] = useState(null)

  const handleSignup = async () => {
    // You can handle signup logic here, such as sending the data to your backend

    console.log('Signing up...');
    // You can perform validation and further processing here

    if (!email || !password || !name || !address || !mobileNumber || !confirmPassword || !businessPermit || !mayorsPermit || !idDocument) {
      console.log('One or more fields are empty');
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const businessPermitUrl = await uploadToFirebaseStorage(businessPermit);
    const mayorsPermitUrl = await uploadToFirebaseStorage(mayorsPermit);
    const idDocumentUrl = await uploadToFirebaseStorage(idDocument);

    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
    console.log('Address:', address);
    console.log('Mobile Number:', mobileNumber);
    console.log('Business Permit URL:', businessPermitUrl);
    console.log("Mayor's Permit URL:", mayorsPermitUrl);
    console.log('ID Document URL:', idDocumentUrl);
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (result.type === 'success') {
        if (result.uri) {
          // Set the document state based on the document type
          switch (documentType) {
            case 'businessPermit':
              setBusinessPermit(result);
              break;
            case 'mayorsPermit':
              setMayorsPermit(result);
              break;
            case 'idDocument':
              setIdDocument(result);
              break;
            default:
              console.log('Invalid document type');
          }
        } else {
          console.log('No document URI found');
        }
      } else {
        console.log('Document picking cancelled');
      }
    } catch (err) {
      console.log('Document picker error:', err);
    }
  };

  const uploadToFirebaseStorage = async (document, documentType) => {
    try {
      if (document) {
        const response = await fetch(document.uri);
        const blob = await response.blob();
        const ref = storage.ref().child(`shelter_documents/${documentType}/${document.name}`);
        await ref.put(blob);
        return ref.getDownloadURL();
      } else {
        console.log('No document selected');
        return null;
      }
    } catch (error) {
      console.error('Error uploading document:', error.message);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shelter Signup</Text>
      <TextInput
        style={styles.input}
        placeholder="Shelter Name"
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
      <TouchableOpacity style={styles.button} onPress={() => pickDocument('businessPermit')}>
        <Text style={styles.buttonText}>Upload Business Permit</Text>
      </TouchableOpacity>
      <TouchableOpacity  style={styles.button} onPress={() => pickDocument('mayorsPermit')}>
        <Text style={styles.buttonText}>Upload Mayor's Permit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => pickDocument('idDocument')}>
        <Text style={styles.buttonText}>Upload ID</Text>
      </TouchableOpacity>
     <Button title="Sign Up" onPress={handleSignup} />
    </View>
  );
};

export default SignupShelter;
