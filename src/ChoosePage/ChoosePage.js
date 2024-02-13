import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { containerStyles, buttonStyles } from './styles';

const ChoosePage = ({ navigation }) => {
  const handleAdopterLogin = () => {
    // Navigate to adopter login screen
    navigation.navigate('SignupPage');
  };

  const handleShelterLogin = () => {
    // Navigate to shelter login screen
    navigation.navigate('SignupShelter');
  };

  return (
    <View style={containerStyles.container}>
      <Text style={containerStyles.title}>Choose User Type</Text>
      <TouchableOpacity style={buttonStyles.button} onPress={handleAdopterLogin}>
        <Text style={buttonStyles.buttonText}>Login as Adopter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={buttonStyles.button} onPress={handleShelterLogin}>
        <Text style={buttonStyles.buttonText}>Login as Shelter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChoosePage;
