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
        height: "100vh",
      }}
    >
      <ClipLoader color={COLORS.prim} loading={true} size={50} />
    </div>
  );
};

export default LoadingSpinner;
