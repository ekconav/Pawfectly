import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  RefreshControl,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db, storage } from "../../FirebaseConfig";
import { ref, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import FavoritesPage from "../Favorites/FavoritesPage";
import MessagePage from "../MessagePage/MessagePage";
import { SettingOptions } from "../SettingsPage/SettingStack";
import COLORS from "../../const/colors";
import SearchBar from "./SearchBar"; // Import the SearchBar component

const Tab = createBottomTabNavigator();

const HomeScreen = ({ refresh }) => {
  const [pets, setPets] = useState([]);
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
  }, [refresh, searchQuery]);

  const fetchPets = async () => {
    try {
      const petsCollectionRef = collection(db, "pets");
      let queryRef = petsCollectionRef;

      // Apply search filter based on the search query
      if (searchQuery) {
        const searchQueryLowerCase = searchQuery.toLowerCase();
        // Construct a query to search across multiple fields
        queryRef = query(
          queryRef,
          where("age", ">=", searchQueryLowerCase),
          orderBy("breed")
        );
      }

      const querySnapshot = await getDocs(queryRef);
      const petsData = [];

      querySnapshot.forEach(async (doc) => {
        const petData = doc.data();
        const imageUrl = await getDownloadURL(ref(storage, petData.images));
        petsData.push({ id: doc.id, ...petData, imageUrl });
      });

      setPets(petsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pet data:", error);
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPets();
    setRefreshing(false);
  }, [searchQuery]);

  // Function to handle search query change
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

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
      {/* SearchBar component */}
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
        </View>
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
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingTop: Platform.OS == "android" ? 40 : 0,
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
    borderColor: COLORS.black,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    paddingBottom: 20,
  },
  petContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 20,
    padding: 10,
    marginBottom: 30,
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  petName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
    alignSelf: "center",
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
});

const App = () => {
  const [refresh, setRefresh] = useState(false);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="paw-outline" color={color} size={size} />
          ),
          headerShown: false,
          tabBarLabel: "Home",
        }}
      />
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
        component={MessagePage}
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
