import { StyleSheet } from "react-native";
import COLORS from "../../../const/colors";

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.background,
    paddingHorizontal: 40,
    paddingLeft: 20,
    paddingTop: 3.5,
    borderRadius: 5,
    fontFamily: "Poppins_400Regular",
    borderColor: COLORS.outline,
    borderWidth: 0.5,
    elevation: 1,
  },
  searchIcon: {
    marginLeft: -25,
    right: 10,
    zIndex: 1,
  },
});

export default styles;
