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
    fontSize: 28, // Increase font size
    marginBottom: 24, // Increase margin bottom
    fontWeight: 'bold', // Make text bold
    color: COLORS.primary, // Change text color
    textAlign: 'center', // Center align text
  },
  input: {
    height: 48, // Increase input height
    borderWidth: 2, // Increase border width
    borderRadius: 10, // Increase border radius
    marginBottom: 24, // Increase margin bottom
    paddingHorizontal: 16, // Increase horizontal padding
    width: '100%',
    borderColor: COLORS.secondary, // Change border color
    color: COLORS.text, // Change text color
  },
  inputLabel: {
    fontSize: 18, // Increase font size
    textAlign: 'left', 
    alignSelf: 'flex-start', 
    marginBottom: 12, // Increase margin bottom
    color: COLORS.primary, // Change text color
  },
  button: {
    backgroundColor: 'blue', // Change to your desired button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    paddingBottom: 10, // Adjust as needed
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  text: {
    color: COLORS.primary, // Change text color
    textDecorationLine: 'underline',
    fontSize: 16, // Increase font size
    textAlign: 'center',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginRight: 4, 
  },
  text: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 15,
    marginLeft: 4,
  },
  image: {
    height: 300,
    width: 280,
    marginBottom: 24, // Increase margin bottom
  }
});

export default style;
