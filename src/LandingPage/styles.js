import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  landingPageTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.title,
    paddingBottom: 40,
    fontFamily: "Poppins_700Bold",
  },
  landingPageImageContainer: {
    alignItems: "center",
  },
  landingPageImage: {
    width: 287,
    height: 410,
    marginBottom: 5,
    borderTopLeftRadius: 135,
    borderTopRightRadius: 135,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  landingPageSubtitle: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.subtitle,
    paddingTop: 50,
  },
  boldText: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    color: COLORS.title,
  },
  landingPageButton: {
    backgroundColor: COLORS.prim,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  landingPageButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: "Poppins_700Bold",
    textAlign: "center",
  },
});

export default styles;
