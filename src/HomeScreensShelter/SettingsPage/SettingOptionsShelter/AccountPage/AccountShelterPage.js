import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "../../../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import COLORS from "../../../../const/colors";
import styles from "./styles";

const AccountPage = () => {
  const [accountPicture, setAccountPicture] = useState("");
  const [shelterName, setShelterName] = useState("");
  const [shelterOwnerName, setShelterOwnerName] = useState("");
  const [shelterAddress, setShelterAddress] = useState("");
  const [shelterMobileNumber, setShelterMobileNumber] = useState("");
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const shelter = auth.currentUser;

    if (shelter) {
      const shelterDocRef = doc(db, "shelters", shelter.uid);
      getDoc(shelterDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const shelterData = docSnap.data();
          setShelterName(shelterData.shelterName);
          setShelterOwnerName(shelterData.shelterOwner);
          setShelterAddress(shelterData.address);
          setShelterMobileNumber(shelterData.mobileNumber);
          if (shelterData.accountPicture) {
            setAccountPicture({ uri: shelterData.accountPicture });
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
      const shelter = auth.currentUser;

      if (shelter) {
        setImageLoading(true);
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `profilePictures/${shelter.uid}`);
          await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(storageRef);

          const docRef = doc(db, "shelters", shelter.uid);
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
    if (
      !shelterName ||
      !shelterOwnerName ||
      !shelterAddress ||
      !shelterMobileNumber
    ) {
      setModalMessage("Please fill in all required fields.");
      setAlertModal(true);
      return;
    }

    const shelter = auth.currentUser;
    const fullMobileNumber = `+63${shelterMobileNumber}`;

    if (shelter) {
      const shelterDocRef = doc(db, "shelters", shelter.uid);
      setLoading(true);
      try {
        await updateDoc(shelterDocRef, {
          shelterName: shelterName,
          shelterOwner: shelterOwnerName,
          address: shelterAddress,
          mobileNumber: fullMobileNumber,
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

  const handleMobileNumberChange = (text) => {
    if (text.startsWith("+63")) {
      const newText = text.slice(3);
      setShelterMobileNumber(newText);
    } else if (text.startsWith("0")) {
      const newText = text.slice(1);
      setShelterMobileNumber(newText);
    } else {
      setShelterMobileNumber(text);
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
          <View style={styles.textInputContainer}>
            <View>
              <Text style={styles.text}>Shelter Name</Text>
              <TextInput
                style={styles.input}
                value={shelterName}
                onChangeText={setShelterName}
              />
            </View>
            <View>
              <Text style={styles.text}>Shelter Owner</Text>
              <TextInput
                style={styles.input}
                value={shelterOwnerName}
                onChangeText={setShelterOwnerName}
              />
            </View>
            <View>
              <Text style={styles.text}>Address</Text>
              <TextInput
                style={styles.input}
                value={shelterAddress}
                onChangeText={setShelterAddress}
              />
            </View>
            <View>
              <Text style={styles.text}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={
                  shelterMobileNumber.startsWith("+63")
                    ? shelterMobileNumber.slice(3)
                    : shelterMobileNumber
                }
                onChangeText={handleMobileNumberChange}
                keyboardType="phone-pad"
                maxLength={10}
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
