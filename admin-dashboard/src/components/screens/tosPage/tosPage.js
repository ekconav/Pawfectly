import React from "react";
import Header from "../../header/header";
import styles from "./styles";

const TOSPage = () => {
  return (
    <div>
      <Header />
      <h1>Terms Of Service</h1>
        <div style={styles.TOScontainer}>
          {/* Your TOS content */}
        </div>
      </div>
  );
};

export default TOSPage;
