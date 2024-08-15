import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FavoritesPage from "../Favorites/FavoritesPage";
import { SettingOptions } from "../SettingsPage/SettingStack";
import { Ionicons } from "@expo/vector-icons";
import SearchBar from "./SearchBar";
import ConversationPage from "../ConversationsPage/ConversationPage";
import COLORS from "../../const/colors";

const Tab = createBottomTabNavigator();

const HomeScreen = ({ refresh }) => {
  const [pets, setPets] = useState([]);
  const [allPets, setAllPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    fetchPets();
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          if (userData.accountPicture) {
            setProfileImage({ uri: userData.accountPicture });
          } else {
            setProfileImage(require("../../components/user.png"));
          }
        }
      }
    );
    return () => unsubscribe();
  }, [refresh]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery]);

  const fetchPets = async () => {
    try {
      const petsCollectionRef = collection(db, "pets");
      const querySnapshot = await getDocs(petsCollectionRef);
      const petsData = [];

      await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const petData = doc.data();
          const imageUrl = await getDownloadURL(ref(storage, petData.images));
          petsData.push({ id: doc.id, ...petData, imageUrl });
        })
      );
      setPets(petsData);
      setAllPets(petsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pet data: ", error);
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      // Reset to all pets if search query is empty
      setPets(allPets);
      return;
    }

    const lowerCaseSearchQuery = searchQuery.toLowerCase();

    const filteredPets = allPets.filter((pet) => {
      const { name, type, gender, age, breed, description } = pet;

      const matchesGender = gender.toLowerCase() === lowerCaseSearchQuery;
      const matchesOtherFields =
        name.toLowerCase().includes(lowerCaseSearchQuery) ||
        type.toLowerCase().includes(lowerCaseSearchQuery) ||
        age.toLowerCase().includes(lowerCaseSearchQuery) ||
        breed.toLowerCase().includes(lowerCaseSearchQuery) ||
        description.toLowerCase().includes(lowerCaseSearchQuery);

      return matchesGender || matchesOtherFields;
    });

    setPets(filteredPets);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPets();
    setRefreshing(false);
  }, []);

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
        {/* Profile Image */}
        <TouchableOpacity onPress={() => navigation.navigate("Set")}>
          <Image
            source={profileImage} // Change the source to your profile image
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
      {/* Title */}
      <Text style={styles.title}>Find Awesome Pets</Text>

      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearch={handleSearch} // Pass the handleSearch function
      />

      {pets.length === 0 ? (
        <Text style={styles.noResultsText}>No such result found.</Text>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("DetailsPage", { pet: item })}
            >
              <View style={styles.petContainer}>
                <Image
                  source={{
                    uri: `${item.imageUrl}?time=${new Date().getTime()}`,
                  }}
                  style={styles.petImage}
                />
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petDetails}>{`Type: ${item.type}`}</Text>
                <Text
                  style={styles.petDetails}
                >{`Gender: ${item.gender}`}</Text>
                <Text style={styles.petDetails}>{`Age: ${item.age}`}</Text>
                <Text style={styles.petDetails}>{`Breed: ${item.breed}`}</Text>
                <Text
                  style={styles.petDetails}
                >{`Description: ${item.description}`}</Text>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 5,
    paddingEnd: 10,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 46,
    fontWeight: "400",
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    paddingBottom: 20,
  },

  petContainer: {
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
  },
  petName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  petDetails: {
    fontSize: 14,
    marginBottom: 3,
  },
  petImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  noResultsText: {
    color: "black",
  },
});

const App = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: "Home",
        }}
      >
        {() => <HomeScreen refresh={refresh} />}
      </Tab.Screen>
      <Tab.Screen
        name="Favorites"
        component={FavoritesPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: "Favorites",
        }}
      />
      <Tab.Screen
        name="Message"
        component={ConversationPage}
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
        component={SettingOptions}
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
};

export default App;
