import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import styles from "./styles";

const MessagePageShelter = ({ route }) => {
  const { conversationId, petId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [userAccountPicture, setUserAccountPicture] = useState("");
  const [shelterAccountPicture, setShelterAccountPicture] = useState("");
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // const messagesRef = collection(db, "conversations", conversationId, "messages");
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
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    const fetchConversation = async () => {
      try {
        const conversationDoc = await getDoc(
          doc(db, "shelters", currentUser.uid, "conversations", conversationId)
        );
        if (conversationDoc.exists()) {
          const senderId = conversationDoc
            .data()
            .participants.find((participant) => participant !== currentUser.uid);
          fetchSenderName(senderId);
        } else {
          console.error(
            "Conversation document not found for conversationId:",
            conversationId
          );
        }
      } catch (error) {
        console.error("Error fetching conversation:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPetName = async () => {
      try {
        const petDoc = await getDoc(doc(db, "pets", petId));
        if (petDoc.exists()) {
          setPetName(petDoc.data().name);
        } else {
          console.error("Pet document not found for petId:", petId);
        }
      } catch (error) {
        console.error("Error fetching pet name:", error);
      }
    };

    const fetchData = async () => {
      try {
        const userDoc = await getDoc(doc(db, "users", userId));
        const shelterDoc = await getDoc(doc(db, "shelters", currentUser.uid));

        if (userDoc.exists()) {
          setUserAccountPicture(userDoc.data().accountPicture);
        } else {
          console.error("User document not found for userId: ", userId);
        }

        if (shelterDoc.exists()) {
          setShelterAccountPicture(shelterDoc.data().accountPicture);
        } else {
          console.error(
            "Shelter document not found for shelterId: ",
            currentUser.uid
          );
        }
      } catch (error) {}
    };

    fetchMessages();
    fetchConversation();
    fetchPetName();
    fetchData();
  }, [conversationId]);

  const fetchSenderName = async (senderId) => {
    try {
      const senderDoc = await getDoc(doc(db, "users", senderId));
      if (senderDoc.exists()) {
        setSenderName(senderDoc.data().firstName);
      } else {
        console.error("User document not found for senderId:", senderId);
      }
    } catch (error) {
      console.error("Error fetching sender name:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") {
      return;
    }
    try {
      // const messagesRef = collection(db, "conversations", conversationId, "messages");
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

      await addDoc(shelterMessagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        receiverId: userId,
        timestamp: serverTimestamp(),
      });

      await addDoc(userMessagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        receiverId: userId,
        timestamp: serverTimestamp(),
      });

      // const conversationRef = doc(db, "conversations", conversationId);
      const shelterConversationRef = doc(
        db,
        "shelters",
        currentUser.uid,
        "conversations",
        conversationId
      );
      const shelterConversationSnap = await getDoc(shelterConversationRef);

      const userConversationRef = doc(
        db,
        "users",
        userId,
        "conversations",
        conversationId
      );
      const userConversationSnap = await getDoc(userConversationRef);

      if (!shelterConversationSnap.exists()) {
        await setDoc(shelterConversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          participants: [userId, currentUser.uid],
          petId: petId,
          senderRead: false,
          receiverRead: true,
        });
      } else {
        await updateDoc(shelterConversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          petId: petId,
          senderRead: false,
          receiverRead: true,
        });
      }

      if (!userConversationSnap.exists()) {
        await setDoc(userConversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          participants: [userId, currentUser.uid],
          petId: petId,
          senderRead: false,
          receiverRead: true,
        });
      } else {
        await updateDoc(userConversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          petId: petId,
          senderRead: false,
          receiverRead: true,
        });
      }

      setNewMessage("");
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

    // Check if result.assets is not null before accessing its properties
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

      // const messagesRef = collection(db, "conversations", conversationId, "messages");
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

      await addDoc(shelterMessagesRef, {
        text: imageUrl,
        senderId: currentUser.uid,
        receiverId: userId,
        timestamp: serverTimestamp(),
      });

      await addDoc(userMessagesRef, {
        text: imageUrl,
        senderId: currentUser.uid,
        receiverId: userId,
        timestamp: serverTimestamp(),
      });

      console.log("Image message sent successfully");

      // Update the lastMessage field in the conversation document
      // const conversationRef = doc(db, "conversations", conversationId);
      const shelterConversationRef = doc(
        db,
        "shelters",
        currentUser.uid,
        "conversations",
        conversationId
      );
      const userConversationRef = doc(
        db,
        "users",
        userId,
        "conversations",
        conversationId
      );

      await updateDoc(shelterConversationRef, {
        lastMessage: "Image",
        lastTimestamp: serverTimestamp(),
        petId: petId,
        senderRead: false,
        receiverRead: true,
      });

      await updateDoc(userConversationRef, {
        lastMessage: "Image",
        lastTimestamp: serverTimestamp(),
        petId: petId,
        senderRead: false,
        receiverRead: true,
      });
    } catch (error) {
      console.error("Error sending image message: ", error);
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
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        {/* Display profile image */}
        <View>
          {!isCurrentUser && (
            <Image
              source={
                userAccountPicture
                  ? { uri: userAccountPicture }
                  : require("../../components/user.png")
              }
              style={styles.shelterProfileImage}
            />
          )}
        </View>

        {/* Display message */}
        <View>
          {isImageMessage ? (
            <Image source={{ uri: item.text }} style={styles.messageImage} />
          ) : (
            <Text style={styles.messageText}>{item.text}</Text>
          )}
          {messageTime ? (
            <Text style={styles.messageTime}>{messageTime}</Text>
          ) : null}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          {/* Display shelter account picture in header */}
          <Image
            source={
              userAccountPicture
                ? { uri: userAccountPicture }
                : require("../../components/user.png")
            }
            style={styles.shelterAccountPictureHeader}
          />
        </View>
        <Text style={styles.headerTitle}>{senderName}</Text>
      </View>

      {/* Pet Name Header */}
      <View style={styles.petHeader}>
        <Text style={styles.petHeaderText}>Pet Name: {petName}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages} // Pass the reversed array directly
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        inverted // Reverse the layout
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
          multiline={true} // Allow multiple lines
        />
        <TouchableOpacity style={styles.imageIcon} onPress={pickImage}>
          <Ionicons name="image" size={30} color="skyblue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessagePageShelter;
