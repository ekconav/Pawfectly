import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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
  const [currentPetsImageUri, setCurrentPetsImageUri] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileNameForCurrentPets, setFileNameForCurrentPets] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [tosItems, setTosItems] = useState([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOfServiceModalVisible, setTermsOfServiceModalVisible] =
    useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [triggerRequired, setTriggerRequired] = useState(false);
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
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      setModalMessage("Permission to access camera roll is required.");
      setAlertModal(true);
      return;
    }
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

  const handlePickCurrentPets = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      setModalMessage("Permission to access camera roll is required.");
      setAlertModal(true);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setCurrentPetsImageUri(uri);
      setFileNameForCurrentPets(truncateFilename(result.assets[0].fileName));
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
      if (!email.includes("@")) {
        setModalMessage("Please enter a valid email address.");
        setAlertModal(true);
        return;
      }

      if (password !== confirmPassword) {
        setModalMessage("Passwords do not match. Please try again.");
        setAlertModal(true);
        return;
      }

      if (!imageUri) {
        setModalMessage("Please upload a government ID picture before registering.");
        setAlertModal(true);
        setTriggerRequired(true);
        return;
      }

      setModalVisible(true);
    } else {
      setModalMessage("Please fill in all fields.");
      setAlertModal(true);
      setTriggerRequired(true);
      return;
    }
  };

  const handleConfirmSignup = async () => {
    if (termsAccepted) {
      setLoading(true);

      try {
        console.log("Starting signup process...");

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const fullMobileNumber = `+63${mobileNumber}`;
        let governmentIdUrl = "";
        let currentPetsUrl = "";

        if (imageUri) {
          try {
            const response = await fetch(imageUri);
            const blob = await response.blob();

            const fileRef = ref(storage, `adopters/${user.uid}/governmentIds/${user.uid}`);
            await uploadBytes(fileRef, blob);
            governmentIdUrl = await getDownloadURL(fileRef);
            console.log("Image uploaded and URL retrieved:", governmentIdUrl);
          } catch (error) {
            setModalMessage("Error uploading image. Please try again.");
            setAlertModal(true);
          }
        }

        if (currentPetsImageUri) {
          try {
            const response = await fetch(currentPetsImageUri);
            const blob = await response.blob();

            const fileRef = ref(storage, `adopters/${user.uid}/currentPets/${user.uid}`);
            await uploadBytes(fileRef, blob);
            currentPetsUrl = await getDownloadURL(fileRef);
            console.log("Image uploaded and URL retrieved:", currentPetsUrl);
          } catch (error) {
            setModalMessage("Error uploading image. Please try again.");
            setAlertModal(true);
          }
        }

        await addUserToFirestore(user.uid, {
          adoption_limit: 0,
          firstName: firstName,
          lastName: lastName,
          mobileNumber: fullMobileNumber,
          address: address,
          email: email,
          verified: false,
          governmentId: governmentIdUrl,
          currentPets: currentPetsUrl,
          termsAccepted: true,
        });

        setModalMessage("Signup Successful.");
        setAlertModal(true);
        setTimeout(() => {
          navigation.navigate("LoginPage");
        }, 2000);
      } catch (error) {
        if (error.message.includes("auth/email-already-in-use")) {
          setModalMessage("Error signing up. Email already in use.");
        } else if (error.message.includes("auth/weak-password")) {
          setModalMessage(
            "Password is too weak. Password should be at least 6 characters."
          );
        } else {
          setModalMessage("Error logging in. Please try again.");
        }
        setAlertModal(true);
      } finally {
        setLoading(false);
        setModalVisible(false);
      }
    } else {
      setModalMessage("You must agree to the terms of service to sign up.");
      setAlertModal(true);
    }
  };

  const handleShowTermsOfService = () => {
    setTermsOfServiceModalVisible(true);
  };

  const handleCloseTermsOfServiceModal = () => {
    setTermsOfServiceModalVisible(false);
  };

  const handleCancel = () => {
    if (modalVisible) {
      setTermsAccepted(false);
    }
    setModalVisible(false);
  };

  const handleMobileNumberChange = (text) => {
    if (text.startsWith("+63")) {
      const newText = text.slice(3);
      setMobileNumber(newText);
    } else if (text.startsWith("0")) {
      const newText = text.slice(1);
      setMobileNumber(newText);
    } else if (
      text.includes("(") ||
      text.includes("/") ||
      text.includes(")") ||
      text.includes("N") ||
      text.includes(",") ||
      text.includes(".") ||
      text.includes("*") ||
      text.includes(";") ||
      text.includes("#") ||
      text.includes("-") ||
      text.includes("+") ||
      text.includes(" ")
    ) {
      const newText = text.slice(0, -1);
      setMobileNumber(newText);
    } else {
      setMobileNumber(text);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.signUpPageContainer}>
        <Text style={styles.signUpPageTitle}>SIGN UP</Text>
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            First Name{" "}
            <Text
              style={triggerRequired && firstName === "" ? styles.required : null}
            >
              *
            </Text>
          </Text>
          <TextInput
            style={styles.signUpPageinput}
            onChangeText={(text) => setFirstName(text)}
            value={firstName}
          />
        </View>
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            Last Name{" "}
            <Text
              style={triggerRequired && lastName === "" ? styles.required : null}
            >
              *
            </Text>
          </Text>
          <TextInput
            style={styles.signUpPageinput}
            onChangeText={(text) => setLastName(text)}
            value={lastName}
          />
        </View>
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            Mobile Number{" "}
            <Text
              style={triggerRequired && mobileNumber === "" ? styles.required : null}
            >
              *
            </Text>
          </Text>
          <View style={styles.signUpPageMobileInput}>
            <Text style={styles.signUpPageCountryCodeOverlay}>+63</Text>
            <TextInput
              style={styles.signUpPageMobileNumberInput}
              value={mobileNumber}
              onChangeText={handleMobileNumberChange}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            Address{" "}
            <Text style={triggerRequired && address === "" ? styles.required : null}>
              *
            </Text>
          </Text>
          <TextInput
            style={styles.signUpPageinput}
            onChangeText={(text) => setAddress(text)}
            value={address}
          />
        </View>
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            Email Address{" "}
            <Text style={triggerRequired && email === "" ? styles.required : null}>
              *
            </Text>
          </Text>
          <TextInput
            style={styles.signUpPageinput}
            onChangeText={(value) => setEmail(value)}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            Password{" "}
            <Text
              style={triggerRequired && password === "" ? styles.required : null}
            >
              *
            </Text>
          </Text>
          <TextInput
            style={styles.signUpPageinput}
            onChangeText={(value) => setPassword(value)}
            value={password}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            Confirm Password{" "}
            <Text
              style={
                triggerRequired && confirmPassword === "" ? styles.required : null
              }
            >
              *
            </Text>
          </Text>
          <TextInput
            style={styles.signUpPageinput}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            Picture of any Government ID{" "}
            <Text
              style={triggerRequired && fileName === "" ? styles.required : null}
            >
              *
            </Text>
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
        <View style={styles.signUpPageInputContainer}>
          <Text style={styles.signUpPageLabel}>
            Picture of current pets (Optional)
          </Text>
          <TouchableOpacity
            style={styles.signUpPageFileUpload}
            onPress={handlePickCurrentPets}
          >
            <Ionicons
              style={styles.signUpPageUploadIcon}
              name="cloud-upload-outline"
            />
            <Text style={styles.signUpPageUploadText}>
              {fileNameForCurrentPets ? fileNameForCurrentPets : "File Upload"}
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
            <Text style={styles.signUpPageLink} onPress={handleShowTermsOfService}>
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
              onPress={handleCancel}
            >
              <Text style={styles.signUpPageModalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signUpPageModalConfirmButton}
              onPress={handleConfirmSignup}
            >
              <Text style={styles.signUpPageModalConfirmButtonText}>Confirm</Text>
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
                <Text style={styles.signUpPageDescription}>{item.description}</Text>
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
    </KeyboardAvoidingView>
  );
};

export default SignupPage;
