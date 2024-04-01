import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';
import { styles } from './styles';

const SettingsPageShelter = () => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('shelter signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error.message);
    }

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsPageShelter;