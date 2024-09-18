import React from "react";
import { View, Text, Image, TouchableOpacity, SafeAreaView } from "react-native";
import styles from "./styles";

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
      <View style={styles.textContainer}>
        <Text style={styles.title}>Adopt a Furry Friend Today!</Text>
        <Text style={styles.subtitle}>Unleash Happiness with Every Paw Print</Text>
      </View>

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
