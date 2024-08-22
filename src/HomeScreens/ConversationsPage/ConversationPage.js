import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { db, auth } from "../../FirebaseConfig";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  where,
  getDoc,
  doc,
  updateDoc,
  limit,
  deleteDoc,
} from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../const/colors";
import { ActivityIndicator } from "react-native-paper";

const DeleteButton = ({ onDelete }) => (
  <TouchableOpacity style={styles.slideDeleteButton} onPress={onDelete}>
    <Ionicons name="trash-outline" size={24} color={COLORS.white} />
  </TouchableOpacity>
);

const ConversationPage = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [shelterNames, setShelterNames] = useState({});
  const [shelterImage, setShelterImage] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const swipeableRefs = useRef({});

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const conversationsRef = collection(db, "conversations");
        const q = query(
          conversationsRef,
          where("participants", "array-contains", currentUser.uid),
          orderBy("lastTimestamp", "desc")
        );
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

  const handleDeleteConversation = async (conversationId) => {
    try {
      const messagesRef = collection(
        db,
        "conversations",
        conversationId,
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
          await deleteDoc(doc(db, "conversations", conversationId));
          unsubscribe();
        },
        (error) => {
          console.error("Error fetching messages:", error);
        }
      );
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleSwipeableOpen = (key) => {
    // Close any previously open Swipeable component
    Object.keys(swipeableRefs.current).forEach((refKey) => {
      if (refKey !== key && swipeableRefs.current[refKey]) {
        swipeableRefs.current[refKey].close();
      }
    });
  };

  const closeAllSwipeables = () => {
    Object.keys(swipeableRefs.current).forEach((refKey) => {
      if (swipeableRefs.current[refKey]) {
        swipeableRefs.current[refKey].close();
      }
    });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setProfileImage(
            userData.accountPicture
              ? { uri: userData.accountPicture }
              : require("../../components/user.png")
          );
        }
      }
    );
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      closeAllSwipeables();
    }, [])
  );

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
        <Text style={styles.accountName}>Chats</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Set")}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.noConversationsContainer}>
          <Text style={styles.noConversationsText}>
            You have no conversations.
          </Text>
        </View>
      ) : (
        <View>
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
                <Swipeable
                  ref={(ref) => {
                    if (ref) {
                      swipeableRefs.current[item.id] = ref;
                    } else {
                      delete swipeableRefs.current[item.id];
                    }
                  }}
                  renderRightActions={() => (
                    <DeleteButton
                      onDelete={() => handleDeleteConversation(item.id)}
                    />
                  )}
                  onSwipeableOpen={() => handleSwipeableOpen(item.id)}
                >
                  <TouchableOpacity
                    style={[
                      styles.conversationItem,
                      !item.senderRead && styles.unreadConversation,
                    ]}
                    onPress={() =>
                      navigateToMessages(
                        item.id,
                        item.petId,
                        item.participants[1]
                      )
                    }
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
                </Swipeable>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default ConversationPage;
