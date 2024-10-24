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
  headerTitle: {
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
  searchBar: {
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderColor: COLORS.outline,
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
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 10,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
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
  searchMatch: {
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.black,
  },
});

export default styles;
