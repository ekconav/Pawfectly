import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, storage } from '../../FirebaseConfig';
import { ref, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FavoritesPage from '../Favorites/FavoritesPage';
import MessagePage from '../MessagePage/MessagePage';
import SettingsPage from '../SettingsPage/SettingsPage';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from './SearchBar';
import { RefreshControl } from 'react-native';
import COLORS from '../../const/colors';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ refresh }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchType, setSearchType] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    fetchPets();
  }, [refresh, searchType, searchAge, searchLocation]);

  const fetchPets = async () => {
    try {
      const petsCollectionRef = collection(db, 'pets');
      let queryRef = petsCollectionRef;

      if (searchType) {
        queryRef = query(queryRef, where('type', '==', searchType.toLowerCase()));
      }

      if (searchAge) {
        queryRef = query(queryRef, where('age', '<=', parseInt(searchAge)));
      }

      if (searchLocation) {
        queryRef = query(queryRef, where('location', '==', searchLocation));
      }

      const querySnapshot = await getDocs(queryRef);
      const petsData = [];

      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const petData = doc.data();
        const imageUrl = await getDownloadURL(ref(storage, petData.images));
        petsData.push({ id: doc.id, ...petData, imageUrl });
      }));

      setPets(petsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pet data:', error);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPets();
    setRefreshing(false);
  }, [searchType, searchAge, searchLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Profile Image */}
        <TouchableOpacity onPress={() => navigation.navigate('SettingsPage')}>
          <Image
            source={require('../../components/cat1.png')} // Change the source to your profile image
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
        {/* Title */}
        <Text style={styles.title}>Find Awesome Pets</Text>
      <SearchBar
        searchType={searchType}
        setSearchType={setSearchType}
        searchAge={searchAge}
        setSearchAge={setSearchAge}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
        onSearch={onRefresh} // Pass the onRefresh function to trigger search
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => navigation.navigate('DetailsPage', { pet: item })}>
              <View style={styles.petContainer}>
                <Image source={{ uri: `${item.imageUrl}?time=${new Date().getTime()}` }} style={styles.petImage} />
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petDetails}>{`Type: ${item.type}`}</Text>
                <Text style={styles.petDetails}>{`Gender: ${item.gender}`}</Text>
                <Text style={styles.petDetails}>{`Age: ${item.age}`}</Text>
                <Text style={styles.petDetails}>{`Breed: ${item.breed}`}</Text>
                <Text style={styles.petDetails}>{`Description: ${item.description}`}</Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingTop: Platform.OS == "android"? 50 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginBottom: 20,
    padding: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 46,
    fontWeight: '400',
    marginBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
    flexDirection: 'column', // Change flexDirection to 'column' to stack pet details vertically
    justifyContent: 'flex-start', // Align pet details to the start (top) of the container
    alignItems: 'flex-start', // Align pet details to the start (left) of the container
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    alignSelf: 'center', // Center the pet name horizontally
  },
  petDetails: {
    fontSize: 14,
    marginBottom: 3,
  },
  petImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
});


const App = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: 'Home'
        }}
      >
        {() => <HomeScreen refresh={refresh} />}
      </Tab.Screen>
      <Tab.Screen
        name="Favorites"
        component={FavoritesPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: 'Favorites'
        }}
      />
      <Tab.Screen
        name='Message'
        component={MessagePage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: 'Message'
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: 'Settings'
        }}
      />
    </Tab.Navigator>
  );
}

export default App;