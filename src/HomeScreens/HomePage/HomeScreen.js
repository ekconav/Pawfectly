import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList,  ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { collection, getDocs} from 'firebase/firestore';
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

const Tab = createBottomTabNavigator();

const HomeScreen = ({ refresh }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchType, setSearchType] = useState('');
  const [searchAge, setSearchAge] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [profileImageURI, setProfileImageURI] = useState(null); // State to store profile image URI
  const navigation = useNavigation();

  useEffect(() => {
    fetchPets();
  }, [refresh]);

  const fetchPets = async () => {
    try {
      const petsCollectionRef = collection(db, 'pets');
      let queryRef = petsCollectionRef;
    
      // Apply search criteria
      if (searchQuery) {
        // Chain multiple where conditions using logical OR (||)
        queryRef = queryRef.where('name', '==', searchQuery.toLowerCase())
                           .orWhere('type', '==', searchQuery.toLowerCase())
                           .orWhere('gender', '==', searchQuery.toLowerCase())
                           .orWhere('age', '==', searchQuery.toLowerCase())
                           .orWhere('breed', '==', searchQuery.toLowerCase())
                           .orWhere('description', '==', searchQuery.toLowerCase());
      }
    
      const querySnapshot = await getDocs(queryRef);
      const petsData = [];
    
      querySnapshot.forEach((doc) => {
        const petData = doc.data();
        const imageUrl = getDownloadURL(ref(storage, petData.images)).then(url => {
          return url;
        }).catch(error => {
          console.error('Error getting download URL:', error);
          return null;
        });
        petsData.push({ id: doc.id, ...petData, imageUrl });
      });
    
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
  }, []);

  const handleSearch = (searchQuery) => {
    setSearchQuery(searchQuery);
    fetchPets(); // Trigger search by fetching pets with updated search criteria
  };
  const handleProfileImageChange = (uri) => {
    setProfileImageURI(uri); // Update profile image URI in the state
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Find Awesome Pets</Text>
      <SearchBar onSearch={handleSearch} />

<FlatList
  data={pets.filter(pet => 
    pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.age.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pet.description.toLowerCase().includes(searchQuery.toLowerCase())
  )}
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

      {/* Pass the handleProfileImageChange function to SettingsPage */}
      <SettingsPage onProfileImageChange={handleProfileImageChange} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingTop: Platform.OS == "android" ? 40 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 5,
    paddingEnd: 10,
  },

profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 46,
    fontWeight: '400',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  petContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
  },
  petName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
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