import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
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
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        const shelterDoc = await getDoc(doc(db, "shelters", shelterId));
        const petDoc = await getDoc(doc(db, "pets", petId));

        if (userDoc.exists()) {
          setUserAccountPicture(userDoc.data().accountPicture);
        }

        if (shelterDoc.exists()) {
          setShelterName(shelterDoc.data().shelterName);
          setShelterAccountPicture(shelterDoc.data().accountPicture);
        } else {
          setShelterName("Pawfectly User");
          setShelterExist(false);
        }

        if (!petDoc.exists()) {
          setPetExist(false);
        } else {
          setPetName(petDoc.data().name);
        }

        if (
          petDoc.exists() &&
          petDoc.data().adopted === true &&
          petDoc.data().adoptedBy === currentUser.uid
        ) {
          setPetAdoptedByYou(true);
        }

        if (
          petDoc.exists() &&
          petDoc.data().adopted === true &&
          petDoc.data().adoptedBy !== currentUser.uid
        ) {
          setPetAdoptedByAnotherUser(true);
        }

        const messagesRef = collection(
          db,
          "users",
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
        setLoading(false);
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [conversationId, petId, shelterId]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }
    try {
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
        "shelters",
        shelterId,
        "conversations",
        conversationId,
        "messages"
      );

      await addDoc(userMessagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        receiverId: shelterId,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");

      await addDoc(shelterMessagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        receiverId: shelterId,
        timestamp: serverTimestamp(),
      });

      const userConversationRef = doc(
        db,
        "users",
        currentUser.uid,
        "conversations",
        conversationId
      );
      const userConversationSnap = await getDoc(userConversationRef);

      const shelterConversationRef = doc(
        db,
        "shelters",
        shelterId,
        "conversations",
        conversationId
      );
      const shelterConversationSnap = await getDoc(shelterConversationRef);

      if (!userConversationSnap.exists()) {
        // Create the conversation document if it doesn't exist
        await setDoc(userConversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          participants: [currentUser.uid, shelterId],
          petId: petId,
          senderRead: true,
          receiverRead: false,
        });
      } else {
        // Update the conversation document with the new lastMessage and lastTimestamp
        await updateDoc(userConversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          senderRead: true,
          receiverRead: false,
        });
      }

      if (!shelterConversationSnap.exists()) {
        await setDoc(shelterConversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          participants: [currentUser.uid, shelterId],
          petId: petId,
          senderRead: true,
          receiverRead: false,
        });
      } else {
        await updateDoc(shelterConversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          senderRead: true,
          receiverRead: false,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
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
    try {
      const imageRef = ref(storage, `images/${Date.now()}_${currentUser.uid}`);
      const img = await fetch(imageUri);
      const bytes = await img.blob();
      await uploadBytes(imageRef, bytes);
      const imageUrl = await getDownloadURL(imageRef);
      console.log("Image uploaded successfully:", imageUrl);

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
        "shelters",
        shelterId,
        "conversations",
        conversationId,
        "messages"
      );

      await addDoc(userMessagesRef, {
        text: imageUrl,
        senderId: currentUser.uid,
        receiverId: shelterId,
        timestamp: serverTimestamp(),
      });

      await addDoc(shelterMessagesRef, {
        text: imageUrl,
        senderId: currentUser.uid,
        receiverId: shelterId,
        timestamp: serverTimestamp(),
      });

      console.log("Image message sent successfully");

      const userConversationRef = doc(
        db,
        "users",
        currentUser.uid,
        "conversations",
        conversationId
      );
      const shelterConversationRef = doc(
        db,
        "shelters",
        shelterId,
        "conversations",
        conversationId
      );

      await updateDoc(userConversationRef, {
        lastMessage: "Image",
        lastTimestamp: serverTimestamp(),
        petId: petId,
        senderRead: true,
        receiverRead: false,
      });

      await updateDoc(shelterConversationRef, {
        lastMessage: "Image",
        lastTimestamp: serverTimestamp(),
        petId: petId,
        senderRead: true,
        receiverRead: false,
      });
    } catch (error) {
      console.error("Error sending image message:", error);
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
            {/* Display message */}
            <View style={styles.messageContent}>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.prim} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          {/* Display shelter account picture in header */}
          <Image
            source={
              shelterAccountPicture
                ? { uri: shelterAccountPicture }
                : require("../../components/user.png")
            }
            style={styles.shelterAccountPictureHeader}
          />
          {/* Display shelter name */}
          <Text style={styles.headerTitle}>{shelterName}</Text>
        </View>
      </View>
      {petAdoptedByYou ? (
        <View style={styles.petAdoptedContainer}>
          <Text style={styles.petAdoptedText}>
            Congratulations, you adopted {petName}!
          </Text>
        </View>
      ) : (
        <View></View>
      )}

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
      ) : petAdoptedByAnotherUser ? (
        <View style={styles.shelterExist}>
          <Text style={styles.shelterExistText}>Pet is already adopted.</Text>
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
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color={COLORS.prim} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MessagePage;
