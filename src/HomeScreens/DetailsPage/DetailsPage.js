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
} from "firebase/firestore";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

const DetailsPage = ({ route }) => {
  const [petDetails, setPetDetails] = useState(null);
  const [mobileNumber, setMobileNumber] = useState("");
  const [shelterImage, setShelterImage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);
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
            // Check if the message already exists
            const messagesRef = collection(conversationDocRef, "messages");
            const messageText = `Hello, I would like to adopt ${pet.name}.`;
            const messageQuery = query(
              messagesRef,
              where("text", "==", messageText)
            );
            const messageSnap = await getDocs(messageQuery);

            if (!messageSnap.empty) {
              setMessageSent(true);
            }
          }
        }
        setPetDetails(pet);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };

    fetchPetDetails();
  }, [route.params]);

  useEffect(() => {
    const checkUserVerification = () => {
      const user = auth.currentUser;
      if (user) {
        const usersRef = doc(db, "users", user.uid);

        const unsubscribeDoc = onSnapshot(usersRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setIsVerified(data.verified === true);
          } else {
            console.log("User document not found.");
            setIsVerified(false);
          }
        });

        return () => unsubscribeDoc();
      }
    };

    const unsubscribe = checkUserVerification();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleOpenMessage = () => {
    const userId = auth.currentUser.uid;
    const shelterId = petDetails.userId;
    const petId = petDetails.id;
    const conversationId = `${userId}_${shelterId}_${petId}`;

    if (!isVerified) {
      setModalMessage("Your account is not yet verified.");
      setAlertModal(true);
      return;
    }

    navigation.navigate("MessagePage", {
      conversationId,
      userId,
      shelterId,
      petId,
    });
  };

  const handleFavorite = async () => {
    const user = auth.currentUser;
    const petId = petDetails.id;

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
      } catch (error) {
        console.error("Error adding favorite: ", error);
      }
      navigation.navigate("Favorites");
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
      console.error("Error initiating call:", error);
      setModalMessage("There was an error trying to make a call.");
      setAlertModal(true);
    }
  };

  const handleAdoption = async () => {
    try {
      const userId = auth.currentUser.uid;
      const shelterId = petDetails.userId;
      const petId = petDetails.id;
      const conversationId = `${userId}_${shelterId}_${petId}`;
      const messageText = `Hello, I would like to adopt ${petDetails.name}.`;

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

      const shelterConversationDocRef = doc(
        db,
        "shelters",
        shelterId,
        "conversations",
        conversationId
      );
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
            receiverRead: false,
            senderRead: true,
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
          receiverRead: false,
          senderRead: true,
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
          userId,
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
            receiverRead: false,
            senderRead: true,
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
          receiverRead: false,
          senderRead: true,
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
            <Ionicons name="arrow-back-outline" size={24} color={COLORS.title} />
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
            <View style={styles.shelterTextContainer}>
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
              onPress={handleOpenMessage}
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
          <TouchableOpacity
            style={!messageSent ? styles.adoptButton : styles.adoptButtonSent}
            onPress={handleAdoption}
            disabled={messageSent}
          >
            <Text style={styles.textButton}>
              {messageSent ? "Message Sent" : "Adopt Me"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    </SafeAreaView>
  );
};

export default DetailsPage;
