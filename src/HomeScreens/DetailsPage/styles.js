import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";


const styles = StyleSheet.create({
    petImage: {
      height: 300,
      width: '100%',
      resizeMode: 'cover',
    },
    detailsContainer: {
      backgroundColor: COLORS.white,
      padding: 20,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      marginTop: -30,
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    petName: {
      fontSize: 24,
      color: COLORS.dark,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    petDescription: {
      fontSize: 16,
      color: COLORS.dark,
      marginBottom: 10,
    },
    petBreed: {
      fontSize: 16,
      color: COLORS.dark,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    petDetail: {
      fontSize: 16,
      color: COLORS.dark,
      marginBottom: 5,
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
    },
    locationText: {
      fontSize: 16,
      color: COLORS.grey,
      marginLeft: 5,
    },
    button: {
      backgroundColor: COLORS.secondary,
      borderRadius: 5,
      paddingVertical: 10,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: COLORS.white,
      fontWeight: 'bold',
      fontSize: 16,
    },
  });

export default styles
