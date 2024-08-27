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
  profileImageContainer: {
    paddingHorizontal: 20,
    marginTop: -40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: COLORS.outline,
    borderWidth: 2,
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  settingsIcon: {
    marginTop: 50,
  },
  userInfoContainer: {
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
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
  userFullName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: COLORS.title,
  },
  iconTextContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  userDetailsContainer: {
    flexDirection: "column",
    gap: 5,
    paddingHorizontal: 20,
  },
  userDetailsIcon: {
    color: COLORS.prim,
  },
  userDetailsText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.title,
  },
  furbabiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  furbabiesText: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.title,
    fontSize: 18,
  },
  titleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addPetButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: COLORS.prim,
    borderRadius: 10,
    padding: 8,
  },
  addPetButtonText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
  },

  // Add Pet Modal Container
  addPetModalOverlay: {
    flex: 1,
    justifyContent: "center",
  },
  addPetModalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
  },
  addImageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  modalTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 18,
    color: COLORS.title,
  },
  modalAddPetImage: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 20,
    width: "50%",
    height: 130,
    alignItems: "center",
    overflow: "hidden",
  },
  iconAndText: {
    flexDirection: "row",
    gap: 8,
  },
  addPetInputContainer: {
    marginTop: 20,
    flexDirection: "column",
    gap: 20,
  },
  addPetInput: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    width: "70%",
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins_400Regular",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addPetButtonContainer: {
    marginTop: 20,
    flexDirection: "row-reverse",
    gap: 20,
  },
  modalText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  modalCancelButton: {
    backgroundColor: COLORS.receivedMessage,
    padding: 10,
    borderRadius: 10,
  },
  modalSubmitButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalSubmitText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
  inputGenderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 8,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  petPreviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // Furbabies Button
  showcasePetsContainer: {
    flex: 1,
    paddingTop: 5,
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
  imageLoading: {
    flex: 1,
    justifyContent: "center",
  },
  petDetails: {
    paddingHorizontal: 7,
  },
  buttonContainer: {
    padding: 6,
    borderRadius: 20,
  },
  noResultContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  noResultsText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    marginTop: 140,
  },
  petImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    resizeMode: "cover",
  },
  petNameGender: {
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
    alignContent: "center",
    paddingHorizontal: 7,
  },
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: COLORS.title,
  },
  genderIconContainer: {
    right: 50,
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
    width: 180,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
    height: 235,
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

  // Pet Details Modal
  petDetailsOverlay: {
    flex: 1,
    justifyContent: "center",
  },
  petDetailsSaveButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    borderRadius: 10,
    width: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  petDetailsDeleteButton: {
    backgroundColor: COLORS.delete,
    padding: 10,
    borderRadius: 10,
    width: 65,
    alignItems: "center",
    justifyContent: "center",
  },
  petDetailsDeleteText: {
    color: COLORS.white,
    fontFamily: "Poppins_400Regular",
  },
});

export default styles;
