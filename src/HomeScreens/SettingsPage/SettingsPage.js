import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";

const SettingsPage = ({ onProfileImageChange }) => {
  const [userDetails, setUserDetails] = useState({});
  const [profileImage, setProfileImage] = useState(
    require("../../components/cat1.png")
  );
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
          } else {
            console.log("No such document");
          }
        });

        return () => unsubscribeDoc();
      } else {
        console.log("No shelter is signed in.");
        setUserDetails({});
      }
    });
    return unsubscribe;
  }, []);

  const handlePickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.cancelled) {
        setProfileImage({ uri: result.uri });
        onProfileImageChange(result.uri);
        navigation.navigate("Home", { profileImageURI: result.uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const size = 18;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <View>
          <Text>
            {userDetails.firstName} {userDetails.lastName}
          </Text>
          <Text>{userDetails.address}</Text>
          <Text>{userDetails.mobileNumber}</Text>
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

export default SettingsPage;
