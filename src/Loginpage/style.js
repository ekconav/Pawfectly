import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const style = StyleSheet.create({
  loginPageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontFamily: "Poppins_500Medium",
    color: COLORS.title,
  },
  loginPageLink: {
    color: COLORS.link,
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
  },
});

export default style;
