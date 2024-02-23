import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../FirebaseConfig';

const SettingsPage = () => {

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User signed out successfully');
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
