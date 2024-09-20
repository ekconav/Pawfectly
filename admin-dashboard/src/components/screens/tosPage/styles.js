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
    backgroundColor: "#FFF", // Background color for each row
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Shadow 
    backgroundColor: "#F2F2F2",
    padding: "10px",
    
  },
  line: {
    display: "flex",        // Flexbox to center items
    alignItems: "center",   // Vertical centering
    justifyContent: "center", // Horizontal centering (optional if needed)
    height: "100%",         // Make sure it takes full height to center correctly
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

  // User Information Edit Button
  editButtonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    border: "2px solid blue", 
    borderRadius: "6px",
    width: "20px", 
    height: "20px", 
    cursor: "pointer",
    transition: "all 0.3s ease",
    margin:"5px",
  },
  editIcon: {
    color: "blue",
    fontSize: "30px",
  },

});

export default styles;
