import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    title: {
      fontSize: 24,
      marginBottom: 16,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 16,
      paddingLeft: 8,
      width: '100%',
    },
    button: {
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 8,
      width: '20%',
      alignItems: 'center',
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      
    },
    text: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    
    
  });
  
  export default LoginPage;