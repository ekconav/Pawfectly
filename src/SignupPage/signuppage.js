import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  doc,
  orderBy,
  setDoc,
  query,
  collection,
  getDocs,
} from "firebase/firestore";
import { auth, db, storage } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import COLORS from "../const/colors";
import Modal from "react-native-modal";
import CheckBox from "expo-checkbox";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [tosItems, setTosItems] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOfServiceModalVisible, setTermsOfServiceModalVisible] =
    useState(false);
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

  useEffect(() => {
    const fetchTOS = async () => {
      try {
        const q = query(collection(db, "TOS"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const tosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTosItems(tosData);
      } catch (error) {
        console.error("Error fetching TOS:", error.message);
      }
    };

    fetchTOS();
  }, []);

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

      setModalVisible(true);
    } else {
      Alert.alert("", "Please fill in all fields.");
    }
  };

  const handleConfirmSignup = async () => {
    if (termsAccepted) {
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
            const blob = await response.blob();

            const fileRef = ref(storage, `governmentIds/${user.uid}`);
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
        setModalVisible(false);
      }
    } else {
      Alert.alert("", "You must agree to the terms of service to sign up.");
    }
  };

  const handleShowTermsOfService = () => {
    setTermsOfServiceModalVisible(true);
  };

  const handleCloseTermsOfServiceModal = () => {
    setTermsOfServiceModalVisible(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.signUpPageContainer}>
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
            <Text style={styles.signUpPageCountryCodeOverlay}>+63</Text>
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
          <Text style={styles.signUpPageLabel}>
            Picture of any Government ID
          </Text>
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
          Already have an account?{" "}
          <Text
            style={styles.signUpPageLink}
            onPress={() => navigation.navigate("LoginPage")}
          >
            Login
          </Text>
        </Text>
      </ScrollView>
      {/* Modal for Terms of Service */}
      <Modal isVisible={modalVisible}>
        <View style={styles.signUpPageModalContent}>
          <Text style={styles.signUpPageModalTitle}>
            By using Pawfectly Adoptable, you agree to these{" "}
            <Text
              style={styles.signUpPageLink}
              onPress={handleShowTermsOfService}
            >
              Terms of Service
            </Text>
            .
          </Text>
          <View style={styles.signUpPageCheckboxContainer}>
            <CheckBox
              style={styles.signUpPageCheckbox}
              value={termsAccepted}
              onValueChange={setTermsAccepted}
              color={COLORS.prim}
            />
            <Text style={styles.signUpPageCheckboxLabel}>
              I agree to the Terms of Service
            </Text>
          </View>
          <View style={styles.signUpPageButtonContainer}>
            <TouchableOpacity
              style={styles.signUpPageModalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.signUpPageModalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signUpPageModalConfirmButton}
              onPress={handleConfirmSignup}
            >
              <Text style={styles.signUpPageModalConfirmButtonText}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={termsOfServiceModalVisible}>
        <View style={styles.signUpPageModalContent}>
          <Text style={styles.signUpPageTOSTitle}>Terms of Service</Text>
          <ScrollView style={styles.signUpPageTermsScrollView}>
            {tosItems.map((item) => (
              <View key={item.id} style={styles.signUpPageTextContainer}>
                <Text style={styles.signUpPageSubtitle}>
                  {item.order}. {item.title}
                </Text>
                <Text style={styles.signUpPageDescription}>
                  {item.description}
                </Text>
              </View>
            ))}
            <View style={styles.signUpPageTextContainer}>
              <Text style={styles.signUpPageDescription}>
                <Text style={styles.signUpPageEmailAd}>
                  pawfectly_adoptable@gmail.com
                </Text>
              </Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.signUpPageModalCancelButton}
            onPress={handleCloseTermsOfServiceModal}
          >
            <Text style={styles.signUpPageModalCancelButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default SignupPage;
