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

  //Container
  adminContainer: {
    display: 'flex',
    justifyContent: 'center', // Centers horizontally
    paddingLeft: 50,
    paddingRight: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    height: "70vh",  
    width:"90vw",
  },
  adminGridCols: {
    display: "grid",
    gridTemplateRows: "10vh 1fr 1fr 1fr 1fr", 
    gap: "10px",
    height: "67vh",
    width: "80vw",
    
  },
  adminGridRows: {
    display: "grid", 
    gridTemplateColumns: "10vh 3fr 2fr 2fr 15vh",  
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", 
    backgroundColor: "#F2F2F2",
    padding: "10px",
    
  },
  adminLabelRows: {
    display: "grid", 
    gridTemplateColumns: "10vh 3fr 2fr 2fr 15vh",  
    padding: "10px",
    marginTop: "10px",
    
  },
  line: {
    display: "flex",        
    alignItems: "center",   
    justifyContent: "center", 
    height: "100%",         
  },
  title: {
    fontWeight: 500,
  },
  adminPicture: {
    width: 50,
    height:  50,
    borderRadius: 25,
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

  // Modal Form
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

  // Modal Form
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
  confirmButton: {
    backgroundColor: COLORS.prim,
    borderWidth: 0,
    padding: 20,
    borderRadius: 10,
    color: COLORS.white,
  },
  cancelButton: {
    backgroundColor: COLORS.subtitle,
    color: COLORS.white,
    padding: 20,
    border: "none",
    borderRadius: 10,
    marginLeft: 10,
  },
  error: {
    color: COLORS.error
  },
  mobileNumberContainer: {
    position: 'relative',  
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  countryCode: {
    position: 'absolute',  
    left: '10px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#5F5B5B', 
  },
  modalTitle: {
    fontWeight: 500,
    fontFamily: "Poppins",
    color: COLORS.title,
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
});

export default styles;
