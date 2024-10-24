import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const styles = StyleSheet.create({
  signUpPageContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },
  signUpPageTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: COLORS.title,
  },
  required: {
    color: COLORS.delete,
  },
  signUpPageLabel: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    marginLeft: 5,
    color: COLORS.title,
  },
  signUpPageinput: {
    height: 35,
    paddingTop: 3.5,
    width: "100%",
    fontFamily: "Poppins_400Regular",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 16,
    color: COLORS.black,
    backgroundColor: COLORS.input,
  },
  signUpPageInputContainer: {
    width: "100%",
  },
  signUpPageMobileInput: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 10,
    backgroundColor: COLORS.input,
    borderRadius: 10,
  },
  signUpPageCountryCodeOverlay: {
    position: "absolute",
    left: 8,
    paddingTop: 3.5,
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    zIndex: 1,
  },
  signUpPageMobileNumberInput: {
    flex: 1,
    height: 35,
    paddingTop: 3.5,
    paddingLeft: 45,
    fontFamily: "Poppins_400Regular",
    color: COLORS.black,
    borderRadius: 10,
  },
  signUpPageEmailInput: {
    flexDirection: "row",
    backgroundColor: COLORS.input,
    borderRadius: 10,
    height: 35,
    marginBottom: 10,
  },
  signUpPageRegisterButton: {
    backgroundColor: COLORS.prim,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: 194,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpPageButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: "Poppins_700Bold",
  },
  signUpPageBackButtonText: {
    color: COLORS.title,
    fontSize: 13,
    fontFamily: "Poppins_500Medium",
    marginTop: 20,
  },
  signUpPageLink: {
    color: COLORS.link,
  },
  signUpPageFileUpload: {
    backgroundColor: COLORS.input,
    borderRadius: 10,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },

  signUpPageUploadIcon: {
    color: COLORS.title,
    fontSize: 20,
    marginRight: 10,
  },

  signUpPageUploadText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  signUpPageModalContent: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  signUpPageModalTitle: {
    fontSize: 14,
    fontFamily: "Poppins_500Medium",
    marginBottom: 20,
  },
  signUpPageCheckboxContainer: {
    flexDirection: "row",
    gap: 10,
  },
  signUpPageCheckbox: {
    marginBottom: 10,
  },
  signUpPageCheckboxLabel: {
    marginBottom: 20,
    fontFamily: "Poppins_600SemiBold",
  },
  signUpPageButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  signUpPageModalCancelButton: {
    backgroundColor: COLORS.subtitle,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 90,
    borderRadius: 5,
  },
  signUpPageModalCancelButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  signUpPageModalConfirmButton: {
    backgroundColor: COLORS.prim,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 90,
    borderRadius: 5,
  },
  signUpPageModalConfirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  signUpPageLink: {
    color: COLORS.link,
  },
  signUpPageTermsScrollView: {
    maxHeight: 600,
    marginBottom: 20,
  },
  signUpPageTOSTitle: {
    fontSize: 16,
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
  },
  signUpPageTextContainer: {
    marginBottom: 10,
  },
  signUpPageSubtitle: {
    fontFamily: "Poppins_600SemiBold",
  },
  signUpPageDescription: {
    fontFamily: "Poppins_400Regular",
    textAlign: "justify",
    paddingLeft: 15,
  },
  signUpPageEmailAd: {
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
