import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  conversationItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 15,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noConversationsContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
  },
  unreadConversation: {
    backgroundColor: "#ccd0f0", // Highlight color for unread conversations
  },
});

export default styles;
