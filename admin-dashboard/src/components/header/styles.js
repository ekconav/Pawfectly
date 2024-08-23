import { StyleSheet } from "react-native";
import COLORS from "../colors";

const styles = StyleSheet.create({
  adminHeader: {
    display: "flex",
    backgroundColor: COLORS.outline,
    height: 80,
    alignItems: "center",
    position: "relative", // Add relative positioning for dropdown
  },
  navLinks: {
    display: "flex",
    flexDirection: "row",
    gap: 80,
    padding: 80,
  },
  titleLink: {
    textDecorationLine: "none",
    color: COLORS.title,
    fontWeight: 700,
    fontSize: 18,
  },
  titleLinkHover: {
    color: COLORS.hover,
    textDecorationLine: "none",
    fontWeight: 700,
    fontSize: 18,
  },
  titleLinkActive: {
    textDecorationLine: "none",
    color: COLORS.hover,
    fontWeight: 700,
    fontSize: 18,
  },
  link: {
    textDecorationLine: "none",
    color: COLORS.title,
  },
  linkHover: {
    color: COLORS.hover,
    textDecorationLine: "none",
  },
  linkActive: {
    textDecorationLine: "none",
    color: COLORS.hover,
  },
  profileContainer: {
    position: "relative",
    marginLeft: "auto", // Align to the right
    marginRight: 20, // Space from the right edge
    cursor: "pointer", // Indicate that it's clickable
  },
  profilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20, // Make it a circle
    borderWidth: 1,
    borderColor: COLORS.title, // Optional: color of the border
  },
  dropdownMenu: {
    position: "absolute",
    top: 50, // Adjust based on the profile picture size
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 4,
    borderColor: "#ddd",
    borderWidth: 1,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Android shadow
    zIndex: 10, // Make sure it appears on top
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: COLORS.text,
  },
  dropdownItemHover: {
    backgroundColor: COLORS.hover,
  },
});

export default styles;
