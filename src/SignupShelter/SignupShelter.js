import React, { useState } from 'react';
import { View, Text, TextInput, Button, TouchableOpacity } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, firestore, storage } from '../FirebaseConfig';
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
  const [idDocument, setIdDocument] = useState(null);

  const handleSignup = async () => {
    if (!email || !password || !name || !address || !mobileNumber || !confirmPassword || !businessPermit || !mayorsPermit || !idDocument) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const shelterCredential = await createUserWithEmailAndPassword(auth, email, password);
      const shelters = shelterCredential.shelter;

      const shelterData = {
        name,
        email,
        address,
        mobileNumber,
        // Add other data as needed
      };

      // Upload documents to Firebase Storage and get their URLs
      const businessPermitUrl = await uploadToFirebaseStorage(businessPermit, 'businessPermit');
      const mayorsPermitUrl = await uploadToFirebaseStorage(mayorsPermit, 'mayorsPermit');
      const idDocumentUrl = await uploadToFirebaseStorage(idDocument, 'idDocument');

      // Add shelter data to Firestore
      await addShelterToFirestore(shelterData, businessPermitUrl, mayorsPermitUrl, idDocumentUrl);

      console.log('Signup successful:', shelters.uid);
    } catch (error) {
      console.error('Signup error:', error.message);
      alert('Error signing up. Please try again.');
    }
  };

  const pickDocument = async (documentType) => {
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
      } else if (result.type === 'cancel') {
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
        const fileName = document.name || `file_${Date.now()}`; // Use a timestamp if the document name is not available
        const ref = storage.ref().child(`shelter_documents/${documentType}/${fileName}`);
        await ref.put(blob);
        const downloadURL = await ref.getDownloadURL();
        return downloadURL;
      } else {
        console.log('No document selected');
        return null;
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      return null;
    }
  };

  const addShelterToFirestore = async (shelterData, businessPermitUrl, mayorsPermitUrl, idDocumentUrl) => {
    try {
      const shelterRef = await addDoc(collection(firestore, 'shelters'), {
        ...shelterData,
        businessPermitUrl,
        mayorsPermitUrl,
        idDocumentUrl,
      });
      console.log('Shelter added with ID:', shelterRef.id);
    } catch (error) {
      console.error('Error adding shelter to Firestore:', error.message);
      throw error;
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
