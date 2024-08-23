import { StyleSheet } from "react-native";
import COLORS from "../colors";

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: COLORS.background,
  },
  loginBox: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  error: {
    color: COLORS.error,
    marginTop: 10,
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  emailContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 43.5,
  },
  passwordContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
});

export default styles;
