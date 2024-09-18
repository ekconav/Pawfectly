// styles.js
const styles = {
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 5000,
    },
    modalContent: {
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      position: 'relative',
      maxWidth: '90%',
      maxHeight: '80%',
      overflow: 'auto',
    },
    modalImage: {
      maxWidth: '80%',
      height: 'auto',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      fontSize: '24px',
      cursor: 'pointer',
    },
    clickableImage: {
      width: '100px',
      height: 'auto',
      cursor: 'pointer',
    },
    iconContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
    },
    icon: {
      fontSize: '18px',
    },
  };
  
  export default styles;
  