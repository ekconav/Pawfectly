import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingPage from './src/LandingPage/LandingPage';
import LoginPage from './src/Loginpage/LoginPage';
import SignupPage from './src/SignupPage/signuppage'
import ChoosePage from './src/ChoosePage/ChoosePage';
import SignupShelter from './src/SignupShelter/SignupShelter';

const Stack = createStackNavigator();


const App = () => {
  return (
    // Basic Screens
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='LandingPage' component={LandingPage} options={{headerShown: false}} />
        <Stack.Screen name='LoginPage' component={LoginPage} options={{headerShown: false}} />      
        <Stack.Screen name='SignupPage' component={SignupPage} options={{headerShown: false}}/>
        <Stack.Screen name="ChoosePage" component={ChoosePage} options={{headerShown: false}} />
        <Stack.Screen name="SignupShelter" component={SignupShelter} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
