import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styles from "../ChoosePage/styles";

const ChoosePage = ({ navigation }) => {
  const handleAdopterLogin = () => {
    navigation.navigate("SignupPage");
  };

  const handleShelterLogin = () => {
    navigation.navigate("SignupShelter");
  };

  return (
    <View style={styles.choosePageContainer}>
      <Text style={styles.choosePageTitle}>PAWFECTLY{"\n"}ADOPTABLE</Text>
      <View style={styles.choosePageButtonContainer}>
        <View style={styles.choosePageButtonWrapper}>
          <Image
            source={require("../components/chooseUser.png")}
            style={styles.choosePageImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.choosePageButton}
            onPress={handleAdopterLogin}
          >
            <Text style={styles.buttonText}>User Registration</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.choosePageButtonWrapper}>
          <Image
            source={require("../components/chooseShelter.png")}
            style={styles.choosePageImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.choosePageButton}
            onPress={handleShelterLogin}
          >
            <Text style={styles.buttonTextShelter}>Shelter Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.choosePageText}>
        Unleash Happiness with Every Paw Print
      </Text>
    </View>
  );
};

export default ChoosePage;
