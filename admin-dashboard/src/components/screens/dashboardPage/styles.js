import { StyleSheet } from "react-native";
import COLORS from "../../colors";

const styles = StyleSheet.create({
  pageTitle: {
    // fontSize: "40px",
    fontWeight: 500,
    fontFamily: "Poppins",
    color: COLORS.title,
    margin: 10,
  },
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 2fr", 
    gap: "10px", 
    padding: "10px",
  },
  graphCard: {
    display: "flex",
    paddingLeft: 40,
    paddingRight: 40,
    marginLeft: 30,
    marginRight: 10,
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    height: "50vh",
    width: "35vw",
    flexDirection: "column",
  },
  summaryCard: {
    display: "flex",
    paddingLeft: 40,
    paddingRight: 40,
    marginLeft: 10,
    marginRight: 30,
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    height: "100vh",
    width: "auto",
    flexDirection: "column",
  },
  summaryGridCols: {
    display: "grid",
    gridTemplateRows: "7vh repeat(7, 8vh)",
    gap: "5px",
    height: "80vh",
    width: "auto",
    overflowY: "auto", // Enable vertical scrolling
    maxHeight: "80vh",
  },
  summaryGridRows: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr) 1.3fr 0.7fr",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#F2F2F2",
    height: "8vh",
    gap: "3pvw",
  },
  summaryLabelRows: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr) 1.3fr 0.7fr",
    marginTop: "10px",
    position: "sticky", 
    top: 0, 
    zIndex: 1,
    backgroundColor: COLORS.white,
  },
  IDline: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    margin: 0,
    whiteSpace: "normal", 
    overflowWrap: "break-word", 
    wordBreak: "break-all",
    textAlign: "center", 
    fontSize: "12px", 
    lineHeight: "1.2", 
    overflow: "hidden",
  },
  line: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    margin: 0,
  },
  title: {
    fontWeight: 500,
    margin: 0,
  },
  adminPicture: {
    width: 40,
    height: 40,
    borderRadius: 15,
  },

  // Edit Button
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
    width: 500,
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
    backgroundColor: COLORS.outline,
    color: COLORS.black,
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

  dropdownScrollable: {
    position: "absolute",
    backgroundColor: "white",
    border: `1px solid ${COLORS.prim}`,
    borderRadius: "4px",
    maxHeight: "30vh", // Set maximum height for the dropdown
    overflowY: "auto", // Enable vertical scroll
    width: "20vw", // Match the width of the input
    zIndex: 1000, // Ensure it stays above other elements
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow for depth
  },
  dropdownItem: {
    paddingLeft: "8px",
    paddingTop: "4px",
    cursor: "pointer",
    textAlign: "left",
    transition: "background-color 0.2s ease", // Smooth transition for hover
    backgroundColor: COLORS.white,
    color: COLORS.black,
  },
  searchIcon: {
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: `2px solid ${COLORS.prim}`,
    borderRadius: "6px",
    color: COLORS.prim,
    fontSize: "25px",
    fontWeight: 100,
  },
});

export default styles;
