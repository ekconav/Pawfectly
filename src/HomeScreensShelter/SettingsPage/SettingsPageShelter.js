import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db, storage } from "../../FirebaseConfig";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  collection,
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Modal from "react-native-modal";
import COLORS from "../../const/colors";

const SettingsPageShelter = () => {
  const [shelterDetails, setShelterDetails] = useState({});
  const [shelterImage, setShelterImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [checkVerify, setCheckVerify] = useState(false);
  const [petsForAdoption, setPetsForAdoption] = useState([]);
  const [petsAdopted, setPetsAdopted] = useState([]);
  const [petsRescued, setPetsRescued] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [alertModal, setAlertModal] = useState(false);

  // Setting Modal
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  // Choices Modal
  const [choicesModal, setChoicesModal] = useState(false);

  // Choices
  const [selectedOption, setSelectedOption] = useState("Pets for Adoption");

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (shelter) => {
      if (shelter) {
        setLoading(true);
        const docRef = doc(db, "shelters", shelter.uid);

        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setShelterDetails(data);

            if (data.accountPicture) {
              setShelterImage({ uri: data.accountPicture });
            } else {
              setShelterImage(require("../../components/user.png"));
            }

            if (data.coverPhoto) {
              setCoverImage({ uri: data.coverPhoto });
            } else {
              setCoverImage(require("../../components/landingpage.png"));
            }

            setCheckVerify(data.verified === true);
          } else {
            console.log("No such document");
          }
          setLoading(false);
        });
        return () => unsubscribeDoc();
      } else {
        console.log("No shelter is signed in.");
        setShelterDetails({});
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setLoading(true);
    try {
      const petsCollection = collection(db, "pets");

      const petsForAdoptionQuery = query(
        petsCollection,
        where("userId", "==", currentUser.uid),
        where("adopted", "==", false)
      );

      const petsAdoptedQuery = query(
        petsCollection,
        where("userId", "==", currentUser.uid),
        where("adopted", "==", true)
      );

      const petsRescuedQuery = query(
        petsCollection,
        where("userId", "==", currentUser.uid),
        where("rescued", "==", true)
      );

      const unsubscribePetsForAdoption = onSnapshot(
        petsForAdoptionQuery,
        async (snapshot) => {
          try {
            const petsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              imageUrl: null,
            }));

            const petsWithImageUrls = await Promise.all(
              petsData.map(async (pet) => {
                const imageUrl = await getDownloadURL(ref(storage, pet.images));
                return { ...pet, imageUrl };
              })
            );

            setPetsForAdoption(petsWithImageUrls);
          } catch (error) {
            console.error("Error fetching pets data: ", error);
          } finally {
            setLoading(false);
          }
        }
      );

      const unsubscribePetsAdopted = onSnapshot(
        petsAdoptedQuery,
        async (snapshot) => {
          try {
            const petsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              imageUrl: null,
            }));

            const petsWithImageUrls = await Promise.all(
              petsData.map(async (pet) => {
                const imageUrl = await getDownloadURL(ref(storage, pet.images));
                return { ...pet, imageUrl };
              })
            );

            setPetsAdopted(petsWithImageUrls);
          } catch (error) {
            console.error("Error fetching pets data: ", error);
          } finally {
            setLoading(false);
          }
        }
      );

      const unsubscribePetsRescued = onSnapshot(
        petsRescuedQuery,
        async (snapshot) => {
          try {
            const petsData = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
              imageUrl: null,
            }));

            const petsWithImageUrls = await Promise.all(
              petsData.map(async (pet) => {
                try {
                  const imageUrl = await getDownloadURL(ref(storage, pet.images));
                  return { ...pet, imageUrl };
                } catch (imageError) {
                  console.error("Error fetching pet image URL: ", imageError);
                  return { ...pet, imageUrl: null };
                }
              })
            );

            setPetsRescued(petsWithImageUrls);
          } catch (error) {
            console.error("Error fetching pets data: ", error);
          } finally {
            setLoading(false);
          }
        }
      );

      return () => {
        unsubscribePetsForAdoption();
        unsubscribePetsAdopted();
        unsubscribePetsRescued();
      };
    } catch (error) {
      console.error("Error fetching pet data: ", error);
      setLoading(false);
    }
  }, []);

  const handlePickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const { uri } = result.assets[0];
      const shelter = auth.currentUser;

      if (shelter) {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `coverPictures/${shelter.uid}`);
          await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(storageRef);

          const docRef = doc(db, "shelters", shelter.uid);
          await updateDoc(docRef, {
            coverPhoto: downloadURL,
          });
          setCoverImage({ uri: downloadURL });
        } catch (error) {
          console.error("Error uploading cover photo: ", error);
        }
      }
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setChoicesModal(false);
  };

  const handleSettingsOptionSelect = (option) => {
    setIsSettingModalVisible(false);
    if (option === "Logout") {
      handleLogout();
    } else if (option === "About Pawfectly") {
      navigation.navigate("About");
    } else if (option === "Change Password") {
      navigation.navigate("Change Password");
    } else if (option === "Setup Donations") {
      if (checkVerify) {
        navigation.navigate("SetupDonations");
      } else {
        setModalMessage("Sorry, your account is not yet verified.");
        setAlertModal(true);
      }
    } else if (option === "Terms of Service") {
      navigation.navigate("Terms of Service");
    } else if (option === "Privacy Policy") {
      navigation.navigate("Privacy Policy");
    } else if (option === "Delete Account") {
      navigation.navigate("Request Account Deletion");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Shelter signed out successfully");
      navigation.replace("LoginPage");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.prim} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View>
        <TouchableOpacity onPress={handlePickCover}>
          <Image source={coverImage} style={styles.coverPhoto} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Account")}
        >
          <Image source={shelterImage} style={styles.shelterImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => setIsSettingModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={26} color={COLORS.title} />
        </TouchableOpacity>
      </View>
      <View style={styles.shelterDetails}>
        <View style={styles.shelterInfoContainer}>
          <Text style={styles.shelterName}>{shelterDetails.shelterName}</Text>
          <Ionicons
            style={!checkVerify ? styles.iconNotVerified : styles.iconVerified}
            name="checkmark-circle-outline"
            size={20}
          />
        </View>
        <Text style={styles.shelterOwnerText}>
          Owner: {shelterDetails.shelterOwner}
        </Text>
      </View>

      <View style={styles.shelterDetailsContainer}>
        <View style={styles.iconTextContainer}>
          <Ionicons name="mail-outline" size={20} color={COLORS.prim} />
          <Text style={styles.shelterDetailsText}>{shelterDetails.email}</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Ionicons name="call-outline" size={20} color={COLORS.prim} />
          <Text style={styles.shelterDetailsText}>
            {shelterDetails.mobileNumber}
          </Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Ionicons name="location-outline" size={20} color={COLORS.prim} />
          <Text style={styles.shelterDetailsText}>{shelterDetails.address}</Text>
        </View>
      </View>
      <View style={styles.furbabiesContainer}>
        <View style={styles.titleButton}>
          <Text style={styles.furbabiesText}>
            {selectedOption}
            {selectedOption === "Pets for Adoption" &&
            petsForAdoption.length !== 0 ? (
              <Text> ({petsForAdoption.length})</Text>
            ) : selectedOption === "Pets Adopted" && petsAdopted.length !== 0 ? (
              <Text> ({petsAdopted.length})</Text>
            ) : selectedOption === "Pets Rescued" && petsRescued.length !== 0 ? (
              <Text> ({petsRescued.length})</Text>
            ) : null}
          </Text>

          <TouchableOpacity
            style={styles.choicesButton}
            onPress={() => setChoicesModal(true)}
          >
            <Ionicons name="reorder-three-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Get the data based on selected option */}
        {selectedOption === "Pets for Adoption" && petsForAdoption.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultsText}>No pets for adoption.</Text>
          </View>
        ) : selectedOption === "Pets Adopted" && petsAdopted.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultsText}>No pets adopted.</Text>
          </View>
        ) : selectedOption === "Pets Rescued" && petsRescued.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultsText}>No pets rescued.</Text>
          </View>
        ) : (
          <View style={styles.showPetsContainer}>
            {loading ? (
              <ActivityIndicator
                style={{ flex: 1, justifyContent: "center" }}
                size="large"
                color={COLORS.prim}
              />
            ) : (
              <FlatList
                data={
                  selectedOption === "Pets for Adoption"
                    ? petsForAdoption
                    : selectedOption === "Pets Adopted"
                    ? petsAdopted
                    : petsRescued
                }
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.petButton}
                      onPress={() =>
                        navigation.navigate("Pet Details", { pet: item })
                      }
                    >
                      <View style={styles.imageContainer}>
                        <Image
                          source={{ uri: item.imageUrl }}
                          style={styles.petImage}
                        />
                      </View>
                      <View style={styles.petDetails}>
                        <View style={styles.petNameGender}>
                          <Text style={styles.petName}>{item.name}</Text>
                          <Ionicons
                            style={
                              item.gender.toLowerCase() === "male"
                                ? styles.petGenderIconMale
                                : styles.petGenderIconFemale
                            }
                            name={
                              item.gender.toLowerCase() === "male"
                                ? "male"
                                : "female"
                            }
                            size={12}
                            color={
                              item.gender.toLowerCase() === "male"
                                ? COLORS.male
                                : COLORS.female
                            }
                          />
                        </View>
                        <Text style={styles.petBreedText}>{item.breed}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        )}
      </View>

      {/* Choices Modal */}
      <Modal isVisible={choicesModal} onRequestClose={() => setChoicesModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setChoicesModal(false)}
        >
          <View style={styles.choicesOptions}>
            {["Pets for Adoption", "Pets Adopted", "Pets Rescued"].map(
              (option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOptionSelect(option)}
                  style={styles.choicesDropdown}
                >
                  <Text style={styles.choicesDropdownText}>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Alert Modal */}
      <Modal isVisible={alertModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.alertButtonContainer}>
            <TouchableOpacity
              onPress={() => setAlertModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Settings Dropdown Modal */}
      <Modal
        visible={isSettingModalVisible}
        animationType="fade"
        onRequestClose={() => setIsSettingModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.settingsModalOverlay}
          activeOpacity={1}
          onPress={() => setIsSettingModalVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {[
              "About Pawfectly",
              "Change Password",
              "Setup Donations",
              "Terms of Service",
              "Privacy Policy",
              "Delete Account",
              "Logout",
            ].map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSettingsOptionSelect(option)}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SettingsPageShelter;
