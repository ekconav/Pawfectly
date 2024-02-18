import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//login screens link
import LandingPage from './src/LandingPage/LandingPage';
import LoginPage from './src/Loginpage/LoginPage';
import SignupPage from './src/SignupPage/signuppage';
import ChoosePage from './src/ChoosePage/ChoosePage';
import SignupShelter from './src/SignupShelter/SignupShelter';
import ChooseLogin from './src/ChooseLogin/ChooseLogin';
import LoginPageShelter from './src/LoginPageShelter/LoginPageShelter';

//homepage screens link
import HomeScreen from './src/HomeScreens/HomePage/HomeScreen';
import SettingsPage from './src/HomeScreens/SettingsPage/SettingsPage';


const Stack = createStackNavigator();


const LoginScreens = () => (
  <Stack.Navigator>
    <Stack.Screen name='LandingPage' component={LandingPage} options={{ headerShown: false }} />
    <Stack.Screen name='LoginPage' component={LoginPage} options={{ headerShown: false }} />
    <Stack.Screen name='SignupPage' component={SignupPage} options={{ headerShown: false }} />
    <Stack.Screen name="ChoosePage" component={ChoosePage} options={{ headerShown: false }} />
    <Stack.Screen name='ChooseLogin' component={ChooseLogin} options={{headerShown: false}} />
    <Stack.Screen name='LoginPageShelter' component={LoginPageShelter} options={{headerShown: false}}/>
    <Stack.Screen name="SignupShelter" component={SignupShelter} options={{ headerShown:false}}/>
    <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown: false}}/>  
    </Stack.Navigator>
);

const HomePage = () => (
  <Stack.Navigator>
    <Stack.Screen name='HomeScreen' component={HomeScreen} options={{headerShown: false}}/>
    <Stack.Screen name='SettingsPage' component={SettingsPage} options={{headerShown:false}}/>
  </Stack.Navigator>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='LoginScreens'screenOptions={{ headerShown: false }}>
        <Stack.Screen name='LoginScreens' component={LoginScreens} />
        <Stack.Screen name='HomePage' component={HomePage} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
