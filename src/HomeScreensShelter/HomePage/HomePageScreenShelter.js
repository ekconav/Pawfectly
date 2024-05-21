import React, { useState, useEffect } from "react";
import {
  Dimensions,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // or import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from "../../const/colors";
import MessagePageShelter from "../MessagePage/MessagePageShelter";
import { SettingOptionsShelter } from "../SettingsPage/SettingStackShelter";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Addpet from "../AddPet/AddPet";
import { collection, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../FirebaseConfig";
import { RefreshControl } from "react-native";

const { height } = Dimensions.get("window");

const Tab = createBottomTabNavigator();

const HomeScreenPet = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPets = () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      // User not logged in, do nothing
      return;
    }

    const petsCollection = collection(db, "pets");
    const unsubscribe = onSnapshot(
      petsCollection,
      (snapshot) => {
        const petsData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((pet) => pet.userId === currentUser.uid);
        setPets(petsData);
      },
      (error) => {
        console.error("Error fetching pets: ", error);
      }
    );

    // Return the unsubscribe function
    return unsubscribe;
  };

  useEffect(() => {
    // fetchPets now returns the unsubscribe function
    const unsubscribe = fetchPets();

    // Cleanup function
    return () => {
      // Call the unsubscribe function to remove the listener
      unsubscribe();
    };
  }, []);

  const getAgeCategory = (rawAge) => {
    if (rawAge >= 0 && rawAge <= 3) {
      return "0 - 3 Months";
    } else if (rawAge >= 4 && rawAge <= 6) {
      return "4 - 6 Months";
    } else if (rawAge >= 7 && rawAge <= 9) {
      return "7 - 9 Months";
    } else if (rawAge >= 10 && rawAge <= 12) {
      return "10 - 12 Months";
    } else if (rawAge >= 12 && rawAge <= 36) {
      return "1 - 3 Years Old";
    } else if (rawAge >= 36 && rawAge <= 72) {
      return "4 - 6 Years Old";
    } else {
      return "7 Years Old and Above";
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPets();
    setRefreshing(false);
  };

  const handleDelete = async (petId) => {
    try {
      const updatedPets = pets.filter((pet) => pet.id !== petId);
      setPets(updatedPets);
    } catch (error) {
      console.error("Error handling delete:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={styles.mainContainer}>
        <Text style={{ textAlign: "center", fontSize: 20 }}>LIST OF PETS</Text>
        <View style={{ marginTop: 20 }}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={pets}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PetDetails", { pet: item, handleDelete })
                }
              >
                <View style={styles.petContainer}>
                  <Image
                    source={{ uri: item.images }}
                    style={styles.petImage}
                  />
                  <Text style={styles.petName}>Name: {item.name}</Text>
                  <Text style={styles.petType}>Type: {item.type}</Text>
                  <Text style={styles.petAge}>
                    Age: {getAgeCategory(item.age)}
                  </Text>
                  <View style={styles.genderContainer}>
                    <Icon
                      name={
                        item.gender === "Male" ? "gender-male" : "gender-female"
                      }
                      size={22}
                      color={COLORS.grey}
                      style={styles.genderIcon}
                    />
                    <Text style={styles.genderText}>{item.gender}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: height,
  },
  petContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.grey,
    borderRadius: 20,
    padding: 10,
  },
  petImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 20,
    marginBottom: 10,
  },
  petName: {
    fontWeight: "bold",
    color: COLORS.dark,
    fontSize: 20,
  },
  genderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  genderIcon: {
    marginRight: 5,
  },
  genderText: {
    fontSize: 12,
    color: COLORS.dark,
  },
  petType: {
    fontSize: 12,
    marginTop: 5,
    color: COLORS.dark,
  },
  petAge: {
    fontSize: 10,
    marginTop: 5,
    color: COLORS.grey,
  },
  distanceContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  distanceIcon: {
    marginRight: 5,
  },
  distanceText: {
    fontSize: 12,
    color: COLORS.grey,
  },
});

const HomePageScreenShelter = () => (
  <Tab.Navigator>
    <Tab.Screen
      name="Home"
      component={HomeScreenPet}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="paw-outline" color={color} size={size} />
        ),
        headerShown: false,
        tabBarLabel: "Home",
      }}
    />
    <Tab.Screen
      name="Add"
      component={Addpet}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="add-circle-outline" color={color} size={size} />
        ),
        headerShown: false,
        tabBarLabel: "Add Pet",
      }}
    />

    <Tab.Screen
      name="Message"
      component={MessagePageShelter}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="chatbubble-outline" color={color} size={size} />
        ),
        headerShown: false,
        tabBarLabel: "Message",
      }}
    />

    <Tab.Screen
      name="Set"
      component={SettingOptionsShelter}
      options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="settings-outline" color={color} size={size} />
        ),
        headerShown: false,
        tabBarLabel: "Settings",
      }}
    />
  </Tab.Navigator>
);

export default HomePageScreenShelter;
