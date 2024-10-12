import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../FirebaseConfig";
import COLORS from "../../const/colors";
import styles from "./styles";

const DetailsPageShelter = ({ route }) => {
  const { pet } = route.params;

  const [petDetails, setPetDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [userImage, setUserImage] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const userDocRef = doc(db, "users", pet.userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          pet.userName = `${userData.firstName} ${userData.lastName}`;
          pet.location = userData.address;
          pet.accountPicture = userData.accountPicture;
          pet.mobileNumber = userData.mobileNumber;
          setUserImage(
            pet.accountPicture
              ? { uri: pet.accountPicture }
              : require("../../components/user.png")
          );
          setMobileNumber(pet.mobileNumber);

          const petRef = doc(db, "pets", pet.id);
          const unsubscribePet = onSnapshot(petRef, (petSnap) => {
            if (petSnap.exists()) {
              const petData = petSnap.data();
              setPetDetails(petData);
            }
          });
          setUserDetails(pet);

          return () => unsubscribePet();
        }
      } catch (error) {
        console.error("Error fetching pet details: ", error);
      }
    };
    fetchPetDetails();
  }, [route.params]);

  if (!petDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.prim} />
      </View>
    );
  }

  const petPostedDate = petDetails.petPosted.toDate();
  const formattedDate = petPostedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: petDetails.images }} style={styles.petImage} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.overlayButton}
        >
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.title} />
        </TouchableOpacity>
      </View>
      <View style={styles.petStyles}>
        <ScrollView contentContainerStyle={styles.petDetails}>
          <View style={styles.petNamePriceContainer}>
            <Text style={styles.petName}>{petDetails.name}</Text>
            <View>
              {petDetails.petPrice ? (
                <Text style={styles.petPriceTitle}>Adoption Fee:</Text>
              ) : null}
              {petDetails.petPrice ? (
                <Text style={styles.petPrice}>₱ {petDetails.petPrice}</Text>
              ) : (
                <Text style={styles.petPrice}>Free</Text>
              )}
            </View>
          </View>
          <Text style={styles.petPostedDate}>Pet Posted: {formattedDate}</Text>
          <View style={styles.midInfoContainer}>
            <View style={styles.midInfo}>
              <Text style={styles.midInfoDetail}>{petDetails.gender}</Text>
              <Text style={styles.midInfoTitle}>Sex</Text>
            </View>
            <View style={styles.midInfo}>
              <Text style={styles.midInfoDetail}>{petDetails.breed}</Text>
              <Text style={styles.midInfoTitle}>Breed</Text>
            </View>
            <View style={styles.midInfo}>
              <Text style={styles.midInfoDetail}>{petDetails.age}</Text>
              <Text style={styles.midInfoTitle}>Age</Text>
            </View>
          </View>
          <View style={styles.userContainer}>
            <View style={styles.userInfo}>
              <Image source={userImage} style={styles.userImage} />
              <View style={styles.userTextContainer}>
                <Text style={styles.midInfoTitle}>Currently With: </Text>
                <Text style={styles.userName}>{userDetails.userName}</Text>
              </View>
            </View>
          </View>
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>About {petDetails.name}</Text>
            <Text style={styles.aboutDescription}>{petDetails.description}</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default DetailsPageShelter;
