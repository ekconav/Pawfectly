import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  petImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlayButton: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: COLORS.white,
    padding: 7,
    borderRadius: 10,
    elevation: 1,
  },
  petStyles: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 7,
  },
  petDetails: {
    flexGrow: 1,
  },
  petNamePriceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: COLORS.title,
  },
  petPriceTitle: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    fontSize: 12,
  },
  petPrice: {
    fontFamily: "Poppins_500Medium",
    fontSize: 20,
    color: COLORS.title,
  },
  petPostedDate: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.title,
  },
  midInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 20,
  },
  midInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.outline,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
  },
  midInfoDetail: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: COLORS.prim,
    flexWrap: "wrap",
    textAlign: "center",
  },
  midInfoTitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: COLORS.title,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.title,
  },
  aboutContainer: {
    marginTop: 20,
  },
  aboutTitle: {
    fontFamily: "Poppins_500Medium",
    fontSize: 14,
    color: COLORS.title,
  },
  aboutDescription: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: COLORS.title,
  },
});

export default styles;
