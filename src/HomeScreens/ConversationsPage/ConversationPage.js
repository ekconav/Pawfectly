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
  doc,
  updateDoc,
  limit,
  deleteDoc,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { Swipeable } from "react-native-gesture-handler";
import { useFocusEffect } from "@react-navigation/native";
import Modal from "react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../const/colors";
import SearchBar from "../HomePage/SearchBar/SearchBar";
import styles from "./styles";

const DeleteButton = ({ onDelete }) => (
  <TouchableOpacity style={styles.slideDeleteButton} onPress={onDelete}>
    <Ionicons name="trash-outline" size={24} color={COLORS.white} />
  </TouchableOpacity>
);

const ConversationPage = ({ navigation }) => {
  const [conversations, setConversations] = useState([]);
  const [originalConversations, setOriginalConversations] = useState([]);
  const [shelterNames, setShelterNames] = useState({});
  const [shelterImage, setShelterImage] = useState({});
  const [lastMessages, setLastMessages] = useState({});
  const [originalLastMessages, setOriginalLastMessages] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [conversationLoading, setConversationLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [alertModal, setAlertModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [checkVerify, setCheckVerify] = useState(false);
  const [shelters, setShelters] = useState([]);
  const [shelterModal, setShelterModal] = useState(false);
  const [shelterListLoading, setShelterListLoading] = useState(false);

  const swipeableRefs = useRef({});

  const currentUser = auth.currentUser;

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

        const unsubscribeConversations = onSnapshot(q, async (snapshot) => {
          const conversationsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setOriginalConversations(conversationsData);
          setConversations(conversationsData);

          const participantsListeners = conversationsData.map((conversation) => {
            const otherParticipantId = conversation.participants.find(
              (participant) => participant !== currentUser.uid
            );

            return listenToUserOrShelterData(otherParticipantId, (data) => {
              setShelterNames((prev) => ({
                ...prev,
                [conversation.id]: data.name,
              }));
              setShelterImage((prev) => ({
                ...prev,
                [conversation.id]: data.image,
              }));
            });
          });

          // Fetch last messages
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
            participantsListeners.forEach((unsubscribe) => unsubscribe());
          };
        });

        return () => unsubscribeConversations();
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const fetchShelters = async () => {
    setShelterListLoading(true);
    try {
      const sheltersCollectionRef = collection(db, "shelters");
      const snapshot = await getDocs(sheltersCollectionRef);

      const sheltersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setShelters(sheltersData);
      setShelterListLoading(false);
    } catch (error) {
      console.error("Error fetching shelters: ", error);
      setShelterListLoading(false);
    }
  };

  useEffect(() => {
    if (shelterModal) {
      fetchShelters();
    }
  }, [shelterModal]);

  const handleSelectShelter = (shelterId) => {
    navigation.navigate("DisplayUserPage", { userId: shelterId });
    setShelterModal(false);
  };

  const listenToUserOrShelterData = (participantId, onDataChange) => {
    try {
      const shelterRef = doc(db, "shelters", participantId);

      const unsubscribe = onSnapshot(shelterRef, async (shelterDoc) => {
        if (shelterDoc.exists()) {
          const shelterData = shelterDoc.data();
          onDataChange({
            name: shelterData.shelterName || "Pawfectly User",
            image: shelterData.accountPicture || null,
          });
        } else {
          const userRef = doc(db, "users", participantId);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            onDataChange({
              name: `${userData.firstName} ${userData.lastName}` || "Pawfectly User",
              image: userData.accountPicture || null,
            });
          } else {
            onDataChange({
              name: "Pawfectly User",
              image: null,
            });
          }
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error listening to user/shelter data:", error);
      onDataChange({
        name: "Pawfectly User",
        image: null,
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
      "users",
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
        const shelterName = shelterNames[conversation.id]?.toLowerCase() || "";
        const lastMessage = lastMessages[conversation.id]?.text?.toLowerCase() || "";

        if (
          shelterName.includes(lowerCaseSearchQuery) ||
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
  }, [searchQuery, originalConversations, shelterNames, lastMessages]);

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
        seen: true,
      });
    } catch (error) {
      console.error("Error updating senderRead:", error);
    }

    navigation.navigate("MessagePage", { conversationId, shelterId, petId });
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
        setCheckVerify(userData.verified === true);
      }
    });
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    useCallback(() => {
      closeAllSwipeables();
    }, [])
  );

  const handleClickListButton = () => {
    if (!checkVerify) {
      setModalMessage("Sorry, your account is not yet verified.");
      setAlertModal(true);
      return;
    }
    setShelterModal(true);
  };

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
        <View style={{ flex: 1 }}>
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

                if (lastMessageText && lastMessageText.includes("http")) {
                  const senderId = lastMessages[item.id]?.senderId;
                  lastMessageText =
                    senderId === currentUser.uid
                      ? "You sent a photo."
                      : `${shelterNames[item.id]} sent a photo.`;
                } else if (lastMessageText === "Image") {
                  const senderId = lastMessages[item.id]?.senderId;
                  lastMessageText =
                    senderId === currentUser.uid
                      ? "You sent a photo."
                      : `${shelterNames[item.id]} sent a photo.`;
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
                          {!searchQuery ? (
                            <Text
                              style={[
                                styles.shelterName,
                                !item.seen && styles.unreadConversation,
                              ]}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {shelterNames[item.id]}
                            </Text>
                          ) : (
                            <HighlightedText
                              text={shelterNames[item.id]}
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
      <View style={styles.listButtonContainer}>
        <TouchableOpacity style={styles.listButton} onPress={handleClickListButton}>
          <Ionicons name="reorder-three-outline" size={24} color={COLORS.title} />
          <Text style={styles.listButtonText}>List of Shelters</Text>
        </TouchableOpacity>
      </View>

      {/* Alert Modal */}
      <Modal isVisible={alertModal}>
        <View style={styles.alertModalContainer}>
          <Text style={styles.alertModalText}>{modalMessage}</Text>
          <View style={styles.alertModalButtonContainer}>
            <TouchableOpacity
              onPress={() => setAlertModal(false)}
              style={styles.alertModalButton}
            >
              <Text style={styles.alertModalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Shelter List Modal */}
      <Modal isVisible={shelterModal} onRequestClose={() => setShelterModal(false)}>
        <TouchableOpacity
          style={styles.shelterModalOverlay}
          activeOpacity={1}
          onPress={() => setShelterModal(false)}
        >
          <View style={styles.shelterModalContainer}>
            <Text style={styles.shelterListTitle}>List of Shelters</Text>
            {shelterListLoading ? (
              <View style={styles.modalLoadingContainer}>
                <ActivityIndicator size="large" color={COLORS.prim} />
              </View>
            ) : shelters.length === 0 && !shelterListLoading ? (
              <View style={styles.modalLoadingContainer}>
                <Text style={styles.shelterListEmptyText}>
                  Sorry, shelter list is empty.
                </Text>
              </View>
            ) : (
              <FlatList
                data={shelters}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalShelterItem}
                    onPress={() => handleSelectShelter(item.id)}
                  >
                    <View style={styles.modalShelterInfoContainer}>
                      <Image
                        source={
                          item.accountPicture
                            ? { uri: item.accountPicture }
                            : require("../../components/user.png")
                        }
                        style={styles.modalShelterPicture}
                      />
                      <View>
                        <Text
                          style={styles.modalShelterName}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.shelterName}
                        </Text>
                        <Text
                          style={styles.modalShelterAddress}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.address}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ConversationPage;
