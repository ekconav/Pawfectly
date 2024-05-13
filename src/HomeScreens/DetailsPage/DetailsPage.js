import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StatusBar, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import COLORS from '../../const/colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../DetailsPage/styles'

const DetailsPage = ({ route }) => {
  const [petDetails, setPetDetails] = useState(null);
  const navigation = useNavigation(); // Initialize useNavigation hook

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const { pet } = route.params;
        setPetDetails(pet);
      } catch (error) {
        console.error('Error fetching pet details:', error);
      }
    };
  
    fetchPetDetails();
  }, [route.params]);

  const handleAdoption = () => {
    // Implement adoption logic here
    navigation.navigate('MessagePage', { shelterEmail: petDetails.shelterEmail });
    console.log('Adoption button pressed');
  };

  const handleFavorite = async () => {
    try {
      // Retrieve favorite pets from AsyncStorage
      const favoritesJson = await AsyncStorage.getItem('favorites');
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      // Add the current pet to favorites
      const updatedFavorites = [...favorites, petDetails];
      // Update AsyncStorage with the updated favorites
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      console.log('Favorite button pressed');
    } catch (error) {
      console.error('Error adding pet to favorites:', error);
    }
    
    // Navigate to the Favorites tab
    navigation.navigate('Favorites');
  };

  if (!petDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <StatusBar backgroundColor={COLORS.background} />
      <SafeAreaView style={{ flex: 1 }}>
        <Image source={{ uri: petDetails.imageUrl }} style={styles.petImage} />
        {/* Render Header */}
        <View style={styles.header}>
          <Icon name="arrow-left" size={28} color={COLORS.dark} onPress={() => navigation.goBack()} />
          <Icon name="dots-vertical" size={28} color={COLORS.dark} />
        </View>
        <View style={styles.detailsContainer}>

          {/* Render Pet name, description, and breed */}
          <Text style={styles.petName}>Name: {petDetails.name}</Text>
          <Text style={styles.petDescription}>Description: {petDetails.description}</Text>
          <Text style={styles.petBreed}>Breed: {petDetails.breed}</Text>

          {/* Render Pet type and age */}
          <Text style={{ fontSize: 16, color: COLORS.dark, marginBottom: 5 }}>{`Type: ${petDetails.type}`}</Text>
          <Text style={{ fontSize: 16, color: COLORS.dark, marginBottom: 5 }}>{`Gender: ${petDetails.gender}`}</Text>
          <Text style={{ fontSize: 16, color: COLORS.dark, marginBottom: 5 }}>{`Age: ${petDetails.age}`}</Text>

          {/* Render location and icon */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="map-marker" color={COLORS.primary} size={20} />
            <Text style={{ fontSize: 16, color: COLORS.grey, marginLeft: 5 }}>{petDetails.location}</Text>
          </View>
        {/* Adoption button */}
        <TouchableOpacity style={styles.button} onPress={handleAdoption}>
            <Text style={styles.buttonText}>Adoption</Text>
          </TouchableOpacity>

          {/* Favorite button */}
          <TouchableOpacity style={[styles.button, { backgroundColor: COLORS.primary }]} onPress={handleFavorite}>
            <Icon name="heart-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default DetailsPage;
