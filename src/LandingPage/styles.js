import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
  },
  landingPageTitle: {
    fontSize: 24,
    marginBottom: 60,
    textAlign: "center",
    color: COLORS.title,
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
  textContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    color: COLORS.title,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    color: COLORS.subtitle,
  },
  landingPageButton: {
    backgroundColor: COLORS.prim,
    paddingVertical: 15,
    paddingHorizontal: 40,
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
