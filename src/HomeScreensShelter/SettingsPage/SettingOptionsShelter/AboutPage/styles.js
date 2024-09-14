import { StyleSheet } from "react-native";
import COLORS from "../../../../const/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 5,
  },
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
    color: COLORS.title,
  },
  textContainer: {
    marginTop: 20,
    gap: 10,
  },
  aboutText: {
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
});

export default styles;
