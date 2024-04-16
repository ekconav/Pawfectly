import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, RefreshControl } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../const/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const handleDelete = async (id) => {
    try {
      // Filter out the pet with the given id
      const updatedFavorites = favoritePets.filter((pet) => pet.id !== id);
      // Update the favorites state
      setFavoritePets(updatedFavorites);
      // Update AsyncStorage with the updated favorites
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      console.log('Favorite Pet Deleted');
    } catch (error) {
      console.error('Error deleting favorite pet:', error);
    }
  };

  useEffect(() => {
    const getFavoritePets = async () => {
      try {
        // Retrieve favorite pets from AsyncStorage
        const favoritesJson = await AsyncStorage.getItem('favorites');
        const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
        setFavoritePets(favorites);
      } catch (error) {
        console.error('Error retrieving favorite pets:', error);
      }
    };

    // Call the function to get favorite pets when the component mounts
    getFavoritePets();
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Call the function to fetch favorite pets again
    fetchFavoritePets();
    setRefreshing(false);
  }, []);

  // Function to fetch favorite pets again
  const fetchFavoritePets = async () => {
    try {
      // Retrieve favorite pets from AsyncStorage
      const favoritesJson = await AsyncStorage.getItem('favorites');
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      setFavoritePets(favorites);
    } catch (error) {
      console.error('Error retrieving favorite pets:', error);
    }
  };

  // Render item for FlatList
  const renderFavoriteItem = ({ item }) => (
    <Swipeable renderRightActions={() => (
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Ionicons name="trash-bin" size={24} color={COLORS.white} />
      </TouchableOpacity>
    )}>
      <TouchableOpacity onPress={() => navigation.navigate('DetailsPage', { pet: item })}>
        <View style={styles.item}>
          <Image 
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
            onError={(error) => console.error('Error loading image:', error)}
          />
          <Text style={styles.itemText}>Name: {item.name}</Text>
          <Text style={styles.itemText}>Type: {item.type}</Text>
          <Text style={styles.itemText}>Breed: {item.breed}</Text>
          <Text style={styles.itemText}>Age: {item.age}</Text>
          <Text style={styles.itemText}>Location: {item.location}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Pets</Text>
      <FlatList
        data={favoritePets}
        renderItem={renderFavoriteItem}
        keyExtractor={(item, index) => index.toString()} // Use index as key if id is undefined
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} // Add RefreshControl
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  list: {
    flexGrow: 1,
  },
  item: {
    backgroundColor: COLORS.white,
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: COLORS.red,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 10,
  },
});

export default FavoritesPage;
