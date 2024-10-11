import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FavoritesPage from "../Favorites/FavoritesPage";
import { SettingOptions } from "../SettingsPage/SettingStack";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import Modal from "react-native-modal";
import SearchBar from "./SearchBar/SearchBar";
import styles from "./styles";
import ConversationPage from "../ConversationsPage/ConversationPage";
import COLORS from "../../const/colors";
import catIcon from "../../components/catIcon.png";
import dogIcon from "../../components/dogIcon.png";
import turtleIcon from "../../components/turtleIcon.png";
import adopter from "../../components/adopter.png";
import Checkbox from "expo-checkbox";

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  const [pets, setPets] = useState([]);
  const [allPetsPostedByMe, setAllPetsPostedByMe] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const [userVerified, setUserVerified] = useState(false);
  const [userVerifiedModal, setUserVerifiedModal] = useState(false);

  const [modalMessage, setModalMessage] = useState("");

  const [choicesModal, setChoicesModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Fur-Ever Friends");
  const [petsPostedByMe, setPetsPostedByMe] = useState([]);

  const [seeAllPressed, setSeeAllPressed] = useState(false);

  const [termsAccepted, setTermsAccepted] = useState(true);
  const [updateTermsAccepted, setUpdateTermsAccepted] = useState(false);
  const [termsModal, setTermsModal] = useState(false);
  const [tosItems, setTosItems] = useState([]);

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
          setUserVerified(userData.verified);
          setTermsAccepted(userData.termsAccepted);
        }
        if (!termsAccepted) {
          setUpdateTermsAccepted(false);
        }
      }
    );

    return () => {
      unsubscribePets && unsubscribePets();
      unsubscribeUser();
    };
  }, []);

  useEffect(() => {
    if (selectedOption === "Fur-Ever Friends") {
      if (activeCategory) {
        const filteredPets = allPets.filter(
          (pet) => pet.type.toLowerCase() === activeCategory.toLowerCase()
        );
        setPets(filteredPets);
      } else {
        handleSearch();
      }
    } else {
      if (activeCategory) {
        const filteredPetsPostedByMe = allPetsPostedByMe.filter(
          (pet) => pet.type.toLowerCase() === activeCategory.toLowerCase()
        );
        setPetsPostedByMe(filteredPetsPostedByMe);
      } else {
        handleSearchPetsAdopted();
      }
    }
  }, [searchQuery, selectedOption]);

  useEffect(() => {
    const fetchTos = async () => {
      try {
        const q = query(collection(db, "TOS"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const tosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTosItems(tosData);
      } catch (error) {
        console.error("Error fetching TOS: ", error);
      }
    };
    fetchTos();
  }, []);

  const fetchPets = () => {
    setLoading(true);
    try {
      const petsCollectionRef = collection(db, "pets");

      const otherPetsQuery = query(
        petsCollectionRef,
        where("adopted", "==", false),
        where("userId", "!=", auth.currentUser.uid),
        orderBy("petPosted", "desc")
      );

      const myPetsQuery = query(
        petsCollectionRef,
        where("adopted", "==", false),
        where("userId", "==", auth.currentUser.uid),
        orderBy("petPosted", "desc")
      );

      const unsubscribeOtherPets = onSnapshot(
        otherPetsQuery,
        async (querySnapshot) => {
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
        }
      );

      const unsubscribeMyPets = onSnapshot(myPetsQuery, async (querySnapshot) => {
        const myPetsData = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const petData = doc.data();
            const imageUrl = await getDownloadURL(ref(storage, petData.images));
            return { id: doc.id, ...petData, imageUrl };
          })
        );
        setPetsPostedByMe(myPetsData);
        setAllPetsPostedByMe(myPetsData);
      });

      return () => {
        unsubscribeOtherPets();
        unsubscribeMyPets();
      };
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

  const handleSearchPetsAdopted = () => {
    if (!searchQuery.trim()) {
      setPetsPostedByMe(allPetsPostedByMe);
      return;
    }

    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const filteredPets = allPetsPostedByMe.filter((pet) => {
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

    setPetsPostedByMe(filteredPets);
  };

  const handleCategoryFilter = (category) => {
    if (activeCategory === category) {
      setActiveCategory(null);
      if (selectedOption === "Fur-Ever Friends") {
        setPets(allPets);
      } else {
        setPetsPostedByMe(allPetsPostedByMe);
      }
    } else {
      setActiveCategory(category);

      if (selectedOption === "Fur-Ever Friends") {
        const filteredPets = allPets.filter(
          (pet) => pet.type.toLowerCase() === category.toLowerCase()
        );
        setPets(filteredPets);
      } else {
        const filteredPetsPostedByMe = allPetsPostedByMe.filter(
          (pet) => pet.type.toLowerCase() === category.toLowerCase()
        );
        setPetsPostedByMe(filteredPetsPostedByMe);
      }
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPets();
    setRefreshing(false);
  }, []);

  const handleClickAdopter = () => {
    if (userVerified) {
      navigation.navigate("PostPetPage");
    } else {
      setModalMessage("Sorry, your account is not yet verified.");
      setUserVerifiedModal(true);
    }
  };

  const handleChoiceSelect = (option) => {
    setSelectedOption(option);
    setChoicesModal(false);

    if (activeCategory) {
      if (option === "Fur-Ever Friends") {
        const filteredPets = allPets.filter(
          (pet) => pet.type.toLowerCase() === activeCategory.toLowerCase()
        );
        setPets(filteredPets);
      } else {
        const filteredPetsPostedByMe = allPetsPostedByMe.filter(
          (pet) => pet.type.toLowerCase() === activeCategory.toLowerCase()
        );
        setPetsPostedByMe(filteredPetsPostedByMe);
      }
    } else {
      if (option === "Fur-Ever Friends") {
        setPets(allPets);
      } else {
        setPetsPostedByMe(allPetsPostedByMe);
      }
    }
  };

  const handleSeeAllPressed = () => {
    setSeeAllPressed((prevState) => !prevState);
  };

  const handleCancel = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully!");
      navigation.replace("LoginPage");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleConfirm = async () => {
    if (!updateTermsAccepted) {
      setModalMessage("You must agree to the terms of service to sign up.");
      setUserVerifiedModal(true);
    } else {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          await updateDoc(userDocRef, {
            termsAccepted: true,
          });
        }
        console.log("Terms approved");
      } catch (error) {
        console.error("Error approving terms: ", error);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.accountName}>Welcome, {firstName}!</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Set")}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <View style={{ width: "99%" }}>
        {!seeAllPressed && (
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSearch={handleSearch}
          />
        )}
      </View>

      {!seeAllPressed && (
        <View style={styles.adopterContainer}>
          <View style={{ flex: 1, justifyContent: "space-around" }}>
            <Text style={styles.adopterText}>
              Got any furbabies up for adoption?
            </Text>
            <TouchableOpacity
              style={styles.adopterButton}
              onPress={handleClickAdopter}
            >
              <Text style={styles.adopterButtonText}>Click Here</Text>
            </TouchableOpacity>
          </View>
          <Image source={adopter} style={styles.adopterImage} />
        </View>
      )}

      <View style={styles.categoryContainer}>
        <View style={styles.categoryChoices}>
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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            style={styles.titleButton}
            onPress={() => setChoicesModal(true)}
          >
            <Text style={styles.categoriesTitle}>{selectedOption}</Text>
            <Ionicons
              name="chevron-down-circle-outline"
              size={16}
              color={COLORS.white}
            />
          </TouchableOpacity>
          {!seeAllPressed ? (
            <TouchableOpacity onPress={handleSeeAllPressed}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={{ flexDirection: "row", alignItems: "center" }}
              onPress={handleSeeAllPressed}
            >
              <Ionicons name="arrow-back-outline" size={18} color={COLORS.title} />
              <Text style={styles.seeAllText}>Back</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={COLORS.prim} />
        </View>
      ) : (
        <View style={styles.mainContainer}>
          {selectedOption === "Fur-Ever Friends" && pets.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                Unfortunately, we couldn't find anything in Fur-Ever Friends.
              </Text>
            </View>
          ) : selectedOption !== "Fur-Ever Friends" &&
            petsPostedByMe.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text style={styles.noResultsText}>
                You haven't posted any pets yet.
              </Text>
            </View>
          ) : (
            <FlatList
              key={seeAllPressed ? "twoColumns" : "oneColumn"}
              data={selectedOption === "Fur-Ever Friends" ? pets : petsPostedByMe}
              keyExtractor={(item) => item.id}
              numColumns={seeAllPressed ? 2 : 1}
              renderItem={({ item }) => (
                <View
                  style={
                    seeAllPressed
                      ? styles.buttonContainerSeeAll
                      : styles.buttonContainer
                  }
                >
                  <TouchableOpacity
                    style={seeAllPressed ? styles.petButtonSeeAll : styles.petButton}
                    onPress={() => navigation.navigate("DetailsPage", { pet: item })}
                  >
                    <View style={styles.petContainer}>
                      <View
                        style={
                          seeAllPressed
                            ? styles.imageContainerSeeAll
                            : styles.imageContainer
                        }
                      >
                        <Image
                          source={{
                            uri: item.imageUrl,
                          }}
                          style={styles.petImage}
                        />
                      </View>

                      <View style={styles.petDetails}>
                        <View
                          style={
                            seeAllPressed
                              ? styles.petNameGenderSeeAll
                              : styles.petNameGender
                          }
                        >
                          <Text
                            style={
                              seeAllPressed ? styles.petNameSeeAll : styles.petName
                            }
                          >
                            {item.name}
                          </Text>
                          <Text>
                            {item.gender.toLowerCase() === "male" ? (
                              <View style={styles.genderIconContainer}>
                                <Ionicons
                                  style={styles.petGenderIconMale}
                                  name="male"
                                  size={seeAllPressed ? 12 : 24}
                                  color={COLORS.male}
                                />
                              </View>
                            ) : (
                              <View style={styles.genderIconContainer}>
                                <Ionicons
                                  style={styles.petGenderIconFemale}
                                  name="female"
                                  size={seeAllPressed ? 12 : 24}
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
                              size={seeAllPressed ? 12 : 24}
                              color={COLORS.prim}
                            />
                            <Text
                              style={
                                seeAllPressed
                                  ? styles.petAddressSeeAll
                                  : styles.petAddress
                              }
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.location}
                            </Text>
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
          )}
        </View>
      )}
      <Modal isVisible={userVerifiedModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setUserVerifiedModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={choicesModal} onRequestClose={() => setChoicesModal(false)}>
        <TouchableOpacity
          style={styles.choicesModalOverlay}
          activeOpacity={1}
          onPress={() => setChoicesModal(false)}
        >
          <View style={styles.choicesOptions}>
            {["Fur-Ever Friends", "Pets Posted"].map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleChoiceSelect(option)}
                style={styles.choicesDropdown}
              >
                <Text style={styles.choicesDropdownText}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
      <Modal isVisible={!termsAccepted}>
        <View style={styles.termsModalVisible}>
          <Text style={styles.updateTitle}>Update on the Terms of Service</Text>
          <Text style={styles.updateText}>
            By using Pawfectly Adoptable, you agree to these{" "}
            <Text style={styles.updateLink} onPress={() => setTermsModal(true)}>
              Terms of Service
            </Text>
            .
          </Text>
          <View style={styles.updateCheckboxContainer}>
            <Checkbox
              value={updateTermsAccepted}
              onValueChange={setUpdateTermsAccepted}
              color={COLORS.prim}
            />
            <Text style={styles.checkboxText}>I agree to the Terms of Service</Text>
          </View>
          <View style={styles.updateButtonContainer}>
            <TouchableOpacity
              style={styles.updateCancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.updateCancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.updateConfirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.updateConfirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={termsModal}>
        <View style={styles.termsModalVisible}>
          <Text style={styles.TOSTitle}>Terms of Service</Text>
          <ScrollView style={styles.tosScrollView}>
            {tosItems.map((item) => (
              <View key={item.id} style={styles.tosContainer}>
                <Text style={styles.tosTitle}>
                  {item.order}. {item.title}
                </Text>
                <Text style={styles.tosDescription}>{item.description}</Text>
              </View>
            ))}
            <View style={styles.tosContainer}>
              <Text style={styles.tosDescription}>
                <Text style={styles.tosEmail}>pawfectly_adoptable@gmail.com</Text>
              </Text>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={styles.updateCancelButton}
            onPress={() => setTermsModal(false)}
          >
            <Text style={styles.updateCancelButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const App = () => {
  const userId = auth.currentUser.uid;
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    if (userId) {
      const conversationsRef = collection(db, "users", userId, "conversations");
      const q = query(conversationsRef, where("seen", "==", false));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const count = snapshot.docs.length;
        setCounter(count);
      });
      return () => unsubscribe();
    }
  }, [userId]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={styles.icons}
              name="home-outline"
              color={color}
              size={size}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: "Poppins_400Regular",
          },
          tabBarItemStyle: {
            marginBottom: -2,
          },
          tabBarActiveTintColor: COLORS.prim,
          headerShown: false,
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={styles.icons}
              name="heart-outline"
              color={color}
              size={size}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: "Poppins_400Regular",
          },
          tabBarItemStyle: {
            marginBottom: -2,
          },
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
            <View style={{ position: "relative" }}>
              <Ionicons
                style={styles.icons}
                name="chatbubbles-outline"
                color={color}
                size={size}
              />
              {counter > 0 && (
                <View style={styles.counter}>
                  <Text style={styles.counterText}>{counter}</Text>
                </View>
              )}
            </View>
          ),
          tabBarLabelStyle: {
            fontFamily: "Poppins_400Regular",
          },
          tabBarItemStyle: {
            marginBottom: -2,
          },
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
            <Ionicons
              style={styles.icons}
              name="person-outline"
              color={color}
              size={size}
            />
          ),
          tabBarLabelStyle: {
            fontFamily: "Poppins_400Regular",
          },
          tabBarItemStyle: {
            marginBottom: -2,
          },
          tabBarActiveTintColor: COLORS.prim,
          headerShown: false,
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default App;
