import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import {
  collection,
  onSnapshot,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../../FirebaseConfig";
import { RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Checkbox from "expo-checkbox";
import Modal from "react-native-modal";
import COLORS from "../../const/colors";
import ConversationPageShelter from "../ConversationsPage/ConversationPageShelter";
import Addpet from "../AddPet/AddPet";
import StatisticsPage from "../StatisticsShelter/StatisticsPage";
import SearchBar from "../../HomeScreens/HomePage/SearchBar/SearchBar";
import catIcon from "../../components/catIcon.png";
import dogIcon from "../../components/dogIcon.png";
import turtleIcon from "../../components/turtleIcon.png";
import styles from "./styles";
import { signOut } from "firebase/auth";

const Tab = createBottomTabNavigator();

const HomeScreenPet = () => {
  const [pets, setPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [seeAllPressed, setSeeAllPressed] = useState(false);

  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(true);
  const [updateTermsAccepted, setUpdateTermsAccepted] = useState(false);
  const [termsModal, setTermsModal] = useState(false);
  const [tosItems, setTosItems] = useState([]);

  const [notifPressed, setNotifPressed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const navigation = useNavigation();

  const userId = auth.currentUser.uid;
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (userId) {
      const notificationsRef = collection(db, "shelters", userId, "notifications");
      const q = query(notificationsRef, where("seen", "==", false));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const count = snapshot.docs.length;
        setCounter(count);
      });
      return () => unsubscribe();
    }
  }, [userId]);

  useEffect(() => {
    const unsubscribe = fetchNotifications();

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchNotifications = () => {
    const notificationsRef = collection(
      db,
      "shelters",
      auth.currentUser.uid,
      "notifications"
    );

    const notificationsQuery = query(notificationsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(notificationsQuery, async (snapshot) => {
      setNotifLoading(true);

      const notificationsList = await Promise.all(
        snapshot.docs.map(async (notificationDoc) => {
          const notificationData = notificationDoc.data();
          const fromUserId = notificationData.from;

          const userDocRef = doc(db, "users", fromUserId);
          const userDoc = await getDoc(userDocRef);

          let senderName = "Pawfectly User";
          let profile = null;

          if (userDoc.exists()) {
            const userData = userDoc.data();
            senderName = `${userData.firstName} ${userData.lastName}`;
            profile = userData.accountPicture;
          } else {
            const shelterDocRef = doc(db, "shelters", fromUserId);
            const shelterDoc = await getDoc(shelterDocRef);

            if (shelterDoc.exists()) {
              const shelterData = shelterDoc.data();
              senderName = shelterData.shelterName;
              profile = shelterData.accountPicture;
            }
          }

          return {
            id: notificationDoc.id,
            ...notificationData,
            senderName,
            profile,
          };
        })
      );

      setNotifications(notificationsList);
      setNotifLoading(false);
    });

    return unsubscribe;
  };

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
          setTermsAccepted(userData.termsAccepted);
        }
        if (!termsAccepted) {
          setUpdateTermsAccepted(false);
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
        where("adopted", "==", false),
        orderBy("petPosted", "desc")
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
      setAlertModal(true);
    } else {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "shelters", user.uid);
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

  const handleNotification = async (item) => {
    try {
      const notificationRef = doc(
        db,
        "shelters",
        auth.currentUser.uid,
        "notifications",
        item.id
      );

      await updateDoc(notificationRef, {
        seen: true,
      });
    } catch (error) {
      console.error("Error updating notification: ", error);
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
    return (
      <TouchableOpacity
        style={item.seen ? styles.notificationItem : styles.notificationItemNotSeen}
        onPress={() => handleNotification(item)}
      >
        {item.profile ? (
          <Image source={{ uri: item.profile }} style={styles.profile} />
        ) : (
          <Image
            source={require("../../components/user.png")}
            style={styles.profile}
          />
        )}
        <View style={styles.titleText}>
          <Text style={styles.notifTitle}>
            {item.title ? item.title : "Pawfectly User"}
          </Text>
          <Text style={styles.notifText}>
            {item.text ? item.text : "Account Deleted"}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "90%",
            }}
          >
            <Text style={styles.from}>
              From: {item.senderName ? item.senderName : "Pawfectly User"}
            </Text>
            <Text style={styles.fromDate}>
              {new Date(item.timestamp.seconds * 1000).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.notifBtn}
          onPress={() => setNotifPressed(true)}
        >
          <Ionicons name="notifications-outline" size={22} color={COLORS.prim} />
          {counter > 0 && (
            <View style={styles.counter}>
              <Text style={styles.counterText}>{counter}</Text>
            </View>
          )}
        </TouchableOpacity>
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
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.categoriesTitle}>Pets for Adoption</Text>
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

      {pets.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            Unfortunately, we couldn't find anything.
          </Text>
        </View>
      ) : (
        <View style={styles.mainContainer}>
          <FlatList
            key={seeAllPressed ? "twoColumns" : "oneColumn"}
            data={pets}
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
                  onPress={() => navigation.navigate("PetDetails", { pet: item })}
                >
                  <View style={styles.petContainer}>
                    <View
                      style={
                        seeAllPressed
                          ? styles.imageContainerSeeAll
                          : styles.imageContainer
                      }
                    >
                      <Image source={{ uri: item.images }} style={styles.petImage} />
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
                      </View>
                      <View
                        style={
                          !seeAllPressed
                            ? styles.ageContainer
                            : styles.ageContainerSeeAll
                        }
                      >
                        <Text
                          style={
                            !seeAllPressed ? styles.ageText : styles.ageTextSeeAll
                          }
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          Age: {item.age}
                        </Text>
                        {item.readyForAdoption ? (
                          <Text
                            style={
                              !seeAllPressed ? styles.ready : styles.readySeeAll
                            }
                          >
                            Ready
                          </Text>
                        ) : (
                          <Text
                            style={
                              !seeAllPressed
                                ? styles.notReady
                                : styles.notReadySeeAll
                            }
                          >
                            Not Ready
                          </Text>
                        )}
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
      <Modal isVisible={alertModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setAlertModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
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
      <Modal visible={notifPressed} onRequestClose={() => setNotifPressed(false)}>
        <View style={styles.notifModalOverlay}>
          <View style={styles.notifContainer}>
            {notifLoading ? (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <ActivityIndicator size="small" color={COLORS.prim} />
              </View>
            ) : notifications.length === 0 && !notifLoading ? (
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.noNotifText}>No notifications yet.</Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
              />
            )}
            <TouchableOpacity
              onPress={() => setNotifPressed(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const HomePageScreenShelter = () => {
  const userId = auth.currentUser.uid;
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    if (userId) {
      const conversationsRef = collection(db, "shelters", userId, "conversations");
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
        component={HomeScreenPet}
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
        name="Add"
        component={Addpet}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={styles.icons}
              name="add-circle-outline"
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
          tabBarLabel: "Add Pet",
        }}
      />

      <Tab.Screen
        name="Message"
        component={ConversationPageShelter}
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
        name="StatisticsPage"
        component={StatisticsPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              style={styles.icons}
              name="stats-chart-outline"
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
          tabBarLabel: "Statistics",
        }}
      />
    </Tab.Navigator>
  );
};

export default HomePageScreenShelter;
