import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
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

  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      setModalMessage("Permission to access camera roll is required!");
      setAlertModal(true);
      return;
    }
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
        setImageLoading(true);
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
          setImageLoading(false);
        }
      }
    }
  };

  const updateDetails = async () => {
    if (!firstName || !lastName || !address || !mobileNumber) {
      setModalMessage("Please fill in all required fields.");
      setAlertModal(true);
      return;
    }

    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      setLoading(true);
      try {
        await updateDoc(userDocRef, {
          firstName,
          lastName,
          address,
          mobileNumber,
        });
        navigation.goBack();
      } catch (error) {
        console.error("Error updating document: ", error);
        setModalMessage(
          "An error occurred while updating your details. Please try again."
        );
        setAlertModal(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white, paddingBottom: 18 }}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={24} color={COLORS.prim} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account</Text>
        </View>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.accountContainer}>
            <TouchableOpacity
              style={styles.pictureButton}
              onPress={() => setImageModalVisible(true)}
            >
              {imageLoading ? (
                <ActivityIndicator
                  style={styles.loading}
                  size="large"
                  color={COLORS.prim}
                />
              ) : (
                <Image source={accountPicture} style={styles.profileImage} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconImageButton}
              onPress={handlePickImage}
            >
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
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
              />
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
                {loading ? (
                  <ActivityIndicator size="small" color={COLORS.white} />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        isVisible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
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
      <Modal isVisible={alertModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              onPress={() => setAlertModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default AccountPage;
