import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import styles from "../LandingPage/styles";

const LandingPage = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.landingPageTitle}>PAWFECTLY{"\n"}ADOPTABLE</Text>
      <View style={styles.landingPageImageContainer}>
        <Image
          style={styles.landingPageImage}
          source={require("../components/forImageContainer.jpeg")}
        />
      </View>
      <Text style={styles.landingPageSubtitle}>
        <Text style={styles.boldText}>Find Your New Friends</Text>
        {"\n"}
        Make your life more happy with us
      </Text>

      <TouchableOpacity
        style={styles.landingPageButton}
        onPress={() => navigation.navigate("LoginPage")}
      >
        <Text style={styles.landingPageButtonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LandingPage;
