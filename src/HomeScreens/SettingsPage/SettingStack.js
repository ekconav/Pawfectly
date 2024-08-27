import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "./SettingsPage";
import AboutScreen from "./Setting Options/AboutPage";
import ChangePassScreen from "./Setting Options/ChangePassPage";
import TOSScreen from "./Setting Options/TOS";
import PrivacyScreen from "./Setting Options/PrivacyPage";
import DeleteAccScreen from "./Setting Options/DeleteAccPage";
import AccountScreen from "./Setting Options/AccountPage";
import EditAccountScreen from "./Setting Options/EditAccountPage";

const Stack = createStackNavigator();

export const SettingOptions = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Change Password" component={ChangePassScreen} />
      <Stack.Screen name="Terms of Service" component={TOSScreen} />
      <Stack.Screen name="Privacy Policy" component={PrivacyScreen} />
      <Stack.Screen name="Request Account Deletion" component={DeleteAccScreen} />
      <Stack.Screen name="Account" component={AccountScreen} />
      <Stack.Screen name="Edit Account" component={EditAccountScreen} />
    </Stack.Navigator>
  );
};

export default function SettingStack() {
  return (
    <NavigationContainer>
      <SettingOptions />
    </NavigationContainer>
  );
}
