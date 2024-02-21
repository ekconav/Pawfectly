import * as React from 'react';
import { SafeAreaView, TextInput,Text, TouchableOpacity, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SettingsPage from '../SettingsPage/SettingsPage';
import MessagePage from '../MessagePage/MessagePage';
import { Ionicons } from '@expo/vector-icons';
import CarouselCards from '../../Carousel/CarouselCards';
import SearchBar from './SearchBar';
import styles from './styles'

function HomeScreen() {
  const [search, setSearch] = React.useState('');

  const updateSearch = (text) => {
    setSearch(text);
  };

  return (
    
      <View style={{ backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 110 }}>
        <SearchBar/>
        <View style={styles.header}>
        <Text style={styles.headerText}>Adopt Pet</Text>
        <TouchableOpacity onPress={() => console.log('See All pressed')}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
        <CarouselCards />

    </View>
  );
}


const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator style={styles.container}>
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

