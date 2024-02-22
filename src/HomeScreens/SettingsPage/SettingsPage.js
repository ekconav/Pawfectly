import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';

const SettingsPage = () => {
  const navigation = useNavigation(); // Use useNavigation hook

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
      navigation.navigate('HomeScreen'); // Corrected spelling of 'HomeScreen'
    } catch (error) {
      console.error('Error signing out:', error.message);
    }

  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Logout</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsPage;
