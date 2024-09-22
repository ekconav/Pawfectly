// UserStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import your user screens
import HomeScreen from "./HomeScreens/HomePage/HomeScreen";
import DetailsPage from "./HomeScreens/DetailsPage/DetailsPage";
import FavoritesPage from "./HomeScreens/Favorites/FavoritesPage";
import MessagePage from "./HomeScreens/MessagePage/MessagePage";
import SettingsPage from "./HomeScreens/SettingsPage/SettingsPage";
import ConversationPage from "./HomeScreens/ConversationsPage/ConversationPage";
import PostPetPage from "./HomeScreens/PostPetPage/PostPetPage";
import EditPostPetPage from "./HomeScreens/PostPetPage/EditPostPetPage/EditPostPetPage";

const Stack = createStackNavigator();

const UserStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomeScreen" headerShown={false}>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessagePage"
        component={MessagePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DetailsPage"
        component={DetailsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FavoritesPage"
        component={FavoritesPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsPage"
        component={SettingsPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConversationPage"
        component={ConversationPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostPetPage"
        component={PostPetPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPostPetPage"
        component={EditPostPetPage}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default UserStack;
