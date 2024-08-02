import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { db } from "../../FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  limit,
  deleteDoc,
} from "firebase/firestore";
import Modal from "react-native-modal";
import styles from "./styles";

const ConversationPage = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [shelterNames, setShelterNames] = useState({});
  const [shelterImage, setShelterImage] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const conversationsRef = collection(db, "conversations");
        const q = query(conversationsRef, orderBy("lastTimestamp", "desc"));
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const conversationsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          const names = {};
          const accountPic = {};
          const messages = {};
          for (const conversation of conversationsData) {
            const shelterId = conversation.participants[1]; // Assuming the shelterId is the second participant
            names[conversation.id] = await getShelterName(shelterId);
            accountPic[conversation.id] = await getShelterImage(shelterId);
            messages[conversation.id] = await getLastMessage(conversation.id);
          }

          setShelterNames(names);
          setShelterImage(accountPic);
          setLastMessages(messages);
          setConversations(conversationsData);
          setLoading(false);
        });
        return unsubscribe;
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const getShelterName = async (receiverId) => {
    try {
      const shelterDoc = await getDoc(doc(db, "shelters", receiverId));
      if (shelterDoc.exists()) {
        return shelterDoc.data().shelterName;
      } else {
        console.error("Shelter document not found for receiverId:", receiverId);
        return "Unknown Shelter";
      }
    } catch (error) {
      console.error("Error fetching shelter name:", error);
      return "Unknown Shelter";
    }
  };

  const getShelterImage = async (receiverId) => {
    try {
      const shelterDoc = await getDoc(doc(db, "shelters", receiverId));
      if (shelterDoc.exists()) {
        return shelterDoc.data().accountPicture;
      } else {
        console.error(
          "Shelter document not found for receiverId: ",
          receiverId
        );
        return "Unknown Shelter";
      }
    } catch (error) {
      console.error("Error fetching shelter account picture: ", error);
      return "Unknown Shelter";
    }
  };

  const getLastMessage = async (conversationId) => {
    try {
      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
        "messages"
      );
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
      const snapshot = await new Promise((resolve, reject) => {
        const unsubscribe = onSnapshot(
          q,
          (snapshot) => {
            resolve(snapshot);
            unsubscribe();
          },
          (error) => {
            reject(error);
            unsubscribe();
          }
        );
      });

      if (!snapshot.empty) {
        return snapshot.docs[0].data();
      } else {
        console.error("No messages found for conversationId:", conversationId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching last message:", error);
      return null;
    }
  };

  const navigateToMessages = async (conversationId, petId, shelterId) => {
    try {
      const conversationRef = doc(db, "conversations", conversationId);
      await updateDoc(conversationRef, {
        senderRead: true,
      });
    } catch (error) {
      console.error("Error updating senderRead:", error);
    }

    navigation.navigate("MessagePage", { conversationId, petId, shelterId });
  };

  const handleLongPress = (conversationId) => {
    setSelectedConversationId(conversationId);
    setIsModalVisible(true);
  };

  const handleDeleteConversation = async () => {
    if (selectedConversationId) {
      try {
        const messagesRef = collection(
          db,
          "conversations",
          selectedConversationId,
          "messages"
        );

        const deleteMessages = (snapshot) => {
          const deletePromises = snapshot.docs.map((msgDoc) =>
            deleteDoc(doc(messagesRef, msgDoc.id))
          );
          return Promise.all(deletePromises);
        };

        const unsubscribe = onSnapshot(
          messagesRef,
          async (snapshot) => {
            await deleteMessages(snapshot);
            await deleteDoc(doc(db, "conversations", selectedConversationId));
            setIsModalVisible(false);
            unsubscribe();
          },
          (error) => {
            console.error("Error fetching messages:", error);
          }
        );
      } catch (error) {
        console.error("Error deleting conversation:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (conversations.length === 0) {
    return (
      <View style={styles.noConversationsContainer}>
        <Text>No conversations</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          let lastMessageText = item.lastMessage;
          if (item.lastMessage === "Image") {
            lastMessageText =
              item.participants[0] === lastMessages[item.id]?.senderId
                ? "You sent a photo"
                : `${shelterNames[item.id]} sent a photo`;
          }

          return (
            <TouchableOpacity
              style={[
                styles.conversationItem,
                !item.senderRead && styles.unreadConversation,
              ]}
              onPress={() =>
                navigateToMessages(item.id, item.petId, item.participants[1])
              }
              onLongPress={() => handleLongPress(item.id)}
            >
              <View style={styles.shelterInfoContainer}>
                <Image
                  source={
                    shelterImage[item.id]
                      ? { uri: shelterImage[item.id] }
                      : require("../../components/user.png")
                  }
                  style={styles.shelterImage}
                />
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.shelterName,
                      !item.senderRead && styles.unreadConversation,
                    ]}
                  >
                    {shelterNames[item.id]}
                  </Text>
                  <Text
                    style={[
                      styles.lastMessage,
                      !item.senderRead && styles.unreadConversation,
                    ]}
                  >
                    {lastMessageText}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text>Delete this conversation?</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteButton]}
              onPress={handleDeleteConversation}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ConversationPage;
