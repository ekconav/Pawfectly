import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView, StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth, db } from "./src/FirebaseConfig";
import UserStack from "./src/UserStack";
import ShelterStack from "./src/ShelterStack";
import LandingPage from "./src/LandingPage/LandingPage";
import LoginPage from "./src/Loginpage/LoginPage";
import SignupPage from "./src/SignupPage/signuppage";
import SignupShelter from "./src/SignupShelter/SignupShelter";
import ChoosePage from "./src/ChoosePage/ChoosePage";
import OTPPage from "./src/OTP/OTPPage";
import Spinner from "react-native-loading-spinner-overlay";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import COLORS from "./src/const/colors";
import * as NavigationBar from "expo-navigation-bar";
import { doc, onSnapshot } from "firebase/firestore";

const Stack = createStackNavigator();

const App = () => {
  const [userType, setUserType] = useState("");
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const shelterDocRef = doc(db, "shelters", user.uid);

        const unsubscribeUserDoc = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            setUserType("user");
          } else {
            setUserType((prev) => (prev === "shelter" ? "shelter" : ""));
          }
        });

        const unsubscribeShelterDoc = onSnapshot(shelterDocRef, (shelterDoc) => {
          if (shelterDoc.exists()) {
            setUserType("shelter");
          } else {
            setUserType((prev) => (prev === "user" ? "user" : ""));
          }
        });

        return () => {
          unsubscribeUserDoc();
          unsubscribeShelterDoc();
        };
      } else {
        setUserType("");
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync(COLORS.white);
    NavigationBar.setButtonStyleAsync("dark");
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <Spinner visible={!fontsLoaded} color={COLORS.prim} />
      {fontsLoaded && (
        <NavigationContainer>
          <Stack.Navigator headerShown={false}>
            <Stack.Screen
              name="LandingPage"
              component={LandingPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ChoosePage"
              component={ChoosePage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignupPage"
              component={SignupPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignupShelter"
              component={SignupShelter}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="OTP"
              component={OTPPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="LoginPage"
              component={LoginPage}
              options={{ headerShown: false }}
            />

            {userType === "user" ? (
              <Stack.Screen
                name="UserStack"
                component={UserStack}
                options={{ headerShown: false }}
              />
            ) : userType === "shelter" ? (
              <Stack.Screen
                name="ShelterStack"
                component={ShelterStack}
                options={{ headerShown: false }}
              />
            ) : null}
          </Stack.Navigator>
        </NavigationContainer>
      )}
    </SafeAreaView>
  );
};

export default App;
