import { StyleSheet } from "react-native";
import COLORS from "../../../../const/colors";

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  accountContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  pictureButton: {
    width: 180,
    height: 180,
    borderRadius: 100,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  iconImageButton: {
    backgroundColor: COLORS.prim,
    borderRadius: 50,
    padding: 10,
    bottom: 40,
    left: 50,
  },
  textInputContainers: {
    flexDirection: "column",
    gap: 15,
  },
  text: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.title,
  },
  firstLastName: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  firstLastInput: {
    fontFamily: "Poppins_400Regular",
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 10,
    padding: 10,
    width: 140,
  },
  input: {
    fontFamily: "Poppins_400Regular",
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 10,
    padding: 10,
  },
  saveButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    width: 100,
    borderRadius: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  saveText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.white,
    textAlign: "center",
  },
  imageModalOverlay: {
    flex: 1,
    justifyContent: "center",
  },
  modalImageContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  modalProfileImage: {
    width: "100%",
    height: 300,
  },
});

export default styles;