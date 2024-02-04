// App.js

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginPage from './src/Loginpage/LoginPage';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LoginPage/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
