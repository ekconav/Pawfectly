const styles = {
  // Modal styles
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    maxHeight: '80vh',
    overflowY: 'auto',
  },
  formGroup: {
    marginBottom: '15px',
  },
  inputField: {
    width: '100%',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  checkbox: {
    marginLeft: '10px',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  updateButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  closeButton: {
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
  },

  // General styles
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  userListContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
  },
  userDetailsLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '600px',
    marginBottom: '10px',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    width: '600px',
  },
  line: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  userPicture: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
  },
  selectedUserPicture: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '20px',
  },
  userInfoContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  userInfoHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '600px',
    marginBottom: '20px',
  },
  userInfoTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  userInfoDetails: {
    display: 'flex',
    flexDirection: 'column',
    width: '600px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  paginationButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 15px',
    margin: '0 5px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  title: {
    fontWeight: 'bold',
  },
  editIcon: {
    fontSize: '20px',
    cursor: 'pointer',
  },
};

export default styles;
