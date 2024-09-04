import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  petImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  arrowContainer: {
    backgroundColor: COLORS.white,
    padding: 7,
    borderRadius: 10,
  },
  overlayButton: {
    position: "absolute",
    top: 20,
    left: 20,
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
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 24,
    color: COLORS.title,
  },
  addressInformation: {
    flexDirection: "row",
    alignItems: "center",
  },
  textAddress: {
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
  shelterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  shelterInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  shelterImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  shelterTextContainer: {
    flex: 1,
  },
  shelterName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    color: COLORS.title,
  },
  callMessage: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    backgroundColor: COLORS.prim,
    padding: 8,
    borderRadius: 50,
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  favoriteContainer: {
    width: "25%",
  },
  adoptMeContainer: {
    width: "73%",
  },
  button: {
    backgroundColor: COLORS.prim,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  adoptButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  adoptButtonSent: {
    backgroundColor: "rgba(130, 115, 151, 0.5)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  textButton: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
  textButtonSent: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 14,
    color: COLORS.white,
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  modalButtonContainer: {
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
});

export default styles;
