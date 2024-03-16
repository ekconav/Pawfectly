// ShelterStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import your shelter screens
import HomePageScreenShelter from './HomeScreensShelter/HomePage/HomePageScreenShelter';
import MessagePageShelter from './HomeScreensShelter/MessagePage/MessagePageShelter';
import SettingsPageShelter from './HomeScreensShelter/SettingsPage/SettingsPageShelter';
import SignupShelter from './SignupShelter/SignupShelter';
import LoginPageShelter from './LoginPageShelter/LoginPageShelter';

const Stack = createStackNavigator();

const ShelterStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomePageScreenShelter" headerShown={false}>
      <Stack.Screen name="HomePageScreenShelter" component={HomePageScreenShelter} options={{headerShown: false}}/>
      <Stack.Screen name="MessagePageShelter" component={MessagePageShelter} options={{headerShown: false}}/>
      <Stack.Screen name="SettingsPageShelter" component={SettingsPageShelter} options={{headerShown: false}} />
    </Stack.Navigator>
  );
};

export default ShelterStack;
