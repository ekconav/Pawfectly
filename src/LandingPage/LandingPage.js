import React from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native'; 
import styles from '../LandingPage/styles';
import COLORS from '../const/colors';


const LandingPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>PAWFECTLY ADAPTABLE</Text>
      <View style={styles.imageContainer}>
      <Image style={styles.image} source={require('../components/clipart.png')} />
      </View>
      <Text style={styles.subtitle}>
        <Text style={styles.boldText}>Find Your New Friends Today</Text>
        {'\n'}
        Make your life happier with us {'\n'}
        Have a few new friends
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('LoginPage')}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LandingPage;
