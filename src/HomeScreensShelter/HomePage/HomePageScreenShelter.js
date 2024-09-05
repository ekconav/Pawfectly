import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../FirebaseConfig";
import { RefreshControl } from "react-native";
import { SettingOptionsShelter } from "../SettingsPage/SettingStackShelter";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../const/colors";
import ConversationPageShelter from "../ConversationsPage/ConversationPageShelter";
import Addpet from "../AddPet/AddPet";
import SearchBar from "../../HomeScreens/HomePage/SearchBar/SearchBar";
import catIcon from "../../components/catIcon.png";
import dogIcon from "../../components/dogIcon.png";
import styles from "./styles";

const Tab = createBottomTabNavigator();

const HomeScreenPet = () => {
  const [pets, setPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribePets = fetchPets();

    const unsubscribeShelter = onSnapshot(
      doc(db, "shelters", auth.currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setProfileImage(
            userData.accountPicture
              ? { uri: userData.accountPicture }
              : require("../../components/user.png")
          );
        }
      }
    );

    return () => {
      unsubscribePets && unsubscribePets();
      unsubscribeShelter();
    };
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const fetchPets = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return;
    }

    setLoading(true);
    try {
      const petsCollection = collection(db, "pets");
      const petsQuery = query(
        petsCollection,
        where("userId", "==", currentUser.uid),
        where("adopted", "==", false)
      );

      const unsubscribe = onSnapshot(petsQuery, (querySnapshot) => {
        const petsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPets(petsData);
        setAllPets(petsData);
        setLoading(false);
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error fetching pet data: ", error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setPets(allPets);
      return;
    }

    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const filteredPets = allPets.filter((pet) => {
      const { name, type, gender, age, breed, description } = pet;
      return (
        gender.toLowerCase() === lowerCaseSearchQuery ||
        name.toLowerCase().includes(lowerCaseSearchQuery) ||
        type.toLowerCase().includes(lowerCaseSearchQuery) ||
        age.toLowerCase().includes(lowerCaseSearchQuery) ||
        breed.toLowerCase().includes(lowerCaseSearchQuery) ||
        description.toLowerCase().includes(lowerCaseSearchQuery)
      );
    });

    setPets(filteredPets);
  };

  const handleCategoryFilter = (category) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      setPets(allPets);
    } else {
      setActiveCategory(category);
      setPets(allPets.filter((pet) => pet.type.toLowerCase() === category));
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPets();
    setRefreshing(false);
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
      <View style={styles.header}>
        <Text style={styles.accountName}>Home</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Set")}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch}
      />

      <View style={styles.categoryContainer}>
        <Text style={styles.categoriesTitle}>Pets for Adoption</Text>
        <View style={styles.categoryButtonContainer}>
          <TouchableOpacity
            style={[
              styles.categoryButton,
              activeCategory === "cat" && { backgroundColor: COLORS.prim },
            ]}
            onPress={() => handleCategoryFilter("cat")}
          >
            <Image style={styles.categoryIcon} source={catIcon} />
            <Text
              style={[
                styles.categoryName,
                activeCategory === "cat" && { color: COLORS.white },
              ]}
            >
              {" "}
              Cat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryButton,
              activeCategory === "dog" && { backgroundColor: COLORS.prim },
            ]}
            onPress={() => handleCategoryFilter("dog")}
          >
            <Image style={styles.categoryIcon} source={dogIcon} />
            <Text
              style={[
                styles.categoryName,
                activeCategory === "dog" && { color: COLORS.white },
              ]}
            >
              {" "}
              Dog
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {pets.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Unfortunately, we couldn't find anything.
          </Text>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <FlatList
            data={pets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.petButton}
                  onPress={() => navigation.navigate("PetDetails", { pet: item })}
                >
                  <View style={styles.petContainer}>
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: item.images }} style={styles.petImage} />
                    </View>

                    <View style={styles.petDetails}>
                      <View style={styles.petNameGender}>
                        <Text style={styles.petName}>{item.name}</Text>

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
                      </View>
                      <View style={styles.ageContainer}>
                        <Text style={styles.ageText}>Age: {item.age}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      )}
    </View>
  );
};

const HomePageScreenShelter = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeScreenPet}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={size} />
        ),
        tabBarActiveTintColor: COLORS.prim,
        headerShown: false,
        tabBarLabel: "Home",
      }}
    />
    <Tab.Screen
      name="Add"
      component={Addpet}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" color={color} size={size} />
        ),
        tabBarActiveTintColor: COLORS.prim,
        headerShown: false,
        tabBarLabel: "Add Pet",
      }}
    />

    <Tab.Screen
      name="Message"
      component={ConversationPageShelter}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubble-outline" color={color} size={size} />
        ),
        tabBarActiveTintColor: COLORS.prim,
        headerShown: false,
        tabBarLabel: "Message",
      }}
    />

    <Tab.Screen
      name="Set"
      component={SettingOptionsShelter}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="person-outline" color={color} size={size} />
        ),
        tabBarActiveTintColor: COLORS.prim,
        headerShown: false,
        tabBarLabel: "Profile",
      }}
    />
  </Tab.Navigator>
);

export default HomePageScreenShelter;
