import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SettingsScreen from "./SettingsPage";
import AboutScreen from "./Setting Options/AboutPage";
import ChangePassScreen from "./Setting Options/Change Password/ChangePassPage";
import TOSScreen from "./Setting Options/TOS";
import PrivacyScreen from "./Setting Options/PrivacyPage";
import DeleteAccScreen from "./Setting Options/DeleteAccPage";
import AccountScreen from "./Setting Options/Account Page/AccountPage";

const Stack = createStackNavigator();

export const SettingOptions = () => {
  return (
    <Stack.Navigator initialRouteName="Settings">
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Change Password" component={ChangePassScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Terms of Service" component={TOSScreen} />
      <Stack.Screen name="Privacy Policy" component={PrivacyScreen} />
      <Stack.Screen name="Request Account Deletion" component={DeleteAccScreen} />
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
