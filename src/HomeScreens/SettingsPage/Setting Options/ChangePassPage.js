import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../../FirebaseConfig";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { styles } from "../styles";

const ChangePassPage = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleChangePassword = async () => {
    if (currentPassword && newPassword && confirmNewPassword) {
      if (newPassword != confirmNewPassword) {
        Alert.alert("Error", "New password and confirm password do not match");
        return;
      }
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);

        Alert.alert("Success", "Password changed successfully");
        navigation.goBack();
      } catch (error) {
        console.error("Change Password Error:", error.message);
        Alert.alert("Error", "Failed to change password. Please try again");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Change password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        onChangeText={setCurrentPassword}
        value={currentPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        onChangeText={setNewPassword}
        value={newPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        onChangeText={setConfirmNewPassword}
        value={confirmNewPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleChangePassword}
      >
        <Text style={styles.buttonText}>Change Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassPage;
