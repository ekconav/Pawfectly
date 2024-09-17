import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FavoritesPage from "../Favorites/FavoritesPage";
import { SettingOptions } from "../SettingsPage/SettingStack";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "./SearchBar/SearchBar";
import styles from "./styles";
import ConversationPage from "../ConversationsPage/ConversationPage";
import COLORS from "../../const/colors";
import catIcon from "../../components/catIcon.png";
import dogIcon from "../../components/dogIcon.png";
import turtleIcon from "../../components/turtleIcon.png";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [pets, setPets] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribePets = fetchPets();

    const unsubscribeUser = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setProfileImage(
            userData.accountPicture
              ? { uri: userData.accountPicture }
              : require("../../components/user.png")
          );
          setFirstName(userData.firstName || "");
        }
      }
    );

    return () => {
      unsubscribePets && unsubscribePets();
      unsubscribeUser();
    };
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const fetchPets = () => {
    setLoading(true);
    try {
      const petsCollectionRef = collection(db, "pets");
      const petsQuery = query(petsCollectionRef, where("adopted", "==", false));

      const unsubscribe = onSnapshot(petsQuery, async (querySnapshot) => {
        const petsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const petData = doc.data();
            const imageUrl = await getDownloadURL(ref(storage, petData.images));
            return { id: doc.id, ...petData, imageUrl };
          })
        );
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
        <Text style={styles.accountName}>Welcome, {firstName}!</Text>
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
        <Text style={styles.categoriesTitle}>Fur-Ever Friends</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
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
          <TouchableOpacity
            style={[
              styles.categoryButton,
              activeCategory === "others" && { backgroundColor: COLORS.prim },
            ]}
            onPress={() => handleCategoryFilter("others")}
          >
            <Image style={styles.categoryIcon} source={turtleIcon} />
            <Text
              style={[
                styles.categoryName,
                activeCategory === "others" && { color: COLORS.white },
              ]}
            >
              {" "}
              Others
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
                  onPress={() => navigation.navigate("DetailsPage", { pet: item })}
                >
                  <View style={styles.petContainer}>
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
                      <View>
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

const App = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="home-outline" color={color} size={size} />
        ),
        tabBarActiveTintColor: COLORS.prim,
        headerShown: false,
        tabBarLabel: "Home",
      }}
      component={HomeScreen}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesPage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="heart-outline" color={color} size={size} />
        ),
        tabBarActiveTintColor: COLORS.prim,
        headerShown: false,
        tabBarLabel: "Favorites",
      }}
    />
    <Tab.Screen
      name="Message"
      component={ConversationPage}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubbles-outline" color={color} size={size} />
        ),
        tabBarActiveTintColor: COLORS.prim,
        headerShown: false,
        tabBarLabel: "Messages",
      }}
    />
    <Tab.Screen
      name="Set"
      component={SettingOptions}
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

export default App;
