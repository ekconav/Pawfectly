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
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ddd",
    borderWidth: 1,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#ccc", 
  },
  deleteButton: {
    backgroundColor: "#f00", 
  },
  modalButtonText: {
    color: "#fff", 
    fontSize: 16,
  },
});

export default styles;
