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
    flex: 1,
    justifyContent: "center",
  },
  shelterName: {
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

  listButtonContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  listButton: {
    flexDirection: "row",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.offWhite,
    paddingHorizontal: 10,
    paddingVertical: 15,
    width: 150,
    borderRadius: 10,
    elevation: 1,
  },
  listButtonText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },

  // Shelter Modal
  modalLoadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  shelterListEmptyText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  shelterModalOverlay: {
    flex: 1,
    justifyContent: "center",
  },
  shelterModalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    height: 600,
    borderRadius: 10,
  },
  shelterListTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 16,
    marginBottom: 15,
  },
  modalShelterItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
    paddingVertical: 10,
  },
  modalShelterInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  modalShelterPicture: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  modalShelterName: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  modalShelterAddress: {
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
    color: COLORS.subtitle,
  },

  // Alert Modal
  alertModalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  alertModalButtonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  alertModalText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  alertModalButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  alertModalButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
});

export default styles;
