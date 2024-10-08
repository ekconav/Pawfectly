import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const styles = StyleSheet.create({
  shelterSignUpContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },
  shelterSignUpTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: "Poppins_700Bold",
    color: COLORS.title,
  },
  required: {
    color: COLORS.delete,
  },
  shelterSignUpLabel: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    marginLeft: 5,
    color: COLORS.title,
  },
  shelterSignUpInputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  shelterSignUpInput: {
    height: 35,
    paddingTop: 3.5,
    width: "100%",
    fontFamily: "Poppins_400Regular",
    borderRadius: 10,
    paddingHorizontal: 16,
    color: COLORS.black,
    backgroundColor: COLORS.input,
  },
  shelterSignUpMobileInput: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    backgroundColor: COLORS.input,
    borderRadius: 10,
  },
  shelterSignUpEmailInput: {
    flexDirection: "row",
    backgroundColor: COLORS.input,
    borderRadius: 10,
    paddingRight: 10,
    height: 35,
  },
  shelterSignUpCountryCode: {
    position: "absolute",
    left: 8,
    paddingTop: 3.5,
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    zIndex: 1,
  },
  shelterSignUpMobileNumberInput: {
    flex: 1,
    height: 35,
    paddingTop: 3.5,
    paddingLeft: 45,
    fontFamily: "Poppins_400Regular",
    color: COLORS.black,
    borderRadius: 10,
  },
  shelterSignUpButton: {
    backgroundColor: COLORS.prim,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 194,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  shelterSignUpButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "Poppins_700Bold",
  },
  shelterSignUpBackButtonText: {
    color: COLORS.title,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    marginTop: 20,
  },
  shelterSignUpLink: {
    color: COLORS.link,
  },
  shelterSignUpFileUpload: {
    backgroundColor: COLORS.input,
    borderRadius: 10,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  shelterSignUpUploadIcon: {
    color: COLORS.title,
    fontSize: 20,
    marginRight: 10,
  },
  shelterSignUpPageUploadText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  shelterSignUpModalContent: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  shelterSignUpModalTitle: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    marginBottom: 20,
  },
  shelterSignUpCheckboxContainer: {
    flexDirection: "row",
    gap: 10,
  },
  shelterSignUpPageCheckbox: {
    marginBottom: 10,
  },
  shelterSignUpCheckboxLabel: {
    marginBottom: 20,
    fontFamily: "Poppins_600SemiBold",
  },
  shelterSignUpButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  shelterSignUpModalCancelButton: {
    backgroundColor: COLORS.subtitle,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 90,
    borderRadius: 5,
  },
  shelterSignUpModalCancelButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  shelterSignUpModalConfirmButton: {
    backgroundColor: COLORS.prim,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 90,
    borderRadius: 5,
  },
  shelterSignUpModalConfirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  shelterSignUpTOSTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
  },
  shelterSignUpTermsScrollView: {
    maxHeight: 600,
    marginBottom: 20,
  },
  shelterSignUpTextContainer: {
    marginBottom: 10,
  },
  shelterSignUpSubtitle: {
    fontFamily: "Poppins_600SemiBold",
  },
  shelterSignUpDescription: {
    fontFamily: "Poppins_400Regular",
    textAlign: "justify",
    paddingLeft: 15,
  },
  shelterSignUpEmailAd: {
    color: COLORS.prim,
    fontFamily: "Poppins_500Medium",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  buttonContainer: {
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
});

export default styles;
