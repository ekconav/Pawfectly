import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
  TextInput,
} from "react-native";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db, auth, storage } from "../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import Modal from "react-native-modal";
import COLORS from "../../const/colors";
import styles from "./styles";

const truncateFilename = (filename, maxLength = 20) => {
  if (filename.length <= maxLength) return filename;
  return filename.substring(0, maxLength) + "...";
};

const DisplayUser = ({ route }) => {
  const { userId } = route.params;
  const [userDetails, setUserDetails] = useState({});
  const [pets, setPets] = useState([]);
  const [coverPhoto, setCoverPhoto] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userToUser, setUserToUser] = useState(false);
  const [checkVerify, setCheckVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmReportLoading, setConfirmReportLoading] = useState(false);
  const [petsLoading, setPetsLoading] = useState(false);
  const [isSettingModalVisible, setIsSettingModalVisible] = useState(false);

  const [openReportModal, setOpenReportModal] = useState(false);
  const [subjectTitle, setSubjectTitle] = useState("");
  const [fileName, setFileName] = useState("");
  const [screenshotImage, setScreenshotImage] = useState("");
  const [reason, setReason] = useState("");

  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [donationModal, setDonationModal] = useState(false);
  const [qrForDonation, setQrForDonation] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const shelterDocRef = doc(db, "shelters", userId);
        const userDocRef = doc(db, "users", userId);

        const [shelterDoc, userDoc] = await Promise.all([
          getDoc(shelterDocRef),
          getDoc(userDocRef),
        ]);

        if (shelterDoc.exists()) {
          const shelterData = shelterDoc.data();
          setUserDetails(shelterData);

          setProfileImage(
            shelterData.accountPicture
              ? { uri: shelterData.accountPicture }
              : require("../../components/user.png")
          );

          setCoverPhoto(
            shelterData.coverPhoto
              ? { uri: shelterData.coverPhoto }
              : require("../../components/landingpage.png")
          );

          setQrForDonation({ uri: shelterData.qrCode });

          setCheckVerify(shelterData.verified === true);
        } else if (userDoc.exists()) {
          setUserToUser(true);
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

          setCheckVerify(userData.verified === true);
        } else {
          console.log("User not found in either collection");
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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

  const handleDownloadQR = async () => {
    if (qrForDonation && qrForDonation.uri) {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== "granted") {
          setModalMessage("Permission to access media library is required.");
          setAlertModal(true);
          return;
        }

        const fileUri = `${FileSystem.documentDirectory}qrCode.png`;
        const { uri } = await FileSystem.downloadAsync(qrForDonation.uri, fileUri);
        await MediaLibrary.createAssetAsync(uri);

        setModalMessage("QR Code downloaded and saved to your photo gallery!");
        setAlertModal(true);
      } catch (error) {
        console.error("Error downloading the file: ", error);
        setModalMessage("There was an error downloading the QR code.");
        setAlertModal(true);
      }
    } else {
      setModalMessage("No QR code to download.");
      setAlertModal(true);
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
        return;
      }

      if (!screenshotImage) {
        setModalMessage("Please upload a screenshot for us to verify.");
        setAlertModal(true);
        return;
      }

      const user = auth.currentUser;
      const reportsRef = collection(db, "reports");
      let screenshotUrl = "";

      if (screenshotImage) {
        try {
          const response = await fetch(screenshotImage);
          const blob = await response.blob();

          const fileRef = ref(storage, `screenshots/${user.uid}`);
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
    if (option === "Report Account") {
      setOpenReportModal(true);
    } else if (option === "Donate to Shelter") {
      setDonationModal(true);
    }
  };

  const handleCancelButton = () => {
    setSubjectTitle("");
    setReason("");
    setFileName("");
    setScreenshotImage("");

    setOpenReportModal(false);
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
      {!userToUser ? (
        <View style={styles.infoDetails}>
          <View style={styles.infoContainer}>
            <Text style={styles.infoName}>{userDetails.shelterName}</Text>
            <Ionicons
              style={!checkVerify ? styles.iconNotVerified : styles.iconVerified}
              name="checkmark-circle-outline"
              size={20}
            />
          </View>
          <Text style={styles.infoOwnerText}>Owner: {userDetails.shelterOwner}</Text>
        </View>
      ) : (
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
      )}
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
          <Text style={styles.infoDetailsText}>{userDetails.address}</Text>
        </View>
      </View>
      <View style={styles.furbabiesContainer}>
        {!userToUser ? (
          <Text style={styles.furbabiesText}>Pets for Adoption</Text>
        ) : (
          <Text style={styles.furbabiesText}>My Furbabies</Text>
        )}
        {pets.length === 0 && !petsLoading ? (
          <View style={styles.noPetsContainer}>
            <Text style={styles.noPetsText}>No pets posted at the moment.</Text>
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
                        navigation.navigate("DetailsPage", { pet: item })
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
        onRequestClose={() => setIsSettingModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSettingModalVisible(false)}
        >
          <View
            style={!userToUser ? styles.dropdownMenu : styles.dropdownMenuUserToUser}
          >
            {["Report Account", !userToUser ? "Donate to Shelter" : ""].map(
              (option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text style={styles.dropdownText}>{option}</Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </TouchableOpacity>
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
              <Text style={styles.reportInputTitle}>Subject</Text>
              <TextInput
                style={styles.reportInput}
                value={subjectTitle}
                onChangeText={(text) => setSubjectTitle(text)}
              />
            </View>
            <View style={styles.reportInputContainer}>
              <Text style={styles.reportInputTitle}>Reason</Text>
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
                Please attach a screenshot for proof
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
      <Modal
        isVisible={donationModal}
        onRequestClose={() => setDonationModal(false)}
      >
        <View style={styles.donationModalContainer}>
          <View style={styles.donationHeader}>
            <Ionicons
              name="arrow-back-outline"
              size={20}
              color={COLORS.prim}
              onPress={() => setDonationModal(false)}
            />
            <Text style={styles.donationTitle}>Donate to Shelter</Text>
          </View>
          <View style={styles.qrImageContainer}>
            {qrForDonation && qrForDonation.uri ? (
              <Image source={qrForDonation} style={styles.qrImage} />
            ) : (
              <Text style={styles.noQrCodeText}>
                Sorry, the shelter hasn't set up their donation details.
              </Text>
            )}
          </View>
          <View style={styles.donationButtonContainer}>
            {qrForDonation && qrForDonation.uri && (
              <TouchableOpacity
                style={styles.donationButton}
                onPress={handleDownloadQR}
              >
                <Text style={styles.donationText}>Download QR Code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DisplayUser;
