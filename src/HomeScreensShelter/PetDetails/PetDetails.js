import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

const PetDetails = ({ navigation, route }) => {
  const { pet, handleEdit, handleDelete } = route.params;

  const handleEditPress = async () => {
    // Navigate to the EditPet screen with pet data
    navigation.navigate('EditPet', { pet });
  };

  
  const handleDeletePress = async () => {
    try {
      // Delete pet data from Firestore
      await deleteDoc(doc(db, 'pets', pet.id));
      // Call the handleDelete function passed from the parent component to update the local state
      handleDelete(pet.id);
      // Optionally, navigate back to the home screen or show a success message
      navigation.goBack(); // Navigate back to the home screen
      console.log('Pet deleted successfully!');
    } catch (error) {
      console.error('Error deleting pet:', error);
      console.log(route.params);
      // Handle any errors that occur during deletion
      Alert.alert('Failed to delete pet. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Render pet details */}
      <Text>Name: {pet.name}</Text>
      <Text>Gender: {pet.gender}</Text>
      <Text>Type: {pet.type}</Text>
      <Text>Age: {pet.age}</Text>
      <Text>Location: {pet.location}</Text>

      {/* Edit and delete buttons */}
      <TouchableOpacity onPress={handleEditPress} style={styles.button}>
        <Text>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleDeletePress} style={styles.button}>
        <Text>Delete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default PetDetails;
