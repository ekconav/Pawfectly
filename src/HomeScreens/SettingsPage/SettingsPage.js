import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  TouchableWithoutFeedback,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import COLORS from "../../const/colors";
import Modal from "react-native-modal";
import Checkbox from "expo-checkbox";

const SettingsPage = () => {
  const [userDetails, setUserDetails] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [checkVerify, setCheckVerify] = useState(false);
  const [isAddPetModalVisible, setIsAddPetModalVisible] = useState(false);
  const [pets, setPets] = useState([]);
  const [petDocumentId, setPetDocumentId] = useState("");
  const [loading, setLoading] = useState(true);

  // For Modal
  const [petImage, setPetImage] = useState("");
  const [petName, setPetName] = useState("");
  const [maleChecked, setMaleChecked] = useState(false);
  const [femaleChecked, setFemaleChecked] = useState(false);
  const [petBreed, setPetBreed] = useState("");

  // Setting Modal
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  // Pet Details Modal
  const [isPetDetailsModalVisible, setIsPetDetailsModalVisible] = useState(false);
  const [newPetImage, setNewPetImage] = useState(null);
  const [fetchPetImage, setFetchPetImage] = useState(null);
  const [fetchPetName, setFetchPetName] = useState("");
  const [fetchPetBreed, setFetchPetBreed] = useState("");
  const [fetchMaleChecked, setFetchMaleChecked] = useState(false);
  const [fetchFemaleChecked, setFetchFemaleChecked] = useState(false);

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

        const furbabiesRef = query(
          collection(db, "users", user.uid, "furbabies"),
          orderBy("petUploaded", "desc")
        );

        const unsubscribeFurbabies = onSnapshot(furbabiesRef, async (snapshot) => {
          try {
            const furbabiesData = snapshot.docs.map((doc) => {
              const petData = doc.data();
              return { id: doc.id, ...petData, imageUrl: null };
            });

            setPets(furbabiesData);

            setLoading(true);
            await Promise.all(
              furbabiesData.map(async (pet, index) => {
                const imageUrl = await getDownloadURL(ref(storage, pet.image));
                setPets((prevPets) => {
                  const newPets = [...prevPets];
                  newPets[index].imageUrl = imageUrl;
                  return newPets;
                });
              })
            );
            setLoading(false);
          } catch (error) {
            console.error("Error fetching furbabies data: ", error);
          } finally {
            setLoading(false);
          }
        });

        return () => unsubscribeFurbabies();
      } else {
        setPets([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // For profile account picture
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      const { uri } = result.assets[0];
      const user = auth.currentUser;

      if (user) {
        setLoading(true);
        try {
          const response = await fetch(uri);
          const blob = await response.blob();
          const storageRef = ref(storage, `profilePictures/${user.uid}`);
          await uploadBytes(storageRef, blob);

          const downloadURL = await getDownloadURL(storageRef);

          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, {
            accountPicture: downloadURL,
          });
          setProfileImage({ uri: downloadURL });
        } catch (error) {
          console.error("Error uploading profile picture: ", error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

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

  // For furbabies pick photo
  const handlePickPetImage = async () => {
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
        const storageRef = ref(storage, `petPictures/${user.uid}/${timestamp}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        setPetImage({ uri: downloadURL });
      }
    }
  };

  const handleCancelButton = async () => {
    setIsAddPetModalVisible(false);
    setPetImage("");
    setPetName("");
    setMaleChecked(false);
    setFemaleChecked(false);
    setPetBreed("");
  };

  const handleSubmitPet = async () => {
    if (!petImage || !petName || !petBreed || (!maleChecked && !femaleChecked)) {
      Alert.alert("Error", "Please fill in all fields and add an image.");
      return;
    }
    const petImageUrl = typeof petImage === "string" ? petImage : petImage.uri;

    try {
      const user = auth.currentUser;
      if (user) {
        const furbabiesRef = collection(db, "users", user.uid, "furbabies");
        await addDoc(furbabiesRef, {
          image: petImageUrl,
          petName: petName,
          gender: maleChecked ? "Male" : "Female",
          breed: petBreed,
          petUploaded: serverTimestamp(),
        });
        setPetImage("");
        setPetName("");
        setMaleChecked(false);
        setFemaleChecked(false);
        setPetBreed("");
      }
    } catch (error) {
      console.error("Error submitting pet: ", error);
    } finally {
      setIsAddPetModalVisible(false);
    }
  };

  const handleMaleCheck = () => {
    setMaleChecked(true);
    setFemaleChecked(false);
  };

  const handleFemaleCheck = () => {
    setFemaleChecked(true);
    setMaleChecked(false);
  };

  const handleEditMaleCheck = () => {
    setFetchMaleChecked(true);
    setFetchFemaleChecked(false);
  };

  const handleEditFemaleCheck = () => {
    setFetchMaleChecked(false);
    setFetchFemaleChecked(true);
  };

  const handleOpenPetDetailsModal = (pet) => {
    setPetDocumentId(pet.id);
    setFetchPetName(pet.petName);
    setFetchPetBreed(pet.breed);
    setFetchPetImage(pet.imageUrl);
    setFetchMaleChecked(pet.gender === "Male");
    setFetchFemaleChecked(pet.gender === "Female");
    setIsPetDetailsModalVisible(true);
  };

  const handleEditPetImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: null,
      quality: 1,
    });

    if (!result.canceled) {
      setFetchPetImage(null);
      setNewPetImage(null);
      const { uri } = result.assets[0];
      const user = auth.currentUser;

      if (user) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const timestamp = new Date().getTime();
        const storageRef = ref(storage, `petPictures/${user.uid}/${timestamp}`);
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);

        setNewPetImage(downloadURL);
      }
    }
  };

  const handleDeleteButton = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const furbabiesRef = doc(db, "users", user.uid, "furbabies", petDocumentId);

        await deleteDoc(furbabiesRef);
      }
    } catch (error) {
      console.error("Error deleting pet: ", error);
    } finally {
      setIsPetDetailsModalVisible(false);
    }
  };

  const handleEditPet = async () => {
    try {
      const petImageUrl = newPetImage
        ? typeof newPetImage === "string"
          ? newPetImage
          : newPetImage.uri
        : typeof fetchPetImage === "string"
        ? fetchPetImage
        : fetchPetImage?.uri;

      if (!petImageUrl) {
        console.error("No valid pet image URL found.");
        return;
      }
      const user = auth.currentUser;
      if (user) {
        const furbabiesRef = doc(db, "users", user.uid, "furbabies", petDocumentId);

        await updateDoc(furbabiesRef, {
          image: petImageUrl,
          petName: fetchPetName,
          gender: fetchMaleChecked ? "Male" : "Female",
          breed: fetchPetBreed,
        });
      }
    } catch (error) {
      console.error("Error updating pet: ", error);
    } finally {
      setNewPetImage(null);
      setFetchPetImage(null);
      setFetchPetName("");
      setFetchPetBreed("");
      setFetchMaleChecked(false);
      setFetchFemaleChecked(false);
      setIsPetDetailsModalVisible(false);
    }
  };

  const handleOptionSelect = (option) => {
    setIsSettingModalVisible(false);
    if (option === "Logout") {
      handleLogout();
    } else if (option === "Account") {
      navigation.navigate("Account");
    } else if (option === "About") {
      navigation.navigate("About");
    } else if (option === "Change Password") {
      navigation.navigate("Change Password");
    } else if (option === "Terms of Service") {
      navigation.navigate("Terms of Service");
    } else if (option === "Privacy Policy") {
      navigation.navigate("Privacy Policy");
    } else if (option === "Request Account Deletion") {
      navigation.navigate("Request Account Deletion");
    }
    console.log(option);
  };

  const handleOverlayPress = () => {
    setIsAddPetModalVisible(false);
    setPetImage("");
    setPetName("");
    setMaleChecked(false);
    setFemaleChecked(false);
    setPetBreed("");
  };

  const handleContentPress = (event) => {
    event.stopPropagation();
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

  return (
    <View style={styles.container}>
      <View style={styles.coverPhotoContainer}>
        <TouchableOpacity onPress={handlePickCover}>
          <Image source={coverImage} style={styles.coverPhoto} />
        </TouchableOpacity>
      </View>
      <View style={styles.profileImageContainer}>
        <TouchableOpacity style={styles.profileButton} onPress={handlePickImage}>
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
          <Ionicons name="location-outline" size={20} style={styles.userDetailsIcon} />
          <Text style={styles.userDetailsText}>{userDetails.address}</Text>
        </View>
      </View>
      <View style={styles.furbabiesContainer}>
        <View style={styles.titleButton}>
          <Text style={styles.furbabiesText}>My Furbabies</Text>
          <TouchableOpacity
            style={styles.addPetButton}
            onPress={() => setIsAddPetModalVisible(true)}
          >
            <Ionicons name="add-outline" size={14} color={COLORS.white} />
            <Text style={styles.addPetButtonText}>Add Your Pet</Text>
          </TouchableOpacity>
        </View>

        {pets.length === 0 ? (
          <View style={styles.noResultContainer}>
            <Text style={styles.noResultsText}>Showcase your pets here!</Text>
          </View>
        ) : (
          <View style={styles.showcasePetsContainer}>
            <FlatList
              data={pets}
              numColumns={2}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.petButton}
                    onPress={() => handleOpenPetDetailsModal(item)}
                  >
                    <View style={styles.imageContainer}>
                      {loading ? (
                        <View style={styles.imageLoading}>
                          <ActivityIndicator size="small" color={COLORS.prim} />
                        </View>
                      ) : (
                        <Image
                          source={{
                            uri: item.imageUrl,
                          }}
                          style={styles.petImage}
                        />
                      )}
                    </View>

                    <View style={styles.petDetails}>
                      <View style={styles.petNameGender}>
                        <Text style={styles.petName}>{item.petName}</Text>
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
                      <Text style={styles.petBreedText}>{item.breed}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      </View>

      {/* Add Pet Modal */}
      <Modal isVisible={isAddPetModalVisible} onRequestClose={() => setIsAddPetModalVisible(false)}>
        <TouchableOpacity
          style={styles.addPetModalOverlay}
          activeOpacity={1}
          onPress={handleOverlayPress}
        >
          <TouchableWithoutFeedback onPress={handleContentPress}>
            <View style={styles.addPetModalContainer}>
              <Text style={styles.modalTitle}>Showcase Your Pet!</Text>
              <View style={styles.addImageContainer}>
                <TouchableOpacity style={styles.modalAddPetImage} onPress={handlePickPetImage}>
                  {!petImage ? (
                    <View style={styles.iconAndText}>
                      <Ionicons name="image-outline" size={20} color={COLORS.title} />
                      <Text style={styles.modalText}>Add Image</Text>
                    </View>
                  ) : (
                    <Image source={petImage} style={styles.petPreviewImage} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.addPetInputContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.modalText}>Pet Name</Text>
                  <TextInput
                    style={styles.addPetInput}
                    value={petName}
                    onChangeText={(text) => setPetName(text)}
                  />
                </View>
                <View style={styles.inputGenderContainer}>
                  <Text style={styles.modalText}>Gender</Text>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={maleChecked}
                      onValueChange={handleMaleCheck}
                      color={COLORS.prim}
                    />
                    <Text style={styles.modalText}>Male</Text>
                  </View>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={femaleChecked}
                      onValueChange={handleFemaleCheck}
                      color={COLORS.prim}
                    />
                    <Text style={styles.modalText}>Female</Text>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.modalText}>Breed</Text>
                  <TextInput
                    style={styles.addPetInput}
                    value={petBreed}
                    onChangeText={(text) => setPetBreed(text)}
                  />
                </View>
              </View>
              <View style={styles.addPetButtonContainer}>
                <TouchableOpacity style={styles.modalSubmitButton} onPress={handleSubmitPet}>
                  <Text style={styles.modalSubmitText}>Submit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCancelButton} style={styles.modalCancelButton}>
                  <Text style={styles.modalText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>

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
              "Account",
              "About",
              "Change Password",
              "Terms of Service",
              "Privacy Policy",
              "Request Account Deletion",
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

      {/* Pet Details Modal */}
      <Modal
        animationType="fade"
        isVisible={isPetDetailsModalVisible}
        onRequestClose={() => setIsPetDetailsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.petDetailsOverlay}
          activeOpacity={1}
          onPress={() => setIsPetDetailsModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={handleContentPress}>
            <View style={styles.addPetModalContainer}>
              <Text style={styles.modalTitle}>Edit Pet</Text>
              <View style={styles.addImageContainer}>
                <TouchableOpacity style={styles.modalAddPetImage} onPress={handleEditPetImage}>
                  {!fetchPetImage ? (
                    <Image source={{ uri: newPetImage }} style={styles.petPreviewImage} />
                  ) : (
                    <Image source={{ uri: fetchPetImage }} style={styles.petPreviewImage} />
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.addPetInputContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.modalText}>Pet Name</Text>
                  <TextInput
                    style={styles.addPetInput}
                    value={fetchPetName}
                    onChangeText={(text) => setFetchPetName(text)}
                  />
                </View>
                <View style={styles.inputGenderContainer}>
                  <Text style={styles.modalText}>Gender</Text>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={fetchMaleChecked}
                      onValueChange={handleEditMaleCheck}
                      color={COLORS.prim}
                    />
                    <Text style={styles.modalText}>Male</Text>
                  </View>
                  <View style={styles.checkBoxContainer}>
                    <Checkbox
                      value={fetchFemaleChecked}
                      onValueChange={handleEditFemaleCheck}
                      color={COLORS.prim}
                    />
                    <Text style={styles.modalText}>Female</Text>
                  </View>
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.modalText}>Breed</Text>
                  <TextInput
                    style={styles.addPetInput}
                    value={fetchPetBreed}
                    onChangeText={(text) => setFetchPetBreed(text)}
                  />
                </View>
              </View>
              <View style={styles.addPetButtonContainer}>
                <TouchableOpacity style={styles.petDetailsSaveButton} onPress={handleEditPet}>
                  <Text style={styles.modalSubmitText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleDeleteButton}
                  style={styles.petDetailsDeleteButton}
                >
                  <Text style={styles.petDetailsDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default SettingsPage;
