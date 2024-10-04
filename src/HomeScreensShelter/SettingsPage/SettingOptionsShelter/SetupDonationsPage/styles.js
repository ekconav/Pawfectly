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
  iconContainer: {
    width: "100%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    borderColor: COLORS.outline,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 20,
  },
  qrCodePicture: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  uploadButton: {
    backgroundColor: COLORS.prim,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.white,
  },
  deleteButton: {
    backgroundColor: COLORS.delete,
    padding: 15,
    borderRadius: 10,
    width: 100,
    alignItems: "center",
  },
  changeButton: {
    backgroundColor: COLORS.prim,
    padding: 15,
    borderRadius: 10,
    width: 100,
    alignItems: "center",
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
