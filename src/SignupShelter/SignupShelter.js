import React, { useState, useEffect } from "react";
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
      if (password !== confirmPassword) {
        Alert.alert("", "Passwords do not match. Please try again.");
        return;
      }

      if (!governmentId || !businessPermit) {
        Alert.alert(
          "",
          "Please upload the necessary documents before registering."
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
        const shelterEmail = email.trim() + "@shelter.com";
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          shelterEmail,
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
            const businessPermitRef = ref(
              storage,
              `businessPermits/${user.uid}`
            );

            await uploadBytes(governmentIdRef, blobGovernmentId);
            await uploadBytes(businessPermitRef, blobBusinessPermit);

            governmentIdUrl = await getDownloadURL(governmentIdRef);
            businessPermitUrl = await getDownloadURL(businessPermitRef);
          } catch (uploadError) {
            console.error("Error uploading image:", uploadError.message);
            Alert.alert("", "Error uploading image. Please try again.");
          }
        }

        await addShelterToFirestore(user.uid, {
          shelterName: shelterName,
          address: address,
          mobileNumber: fullMobileNumber,
          shelterOwner: ownerName,
          email: shelterEmail,
          governmentId: governmentIdUrl,
          businessPermit: businessPermitUrl,
        });

        navigation.navigate("LoginPage");
        Alert.alert("", "Signup Successful", [
          {
            text: "OK",
          },
        ]);
      } catch (error) {
        console.error("Signup Error: ", error.message);
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
      <ScrollView contentContainerStyle={styles.shelterSignUpContainer}>
        <Text style={styles.shelterSignUpTitle}>SIGN UP</Text>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>Name of Shelter</Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(text) => setShelterName(text)}
            value={shelterName}
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>Address of Shelter</Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(text) => setAddress(text)}
            value={address}
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>Mobile Number</Text>
          <View style={styles.shelterSignUpMobileInput}>
            <Text style={styles.shelterSignUpCountryCode}>+63</Text>
            <TextInput
              style={styles.shelterSignUpMobileNumberInput}
              onChangeText={(text) => setMobileNumber(text)}
              value={mobileNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>Name of Owner</Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(text) => setOwnerName(text)}
            value={ownerName}
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>Email Address</Text>
          <View style={styles.shelterSignUpEmailInput}>
            <TextInput
              style={[
                styles.shelterSignUpInput,
                { flex: 1, backgroundColor: "none" },
              ]}
              onChangeText={(value) => setEmail(value)}
              value={email}
              keyboardType="email-address"
            />
            <Text style={styles.shelterSignUpEmailSuffix}>@shelter.com</Text>
          </View>
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>Password</Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(value) => setPassword(value)}
            value={password}
            secureTextEntry
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>Confirm Password</Text>
          <TextInput
            style={styles.shelterSignUpInput}
            onChangeText={(text) => setConfirmPassword(text)}
            value={confirmPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.shelterSignUpInputContainer}>
          <Text style={styles.shelterSignUpLabel}>
            Picture of any Government ID
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
            Picture of Shelter Business Permit
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
        <TouchableOpacity
          style={styles.shelterSignUpButton}
          onPress={handleSignup}
        >
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
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.shelterSignUpModalCancelButtonText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.shelterSignUpModalConfirmButton}
              onPress={handleConfirmSignup}
            >
              <Text style={styles.shelterSignUpModalConfirmButtonText}>
                Confirm
              </Text>
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
    </KeyboardAvoidingView>
  );
};

export default SignupShelter;
