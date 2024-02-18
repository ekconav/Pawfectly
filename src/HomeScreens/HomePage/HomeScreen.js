import * as React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsPage from '../SettingsPage/SettingsPage';
import MessagePage from '../MessagePage/MessagePage';
import styles from '../HomePage/styles';
import { Ionicons } from '@expo/vector-icons';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  );
}


const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen 
      name="Home" 
      component={HomeScreen} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="paw-outline" color={color} size={size} />
        ),
        headerShown: false, 
        tabBarLabel: 'Home'}}/>

      <Tab.Screen
        name='Message'
        component={MessagePage}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" color={color} size={size} />
            ),
          headerShown: false, 
          tabBarLabel: 'Message'}} />
        
      <Tab.Screen 
      name="Settings" 
      component={SettingsPage} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        headerShown: false, 
        tabBarLabel: 'Settings'}} />

    </Tab.Navigator>
  );
}

export default function App() {
  return (
      <MyTabs />
  );
}
