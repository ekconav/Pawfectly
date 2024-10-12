import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const style = StyleSheet.create({
  loginPageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  loginPageTitle: {
    fontSize: 24,
    marginBottom: 24,
    color: COLORS.title,
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },
  loginPageInputLabel: {
    fontSize: 16,
    textAlign: "left",
    alignSelf: "flex-start",
    marginBottom: 5,
    color: COLORS.title,
    fontFamily: "Poppins_500Medium",
  },
  loginPageInput: {
    height: 48,
    width: "100%",
    fontFamily: "Poppins_400Regular",
    borderRadius: 10,
    marginBottom: 24,
    paddingHorizontal: 16,
    color: COLORS.black,
    backgroundColor: COLORS.input,
  },
  loginPageButton: {
    width: 194,
    height: 50,
    backgroundColor: COLORS.prim,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
  },
  loginPageButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },
  loginPageSubtitle: {
    fontSize: 12,
    top: 20,
    fontFamily: "Poppins_500Medium",
    color: COLORS.title,
  },
  loginPageLink: {
    color: COLORS.link,
    fontSize: 12,
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
  forgotPasswordContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: -20,
    marginBottom: 20,
  },
  resetPasswordText: {
    color: COLORS.link,
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    textDecorationLine: "underline"
  },
});

export default style;
