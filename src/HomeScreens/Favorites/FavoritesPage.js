import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import COLORS from '../../const/colors';

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);

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

  // Render item for FlatList
  const renderFavoriteItem = ({ item }) => (
    <View style={styles.item}>
       <Image source={item.image} style={styles.image} resizeMode="cover" />

      <Text style={styles.itemText}>Name: {item.name}</Text>
      <Text style={styles.itemText}>Type: {item.type}</Text>
      <Text style={styles.itemText}>Age: {item.age}</Text>
      <Text style={styles.itemText}>Location: {item.location}</Text>
      {/* Add more details as needed */}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Pets</Text>
      <FlatList
        data={favoritePets}
        renderItem={renderFavoriteItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
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
    width: '50%', // Adjust the width as needed
    height: 200, // Adjust the height as needed
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default FavoritesPage;
