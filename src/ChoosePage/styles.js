import { StyleSheet } from 'react-native';
import COLORS from '../const/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row', // Align buttons side by side
    justifyContent: 'space-around', // Evenly space buttons horizontally
    width: '100%', // Ensure the buttons take up the full width of the parent container
    marginBottom: 100, // Add margin bottom to create space between buttons and image
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
    width: '45%', // Adjust width to fit two buttons side by side with some space between them
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    height: '35%', // Adjust height as needed
    width: '150%', // Adjust width as needed

  },
});

export default styles;
