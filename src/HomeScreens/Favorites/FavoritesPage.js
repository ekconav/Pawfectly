import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../../FirebaseConfig";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import styles from "./styles";
import COLORS from "../../const/colors";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";

const FavoritesPage = () => {
  const [favoritePets, setFavoritePets] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const favoritesRef = collection(db, "users", user.uid, "favorites");

      const unsubscribe = onSnapshot(favoritesRef, async (querySnapshot) => {
        try {
          const petDetailsPromises = querySnapshot.docs.map(async (favoriteDoc) => {
            const petId = favoriteDoc.data().petId;
            const petRef = doc(db, "pets", petId);
            const petDoc = await getDoc(petRef);
            if (petDoc.exists()) {
              return { id: petId, ...petDoc.data() };
            }
            return null;
          });

          const petDetailsArray = await Promise.all(petDetailsPromises);
          setFavoritePets(petDetailsArray.filter(Boolean));
        } catch (error) {
          console.error("Error fetching favorite pets: ", error);
        } finally {
          setLoading(false);
        }
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setProfileImage(
          userData.accountPicture
            ? { uri: userData.accountPicture }
            : require("../../components/user.png")
        );
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (petId) => {
    const user = auth.currentUser;

    if (user) {
      const favoritesRef = collection(db, "users", user.uid, "favorites");
      try {
        const q = query(favoritesRef, where("petId", "==", petId));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setFavoritePets((prevPets) => prevPets.filter((pet) => pet.id !== petId));
      } catch (error) {
        console.error("Error deleting favorite pet: ", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.prim} />
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const renderRightActions = () => (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons style={styles.deleteIcon} name="trash-outline" size={24} />
      </TouchableOpacity>
    );
    return (
      <Swipeable renderRightActions={renderRightActions}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.petButton}
            onPress={() => navigation.navigate("DetailsPage", { pet: item })}
          >
            <View style={styles.petContainer}>
              <Image source={{ uri: item.images }} style={styles.petImage} />
              <View style={styles.petDetails}>
                <View style={styles.petNameGender}>
                  <Text style={styles.petName}>{item.name}</Text>
                  <Text>
                    {item.gender.toLowerCase() === "male" ? (
                      <View style={styles.genderIconContainer}>
                        <Ionicons
                          style={styles.petGenderIconMale}
                          name="male"
                          size={24}
                          color={COLORS.male}
                        />
                      </View>
                    ) : (
                      <View style={styles.genderIconContainer}>
                        <Ionicons
                          style={styles.petGenderIconFemale}
                          name="female"
                          size={24}
                          color={COLORS.female}
                        />
                      </View>
                    )}
                  </Text>
                </View>
                <View style={styles.addressContainer}>
                  <View style={styles.iconAddress}>
                    <Ionicons
                      name="location-outline"
                      size={24}
                      color={COLORS.prim}
                    />
                    <Text style={styles.petAddress}>{item.location}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.accountName}>Favorites</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Set")}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
      {favoritePets.length === 0 ? (
        <View style={styles.noTextContainer}>
          <Text style={styles.noFavoritesText}>Uh oh, choose a lovely pet now!</Text>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <Text style={styles.pageTitle}>Your Favorite Pets</Text>
          <FlatList
            data={favoritePets}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      )}
    </View>
  );
};

export default FavoritesPage;
