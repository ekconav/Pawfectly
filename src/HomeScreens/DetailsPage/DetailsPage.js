import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import COLORS from "../../const/colors";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../DetailsPage/styles";
import { db } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const DetailsPage = ({ route }) => {
  const [petDetails, setPetDetails] = useState(null);
  const navigation = useNavigation(); // Initialize useNavigation hook

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const { pet } = route.params;
        const shelterRef = doc(db, "shelters", pet.userId);
        const docSnap = await getDoc(shelterRef);

        if (!docSnap.exists()) {
          console.log("No such document!");
        } else {
          console.log("Document data: ", docSnap.data());
          pet.shelterName = docSnap.data().shelterName;
          pet.location = docSnap.data().address;
        }
        setPetDetails(pet);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPetDetails();
  }, [route.params]);

  const handleAdoption = () => {
    // Implement adoption logic here
    navigation.navigate("MessagePage", {
      shelterEmail: petDetails.shelterEmail,
    });
    console.log("Adoption button pressed");
  };

  const handleFavorite = async () => {
    try {
      // Retrieve favorite pets from AsyncStorage
      const favoritesJson = await AsyncStorage.getItem("favorites");
      const favorites = favoritesJson ? JSON.parse(favoritesJson) : [];
      // Add the current pet to favorites
      const updatedFavorites = [...favorites, petDetails];
      // Update AsyncStorage with the updated favorites
      await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      Alert.alert("Succesful", "Pet Added to Favorites");
      console.log("Favorite button pressed");
    } catch (error) {
      console.error("Error adding pet to favorites:", error);
    }

    // Navigate to the Favorites tab
    navigation.navigate("Favorites");
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
        <View style={{ flex: 1 }}>
          {/* Render Pet Image with back arrow */}
          <View style={styles.container}>
            <Image
              source={{ uri: petDetails.imageUrl }}
              style={styles.petImage}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.overlayButton}
            >
              <Icon name="arrow-left" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          {/* Render Pet Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.petName}>Name: {petDetails.name}</Text>
            <Text style={styles.petBreed}>Breed: {petDetails.breed}</Text>
            <Text style={styles.petDetail}>{`Type: ${petDetails.type}`}</Text>
            <Text
              style={styles.petDetail}
            >{`Gender: ${petDetails.gender}`}</Text>
            <Text style={styles.petDetail}>{`Age: ${petDetails.age}`}</Text>
            <Text
              style={styles.petDetail}
            >{`Location: ${petDetails.location}`}</Text>
            <Text
              style={styles.petDetail}
            >{`Description: ${petDetails.description}`}</Text>
            <Text
              style={{ fontSize: 16, color: COLORS.dark, marginBottom: 90 }}
            >{`Shelter Name: ${petDetails.shelterName}`}</Text>
            {/* Adoption and Favorite buttons */}
            <View style={styles.buttonContainer}>
              {/* Favorite button */}
              <TouchableOpacity
                style={[styles.button, styles.favoriteButton]}
                onPress={handleFavorite}
              >
                <Icon name="heart-outline" size={20} color={COLORS.white} />
              </TouchableOpacity>
              {/* Adoption button */}
              <TouchableOpacity
                style={[styles.button, styles.adoptionButton]}
                onPress={handleAdoption}
              >
                <Text style={styles.buttonText}>Adoption</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaView>
  );
};

export default DetailsPage;
