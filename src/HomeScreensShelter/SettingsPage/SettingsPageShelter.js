import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, storage } from "../../FirebaseConfig";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const SettingsPageShelter = () => {
  const navigation = useNavigation();
  const [shelterDetails, setShelterDetails] = useState({});
  const [shelterImage, setShelterImage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (shelter) => {
      if (shelter) {
        const docRef = doc(db, "shelters", shelter.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setShelterDetails(data);
            if (data.accountPicture) {
              setShelterImage({ uri: data.accountPicture });
            } else {
              setShelterImage(require("../../components/user.png"));
            }
          } else {
            console.log("No such document");
          }
        });

        return () => unsubscribeDoc();
      } else {
        console.log("No shelter is signed in.");
        setShelterDetails({});
      }
    });
    return unsubscribe;
  }, []);

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
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `profilePictures/${user.uid}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        const docRef = doc(db, "shelters", user.uid);
        await updateDoc(docRef, {
          accountPicture: downloadURL,
        });
        setShelterImage({ uri: downloadURL });
        Alert.alert("Success", "Profile picture updated");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Shelter signed out successfully");
      navigation.replace("LoginPage");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const size = 18;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image source={shelterImage} style={styles.shelterImage} />
        </TouchableOpacity>
        <View>
          <Text>{shelterDetails.shelterName}</Text>
          <Text>{shelterDetails.address}</Text>
          <Text>+63{shelterDetails.mobileNumber}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("Account")}>
        <Text style={styles.settingTitle}>
          <Ionicons name="person-outline" size={size} />
          {"  "}
          Account
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("About")}>
        <Text style={styles.settingTitle}>
          <Ionicons name="help-circle-outline" size={size} />
          {"  "}
          About
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Change Password")}>
        <Text style={styles.settingTitle}>
          <Ionicons name="lock-closed-outline" size={size} />
          {"  "}
          Change Password
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Terms of Service")}>
        <Text style={styles.settingTitle}>
          <Ionicons name="book-outline" size={size} />
          {"  "}
          Terms of Service
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Privacy Policy")}>
        <Text style={styles.settingTitle}>
          <Ionicons name="shield-outline" size={size} />
          {"  "}
          Privacy Policy
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Request Account Deletion")}
      >
        <Text style={styles.settingTitle}>
          <Ionicons name="person-remove-outline" size={size} />
          {"  "}
          Request Account Deletion
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsPageShelter;
