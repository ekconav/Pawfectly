import { StyleSheet } from "react-native";
import COLORS from "../colors";

const styles = StyleSheet.create({
  adminHeader: {
    display: "flex",
    backgroundColor: COLORS.outline,
    height: 80,
    alignItems: "center",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  navLinksContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 80,
    alignItems: "center",
    padding: 25,
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
  profile: {
    display: "flex",
    alignItems: "center",
    paddingRight: 20,
  },
  profileContainer: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.title,
    cursor: "pointer",
  },
  dropdownMenu: {
    position: "absolute",
    top: 50,
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
    elevation: 2,
    zIndex: 10,
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
