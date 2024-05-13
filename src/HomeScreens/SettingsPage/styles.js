import { StyleSheet } from 'react-native';
import COLORS from '../../const/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 30,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  settingsDrawer: {
    padding: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  settingTitle: {
    marginLeft: 10,
    fontSize: 16,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
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
    backgroundColor: "#3080ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingLeft: 8,
    width: "100%",
  },
  editButton: {
    backgroundColor: "#3080ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 100,
    marginLeft: 200,
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
