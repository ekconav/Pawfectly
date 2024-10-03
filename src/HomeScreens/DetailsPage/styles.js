import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.white,
    padding: 7,
    borderRadius: 10,
    elevation: 1,
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
  petDetails: {
    flexGrow: 1,
  },
  petNamePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: COLORS.title,
  },
  petPriceTitle: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    fontSize: 12,
  },
  petPrice: {
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    color: COLORS.title,
  },
  addressInformation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  textAddress: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.title,
  },
  textAddressAdoptedOn: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: COLORS.title,
  },
  midInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 5,
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
    fontSize: 12,
    color: COLORS.prim,
    flexWrap: "wrap",
    textAlign: "center",
  },
  midInfoTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 10,
    color: COLORS.title,
  },
  shelterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  shelterInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  shelterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  shelterTextContainer: {
    flex: 1,
  },
  shelterName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
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
    elevation: 1,
  },
  aboutContainer: {
    marginTop: 20,
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
  deleteUserPostedButton: {
    backgroundColor: COLORS.delete,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 10,
    elevation: 1,
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
    elevation: 1,
  },
  favoriteContainer: {
    width: "25%",
  },
  adoptMeContainer: {
    width: "73%",
  },
  petAdoptedContainer: {
    width: "100%",
  },
  button: {
    backgroundColor: COLORS.prim,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    elevation: 1,
  },
  deleteButton: {
    backgroundColor: COLORS.delete,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    elevation: 1,
  },
  adoptButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    elevation: 1,
  },
  adoptButtonSent: {
    backgroundColor: "rgba(130, 115, 151, 0.5)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  textButton: {
    textAlign: "center",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
  textButtonSent: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  modalButtonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  modalText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  modalButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
  deleteModalButtonContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  deleteModalCancelButton: {
    backgroundColor: COLORS.outline,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteModalDeleteButton: {
    backgroundColor: COLORS.delete,
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  deleteCancelText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  deleteModalText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
  adoptedText: {
    color: COLORS.title,
    fontFamily: "Poppins_500Medium",
  },
  adoptedByContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  adopterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  adoptedByUserInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  userFullName: {
    flex: 1,
    flexWrap: "wrap",
    fontFamily: "Poppins_600SemiBold",
    color: COLORS.title,
  },

  conversationWithContainer: {
    flex: 1,
    paddingVertical: 10,
  },
  conversationTitle: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.title,
  },
  noConversation: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
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
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userName: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
});

export default styles;
