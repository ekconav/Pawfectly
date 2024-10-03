import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../FirebaseConfig";
import Modal from "react-native-modal";
import styles from "./style";
import COLORS from "../const/colors";

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userUID = userCredential.user.uid;

        const userDocRef = doc(db, "users", userUID);
        const shelterDocRef = doc(db, "shelters", userUID);

        const userDoc = await getDoc(userDocRef);
        const shelterDoc = await getDoc(shelterDocRef);

        if (userDoc.exists()) {
          console.log("User logged in");
          navigation.replace("UserStack");
        } else if (shelterDoc.exists()) {
          console.log("Shelter logged in");
          navigation.replace("ShelterStack");
        } else {
          setModalMessage("Email is not registered.");
          setAlertModal(true);
        }
      } catch (error) {
        if (error.message.includes("auth/invalid-credential")) {
          setModalMessage("Please check your email and password.");
        } else if (error.message.includes("auth/invalid-email")) {
          setModalMessage("Please provide a valid email.");
        } else {
          setModalMessage("Error logging in. Please try again.");
        }
        setAlertModal(true);
      } finally {
        setLoading(false);
      }
    } else {
      setModalMessage("Please fill in all fields.");
      setAlertModal(true);
    }
  };

  // Handle password reset functionality
  const handlePasswordReset = async () => {
    if (email) {
      try {
        console.log("Attempting to send reset email to:", email);

        await sendPasswordResetEmail(auth, email);
  
        setModalMessage("Password reset email sent! Please check your inbox.");
      } catch (error) {
        console.error("Error sending password reset email:", error.message);
  
        if (error.code === "auth/user-not-found") {
          setModalMessage("No account found with this email. Please check and try again.");
        } else if (error.code === "auth/invalid-email") {
          setModalMessage("Invalid email format. Please enter a valid email.");
        } else {
          setModalMessage("Error sending password reset email. Please try again.");
        }
      } finally {
        setAlertModal(true);
      }
    } else {
      setModalMessage("Please enter your email to reset your password.");
      setAlertModal(true);
    }
  };

  const handleChoosePage = () => {
    navigation.navigate("ChoosePage");
    console.log("User is choosing");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.prim} />
      </View>
    );
  }

  return (
    <View style={styles.loginPageContainer}>
      <Text style={styles.loginPageTitle}>PAWFECTLY{"\n"}ADOPTABLE</Text>
      <Text style={styles.loginPageInputLabel}>Email</Text>
      <TextInput
        style={styles.loginPageInput}
        onChangeText={(value) => setEmail(value)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.loginPageInputLabel}>Password</Text>
      <TextInput
        style={styles.loginPageInput}
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.loginPageButton} onPress={handleLogin}>
        <Text style={styles.loginPageButtonText}>Login</Text>
      </TouchableOpacity>
      {/* Add Forgot Password text */}
      <Text style={styles.resetPasswordText} onPress={handlePasswordReset}>
        Forgot Password?
      </Text>
      <Text style={styles.loginPageSubtitle}>
        Don't have an account yet?
        <Text onPress={handleChoosePage} style={styles.loginPageLink}>
          {" "}
          Sign up here
        </Text>
      </Text>
      <Modal isVisible={alertModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setAlertModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default LoginPage;
