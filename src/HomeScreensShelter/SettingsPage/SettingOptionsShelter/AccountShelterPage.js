import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { auth, db } from "../../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { styles } from "../styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const AccountPage = () => {
  const [shelterDetails, setShelterDetails] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (shelter) => {
      if (shelter) {
        const docRef = doc(db, "shelters", shelter.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setShelterDetails(docSnap.data());
        } else {
          console.log("No such document");
        }
      } else {
        console.log("No shelter is signed in.");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const updateDetails = async () => {
      const shelter = auth.currentUser;
      if (shelter) {
        const docRef = doc(db, "shelters", shelter.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setShelterDetails(docSnap.data());
        }
      }
    };
    updateDetails();
  }, [shelterDetails]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("Edit Account")}
      >
        <Text>
          Edit
          <Ionicons name="pencil-outline" size={20} />
        </Text>
      </TouchableOpacity>
      <Text>Shelter Name: </Text>
      <Text>{shelterDetails.shelterName}</Text>
      <Text>Address:</Text>
      <Text>{shelterDetails.address}</Text>
      <Text>Mobile Number:</Text>
      <Text>+63{shelterDetails.mobileNumber}</Text>
    </View>
  );
};

export default AccountPage;
