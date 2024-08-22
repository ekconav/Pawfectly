import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import COLORS from "../../const/colors";
import { useNavigation } from "@react-navigation/native";
import styles from "../DetailsPage/styles";
import { auth, db } from "../../FirebaseConfig";
import {
  getDoc,
  doc,
  addDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const DetailsPage = ({ route }) => {
  const [petDetails, setPetDetails] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [shelterImage, setShelterImage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const { pet } = route.params;
        const shelterRef = doc(db, "shelters", pet.userId);
        const docSnap = await getDoc(shelterRef);

        if (!docSnap.exists()) {
          console.log("No such document!");
        } else {
          console.log("Document data: ", docSnap.data());
          pet.shelterName = docSnap.data().shelterName;
          pet.location = docSnap.data().address;
          pet.accountPicture = docSnap.data().accountPicture;
          pet.mobileNumber = docSnap.data().mobileNumber;
          setShelterImage(
            pet.accountPicture
              ? { uri: pet.accountPicture }
              : require("../../components/user.png")
          );
          setMobileNumber(pet.mobileNumber);
        }
        setPetDetails(pet);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPetDetails();
  }, [route.params]);

  const handleAdoption = async () => {
    const userId = auth.currentUser.uid;
    const shelterId = petDetails.userId;
    const petId = petDetails.id;

    const conversationId = `${userId}_${shelterId}_${petId}`;

    navigation.navigate("MessagePage", {
      conversationId,
      userId,
      shelterId,
      petId,
    });
  };

  const handleFavorite = async () => {
    try {
      const userId = auth.currentUser.uid;
      const petId = petDetails.id;

      const favoritesRef = collection(db, "favorites");

      const q = query(
        favoritesRef,
        where("userId", "==", userId),
        where("petId", "==", petId)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("", "This pet is already in your favorites.");
        return;
      }

      await addDoc(favoritesRef, {
        userId: userId,
        petId: petId,
      });

      console.log("Favorite added successfully");
    } catch (error) {
      console.error("Error adding favorite: ", error);
    }
    navigation.navigate("Favorites");
  };

  const handleCall = async () => {
    try {
      if (mobileNumber) {
        await Linking.openURL(`tel:${mobileNumber}`);
      } else {
        Alert.alert(
          "No phone number available",
          "The shelter's phone number is not available."
        );
      }
    } catch (error) {
      console.error("Error initiating call:", error);
      Alert.alert("Error", "There was an error trying to make a call.");
    }
  };

  if (!petDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.prim} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: petDetails.images }} style={styles.petImage} />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.overlayButton}
        >
          <View style={styles.arrowContainer}>
            <Ionicons
              name="arrow-back-outline"
              size={24}
              color={COLORS.title}
            />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.petDetails}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
      >
        <Text style={styles.petName}>{petDetails.name}</Text>
        <View style={styles.addressInformation}>
          <Ionicons name="location-outline" size={24} color={COLORS.prim} />
          <Text style={styles.textAddress}>{petDetails.location}</Text>
        </View>
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
        <View style={styles.shelterContainer}>
          <View style={styles.shelterInfo}>
            <Image source={shelterImage} style={styles.shelterImage} />
            <View>
              <Text style={styles.midInfoTitle}>Currently In:</Text>
              <Text style={styles.shelterName}>{petDetails.shelterName}</Text>
            </View>
          </View>
          <View style={styles.callMessage}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
              <Ionicons name="call-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAdoption}
            >
              <Ionicons name="chatbox-outline" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutTitle}>About {petDetails.name}</Text>
          <Text style={styles.aboutDescription}>{petDetails.description}</Text>
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <View style={styles.favoriteContainer}>
          <TouchableOpacity style={styles.button} onPress={handleFavorite}>
            <Ionicons name="heart-outline" size={22} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        <View style={styles.adoptMeContainer}>
          <TouchableOpacity style={styles.button} onPress={handleAdoption}>
            <Text style={styles.textButton}>Adopt Me</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DetailsPage;
