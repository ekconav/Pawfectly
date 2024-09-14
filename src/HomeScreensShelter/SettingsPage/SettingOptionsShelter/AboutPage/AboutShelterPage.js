import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import COLORS from "../../../../const/colors";
import styles from "./styles";

const AboutPage = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={24} color={COLORS.prim} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About Pawfectly</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.aboutText}>
          Pawfectly is more than just an app; it's a compassionate initiative crafted by students
          from the University of San Carlos. Philippe Tan, Van Velasquez, Stella Salazar, and Justin
          Rey Collado, driven by their love for animals and their desire to make a difference, have
          developed Pawfectly to revolutionize the way local animal shelters connect with potential
          adopters.
        </Text>
        <Text style={styles.aboutText}>
          At Pawfectly, we understand the challenges faced by animal shelters in finding loving
          homes for their residents. That's why we've created a platform that provides a simple and
          convenient solution for showcasing animals in need of adoption. With Pawfectly, shelters
          can easily upload profiles and images of their adorable residents, giving them the
          visibility they deserve.
        </Text>
        <Text style={styles.aboutText}>
          Our mission is to bridge the gap between shelters and animal lovers, making the adoption
          process seamless and enjoyable for both parties. Whether you're looking to welcome a new
          furry friend into your family or seeking to support your local shelter, Pawfectly is here
          to help.
        </Text>
      </View>
    </View>
  );
};

export default AboutPage;
