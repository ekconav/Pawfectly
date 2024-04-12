import { StyleSheet } from 'react-native';
import COLORS from '../../const/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionContainer: {
    marginVertical: 10,
    marginTop: 20,
  },
  optionText: {
    fontSize: 18,
    // color: COLORS.primary, // Use your desired color
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  profileImage: {
    width: 200,
    height: 200, // Adjust the height to match the width for a perfect circle
    borderRadius: 100, // Half of the width or height for a circle
    borderColor: 'black',
    marginTop: -10, // Adjust this value to move the image up or down
    marginBottom: 40,
  },
});

export default styles;
