import React, { useState }  from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { storage, db } from '../../FirebaseConfig'; // Import db from FirebaseConfig
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'; // Import storage functions
import * as FileSystem from 'expo-file-system';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';


const AddPet = () => {
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [maleChecked, setMaleChecked] = useState(false);
    const [femaleChecked, setFemaleChecked] = useState(false);
    const [breed, setBreed] = useState('');
    const [details, setDetails] = useState('');
    const [age, setAge] = useState('');
    const [uploading, setUploading ] = useState(false);
    const navigation = useNavigation();

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

            // Store pet details in Firestore
            await addDoc(collection(db, 'pets'), {
                images: downloadURL,
                description,
                location,
                gender: maleChecked ? 'Male' : 'Female',
                breed,
                details,
                age: parseInt(age),
            });

            // Reset form fields
            setImage('');
            setDescription('');
            setLocation('');
            setMaleChecked(false);
            setFemaleChecked(false);
            setBreed('');
            setDetails('');
            setAge('');

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
                <TextInput
                    placeholder="Description"
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    style={styles.inputField}
                />
                <TextInput
                    placeholder="Location"
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                    style={styles.inputField}
                />
                <View style={styles.checkboxContainer}>
                    <Checkbox value={maleChecked} onValueChange={setMaleChecked} />
                    <Text style={styles.checkboxLabel}>Male</Text>
                    <Checkbox value={femaleChecked} onValueChange={setFemaleChecked} />
                    <Text style={styles.checkboxLabel}>Female</Text>
                </View>
                <TextInput
                    placeholder="Breed"
                    value={breed}
                    onChangeText={(text) => setBreed(text)}
                    style={styles.inputField}
                />
                <TextInput
                    placeholder="Details"
                    value={details}
                    onChangeText={(text) => setDetails(text)}
                    style={[styles.inputField, styles.detailsField]}
                    multiline
                />
                <TextInput
                    placeholder="Age"
                    value={age}
                    onChangeText={(text) => setAge(text)}
                    style={styles.inputField}
                    keyboardType="numeric"
                />
            </View>
            <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
                <Text style={styles.uploadButtonText}>Upload</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    addPhoto: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 120,
        height: 120,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        marginBottom: 10,
    },
    addPhotoText: {
        marginTop: 5,
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'cover',
        borderRadius: 10,
        marginBottom: 10,
    },
    form: {
        marginBottom: 20,
    },
    inputField: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 15,
    },
    detailsField: {
        height: 100,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    checkboxLabel: {
        marginLeft: 8,
    },
    uploadButton: {
        backgroundColor: 'blue',
        paddingVertical: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    uploadButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default AddPet;
