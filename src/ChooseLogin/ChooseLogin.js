import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { containerStyles, buttonStyles } from './styles';

const ChooseLogin = ({ navigation }) => {
  const handleAdopterLogin = () => {
    // Navigate to adopter login screen
    navigation.navigate('LoginPage');
  };

  const handleShelterLogin = () => {
    // Navigate to shelter login screen
    navigation.navigate('LoginPageShelter');
  };

  return (
    <View style={containerStyles.container}>
      <TouchableOpacity style={buttonStyles.button} onPress={handleAdopterLogin}>
        <Text style={buttonStyles.buttonText}>Login as Adopter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={buttonStyles.button} onPress={handleShelterLogin}>
        <Text style={buttonStyles.buttonText}>Login as Shelter</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseLogin;
