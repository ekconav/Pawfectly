import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { db, auth, storage } from "../../../../FirebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import COLORS from "../../../../const/colors";
import styles from "./styles";


const SetupDonations = () => {
  const [qrCode, setQrCode] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const shelter = auth.currentUser;

    if (shelter) {
      const shelterDocRef = doc(db, "shelters", shelter.uid);
      getDoc(shelterDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const shelterData = docSnap.data();
          setQrCode(shelterData.qrCode);
        } else {
          console.log("No such document");
        }
      });
    }
  }, []);

  const handleDelete = () => {
    const shelter = auth.currentUser;
    if (shelter) {
      const shelterDocRef = doc(db, "shelters", shelter.uid);
      getDoc(shelterDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const shelterData = docSnap.data();
          if (shelterData.qrCode !== "") {
            updateDoc(shelterDocRef, {
              qrCode: "",
            });
            setQrCode("");
          }
        } else {
          console.log("No such document");
        }
      });
    }
  };

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
      aspect: null,
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
          const storageRef = ref(storage, `shelters/${shelter.uid}/qrCode/${shelter.uid}`);
          await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(storageRef);

          setQrCode(downloadURL);

          const docRef = doc(db, "shelters", shelter.uid);
          await updateDoc(docRef, {
            qrCode: downloadURL,
          });
        } catch (error) {
          console.error("Error uploading qr code: ", error);
        } finally {
          setImageLoading(false);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.prim} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Setup Donations</Text>
      </View>
      <View style={styles.iconContainer}>
        {qrCode ? (
          imageLoading ? (
            <ActivityIndicator size="large" color={COLORS.prim} />
          ) : (
            <Image source={{ uri: qrCode }} style={styles.qrCodePicture} />
          )
        ) : (
          <Ionicons name="qr-code-outline" size={50} color={COLORS.prim} />
        )}
      </View>

      <View style={styles.buttonContainer}>
        {!qrCode ? (
          <TouchableOpacity style={styles.uploadButton} onPress={handlePickImage}>
            <Text style={styles.buttonText}>Upload QR code</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.changeButton} onPress={handlePickImage}>
              <Text style={styles.buttonText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Modal isVisible={alertModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.alertButtonContainer}>
            <TouchableOpacity
              onPress={() => setAlertModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SetupDonations;
