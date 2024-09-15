// ShelterStack.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

// Import your shelter screens
import HomePageScreenShelter from "./HomeScreensShelter/HomePage/HomePageScreenShelter";
import MessagePageShelter from "./HomeScreensShelter/MessagePage/MessagePageShelter";
import SettingsPageShelter from "./HomeScreensShelter/SettingsPage/SettingsPageShelter";
import PetDetails from "./HomeScreensShelter/PetDetails/PetDetails";
import EditPet from "./HomeScreensShelter/EditPet/EditPet";
import AddPet from "./HomeScreensShelter/AddPet/AddPet";
import OTPPage from "./OTP/OTPPage";
import ConversationPageShelter from "./HomeScreensShelter/ConversationsPage/ConversationPageShelter";

const Stack = createStackNavigator();

const ShelterStack = () => {
  return (
    <Stack.Navigator initialRouteName="HomePageScreenShelter" headerShown={false}>
      <Stack.Screen
        name="HomePageScreenShelter"
        component={HomePageScreenShelter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessagePageShelter"
        component={MessagePageShelter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingsPageShelter"
        component={SettingsPageShelter}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddPet"
        component={AddPet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PetDetails"
        component={PetDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditPet"
        component={EditPet}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTP"
        component={OTPPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConversationsPage"
        component={ConversationPageShelter}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ShelterStack;
