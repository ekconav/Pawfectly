import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  messagesContainer: {
    flexGrow: 1,
  },
  messageContainer: {
    marginVertical: 8,
    padding: 10,
    borderRadius: 10,
    maxWidth: "75%",
    flexDirection: "row", // Added for aligning profile images
    alignItems: "flex-end", // Added for aligning profile images
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#dcf8c6",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#ffffff",
  },
  messageText: {
    fontSize: 16,
  },
  messageImage: {
    marginTop: -10,
    marginBottom: -10,
    width: 180, // Adjust the width as needed to fit within the chat bubble
    height: 180, // Adjust the height as needed to fit within the chat bubble
    borderRadius: 10, // Add border radius for rounded corners
    resizeMode: "contain", // Ensure the entire image fits within the specified dimensions
  },
  messageTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    backgroundColor: "#fff",
    position: "relative",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    paddingRight: 50,
  },
  sendButton: {
    backgroundColor: "#34b7f1",
    borderRadius: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  petHeader: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  petHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIcon: {
    position: "absolute",
    right: 80,
    top: 18,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  shelterAccountPictureHeader: {
    width: 50, // Adjust width as needed
    height: 50, // Adjust height as needed
    borderRadius: 25, // Half of width and height for circular shape
    marginLeft: 10,
  },
  shelterProfileImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  userProfileImage: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 5,
  },
});

export default styles;
