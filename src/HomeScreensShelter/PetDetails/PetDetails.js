import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import styles from "./styles";

const PetDetails = ({ navigation, route }) => {
  const [petDetails, setPetDetails] = useState(null);
  const [location, setLocation] = useState(null); // for fetching the shelter address
  const { pet } = route.params;

  useEffect(() => {
    const fetchPetDetails = () => {
      try {
        const petRef = doc(db, "pets", pet.id);
        const unsubscribePet = onSnapshot(petRef, (docSnap) => {
          if (!docSnap.exists()) {
            console.log("No such document");
          } else {
            console.log("Document data: ", docSnap.data());
            setPetDetails(docSnap.data());
          }
        });

        const shelterRef = doc(db, "shelters", pet.userId);
        const unsubscribeShelter = onSnapshot(shelterRef, (docSnap) => {
          if (!docSnap.exists()) {
            console.log("No such document");
          } else {
            console.log("Document data: ", docSnap.data());
            setLocation(docSnap.data().address);
          }
        });

        // Clean up the listeners when the component unmounts
        return () => {
          unsubscribePet();
          unsubscribeShelter();
        };
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };
    fetchPetDetails();
  }, [route.params]);

  const handleEditPress = () => {
    navigation.navigate("EditPet", { pet });
  };

  const handleDeletePress = async () => {
    const { id } = pet; // Assuming the identifier for the pet document is stored in the 'id' field
    try {
      await deleteDoc(doc(db, "pets", id));
      navigation.goBack();
      console.log("Pet deleted successfully!");
    } catch (error) {
      console.error("Error deleting pet:", error);
      Alert.alert("Failed to delete pet. Please try again.");
    }
  };

  if (!petDetails) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: petDetails.images }}
        style={styles.petImage}
        onError={(error) => console.error("Error loading image:", error)}
      />
      <Text>Name: {petDetails.name}</Text>
      <Text>Type: {petDetails.type}</Text>
      <Text>Gender: {petDetails.gender}</Text>
      <Text>Age: {petDetails.age}</Text>
      <Text>Breed: {petDetails.breed}</Text>
      <Text>Location: {location}</Text>
      <Text>Description: {petDetails.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleEditPress} style={styles.button}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleDeletePress} style={styles.button}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PetDetails;
