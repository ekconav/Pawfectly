import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import {
  deleteDoc,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import COLORS from "../../const/colors";

const PetDetails = ({ route }) => {
  const [petDetails, setPetDetails] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { pet } = route.params;

  useEffect(() => {
    const fetchPetDetails = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const petRef = doc(db, "pets", pet.id);
          const petSnap = await getDoc(petRef);

          if (petSnap.exists()) {
            setPetDetails(petSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching pet details: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPetDetails();
  }, [pet.id]);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;

        if (user) {
          const conversationsRef = collection(
            db,
            "shelters",
            user.uid,
            "conversations"
          );
          const q = query(conversationsRef, where("petId", "==", pet.id));
          const querySnapshot = await getDocs(q);

          const convoList = [];
          querySnapshot.forEach((doc) => {
            convoList.push(doc.data());
          });

          setConversations(convoList);
        }
      } catch (error) {
        console.error("Error fetching conversations: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [pet.id]);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const userIds = conversations.map(
          (conversation) => conversation.participants[0]
        );
        const userDetailsPromises = userIds.map(async (userId) => {
          const userDocRef = doc(db, "users", userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            return { ...userData, uid: userId }; // Ensure uid is included
          }
          return null;
        });

        const usersDetails = await Promise.all(userDetailsPromises);
        setUsers(usersDetails.filter(Boolean)); // Filter out null values
      } catch (error) {
        console.error("Error fetching user details: ", error);
      } finally {
        setLoading(false); // Set loading to false after all data is fetched
      }
    };

    if (conversations.length > 0) {
      fetchUsers();
    } else {
      setLoading(false); // Set loading to false if no conversations
    }
  }, [conversations]);

  const handleMessage = (userId) => {
    const shelterId = auth.currentUser.uid;
    const petId = pet.id;

    const conversationId = `${userId}_${shelterId}_${petId}`;
    navigation.navigate("MessagePageShelter", {
      conversationId,
      userId,
      shelterId,
      petId,
    });
  };

  const handleCall = (mobileNumber) => {
    Linking.openURL(`tel:${mobileNumber}`);
  };

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

  const handleEditPress = () => {
    navigation.navigate("EditPet", { pet });
  };

  const handleDeletePress = async () => {
    const { id } = pet; // Assuming the identifier for the pet document is stored in the 'id' field
    try {
      await deleteDoc(doc(db, "pets", id));
      navigation.goBack();
      console.log("Pet deleted successfully!");
    } catch (error) {
      console.error("Error deleting pet:", error);
      Alert.alert("Failed to delete pet. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: petDetails.images }} style={styles.petImage} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.overlayButton}
        >
          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-back-outline" size={24} color={COLORS.title} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.petStyles}>
        <ScrollView>
          <Text style={styles.petName}>{petDetails.name}</Text>
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
          <View style={styles.conversationWithContainer}>
            <Text style={styles.conversationTitle}>In conversation with:</Text>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.prim} />
              </View>
            ) : conversations.length === 0 ? (
              <View>
                <Text style={styles.noConversation}>No conversations</Text>
              </View>
            ) : (
              <View>
                {users.map((user, index) => (
                  <View key={index} style={styles.conversationList}>
                    <View style={styles.userInfo}>
                      <Image
                        source={{ uri: user.accountPicture }}
                        style={styles.userAccountPicture}
                      />
                      <Text key={index} style={styles.userName}>
                        {user.firstName} {user.lastName}
                      </Text>
                    </View>
                    <View style={styles.callMessage}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleCall(user.mobileNumber)}
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
          <View style={styles.aboutContainer}>
            <Text style={styles.aboutTitle}>About {petDetails.name}</Text>
            <Text style={styles.aboutDescription}>{petDetails.description}</Text>
          </View>
        </ScrollView>
      </View>
      <View style={styles.buttonContainer}>
        <View style={styles.deleteContainer}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
            <Ionicons name="trash-outline" size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.editContainer}>
          <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
            <Ionicons name="create-outline" size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PetDetails;
