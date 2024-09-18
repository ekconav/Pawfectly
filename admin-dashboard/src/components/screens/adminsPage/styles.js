import { StyleSheet } from "react-native";
import COLORS from "../../colors";

const styles = StyleSheet.create({
  adminListContainer: {
    display: "flex",
    gap: 250,
    paddingLeft: 50,
    paddingRight: 50,
  },
  labelItem: {
    fontWeight: 500,
  },
  adminDetails: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 2fr 1fr", 
    gap: 10,
  },
  adminCard: {
    display: "contents", 
  },
  line: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontWeight: 500,
  },
  adminPicture: {
    width: 50,
    height:  50,
    borderRadius: 25,
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  addButton: {
    backgroundColor: COLORS.prim,
    borderWidth: 0,
    padding: 20,
    borderRadius: 10,
    color: COLORS.white,
  },
  addButtonHover: {
    backgroundColor: COLORS.addButtonHover,
    borderWidth: 0,
    padding: 20,
    borderRadius: 10,
    color: COLORS.white,
  },
  deleteButton: {
    backgroundColor: COLORS.error,
    borderWidth: 0,
    padding: 20,
    borderRadius: 10,
    color: COLORS.white,
  },
  deleteButtonHover: {
    backgroundColor: COLORS.deleteButtonHover,
    borderWidth: 0,
    padding: 20,
    borderRadius: 10,
    color: COLORS.white,
  },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 8,
    width: 400,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  modalForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 10
  },
  inputField: {
    width: "100%",
    padding: 10,
    border: "1px solid",
    borderColor: COLORS.outline,
    borderRadius: 5,
    boxSizing: "border-box",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  addAdminButton: {
    backgroundColor: COLORS.prim,
    borderWidth: 0,
    padding: 20,
    borderRadius: 10,
    color: COLORS.white,
  },
  cancelButton: {
    backgroundColor: COLORS.outline,
    color: COLORS.black,
    padding: 20,
    border: "none",
    borderRadius: 10,
    marginLeft: 10,
  },
  error: {
    color: COLORS.error
  }
});

export default styles;
