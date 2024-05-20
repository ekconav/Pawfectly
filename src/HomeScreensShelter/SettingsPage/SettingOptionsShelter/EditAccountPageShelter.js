import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { db, auth } from "../../../FirebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../styles";

const EditAccountPage = () => {
  const [shelterName, setShelterName] = useState("");
  const [address, setAddress] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const shelter = auth.currentUser;

    if (shelter) {
      const shelterDocRef = doc(db, "shelters", shelter.uid);
      getDoc(shelterDocRef).then((docSnap) => {
        if (docSnap.exists()) {
          const shelterData = docSnap.data();
          setShelterName(shelterData.shelterName);
          setAddress(shelterData.address);
          setMobileNumber(shelterData.mobileNumber);
        } else {
          console.log("No such document");
        }
      });
    }
  }, []);

  const updateDetails = () => {
    if (!shelterName || !address || !mobileNumber) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    const shelter = auth.currentUser;
    if (shelter) {
      const shelterDocRef = doc(db, "shelters", shelter.uid);
      updateDoc(shelterDocRef, {
        shelterName,
        address,
        mobileNumber,
      })
        .then(() => {
          alert("Shelter details updated!");
          navigation.goBack();
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text>Shelter Name:</Text>
      <TextInput
        style={styles.input}
        value={shelterName}
        onChangeText={setShelterName}
        placeholder="Shelter Name"
      />
      <Text>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Address"
      />
      <Text>Mobile Number</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.countryCode}>+63</Text>
        <TextInput
          style={styles.input}
          value={mobileNumber}
          onChangeText={setMobileNumber}
          placeholder="Mobile Number"
        />
      </View>
      <TouchableOpacity style={styles.editButton} onPress={updateDetails}>
        <Text>Save & Update</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditAccountPage;
