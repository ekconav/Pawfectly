import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
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
  onSnapshot,
  runTransaction,
} from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import styles from "./styles";
import COLORS from "../../const/colors";

const PetDetails = ({ route }) => {
  const [petDetails, setPetDetails] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [adopted, setAdopted] = useState(false);
  const [adoptedByUser, setAdoptedByUser] = useState(null);
  const navigation = useNavigation();
  const { pet } = route.params;

  useEffect(() => {
    const checkAdoptionStatus = async () => {
      setLoading(true);
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
                  "shelters",
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
        } else {
          console.log("No such pet document!");
        }
      } catch (error) {
        console.error("Error checking adoption status: ", error);
      } finally {
        setLoading(false);
      }
    };

    checkAdoptionStatus();
  }, [pet.id]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    setLoading(true);
    const petRef = doc(db, "pets", pet.id);
    const unsubscribe = onSnapshot(
      petRef,
      (petSnap) => {
        if (petSnap.exists()) {
          setPetDetails(petSnap.data());
        } else {
          console.log("No such document!");
        }

        setLoading(false);
      },
      (error) => {
        console.error("Error fetching pet details: ", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [pet.id]);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const shelter = auth.currentUser;

        if (shelter) {
          const conversationsRef = collection(
            db,
            "shelters",
            shelter.uid,
            "conversations"
          );
          const q = query(conversationsRef, where("petId", "==", pet.id));
          const querySnapshot = await getDocs(q);

          const conversationPromises = querySnapshot.docs.map(
            async (docSnapshot) => {
              const conversationData = docSnapshot.data();
              const userId = conversationData.participants[0]; // Assuming participants[0] is the user

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
            return { ...userData, uid: userId };
          }
          return null;
        });

        const usersDetails = await Promise.all(userDetailsPromises);
        setUsers(usersDetails.filter(Boolean));
      } catch (error) {
        console.error("Error fetching user details: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (conversations.length > 0) {
      fetchUsers();
    } else {
      setLoading(false);
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

  const handleConfirmDelete = () => {
    setModalMessage("Are you sure you want to delete this pet?");
    setAlertModal(true);
  };

  const handleDeletePress = async () => {
    const { id } = pet;
    try {
      const user = auth.currentUser;
      const statsRef = doc(db, "shelters", user.uid, "statistics", user.uid);
      const petRef = doc(db, "pets", id);
      const petSnap = await getDoc(petRef);

      if (petSnap.exists()) {
        const petData = petSnap.data();
        const petReadyForAdoption = petData.readyForAdoption;

        await runTransaction(db, async (transaction) => {
          const statsDoc = await transaction.get(statsRef);

          if (statsDoc.exists()) {
            const currentStats = statsDoc.data();

            let petsForAdoption = currentStats.petsForAdoption;
            let petsRescued = currentStats.petsRescued;

            if (petReadyForAdoption) {
              petsForAdoption -= 1;
            }

            petsRescued -= 1;

            transaction.update(statsRef, {
              petsForAdoption: petsForAdoption,
              petsRescued: petsRescued,
            });
          }
        });

        await deleteDoc(petRef);

        navigation.goBack();
        console.log("Pet deleted successfully!");
      } else {
        console.log("Pet not found!");
        setModalMessage("Pet not found.");
        setAlertModal(true);
      }
    } catch (error) {
      console.error("Error deleting pet:", error);
      setModalMessage("Failed to delete pet. Please try again.");
      setAlertModal(true);
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
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.title} />
        </TouchableOpacity>
      </View>
      <View style={styles.petStyles}>
        <ScrollView>
          <View style={styles.petNamePriceContainer}>
            <Text style={styles.petName}>{petDetails.name}</Text>
            <View>
              {petDetails.petPrice ? (
                <Text style={styles.petPriceTitle}>Adoption Fee:</Text>
              ) : null}
              {petDetails.petPrice ? (
                <Text style={styles.petPrice}>₱{petDetails.petPrice}</Text>
              ) : (
                <Text style={styles.petPrice}>Free</Text>
              )}
            </View>
          </View>

          <Text style={styles.petPostedDate}>Pet Posted: {formattedDate}</Text>
          {petDetails.readyForAdoption && !adopted ? (
            <Text style={styles.readyForAdoption}>Ready for Adoption</Text>
          ) : !adopted ? (
            <Text style={styles.notYetReadyForAdoption}>
              Not yet ready for adoption
            </Text>
          ) : null}
          {adopted && adoptedByUser && (
            <View style={styles.adoptedContainer}>
              <Text style={styles.adoptedText}>Adopted By:</Text>
              <View style={styles.adoptedByContainer}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("DisplayUserPage", { userId: pet.adoptedBy })
                  }
                >
                  <View style={styles.adoptedByUserInfo}>
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
                  </View>
                </TouchableOpacity>

                <View style={styles.callMessage}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleCall(adoptedByUser.mobileNumber)}
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
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleConfirmDelete}
          >
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
      <Modal isVisible={alertModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setAlertModal(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalDeleteButton}
              onPress={handleDeletePress}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default PetDetails;
