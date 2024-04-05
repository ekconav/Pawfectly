import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';
import styles from './styles';

const PetDetails = ({ navigation, route }) => {
  const { pet } = route.params;

  const handleEditPress = () => {
    navigation.navigate('EditPet', { pet });
  };

  const handleDeletePress = async () => {
    const { id } = pet; // Assuming the identifier for the pet document is stored in the 'id' field
    try {
      await deleteDoc(doc(db, 'pets', id));
      navigation.goBack();
      console.log('Pet deleted successfully!');
    } catch (error) {
      console.error('Error deleting pet:', error);
      Alert.alert('Failed to delete pet. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: pet.images }}
        style={styles.petImage}
        onError={(error) => console.error('Error loading image:', error)}
      />
      <Text>Name: {pet.name}</Text>
      <Text>Type: {pet.type}</Text>
      <Text>Gender: {pet.gender}</Text>
      <Text>Age: {pet.age}</Text>
      <Text>Breed: {pet.breed}</Text>
      <Text>Location: {pet.location}</Text>
      <Text>Description: {pet.description}</Text>
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