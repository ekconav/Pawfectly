import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { query, where, getDocs, collection } from "firebase/firestore";
import { auth, db } from "../../FirebaseConfig";
import { useNavigate } from "react-router-dom";
import styles from "./styles";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(collection(db, "admin"), where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard");
        console.log("Successful login");
      } else {
        setError("This email is not registered as an admin.");
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setError("Password is incorrect");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid credential.");
      }
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <h2>Pawfectly Admin</h2>
        <form onSubmit={handleLogin} style={styles.formContainer}>
          <div style={styles.inputContainer}>
            <div style={styles.emailContainer}>
              <label>Email:</label>
              <input
                className="input"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                required
              />
            </div>
            <div style={styles.passwordContainer}>
              <label>Password:</label>
              <input
                className="input"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                required
              />
            </div>
          </div>

          {error && <p style={styles.error}>{error}</p>}
          <button className="button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
