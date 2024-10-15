import { StyleSheet } from "react-native";
import COLORS from "../../colors";

const styles = StyleSheet.create({
  pageTitle: {
    fontSize: "40px",
    fontWeight: 500,
    fontFamily: "Poppins",
    color: COLORS.title,
    margin: 10,
  },

  container: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr", // Two equal columns
    gap: "10px", // Space between columns
    padding: "10px",
  },

  //User List
  userListContainer: {
    display: "flex",
    paddingLeft: 50,
    paddingRight: 50,
    marginLeft: 50,
    marginRight: 10,
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    height: "60vh",
    width: "60vw",
    flexDirection: "column",
  },
  userDetails: {
    display: "grid",
    gridTemplateColumns: "7vw 25vw 10vw 10vw",
    gridTemplateRows: "repeat(5, 2fr)", 
    gap: "10px",
  },
  userDetailsLabel: {
    display: "grid",
    gridTemplateColumns: "15vh 50vh 20vh 10vh",
    height: "10vh",
    gap: "10px",
  },
  line: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontWeight: 500,
    fontFamily: "Poppins",
    color: COLORS.title,
  },
  userPicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  // Pagination
  pagination: {
    display: "flex",
    justifyContent: "right",
    alignItems: "center",
    marginTop: "20px",
    marginRight: 50,
  },
  paginationButton: {
    fontFamily: "inherit",
    fontWeight: "600",
    fontSize: "16px",
    marginLeft: "10px",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    background: "transparent",
    color: "#5F5B5B",
    border: "2px solid #5F5B5B",
  },
  disabledButton: {
    opacity: 0.5,
    cursor: "not-allowed",
  },

  // User Information
  userInfoContainer: {
    paddingLeft: 50,
    paddingRight: 20,
    marginLeft: 10,
    marginRight: 50,
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    height: "60vh",
    width: "28vw",
  },
  userInfoHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingBottom: "10px",
    paddingTop: "10px",
  },
  userInfoTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: "18px",
  },
  selectedUserPicture: {
    width: 100,
    height: 100,
    borderRadius: 25,
  },
  userInfoDetails: {
    display: "grid",
    gridTemplateColumns: "11vh 30vh",
    gridTemplateRows: "1fr 1fr 10vh 1fr 2fr",
    gap: "3px",
  },
  userInfoTitleLabel: {
    marginTop: "4px",
    marginBottom: "4px",
  },
  govtPicture: {
    width: 80,
    height: 60,
    borderRadius: 10,
    cursor: "pointer",
  },

  // goPicture Modal
  fullImage: {
    maxWidth: "100%",
    maxHeight: "80vh",
    border: "2px solid #5F5B5B",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
  },
  closeButton: {
    marginTop: "10px",
    padding: "5px 10px",
    backgroundColor: "#5F5B5B",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },

  // User Information Edit Button
  editIcon: {
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: `2px solid ${COLORS.prim}`,
    borderRadius: "6px",
    color: COLORS.prim,
    fontSize: "20px",
  },

  //Modal Styles
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
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: COLORS.prim,
    borderWidth: 0,
    padding: 20,
    borderRadius: 10,
    color: COLORS.white,
    cursor: "pointer",
  },
  cancelButton: {
    backgroundColor: COLORS.subtitle,
    color: COLORS.white,
    padding: 20,
    border: "none",
    borderRadius: 10,
    marginLeft: 10,
    cursor: "pointer",
  },

  // Modal Edit Forms
  modalForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    gap: 10,
  },
  inputField: {
    width: "100%",
    padding: 10,
    border: "1px solid",
    borderColor: COLORS.outline,
    borderRadius: 5,
    boxSizing: "border-box",
  },
  SwitchLine: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "flex-start",
    width: "100%",
  },
  mobileNumberContainer: {
    position: "relative",
    width: "100%",
    display: "flex",
    alignItems: "center",
  },
  countryCode: {
    position: "absolute",
    left: "10px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#5F5B5B",
  },
  modalTitle: {
    fontWeight: 500,
    fontFamily: "Poppins",
    color: COLORS.title,
  },
});

export default styles;
