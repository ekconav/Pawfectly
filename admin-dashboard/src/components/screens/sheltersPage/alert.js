// import Alert from '@mui/material/Alert';
// import AlertTitle from '@mui/material/AlertTitle';
// import Stack from '@mui/material/Stack';

// // Success Alert component
// const SuccessAlert = ({ children }) => {
//     return (
//         <Stack
//           sx={{
//             width: '100%',
//             position: 'fixed',
//             top: '20px',
//             zIndex: 9999,
//             display: 'flex',
//             justifyContent: 'center', // Center horizontally
//             alignItems: 'center', // Center vertically
//           }}
//           spacing={2}
//         >
//           <Alert severity="success" style={{ textAlign: 'center' }}> {/* Center text */}
//             <AlertTitle><h3>Success</h3></AlertTitle>
//             {children}
//           </Alert>
//         </Stack>
//       );
//     };

// // Error Alert component
// const ErrorAlert = ({ children }) => {
//     return (
//         <Stack
//           sx={{
//             width: '100%',
//             position: 'fixed',
//             top: '20px',
//             zIndex: 9999,
//             display: 'flex',
//             justifyContent: 'center', // Center horizontally
//             alignItems: 'center', // Center vertically
//           }}
//           spacing={2}
//         >
//           <Alert severity="error" style={{ textAlign: 'center' }}> {/* Center text */}
//             <AlertTitle><h3>Error</h3></AlertTitle>
//             {children}
//           </Alert>
//         </Stack>
//       );
//     };

// // Export multiple alerts under a different name to avoid conflict
// const Alerts = {
//   SuccessAlert,
//   ErrorAlert,
// };

// export default Alerts;
