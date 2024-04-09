
import React from 'react'
import styles from './styles'
import { SafeAreaView, TextInput, updateSearch,search } from 'react-native'

function SearchBar() {
  return (

    <SafeAreaView style={styles.create}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          onChangeText={updateSearch}
          value={search}
        />
      </SafeAreaView>
  )
}

export default SearchBar

