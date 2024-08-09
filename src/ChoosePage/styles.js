import { StyleSheet } from "react-native";
import COLORS from "../const/colors";

const styles = StyleSheet.create({
  choosePageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  choosePageTitle: {
    fontSize: 24,
    fontFamily: "Poppins_700Bold",
    marginBottom: 20,
    color: COLORS.title,
    top: -80,
    textAlign: "center",
  },
  choosePageButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 100,
    marginTop: 50,
  },
  choosePageButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  choosePageButton: {
    backgroundColor: COLORS.prim,
    borderRadius: 10,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 130,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Poppins_700Bold",
  },
  buttonTextShelter: {
    color: "#fff",
    fontSize: 11,
    fontFamily: "Poppins_700Bold",
  },
  choosePageImage: {
    height: 98,
    width: 101,
    marginBottom: 20,
  },
  choosePageText: {
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    color: COLORS.subtitle,
  },
});

export default styles;
