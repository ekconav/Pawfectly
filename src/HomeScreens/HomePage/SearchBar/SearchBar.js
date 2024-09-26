import React from "react";
import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./styles";
import COLORS from "../../../const/colors";

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      {!searchQuery ? (
        <Ionicons
          style={styles.searchIcon}
          name="search-outline"
          size={20}
          color={COLORS.subtitle}
        />
      ) : (
        <Ionicons
          onPress={handleClear}
          style={styles.searchIcon}
          name="close-circle"
          size={20}
          color={COLORS.subtitle}
        />
      )}
    </View>
  );
};

export default SearchBar;
