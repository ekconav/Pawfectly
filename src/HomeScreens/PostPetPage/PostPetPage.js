import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import Checkbox from "expo-checkbox";
import COLORS from "../../const/colors";
import styles from "./styles";

const PostPetPage = () => {
  const [profileImage, setProfileImage] = useState("");
  const [petImage, setPetImage] = useState("");
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [petDescription, setPetDescription] = useState("");
  const [dogChecked, setDogChecked] = useState(false);
  const [catChecked, setCatChecked] = useState(false);
  const [maleChecked, setMaleChecked] = useState(false);
  const [femaleChecked, setFemaleChecked] = useState(false);
  const [ageModal, setAgeModal] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [priceChecked, setPriceChecked] = useState(false);
  const [adoptionFee, setAdoptionFee] = useState("");

  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setProfileImage(
          userData.accountPicture
            ? { uri: userData.accountPicture }
            : require("../../components/user.png")
        );
        setUserAddress(userData.address);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleMaleCheck = () => {
    setMaleChecked((prevState) => !prevState);
    if (femaleChecked) {
      setFemaleChecked(false);
    }
  };

  const handleFemaleCheck = () => {
    setFemaleChecked((prevState) => !prevState);
    if (maleChecked) {
      setMaleChecked(false);
    }
  };

  const handleDogCheck = () => {
    setDogChecked((prevState) => !prevState);
    if (catChecked) {
      setCatChecked(false);
    }
  };

  const handleCatCheck = () => {
    setCatChecked((prevState) => !prevState);
    if (dogChecked) {
      setDogChecked(false);
    }
  };

  const handleWithAdoptionFee = () => {
    setPriceChecked((prevChecked) => !prevChecked);
    setAdoptionFee("");
  };

  const handleInfoClick = () => {
    setModalMessage(
      "Pet type is not required. If both checkboxes are empty, your pet will belong to the 'others' category."
    );
    setAlertModal(true);
  };

  const handleCancel = () => {
    setPetImage("");
    setPetName("");
    setDogChecked(false);
    setCatChecked(false);
    setMaleChecked(false);
    setFemaleChecked(false);
    setPriceChecked(false);
    setPetBreed("");
    setPetAge("");
    setPetDescription("");
    navigation.goBack();
  };

  const handleAgeSelect = (option) => {
    setAgeModal(false);
    if (option === "0-3 Months") {
      setPetAge("0-3 Months");
    } else if (option === "4-6 Months") {
      setPetAge("4-6 Months");
    } else if (option === "7-9 Months") {
      setPetAge("7-9 Months");
    } else if (option === "10-12 Months") {
      setPetAge("10-12 Months");
    } else if (option === "1-3 Years Old") {
      setPetAge("1-3 Years Old");
    } else if (option === "4-6 Years Old") {
      setPetAge("4-6 Years Old");
    } else if (option === "7 Years Old and Above") {
      setPetAge("7 Years Old and Above");
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: null,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      const user = auth.currentUser;

      if (user) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const timestamp = new Date().getTime();
        const storageRef = ref(storage, `petsPostedByUser/${user.uid}/${timestamp}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        setPetImage({ uri: downloadURL });
      }
    }
  };

  const handleUpload = async () => {
    if (
      !petImage ||
      !petName ||
      (!maleChecked && !femaleChecked) ||
      !petBreed ||
      !petAge ||
      !petDescription
    ) {
      setAlertModal(true);
      setModalMessage("Please fill in all required fields.");
      return;
    }

    const petImageUrl = typeof petImage === "string" ? petImage : petImage.uri;

    try {
      const user = auth.currentUser;
      if (user) {
        const petsRef = collection(db, "pets");

        const petType = dogChecked ? "Dog" : catChecked ? "Cat" : "Others";

        await addDoc(petsRef, {
          adopted: false,
          adoptedBy: "",
          age: petAge,
          breed: petBreed,
          description: petDescription,
          gender: maleChecked ? "Male" : "Female",
          images: petImageUrl,
          location: userAddress,
          name: petName,
          petPosted: serverTimestamp(),
          petPrice: adoptionFee ? adoptionFee : "",
          type: petType,
          userId: user.uid,
        });
        navigation.replace("HomeScreen");

        setPetImage("");
        setPetName("");
        setDogChecked(false);
        setCatChecked(false);
        setMaleChecked(false);
        setFemaleChecked(false);
        setPriceChecked(false);
        setAdoptionFee("");
        setPetBreed("");
        setPetAge("");
        setPetDescription("");
      }
      console.log("Pet uploaded");
    } catch (error) {
      console.error("Error uploading pet details:", error);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post Pet for Adoption</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Set")}>
            <Image source={profileImage} style={styles.profileImage} />
          </TouchableOpacity>
        </View>
        <View style={styles.addPetContainer}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.addImageContainer}>
              <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
                {!petImage ? (
                  <View style={styles.iconAndText}>
                    <Ionicons name="image-outline" size={20} color={COLORS.title} />
                    <Text style={styles.addPetText}>Add Image</Text>
                  </View>
                ) : (
                  <Image source={petImage} style={styles.petPreviewImage} />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.addPetInputContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.addPetText}>Name</Text>
                <TextInput
                  style={styles.addPetInput}
                  value={petName}
                  onChangeText={(text) => setPetName(text)}
                />
              </View>
              <View style={styles.inputCheckboxContainer}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginRight: 25,
                  }}
                >
                  <Text style={styles.typeText}>Type</Text>
                  <TouchableOpacity onPress={handleInfoClick}>
                    <Ionicons
                      name="information-circle-outline"
                      size={16}
                      color={COLORS.title}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.checkBoxType}>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={dogChecked}
                      onValueChange={handleDogCheck}
                      color={COLORS.prim}
                    />
                    <Text style={styles.addPetText}>Dog</Text>
                  </View>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={catChecked}
                      onValueChange={handleCatCheck}
                      color={COLORS.prim}
                    />
                    <Text style={styles.addPetText}>Cat</Text>
                  </View>
                </View>
              </View>
              <View style={styles.inputCheckboxContainer}>
                <Text style={styles.typeGender}>Gender</Text>
                <View style={styles.checkboxGender}>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={maleChecked}
                      onValueChange={handleMaleCheck}
                      color={COLORS.prim}
                    />
                    <Text style={styles.addPetText}>Male</Text>
                  </View>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={femaleChecked}
                      onValueChange={handleFemaleCheck}
                      color={COLORS.prim}
                    />
                    <Text style={styles.addPetText}>Female</Text>
                  </View>
                </View>
              </View>
              <View style={styles.inputCheckboxContainerAdoptionFee}>
                <Text style={styles.typeTextAdoptionFee}>With Adoption Fee</Text>
                <View style={styles.checkBoxType}>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={priceChecked}
                      onValueChange={handleWithAdoptionFee}
                      color={COLORS.prim}
                    />
                    <Text style={styles.addPetText}>Yes</Text>
                  </View>
                </View>
              </View>
              {priceChecked ? (
                <View style={styles.inputContainer}>
                  <Text style={styles.addPetText}>Adoption Fee</Text>
                  <TextInput
                    style={styles.addPetInput}
                    value={adoptionFee}
                    onChangeText={(text) => setAdoptionFee(text)}
                    keyboardType="phone-pad"
                  />
                </View>
              ) : null}
              <View style={styles.inputContainer}>
                <Text style={styles.addPetText}>Breed</Text>
                <TextInput
                  style={styles.addPetInput}
                  value={petBreed}
                  onChangeText={(text) => setPetBreed(text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.addPetText}>Age</Text>
                <TouchableOpacity onPress={() => setAgeModal(true)}>
                  <TextInput
                    editable={false}
                    style={styles.addPetInput}
                    value={petAge}
                    onChangeText={(text) => setPetAge(text)}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.addPetText}>Description</Text>
                <TextInput
                  style={styles.addPetDescriptionInput}
                  value={petDescription}
                  onChangeText={(text) => setPetDescription(text)}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
            <Text style={styles.buttonText}>Upload</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        visible={ageModal}
        animationType="fade"
        onRequestClose={() => setAgeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAgeModal(false)}
        >
          <View style={styles.ageOptions}>
            {[
              "0-3 Months",
              "4-6 Months",
              "7-9 Months",
              "10-12 Months",
              "1-3 Years Old",
              "4-6 Years Old",
              "7 Years Old and Above",
            ].map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleAgeSelect(option)}
                style={styles.ageDropdown}
              >
                <Text style={styles.ageDropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal isVisible={alertModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.modalButtonContainer}>
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

export default PostPetPage;
