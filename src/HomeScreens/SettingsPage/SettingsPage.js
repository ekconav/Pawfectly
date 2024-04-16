import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';

const SettingsPage = ({ onProfileImageChange }) => {
  const [profileImage, setProfileImage] = useState(require('../../components/cat1.png'));
  const navigation = useNavigation();

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage({ uri: result.uri });
        onProfileImageChange(result.uri); // Call the onProfileImageChange function
        navigation.navigate('Home', { profileImageURI: result.uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
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
      <TouchableOpacity onPress={handlePickImage}>
        <Image source={profileImage} style={styles.profileImage} />
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
