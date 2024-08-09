import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const styles = StyleSheet.create({
  signUpPageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },
  signUpPageTitle: {
    fontSize: 24,
    marginBottom: 16,
    fontFamily: "Poppins_700Bold",
    color: COLORS.title,
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
  countryCodeOverlay: {
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
    paddingRight: 10,
    height: 35,
    marginBottom: 10,
  },
  signUpPageEmailSuffix: {
    marginLeft: 10,
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    paddingTop: 6,
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
});

export default styles;
