import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { db, storage } from '../../FirebaseConfig'



const AddPet = () => {
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [maleChecked, setMaleChecked] = useState(false);
    const [femaleChecked, setFemaleChecked] = useState(false);
    const [breed, setBreed] = useState('');
    const [details, setDetails] = useState('');
    const [age, setAge] = useState('');

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
            setImages(result.assets);
        }
    };

    const handleUpload = async () => {
        if (images.length === 0) {
            alert('Please select at least one image.');
            return;
        }

        try {
            // Upload images to Firebase Storage and store their download URLs
            const imageUrls = [];
            for (let i = 0; i < images.length; i++) {
                const response = await fetch(images[i].uri);
                const blob = await response.blob();
                const imageName = new Date().getTime() + i; // Use unique name for each image
                const ref = storage.ref().child(`images/${imageName}`);
                await ref.put(blob);
                const imageUrl = await ref.getDownloadURL();
                imageUrls.push(imageUrl);
            }

            // Store pet details in Firestore
            await db.collection('pets').add({
                images: imageUrls,
                description,
                location,
                gender: maleChecked ? 'Male' : 'Female',
                breed,
                details,
                age: parseInt(age),
            });

            // Reset form fields
            setImages([]);
            setDescription('');
            setLocation('');
            setMaleChecked(false);
            setFemaleChecked(false);
            setBreed('');
            setDetails('');
            setAge('');
            
            alert('Pet details uploaded successfully!');
        } catch (error) {
            console.error('Error uploading pet details:', error);
            alert('Failed to upload pet details. Please try again.');
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity style={styles.imageContainer} onPress={handleChooseImage}>
                    {images.length > 0 ? (
                        images.map((image, index) => (
                            <Image key={index} source={{ uri: image.uri }} style={styles.image} />
                        ))
                    ) : (
                        <View style={styles.addPhoto}>
                            <Ionicons name="camera-outline" size={24} color="black" />
                            <Text style={styles.addPhotoText}>Add Photo</Text>
                        </View>
                        
                    )}
                </TouchableOpacity>
                <View style={styles.form}>
                    <TextInput
                        placeholder='Description'
                        value={description}
                        onChangeText={text => setDescription(text)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder='Location'
                        value={location}
                        onChangeText={text => setLocation(text)}
                        style={styles.inputField}
                    />
                    <View style={styles.checkboxContainer}>
                        <Checkbox
                            value={maleChecked}
                            onValueChange={setMaleChecked}
                        />
                        <Text style={styles.checkboxLabel}>Male</Text>
                        <Checkbox
                            value={femaleChecked}
                            onValueChange={setFemaleChecked}
                        />
                        <Text style={styles.checkboxLabel}>Female</Text>
                    </View>
                    <TextInput
                        placeholder='Breed'
                        value={breed}
                        onChangeText={text => setBreed(text)}
                        style={styles.inputField}
                    />
                    <TextInput
                        placeholder='Details'
                        value={details}
                        onChangeText={text => setDetails(text)}
                        style={[styles.inputField, styles.detailsField]}
                        multiline
                    />
                    <TextInput
                        placeholder='Age'
                        value={age}
                        onChangeText={text => setAge(text)}
                        style={styles.inputField}
                        keyboardType='numeric'
                    />
                </View>
                <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
                    <Text style={styles.uploadButtonText}>Upload</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20,
    },
    imageContainer: {
        flexDirection: 'row',
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
        marginRight: 10,
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
        marginRight: 10,
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
};

export default AddPet;
