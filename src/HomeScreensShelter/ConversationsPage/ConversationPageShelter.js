import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { db, auth } from "../../FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  limit,
} from "firebase/firestore";
import styles from "./styles";

const ConversationPageShelter = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userImage, setUserImage] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const shelterId = auth.currentUser.uid;

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

          const filteredConversations = conversationsData.filter(
            (conversation) => conversation.participants[1] === shelterId
          );

          const names = {};
          const accountPic = {};
          const messages = {};
          for (const conversation of filteredConversations) {
            const userId = conversation.participants[0]; // Assuming the userId is the first participant
            names[conversation.id] = await getUserName(userId);
            accountPic[conversation.id] = await getUserImage(userId);
            messages[conversation.id] = await getLastMessage(conversation.id);
          }

          setUserNames(names);
          setUserImage(accountPic);
          setLastMessages(messages);
          setConversations(filteredConversations);
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

  const getUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().firstName;
      } else {
        console.error("User document not found for userId:", userId);
        return "Unknown User";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown User";
    }
  };

  const getUserImage = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().accountPicture;
      } else {
        console.error("User document not found for userId: ", userId);
        return "Unknown User";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
      return "Unknown User";
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

  const navigateToMessages = async (conversationId, petId, userId) => {
    try {
      const conversationRef = doc(db, "conversations", conversationId);
      // Update receiverRead to true
      await updateDoc(conversationRef, {
        receiverRead: true,
      });
    } catch (error) {
      console.error("Error updating receiverRead:", error);
    }

    navigation.navigate("MessagePageShelter", {
      conversationId,
      petId,
      userId,
    });
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
              item.participants[1] === lastMessages[item.id]?.senderId
                ? "You sent a photo"
                : `${userNames[item.id]} sent a photo`;
          }
          return (
            <TouchableOpacity
              style={[
                styles.conversationItem,
                !item.receiverRead && styles.unreadConversation,
              ]}
              onPress={() =>
                navigateToMessages(item.id, item.petId, item.participants[0])
              }
            >
              <View style={styles.userInfoContainer}>
                <Image
                  source={
                    userImage[item.id]
                      ? { uri: userImage[item.id] }
                      : require("../../components/user.png")
                  }
                  style={styles.userImage}
                />
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.userName,
                      !item.receiverRead && styles.unreadConversation,
                    ]}
                  >
                    {userNames[item.id]}
                  </Text>
                  <Text
                    style={[
                      styles.lastMessage,
                      !item.receiverRead && styles.unreadConversation,
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
    </View>
  );
};

export default ConversationPageShelter;
