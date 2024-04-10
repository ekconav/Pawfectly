import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';


const SearchBar = ({ onSearch }) => {
  const [searchType, setSearchType] = useState('');

  const handleSearch = async () => {
    // Construct the search query based on the selected type
    const searchQuery = {
      type: searchType.trim().toLowerCase(),
    };
  
    // Call the onSearch function with the constructed searchQuery
    onSearch(searchQuery);
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Pet To Adopt"
        value={searchType}
        onChangeText={setSearchType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
    borderRadius: 20,
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
