import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "./SettingsPageShelter";
import AboutScreen from "./SettingOptionsShelter/AboutShelterPage";
import AccountScreen from "./SettingOptionsShelter/AccountShelterPage";
import ChangePassScreen from "./SettingOptionsShelter/ChangePassPageShelter";
import TOSPage from "./SettingOptionsShelter/TOSPageShelter";
import PrivacyPolicyScreen from "./SettingOptionsShelter/PrivacyPolicyPageShelter";
import DeleteAccScreen from "./SettingOptionsShelter/DeleteAccPageShelter";
import EditAccountScreen from "./SettingOptionsShelter/EditAccountPageShelter"

const Stack = createStackNavigator();

export const SettingOptionsShelter = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Change Password" component={ChangePassScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Terms of Service" component={TOSPage} />
      <Stack.Screen name="Privacy Policy" component={PrivacyPolicyScreen} />
      <Stack.Screen name="Request Account Deletion" component={DeleteAccScreen} />
      <Stack.Screen name="Edit Account" component={EditAccountScreen} />
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