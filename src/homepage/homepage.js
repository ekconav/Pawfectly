import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native'; 
import styles from '../Homepage/styles';

const HomePage = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text >PAWFECTLY</Text>
      <Text >ADAPTABLE</Text>
    
      <Image
        source={require('../components/dog.jpg')}
        style={styles.image}
      />
    <Text style={{ textAlign: 'center' }}>
    <Text style={{ fontWeight: 'bold' }}>Find Your New Friends Today</Text> {'\n'}
      Make your life more happy with us {'\n'}
      Have a few new friends
    </Text>
          
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginPage')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomePage;
