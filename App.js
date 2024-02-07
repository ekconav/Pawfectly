// App.js
import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomePage from './src/Homepage/Homepage';
import LoginPage from './src/Loginpage/LoginPage';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="HomePage">
        <Stack.Screen name='Homepage' component={HomePage} options={{headerShown: false}} />
        <Stack.Screen name='LoginPage' component={LoginPage} options={{headerShown: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
