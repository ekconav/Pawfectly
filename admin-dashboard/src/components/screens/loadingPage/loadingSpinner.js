import React from "react";
import ClipLoader from "react-spinners/ClipLoader";
import COLORS from "../../colors";

const LoadingSpinner = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed", // Make it cover the entire screen
        top: 0,
        left: 0,
        width: "100vw",    // Full width of the viewport
        height: "100vh",   // Full height of the viewport
        backgroundColor: COLORS.white, // Optional: white background with opacity
        zIndex: 9999,      // Ensure it stays on top of everything
      }}
    >
      <ClipLoader color={COLORS.prim} loading={true} size={50} />
    </div>
  );
};

export default LoadingSpinner;
