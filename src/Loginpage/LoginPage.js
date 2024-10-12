import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
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
  const [emailLoading, setEmailLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async () => {
    if (email && password) {
      setLoading(true);

      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
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
          setModalMessage(
            "Invalid credentials. Please check your email and password."
          );
        } else if (error.message.includes("auth/invalid-email")) {
          setModalMessage("Invalid email format. Please enter a valid email.");
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
    if (!email) {
      setModalMessage("Please enter your email to reset your password.");
      setAlertModal(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setModalMessage("Invalid email format. Please enter a valid email.");
      setAlertModal(true);
      return;
    }

    setEmailLoading(true);
    try {
      console.log("Attempting to check if email exists:", email);

      const usersCollectionRef = collection(db, "users");
      const userSnapshot = await getDocs(
        query(usersCollectionRef, where("email", "==", email))
      );

      const sheltersCollectionRef = collection(db, "shelters");
      const shelterSnapshot = await getDocs(
        query(sheltersCollectionRef, where("email", "==", email))
      );

      if (!userSnapshot.empty || !shelterSnapshot.empty) {
        await sendPasswordResetEmail(auth, email);
        setModalMessage("Password reset email sent! Please check your inbox.");
      } else {
        setModalMessage(
          "No account found with this email. Please check and try again."
        );
      }
    } catch (error) {
      if (error.message.includes("auth/invalid-email")) {
        setModalMessage("Invalid email format. Please enter a valid email.");
      } else {
        setModalMessage(
          "An error occurred while trying to send the reset email. Please try again."
        );
      }
    } finally {
      setAlertModal(true);
      setEmailLoading(false);
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
      <View style={{ width: "100%" }}>
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
        <View style={styles.forgotPasswordContainer}>
          {emailLoading ? (
            <ActivityIndicator size="small" color={COLORS.prim} />
          ) : (
            <Text style={styles.resetPasswordText} onPress={handlePasswordReset}>
              Forgot Password?
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity style={styles.loginPageButton} onPress={handleLogin}>
        <Text style={styles.loginPageButtonText}>Login</Text>
      </TouchableOpacity>
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
