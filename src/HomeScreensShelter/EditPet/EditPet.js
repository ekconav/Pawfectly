import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert, Modal, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { updateDoc, doc } from 'firebase/firestore';
import { db, storage } from '../../FirebaseConfig';
import styles from '../AddPet/styles';

const EditPet = ({ navigation, route }) => {
  const { pet } = route.params;
  const [editedPet, setEditedPet] = useState(pet);
  const [image, setImage] = useState(editedPet.images);
  const [name, setName] = useState(editedPet.name);
  const [description, setDescription] = useState(editedPet.description);
  const [location, setLocation] = useState(editedPet.location);
  const [maleChecked, setMaleChecked] = useState(editedPet.gender === 'Male');
  const [femaleChecked, setFemaleChecked] = useState(editedPet.gender === 'Female');
  const [dogChecked, setDogChecked] = useState(editedPet.type === 'Dog');
  const [catChecked, setCatChecked] = useState(editedPet.type === 'Cat');
  const [age, setAge] = useState(editedPet.age);
  const [breed, setBreed] = useState(editedPet.breed); // Add state for breed
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [breedModalVisible, setBreedModalVisible] = useState(false); // Add state for breed modal visibility

  const petAges = ['0 - 3 Months', '4 - 6 Months', '7 - 9 Months', '10 - 12 Months', '1 - 3 Years Old', '4 - 6 Years Old', '7 Years Old and Above'];
  const dogBreeds = ['Labrador Retriever', 'German Shepherd', 'Golden Retriever']; // Add some sample dog breeds
  const catBreeds = ['Persian', 'Maine Coon', 'Siamese']; // Add some sample cat breeds

  const handleAgeSelection = (selectedAge) => {
    setAge(selectedAge);
    setAgeModalVisible(false);
  };

  const handleBreedSelection = (selectedBreed) => {
    setBreed(selectedBreed);
    setBreedModalVisible(false);
  };

  const handleChooseImage = async () => {
    // Function to choose image from gallery
  };

  const handleSave = async () => {
    // Function to save pet details
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Select Photo</Text>
      <ScrollView>
        <TouchableOpacity style={styles.imageContainer} onPress={handleChooseImage}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.addPhoto}>
              <Ionicons name="camera-outline" size={24} color="black" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.form}>
          <Text style={styles.text}>Name</Text>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.inputField}
          />
          <Text style={styles.text}>Type</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox value={dogChecked} onValueChange={setDogChecked} />
            <Text style={styles.checkboxLabel}>Dog</Text>
            <Checkbox value={catChecked} onValueChange={setCatChecked} />
            <Text style={styles.checkboxLabel}>Cat</Text>
          </View>
          <Text style={styles.text}>Gender</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox value={maleChecked} onValueChange={setMaleChecked} />
            <Text style={styles.checkboxLabel}>Male</Text>
            <Checkbox value={femaleChecked} onValueChange={setFemaleChecked} />
            <Text style={styles.checkboxLabel}>Female</Text>
          </View>
          <Text style={styles.text}>Age</Text>
          <TouchableOpacity style={styles.dropdownButton} onPress={() => setAgeModalVisible(true)}>
            <Text style={styles.dropdownButtonText}>{age || 'Select Age'}</Text>
            <Ionicons name="chevron-down-outline" size={24} color="black" />
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={ageModalVisible}
            onRequestClose={() => setAgeModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {petAges.map((age, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.breedOption}
                    onPress={() => handleAgeSelection(age)}
                  >
                    <Text>{age}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
          {dogChecked || catChecked ? (
            <>
              <Text style={styles.text}>Breed</Text>
              <TouchableOpacity style={styles.dropdownButton} onPress={() => setBreedModalVisible(true)}>
                <Text style={styles.dropdownButtonText}>{breed || 'Select Breed'}</Text>
                <Ionicons name="chevron-down-outline" size={24} color="black" />
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={breedModalVisible}
                onRequestClose={() => setBreedModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    {dogChecked ? (
                      dogBreeds.map((breed, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.breedOption}
                          onPress={() => handleBreedSelection(breed)}
                        >
                          <Text>{breed}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      catBreeds.map((breed, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.breedOption}
                          onPress={() => handleBreedSelection(breed)}
                        >
                          <Text>{breed}</Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </View>
              </Modal>
            </>
          ) : null}
          <Text style={styles.text}>Location</Text>
          <TextInput
            value={location}
            onChangeText={(text) => setLocation(text)}
            style={styles.inputField}
          />
          <Text style={styles.text}>Description</Text>
          <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={styles.inputField}
          />
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditPet;
