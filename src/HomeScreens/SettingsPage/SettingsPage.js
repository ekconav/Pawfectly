import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";

const SettingsPage = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const unsubsrcibe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("No user is signed in.");
      }
    });
    return unsubsrcibe;
  }, []);

  useEffect(() => {
    const updateUserDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        }
      }
    };
    updateUserDetails();
  }, [userDetails]);

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
        <Ionicons
          name="person-circle-outline"
          size={80}
          style={{ paddingRight: 10 }}
        />
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
