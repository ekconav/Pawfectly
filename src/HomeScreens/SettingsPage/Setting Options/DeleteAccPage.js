import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../../../FirebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";
import styles from "../styles";

const DeleteAccPage = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState("");

  const handleDeleteAccount = async () => {
    if (password) {
      try {
        const user = auth.currentUser;

        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);

        await user.delete();

        const userDocRef = doc(db, "users", user.uid);
        await deleteDoc(userDocRef);

        Alert.alert("Success", "Your account has been deleted successfully");
        navigation.navigate("LoginPage");
      } catch (error) {
        console.error("Delete Account Error:", error.message);
        Alert.alert("Error", "Failed to delete account. Please try again");
      }
    } else {
      Alert.alert(
        "Error",
        "Please enter your password to confirm account deletion"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        Are you sure you want to delete your account?
      </Text>
      <Text>Please enter password to confirm account deletion</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.buttonText}>Delete Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAccPage;
