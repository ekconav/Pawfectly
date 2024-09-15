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
  textContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    gap: 10,
  },
  title: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.prim,
  },
  subtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    color: COLORS.title,
  },
  textInputContainer: {
    paddingHorizontal: 15,
  },
  input: {
    fontFamily: "Poppins_400Regular",
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 10,
    padding: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "flex-end",
  },
  confirmButton: {
    backgroundColor: COLORS.prim,
    padding: 10,
    borderRadius: 10,
    width: 100,
    height: 45,
    justifyContent: "center",
    elevation: 1,
  },
  buttonText: {
    fontFamily: "Poppins_400Regular",
    color: COLORS.white,
    textAlign: "center",
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    padding: 20,
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
