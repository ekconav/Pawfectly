import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { auth, db, storage } from "../../FirebaseConfig";
import {
  getDoc,
  doc,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getDownloadURL, ref } from "firebase/storage";
import Modal from "react-native-modal";
import COLORS from "../../const/colors";
import styles from "./styles";

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

          setCheckVerify(userData.verified === true);
        } else {
          console.log("User doesn't exist");
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
          <Text style={styles.infoDetailsText}>{userDetails.address}</Text>
        </View>
      </View>
      <View style={styles.furbabiesContainer}>
        <Text style={styles.furbabiesText}>My Furbabies</Text>
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
        onRequestClose={() => setIsSettingModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsSettingModalVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {["Report Account"].map((option, index) => (
              <TouchableOpacity key={index} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default DisplayUserPage;
