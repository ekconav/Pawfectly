import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { db, auth } from "../../FirebaseConfig";
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
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const MessagePageShelter = ({ route }) => {
  const { conversationId, petId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const messagesRef = collection(
          db,
          "conversations",
          conversationId,
          "messages"
        );
        const q = query(messagesRef, orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
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
          doc(db, "conversations", conversationId)
        );
        if (conversationDoc.exists()) {
          const senderId = conversationDoc
            .data()
            .participants.find(
              (participant) => participant !== currentUser.uid
            );
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

    fetchMessages();
    fetchConversation();
    fetchPetName();
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
      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages"
      );
      await addDoc(messagesRef, {
        text: newMessage,
        senderId: currentUser.uid,
        receiverId: senderName, // Use senderId or receiverId if available
        timestamp: serverTimestamp(),
      });

      const conversationRef = doc(db, "conversations", conversationId);
      await updateDoc(conversationRef, {
        lastMessage: newMessage,
        lastTimestamp: serverTimestamp(),
        petId: petId,
        senderRead: false,
        receiverRead: true,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
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
    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
        {messageTime ? (
          <Text style={styles.messageTime}>{messageTime}</Text>
        ) : null}
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
        <Text style={styles.headerTitle}>{senderName}</Text>
      </View>

      {/* Pet Name Header */}
      <View style={styles.petHeader}>
        <Text style={styles.petHeaderText}>Pet Name: {petName}</Text>
      </View>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessagePageShelter;
