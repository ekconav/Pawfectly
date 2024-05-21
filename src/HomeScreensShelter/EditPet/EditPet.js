import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { updateDoc, doc } from "firebase/firestore";
import { db, storage } from "../../FirebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "../AddPet/styles";

const EditPet = ({ navigation, route }) => {
  const { pet } = route.params;
  const [editedPet, setEditedPet] = useState(pet);

  const [image, setImage] = useState(editedPet.images);
  const [name, setName] = useState(editedPet.name);
  const [gender, setGender] = useState(editedPet.gender);
  const [type, setType] = useState(editedPet.type);
  const [description, setDescription] = useState(editedPet.description);
  const [age, setAge] = useState(editedPet.age);
  const [breed, setBreed] = useState(editedPet.breed); // Add state for breed
  const [ageModalVisible, setAgeModalVisible] = useState(false);
  const [breedModalVisible, setBreedModalVisible] = useState(false); // Add state for breed modal visibility
  const [customBreed, setCustomBreed] = useState(""); // State for custom breed input

  const petAges = [
    "0 - 3 Months",
    "4 - 6 Months",
    "7 - 9 Months",
    "10 - 12 Months",
    "1 - 3 Years Old",
    "4 - 6 Years Old",
    "7 Years Old and Above",
  ];
  const dogBreeds = [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
  ]; // Add some sample dog breeds
  const catBreeds = ["Persian", "Maine Coon", "Siamese"]; // Add some sample cat breeds

  const handleAgeSelection = (selectedAge) => {
    setAge(selectedAge);
    setAgeModalVisible(false);
  };

  const handleBreedSelection = (selectedBreed) => {
    setBreed(selectedBreed);
    setBreedModalVisible(false);
  };

  const handleChooseImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Ensure you're accessing the correct URI
    }
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(storage, `pets/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim() || !age || !breed) {
      Alert.alert("Validation Error", "Please fill all the required fields.");
      return;
    }

    let imageUrl = image;

    if (image !== editedPet.images) {
      try {
        imageUrl = await uploadImage(image);
      } catch (error) {
        Alert.alert("Error", "Failed to upload image. Please try again.");
        return;
      }
    }

    const updatedPet = {
      age,
      breed,
      description,
      gender,
      images: imageUrl,
      name,
      type,
    };

    try {
      await updateDoc(doc(db, "pets", editedPet.id), updatedPet);
      Alert.alert("Success", "Pet information updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Failed to update pet information:", error);
      Alert.alert(
        "Error",
        "Failed to update pet information. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Select Photo</Text>
      <ScrollView>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={handleChooseImage}
        >
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
            <Checkbox
              value={type === "Dog"}
              onValueChange={(newValue) => setType(newValue ? "Dog" : "Cat")}
            />
            <Text style={styles.checkboxLabel}>Dog</Text>
            <Checkbox
              value={type === "Cat"}
              onValueChange={(newValue) => setType(newValue ? "Cat" : "Dog")}
            />
            <Text style={styles.checkboxLabel}>Cat</Text>
          </View>
          <Text style={styles.text}>Gender</Text>
          <View style={styles.checkboxContainer}>
            <Checkbox
              value={gender === "Male"}
              onValueChange={(newValue) =>
                setGender(newValue ? "Male" : "Female")
              }
            />
            <Text style={styles.checkboxLabel}>Male</Text>
            <Checkbox
              value={gender === "Female"}
              onValueChange={(newValue) =>
                setGender(newValue ? "Female" : "Male")
              }
            />
            <Text style={styles.checkboxLabel}>Female</Text>
          </View>
          <Text style={styles.text}>Age</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setAgeModalVisible(true)}
          >
            <Text style={styles.dropdownButtonText}>{age || "Select Age"}</Text>
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
          {(type === "Dog" || type === "Cat") && (
            <>
              <Text style={styles.text}>Breed</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setBreedModalVisible(true)}
              >
                <Text style={styles.dropdownButtonText}>
                  {breed || "Select Breed"}
                </Text>
                <Ionicons name="chevron-down-outline" size={24} color="black" />
              </TouchableOpacity>
              {type === "Dog" && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={breedModalVisible}
                  onRequestClose={() => setBreedModalVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      {dogBreeds.map((breed, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.breedOption}
                          onPress={() => handleBreedSelection(breed)}
                        >
                          <Text>{breed}</Text>
                        </TouchableOpacity>
                      ))}
                      <TextInput
                        placeholder="Specify"
                        value={customBreed}
                        onChangeText={(text) => setCustomBreed(text)}
                        style={styles.inputField}
                      />
                      <TouchableOpacity
                        style={styles.okButton}
                        onPress={() => {
                          handleBreedSelection(customBreed); // Set custom breed value
                          setCustomBreed(""); // Clear the custom breed input
                          setBreedModalVisible(false); // Close the modal
                        }}
                      >
                        <Text style={styles.okButtonText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
              {type === "Cat" && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={breedModalVisible}
                  onRequestClose={() => setBreedModalVisible(false)}
                >
                  <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                      {catBreeds.map((breed, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.breedOption}
                          onPress={() => handleBreedSelection(breed)}
                        >
                          <Text>{breed}</Text>
                        </TouchableOpacity>
                      ))}
                      <TextInput
                        placeholder="Specify"
                        value={customBreed}
                        onChangeText={(text) => setCustomBreed(text)}
                        style={styles.inputField}
                      />
                      <TouchableOpacity
                        style={styles.okButton}
                        onPress={() => {
                          handleBreedSelection(customBreed); // Set custom breed value
                          setCustomBreed(""); // Clear the custom breed input
                          setBreedModalVisible(false); // Close the modal
                        }}
                      >
                        <Text style={styles.okButtonText}>OK</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </>
          )}
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
