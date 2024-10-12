import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../../FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../../../const/colors";
import styles from "./styles";

const TOSPage = () => {
  const navigation = useNavigation();
  const [tosItems, setTosItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTOS = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "TOS"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const tosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTosItems(tosData);
      } catch (error) {
        console.error("Error fetching TOS:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTOS();
  }, []);

  const renderItem = ({ item }) => (
    <View key={item.id} style={styles.tosRenderContainer}>
      <Text style={styles.tosTitle}>
        {item.order}. {item.title}
      </Text>
      <Text style={styles.tosDescription}>{item.description}</Text>
    </View>
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.prim} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>
      <FlatList
        data={tosItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.tosContainer}
        ListFooterComponent={
          <View style={styles.tosRenderContainer}>
            <Text style={styles.tosDescription}>
              <Text style={styles.email}>pawfectly_adoptable@gmail.com</Text>
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default TOSPage;
