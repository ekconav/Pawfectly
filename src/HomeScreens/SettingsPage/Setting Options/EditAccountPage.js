import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import styles from "../styles";
import { db, auth } from "../../../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const EditAccountScreenPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
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
          alert("Account details updated!");
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Edit Account Here!</Text>
      <Text>First Name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <Text>Last Name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
      <Text>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
      />
      <Text>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        placeholder="Mobile Number"
      />
      <TouchableOpacity style={styles.editButton} onPress={updateDetails}>
        <Text>Save & Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditAccountScreenPage;
