import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingPage from './src/LandingPage/landingpage';
import LoginPage from './src/Loginpage/LoginPage';
import SignupPage from './src/SignupPage/SignupPage'

const Stack = createStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='LandingPage' component={LandingPage} options={{headerShown: false}} />
        <Stack.Screen name='LoginPage' component={LoginPage} options={{headerShown: false}} />
        <Stack.Screen name='SignupPage' component={SignupPage} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
