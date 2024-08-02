import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
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
    justifyContent: "center",
    alignItems: "center", 
  },
  conversationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 15,
  },
  unreadConversation: {
    fontWeight: "bold",
    color: "black",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  userImage: {
    width: 45,
    height: 45,
    borderRadius: 50,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
  },
  lastMessage: {
    fontSize: 14,
    color: "#949494",
  },
});

export default styles;
