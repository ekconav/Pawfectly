import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../../../FirebaseConfig";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../../const/colors";
import Modal from "react-native-modal";
import styles from "./styles";

const ChangePassPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleChangePassword = async () => {
    if (currentPassword && newPassword && confirmNewPassword) {
      if (newPassword !== confirmNewPassword) {
        setModalMessage("New password and confirm password do not match.");
        setIsModalVisible(true);
        return;
      }
      setLoading(true);
      try {
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);

        setModalMessage("Password changed successfully.");
        setIsModalVisible(true);
        setShouldNavigateBack(true);
      } catch (error) {
        if (error.message.includes("auth/weak-password")) {
          setModalMessage(
            "Password is too weak. Password should be at least 6 characters."
          );
        } else if (error.message.includes("auth/invalid-credential")) {
          setModalMessage("Current password is invalid.");
        } else {
          setModalMessage("Failed to change password. Please try again.");
        }
        setIsModalVisible(true);
      } finally {
        setLoading(false);
      }
    } else {
      setModalMessage("Please fill in all fields.");
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    if (shouldNavigateBack) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.prim} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>
      <View style={styles.inputContainer}>
        <View>
          <Text style={styles.text}>Current Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={setCurrentPassword}
            value={currentPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text style={styles.text}>New Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={setNewPassword}
            value={newPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text style={styles.text}>Confirm New Password</Text>
          <TextInput
            style={styles.input}
            onChangeText={setConfirmNewPassword}
            value={confirmNewPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.changePasswordButton}
          onPress={handleChangePassword}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ChangePassPage;
