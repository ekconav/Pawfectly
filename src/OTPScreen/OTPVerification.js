import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { auth } from '../FirebaseConfig'; // Import Firebase authentication instance
import styles from './styles';

const OTPVerification = ({ route }) => {
  const { mobileNumber } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (otp) {
      try {
        // Implement OTP verification logic here
        Alert.alert('', 'OTP verified successfully.');
      } catch (error) {
        console.error('OTP Verification Error:', error.message);
        Alert.alert('', 'Error verifying OTP. Please try again.');
      }
    } else {
      Alert.alert('', 'Please enter OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>Enter OTP sent to {mobileNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        onChangeText={text => setOtp(text)}
        value={otp}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default OTPVerification;