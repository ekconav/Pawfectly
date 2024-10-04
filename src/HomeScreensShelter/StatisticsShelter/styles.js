import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
  },
  noStatsAvailable: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  noStatsText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    fontSize: 16,
  },
  title: {
    fontFamily: "Poppins_500Medium",
    textAlign: "center",
    marginTop: 30,
    fontSize: 18,
  },
  chart: {
    marginBottom: 20,
    alignItems: "center",
  },
  legendContainer: {
    flexDirection: "column",
    gap: 20,
    paddingHorizontal: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendColorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendTitle: {
    fontFamily: "Poppins_500Medium",
  },
  legendsResult: {
    fontFamily: "Poppins_500Medium",
  },
});

export default styles;
