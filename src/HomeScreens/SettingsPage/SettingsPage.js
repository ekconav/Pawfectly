import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { auth, db, storage } from '../../FirebaseConfig';
import styles from './styles';

const SettingsPage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const userDocRef = db.collection('profImages').doc(user.uid);
      const userDoc = await userDocRef.get();
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.profileImageURL) {
          setProfileImage(data.profileImageURL);
        }
      }
    } catch (error) {
      console.error('Error fetching profile image URL:', error);
    }
  };

  const handlePickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        console.log('Permission to access camera roll is required!');
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        await uploadProfileImage(pickerResult.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error.message);
    }
  };

  const uploadProfileImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const ref = storage.ref().child(`profileImages/${user.uid}`);
      await ref.put(blob);

      const downloadURL = await ref.getDownloadURL();
      setProfileImage(downloadURL);

      // Update user profile in Firestore with the image URL
      await db.collection('profImages').doc(user.uid).set({
        profileImageURL: downloadURL,
      }, { merge: true });
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.addPhoto}>
            <Text style={styles.addPhotoText}>Add Photo</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Text style={styles.optionText}>About</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Text style={styles.optionText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Text style={styles.optionText}>Terms & Conditions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer}>
        <Text style={styles.optionText}>Delete Account</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsPage;
