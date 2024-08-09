import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../FirebaseConfig";
import styles from "../Loginpage/style";

const LoginPage = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email && password) {
      try {
        setLoading(true);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        setLoading(false);

        const userEmail = userCredential.user.email;

        if (userEmail.endsWith("@user.com")) {
          console.log("User logged in");
        } else if (userEmail.endsWith("@shelter.com")) {
          console.log("Shelter logged in");
        } else {
          console.log("Unknown user logged in");
        }
        navigation.navigate(
          userEmail.endsWith("@user.com") ? "UserStack" : "ShelterStack"
        );
      } catch (error) {
        setLoading(false);
        console.error("Sign-in Error:", error.message);
        Alert.alert("Oopss!", "Please Check Your Email and Password");
      }
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  const handleChoosePage = () => {
    navigation.navigate("ChoosePage");
    console.log("User is choosing");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
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
      />
      <Text style={styles.loginPageInputLabel}>Password</Text>
      <TextInput
        style={styles.loginPageInput}
        onChangeText={(value) => setPassword(value)}
        value={password}
        secureTextEntry
      />
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
    </View>
  );
};

export default LoginPage;
