import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 20,
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  headerTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 17,
    marginTop: 5,
    color: COLORS.title,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  addPetContainer: {
    flex: 1,
  },
  addImageContainer: {
    alignItems: "center",
  },
  imageButton: {
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
  addPetText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  petPreviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  addPetInputContainer: {
    flexDirection: "column",
    gap: 13,
  },
  inputContainer: {
    justifyContent: "space-between",
  },
  addPetInput: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins_400Regular",
    color: COLORS.black,
  },
  addPetDescriptionInput: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    height: 75,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins_400Regular",
  },
  inputCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  typeText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
  },
  typeTextAdoptionFee: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    marginRight: 44,
  },
  typeGender: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    marginRight: 26,
  },
  checkBoxType: {
    flexDirection: "row",
    gap: 50,
  },
  checkboxGender: {
    flexDirection: "row",
    gap: 45,
  },
  inputRescuedCheckboxContainer: {
    flexDirection: "row",
    gap: 101,
  },
  inputCheckboxContainerAdoptionFee: {
    flexDirection: "row",
    gap: 15,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    paddingVertical: 10,
  },
  clearButton: {
    backgroundColor: COLORS.subtitle,
    padding: 10,
    borderRadius: 10,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    borderRadius: 10,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.white,
  },

  // Age Modal
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  ageOptions: {
    width: 185,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 5,
    height: 280,
  },
  ageDropdown: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  ageDropdownText: {
    fontSize: 12,
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },

  // Alert Modal
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
