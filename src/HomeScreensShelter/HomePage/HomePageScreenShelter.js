import React, { useState, useEffect } from 'react';
import { Dimensions, SafeAreaView, View, Image, TextInput, Text, TouchableOpacity, FlatList, ScrollView, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // or import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '../../const/colors';
import MessagePageShelter from '../MessagePage/MessagePageShelter';
import SettingsPageShelter from '../SettingsPage/SettingsPageShelter';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Addpet from '../AddPet/AddPet';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import { RefreshControl } from 'react-native';


const {height} = Dimensions.get('window');

const Tab = createBottomTabNavigator();

const HomeScreenPet = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPets = async () => {
    try {
      const petsCollection = collection(db, 'pets');
      const petsSnapshot = await getDocs(petsCollection);
      const petsData = petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);
  
  const updatePetsList = async () => {
    try {
      const petsCollection = collection(db, 'pets');
      const petsSnapshot = await getDocs(petsCollection);
      const petsData = petsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPets(petsData);
    } catch (error) {
      console.error('Error updating pet list:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    fetchPets(); // Fetch pets data again
    setRefreshing(false); // Set refreshing state back to false when done
  };

  const handleDelete = async (petId) => {
    try {
      // Filter out the deleted pet from the pets list
      const updatedPets = pets.filter(pet => pet.id !== petId);
      setPets(updatedPets);
    } catch (error) {
      console.error('Error handling delete:', error);
    }
  };
 
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
       <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.mainContainer}>
          <Text style={{ textAlign: 'center', fontSize: 20 }}>LIST OF PETS</Text>
          <View style={{ marginTop: 20 }}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={pets}
              renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('PetDetails', { pet: item, handleDelete })}>
                  <View style={styles.petContainer}>
                    <Image
                      source={{ uri: item.images }}
                      style={styles.petImage}
                    />
                    <Text style={styles.petName}>{item.name}</Text>
                    <View style={styles.genderContainer}>
                      <Icon name={item.gender === 'Male' ? 'gender-male' : 'gender-female'} size={22} color={COLORS.grey} style={styles.genderIcon} />
                      <Text style={styles.genderText}>{item.gender}</Text>
                    </View>
                    <Text style={styles.petType}>{item.type}</Text>
                    <Text style={styles.petAge}>{item.age}</Text>
                    <View style={styles.distanceContainer}>
                      <Icon name="map-marker" color={COLORS.primary} size={18} style={styles.distanceIcon} />
                      <Text style={styles.distanceText}>Distance: 7.8km</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: height,
  },
  petContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 20,
    padding: 10,
  },
  petImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 20,
    marginBottom: 10,
  },
  petName: {
    fontWeight: 'bold',
    color: COLORS.dark,
    fontSize: 20,
  },
  genderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  genderIcon: {
    marginRight: 5,
  },
  genderText: {
    fontSize: 12,
    color: COLORS.dark,
  },
  petType: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.dark,
  },
  petAge: {
    fontSize: 10,
    marginTop: 5,
    color: COLORS.grey,
  },
  distanceContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    marginRight: 5,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.grey,
  },
});


const HomePageScreenShelter = () => (
  <Tab.Navigator>
    <Tab.Screen 
      name="Home" 
      component={HomeScreenPet} 
      options={{ 
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="paw-outline" color={color} size={size} />
        ),
        headerShown: false, 
        tabBarLabel: 'Home'
      }}
    />
    <Tab.Screen
      name='Add'
      component={Addpet}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" color={color} size={size} />
        ),
        headerShown: false,
        tabBarLabel: 'Add Pet'
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
          tabBarLabel: 'Message'}} 
          />
          
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


export default HomePageScreenShelter