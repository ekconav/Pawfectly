import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  petImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlayButton: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  arrowContainer: {
    backgroundColor: COLORS.white,
    padding: 7,
    borderRadius: 10,
  },
  petStyles: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 7,
  },
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: COLORS.title,
  },
  petPostedDate: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.title,
  },
  midInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  midInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.outline,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  midInfoDetail: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: COLORS.prim,
    flexWrap: "wrap",
    textAlign: "center",
  },
  midInfoTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: COLORS.title,
  },
  conversationWithContainer: {
    paddingVertical: 10,
  },
  conversationList: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    justifyContent: "space-between",
    borderColor: COLORS.outline,
    borderBottomWidth: 1,
    paddingVertical: 5,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  userAccountPicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  conversationTitle: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.title,
  },
  noConversation: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  userName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: COLORS.title,
  },
  callMessage: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    backgroundColor: COLORS.prim,
    padding: 8,
    borderRadius: 50,
  },
  aboutTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: COLORS.title,
  },
  aboutDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: COLORS.title,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  deleteContainer: {
    width: "48%",
  },
  deleteButton: {
    backgroundColor: COLORS.delete,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
  editContainer: {
    width: "48%",
  },
  editButton: {
    backgroundColor: COLORS.prim,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  modalText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  modalButtonContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalCancelButton: {
    backgroundColor: COLORS.outline,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalDeleteButton: {
    backgroundColor: COLORS.delete,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  cancelText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  deleteText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
});
