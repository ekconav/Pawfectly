import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const style = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
      backgroundColor: COLORS.background,
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
    inputLabel: {
      textAlign: 'left', 
      alignSelf: 'flex-start', 
      marginBottom: 8, 
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
      fontSize: 15,
      textAlign: 'center',
      marginRight: 4, 
    },
    subtitle: {
      fontSize: 18,
      textAlign: 'center',
      marginRight: 4, 
    },
    image: {
      height: 300,
      width: 280,
    }
    
    
  });
  
  export default style;