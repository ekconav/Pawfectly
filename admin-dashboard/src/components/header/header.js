import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "./styles";
import { auth, db } from "../../FirebaseConfig";
import { getDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import LoadingSpinner from "../screens/loadingPage/loadingSpinner";

const Header = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePicture = async () => {
      setLoading(true);
      if (auth.currentUser) {
        const adminRef = doc(db, "admin", auth.currentUser.uid);
        const adminDoc = await getDoc(adminRef);
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          if (data.accountPicture) {
            setProfilePicture(data.accountPicture);
          } else {
            setProfilePicture(require("../../const/user.png"));
          }
          if (data.firstName) {
            setFirstName(data.firstName);
          }
        }
      }
      setLoading(false);
    };

    fetchProfilePicture();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout error: ", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <header style={styles.adminHeader}>
      <nav style={styles.nav}>
        <div style={styles.navLinksContainer}>
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
        </div>
        <div style={styles.profile}>
          {profilePicture && (
            <div style={styles.profileContainer}>
              <p>Welcome, {firstName}! </p>
              <img
                src={profilePicture}
                alt="Profile"
                style={styles.profilePicture}
                onClick={() => setDropdownOpen(!dropdownOpen)}
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
        </div>
      </nav>
    </header>
  );
};

export default Header;
