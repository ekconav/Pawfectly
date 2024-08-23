import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./styles";
import { auth, db } from "../../FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

const Header = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (auth.currentUser) {
        const adminRef = doc(db, "admins", auth.currentUser.uid);
        const adminDoc = await getDoc(adminRef);
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          if (data.accountPicture) {
            setProfilePicture(data.accountPicture);
          } else {
            setProfilePicture(require("../../const/user.png"));
            console.log("Admin account picture doesn't exist");
          }
        } else {
          console.log("Document doesn't exist");
        }
      }
    };
    fetchProfilePicture();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  return (
    <header style={styles.adminHeader}>
      <nav style={styles.navLinks}>
        <NavLink
          to="/dashboard"
          style={({ isActive }) =>
            isActive
              ? styles.titleLinkActive
              : hoveredLink === "pawfectly"
              ? styles.titleLinkHover
              : styles.titleLink
          }
          onMouseEnter={() => setHoveredLink("pawfectly")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Pawfectly.
        </NavLink>
        <NavLink
          to="/admins"
          style={({ isActive }) =>
            isActive
              ? styles.linkActive
              : hoveredLink === "admins"
              ? styles.linkHover
              : styles.link
          }
          onMouseEnter={() => setHoveredLink("admins")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Admins
        </NavLink>
        <NavLink
          to="/users"
          style={({ isActive }) =>
            isActive
              ? styles.linkActive
              : hoveredLink === "users"
              ? styles.linkHover
              : styles.link
          }
          onMouseEnter={() => setHoveredLink("users")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Users
        </NavLink>
        <NavLink
          to="/shelters"
          style={({ isActive }) =>
            isActive
              ? styles.linkActive
              : hoveredLink === "shelters"
              ? styles.linkHover
              : styles.link
          }
          onMouseEnter={() => setHoveredLink("shelters")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Shelters
        </NavLink>
        <NavLink
          to="/tos"
          style={({ isActive }) =>
            isActive
              ? styles.linkActive
              : hoveredLink === "tos"
              ? styles.linkHover
              : styles.link
          }
          onMouseEnter={() => setHoveredLink("tos")}
          onMouseLeave={() => setHoveredLink(null)}
        >
          Terms of Service
        </NavLink>
        {profilePicture && (
          <div
            style={styles.profileContainer}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <img
              src={profilePicture}
              alt="Profile"
              style={styles.profilePicture}
            />
            {dropdownOpen && (
              <div style={styles.dropdownMenu}>
                <button
                  style={styles.dropdownItem}
                  onClick={() => navigate("/edit-profile")}
                >
                  Edit Profile
                </button>
                <button style={styles.dropdownItem} onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
