import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { db, auth, storage } from "../../../../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import COLORS from "../../../../const/colors";
import styles from "./styles";

const AccountPage = () => {
  const [accountPicture, setAccountPicture] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      getDoc(userDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setAddress(userData.address);
          setMobileNumber(userData.mobileNumber);
          if (userData.accountPicture) {
            setAccountPicture({ uri: userData.accountPicture });
          } else {
            setAccountPicture(require("../../../../components/user.png"));
          }
        } else {
          console.log("No such document");
        }
      });
    }
  }, []);

  const updateDetails = () => {
    if (!firstName || !lastName || !address || !mobileNumber) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      updateDoc(userDocRef, {
        firstName,
        lastName,
        address,
        mobileNumber,
      })
        .then(() => {
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const { uri } = result.assets[0];
      const user = auth.currentUser;

      if (user) {
        setLoading(true);
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `profilePictures/${user.uid}`);
          await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(storageRef);

          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, {
            accountPicture: downloadURL,
          });
          setAccountPicture({ uri: downloadURL });
        } catch (error) {
          console.error("Error uploading profile picture: ", error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color={COLORS.prim} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        <View style={styles.accountContainer}>
          <TouchableOpacity style={styles.pictureButton} onPress={() => setImageModalVisible(true)}>
            {loading ? (
              <ActivityIndicator style={styles.loading} size="large" color={COLORS.prim} />
            ) : (
              <Image source={accountPicture} style={styles.profileImage} />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconImageButton} onPress={handlePickImage}>
            <Ionicons name="image-outline" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.textInputContainers}>
          <View style={styles.firstLastName}>
            <View>
              <Text style={styles.text}>First Name</Text>
              <TextInput
                style={styles.firstLastInput}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>Last Name</Text>
              <TextInput
                style={styles.firstLastInput}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
          <View>
            <Text style={styles.text}>Address</Text>
            <TextInput style={styles.input} value={address} onChangeText={setAddress} />
          </View>
          <View>
            <Text style={styles.text}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              maxLength={13}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.saveButton} onPress={updateDetails}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Modal isVisible={imageModalVisible} onRequestClose={() => setImageModalVisible(false)}>
        <TouchableOpacity
          style={styles.imageModalOverlay}
          activeOpacity={1}
          onPress={() => setImageModalVisible(false)}
        >
          <View style={styles.modalImageContainer}>
            <Image source={accountPicture} style={styles.modalProfileImage} />
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AccountPage;
