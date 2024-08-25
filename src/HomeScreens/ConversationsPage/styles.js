import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
  accountName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
    marginTop: 5,
    color: COLORS.title,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  noConversationsContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
  },
  noConversationsText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    textAlign: "center",
    color: COLORS.title,
  },
  conversationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
    paddingVertical: 15,
  },
  unreadConversation: {
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.black,
  },
  shelterInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },
  shelterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    justifyContent: "center",
  },
  shelterName: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
  },
  lastMessage: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: COLORS.subtitle,
  },
  slideDeleteButton: {
    backgroundColor: COLORS.delete,
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    borderRadius: 10,
  },
});

export default styles;
