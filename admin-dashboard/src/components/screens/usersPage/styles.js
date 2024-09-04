import { StyleSheet } from "react-native";
import COLORS from "../../colors";

const styles = StyleSheet.create({
  container: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr', // Two equal columns
    gap: '10px', // Space between columns
    padding: '10px',
  },
  userListContainer: {                      
    display: "flex",
    gap: 250,
    paddingLeft: 50,
    paddingRight: 50,
    marginLeft: 50,
    marginRight: 10,  
    border: "5px solid #5F5B5B",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    height: "60vh",  
    width:"100vh",
    backgroundColor: "#FFF9E3",
  },
  userInfoContainer: {
    // display: "flex",
    gap: 250,
    paddingLeft: 50,
    paddingRight: 50,
    marginLeft: 10,
    marginRight: 50,
    border: "5px solid #5F5B5B",
    borderRadius: "10px",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.4)",
    height: "60vh",  
    width:"50vh",
  },
  labelItem: {
    fontWeight: 500,
  },
  userDetails: {
    display: "grid",
    gridTemplateColumns: "20vh 40vh 20vh", 
    gridTemplateRows: 'repeat(6, 1fr)', 
    gap: "20",
  },
  userInfoDetails: {
    display: "grid",
    gridTemplateColumns: "25vh 40vh", 
    gridTemplateRows: 'repeat(4, 1fr)', 
    gap: "20",
  },
  userCard: {
    display: "contents", 
  },
  line: {
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontWeight: 500,
  },
  userPicture: {
    width: 50,
    height:  50,
    borderRadius: 25,
  },
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
