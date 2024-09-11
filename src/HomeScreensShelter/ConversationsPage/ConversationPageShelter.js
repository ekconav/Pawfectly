import React, { useState, useEffect, useCallback, useRef } from "react";
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
import COLORS from "../../const/colors";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";

const DeleteButton = ({ onDelete }) => (
  <TouchableOpacity style={styles.slideDeleteButton} onPress={onDelete}>
    <Ionicons name="trash-outline" size={24} color={COLORS.white} />
  </TouchableOpacity>
);

const ConversationPageShelter = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userImage, setUserImage] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const swipeableRefs = useRef({});

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const conversationsRef = collection(
          db,
          "shelters",
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

          const fetchUserData = conversationsData.map(async (conversation) => {
            const userId = conversation.participants[0];
            const [userName, userImage, lastMessage] = await Promise.all([
              getUserName(userId),
              getUserImage(userId),
              getLastMessage(conversation.id),
            ]);
            return {
              userName,
              userImage,
              lastMessage,
              conversationId: conversation.id,
            };
          });

          const fetchedUserData = await Promise.all(fetchUserData);

          const names = {};
          const accountPic = {};
          const messages = {};
          fetchedUserData.forEach((data) => {
            names[data.conversationId] = data.userName;
            accountPic[data.conversationId] = data.userImage;
            messages[data.conversationId] = data.lastMessage;
          });

          setUserNames(names);
          setUserImage(accountPic);
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

  const getUserName = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().firstName;
      } else {
        return "Pawfectly User";
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const getUserImage = async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        return userDoc.data().accountPicture;
      }
    } catch (error) {
      console.error("Error fetching user name:", error);
    }
  };

  const getLastMessage = async (conversationId) => {
    const currentUser = auth.currentUser;
    try {
      const messagesRef = collection(
        db,
        "shelters",
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
    return null;
  };

  const navigateToMessages = async (conversationId, petId, userId) => {
    const currentUser = auth.currentUser;
    try {
      const conversationRef = doc(
        db,
        "shelters",
        currentUser.uid,
        "conversations",
        conversationId
      );
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

  const handleDeleteConversation = async (conversationId) => {
    const currentUser = auth.currentUser;
    try {
      const messagesRef = collection(
        db,
        "shelters",
        currentUser.uid,
        "conversations",
        conversationId,
        "messages"
      );

      const messageSnapshot = await getDocs(messagesRef);
      const deletePromises = messageSnapshot.docs.map((msgDoc) =>
        deleteDoc(doc(messagesRef, msgDoc.id))
      );
      await Promise.all(deletePromises);

      await deleteDoc(
        doc(db, "shelters", currentUser.uid, "conversations", conversationId)
      );
    } catch (error) {
      console.error("Error deleting conversation: ", error);
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
    const unsubscribe = onSnapshot(
      doc(db, "shelters", auth.currentUser.uid),
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
                  item.participants[1] === lastMessages[item.id]?.senderId
                    ? "You sent a photo"
                    : `${userNames[item.id]} sent a photo`;
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

export default ConversationPageShelter;
