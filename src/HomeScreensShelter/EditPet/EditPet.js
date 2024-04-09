// EditPet.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../../FirebaseConfig';

const EditPet = ({ navigation, route }) => {
  const { pet } = route.params;
  const [editedPet, setEditedPet] = useState(pet);

  const handleSave = async () => {
    try {
      // Update the pet data in Firestore
      await updateDoc(doc(db, 'pets', pet.id), editedPet);
      // Navigate back to the PetDetails screen with updated pet data
      navigation.navigate('PetDetails', { pet: editedPet });
      console.log('Pet details updated successfully!');
    } catch (error) {
      console.error('Error updating pet details:', error);
      // Handle any errors that occur during update
      Alert.alert('Failed to update pet details. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={editedPet.name}
        onChangeText={name => setEditedPet({ ...editedPet, name })}
        placeholder="Name"
        style={styles.input}
      />
      <TextInput
        value={editedPet.gender}
        onChangeText={gender => setEditedPet({ ...editedPet, gender })}
        placeholder="Gender"
        style={styles.input}
      />
      <TextInput
        value={editedPet.type}
        onChangeText={type => setEditedPet({ ...editedPet, type })}
        placeholder="Type"
        style={styles.input}
      />
      <TextInput
        value={String(editedPet.age)}
        onChangeText={age => setEditedPet({ ...editedPet, age: parseInt(age) })}
        placeholder="Age"
        keyboardType="numeric"
        style={styles.input}
      />
      <TextInput
        value={editedPet.location}
        onChangeText={location => setEditedPet({ ...editedPet, location })}
        placeholder="Location"
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text>Save</Text>
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
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
});

export default EditPet;
