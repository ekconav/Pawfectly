import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
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
  Timestamp,
  setDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const DetailsPage = ({ route }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [petDetails, setPetDetails] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [shelterImage, setShelterImage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [petAdopted, setPetAdopted] = useState(false);
  const [petPosted, setPetPosted] = useState(null);
  const [petDeleted, setPetDeleted] = useState(false);

  const [userPosted, setUserPosted] = useState(false);
  const [userToUser, setUserToUser] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [youAdopted, setYouAdopted] = useState(false);

  const [adopted, setAdopted] = useState(false);
  const [adoptedByUser, setAdoptedByUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [conversations, setConversations] = useState([]);

  const [readyForAdoption, setReadyForAdoption] = useState(false);
  const [adoptionLimitExceed, setAdoptionLimitExceed] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);

  const navigation = useNavigation();

  const { pet } = route.params;

  useEffect(() => {
    const checkAdoptionStatus = async () => {
      try {
        const petRef = doc(db, "pets", pet.id);
        const petSnap = await getDoc(petRef);

        if (petSnap.exists()) {
          const petData = petSnap.data();
          if (petData.adopted) {
            setAdopted(true);

            if (petData.adoptedBy) {
              const adopterRef = doc(db, "users", petData.adoptedBy);
              const adopterSnap = await getDoc(adopterRef);

              if (adopterSnap.exists()) {
                const adopterData = adopterSnap.data();
                setAdoptedByUser({
                  firstName: adopterData.firstName,
                  lastName: adopterData.lastName,
                  accountPicture: adopterData.accountPicture,
                  uid: petData.adoptedBy,
                  mobileNumber: adopterData.mobileNumber,
                });
              } else {
                const adoptedByRef = doc(
                  db,
                  "users",
                  auth.currentUser.uid,
                  "adoptedBy",
                  petData.adoptedBy
                );
                const adoptedBySnap = await getDoc(adoptedByRef);
                if (adoptedBySnap.exists()) {
                  const adopterData = adoptedBySnap.data();
                  setAdoptedByUser({
                    firstName: adopterData.firstName,
                    lastName: adopterData.lastName,
                    accountPicture: adopterData.accountPicture,
                    uid: petData.adoptedBy,
                    mobileNumber: adopterData.mobileNumber,
                  });
                }
              }
            }
          }
          if (petData.readyForAdoption) {
            setReadyForAdoption(true);
          } else {
            setReadyForAdoption(false);
          }
        }
      } catch (error) {
        console.error("Error checking adoption status: ", error);
      }
    };
    checkAdoptionStatus();
  }, [pet.id]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const user = auth.currentUser;

        if (user) {
          const conversationsRef = collection(
            db,
            "users",
            user.uid,
            "conversations"
          );
          const q = query(conversationsRef, where("petId", "==", pet.id));
          const querySnapshot = await getDocs(q);

          const conversationPromises = querySnapshot.docs.map(
            async (docSnapshot) => {
              const conversationData = docSnapshot.data();
              const userId = conversationData.participants[0];

              const userDocRef = doc(db, "users", userId);
              const userDocSnapshot = await getDoc(userDocRef);

              return userDocSnapshot.exists() ? conversationData : null;
            }
          );

          const conversations = await Promise.all(conversationPromises);

          setConversations(conversations.filter((convo) => convo !== null));
        }
      } catch (error) {
        console.error("Error fetching conversations: ", error);
      }
    };
    fetchConversations();
  }, [pet.id]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userIds = conversations.map(
          (conversation) => conversation.participants[0]
        );
        const userDetailsPromises = userIds.map(async (userId) => {
          const userDocRef = doc(db, "users", userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            return { ...userData, uid: userId };
          }
          return null;
        });

        const usersDetails = await Promise.all(userDetailsPromises);
        setUsers(usersDetails.filter(Boolean));
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    if (conversations.length > 0) {
      fetchUsers();
    }
  }, [conversations]);

  useEffect(() => {
    setPetDeleted(false);

    const fetchPetDetails = async () => {
      try {
        if (auth.currentUser.uid === pet.userId) {
          setUserPosted(true);
        }

        const shelterRef = doc(db, "shelters", pet.userId);
        let docSnap = await getDoc(shelterRef);

        if (!docSnap.exists()) {
          console.log("No such document in shelters.");
          const userRef = doc(db, "users", pet.userId);
          docSnap = await getDoc(userRef);

          if (!docSnap.exists()) {
            console.log("No such document in users and shelters!");
            const adoptedFromRef = doc(
              db,
              "users",
              auth.currentUser.uid,
              "adoptedFrom",
              pet.userId
            );
            docSnap = await getDoc(adoptedFromRef);
            if (!docSnap.exists()) {
              console.log(
                "No such document in users and shelters and adoptedFrom collection!"
              );
              return;
            }
          } else {
            setUserToUser(true);
            console.log("User to user true");
          }
        }

        pet.shelterName =
          docSnap.data().shelterName ||
          `${docSnap.data().firstName} ${docSnap.data().lastName}`;
        pet.location = docSnap.data().address;
        pet.accountPicture = docSnap.data().accountPicture;
        pet.mobileNumber = docSnap.data().mobileNumber;
        setShelterImage(
          pet.accountPicture
            ? { uri: pet.accountPicture }
            : require("../../components/user.png")
        );
        setMobileNumber(pet.mobileNumber);

        const userId = auth.currentUser.uid;
        const shelterId = pet.userId;
        const petId = pet.id;
        const conversationId = `${userId}_${shelterId}_${petId}`;

        const conversationDocRef = doc(
          db,
          "users",
          userId,
          "conversations",
          conversationId
        );
        const conversationSnap = await getDoc(conversationDocRef);

        if (conversationSnap.exists()) {
          const messagesRef = collection(conversationDocRef, "messages");
          const messageText = `Hello, I would like to adopt ${pet.name}.`;
          const messageQuery = query(messagesRef, where("text", "==", messageText));
          const messageSnap = await getDocs(messageQuery);

          if (!messageSnap.empty) {
            setMessageSent(true);
          }
        }

        const petRef = doc(db, "pets", pet.id);
        const unsubscribePet = onSnapshot(petRef, (petSnap) => {
          if (!petSnap.exists()) {
            setPetDeleted(true);
          } else {
            const petData = petSnap.data();
            setPetAdopted(petData.adopted === true);
            setPetDetails(petData);
          }
        });

        const petAdoptedRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "petsAdopted",
          pet.id
        );
        const unsubscribePetAdopted = onSnapshot(petAdoptedRef, (petAdoptedSnap) => {
          if (petAdoptedSnap.exists()) {
            const petAdoptedData = petAdoptedSnap.data();
            setPetDetails(petAdoptedData);
            setPetAdopted(petAdoptedData.adopted === true);

            if (petAdoptedData.petPosted) {
              setPetPosted(petAdoptedData.petPosted);
            }

            if (petAdoptedData.adoptedBy === auth.currentUser.uid) {
              setYouAdopted(true);
            }
          }
        });
        setUserDetails(pet);

        return () => {
          unsubscribePet();
          unsubscribePetAdopted();
        };
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPetDetails();
  }, [route.params]);

  useEffect(() => {
    const checkUserVerificationAndAdoptionLimit = () => {
      const user = auth.currentUser;
      if (user) {
        const usersRef = doc(db, "users", user.uid);

        const unsubscribeDoc = onSnapshot(usersRef, async (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const currentDate = new Date();
            const lastAdoptionDate = data.last_adoption_date
              ? data.last_adoption_date.toDate()
              : null;

            setIsVerified(data.verified === true);
            if (data.adoption_limit >= 3) {
              if (
                !lastAdoptionDate ||
                lastAdoptionDate.getMonth() !== currentDate.getMonth()
              ) {
                try {
                  await updateDoc(usersRef, {
                    adoption_limit: 0,
                  });
                  setAdoptionLimitExceed(false);
                } catch (error) {
                  console.error("Error updating adoption limit: ", error);
                }
              } else {
                setAdoptionLimitExceed(true);
              }
            } else {
              setAdoptionLimitExceed(false);
            }
          } else {
            console.log("User document not found.");
            setIsVerified(false);
          }
        });

        return () => unsubscribeDoc();
      }
    };

    const unsubscribe = checkUserVerificationAndAdoptionLimit();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleMessage = (userId) => {
    const shelterId = auth.currentUser.uid;
    const petId = pet.id;

    const conversationId = `${userId}_${shelterId}_${petId}`;
    navigation.navigate("MessagePage", {
      conversationId,
      userId,
      shelterId,
      petId,
    });
  };

  const handleOpenMessage = () => {
    const userId = auth.currentUser.uid;
    const shelterId = petDetails.userId;
    const petId = userDetails.id;
    const conversationId = `${userId}_${shelterId}_${petId}`;

    if (!isVerified) {
      setModalMessage("Your account is not yet verified.");
      setAlertModal(true);
      return;
    }

    navigation.navigate("MessagePage", {
      conversationId,
      shelterId,
      petId,
    });
  };

  const handleFavorite = async () => {
    const user = auth.currentUser;
    const petId = userDetails.id;

    if (user) {
      const favoritesRef = collection(db, "users", user.uid, "favorites");
      try {
        const q = query(favoritesRef, where("petId", "==", petId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setModalMessage("This pet is already in your favorites.");
          setAlertModal(true);
          return;
        }

        await addDoc(favoritesRef, {
          petId: petId,
        });

        console.log("Favorite pet added successfully.");
        navigation.navigate("Favorites");
      } catch (error) {
        console.error("Error adding favorite: ", error);
      }
    }
  };

  const handleCall = async () => {
    if (!isVerified) {
      setModalMessage("Your account is not yet verified.");
      setAlertModal(true);
      return;
    }

    try {
      if (mobileNumber) {
        await Linking.openURL(`tel:${mobileNumber}`);
      } else {
        setModalMessage("No phone number available.");
        setAlertModal(true);
      }
    } catch (error) {
      setModalMessage("There was an error trying to make a call.");
      setAlertModal(true);
    }
  };

  const handleAdopterCall = (mobileNumber) => {
    Linking.openURL(`tel:${mobileNumber}`);
  };

  const handleAdoption = async () => {
    if (adoptionLimitExceed) {
      setModalMessage("Sorry, you can only do up to 3 adoptions per month.");
      setAlertModal(true);
      return;
    }
    setCheckLoading(true);
    try {
      const userId = auth.currentUser.uid;
      const shelterId = petDetails.userId;
      const petId = userDetails.id;
      const conversationId = `${userId}_${shelterId}_${petId}`;
      const messageText = `Hello, I would like to adopt ${petDetails.name}.`;

      const shelterRef = doc(db, "shelters", shelterId);
      const shelterSnap = await getDoc(shelterRef);
      const userRef = doc(db, "users", shelterId);
      const userSnap = await getDoc(userRef);

      if (shelterSnap.exists()) {
        const notificationsRef = collection(
          db,
          "shelters",
          shelterId,
          "notifications"
        );
        await addDoc(notificationsRef, {
          from: userId,
          seen: false,
          text: `Wants to adopt ${petDetails.name}.`,
          timestamp: serverTimestamp(),
          title: "Notice for Adoption",
        });
      } else if (userSnap.exists()) {
        const notificationsRef = collection(db, "users", shelterId, "notifications");
        await addDoc(notificationsRef, {
          from: userId,
          seen: false,
          text: `Wants to adopt ${petDetails.name}.`,
          timestamp: serverTimestamp(),
          title: "Notice for Adoption",
        });
      }

      if (!isVerified) {
        setModalMessage("Your account is not yet verified.");
        setAlertModal(true);
        return;
      }

      const userConversationDocRef = doc(
        db,
        "users",
        userId,
        "conversations",
        conversationId
      );
      const userConversationSnap = await getDoc(userConversationDocRef);

      let shelterConversationDocRef;

      if (!userToUser) {
        shelterConversationDocRef = doc(
          db,
          "shelters",
          shelterId,
          "conversations",
          conversationId
        );
      } else {
        shelterConversationDocRef = doc(
          db,
          "users",
          shelterId,
          "conversations",
          conversationId
        );
      }

      const shelterConversationSnap = await getDoc(shelterConversationDocRef);

      if (userConversationSnap.exists()) {
        // Check if the message already exists
        const messagesRef = collection(userConversationDocRef, "messages");
        const messageQuery = query(messagesRef, where("text", "==", messageText));
        const messageSnap = await getDocs(messageQuery);

        if (!messageSnap.empty) {
          console.log("Message already exists.");
          setMessageSent(true);
          return;
        } else {
          // Add the message if it does not exist
          await addDoc(messagesRef, {
            text: messageText,
            senderId: userId,
            receiverId: shelterId,
            timestamp: Timestamp.now(),
          });

          await updateDoc(userConversationDocRef, {
            lastMessage: messageText,
            lastTimestamp: Timestamp.now(),
            seen: true,
          });
          console.log("Message sent successfully.");
          setMessageSent(true);
        }
      } else {
        // If conversation does not exist, create it and then add the message
        await setDoc(userConversationDocRef, {
          participants: [userId, shelterId],
          petId: petId,
          lastMessage: messageText,
          lastTimestamp: Timestamp.now(),
          seen: true,
        });

        const messagesRef = collection(userConversationDocRef, "messages");
        await addDoc(messagesRef, {
          text: messageText,
          senderId: userId,
          receiverId: shelterId,
          timestamp: Timestamp.now(),
        });

        console.log("Conversation created and message sent.");
        setMessageSent(true);
      }

      // Adding a small delay to ensure the message is saved
      setTimeout(() => {
        navigation.navigate("MessagePage", {
          conversationId,
          shelterId,
          petId,
        });
      }, 500);

      if (shelterConversationSnap.exists()) {
        const messagesRef = collection(shelterConversationDocRef, "messages");
        const messageQuery = query(messagesRef, where("text", "==", messageText));
        const messageSnap = await getDocs(messageQuery);

        if (!messageSnap.empty) {
          console.log("Message already exists");
          setMessageSent(true);
          return;
        } else {
          await addDoc(messagesRef, {
            text: messageText,
            senderId: userId,
            receiverId: shelterId,
            timestamp: Timestamp.now(),
          });

          await updateDoc(shelterConversationDocRef, {
            lastMessage: messageText,
            lastTimestamp: Timestamp.now(),
            seen: false,
          });
          console.log("Message sent successfully.");
          setMessageSent(true);
        }
      } else {
        await setDoc(shelterConversationDocRef, {
          participants: [userId, shelterId],
          petId: petId,
          lastMessage: messageText,
          lastTimestamp: Timestamp.now(),
          seen: false,
        });

        const messagesRef = collection(shelterConversationDocRef, "messages");
        await addDoc(messagesRef, {
          text: messageText,
          senderId: userId,
          receiverId: shelterId,
          timestamp: Timestamp.now(),
        });

        console.log("Conversation created and message sent.");
        setMessageSent(true);
      }
    } catch (error) {
      console.error("Error during adoption process: ", error);
      setModalMessage("There was an error trying to adopt the pet.");
      setAlertModal(true);
      setCheckLoading(false);
    } finally {
      setCheckLoading(false);
    }
  };

  const handleOpenDeleteModal = () => {
    setModalMessage("Are you sure you want to delete this pet?");
    setDeleteModal(true);
  };

  const handleDeletePress = async () => {
    const { id } = pet;
    try {
      await deleteDoc(doc(db, "pets", id));
      navigation.goBack();
      console.log("Pet deleted successfully.");
    } catch (error) {
      console.error("Error deleting pet: ", error);
      setModalMessage("Failed to delete pet. Please try again.");
      setAlertModal(true);
    }
  };

  let formattedDate = null;
  if (petPosted) {
    const petPostedDate = petPosted.toDate();
    formattedDate = petPostedDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

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

          {petAdopted && formattedDate ? (
            <View style={styles.addressInformation}>
              <Ionicons name="home-outline" size={22} color={COLORS.prim} />
              <Text style={styles.textAddressAdoptedOn}>
                Adopted On:{"\n"}
                <Text style={{ fontFamily: "Poppins_500Medium" }}>
                  {formattedDate}
                </Text>
              </Text>
            </View>
          ) : (
            <View style={styles.addressInformation}>
              <Ionicons name="location-outline" size={24} color={COLORS.prim} />
              <Text style={styles.textAddress}>{userDetails.location}</Text>
            </View>
          )}
          {adopted && adoptedByUser && userPosted && (
            <View style={styles.adoptedContainer}>
              <Text style={styles.adoptedText}>Adopted By:</Text>
              <View style={styles.adoptedByContainer}>
                <TouchableOpacity
                  style={styles.adoptedByUserInfo}
                  onPress={() =>
                    navigation.navigate("DisplayUserPage", {
                      userId: adoptedByUser.uid,
                    })
                  }
                >
                  <Image
                    source={
                      adoptedByUser.accountPicture
                        ? { uri: adoptedByUser.accountPicture }
                        : require("../../components/user.png")
                    }
                    style={styles.adopterImage}
                  />
                  <Text style={styles.userFullName}>
                    {adoptedByUser.firstName} {adoptedByUser.lastName}
                  </Text>
                </TouchableOpacity>
                <View style={styles.callMessage}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleAdopterCall(adoptedByUser.mobileNumber)}
                  >
                    <Ionicons name="call-outline" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleMessage(adoptedByUser.uid)}
                  >
                    <Ionicons
                      name="chatbox-outline"
                      size={24}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
          <View style={styles.midInfoContainer}>
            <View style={styles.midInfo}>
              <Text style={styles.midInfoDetail}>{petDetails.gender}</Text>
              <Text style={styles.midInfoTitle}>Sex</Text>
            </View>
            <View style={styles.midInfo}>
              <Text style={styles.midInfoDetail}>{petDetails.weight}kg</Text>
              <Text style={styles.midInfoTitle}>Weight</Text>
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
          <View style={userPosted ? null : styles.shelterContainer}>
            <View style={styles.shelterInfo}>
              {!userPosted ? (
                <TouchableOpacity
                  style={styles.shelterInfo}
                  onPress={() =>
                    navigation.navigate("DisplayUserPage", {
                      userId: petDetails.userId,
                    })
                  }
                >
                  <Image source={shelterImage} style={styles.shelterImage} />
                  <View style={styles.shelterTextContainer}>
                    <Text style={styles.midInfoTitle}>
                      {userToUser && !userPosted && !petAdopted
                        ? "Currently With:"
                        : !userPosted
                        ? petAdopted || petDeleted
                          ? "From:"
                          : "Currently In:"
                        : "You:"}
                    </Text>
                    <Text style={styles.shelterName}>{userDetails.shelterName}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.conversationWithContainer}>
                  <Text style={styles.conversationTitle}>In conversation with:</Text>
                  {conversations.length === 0 ? (
                    <View>
                      <Text style={styles.noConversation}>No conversations</Text>
                    </View>
                  ) : (
                    <View>
                      {users.map((user, index) => (
                        <View key={index} style={styles.conversationList}>
                          <View style={styles.userInfo}>
                            <Image
                              source={
                                user.accountPicture
                                  ? { uri: user.accountPicture }
                                  : require("../../components/user.png")
                              }
                              style={styles.userAccountPicture}
                            />
                            <Text key={index} style={styles.userName}>
                              {user.firstName} {user.lastName}
                            </Text>
                          </View>
                          <View style={styles.callMessage}>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => handleAdopterCall(user.mobileNumber)}
                            >
                              <Ionicons
                                name="call-outline"
                                size={24}
                                color={COLORS.white}
                              />
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={styles.actionButton}
                              onPress={() => handleMessage(user.uid)}
                            >
                              <Ionicons
                                name="chatbox-outline"
                                size={24}
                                color={COLORS.white}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
            {!userPosted ? (
              <View style={styles.callMessage}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                  <Ionicons name="call-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleOpenMessage}
                >
                  <Ionicons name="chatbox-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          <View style={userPosted ? null : styles.aboutContainer}>
            <Text style={styles.aboutTitle}>About {petDetails.name}</Text>
            <Text style={styles.aboutDescription}>{petDetails.description}</Text>
          </View>
        </ScrollView>
      </View>
      {!userPosted ? (
        <View style={styles.buttonContainer}>
          <View style={!petAdopted && !petDeleted ? styles.favoriteContainer : null}>
            {!petAdopted && !petDeleted ? (
              <TouchableOpacity style={styles.button} onPress={handleFavorite}>
                <Ionicons name="heart-outline" size={22} color={COLORS.white} />
              </TouchableOpacity>
            ) : null}
          </View>
          <View
            style={
              !petAdopted && !petDeleted
                ? styles.adoptMeContainer
                : styles.petAdoptedContainer
            }
          >
            <TouchableOpacity
              style={
                !messageSent && !petAdopted && !petDeleted && readyForAdoption
                  ? styles.adoptButton
                  : styles.adoptButtonSent
              }
              onPress={handleAdoption}
              disabled={!readyForAdoption || messageSent || petAdopted || petDeleted}
            >
              {checkLoading ? (
                <View
                  style={{
                    paddingVertical: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="small" color={COLORS.white} />
                </View>
              ) : (
                <Text style={styles.textButton}>
                  {youAdopted && petAdopted
                    ? `Congratulations, you successfully adopted ${petDetails.name}.`
                    : petAdopted && !youAdopted
                    ? "Pet has been adopted"
                    : petDeleted
                    ? "Pet data has been deleted"
                    : messageSent
                    ? "Message Sent"
                    : !readyForAdoption
                    ? "Not ready for adoption"
                    : "Adopt Me"}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <View style={styles.deleteContainer}>
            <TouchableOpacity
              style={styles.deleteUserPostedButton}
              onPress={handleOpenDeleteModal}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.editContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => navigation.navigate("EditPostPetPage", { pet })}
            >
              <Ionicons name="create-outline" size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Modal isVisible={alertModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              onPress={() => setAlertModal(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={deleteModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.deleteModalButtonContainer}>
            <TouchableOpacity
              style={styles.deleteModalCancelButton}
              onPress={() => setDeleteModal(false)}
            >
              <Text style={styles.deleteCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteModalDeleteButton}
              onPress={handleDeletePress}
            >
              <Text style={styles.deleteModalText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DetailsPage;
