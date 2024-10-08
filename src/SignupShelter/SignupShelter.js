import React, { useState, useEffect } from "react";
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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  setDoc,
  query,
  getDocs,
  orderBy,
  collection,
} from "firebase/firestore";
import { db, auth, storage } from "../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import Modal from "react-native-modal";
import COLORS from "../const/colors";
import CheckBox from "expo-checkbox";

const truncateFilename = (filename, maxLength = 20) => {
  if (filename.length <= maxLength) return filename;
  return filename.substring(0, maxLength) + "...";
};

const SignupShelter = () => {
  const [shelterName, setShelterName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [governmentId, setGovernmentId] = useState("");
  const [governmentIdFilename, setGovernmentIdFilename] = useState("");
  const [businessPermit, setBusinessPermit] = useState("");
  const [businessPermitFilename, setBusinessPermitFilename] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsOfServiceModalVisible, setTermsOfServiceModalVisible] =
    useState(false);
  const [tosItems, setTosItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [triggerRequired, setTriggerRequired] = useState(false);
  const navigation = useNavigation();

  const addShelterToFirestore = async (userId, userData) => {
    try {
      await setDoc(doc(db, "shelters", userId), userData);
      console.log("User data added successfully to Firestore");
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

  const handleGovtId = async () => {
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
      setGovernmentId(uri);
      setGovernmentIdFilename(truncateFilename(result.assets[0].fileName));
    }
  };

  const handleBusinessPermit = async () => {
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
      setBusinessPermit(uri);
      setBusinessPermitFilename(truncateFilename(result.assets[0].fileName));
    }
  };

  const handleSignup = async () => {
    if (
      shelterName &&
      address &&
      mobileNumber &&
      ownerName &&
      email &&
      password &&
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

      if (!governmentId || !businessPermit) {
        setModalMessage("Please upload the necessary documents before registering.");
        setAlertModal(true);
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
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        const fullMobileNumber = `+63${mobileNumber}`;
        let governmentIdUrl = "";
        let businessPermitUrl = "";

        if (governmentId && businessPermit) {
          try {
            const responseGovernmentId = await fetch(governmentId);
            const responseBusinessPermit = await fetch(businessPermit);

            const blobGovernmentId = await responseGovernmentId.blob();
            const blobBusinessPermit = await responseBusinessPermit.blob();

            const governmentIdRef = ref(storage, `governmentIds/${user.uid}`);
            const businessPermitRef = ref(storage, `businessPermits/${user.uid}`);

            await uploadBytes(governmentIdRef, blobGovernmentId);
            await uploadBytes(businessPermitRef, blobBusinessPermit);

            governmentIdUrl = await getDownloadURL(governmentIdRef);
            businessPermitUrl = await getDownloadURL(businessPermitRef);
          } catch (uploadError) {
            setModalMessage("Error uploading image. Please try again.");
            setAlertModal(true);
          }
        }

        await addShelterToFirestore(user.uid, {
          shelterName: shelterName,
          address: address,
          mobileNumber: fullMobileNumber,
          shelterOwner: ownerName,
          email: email,
          governmentId: governmentIdUrl,
          businessPermit: businessPermitUrl,
          verified: false,
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
      <ScrollView contentContainerStyle={styles.shelterSignUpContainer}>
        <Text style={styles.shelterSignUpTitle}>SIGN UP</Text>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Name of Shelter{" "}
            <Text
              style={triggerRequired && shelterName === "" ? styles.required : null}
            >
              *
            </Text>
          </Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(text) => setShelterName(text)}
            value={shelterName}
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Address of Shelter{" "}
            <Text style={triggerRequired && address === "" ? styles.required : null}>
              *
            </Text>
          </Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(text) => setAddress(text)}
            value={address}
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Mobile Number{" "}
            <Text
              style={triggerRequired && mobileNumber === "" ? styles.required : null}
            >
              *
            </Text>
          </Text>
          <View style={styles.shelterSignUpMobileInput}>
            <Text style={styles.shelterSignUpCountryCode}>+63</Text>
            <TextInput
              style={styles.shelterSignUpMobileNumberInput}
              value={mobileNumber}
              onChangeText={handleMobileNumberChange}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Name of Owner{" "}
            <Text
              style={triggerRequired && ownerName === "" ? styles.required : null}
            >
              *
            </Text>
          </Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(text) => setOwnerName(text)}
            value={ownerName}
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Email Address{" "}
            <Text style={triggerRequired && email === "" ? styles.required : null}>
              *
            </Text>
          </Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(value) => setEmail(value)}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Password{" "}
            <Text
              style={triggerRequired && password === "" ? styles.required : null}
            >
              *
            </Text>
          </Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(value) => setPassword(value)}
            value={password}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
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
            style={styles.shelterSignUpInput}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Picture of any Government ID{" "}
            <Text
              style={
                triggerRequired && governmentIdFilename === ""
                  ? styles.required
                  : null
              }
            >
              *
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.shelterSignUpFileUpload}
            onPress={handleGovtId}
          >
            <Ionicons
              style={styles.shelterSignUpUploadIcon}
              name="cloud-upload-outline"
            />
            <Text style={styles.shelterSignUpPageUploadText}>
              {governmentIdFilename ? governmentIdFilename : "File Upload"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Picture of Shelter Business Permit{" "}
            <Text
              style={
                triggerRequired && businessPermitFilename === ""
                  ? styles.required
                  : null
              }
            >
              *
            </Text>
          </Text>
          <TouchableOpacity
            style={styles.shelterSignUpFileUpload}
            onPress={handleBusinessPermit}
          >
            <Ionicons
              style={styles.shelterSignUpUploadIcon}
              name="cloud-upload-outline"
            />
            <Text style={styles.shelterSignUpPageUploadText}>
              {businessPermitFilename ? businessPermitFilename : "File Upload"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.shelterSignUpButton} onPress={handleSignup}>
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.shelterSignUpButtonText}>Register</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.shelterSignUpBackButtonText}>
          Already have an account?{" "}
          <Text
            style={styles.shelterSignUpLink}
            onPress={() => navigation.navigate("LoginPage")}
          >
            Login
          </Text>
        </Text>
      </ScrollView>
      <Modal isVisible={modalVisible}>
        <View style={styles.shelterSignUpModalContent}>
          <Text style={styles.shelterSignUpModalTitle}>
            By using Pawfectly Adoptable, you agree to these{" "}
            <Text
              style={styles.shelterSignUpLink}
              onPress={handleShowTermsOfService}
            >
              Terms of Service
            </Text>
            .
          </Text>
          <View style={styles.shelterSignUpCheckboxContainer}>
            <CheckBox
              style={styles.shelterSignUpPageCheckbox}
              value={termsAccepted}
              onValueChange={setTermsAccepted}
              color={COLORS.prim}
            />
            <Text style={styles.shelterSignUpCheckboxLabel}>
              I agree to the Terms of Service
            </Text>
          </View>
          <View style={styles.shelterSignUpButtonContainer}>
            <TouchableOpacity
              style={styles.shelterSignUpModalCancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.shelterSignUpModalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shelterSignUpModalConfirmButton}
              onPress={handleConfirmSignup}
            >
              <Text style={styles.shelterSignUpModalConfirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={termsOfServiceModalVisible}>
        <View style={styles.shelterSignUpModalContent}>
          <Text style={styles.shelterSignUpTOSTitle}>Terms of Service</Text>
          <ScrollView style={styles.shelterSignUpTermsScrollView}>
            {tosItems.map((item) => (
              <View key={item.id} style={styles.shelterSignUpTextContainer}>
                <Text style={styles.shelterSignUpSubtitle}>
                  {item.order}. {item.title}
                </Text>
                <Text style={styles.shelterSignUpDescription}>
                  {item.description}
                </Text>
              </View>
            ))}
            <View style={styles.shelterSignUpTextContainer}>
              <Text style={styles.shelterSignUpDescription}>
                <Text style={styles.shelterSignUpEmailAd}>
                  pawfectly_adoptable@gmail.com
                </Text>
              </Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.shelterSignUpModalCancelButton}
            onPress={handleCloseTermsOfServiceModal}
          >
            <Text style={styles.shelterSignUpModalCancelButtonText}>Close</Text>
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

export default SignupShelter;
