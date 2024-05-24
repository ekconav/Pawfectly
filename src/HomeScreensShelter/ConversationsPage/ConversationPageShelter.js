import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db, auth } from "../../FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const ConversationPageShelter = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [userNames, setUserNames] = useState({});
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
          for (const conversation of filteredConversations) {
            const userId = conversation.participants[0]; // Assuming the userId is the first participant
            names[conversation.id] = await getUserName(userId);
          }

          setUserNames(names);
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

  const navigateToMessages = async (conversationId, petId) => {
    try {
      const conversationRef = doc(db, "conversations", conversationId);
      // Update receiverRead to true
      await updateDoc(conversationRef, {
        receiverRead: true,
      });
    } catch (error) {
      console.error("Error updating receiverRead:", error);
    }

    navigation.navigate("MessagePageShelter", { conversationId, petId });
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
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.conversationItem,
              // Check if receiverRead is false, and apply highlight if true
              !item.receiverRead && styles.unreadConversation,
            ]}
            onPress={() => navigateToMessages(item.id, item.petId)}
          >
            <Text style={styles.userName}>
              From: {userNames[item.id]}
            </Text>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  conversationItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noConversationsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  unreadConversation: {
    backgroundColor: "#ccd0f0", // Highlight color for unread conversations
  },
});

export default ConversationPageShelter;
