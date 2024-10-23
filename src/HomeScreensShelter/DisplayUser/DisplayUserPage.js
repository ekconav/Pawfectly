import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import { auth, db, storage } from "../../FirebaseConfig";
import {
  getDoc,
  doc,
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { WebView } from "react-native-webview";
import * as ImagePicker from "expo-image-picker";
import Modal from "react-native-modal";
import COLORS from "../../const/colors";
import styles from "./styles";

const truncateFilename = (filename, maxLength = 20) => {
  if (filename.length <= maxLength) return filename;
  return filename.substring(0, maxLength) + "...";
};

const DisplayUserPage = ({ route }) => {
  const { userId } = route.params;
  const [userDetails, setUserDetails] = useState({});
  const [pets, setPets] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [checkVerify, setCheckVerify] = useState(false);
  const [petsLoading, setPetsLoading] = useState(false);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmReportLoading, setConfirmReportLoading] = useState(false);

  const [openReportModal, setOpenReportModal] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [screenshotImage, setScreenshotImage] = useState("");
  const [reason, setReason] = useState("");

  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [accountDeleted, setAccountDeleted] = useState(false);

  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [getAddress, setGetAddress] = useState("");

  const [required, setRequired] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserDetails(userData);

          setProfileImage(
            userData.accountPicture
              ? { uri: userData.accountPicture }
              : require("../../components/user.png")
          );

          setCoverPhoto(
            userData.coverPhoto
              ? { uri: userData.coverPhoto }
              : require("../../components/landingpage.png")
          );

          setGetAddress(userData.address);

          setCheckVerify(userData.verified === true);
        } else {
          console.log("User doesn't exist");
          const adoptedByRef = doc(
            db,
            "shelters",
            auth.currentUser.uid,
            "adoptedBy",
            userId
          );
          const adoptedByDoc = await getDoc(adoptedByRef);
          if (adoptedByDoc.exists()) {
            setAccountDeleted(true);
            const userData = adoptedByDoc.data();
            setUserDetails(userData);

            setProfileImage(
              userData.accountPicture
                ? { uri: userData.accountPicture }
                : require("../../components/user.png")
            );

            setCoverPhoto(
              userData.coverPhoto
                ? { uri: userData.coverPhoto }
                : require("../../components/landingpage.png")
            );
          }
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const googleMapsUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    getAddress
  )}`;

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setPetsLoading(true);
    try {
      const petsCollection = collection(db, "pets");

      const petsQuery = query(
        petsCollection,
        where("userId", "==", userId),
        where("adopted", "==", false)
      );

      const unsubscribePets = onSnapshot(petsQuery, async (snapshot) => {
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
          setPets(petsWithImageUrls);
          setPetsLoading(false);
        } catch (error) {
          console.error("Error fetching pets data: ", error);
          setPetsLoading(false);
        }
      });

      return () => unsubscribePets();
    } catch (error) {
      console.error("Error fetching pet data: ", error);
      setPetsLoading(false);
    }
  }, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: null,
      quality: 1,
    });

    if (!result.canceled) {
      const { uri } = result.assets[0];
      setScreenshotImage(uri);
      setFileName(truncateFilename(result.assets[0].fileName));
    }
  };

  const handleConfirmReport = async () => {
    setConfirmReportLoading(true);

    try {
      if (!subjectTitle || !reason) {
        setModalMessage("Please fill in all fields.");
        setAlertModal(true);
        setRequired(true);
        return;
      }

      if (!screenshotImage) {
        setModalMessage("Please upload a screenshot for us to verify.");
        setAlertModal(true);
        setRequired(true);
        return;
      }

      const user = auth.currentUser;
      const reportsRef = collection(db, "reports");
      let screenshotUrl = "";

      if (screenshotImage) {
        try {
          const response = await fetch(screenshotImage);
          const blob = await response.blob();

          const fileRef = ref(storage, `reports/${user.uid}/${timestamp}`);
          await uploadBytes(fileRef, blob);
          screenshotUrl = await getDownloadURL(fileRef);
        } catch (error) {
          setModalMessage("Error uploading image. Please try again.");
          setAlertModal(true);
          return;
        }
      }

      await addDoc(reportsRef, {
        reportedBy: user.uid,
        reportedAccount: userId,
        subject: subjectTitle,
        reason: reason,
        screenshot: screenshotUrl,
        status: "Pending",
      });

      setModalMessage(
        "Thank you for submitting this report. Our team will review your report and take the necessary actions. We appreciate your help in keeping Pawfectly safe."
      );
      setAlertModal(true);

      setSubjectTitle("");
      setReason("");
      setFileName("");
      setScreenshotImage("");
      setOpenReportModal(false);
    } catch (error) {
      console.error("Error confirming report: ", error);
      setModalMessage(
        "An error occurred while submitting the report. Please try again."
      );
      setAlertModal(true);
    } finally {
      setConfirmReportLoading(false);
    }
  };

  const handleOptionSelect = (option) => {
    setIsSettingModalVisible(false);
    if (option === "Report Account" && !accountDeleted) {
      setOpenReportModal(true);
    } else {
      setModalMessage("Account has been deleted.");
      setAlertModal(true);
    }
  };

  const handleCancelButton = () => {
    setSubjectTitle("");
    setReason("");
    setFileName("");
    setScreenshotImage("");
    setRequired(false);

    setOpenReportModal(false);
  };

  const toggleSetting = () => {
    setIsSettingModalVisible(!isSettingModalVisible);
  };

  const toggleMapModal = () => {
    setMapModalVisible(!mapModalVisible);
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
      <Image source={coverPhoto} style={styles.coverPhoto} />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.overlayButton}
      >
        <Ionicons name="arrow-back-outline" size={24} color={COLORS.title} />
      </TouchableOpacity>
      <View style={styles.profileImageContainer}>
        <View style={styles.profile}>
          <Image source={profileImage} style={styles.profileImage} />
        </View>
        <TouchableOpacity
          style={styles.settingsIcon}
          onPress={() => setIsSettingModalVisible(true)}
        >
          <Ionicons name="settings-outline" size={26} color={COLORS.title} />
        </TouchableOpacity>
      </View>
      <View style={styles.infoDetails}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoName}>
            {userDetails.firstName} {userDetails.lastName}
          </Text>
          <Ionicons
            style={!checkVerify ? styles.iconNotVerified : styles.iconVerified}
            name="checkmark-circle-outline"
            size={20}
          />
        </View>
      </View>
      <View style={styles.infoDetailsContainer}>
        <View style={styles.iconTextContainer}>
          <Ionicons name="mail-outline" size={20} color={COLORS.prim} />
          <Text style={styles.infoDetailsText}>{userDetails.email}</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Ionicons name="call-outline" size={20} color={COLORS.prim} />
          <Text style={styles.infoDetailsText}>{userDetails.mobileNumber}</Text>
        </View>
        <View style={styles.iconTextContainer}>
          <Ionicons name="location-outline" size={20} color={COLORS.prim} />
          <TouchableOpacity onPress={toggleMapModal}>
            <Text style={styles.infoDetailsTextAddress}>{userDetails.address}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.furbabiesContainer}>
        <Text style={styles.furbabiesText}>My Furbabies</Text>
        {pets.length === 0 && !petsLoading ? (
          <View style={styles.noPetsContainer}>
            <Text style={styles.noPetsText}>
              {accountDeleted
                ? "Sorry, account has been deleted."
                : "No pets posted at the moment."}
            </Text>
          </View>
        ) : (
          <View style={styles.showPetsContainer}>
            {petsLoading ? (
              <ActivityIndicator
                style={{ flex: 1, justifyContent: "center" }}
                size="large"
                color={COLORS.prim}
              />
            ) : (
              <FlatList
                data={pets}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.petButton}
                      onPress={() =>
                        navigation.navigate("DetailsPageShelter", { pet: item })
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
      <Modal
        visible={isSettingModalVisible}
        animationType="fade"
        onBackdropPress={toggleSetting}
        onRequestClose={() => setIsSettingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dropdownMenu}>
            {["Report Account"].map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleOptionSelect(option)}
              >
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
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
      <Modal
        isVisible={openReportModal}
        onRequestClose={() => setOpenReportModal(false)}
      >
        <View style={styles.reportModalContainer}>
          <Text style={styles.reportTitle}>Report Account</Text>
          <View style={styles.reportMainInputContainer}>
            <View style={styles.reportInputContainer}>
              <Text style={styles.reportInputTitle}>
                Subject{" "}
                <Text
                  style={required && subjectTitle === "" ? styles.required : null}
                >
                  *
                </Text>
              </Text>
              <TextInput
                style={styles.reportInput}
                value={subjectTitle}
                onChangeText={(text) => setSubjectTitle(text)}
              />
            </View>
            <View style={styles.reportInputContainer}>
              <Text style={styles.reportInputTitle}>
                Reason{" "}
                <Text style={required && reason === "" ? styles.required : null}>
                  *
                </Text>
              </Text>
              <TextInput
                style={styles.reportInputReason}
                value={reason}
                onChangeText={(text) => setReason(text)}
                multiline
                textAlignVertical="top"
              />
            </View>
            <View style={styles.reportInputContainer}>
              <Text style={styles.reportInputTitle}>
                Please attach a screenshot for proof{" "}
                <Text style={required && fileName === "" ? styles.required : null}>
                  *
                </Text>
              </Text>
              <TouchableOpacity
                style={styles.reportUploadScreenshot}
                onPress={handlePickImage}
              >
                <Ionicons
                  style={styles.reportCloudIcon}
                  name="cloud-upload-outline"
                />
                <Text style={styles.reportFileUploadText}>
                  {fileName ? fileName : "File Upload"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.reportButtonContainer}>
              <TouchableOpacity
                style={styles.reportCancelButton}
                onPress={handleCancelButton}
              >
                <Text style={styles.reportButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.reportConfirmButton}
                onPress={handleConfirmReport}
              >
                {confirmReportLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.reportButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal map */}
      <Modal isVisible={mapModalVisible} onBackdropPress={toggleMapModal}>
        <View style={styles.modalContent}>
          <WebView source={{ uri: googleMapsUrl }} style={{ flex: 1 }} />
        </View>
      </Modal>
    </View>
  );
};

export default DisplayUserPage;
