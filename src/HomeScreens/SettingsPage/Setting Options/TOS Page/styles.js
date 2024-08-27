import { StyleSheet } from "react-native";
import COLORS from "../../../../const/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.white,
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
  tosContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  tosRenderContainer: {
    marginBottom: 10,
  },
  tosTitle: {
    fontFamily: "Poppins_600SemiBold",
  },
  tosDescription: {
    fontFamily: "Poppins_400Regular",
    textAlign: "justify",
    paddingLeft: 15,
  },
  email: {
    color: COLORS.prim,
    fontFamily: "Poppins_500Medium",
  },
});

export default styles;
