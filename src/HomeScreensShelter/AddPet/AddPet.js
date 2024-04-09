import React, { useState }  from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { storage, db } from '../../FirebaseConfig'; // Import db from FirebaseConfig
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Import storage functions
import * as FileSystem from 'expo-file-system';
import { collection, addDoc } from 'firebase/firestore';
import { auth } from '../../FirebaseConfig';
import { useNavigation } from '@react-navigation/native';
import styles from '../AddPet/styles';


const AddPet = () => {
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [name, setName] = useState('');
    const [maleChecked, setMaleChecked] = useState(false);
    const [femaleChecked, setFemaleChecked] = useState(false);
    const [dogChecked, setDogChecked] = useState(false);
    const [catChecked, setCatChecked] = useState(false);
    const [breed, setBreed] = useState('');
    const [details, setDetails] = useState('');
    const [age, setAge] = useState('');
    const [uploading, setUploading ] = useState(false);
    const navigation = useNavigation();
    const [breedModalVisible, setBreedModalVisible] = useState(false);
    const [ageModalVisible, setAgeModalVisible] = useState(false);
    const [specifyBreedModalVisible, setSpecifyBreedModalVisible] = useState(false);

    const petAges = ['0 - 3 Months', '4 - 6 Months', '7 - 9 Months', '10 - 12 Months', '1 - 3 Years Old', '4 - 6 Yeard Ols','7 Years Old and Above'];
    const dogBreeds = ['Labrador Retriever', 'German Shepherd', 'Golden Retriever'];
    const catBreeds = ['Persian', 'Maine Coon', 'Siamese'];

    const handleAgeSelection = (selectedAge) => {
        setAge(selectedAge);
        setAgeModalVisible(false); // Close the age modal after selection
    };

    const handleBreedSelection = (selectedBreed) => {
        setBreed(selectedBreed);
        setBreedModalVisible(false); // Close the breed modal after selection
    };

    const handleSpecifyBreed = () => {
        setBreed('');
        setBreedModalVisible(false);
        setSpecifyBreedModalVisible(true);
    };

    const handleSpecifyBreedOK = () => {
        setSpecifyBreedModalVisible(false);
    };

    const handleMaleCheck = () => {
        setMaleChecked(true);
        setFemaleChecked(false);
    };

    const handleFemaleCheck = () => {
        setFemaleChecked(true);
        setMaleChecked(false);
    };

    const handleDogCheck = () => {
        setDogChecked(true);
        setCatChecked(false);
    };

    const handleCatCheck = () => {
        setCatChecked(true);
        setDogChecked(false);
    };

    const handleChooseImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            alert('Permission to access camera roll is required!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            multiple: true, // Allow multiple selection
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri); // Set the URI directly
        }
    };

    const handleUpload = async () => {
        if (!image) {
            alert('Please select an image.');
            return; 
        }
            
        try {
            // Upload images to Firebase Storage and store their download URLs
            const { uri } = await FileSystem.getInfoAsync(image);
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    reject(new TypeError('Network Request Failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', uri, true);
                xhr.send(null);
            });

            const filename = image.substring(image.lastIndexOf('/') + 1);
            const storageRef = ref(storage, filename); // Use storage from FirebaseConfig

            await uploadBytes(storageRef, blob);
            console.log('Pet photo uploaded');

            const downloadURL = await getDownloadURL(storageRef);

            let ageRange = '';
                if (age) {
            const ageIndex = petAges.findIndex((ageRange) => ageRange === age);
            if (ageIndex !== -1) {
                ageRange = petAges[ageIndex];
            }
        }

            // Store pet details in Firestore
            await addDoc(collection(db, 'pets'), {
                name,
                images: downloadURL,
                description,
                location,
                gender: maleChecked ? 'Male' : 'Female',
                type: dogChecked ? 'Dog' : 'Cat',
                age: ageRange,
                breed,
            });

            // Reset form fields
            setImage('');
            setDescription('');
            setName('');
            setLocation('');
            setMaleChecked(false);
            setFemaleChecked(false);
            setDogChecked(false);
            setCatChecked(false);
            setAge('');
            setBreed('');

            alert('Pet details uploaded successfully!');
            console.log('pet details uploaded')
            navigation.navigate('HomePageScreenShelter');
        } catch (error) {
            console.error('Error uploading pet details:', error);
            alert('Failed to upload pet details. Please try again.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
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
                <Text>Name</Text>
            <TextInput
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.inputField}
                />

            <Text>Type of Pet:</Text>           
            <View style={styles.checkboxContainer}>
                    <Checkbox value={dogChecked} onValueChange={handleDogCheck} />
                    <Text style={styles.checkboxLabel}>Dog</Text>
                    <Checkbox value={catChecked} onValueChange={handleCatCheck} />
                    <Text style={styles.checkboxLabel}>Cat</Text>
                </View>
                <Text>Gender</Text>
                <View style={styles.checkboxContainer}>
                    <Checkbox value={maleChecked} onValueChange={handleMaleCheck} />
                    <Text style={styles.checkboxLabel}>Male</Text>
                    <Checkbox value={femaleChecked} onValueChange={handleFemaleCheck} />
                    <Text style={styles.checkboxLabel}>Female</Text>
                </View>
                <Text>Age:</Text>
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
                <Text>Breed:</Text>
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
                            {dogChecked && dogBreeds.map((breed, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.breedOption}
                                    onPress={() => handleBreedSelection(breed)}
                                >
                                    <Text>{breed}</Text>
                                </TouchableOpacity>
                            ))}
                            {catChecked && catBreeds.map((breed, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.breedOption}
                                    onPress={() => handleBreedSelection(breed)}
                                >
                                    <Text>{breed}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={styles.breedOption}
                                onPress={() => handleSpecifyBreed()}
                            >
                                <Text>Specify</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={specifyBreedModalVisible}
                    onRequestClose={() => setSpecifyBreedModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TextInput
                                placeholder="Specify Breed"
                                value={breed}
                                onChangeText={(text) => setBreed(text)}
                                style={styles.inputField}
                            />
                            <TouchableOpacity
                                style={styles.okButton}
                                onPress={() => handleSpecifyBreedOK()}
                            >
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Text>Location</Text>
                <TextInput
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                    style={styles.inputField}
                />
                <Text>Description</Text>
                <TextInput
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    style={styles.inputField}
                />

            </View>
            
            <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddPet;