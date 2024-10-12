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
import SearchBar from "../../HomeScreens/HomePage/SearchBar/SearchBar";

const DeleteButton = ({ onDelete }) => (
  <TouchableOpacity style={styles.slideDeleteButton} onPress={onDelete}>
    <Ionicons name="trash-outline" size={24} color={COLORS.white} />
  </TouchableOpacity>
);

const ConversationPageShelter = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [originalConversations, setOriginalConversations] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [userImage, setUserImage] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [originalLastMessages, setOriginalLastMessages] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const swipeableRefs = useRef({});

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
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

        const unsubscribeConversations = onSnapshot(q, async (snapshot) => {
          const conversationsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setOriginalConversations(conversationsData);
          setConversations(conversationsData);

          const userListeners = conversationsData.map((conversation) => {
            const userId = conversation.participants[0];

            return listenToUserData(userId, (userData) => {
              setUserNames((prev) => ({
                ...prev,
                [conversation.id]: userData.userName,
              }));
              setUserImage((prev) => ({
                ...prev,
                [conversation.id]: userData.accountPicture,
              }));
            });
          });

          const lastMessagesPromises = conversationsData.map((conversation) =>
            getLastMessage(conversation.id)
          );
          const lastMessagesData = await Promise.all(lastMessagesPromises);

          const messages = {};
          lastMessagesData.forEach((messageData, index) => {
            messages[conversationsData[index].id] = messageData;
          });

          setOriginalLastMessages(messages);
          setLastMessages(messages);
          setLoading(false);

          return () => {
            userListeners.forEach((unsubscribe) => unsubscribe());
          };
        });
        return () => unsubscribeConversations();
      } catch (error) {
        console.error("Error fetching conversations: ", error);
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const listenToUserData = (receiverId, onDataChange) => {
    try {
      const userRef = doc(db, "users", receiverId);

      const unsubscribe = onSnapshot(userRef, (userDoc) => {
        if (userDoc.exists()) {
          const data = userDoc.data();
          onDataChange({
            userName: `${data.firstName} ${data.lastName}` || "Pawfectly User",
            accountPicture: data.accountPicture,
          });
        } else {
          onDataChange({
            userName: "Pawfectly User",
          });
        }
      });
      return unsubscribe;
    } catch (error) {
      console.error("Error listening to user data: ", error);
      onDataChange({
        userName: "Pawfectly User",
      });
    }
  };

  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    handleSearch();
  }, [debouncedSearchQuery]);

  const escapeSpecialCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  const fetchMessagesAndSearch = async (conversationId, searchQuery) => {
    const messagesRef = collection(
      db,
      "shelters",
      auth.currentUser.uid,
      "conversations",
      conversationId,
      "messages"
    );
    const q = query(messagesRef, orderBy("timestamp", "desc"));

    try {
      const snapshot = await getDocs(q);
      const messages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      return messages.find((message) =>
        message.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } catch (error) {
      console.error("Error fetching messages:", error);
      return null;
    }
  };

  const handleSearch = useCallback(async () => {
    setConversationLoading(true);
    if (!searchQuery.trim()) {
      setConversations(originalConversations);
      setLastMessages(originalLastMessages);
      setConversationLoading(false);
      return;
    }

    const lowerCaseSearchQuery = escapeSpecialCharacters(searchQuery.toLowerCase());

    const filteredConversations = await Promise.all(
      originalConversations.map(async (conversation) => {
        const userName = userNames[conversation.id]?.toLowerCase() || "";
        const lastMessage = lastMessages[conversation.id]?.text?.toLowerCase() || "";

        if (
          userName.includes(lowerCaseSearchQuery) ||
          lastMessage.includes(lowerCaseSearchQuery)
        ) {
          return conversation;
        }

        const matchingMessage = await fetchMessagesAndSearch(
          conversation.id,
          searchQuery
        );

        if (matchingMessage) {
          setLastMessages((prev) => ({
            ...prev,
            [conversation.id]: {
              ...prev[conversation.id],
              text: matchingMessage.text,
              senderId: matchingMessage.senderId,
            },
          }));

          return conversation;
        }

        return null;
      })
    );
    setConversations(
      filteredConversations.filter((conversation) => conversation !== null)
    );
    setConversationLoading(false);
  }, [searchQuery, originalConversations, userNames, lastMessages]);

  const HighlightedText = ({ text, searchQuery }) => {
    if (!searchQuery) return <Text>{text}</Text>;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));

    return (
      <Text>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <Text key={index} style={styles.searchMatch}>
              {part}
            </Text>
          ) : (
            <Text
              style={{ fontFamily: "Poppins_400Regular", color: COLORS.title }}
              key={index}
            >
              {part}
            </Text>
          )
        )}
      </Text>
    );
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
        seen: true,
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
      <View style={styles.searchBar}>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearch={handleSearch}
        />
      </View>
      {conversations.length === 0 ? (
        <View style={styles.noConversationsContainer}>
          <Text style={styles.noConversationsText}>You have no conversations.</Text>
        </View>
      ) : (
        <View>
          {conversationLoading ? (
            <ActivityIndicator
              style={{ top: 50 }}
              size="small"
              color={COLORS.prim}
            />
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                let lastMessageText =
                  lastMessages[item.id]?.text || item.lastMessage;

                if (
                  lastMessageText === "Image" ||
                  (lastMessageText && lastMessageText.includes("http"))
                ) {
                  const senderId = lastMessages[item.id]?.senderId;
                  lastMessageText =
                    senderId === auth.currentUser.uid
                      ? "You sent a photo"
                      : `${userNames[item.id]} sent a photo.`;
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
                        !item.seen && styles.unreadConversation,
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
                          {!searchQuery ? (
                            <Text
                              style={[
                                styles.userName,
                                !item.seen && styles.unreadConversation,
                              ]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {userNames[item.id]}
                            </Text>
                          ) : (
                            <HighlightedText
                              text={userNames[item.id]}
                              searchQuery={searchQuery}
                            />
                          )}

                          {!searchQuery ? (
                            <Text
                              style={[
                                styles.lastMessage,
                                !item.seen && styles.unreadConversation,
                              ]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {lastMessageText}
                            </Text>
                          ) : (
                            <HighlightedText
                              text={lastMessageText}
                              searchQuery={searchQuery}
                            />
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </Swipeable>
                );
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default ConversationPageShelter;
