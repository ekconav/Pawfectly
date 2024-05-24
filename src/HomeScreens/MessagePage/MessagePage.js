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
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const MessagePage = ({ route }) => {
  const { conversationId, shelterId, petId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [shelterName, setShelterName] = useState("");
  const [petName, setPetName] = useState("");
  const [loading, setLoading] = useState(true); // Initialize loading state
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const petDoc = await getDoc(doc(db, "pets", petId));
        if (petDoc.exists()) {
          setPetName(petDoc.data().name);
        } else {
          console.error("Pet document not found for petId:", petId);
        }

        const shelterDoc = await getDoc(doc(db, "shelters", shelterId));
        if (shelterDoc.exists()) {
          setShelterName(shelterDoc.data().shelterName);
        } else {
          console.error("Shelter document not found for shelterId:", shelterId);
        }

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
        setLoading(false); // Update loading state once data is fetched
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false); // Update loading state in case of error
      }
    };

    fetchData();
  }, [conversationId, petId, shelterId]);

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
        receiverId: shelterId,
        timestamp: serverTimestamp(),
      });

      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        // Create the conversation document if it doesn't exist
        await setDoc(conversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          participants: [currentUser.uid, shelterId],
          petId: petId,
          senderRead: true,
          receiverRead: false,
        });
      } else {
        // Update the conversation document with the new lastMessage and lastTimestamp
        await updateDoc(conversationRef, {
          lastMessage: newMessage,
          lastTimestamp: serverTimestamp(),
          senderRead: true,
          receiverRead: false,
        });
      }

      // Fetch the shelter name after sending the message
      const shelterDoc = await getDoc(doc(db, "shelters", shelterId));
      if (shelterDoc.exists()) {
        setShelterName(shelterDoc.data().shelterName);
      } else {
        console.error("Shelter document not found for shelterId:", shelterId);
      }

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
        <Text style={styles.headerTitle}>{shelterName}</Text>
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

export default MessagePage;
