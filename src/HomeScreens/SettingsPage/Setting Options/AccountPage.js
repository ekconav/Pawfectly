import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../FirebaseConfig";
import { styles } from "../styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const AccountPage = () => {
  const [userDetails, setUserDetails] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        } else {
          console.log("No such document");
        }
      } else {
        console.log("No user is signed in.");
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const updateDetails = async () => {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserDetails(docSnap.data());
        }
      }
    };
    updateDetails();
  }, [userDetails]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate("Edit Account")}
      >
        <Text>
          Edit <Ionicons name="pencil-outline" size={20} />
        </Text>
      </TouchableOpacity>
      <Text>First Name: </Text>
      <Text>{userDetails.firstName}</Text>
      <Text>Last Name: </Text>
      <Text>{userDetails.lastName}</Text>
      <Text>Address: </Text>
      <Text>{userDetails.address}</Text>
      <Text>Mobile Number: </Text>
      <Text>{userDetails.mobileNumber}</Text>
    </View>
  );
};

export default AccountPage;
