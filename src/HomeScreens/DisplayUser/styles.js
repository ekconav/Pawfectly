import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  coverPhoto: {
    height: 160,
    width: "100%",
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
  profileImageContainer: {
    paddingHorizontal: 20,
    marginTop: -40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profile: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: COLORS.outline,
    borderWidth: 2,
    alignItems: "center",
    overflow: "hidden",
    elevation: 1,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  settingsIcon: {
    marginTop: 50,
    elevation: 1,
  },
  infoDetails: {
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  infoContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: COLORS.title,
  },
  iconNotVerified: {
    backgroundColor: COLORS.subtitle,
    color: COLORS.white,
    borderRadius: 50,
  },
  iconVerified: {
    backgroundColor: COLORS.prim,
    color: COLORS.white,
    borderRadius: 50,
  },
  infoOwnerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: -8,
    color: COLORS.title,
    marginBottom: 5,
  },
  infoDetailsContainer: {
    flexDirection: "column",
    gap: 5,
    paddingHorizontal: 20,
  },
  iconTextContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  infoDetailsText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.title,
  },
  furbabiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 2,
  },
  furbabiesText: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.title,
    fontSize: 18,
  },
  noPetsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noPetsText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  showPetsContainer: {
    flex: 1,
    paddingTop: 5,
  },
  buttonContainer: {
    padding: 6,
    borderRadius: 20,
  },
  petButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 1,
    width: 140,
    height: 180,
  },
  imageContainer: {
    height: 130,
    width: "100%",
    marginBottom: 5,
  },
  petImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    resizeMode: "cover",
  },
  petDetails: {
    paddingHorizontal: 7,
  },
  petNameGender: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: COLORS.title,
  },
  petGenderIconMale: {
    backgroundColor: COLORS.malegenderbg,
    padding: 2,
    borderRadius: 50,
  },
  petGenderIconFemale: {
    backgroundColor: COLORS.femalegenderbg,
    padding: 2,
    borderRadius: 50,
  },
  petBreedText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: COLORS.title,
    paddingHorizontal: 7,
  },

  // Settings Modal
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dropdownMenu: {
    width: 126,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
    height: 90,
    top: 180,
  },
  dropdownMenuUserToUser: {
    width: 114,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
    height: 55,
    top: 180,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 12,
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
    textAlign: "right",
  },

  // Report Modal
  reportModalContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 10,
  },
  reportTitle: {
    textAlign: "center",
    fontFamily: "Poppins_500Medium",
    fontSize: 18,
    color: COLORS.title,
  },
  reportMainInputContainer: {
    marginTop: 20,
    flexDirection: "column",
    gap: 13,
  },
  reportInputContainer: {
    flexDirection: "column",
  },
  reportInputTitle: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  reportInput: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins_400Regular",
    color: COLORS.black,
  },
  reportInputReason: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins_400Regular",
    color: COLORS.black,
    height: 150,
  },
  reportUploadScreenshot: {
    backgroundColor: COLORS.input,
    borderRadius: 10,
    height: 35,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  reportCloudIcon: {
    color: COLORS.title,
    fontSize: 20,
    marginRight: 10,
  },
  reportFileUploadText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
  },
  reportButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
    gap: 10,
    justifyContent: "center",
  },
  reportCancelButton: {
    backgroundColor: COLORS.subtitle,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 90,
    borderRadius: 5,
  },
  reportButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: "Poppins_500Medium",
  },
  reportConfirmButton: {
    backgroundColor: COLORS.prim,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    width: 90,
    borderRadius: 5,
  },

  // Alert Modal
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
  },
  alertButtonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  modalText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
    textAlign: "justify",
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
