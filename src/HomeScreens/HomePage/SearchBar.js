import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch }) => {
  const handleSearch = () => {
    // Call the onSearch function passed as a prop
    onSearch(searchQuery.trim());
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
  style={styles.searchInput}
  placeholder="Search Pet To Adopt"
  value={searchQuery}
  onChangeText={(text) => setSearchQuery(text)}
/>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  searchButton: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
  },
});

export default SearchBar;
