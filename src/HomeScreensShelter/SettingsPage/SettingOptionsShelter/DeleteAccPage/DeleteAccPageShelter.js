import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../../../../FirebaseConfig";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import {
  deleteDoc,
  doc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import COLORS from "../../../../const/colors";
import styles from "./styles";

const DeleteAccountPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [shouldNavigateBack, setShouldNavigateBack] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const shelter = auth.currentUser;
  const navigation = useNavigation();

  const handleDeleteAccount = async () => {
    if (password) {
      setLoading(true);
      try {
        const credential = EmailAuthProvider.credential(shelter.email, password);
        await reauthenticateWithCredential(shelter, credential);

        const shelterDocRef = doc(db, "shelters", shelter.uid);
        const petsRef = collection(db, "pets");
        const conversationsRef = collection(
          db,
          "shelters",
          shelter.uid,
          "conversations"
        );
        const statisticsDocRef = doc(
          db,
          "shelters",
          shelter.uid,
          "statistics",
          shelter.uid
        );
        const adoptedByRef = collection(db, "shelters", shelter.uid, "adoptedBy");
        const notificationsRef = collection(
          db,
          "shelters",
          shelter.uid,
          "notifications"
        );

        const deleteSubcollection = async (collectionRef) => {
          const snapshot = await getDocs(collectionRef);
          for (const doc of snapshot.docs) {
            const subcollectionRef = collection(doc.ref, "messages");
            if (!subcollectionRef) continue;
            await deleteSubcollection(subcollectionRef);
            await deleteDoc(doc.ref);
          }
        };

        const conversationsSnapshot = await getDocs(conversationsRef);
        for (const conversation of conversationsSnapshot.docs) {
          const messagesRef = collection(conversation.ref, "messages");
          await deleteSubcollection(messagesRef);
          await deleteDoc(conversation.ref);
        }

        await deleteSubcollection(adoptedByRef);
        await deleteSubcollection(notificationsRef);

        await deleteDoc(statisticsDocRef);

        const q = query(petsRef, where("userId", "==", shelter.uid));
        const querySnapshot = await getDocs(q);
        for (const petDoc of querySnapshot.docs) {
          await deleteDoc(petDoc.ref);
        }

        await deleteDoc(shelterDocRef);

        setModalMessage("Your account has been deleted successfully.");
        setIsModalVisible(true);
        setShouldNavigateBack(true);

        setTimeout(async () => {
          await shelter.delete();
        }, 10000);
      } catch (error) {
        if (error.message.includes("auth/invalid-credential")) {
          setModalMessage("Password is invalid.");
        } else {
          setModalMessage("An error occurred. Please try again.");
        }
        setIsModalVisible(true);
      } finally {
        setLoading(false);
      }
    } else {
      setModalMessage("Please enter password to confirm account deletion.");
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    if (shouldNavigateBack) {
      navigation.replace("LoginPage");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.prim} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delete Account</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          Are you sure you want to delete your account?
        </Text>
        <Text style={styles.subtitle}>
          Enter password to confirm account deletion.
        </Text>
      </View>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          autoCapitalize="none"
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleDeleteAccount}>
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>Confirm</Text>
          )}
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{modalMessage}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeleteAccountPage;
