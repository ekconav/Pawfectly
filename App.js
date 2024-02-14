import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//login screens link
import LandingPage from './src/LandingPage/LandingPage';
import LoginPage from './src/Loginpage/LoginPage';
import SignupPage from './src/SignupPage/signuppage';
import ChoosePage from './src/ChoosePage/ChoosePage';
import SignupShelter from './src/SignupShelter/SignupShelter';

//homepage screens link
import HomePage from './HomeScreens/HomePage/HomeScreen';


const Stack = createStackNavigator();

const LoginScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name='LandingPage' component={LandingPage} options={{ headerShown: false }} />
    <Stack.Screen name='LoginPage' component={LoginPage} options={{ headerShown: false }} />
    <Stack.Screen name='SignupPage' component={SignupPage} options={{ headerShown: false }} />
    <Stack.Screen name="ChoosePage" component={ChoosePage} options={{ headerShown: false }} />
    <Stack.Screen name="SignupShelter" component={SignupShelter} options={{ headerShown:false}}/>  
    </Stack.Navigator>
);

const HomeScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name='HomePage' component={HomePage} options={{headerShown: false}}/>
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <LoginScreens />
      <HomeScreens/>
    </NavigationContainer>
  );
};

export default App;
