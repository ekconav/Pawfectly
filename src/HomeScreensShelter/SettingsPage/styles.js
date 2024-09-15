import { StyleSheet } from "react-native";
import COLORS from "../../const/colors";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  coverPhoto: {
    height: 160,
    width: "100%",
  },
  profileImageContainer: {
    paddingHorizontal: 20,
    marginTop: -40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  profileButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderColor: COLORS.outline,
    borderWidth: 2,
    alignItems: "center",
    overflow: "hidden",
    elevation: 1,
  },
  shelterImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  settingsIcon: {
    marginTop: 50,
  },
  shelterDetails: {
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  shelterInfoContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  shelterName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 20,
    color: COLORS.title,
  },
  iconNotVerified: {
    backgroundColor: COLORS.subtitle,
    color: COLORS.white,
    borderRadius: 50,
  },
  iconVerified: {
    backgroundColor: COLORS.prim,
    color: COLORS.white,
    borderRadius: 50,
  },
  shelterOwnerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 12,
    marginTop: -8,
    color: COLORS.title,
    marginBottom: 5,
  },
  shelterDetailsContainer: {
    flexDirection: "column",
    gap: 5,
    paddingHorizontal: 20,
  },
  iconTextContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  shelterDetailsText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
    color: COLORS.title,
  },
  furbabiesContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 2,
  },
  furbabiesText: {
    fontFamily: "Poppins_500Medium",
    color: COLORS.title,
    fontSize: 18,
  },
  titleButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  choicesButton: {
    backgroundColor: COLORS.prim,
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
    width: 40,
    elevation: 1,
  },
  noResultContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  noResultsText: {
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
    marginTop: 140,
  },
  showPetsContainer: {
    flex: 1,
    paddingTop: 5,
  },
  buttonContainer: {
    padding: 6,
    borderRadius: 20,
  },
  petButton: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 1,
    width: 140,
    height: 180,
  },
  imageContainer: {
    height: 130,
    width: "100%",
    marginBottom: 5,
  },
  petImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    alignItems: "center",
    resizeMode: "cover",
  },
  petDetails: {
    paddingHorizontal: 7,
  },
  petNameGender: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 7,
  },
  petName: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: COLORS.title,
  },
  genderIconContainer: {
    right: 50,
  },
  petGenderIconMale: {
    backgroundColor: COLORS.malegenderbg,
    padding: 2,
    borderRadius: 50,
  },
  petGenderIconFemale: {
    backgroundColor: COLORS.femalegenderbg,
    padding: 2,
    borderRadius: 50,
  },
  petBreedText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 11,
    color: COLORS.title,
    paddingHorizontal: 7,
  },

  // Choices Modal
  modalOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  choicesOptions: {
    width: 185,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    elevation: 5,
    height: 180,
  },
  choicesDropdown: {
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  choicesDropdownText: {
    fontSize: 12,
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },

  // Settings Modal
  settingsModalOverlay: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  dropdownMenu: {
    width: 135,
    backgroundColor: "white",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 5,
    height: 235,
    top: 180,
  },
  dropdownItem: {
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 12,
    color: COLORS.title,
    fontFamily: "Poppins_400Regular",
    textAlign: "right",
  },
});
