import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { db } from "../../FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

const ConversationPage = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [shelterNames, setShelterNames] = useState({});
  const [loading, setLoading] = useState(true);

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
          for (const conversation of conversationsData) {
            const shelterId = conversation.participants[1]; // Assuming the shelterId is the second participant
            names[conversation.id] = await getShelterName(shelterId);
          }

          setShelterNames(names);
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

  const navigateToMessages = async (conversationId, petId, shelterId) => {
    try {
      const conversationRef = doc(db, "conversations", conversationId);
      // Update senderRead to true
      await updateDoc(conversationRef, {
        senderRead: true,
      });
    } catch (error) {
      console.error("Error updating senderRead:", error);
    }

    navigation.navigate("MessagePage", { conversationId, petId, shelterId });
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
              // Check if senderRead is false, and apply highlight if true
              !item.senderRead && styles.unreadConversation,
            ]}
            onPress={() => navigateToMessages(item.id, item.petId, item.participants[1])}
          >
            <Text style={styles.shelterName}>
              Conversation with {shelterNames[item.id]}
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
  shelterName: {
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

export default ConversationPage;
