import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import COLORS from "../../const/colors";
import Modal from "react-native-modal";

const SettingsPage = () => {
  const [userDetails, setUserDetails] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [checkVerify, setCheckVerify] = useState(false);
  const [pets, setPets] = useState([]);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Setting Modal
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  const [choicesModal, setChoicesModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("My Furbabies");
  const [petsAdopted, setPetsAdopted] = useState([]);

  const [petsSuccessPaws, setPetsSuccessPaws] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);
        const docRef = doc(db, "users", user.uid);

        const unsubscribeDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserDetails(data);

            if (data.accountPicture) {
              setProfileImage({ uri: data.accountPicture });
            } else {
              setProfileImage(require("../../components/user.png"));
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
        setUserDetails({});
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch furbabies sub collection
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoading(true);

        let isFurbabiesLoaded = false;
        let isPetsAdoptedLoaded = false;
        let isSuccessPawsLoaded = false;

        const checkAllLoaded = () => {
          if (isFurbabiesLoaded && isPetsAdoptedLoaded && isSuccessPawsLoaded) {
            setLoading(false);
          }
        };

        const furbabiesRef = query(
          collection(db, "pets"),
          where("adopted", "==", false),
          where("userId", "==", user.uid)
        );

        const unsubscribeFurbabies = onSnapshot(furbabiesRef, async (snapshot) => {
          try {
            const furbabiesData = snapshot.docs.map((doc) => {
              const petData = doc.data();
              return { id: doc.id, ...petData, imageUrl: null };
            });

            setPets(furbabiesData);

            await Promise.all(
              furbabiesData.map(async (pet, index) => {
                const imageUrl = await getDownloadURL(ref(storage, pet.images));
                setPets((prevPets) => {
                  const newPets = [...prevPets];
                  newPets[index].imageUrl = imageUrl;
                  return newPets;
                });
              })
            );
          } catch (error) {
            console.error("Error fetching furbabies data: ", error);
          } finally {
            isFurbabiesLoaded = true;
            checkAllLoaded();
          }
        });

        // Fetch adopted pets
        const petsAdoptedRef = collection(db, "users", user.uid, "petsAdopted");

        const unsubscribePetsAdopted = onSnapshot(
          petsAdoptedRef,
          async (snapshot) => {
            try {
              const petsAdoptedData = snapshot.docs
                .map((doc) => {
                  const petData = doc.data();
                  if (!doc.id || doc.id === "") {
                    console.error(
                      "Invalid document ID found in petsAdopted collection"
                    );
                    return null;
                  }
                  return { id: doc.id, ...petData, imageUrl: null };
                })
                .filter((pet) => pet !== null);

              setPetsAdopted(petsAdoptedData);

              await Promise.all(
                petsAdoptedData.map(async (pet, index) => {
                  const imageUrl = await getDownloadURL(ref(storage, pet.images));
                  setPetsAdopted((prevPetsAdopted) => {
                    const newPetsAdopted = [...prevPetsAdopted];
                    newPetsAdopted[index].imageUrl = imageUrl;
                    return newPetsAdopted;
                  });
                })
              );
            } catch (error) {
              console.error("Error fetching petsAdopted data: ", error);
            } finally {
              isPetsAdoptedLoaded = true;
              checkAllLoaded();
            }
          }
        );

        const successPawsRef = query(
          collection(db, "pets"),
          where("adopted", "==", true),
          where("userId", "==", user.uid)
        );

        const unsubscribeSuccessPaws = onSnapshot(
          successPawsRef,
          async (snapshot) => {
            try {
              const successPawsData = snapshot.docs.map((doc) => {
                const petData = doc.data();
                return { id: doc.id, ...petData, imageUrl: null };
              });

              setPetsSuccessPaws(successPawsData);

              await Promise.all(
                successPawsData.map(async (pet, index) => {
                  const imageUrl = await getDownloadURL(ref(storage, pet.images));
                  setPetsSuccessPaws((prevPets) => {
                    const newPetsSuccess = [...prevPets];
                    newPetsSuccess[index].imageUrl = imageUrl;
                    return newPetsSuccess;
                  });
                })
              );
            } catch (error) {
              console.error("Error fetching success paws: ", error);
            } finally {
              isSuccessPawsLoaded = true;
              checkAllLoaded();
            }
          }
        );

        return () => {
          unsubscribeFurbabies();
          unsubscribePetsAdopted();
          unsubscribeSuccessPaws();
        };
      } else {
        setPets([]);
        setPetsAdopted([]);
        setPetsSuccessPaws([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // For profile cover photo
  const handlePickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const { uri } = result.assets[0];
      const user = auth.currentUser;

      if (user) {
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `coverPictures/${user.uid}`);
          await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(storageRef);

          const docRef = doc(db, "users", user.uid);
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
    setIsSettingModalVisible(false);
    if (option === "Logout") {
      handleLogout();
    } else if (option === "About Pawfectly") {
      navigation.navigate("About");
    } else if (option === "Change Password") {
      navigation.navigate("Change Password");
    } else if (option === "Terms of Service") {
      navigation.navigate("Terms of Service");
    } else if (option === "Privacy Policy") {
      navigation.navigate("Privacy Policy");
    } else if (option === "Delete Account") {
      navigation.navigate("Request Account Deletion");
    }
  };

  const handleChoiceSelect = (option) => {
    setSelectedOption(option);
    setChoicesModal(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
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
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => setIsSettingModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={26} color={COLORS.title} />
        </TouchableOpacity>
      </View>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userFullName}>
          {userDetails.firstName} {userDetails.lastName}
        </Text>
        <Ionicons
          style={!checkVerify ? styles.iconNotVerified : styles.iconVerified}
          name="checkmark-circle-outline"
          size={20}
        />
      </View>
      <View style={styles.userDetailsContainer}>
        <View style={styles.iconTextContainer}>
          <Ionicons name="mail-outline" size={20} style={styles.userDetailsIcon} />
          <Text style={styles.userDetailsText}>{userDetails.email}</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Ionicons name="call-outline" size={20} style={styles.userDetailsIcon} />
          <Text style={styles.userDetailsText}>{userDetails.mobileNumber}</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Ionicons
            name="location-outline"
            size={20}
            style={styles.userDetailsIcon}
          />
          <Text style={styles.userDetailsText}>{userDetails.address}</Text>
        </View>
      </View>
      <View style={styles.furbabiesContainer}>
        <View style={styles.titleButton}>
          <TouchableOpacity
            style={styles.textButton}
            onPress={() => setChoicesModal(true)}
          >
            <Text style={styles.furbabiesText}>{selectedOption}</Text>
            <Ionicons name="caret-down-circle" size={20} color={COLORS.title} />
          </TouchableOpacity>
        </View>

        {selectedOption === "My Furbabies" && pets.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultsText}>Showcase your pets here!</Text>
          </View>
        ) : selectedOption === "Pets Adopted" && petsAdopted.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultsText}>
              You haven't adopted any pets yet.
            </Text>
          </View>
        ) : selectedOption === "Success Paws" && petsSuccessPaws.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultsText}>
              Pets you posted hasn't been adopted yet.
            </Text>
          </View>
        ) : (
          <View style={styles.showcasePetsContainer}>
            {loading ? (
              <ActivityIndicator
                style={{ flex: 1, justifyContent: "center" }}
                size="large"
                color={COLORS.prim}
              />
            ) : (
              <FlatList
                data={
                  selectedOption === "My Furbabies"
                    ? pets
                    : selectedOption === "Pets Adopted"
                    ? petsAdopted
                    : petsSuccessPaws
                }
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.petButton}
                      onPress={() =>
                        navigation.navigate("DetailsPage", { pet: item })
                      }
                    >
                      <View style={styles.imageContainer}>
                        <Image
                          source={{
                            uri: item.imageUrl,
                          }}
                          style={styles.petImage}
                        />
                      </View>
                      <View style={styles.petDetails}>
                        <View style={styles.petNameGender}>
                          <Text style={styles.petName}>{item.name}</Text>
                          <Text>
                            {item.gender.toLowerCase() === "male" ? (
                              <View style={styles.genderIconContainer}>
                                <Ionicons
                                  style={styles.petGenderIconMale}
                                  name="male"
                                  size={12}
                                  color={COLORS.male}
                                />
                              </View>
                            ) : (
                              <View style={styles.genderIconContainer}>
                                <Ionicons
                                  style={styles.petGenderIconFemale}
                                  name="female"
                                  size={12}
                                  color={COLORS.female}
                                />
                              </View>
                            )}
                          </Text>
                        </View>
                        <View style={styles.petLocation}>
                          <Ionicons
                            name="location-outline"
                            size={12}
                            color={COLORS.prim}
                          />
                          <Text
                            style={styles.locationText}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {item.location}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        )}
      </View>

      {/* Settings Dropdown Modal */}
      <Modal
        visible={isSettingModalVisible}
        animationType="fade"
        onRequestClose={() => setIsSettingModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSettingModalVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {[
              "About Pawfectly",
              "Change Password",
              "Terms of Service",
              "Privacy Policy",
              "Delete Account",
              "Logout",
            ].map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleOptionSelect(option)}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Alert Modal */}
      <Modal isVisible={alertModal}>
        <View style={styles.alertModalContainer}>
          <Text style={styles.alertModalText}>{modalMessage}</Text>
          <View style={styles.alertModalButtonContainer}>
            <TouchableOpacity
              onPress={() => setAlertModal(false)}
              style={styles.alertModalButton}
            >
              <Text style={styles.alertModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Choices Modal */}
      <Modal isVisible={choicesModal} onRequestClose={() => setChoicesModal(false)}>
        <TouchableOpacity
          style={styles.choicesModalOverlay}
          activeOpacity={1}
          onPress={() => setChoicesModal(false)}
        >
          <View style={styles.choicesOptions}>
            {["My Furbabies", "Pets Adopted", "Success Paws"].map(
              (option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleChoiceSelect(option)}
                  style={styles.choicesDropdown}
                >
                  <Text style={styles.choicesDropdownText}>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SettingsPage;
