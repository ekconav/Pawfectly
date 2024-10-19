import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  TextInput,
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
  getDoc,
} from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FavoritesPage from "../Favorites/FavoritesPage";
import { SettingOptions } from "../SettingsPage/SettingStack";
import { Ionicons } from "@expo/vector-icons";
import {
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  EmailAuthProvider,
  reauthenticateWithCredential,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
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

  const [notifPressed, setNotifPressed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);

  const navigation = useNavigation();

  const [counter, setCounter] = useState(0);

  const [userId, setUserId] = useState(null);
  const [modalForEmailVerification, setModalForEmailVerification] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showEmailUpdateModal, setShowEmailUpdateModal] = useState(false);
  const [newEmailLoading, setNewEmailLoading] = useState(false);
  const [newEmailError, setNewEmailError] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        checkIfUserVerified(user);
      } else {
        setUserId(null);
        setEmailVerified(false);
        clearInterval(intervalRef.current);
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, [auth]);

  const checkIfUserVerified = async (user) => {
    if (!user) return;

    clearInterval(intervalRef.current);

    if (user.emailVerified) {
      setEmailVerified(true);
      setModalMessage("Thank you for verifying your email address.");
      return;
    }

    if (!emailVerified) {
      try {
        await sendEmailVerification(user);
        setModalMessage(
          "A verification email has been sent to your email address. Please check your inbox and follow the instructions to verify your account."
        );
        setModalForEmailVerification(true);
      } catch (error) {
        console.error("Error sending verification email: ", error);
      }
    }
    intervalRef.current = setInterval(async () => {
      try {
        await user.reload();
        if (user.emailVerified) {
          clearInterval(intervalRef.current);
          setModalMessage("Thank you for verifying your email address.");
          setEmailVerified(true);
        }
      } catch (error) {
        clearInterval(intervalRef.current);
      }
    }, 6000);
  };

  const checkEmailInFirestore = async (email) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleChangeEmail = async (newEmail, currentPassword) => {
    const user = auth.currentUser;
    if (!newEmail || !currentPassword) {
      setNewEmailError("Please fill in all fields.");
      return;
    }

    if (!newEmail.includes("@")) {
      setNewEmailError("Please enter a valid email address.");
      return;
    }

    setNewEmailLoading(true);
    try {
      const emailExistsInFirestore = await checkEmailInFirestore(newEmail);
      if (emailExistsInFirestore) {
        setNewEmailError("This email is already in use. Please choose another.");
        console.log("Email already in use:", newEmail);
        return;
      } else {
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { email: newEmail });
      }

      if (user) {
        await user.reload();
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);

        await verifyBeforeUpdateEmail(user, newEmail);

        setModalMessage(
          "A verification email has been sent to your new email address. Please do note that after verifying your new email address, you will need to log in again."
        );

        setShowEmailUpdateModal(false);
      }
    } catch (error) {
      let errorMessage =
        "An error occurred while updating the email. Please try again.";
      if (error.message.includes("auth/invalid-credential")) {
        errorMessage = "The password you entered is incorrect. Please try again.";
      } else if (error.message.includes("auth/email-already-in-use")) {
        errorMessage = "This email is already in use. Please choose another.";
      }
      setNewEmailError(errorMessage);
      setNewEmailLoading(false);
    } finally {
      setNewEmailLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      const notificationsRef = collection(db, "users", userId, "notifications");
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
      "users",
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
            senderName = `${userData.firstName} ${userData.lastName}`; // Assuming users have firstName and lastName fields
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

    return unsubscribe; // Return the unsubscribe function to clean up the listener
  };

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

  const handleNotification = async (item) => {
    try {
      const notificationRef = doc(
        db,
        "users",
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

  const toggleModal = () => {
    setNotifPressed(!notifPressed);
  };

  const handleButtonClick = async () => {
    setModalForEmailVerification(false);
  };

  const handleCancelButton = () => {
    setShowEmailUpdateModal(false);
    setNewEmailError("");
    setNewEmail("");
    setCurrentPassword("");
  };

  const handleClickHere = () => {
    setShowEmailUpdateModal(true);
    setNewEmailError("");
    setNewEmail("");
    setCurrentPassword("");
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
        <TouchableOpacity style={styles.notifBtn} onPress={toggleModal}>
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
      <Modal
        visible={notifPressed}
        animationType="fade"
        onBackdropPress={toggleModal}
        onRequestClose={() => setNotifPressed(false)}
      >
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
          </View>
        </View>
      </Modal>
      <Modal isVisible={modalForEmailVerification}>
        <View style={styles.alertModalContainer}>
          <Text
            style={
              !emailVerified ? styles.alertModalText : styles.alertModalTextVerified
            }
          >
            {modalMessage}
          </Text>
          {emailVerified ? (
            <View style={styles.alertModalButtonContainer}>
              <TouchableOpacity
                onPress={handleButtonClick}
                style={styles.alertModalButton}
              >
                <Text style={styles.alertModalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.alertModalButtonContainer}>
              <Text
                style={{
                  fontFamily: "Poppins_400Regular",
                  fontSize: 12,
                  color: COLORS.title,
                }}
              >
                If you want to change your email address
              </Text>
              <TouchableOpacity
                onPress={handleClickHere}
                style={styles.alertModalButton}
              >
                <Text style={styles.alertModalButtonText}>Click Here</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
      <Modal isVisible={showEmailUpdateModal}>
        <View style={styles.emailUpdateModalContainer}>
          <Text style={styles.emailUpdateTitle}>Enter your new email address:</Text>
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              fontSize: 10,
              color: COLORS.title,
              textAlign: "justify",
            }}
          >
            Note: After successfully changing your email, you will be signed out and
            will need to log in again with your new email.
          </Text>
          <TextInput
            style={styles.emailUpdateInput}
            placeholder="New email address"
            value={newEmail}
            onChangeText={(text) => setNewEmail(text)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.emailUpdateInput}
            placeholder="Current password"
            secureTextEntry
            value={currentPassword}
            onChangeText={(text) => setCurrentPassword(text)}
          />
          <Text
            style={{
              fontFamily: "Poppins_400Regular",
              color: COLORS.delete,
              fontSize: 10,
              textAlign: "center",
            }}
          >
            {newEmailError}
          </Text>
          <View style={styles.updateEmailButtonContainer}>
            <TouchableOpacity
              onPress={handleCancelButton}
              style={styles.updateEmailCancelButton}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleChangeEmail(newEmail, currentPassword)}
              style={styles.updateEmailButton}
            >
              {newEmailLoading ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.buttonText}>Update Email</Text>
              )}
            </TouchableOpacity>
          </View>
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
