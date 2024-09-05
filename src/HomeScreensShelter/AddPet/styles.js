import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 25,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
  },
  accountName: {
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
  addImageContainer: {
    alignItems: "center",
    marginTop: 20,
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
    marginTop: 20,
    flexDirection: "column",
    gap: 13,
  },
  inputContainer: {
    // flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
  },
  addPetInput: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    // width: "75%",
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins_400Regular",
    color: COLORS.black,
  },
  addPetDescriptionInput: {
    borderWidth: 1,
    borderColor: COLORS.outline,
    // width: "75%",
    height: 100,
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    fontFamily: "Poppins_400Regular",
  },
  inputCheckboxContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    marginRight: 8,
    // gap: 50,
  },
  checkBoxContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  typeText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.title,
    marginRight: 45,
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
  clearButton: {
    backgroundColor: COLORS.subtitle,
    padding: 10,
    borderRadius: 10,
    width: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 15,
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
    // justifyContent: "flex-end",
    justifyContent: "center",
    alignItems: "center",
  },
  ageOptions: {
    width: 185,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
    height: 250,
    // top: 180,
  },
  ageDropdown: {
    paddingVertical: 5,
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
  //   container: {
  //     flexGrow: 1,
  //     padding: 20,
  //     backgroundColor: "#fff",
  //   },
  //   imageContainer: {
  //     alignItems: "center",
  //     marginBottom: 20,
  //   },
  //   addPhoto: {
  //     alignItems: "center",
  //     justifyContent: "center",
  //     width: 120,
  //     height: 120,
  //     borderWidth: 1,
  //     borderColor: "black",
  //     borderRadius: 10,
  //     marginBottom: 10,
  //   },
  //   addPhotoText: {
  //     marginTop: 5,
  //   },
  //   image: {
  //     width: 120,
  //     height: 120,
  //     resizeMode: "cover",
  //     borderRadius: 10,
  //     marginBottom: 10,
  //   },
  //   form: {
  //     marginBottom: 20,
  //   },
  //   inputField: {
  //     borderWidth: 1,
  //     borderColor: "gray",
  //     borderRadius: 5,
  //     paddingHorizontal: 10,
  //     paddingVertical: 8,
  //     marginBottom: 15,
  //   },
  //   checkboxContainer: {
  //     flexDirection: "row",
  //     alignItems: "center",
  //     marginBottom: 15,
  //   },
  //   checkboxLabel: {
  //     marginLeft: 8,
  //   },
  //   dropdownButton: {
  //     flexDirection: "row",
  //     alignItems: "center",
  //     justifyContent: "space-between",
  //     borderWidth: 1,
  //     borderColor: "#ccc",
  //     borderRadius: 5,
  //     paddingHorizontal: 10,
  //     paddingVertical: 8,
  //     marginBottom: 10,
  //   },
  //   dropdownButtonText: {
  //     fontSize: 16,
  //   },
  //   modalContainer: {
  //     flex: 1,
  //     justifyContent: "center",
  //     alignItems: "center",
  //     backgroundColor: "rgba(0, 0, 0, 0.5)",
  //   },
  //   modalContent: {
  //     backgroundColor: "white",
  //     borderRadius: 10,
  //     padding: 20,
  //     maxHeight: "80%",
  //     width: "80%",
  //   },
  //   breedOption: {
  //     paddingVertical: 10,
  //     borderBottomWidth: 1,
  //     borderBottomColor: "#ccc",
  //   },
  //   uploadButton: {
  //     backgroundColor: "blue",
  //     paddingVertical: 12,
  //     borderRadius: 20,
  //     alignItems: "center",
  //     width: "50%",
  //     alignSelf: "center",
  //   },
  //   uploadButtonText: {
  //     color: "white",
  //     fontSize: 16,
  //   },
});

export default styles;
