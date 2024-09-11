import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
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
  getDocs,
} from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./styles";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../const/colors";

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
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const conversationsRef = collection(
          db,
          "users",
          currentUser.uid,
          "conversations"
        );
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

          const fetchShelterData = conversationsData.map(async (conversation) => {
            const shelterId = conversation.participants[1];
            const [shelterName, shelterImage, lastMessage] = await Promise.all([
              getShelterName(shelterId),
              getShelterImage(shelterId),
              getLastMessage(conversation.id),
            ]);
            return {
              shelterName,
              shelterImage,
              lastMessage,
              conversationId: conversation.id,
            };
          });

          const fetchedShelterData = await Promise.all(fetchShelterData);

          const names = {};
          const accountPic = {};
          const messages = {};
          fetchedShelterData.forEach((data) => {
            names[data.conversationId] = data.shelterName;
            accountPic[data.conversationId] = data.shelterImage;
            messages[data.conversationId] = data.lastMessage;
          });

          setShelterNames(names);
          setShelterImage(accountPic);
          setLastMessages(messages);
          setConversations(conversationsData);
          setLoading(false);
        });
        return () => unsubscribe();
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
        return "Pawfectly User";
      }
    } catch (error) {
      console.error("Error fetching shelter name:", error);
    }
  };

  const getShelterImage = async (receiverId) => {
    try {
      const shelterDoc = await getDoc(doc(db, "shelters", receiverId));
      if (shelterDoc.exists()) {
        return shelterDoc.data().accountPicture;
      }
    } catch (error) {
      console.error("Error fetching shelter account picture: ", error);
    }
  };

  const getLastMessage = async (conversationId) => {
    const currentUser = auth.currentUser;
    try {
      const messagesRef = collection(
        db,
        "users",
        currentUser.uid,
        "conversations",
        conversationId,
        "messages"
      );
      const q = query(messagesRef, orderBy("timestamp", "desc"), limit(1));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        return snapshot.docs[0].data();
      }
    } catch (error) {
      console.error("Error fetching last message:", error);
    }
  };

  const navigateToMessages = async (conversationId, petId, shelterId) => {
    const currentUser = auth.currentUser;
    try {
      const conversationRef = doc(
        db,
        "users",
        currentUser.uid,
        "conversations",
        conversationId
      );
      await updateDoc(conversationRef, {
        senderRead: true,
      });
    } catch (error) {
      console.error("Error updating senderRead:", error);
    }

    navigation.navigate("MessagePage", { conversationId, petId, shelterId });
  };

  const handleDeleteConversation = async (conversationId) => {
    const currentUser = auth.currentUser;
    try {
      const messagesRef = collection(
        db,
        "users",
        currentUser.uid,
        "conversations",
        conversationId,
        "messages"
      );

      const messagesSnapshot = await getDocs(messagesRef);
      const deletePromises = messagesSnapshot.docs.map((msgDoc) =>
        deleteDoc(doc(messagesRef, msgDoc.id))
      );

      await Promise.all(deletePromises);

      await deleteDoc(
        doc(db, "users", currentUser.uid, "conversations", conversationId)
      );
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const truncateMessage = (message, length) => {
    if (message.length > length) {
      return message.slice(0, length) + "...";
    }
    return message;
  };

  const handleSwipeableOpen = (key) => {
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
    const unsubscribe = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setProfileImage(
          userData.accountPicture
            ? { uri: userData.accountPicture }
            : require("../../components/user.png")
        );
      }
    });
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
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Set")}>
          <Image source={profileImage} style={styles.profileImage} />
        </TouchableOpacity>
      </View>
      {conversations.length === 0 ? (
        <View style={styles.noConversationsContainer}>
          <Text style={styles.noConversationsText}>You have no conversations.</Text>
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
              } else {
                lastMessageText = truncateMessage(item.lastMessage, 28);
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
                      navigateToMessages(item.id, item.petId, item.participants[1])
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
                          numberOfLines={1}
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
