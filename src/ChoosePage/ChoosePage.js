import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../ChoosePage/styles';

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
    <View style={styles.container}>
      <Image
        source={require('../components/meow.png')} // Corrected image path
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAdopterLogin}>
          <Text style={styles.buttonText}>Signup as Adopter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleShelterLogin}>
          <Text style={styles.buttonText}>Signup as Shelter</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChoosePage;
