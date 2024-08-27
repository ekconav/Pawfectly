// OTPPage.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import navigation hook

const OTPPage = ({ route }) => {
  const { email } = route.params; // Extracting email from route params
  const [otp, setOtp] = useState(''); // State to store OTP input
  const navigation = useNavigation(); // Navigation hook

  // Function to handle OTP verification
  const handleVerifyOTP = () => {
    // Validate OTP (for example, check if it matches a predefined value)
    const predefinedOTP = '123456'; // Define your OTP here
    if (otp === predefinedOTP) {
      // OTP is correct, navigate to LoginPage
      navigation.navigate('LoginPage');
    } else {
      // OTP is incorrect, show an alert
      Alert.alert('', 'Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Enter OTP sent to {email}</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginTop: 20, width: 200 }}
        placeholder="Enter OTP"
        keyboardType="numeric"
        onChangeText={text => setOtp(text)}
        value={otp}
      />
      <TouchableOpacity
        style={{ backgroundColor: 'blue', padding: 10, marginTop: 20 }}
        onPress={handleVerifyOTP}>
        <Text style={{ color: 'white', textAlign: 'center' }}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPPage;
