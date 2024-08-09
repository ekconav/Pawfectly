import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import COLORS from "../const/colors";
import { Ionicons } from "@expo/vector-icons";

// Function to truncate filenames
const truncateFilename = (filename, maxLength = 20) => {
  if (filename.length <= maxLength) return filename;
  return filename.substring(0, maxLength) + "...";
};

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState("");
  const [fileName, setFileName] = useState("");
  const navigation = useNavigation();

  const addUserToFirestore = async (userId, userData) => {
    try {
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, userData);
    } catch (error) {
      console.error("Error adding user data to Firestore:", error.message);
      throw error;
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setImageUri(uri);
      setFileName(truncateFilename(result.assets[0].fileName));
    }
  };

  const handleSignup = async () => {
    if (
      firstName &&
      lastName &&
      address &&
      email &&
      password &&
      mobileNumber &&
      confirmPassword
    ) {
      if (password !== confirmPassword) {
        Alert.alert("", "Passwords do not match. Please try again.");
        return;
      }

      if (!imageUri) {
        Alert.alert(
          "",
          "Please upload a government ID picture before registering."
        );
        return;
      }

      setLoading(true);

      try {
        console.log("Starting signup process...");

        const userEmail = email.trim() + "@user.com";
        console.log("Creating user with email:", userEmail);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userEmail,
          password
        );
        const user = userCredential.user;
        console.log("User created successfully:", user);

        const fullMobileNumber = `+63${mobileNumber}`;
        let governmentIdUrl = "";

        if (imageUri) {
          try {
            const response = await fetch(imageUri);
            const blob = await response.blob(); // Convert URI to Blob

            const fileRef = ref(storage, `governmentIds/${user.uid}.jpg`);
            await uploadBytes(fileRef, blob);
            governmentIdUrl = await getDownloadURL(fileRef);
            console.log("Image uploaded and URL retrieved:", governmentIdUrl);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            Alert.alert("", "Error uploading image. Please try again.");
          }
        }

        await addUserToFirestore(user.uid, {
          firstName: firstName,
          lastName: lastName,
          mobileNumber: fullMobileNumber,
          address: address,
          email: userEmail,
          verified: false,
          governmentId: governmentIdUrl,
        });

        navigation.navigate("LoginPage");
        Alert.alert("", "Signup Successful", [
          {
            text: "OK",
          },
        ]);
      } catch (error) {
        console.error("Signup Error:", error.message);
        Alert.alert("", "Error signing up. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert("", "Please fill in all fields.");
    }
  };

  return (
    <View style={styles.signUpPageContainer}>
      <Text style={styles.signUpPageTitle}>SIGN UP</Text>
      <View style={styles.signUpPageInputContainer}>
        <Text style={styles.signUpPageLabel}>First Name</Text>
        <TextInput
          style={styles.signUpPageinput}
          onChangeText={(text) => setFirstName(text)}
          value={firstName}
        />
      </View>
      <View style={styles.signUpPageInputContainer}>
        <Text style={styles.signUpPageLabel}>Last Name</Text>
        <TextInput
          style={styles.signUpPageinput}
          onChangeText={(text) => setLastName(text)}
          value={lastName}
        />
      </View>
      <View style={styles.signUpPageInputContainer}>
        <Text style={styles.signUpPageLabel}>Mobile Number</Text>
        <View style={styles.signUpPageMobileInput}>
          <Text style={styles.countryCodeOverlay}>+63</Text>
          <TextInput
            style={[styles.signUpPageMobileNumberInput]}
            onChangeText={(text) => setMobileNumber(text)}
            value={mobileNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
      </View>
      <View style={styles.signUpPageInputContainer}>
        <Text style={styles.signUpPageLabel}>Address</Text>
        <TextInput
          style={styles.signUpPageinput}
          onChangeText={(text) => setAddress(text)}
          value={address}
        />
      </View>
      <View style={styles.signUpPageInputContainer}>
        <Text style={styles.signUpPageLabel}>Email Address</Text>
        <View style={styles.signUpPageEmailInput}>
          <TextInput
            style={[
              styles.signUpPageinput,
              { flex: 1, backgroundColor: "none" },
            ]}
            onChangeText={(value) => setEmail(value)}
            value={email}
            keyboardType="email-address"
          />
          <Text style={styles.signUpPageEmailSuffix}>@user.com</Text>
        </View>
      </View>
      <View style={styles.signUpPageInputContainer}>
        <Text style={styles.signUpPageLabel}>Password</Text>
        <TextInput
          style={styles.signUpPageinput}
          onChangeText={(value) => setPassword(value)}
          value={password}
          secureTextEntry
        />
      </View>
      <View style={styles.signUpPageInputContainer}>
        <Text style={styles.signUpPageLabel}>Confirm Password</Text>
        <TextInput
          style={styles.signUpPageinput}
          onChangeText={(text) => setConfirmPassword(text)}
          value={confirmPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.signUpPageInputContainer}>
        <Text style={styles.signUpPageLabel}>Picture of any Government ID</Text>
        <TouchableOpacity
          style={styles.signUpPageFileUpload}
          onPress={handlePickImage}
        >
          <Ionicons
            style={styles.signUpPageUploadIcon}
            name="cloud-upload-outline"
          />
          <Text style={styles.signUpPageUploadText}>
            {fileName ? fileName : "File Upload"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.signUpPageRegisterButton}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.signUpPageButtonText}>Register</Text>
        )}
      </TouchableOpacity>
      <Text style={styles.signUpPageBackButtonText}>
        Already have an account?
        <Text
          style={styles.signUpPageLink}
          onPress={() => navigation.navigate("LoginPage")}
        >
          Login
        </Text>
      </Text>
    </View>
  );
};

export default SignupPage;
