import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "./SettingsPage";
import AboutScreen from "./Setting Options/About Page/AboutPage";
import ChangePassScreen from "./Setting Options/Change Password/ChangePassPage";
import TOSScreen from "./Setting Options/TOS Page/TOS";
import PrivacyScreen from "./Setting Options/PrivacyPolicyPage/PrivacyPage";
import DeleteAccScreen from "./Setting Options/Delete Account Page/DeleteAccPage";
import AccountScreen from "./Setting Options/Account Page/AccountPage";

const Stack = createStackNavigator();

export const SettingOptions = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Change Password" component={ChangePassScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Terms of Service" component={TOSScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Privacy Policy" component={PrivacyScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Request Account Deletion" component={DeleteAccScreen} options={{ headerShown: false }} />
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
