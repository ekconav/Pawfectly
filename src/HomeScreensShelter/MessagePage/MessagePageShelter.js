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
  updateDoc,
  getDoc,
  setDoc,
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

const MessagePageShelter = ({ route }) => {
  const { conversationId, petId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [messageSent, setMessageSent] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAccountPicture, setUserAccountPicture] = useState("");
  const [shelterAccountPicture, setShelterAccountPicture] = useState("");
  const [petName, setPetName] = useState("");
  const [userExist, setUserExist] = useState(true);
  const [petExist, setPetExist] = useState(true);
  const [petAdopted, setPetAdopted] = useState(false);
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [sendLoading, setSendLoading] = useState(false);

  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const shelterDocRef = doc(db, "shelters", currentUser.uid);
        const userDocRef = doc(db, "users", userId);
        const petDocRef = doc(db, "pets", petId);

        const [shelterDoc, userDoc, petDoc] = await Promise.all([
          getDoc(shelterDocRef),
          getDoc(userDocRef),
          getDoc(petDocRef),
        ]);

        if (shelterDoc.exists()) {
          setShelterAccountPicture(shelterDoc.data().accountPicture);
        }

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.firstName);
          setUserAccountPicture(userData.accountPicture);
          setUserMobileNumber(userData.mobileNumber);
        } else {
          setUserName("Pawfectly User");
          setUserExist(false);
        }

        if (!petDoc.exists()) {
          setPetExist(false);
        } else {
          const petData = petDoc.data();
          setPetName(petData.name);
          setPetAdopted(petData.adopted || false);
        }

        const messagesRef = collection(
          db,
          "shelters",
          currentUser.uid,
          "conversations",
          conversationId,
          "messages"
        );
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const messagesData = snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .reverse();
          setMessages(messagesData);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId, petId, userId]);

  useEffect(() => {
    const fetchAdoptionMessage = async () => {
      if (!conversationId || !petId || !currentUser) {
        return;
      }

      setLoading(true);

      try {
        const conversationDocRef = doc(
          db,
          "shelters",
          currentUser.uid,
          "conversations",
          conversationId
        );
        const conversationSnap = await getDoc(conversationDocRef);

        if (conversationSnap.exists()) {
          const messagesRef = collection(conversationDocRef, "messages");
          const messageText = `Hello, I would like to adopt ${petName}.`;
          const messageQuery = query(messagesRef, where("text", "==", messageText));

          const messageSnap = await getDocs(messageQuery);
          if (!messageSnap.empty) {
            setMessageSent(true);
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

  const updateConversation = async (conversationRef, newMessage) => {
    const conversationSnap = await getDoc(conversationRef);
    if (!conversationSnap.exists()) {
      await setDoc(conversationRef, {
        lastMessage: newMessage,
        lastTimestamp: serverTimestamp(),
        participants: [userId, currentUser.uid],
        petId: petId,
        senderRead: false,
        receiverRead: true,
      });
    } else {
      await updateDoc(conversationRef, {
        lastMessage: newMessage,
        lastTimestamp: serverTimestamp(),
        petId: petId,
        senderRead: false,
        receiverRead: true,
      });
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }
    setSendLoading(true);
    try {
      const shelterMessagesRef = collection(
        db,
        "shelters",
        currentUser.uid,
        "conversations",
        conversationId,
        "messages"
      );
      const userMessagesRef = collection(
        db,
        "users",
        userId,
        "conversations",
        conversationId,
        "messages"
      );

      await Promise.all([
        addDoc(shelterMessagesRef, {
          text: newMessage,
          senderId: currentUser.uid,
          receiverId: userId,
          timestamp: serverTimestamp(),
        }),
        addDoc(userMessagesRef, {
          text: newMessage,
          senderId: currentUser.uid,
          receiverId: userId,
          timestamp: serverTimestamp(),
        }),
      ]);

      await Promise.all([
        updateConversation(
          doc(db, "shelters", currentUser.uid, "conversations", conversationId),
          newMessage
        ),
        updateConversation(
          doc(db, "users", userId, "conversations", conversationId),
          newMessage
        ),
      ]);

      setNewMessage("");
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
      await uploadBytes(imageRef, bytes);
      const imageUrl = await getDownloadURL(imageRef);

      const shelterMessagesRef = collection(
        db,
        "shelters",
        currentUser.uid,
        "conversations",
        conversationId,
        "messages"
      );
      const userMessagesRef = collection(
        db,
        "users",
        userId,
        "conversations",
        conversationId,
        "messages"
      );

      await Promise.all([
        addDoc(shelterMessagesRef, {
          text: imageUrl,
          senderId: currentUser.uid,
          receiverId: userId,
          timestamp: serverTimestamp(),
        }),
        addDoc(userMessagesRef, {
          text: imageUrl,
          senderId: currentUser.uid,
          receiverId: userId,
          timestamp: serverTimestamp(),
        }),
      ]);

      await Promise.all([
        updateConversation(
          doc(db, "shelters", currentUser.uid, "conversations", conversationId),
          "Image"
        ),
        updateConversation(
          doc(db, "users", userId, "conversations", conversationId),
          "Image"
        ),
      ]);
    } catch (error) {
      console.error("Error sending image message:", error);
    } finally {
      setSendLoading(false);
    }
  };

  const handleApproveAdoption = async () => {
    try {
      const petRef = doc(db, "pets", petId);
      const petSnap = await getDoc(petRef);

      const petsAdoptedCollection = collection(db, "users", userId, "petsAdopted");

      if (petSnap.exists()) {
        const petData = petSnap.data();
        await updateDoc(petRef, {
          adopted: true,
          adoptedBy: userId,
        });

        const petDocRef = doc(db, "users", userId, "petsAdopted", petId);

        setDoc(petDocRef, {
          adopted: true,
          adoptedBy: userId,
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

        setPetAdopted(true);
        console.log("Pet successfully adopted!");
      }
    } catch (error) {
      console.error("Error approving pet: ", error);
    }
  };

  const handleCall = async () => {
    try {
      if (userMobileNumber) {
        await Linking.openURL(`tel:${userMobileNumber}`);
      } else {
        setModalMessage("Sorry, we couldn't find the user you're looking for.");
        setAlertModal(true);
      }
    } catch (error) {
      console.error("Error initiating call: ", error);
    }
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
                  userAccountPicture
                    ? { uri: userAccountPicture }
                    : require("../../components/user.png")
                }
                style={styles.userProfileImage}
              />
            ) : (
              <Image
                source={
                  shelterAccountPicture
                    ? { uri: shelterAccountPicture }
                    : require("../../components/user.png")
                }
                style={styles.shelterProfileImage}
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
                <Image source={{ uri: item.text }} style={styles.messageImage} />
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
        <View style={styles.headerContent}>
          <Image
            source={
              userAccountPicture
                ? { uri: userAccountPicture }
                : require("../../components/user.png")
            }
            style={styles.userAccountPictureHeader}
          />
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {userName}
          </Text>
        </View>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Ionicons name="call" size={24} color={COLORS.prim} />
        </TouchableOpacity>
      </View>
      {messageSent && !petAdopted && userExist ? (
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>
            <Text style={styles.userName}>{userName}</Text> wants to adopt {petName}.
          </Text>
          <TouchableOpacity
            style={styles.approveButton}
            onPress={handleApproveAdoption}
          >
            <Text style={styles.approveText}>Approve</Text>
          </TouchableOpacity>
        </View>
      ) : petAdopted ? (
        <View style={styles.subHeader}>
          <Text style={styles.subHeaderText}>
            <Text style={styles.userName}>{userName}</Text> has adopted {petName}!
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
      {!userExist ? (
        <View style={styles.userExist}>
          <Text style={styles.userExistText}>
            You can't reply to this conversation.
          </Text>
        </View>
      ) : !petExist ? (
        <View style={styles.userExist}>
          <Text style={styles.userExistText}>Pet data has been deleted.</Text>
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
    </View>
  );
};

export default MessagePageShelter;
