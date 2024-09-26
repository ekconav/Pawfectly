import { StyleSheet } from "react-native";
import COLORS from "../../colors";

const styles = StyleSheet.create({
  TOScontainer: {
    display: 'flex',
    justifyContent: 'center', // Centers horizontally
    alignItems: 'center', // Centers vertically
    paddingLeft: 50,
    paddingRight: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    height: "65vh",  
    width:"80vw",
  },
  TOSgridCols: {
    display: "grid",
    gridTemplateRows: 'repeat(4, 1fr)', 
    gap: "10px",
    height: "60vh",
    width: "80vw",
    
  },
  TOSgridRows: {
    display: "grid", 
    gridTemplateColumns: "10vh 2fr 4fr 15vh",  
    borderRadius: "8px",
    backgroundColor: "#FFF", 
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
    backgroundColor: "#F2F2F2",
    padding: "10px",
    
  },
  line: {
    display: "flex",        
    alignItems: "center",   
    justifyContent: "center", 
    height: "100%",         
  },  
  // Pagination
  pagination: {
    display: 'flex',
    justifyContent: 'right',
    alignItems: 'center',
    marginTop: '20px',
    marginRight: 50,
  },
  paginationButton: {
    fontFamily: 'inherit',
    fontWeight: '600',
    fontSize: '16px',
    marginLeft: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'transparent',
    color: '#5F5B5B',
    border: '2px solid #5F5B5B',
  },
  disabledButton: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },

  // Edit Button
  editButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    border: "2px solid #0080FF", 
    borderRadius: "6px",
    width: "20px", 
    height: "20px", 
    cursor: "pointer",
    transition: "all 0.3s ease",
    margin:"5px",
  },
  editIcon: {
    color: "#0080FF",
    fontSize: "30px",
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
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: COLORS.outline,
    color: COLORS.black,
    padding: 20,
    border: "none",
    borderRadius: 10,
    marginLeft: 10,
    cursor: 'pointer',
  },

  // Modal Edit Forms
  modalForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
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


});

export default styles;
