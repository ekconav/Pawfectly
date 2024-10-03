import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import { db, auth, storage } from "../../FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";
import COLORS from "../../const/colors";

const MessagePage = ({ route }) => {
  const { conversationId, shelterId, petId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [shelterName, setShelterName] = useState("");
  const [userAccountPicture, setUserAccountPicture] = useState("");
  const [shelterAccountPicture, setShelterAccountPicture] = useState("");
  const [loading, setLoading] = useState(true);
  const [shelterExist, setShelterExist] = useState(true);
  const [petExist, setPetExist] = useState(true);
  const [petAdoptedByYou, setPetAdoptedByYou] = useState(false);
  const [petAdoptedByAnotherUser, setPetAdoptedByAnotherUser] = useState(false);
  const [petName, setPetName] = useState("");
  const [shelterMobileNumber, setShelterMobileNumber] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [sendLoading, setSendLoading] = useState(false);
  const [adoptionMessageSent, setAdoptionMessageSent] = useState(false);
  const [petPostedByMe, setPetPostedByMe] = useState(false);
  const [userToUserAdoptionSuccess, setUserToUserAdoptionSuccess] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [userToUser, setUserToUser] = useState(false);

  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  const [otherParticipantId, setOtherParticipantId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setUserToUserAdoptionSuccess(false);
      setUserToUser(false);
      setAdoptionMessageSent(false);
      setPetPostedByMe(false);

      setLoading(true);
      try {
        const conversationRef = doc(
          db,
          "users",
          currentUser.uid,
          "conversations",
          conversationId
        );
        const conversationDoc = await getDoc(conversationRef);

        if (!conversationDoc.exists()) {
          const userDocRef = doc(db, "users", currentUser.uid);
          const shelterDocRef = doc(db, "shelters", shelterId);
          const petDocRef = doc(db, "pets", petId);

          const [userDoc, shelterDoc] = await Promise.all([
            getDoc(userDocRef),
            getDoc(shelterDocRef),
          ]);

          if (userDoc.exists()) {
            setUserAccountPicture(userDoc.data().accountPicture);
          }

          if (shelterDoc.exists()) {
            const shelterData = shelterDoc.data();
            setShelterName(shelterData.shelterName);
            setShelterAccountPicture(shelterData.accountPicture);
            setShelterMobileNumber(shelterData.mobileNumber);
          } else {
            const userRef = doc(db, "users", shelterId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              setUserToUser(true);
              const userData = userDoc.data();
              setShelterName(`${userData.firstName} ${userData.lastName}`);
              setShelterAccountPicture(userData.accountPicture);
              setShelterMobileNumber(userData.mobileNumber);
            } else {
              setShelterName("Pawfectly User");
              setShelterExist(false);
            }
          }

          const unsubscribePet = onSnapshot(petDocRef, (snapshot) => {
            if (!snapshot.exists()) {
              setPetExist(false);
            } else {
              const petData = snapshot.data();
              setPetName(petData.name);
              if (petData.adopted && petData.adoptedBy === currentUser.uid) {
                setPetAdoptedByYou(true);
                setPetAdoptedByAnotherUser(false);
              } else if (petData.adopted && petData.adoptedBy !== currentUser.uid) {
                setPetAdoptedByAnotherUser(true);
                setPetAdoptedByYou(false);
              } else {
                setPetAdoptedByYou(false);
                setPetAdoptedByAnotherUser(false);
              }
            }
          });

          const messagesRef = collection(
            db,
            "users",
            currentUser.uid,
            "conversations",
            conversationId,
            "messages"
          );
          const q = query(messagesRef, orderBy("timestamp", "asc"));
          const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .reverse();
            setMessages(messagesData);
          });
          setLoading(false);
          return () => {
            unsubscribePet();
            unsubscribeMessages();
          };
        } else {
          const conversationData = conversationDoc.data();
          const participants = conversationData.participants;

          // Determine the other participant (either user or shelter)
          const otherParticipantId = participants.find(
            (participant) => participant !== currentUser.uid
          );

          setOtherParticipantId(otherParticipantId);

          const userDocRef = doc(db, "users", currentUser.uid);
          const shelterDocRef = doc(db, "shelters", otherParticipantId);
          const petDocRef = doc(db, "pets", petId);

          const [userDoc, shelterDoc] = await Promise.all([
            getDoc(userDocRef),
            getDoc(shelterDocRef),
          ]);

          if (userDoc.exists()) {
            setUserAccountPicture(userDoc.data().accountPicture);
          }

          if (shelterDoc.exists()) {
            const shelterData = shelterDoc.data();
            setShelterName(shelterData.shelterName);
            setShelterAccountPicture(shelterData.accountPicture);
            setShelterMobileNumber(shelterData.mobileNumber);
          } else {
            const userRef = doc(db, "users", otherParticipantId);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
              setUserToUser(true);
              const userData = userDoc.data();
              setShelterName(`${userData.firstName} ${userData.lastName}`);
              setShelterAccountPicture(userData.accountPicture);
              setShelterMobileNumber(userData.mobileNumber);
            } else {
              setShelterName("Pawfectly User");
              setShelterExist(false);
            }
          }

          const unsubscribePet = onSnapshot(petDocRef, (snapshot) => {
            if (!snapshot.exists()) {
              setPetExist(false);
            } else {
              const petData = snapshot.data();
              setPetName(petData.name);
              if (petData.adopted && petData.adoptedBy === otherParticipantId) {
                setUserToUserAdoptionSuccess(true);
              } else if (petData.adopted && petData.adoptedBy === currentUser.uid) {
                setPetAdoptedByYou(true);
                setPetAdoptedByAnotherUser(false);
              } else if (petData.adopted && petData.adoptedBy !== currentUser.uid) {
                setPetAdoptedByAnotherUser(true);
                setPetAdoptedByYou(false);
              } else {
                setPetAdoptedByYou(false);
                setPetAdoptedByAnotherUser(false);
              }
            }
          });

          const messagesRef = collection(
            db,
            "users",
            currentUser.uid,
            "conversations",
            conversationId,
            "messages"
          );
          const q = query(messagesRef, orderBy("timestamp", "asc"));
          const unsubscribeMessages = onSnapshot(q, (snapshot) => {
            const messagesData = snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }))
              .reverse();
            setMessages(messagesData);
          });
          setLoading(false);
          return () => {
            unsubscribePet();
            unsubscribeMessages();
          };
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId, petId, shelterId]);

  useEffect(() => {
    const fetchAdoptionMessage = async () => {
      if (!conversationId || !petId || !currentUser) {
        return;
      }

      setLoading(true);

      try {
        const conversationDocRef = doc(
          db,
          "users",
          currentUser.uid,
          "conversations",
          conversationId
        );
        const conversationSnap = await getDoc(conversationDocRef);

        if (conversationSnap.exists()) {
          if (conversationSnap.data().participants[1] === currentUser.uid) {
            setPetPostedByMe(true);
          }
          const messagesRef = collection(conversationDocRef, "messages");
          const messageText = `Hello, I would like to adopt ${petName}.`;
          const messageQuery = query(messagesRef, where("text", "==", messageText));

          const messageSnap = await getDocs(messageQuery);
          if (!messageSnap.empty) {
            setAdoptionMessageSent(true);
          }
        }
      } catch (error) {
        console.error("Error fetching pet details: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdoptionMessage();
  }, [conversationId, petId, currentUser, petName]);

  const handleApproveAdoption = async () => {
    try {
      const petRef = doc(db, "pets", petId);
      const petSnap = await getDoc(petRef);

      const conversationDocRef = doc(
        db,
        "users",
        currentUser.uid,
        "conversations",
        conversationId
      );
      const conversationSnap = await getDoc(conversationDocRef);

      if (conversationSnap.exists()) {
        const participantZero = conversationSnap.data().participants[0];
        if (petSnap.exists()) {
          const petData = petSnap.data();
          await updateDoc(petRef, {
            adopted: true,
            adoptedBy: participantZero,
          });

          const petDocRef = doc(db, "users", participantZero, "petsAdopted", petId);

          setDoc(petDocRef, {
            adopted: true,
            adoptedBy: participantZero,
            age: petData.age,
            breed: petData.breed,
            description: petData.description,
            gender: petData.gender,
            images: petData.images,
            location: petData.location,
            name: petData.name,
            petPosted: serverTimestamp(),
            type: petData.type,
            userId: petData.userId,
          });
        }
        console.log("Pet successfully adopted!");
      }
    } catch (error) {
      console.error("Error approving pet: ", error);
    }
  };

  const updateConversation = async (ref, lastMessage, isSender, recipientId) => {
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        lastMessage,
        lastTimestamp: serverTimestamp(),
        participants: [currentUser.uid, recipientId],
        petId: petId,
        seen: isSender ? true : false,
      });
    } else {
      // Existing conversation document
      await updateDoc(ref, {
        lastMessage,
        lastTimestamp: serverTimestamp(),
        seen: isSender ? true : false,
      });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    setSendLoading(true);
    try {
      const conversationRef = doc(
        db,
        "users",
        currentUser.uid,
        "conversations",
        conversationId
      );
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        const userMessagesRef = collection(
          db,
          "users",
          currentUser.uid,
          "conversations",
          conversationId,
          "messages"
        );

        const shelterMessagesRef = collection(
          db,
          userToUser ? "users" : "shelters",
          shelterId,
          "conversations",
          conversationId,
          "messages"
        );

        await Promise.all([
          addDoc(userMessagesRef, {
            text: newMessage,
            senderId: currentUser.uid,
            receiverId: shelterId,
            timestamp: serverTimestamp(),
          }),
          addDoc(shelterMessagesRef, {
            text: newMessage,
            senderId: currentUser.uid,
            receiverId: shelterId,
            timestamp: serverTimestamp(),
          }),
        ]);

        await Promise.all([
          updateConversation(
            doc(db, "users", currentUser.uid, "conversations", conversationId),
            newMessage,
            true,
            shelterId
          ),
          userToUser
            ? updateConversation(
                doc(db, "users", shelterId, "conversations", conversationId),
                newMessage,
                false,
                shelterId
              )
            : updateConversation(
                doc(db, "shelters", shelterId, "conversations", conversationId),
                newMessage,
                false,
                shelterId
              ),
        ]);

        setNewMessage("");
      } else {
        const conversationData = conversationDoc.data();
        const participants = conversationData.participants;

        // Determine the other participant (either user or shelter)
        const otherParticipantId = participants.find(
          (participant) => participant !== currentUser.uid
        );

        const userMessagesRef = collection(
          db,
          "users",
          currentUser.uid,
          "conversations",
          conversationId,
          "messages"
        );

        let recipientMessagesRef;
        if (userToUser) {
          recipientMessagesRef = collection(
            db,
            "users",
            otherParticipantId,
            "conversations",
            conversationId,
            "messages"
          );
        } else {
          recipientMessagesRef = collection(
            db,
            "shelters",
            shelterId,
            "conversations",
            conversationId,
            "messages"
          );
        }

        await Promise.all([
          addDoc(userMessagesRef, {
            text: newMessage,
            senderId: currentUser.uid,
            receiverId: otherParticipantId,
            timestamp: serverTimestamp(),
          }),
          addDoc(recipientMessagesRef, {
            text: newMessage,
            senderId: currentUser.uid,
            receiverId: otherParticipantId,
            timestamp: serverTimestamp(),
          }),
        ]);

        await Promise.all([
          updateConversation(
            doc(db, "users", currentUser.uid, "conversations", conversationId),
            newMessage,
            true,
            userToUser ? otherParticipantId : shelterId
          ),
          userToUser
            ? updateConversation(
                doc(
                  db,
                  "users",
                  otherParticipantId,
                  "conversations",
                  conversationId
                ),
                newMessage,
                false,
                currentUser.uid
              )
            : updateConversation(
                doc(db, "shelters", shelterId, "conversations", conversationId),
                newMessage,
                false,
                currentUser.uid
              ),
        ]);

        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSendLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.cancelled && result.assets) {
      console.log("Image selected:", result.assets[0].uri);
      handleSendImage(result.assets[0].uri);
    }
  };

  const handleSendImage = async (imageUri) => {
    setSendLoading(true);
    try {
      const imageRef = ref(storage, `images/${Date.now()}_${currentUser.uid}`);
      const img = await fetch(imageUri);
      const bytes = await img.blob();
      const imageUrl = await uploadBytes(imageRef, bytes).then(() =>
        getDownloadURL(imageRef)
      );

      const conversationRef = doc(
        db,
        "users",
        currentUser.uid,
        "conversations",
        conversationId
      );
      const conversationDoc = await getDoc(conversationRef);

      if (!conversationDoc.exists()) {
        const userMessagesRef = collection(
          db,
          "users",
          currentUser.uid,
          "conversations",
          conversationId,
          "messages"
        );

        const shelterMessagesRef = collection(
          db,
          userToUser ? "users" : "shelters",
          shelterId,
          "conversations",
          conversationId,
          "messages"
        );

        await Promise.all([
          addDoc(userMessagesRef, {
            text: imageUrl,
            senderId: currentUser.uid,
            receiverId: shelterId,
            timestamp: serverTimestamp(),
          }),
          addDoc(shelterMessagesRef, {
            text: imageUrl,
            senderId: currentUser.uid,
            receiverId: shelterId,
            timestamp: serverTimestamp(),
          }),
        ]);

        await Promise.all([
          updateConversation(
            doc(db, "users", currentUser.uid, "conversations", conversationId),
            "Image",
            true,
            shelterId
          ),
          userToUser
            ? updateConversation(
                doc(db, "users", shelterId, "conversations", conversationId),
                "Image",
                false,
                shelterId
              )
            : updateConversation(
                doc(db, "shelters", shelterId, "conversations", conversationId),
                "Image",
                false,
                shelterId
              ),
        ]);
      } else {
        const conversationData = conversationDoc.data();
        const participants = conversationData.participants;

        // Determine the other participant (either user or shelter)
        const otherParticipantId = participants.find(
          (participant) => participant !== currentUser.uid
        );

        const userMessagesRef = collection(
          db,
          "users",
          currentUser.uid,
          "conversations",
          conversationId,
          "messages"
        );

        let recipientMessagesRef;
        if (userToUser) {
          recipientMessagesRef = collection(
            db,
            "users",
            otherParticipantId,
            "conversations",
            conversationId,
            "messages"
          );
        } else {
          recipientMessagesRef = collection(
            db,
            "shelters",
            shelterId,
            "conversations",
            conversationId,
            "messages"
          );
        }

        await Promise.all([
          addDoc(userMessagesRef, {
            text: imageUrl,
            senderId: currentUser.uid,
            receiverId: shelterId,
            timestamp: serverTimestamp(),
          }),
          addDoc(recipientMessagesRef, {
            text: imageUrl,
            senderId: currentUser.uid,
            receiverId: shelterId,
            timestamp: serverTimestamp(),
          }),
        ]);

        await Promise.all([
          updateConversation(
            doc(db, "users", currentUser.uid, "conversations", conversationId),
            "Image",
            true,
            userToUser ? otherParticipantId : shelterId
          ),
          userToUser
            ? updateConversation(
                doc(
                  db,
                  "users",
                  otherParticipantId,
                  "conversations",
                  conversationId
                ),
                "Image",
                false,
                currentUser.uid
              )
            : updateConversation(
                doc(db, "shelters", shelterId, "conversations", conversationId),
                "Image",
                false,
                currentUser.uid
              ),
        ]);
      }
    } catch (error) {
      console.error("Error sending image message:", error);
    } finally {
      setSendLoading(false);
    }
  };

  const handleCall = async () => {
    try {
      if (shelterMobileNumber) {
        await Linking.openURL(`tel:${shelterMobileNumber}`);
      } else {
        setModalMessage("Sorry, we couldn't find the shelter you're looking for.");
        setAlertModal(true);
      }
    } catch (error) {
      console.error("Error initiating call: ", error);
    }
  };

  const handleImagePress = (uri) => {
    setSelectedImage(uri);
    setImageModalVisible(true);
  };

  const closeModal = () => {
    setImageModalVisible(false);
    setSelectedImage(null);
  };

  const renderItem = ({ item }) => {
    const isCurrentUser = item.senderId === currentUser.uid;
    const messageTime = item.timestamp
      ? item.timestamp.toDate().toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          month: "numeric",
          day: "numeric",
          year: "numeric",
          hour12: true,
        })
      : "";
    const isImageMessage = item.text.startsWith("http");
    return (
      <View style={styles.mainMessageContainer}>
        <View
          style={
            !isCurrentUser
              ? styles.receiveMessageContainer
              : styles.sendMessageContainer
          }
        >
          <View>
            {!isCurrentUser ? (
              <Image
                source={
                  shelterAccountPicture
                    ? { uri: shelterAccountPicture }
                    : require("../../components/user.png")
                }
                style={styles.shelterProfileImage}
              />
            ) : (
              <Image
                source={
                  userAccountPicture
                    ? { uri: userAccountPicture }
                    : require("../../components/user.png")
                }
                style={styles.userProfileImage}
              />
            )}
          </View>
          <View
            style={[
              styles.messageContainer,
              isCurrentUser ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <View>
              {isImageMessage ? (
                <TouchableOpacity onPress={() => handleImagePress(item.text)}>
                  <Image source={{ uri: item.text }} style={styles.messageImage} />
                </TouchableOpacity>
              ) : (
                <Text
                  style={
                    isCurrentUser
                      ? styles.sentMessageText
                      : styles.receivedMessageText
                  }
                >
                  {item.text}
                </Text>
              )}
              {messageTime ? (
                <Text
                  style={
                    !isCurrentUser
                      ? styles.receivedMessageTime
                      : styles.sendMessageTime
                  }
                >
                  {messageTime}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.prim} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerContent}
          onPress={() =>
            navigation.navigate("DisplayUserPage", { userId: otherParticipantId })
          }
        >
          <Image
            source={
              shelterAccountPicture
                ? { uri: shelterAccountPicture }
                : require("../../components/user.png")
            }
            style={styles.shelterAccountPictureHeader}
          />
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {shelterName}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color={COLORS.prim} />
        </TouchableOpacity>
      </View>
      {adoptionMessageSent && petPostedByMe && !userToUserAdoptionSuccess ? (
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>
            {shelterName} wants to adopt {petName}.
          </Text>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handleApproveAdoption}
          >
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      ) : userToUserAdoptionSuccess ? (
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>
            {shelterName} has adopted {petName}.
          </Text>
        </View>
      ) : null}
      {petAdoptedByYou && !petPostedByMe ? (
        <View style={styles.petAdoptedContainer}>
          <Text style={styles.petAdoptedText}>
            Congratulations, you adopted {petName}!
          </Text>
        </View>
      ) : petAdoptedByAnotherUser && !petPostedByMe ? (
        <View style={styles.petAdoptedContainer}>
          <Text style={styles.petAdoptedText}>
            Sorry, {petName} has been adopted already.
          </Text>
        </View>
      ) : null}

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        inverted
      />

      {/* Input */}
      {!shelterExist ? (
        <View style={styles.shelterExist}>
          <Text style={styles.shelterExistText}>
            You can't reply to this conversation.
          </Text>
        </View>
      ) : !petExist ? (
        <View style={styles.shelterExist}>
          <Text style={styles.shelterExistText}>
            Pet data has been deleted by the shelter.
          </Text>
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message"
            value={newMessage}
            onChangeText={setNewMessage}
            multiline={true}
          />
          <TouchableOpacity style={styles.imageIcon} onPress={pickImage}>
            <Ionicons name="image" size={30} color={COLORS.prim} />
          </TouchableOpacity>
          {sendLoading ? (
            <ActivityIndicator
              style={{ paddingHorizontal: 4 }}
              size="large"
              color={COLORS.prim}
            />
          ) : (
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Ionicons name="send" size={24} color={COLORS.prim} />
            </TouchableOpacity>
          )}
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
      <Modal isVisible={imageModalVisible} onRequestClose={closeModal}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeModal}
        >
          <Image
            source={{ uri: selectedImage }}
            style={styles.expandedImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default MessagePage;
