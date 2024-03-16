import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomePageScreenShelter from '../HomePage/HomePageScreenShelter';
import SettingsPageShelter from '../SettingsPage/SettingsPageShelter';
import MessagePageShelter from '../MessagePage/MessagePageShelter';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (

    <Tab.Navigator>
    <Tab.Screen 
      name="Home" 
      component={HomePageScreenShelter} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="paw-outline" color={color} size={size} />
        ),
        headerShown: false, 
        tabBarLabel: 'Home'
      }}
    />

      <Tab.Screen
        name='Message'
        component={MessagePageShelter}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" color={color} size={size} />
            ),
          headerShown: false, 
          tabBarLabel: 'Message'}} />
        
      <Tab.Screen 
      name="Settings" 
      component={SettingsPageShelter} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
        headerShown: false, 
        tabBarLabel: 'Settings'}} />
  </Tab.Navigator>

  );
}

export default Tabs;
