import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "./SettingsPageShelter";
import AboutScreen from "./SettingOptionsShelter/AboutShelterPage";
import AccountScreen from "./SettingOptionsShelter/AccountShelterPage";
import ChangePassScreen from "./SettingOptionsShelter/ChangePassPageShelter";
import TOSPage from "./SettingOptionsShelter/TOSPageShelter";
import PrivacyPolicyScreen from "./SettingOptionsShelter/PrivacyPolicyPageShelter";
import DeleteAccScreen from "./SettingOptionsShelter/DeleteAccPageShelter";
import EditAccountScreen from "./SettingOptionsShelter/EditAccountPageShelter";
import PetDetailsScreen from "../PetDetails/PetDetails";

const Stack = createStackNavigator();

export const SettingOptionsShelter = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Change Password"
        component={ChangePassScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Terms of Service"
        component={TOSPage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Privacy Policy"
        component={PrivacyPolicyScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Request Account Deletion"
        component={DeleteAccScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit Account"
        component={EditAccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Pet Details"
        component={PetDetailsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default function SettingShelterStack() {
  return (
    <NavigationContainer>
      <SettingOptionsShelter />
    </NavigationContainer>
  );
}
